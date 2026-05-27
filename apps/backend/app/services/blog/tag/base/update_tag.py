from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.blog import BlogTag
from app.models.dictionary import Dictionary
from app.schemas.blog_tags import BlogTagUpdateRequest
from app.services.blog.tag.base.exceptions import BlogTagAlreadyExistsError
from app.services.blog.tag.base.get_tags import get_blog_tags
from app.services.blog.tag.utils.helpers import (
    build_blog_tag_payloads_for_keys,
    get_blog_tag_dictionary_key,
    normalize_translations,
)


def update_blog_tag(
    db: Session,
    tag_id: int,
    payload: BlogTagUpdateRequest,
) -> dict[str, object] | None:
    tag = db.get(BlogTag, tag_id)
    if tag is None:
        return None

    data = payload.model_dump(exclude_unset=True)
    key = data.pop("key", None)
    translations = data.pop("translations", None)
    old_key = tag.key

    if key is not None:
        tag.key = get_blog_tag_dictionary_key(key)

    dictionary = db.scalar(select(Dictionary).where(Dictionary.key == old_key))
    if dictionary is None:
        dictionary = Dictionary(key=tag.key, values={})
        db.add(dictionary)
    else:
        dictionary.key = tag.key

    if translations is not None:
        dictionary.values = normalize_translations(translations)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        duplicated_tags = build_blog_tag_payloads_for_keys(db, [tag.key])
        raise BlogTagAlreadyExistsError(duplicated_tags) from error

    result = [item for item in get_blog_tags(db) if item["id"] == tag_id]
    return result[0] if result else None
