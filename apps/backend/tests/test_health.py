from fastapi.testclient import TestClient

from app.api.routes import health
from app.main import app


def test_health_check() -> None:
    client = TestClient(app)

    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_database_health_check_reports_unconfigured_database(monkeypatch) -> None:
    client = TestClient(app)
    monkeypatch.setattr(health.settings, "database_url", None)
    monkeypatch.setattr(health.settings, "next_database_url", None)

    response = client.get("/api/health/db")

    assert response.status_code == 200
    assert response.json() == {
        "status": "error",
        "database": "not_configured",
    }


def test_database_health_check_queries_database(monkeypatch) -> None:
    client = TestClient(app)
    monkeypatch.setattr(health.settings, "database_url", "postgresql+psycopg://health-check")

    class Result:
        def __init__(self, value: str | int) -> None:
            self.value = value

        def scalar_one(self) -> str | int:
            return self.value

    class Connection:
        def __enter__(self) -> "Connection":
            return self

        def __exit__(self, *args: object) -> None:
            return None

        def execute(self, statement: object) -> Result:
            sql = str(statement)
            return Result("nextblog" if "current_database" in sql else 1)

    class Engine:
        def connect(self) -> Connection:
            return Connection()

    monkeypatch.setattr(health, "get_engine", lambda: Engine())

    response = client.get("/api/health/db")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "database": "nextblog",
    }
