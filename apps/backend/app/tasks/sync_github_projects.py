import logging

from app.database.session import SessionLocal, get_engine
from app.services.projects.sync_github_projects import sync_github_projects
from app.services.site_settings import GitHubSiteConfigError, get_github_site_config

logger = logging.getLogger(__name__)


def main() -> None:
    with SessionLocal(bind=get_engine()) as db:
        try:
            github_config = get_github_site_config(db)
        except GitHubSiteConfigError as error:
            logger.warning("GitHub project sync skipped: %s", error)
            print(f"GitHub project sync skipped: {error}")
            return

        result = sync_github_projects(
            db,
            username=github_config["username"],
            token=github_config["token"],
            fetch_options=github_config["fetch_options"],
            featured_repos=github_config["featured_repos"],
            exclude_repos=github_config["exclude_repos"],
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
