#!/usr/bin/env python3
"""
tazbe-chicken_inject.py
========================
Reusable script for the *Tazbe Chicken* restaurant website.

It does two independent, idempotent jobs on the menu HTML:

  (A) IMAGE INJECTION
      Find every menu placeholder:
          <div class="menu-img-placeholder" ...>[ Image: LABEL ]</div>
      and, when a matching photo exists in --images-dir, replace the whole
      placeholder <div> with an <img> tag:
          <img src="images/<file>" alt="LABEL"
               style="width:100%;height:200px;object-fit:cover;border-radius:12px;">

      A photo "matches" a LABEL when its filename stem equals the slugified
      LABEL (e.g. "Shrimp Broast (10 pcs)" -> "shrimp-broast-10-pcs"), or when
      an explicit mapping is supplied with --image-map.  Any image extension
      (.jpg/.jpeg/.png/.webp) is accepted.

  (B) MENU RENAME
      Rename the 6 primary menu cards.  Each old name is replaced BOTH in the
      visible <h3 ... data-i18n="KEY">OLD</h3> text AND in the bilingual
      TRANSLATIONS dict entry `KEY: { en: "OLD", ar: "..." }`.

The script is safe to re-run: it only changes things that still match the
old value, so a second run is a no-op.

USAGE
-----
  # Defaults (the 6 Tazbe renames + auto slug-image matching):
  python tazbe-chicken_inject.py \
      --source "Downloads/broastys (1).html" \
      --output tazbe-chicken/index.html \
      --images-dir "Downloads/broastys-images"

  # Preview what would change WITHOUT writing any file:
  python tazbe-chicken_inject.py ... --dry-run

  # Fully custom rename + explicit image filenames:
  python tazbe-chicken_inject.py ... \
      --rename-map my_renames.json \
      --image-map   my_images.json

  # Copy matched photos into <output>/images so the site is self-contained:
  python tazbe-chicken_inject.py ... --copy-images

JSON shapes:
  rename-map: {"Broasted Chicken": "Broast Meal", ...}          (OLD -> NEW)
  image-map : {"Broasted Chicken": "broasted-chicken.jpg", ...} (LABEL -> file)

Nothing is written unless --dry-run is omitted.  Compile-only check:
  python -m py_compile tazbe-chicken_inject.py
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
from typing import Dict

# --------------------------------------------------------------------------- #
# Defaults (the canonical Tazbe Chicken 6-card rename, per brand brief)
# --------------------------------------------------------------------------- #
DEFAULT_RENAME: Dict[str, str] = {
    "Broasted Chicken": "Broast Meal",
    "Chicken Musaab (8 pcs)": "Spicy Wings",
    "Fish Fillet (8 pcs)": "Chicken Sandwich",
    "Shrimp Broast (10 pcs)": "Loaded Fries",
    "Zinger (4 pcs)": "Family Bucket",
    "Grilled Chicken Burger": "Garlic Cheese Dip Combo",
}

PLACEHOLDER_RE = re.compile(
    r'<div class="menu-img-placeholder"[^>]*>\[ Image:\s*(.*?)\s*\]</div>'
)
IMG_TAG = (
    '<img src="{prefix}{file}" alt="{alt}" loading="lazy" decoding="async" '
    'style="width:100%;height:200px;object-fit:cover;border-radius:12px;">'
)
IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif")

# Match `KEY:  { en: "VALUE" ... }`  (single or double quoted, value may contain
# unicode escapes such as \u062f — we keep the surrounding quotes & key intact).
TRANS_EN_RE = re.compile(
    r'(?P<key>[A-Za-z_][A-Za-z0-9_]*)\s*:\s*\{\s*en:\s*'
    r'(?P<q>["\'])(?P<val>.*?)(?P=q)'
)


def slugify(label: str) -> str:
    """'Shrimp Broast (10 pcs)' -> 'shrimp-broast-10-pcs'."""
    s = label.lower()
    s = re.sub(r"[()]", " ", s)          # drop parens, keep inner words
    s = re.sub(r"[^a-z0-9]+", "-", s)    # non-alnum -> hyphen
    return s.strip("-")


def resolve_image(label: str, images_dir: str, image_map: Dict[str, str]) -> str | None:
    """Return the basename of a matching image file, or None."""
    if label in image_map:
        cand = os.path.join(images_dir, image_map[label])
        if os.path.isfile(cand):
            return os.path.basename(cand)
    stem = slugify(label)
    if not stem:
        return None
    for fn in os.listdir(images_dir):
        name, ext = os.path.splitext(fn)
        if ext.lower() in IMAGE_EXTS and name.lower() == stem:
            return fn
    return None


def inject_images(html: str, images_dir: str, prefix: str,
                  image_map: Dict[str, str]) -> tuple[str, list]:
    """Replace placeholders whose photo exists. Returns (html, log)."""
    log: list = []

    def repl(m: re.Match) -> str:
        label = m.group(1).strip()
        hit = resolve_image(label, images_dir, image_map) if images_dir else None
        if hit:
            log.append((label, hit))
            return IMG_TAG.format(prefix=prefix, file=hit, alt=label)
        return m.group(0)  # leave placeholder untouched

    new_html = PLACEHOLDER_RE.sub(repl, html)
    return new_html, log


def rename_menu(html: str, mapping: Dict[str, str]) -> tuple[str, list]:
    """Rename menu titles in both <h3> text and TRANSLATIONS dict.

    Returns (html, log) where log entries are
        (old_name, new_name, h3_count, translations_count).
    """
    log: list = []

    for old, new in mapping.items():
        if not old:
            continue
        old_r = re.escape(old)

        # --- (0) HARVEST the data-i18n keys BEFORE we mutate the h3 text ---
        # Scan the current html for `<h3 ... data-i18n="KEY">OLD</h3>` so we
        # know exactly which TRANSLATIONS entries to update.
        key_scan = re.compile(
            r'<h3[^>]*?data-i18n="([^"]+)"[^>]*?>\s*' + old_r + r'\s*</h3>'
        )
        keys = set(key_scan.findall(html))

        # --- (1) visible <h3 ... data-i18n="KEY">OLD</h3> text ---
        h3_pat = re.compile(
            r'<h3([^>]*?data-i18n="([^"]+)"[^>]*?)>\s*' + old_r + r'\s*</h3>'
        )

        def h3_repl(m: re.Match, _new=new) -> str:
            return f'<h3{m.group(1)}>{_new}</h3>'

        html, h3_n = h3_pat.subn(h3_repl, html)

        # --- (2) TRANSLATIONS dict `KEY: { en: "OLD", ... }` ---
        # Tie the replacement to the key discovered above so we only touch the
        # right entry even if the same string appears elsewhere.
        trans_n = 0
        for key in keys:
            tpat = re.compile(
                re.escape(key) + r'(\s*:\s*\{\s*en:\s*)(["\'])' +
                old_r + r'\2'
            )

            def t_repl(m: re.Match, _new=new) -> str:
                return m.group(1) + m.group(2) + _new + m.group(2)

            t_repl.__defaults__ = (new,)  # keep closure bound to current `new`
            html, cnt = tpat.subn(t_repl, html)
            trans_n += cnt

        log.append((old, new, h3_n, trans_n))
    return html, log


def load_json(path: str | None) -> Dict[str, str]:
    if not path:
        return {}
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return {str(k): str(v) for k, v in data.items()}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(
        description="Inject menu photos + rename Tazbe Chicken menu cards."
    )
    ap.add_argument("--source", required=True,
                    help="Input HTML file (the adapted template).")
    ap.add_argument("--output", required=True,
                    help="Output HTML file to write (unless --dry-run).")
    ap.add_argument("--images-dir", default="",
                    help="Folder containing menu photos (slug-named).")
    ap.add_argument("--images-prefix", default="images/",
                    help='src prefix for injected <img> (default: "images/").')
    ap.add_argument("--rename-map", default="",
                    help="JSON file: {OLD: NEW} menu renames (merged over defaults).")
    ap.add_argument("--image-map", default="",
                    help="JSON file: {LABEL: filename} explicit image mapping.")
    ap.add_argument("--no-default-rename", action="store_true",
                    help="Do not apply the built-in 6-card rename.")
    ap.add_argument("--copy-images", action="store_true",
                    help="Copy matched photos into <output_dir>/<images-prefix>.")
    ap.add_argument("--dry-run", action="store_true",
                    help="Print what WOULD change; write nothing.")
    args = ap.parse_args(argv)

    # ---- build rename mapping ----
    mapping = dict(DEFAULT_RENAME) if not args.no_default_rename else {}
    mapping.update(load_json(args.rename_map))  # user overrides win

    image_map = load_json(args.image_map)

    # ---- read source ----
    with open(args.source, encoding="utf-8", errors="replace") as fh:
        html = fh.read()

    # ---- (A) image injection ----
    html, img_log = inject_images(html, args.images_dir, args.images_prefix,
                                  image_map)

    # ---- (B) menu rename ----
    html, rename_log = rename_menu(html, mapping)

    # ---- report ----
    print("=" * 60)
    print("TAZBE CHICKEN — inject + rename summary")
    print("=" * 60)
    print(f"Source : {args.source}")
    print(f"Output : {'<dry-run, not written>' if args.dry_run else args.output}")
    print(f"Images : {args.images_dir or '(none)'}")
    print("-" * 60)
    print("IMAGE INJECTION:")
    if img_log:
        for label, fn in img_log:
            print(f"  [OK]   {label!r} -> images/{fn}")
    else:
        print("  (no matching photos found / none supplied)")
    print("-" * 60)
    print("MENU RENAME:")
    for old, new, h3_n, t_n in rename_log:
        status = "applied" if (h3_n or t_n) else "NOT FOUND"
        print(f"  [{status}] {old!r} -> {new!r}  "
              f"(h3={h3_n}, translations={t_n})")
    print("=" * 60)

    # ---- write ----
    if args.dry_run:
        print("DRY-RUN: no file written.")
        return 0

    out_dir = os.path.dirname(os.path.abspath(args.output))
    os.makedirs(out_dir, exist_ok=True)

    if args.copy_images and args.images_dir:
        dest_dir = os.path.join(out_dir, args.images_prefix.strip("/\\"))
        os.makedirs(dest_dir, exist_ok=True)
        for _label, fn in img_log:
            shutil.copy2(os.path.join(args.images_dir, fn),
                         os.path.join(dest_dir, fn))

    with open(args.output, "w", encoding="utf-8") as fh:
        fh.write(html)
    print(f"WROTE {len(html)} chars -> {args.output}")
    if args.copy_images and img_log:
        print(f"COPIED {len(img_log)} image(s) into {out_dir}/{args.images_prefix}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
