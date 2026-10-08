#!/usr/bin/env python3
"""Create a ZIP whose contents can be extracted directly into public_html."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_FILES = ("index.html", "clone.js")
PUBLIC_DIRS = (
    "about-us",
    "program",
    "admission",
    "contact-us",
    "blog",
    "privacy-policy",
    "wp-content",
    "wp-includes",
    "api",
)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", nargs="?", default="/workspace/hostinger-upload.zip")
    args = parser.parse_args()
    subprocess.run([sys.executable, str(ROOT / "scripts/build_site.py"), "--check"], check=True)

    output = Path(args.output).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    paths = [ROOT / name for name in PUBLIC_FILES]
    paths.extend(path for name in PUBLIC_DIRS for path in (ROOT / name).rglob("*") if path.is_file())
    with ZipFile(output, "w", ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(paths):
            if path.is_symlink():
                raise ValueError(f"Symlinks are not allowed in the upload package: {path}")
            archive.write(path, path.relative_to(ROOT).as_posix())
        bad = archive.testzip()
        if bad:
            raise ValueError(f"ZIP integrity check failed at {bad}")
    print(f"Created {output} with {len(paths)} files ({output.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
