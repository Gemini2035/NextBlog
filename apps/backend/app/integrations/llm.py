import hashlib
import math

import httpx
from pydantic import BaseModel, ValidationError


class LLMClientError(RuntimeError):
    pass


class _EmbeddingResponseItem(BaseModel):
    embedding: list[float]


class _EmbeddingResponse(BaseModel):
    data: list[_EmbeddingResponseItem]


class OpenAIClient:
    def __init__(
        self,
        api_key: str = "",
        base_url: str = "https://api.openai.com/v1",
        embedding_model: str = "mock-context-embedding",
    ) -> None:
        self.embedding_model = embedding_model
        self.client = httpx.Client(
            base_url=base_url,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            timeout=30,
        )

    def close(self) -> None:
        self.client.close()

    def __enter__(self) -> "OpenAIClient":
        return self

    def __exit__(self, *args: object) -> None:
        self.close()

    def get_context_embedding(self, context: str) -> list[float]:
        return get_mock_context_embedding(context)

    def get_api_context_embedding(self, context: str) -> list[float]:
        try:
            response = self.client.post(
                "/embeddings",
                json={
                    "model": self.embedding_model,
                    "input": context,
                },
            )
        except httpx.HTTPError as error:
            raise LLMClientError(f"LLM embedding request failed: {error}") from error

        if response.status_code >= 400:
            raise LLMClientError(
                f"LLM embedding request failed with status {response.status_code}: "
                f"{response.text}"
            )

        try:
            payload = _EmbeddingResponse.model_validate_json(response.text)
        except ValidationError as error:
            raise LLMClientError(f"LLM embedding response was invalid: {error}") from error

        if not payload.data:
            raise LLMClientError("LLM embedding response did not include data")

        return payload.data[0].embedding


def get_mock_context_embedding(context: str, dimensions: int = 1536) -> list[float]:
    seed = hashlib.sha256(context.encode("utf-8")).digest()
    values: list[float] = []

    for index in range(dimensions):
        byte = seed[index % len(seed)]
        angle = (byte + 1) * (index + 1)
        values.append(math.sin(angle) * math.cos(angle / 2))

    magnitude = math.sqrt(sum(value * value for value in values))
    if magnitude == 0:
        return values

    return [value / magnitude for value in values]
