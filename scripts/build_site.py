#!/usr/bin/env python3
"""Rebuild the deployable pages from their per-page HTML sections."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "pages"
PAGES = {
    "home": "index.html",
    "about-us": "about-us/index.html",
    "program": "program/index.html",
    "admission": "admission/index.html",
    "contact-us": "contact-us/index.html",
    "blog": "blog/index.html",
    "privacy-policy": "privacy-policy/index.html",
}
INCLUDE = re.compile(r"<!-- @include ([^<>]+) -->")


def expand(path: Path, active: set[Path] | None = None) -> str:
    path = path.resolve()
    if not path.is_relative_to(SOURCE):
        raise ValueError(f"Include escapes source tree: {path}")
    active = set() if active is None else active
    if path in active:
        raise ValueError(f"Circular include: {path}")
    active.add(path)
    contents = path.read_text(encoding="utf-8")
    result = INCLUDE.sub(lambda match: expand(path.parent / match.group(1), active), contents)
    active.remove(path)
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check generated pages without writing")
    args = parser.parse_args()
    for name, destination in PAGES.items():
        output = expand(SOURCE / name / "template.html")
        target = ROOT / destination
        if args.check:
            if not target.exists() or target.read_text(encoding="utf-8") != output:
                raise SystemExit(f"Out of date: {destination}. Run scripts/build_site.py")
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(output, encoding="utf-8")
        print(f"{'Checked' if args.check else 'Built'} {destination}")


if __name__ == "__main__":
    main()
