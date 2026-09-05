"""Build a network-free preview. Fixtures are never used for deployment."""
import importlib.util
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("build_data", ROOT / ".github/scripts/build_data.py")
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


def generate(out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    for source in (ROOT / "tests/fixtures/data").glob("*.json"):
        shutil.copyfile(source, out_dir / source.name)
    config = builder.yaml.safe_load((ROOT / "portfolio.config.yml").read_text(encoding="utf-8"))
    builder.build_extra_sections(config, out_dir)


if __name__ == "__main__":
    generate(ROOT / "public/data")
