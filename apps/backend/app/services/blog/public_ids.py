import base64
import hashlib
import hmac
from typing import Final

from app.core.config import settings


PUBLIC_ID_PREFIX: Final = "p_"
SIGNATURE_SIZE: Final = 6


class InvalidPublicBlogPostIdError(ValueError):
    pass


def _get_secret() -> bytes:
    secret = settings.admin_api_secret or settings.project_name
    return secret.encode("utf-8")


def encode_blog_post_id(post_id: int) -> str:
    id_bytes = str(post_id).encode("ascii")
    signature = hmac.new(_get_secret(), id_bytes, hashlib.sha256).digest()[:SIGNATURE_SIZE]
    token = base64.urlsafe_b64encode(id_bytes + signature).decode("ascii").rstrip("=")
    return f"{PUBLIC_ID_PREFIX}{token}"


def decode_blog_post_id(public_id: str) -> int:
    if not public_id.startswith(PUBLIC_ID_PREFIX):
        raise InvalidPublicBlogPostIdError("Invalid blog post id")

    token = public_id[len(PUBLIC_ID_PREFIX) :]
    padding = "=" * (-len(token) % 4)
    try:
        payload = base64.urlsafe_b64decode(f"{token}{padding}".encode("ascii"))
        if len(payload) <= SIGNATURE_SIZE:
            raise ValueError("Invalid blog post id")
        id_bytes = payload[:-SIGNATURE_SIZE]
        signature = payload[-SIGNATURE_SIZE:]
        post_id = int(id_bytes.decode("ascii"))
    except (ValueError, UnicodeDecodeError) as error:
        raise InvalidPublicBlogPostIdError("Invalid blog post id") from error

    expected_signature = hmac.new(_get_secret(), id_bytes, hashlib.sha256).digest()[:SIGNATURE_SIZE]
    if not hmac.compare_digest(signature, expected_signature):
        raise InvalidPublicBlogPostIdError("Invalid blog post id")

    return post_id
