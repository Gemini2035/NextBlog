import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1] / "apps" / "backend"
sys.path.insert(0, str(BACKEND_ROOT))

from app.main import app  # type: ignore # noqa: E402
