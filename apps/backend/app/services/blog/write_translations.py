from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.site_language import SiteLanguage
from app.schemas.blog import BlogPostTranslationOption, BlogPostWriteRequest
from app.services.blog.create_blog_post import create_blog_post
from app.services.blog.public_ids import decode_blog_post_id, encode_blog_post_id
from app.services.blog.update_blog_post import update_blog_post


class InvalidBlogPostLanguageError(RuntimeError):
    def __init__(self, language: str) -> None:
        self.language = language
        super().__init__(f"Invalid blog post language: {language}")


class InvalidTranslationPostIdError(RuntimeError):
    def __init__(self, post_id: str) -> None:
        self.post_id = post_id
        super().__init__(f"Invalid translation post id: {post_id}")


class MissingTranslationContentError(RuntimeError):
    pass


def get_language_id_by_code(db: Session, language: str) -> int:
    normalized_language = language.strip()
    language_id = db.scalar(
        select(SiteLanguage.id).where(SiteLanguage.code == normalized_language)
    )
    if language_id is None:
        raise InvalidBlogPostLanguageError(normalized_language)
    return language_id


def apply_options_language(db: Session, payload: BlogPostWriteRequest) -> None:
    if payload.options is None or payload.options.language is None:
        return

    payload.basic_info.language_id = get_language_id_by_code(db, payload.options.language)


def write_blog_post_translations(
    db: Session,
    payload: BlogPostWriteRequest,
) -> tuple[list[BlogPostTranslationOption], bool]:
    if payload.options is None:
        return [], False

    results: list[BlogPostTranslationOption] = []
    embedding_updated = False

    for translation in payload.options.translations:
        language_id = get_language_id_by_code(db, translation.language)
        basic_info = payload.basic_info.model_copy(deep=True)
        basic_info.language_id = language_id

        translation_payload = BlogPostWriteRequest(
            content=payload.content,
            basic_info=basic_info,
            options=None,
        )

        if translation.post_id:
            try:
                internal_post_id = decode_blog_post_id(translation.post_id)
            except ValueError as error:
                raise InvalidTranslationPostIdError(translation.post_id) from error

            result = update_blog_post(db, internal_post_id, translation_payload)
            if result is None:
                raise InvalidTranslationPostIdError(translation.post_id)

            _, translation_embedding_updated = result
            results.append(translation)
        else:
            if translation_payload.content is None:
                raise MissingTranslationContentError("Content is required to create translation")

            try:
                create_payload = translation_payload.to_create_request()
            except (ValueError, ValidationError) as error:
                raise MissingTranslationContentError(
                    "Content and title are required to create translation"
                ) from error
            post, translation_embedding_updated = create_blog_post(db, create_payload)
            results.append(
                BlogPostTranslationOption(
                    language=translation.language,
                    post_id=encode_blog_post_id(post.id),
                )
            )

        embedding_updated = embedding_updated or translation_embedding_updated

    return results, embedding_updated
