from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "NextBlog API"
    api_prefix_restful: str = "/api"
    api_prefix_graphql: str = "/api/graphql"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
