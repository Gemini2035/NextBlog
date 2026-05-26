from html.parser import HTMLParser

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.integrations.llm import OpenAIClient
from app.models.blog import BLOG_POST_EMBEDDING_SOURCE_TYPE, BlogPost
from app.models.embedding import Embedding


class _HTMLTextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        normalized = data.strip()
        if normalized:
            self.parts.append(normalized)

    def get_text(self) -> str:
        return " ".join(self.parts)


def extract_html_text(html: str) -> str:
    parser = _HTMLTextExtractor()
    parser.feed(html)
    return parser.get_text()


def get_blog_post_embedding_text(post: BlogPost) -> str:
    tags = ", ".join(tag.display_name or tag.name for tag in post.tags)
    content_text = extract_html_text(post.content)

    return "\n".join(
        [
            f"Title: {post.title}",
            f"Description: {post.description or ''}",
            f"Tags: {tags}",
            "Content:",
            content_text,
        ]
    )


def upsert_blog_post_embedding(
    db: Session,
    post: BlogPost,
    llm_client: OpenAIClient,
) -> bool:
    embedding_text = get_blog_post_embedding_text(post)
    existing_embedding = db.scalar(
        select(Embedding).where(
            Embedding.source_type == BLOG_POST_EMBEDDING_SOURCE_TYPE,
            Embedding.source_id == str(post.id),
            Embedding.embedding_model == llm_client.embedding_model,
        )
    )

    if existing_embedding and existing_embedding.embedding_text == embedding_text:
        return False

    embedding = existing_embedding or Embedding(
        source_type=BLOG_POST_EMBEDDING_SOURCE_TYPE,
        source_id=str(post.id),
        embedding_model=llm_client.embedding_model,
    )
    embedding.embedding = llm_client.get_context_embedding(embedding_text)
    embedding.embedding_text = embedding_text
    db.add(embedding)
    return True
