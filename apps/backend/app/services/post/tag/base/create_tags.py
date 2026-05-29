from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.post import PostTag
from app.models.dictionary import Dictionary
from app.schemas.post_tags import PostTagCreateRequest
from app.services.post.tag.base.exceptions import PostTagAlreadyExistsError
from app.services.post.tag.base.get_tags import get_post_tags
from app.services.post.tag.utils.helpers import (
    build_post_tag_payloads,
    build_post_tag_payloads_for_keys,
    build_duplicated_request_payloads,
    get_post_tag_dictionary_key,
    normalize_translations,
)


def upsert_post_tags(db: Session, payloads: list[PostTagCreateRequest]) -> list[dict[str, object]]:
    result_tags: list[PostTag] = []
    normalized_payloads = [
        (get_post_tag_dictionary_key(payload.key), normalize_translations(payload.translations))
        for payload in payloads
    ]
    seen_keys: set[str] = set()
    duplicated_request_keys: set[str] = set()
    for key, _translations in normalized_payloads:
        if key in seen_keys:
            duplicated_request_keys.add(key)
        seen_keys.add(key)

    if duplicated_request_keys:
        raise PostTagAlreadyExistsError(
            build_duplicated_request_payloads(list(duplicated_request_keys))
        )

    existing_tags = list(
        db.scalars(
            select(PostTag).where(
                PostTag.key.in_([key for key, _translations in normalized_payloads])
            )
        ).all()
    )
    if existing_tags:
        raise PostTagAlreadyExistsError(build_post_tag_payloads(db, existing_tags))

    for normalized_key, translations in normalized_payloads:
        dictionary = db.scalar(select(Dictionary).where(Dictionary.key == normalized_key))
        if dictionary is None:
            dictionary = Dictionary(key=normalized_key, values={})
            db.add(dictionary)
            db.flush()
        dictionary.values = translations

        tag = PostTag(key=normalized_key, dictionary_id=dictionary.id)
        db.add(tag)
        result_tags.append(tag)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        duplicated_tags = build_post_tag_payloads_for_keys(
            db,
            [key for key, _translations in normalized_payloads],
        )
        raise PostTagAlreadyExistsError(duplicated_tags) from error

    tag_ids = [tag.id for tag in result_tags]
    return [tag for tag in get_post_tags(db) if tag["id"] in tag_ids]
