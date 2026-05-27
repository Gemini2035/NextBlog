from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.blog import BlogTag
from app.models.dictionary import Dictionary
from app.schemas.blog_tags import BlogTagCreateRequest
from app.services.blog.tag.base.exceptions import BlogTagAlreadyExistsError
from app.services.blog.tag.base.get_tags import get_blog_tags
from app.services.blog.tag.utils.helpers import (
    build_blog_tag_payloads,
    build_blog_tag_payloads_for_keys,
    build_duplicated_request_payloads,
    get_blog_tag_dictionary_key,
    normalize_translations,
)


def upsert_blog_tags(db: Session, payloads: list[BlogTagCreateRequest]) -> list[dict[str, object]]:
    result_tags: list[BlogTag] = []
    normalized_payloads = [
        (get_blog_tag_dictionary_key(payload.key), normalize_translations(payload.translations))
        for payload in payloads
    ]
    seen_keys: set[str] = set()
    duplicated_request_keys: set[str] = set()
    for key, _translations in normalized_payloads:
        if key in seen_keys:
            duplicated_request_keys.add(key)
        seen_keys.add(key)

    if duplicated_request_keys:
        raise BlogTagAlreadyExistsError(
            build_duplicated_request_payloads(list(duplicated_request_keys))
        )

    existing_tags = list(
        db.scalars(
            select(BlogTag).where(
                BlogTag.key.in_([key for key, _translations in normalized_payloads])
            )
        ).all()
    )
    if existing_tags:
        raise BlogTagAlreadyExistsError(build_blog_tag_payloads(db, existing_tags))

    for normalized_key, translations in normalized_payloads:
        tag = BlogTag(key=normalized_key)
        db.add(tag)

        dictionary = db.scalar(select(Dictionary).where(Dictionary.key == normalized_key))
        if dictionary is None:
            dictionary = Dictionary(key=normalized_key, values={})
            db.add(dictionary)
        dictionary.values = translations
        result_tags.append(tag)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        duplicated_tags = build_blog_tag_payloads_for_keys(
            db,
            [key for key, _translations in normalized_payloads],
        )
        raise BlogTagAlreadyExistsError(duplicated_tags) from error

    tag_ids = [tag.id for tag in result_tags]
    return [tag for tag in get_blog_tags(db) if tag["id"] in tag_ids]
