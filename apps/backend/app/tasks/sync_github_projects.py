from app.core.config import settings
from app.database.session import SessionLocal, get_engine
from app.services.projects.sync_github_projects import sync_github_projects


def main() -> None:
    with SessionLocal(bind=get_engine()) as db:
        result = sync_github_projects(
            db,
            username=settings.github_username,
            token=settings.github_token,
        )
        print(
            "GitHub project sync completed: "
            f"{result['synced']} synced, {result['skipped']} skipped"
        )
        if result["warnings"]:
            print("Warnings:")
            for warning in result["warnings"]:
                print(f"- {warning}")


if __name__ == "__main__":
    main()
