from pydantic_settings import BaseSettings, SettingsConfigDict


def normalize_database_url(url: str | None) -> str | None:
    if not url:
        return None

    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg://", 1)

    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)

    return url


class Settings(BaseSettings):
    project_name: str = "NextBlog API"
    api_prefix_restful: str = "/api"

    database_url: str | None = None
    database_url_unpooled: str | None = None
    next_database_url: str | None = None
    next_database_url_unpooled: str | None = None

    admin_api_secret: str | None = None

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local", ".env.development.local"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def sqlalchemy_database_url(self) -> str | None:
        return normalize_database_url(self.database_url or self.next_database_url)

    @property
    def sqlalchemy_migration_database_url(self) -> str | None:
        return normalize_database_url(
            self.database_url_unpooled
            or self.next_database_url_unpooled
            or self.database_url
            or self.next_database_url
        )


settings = Settings()
