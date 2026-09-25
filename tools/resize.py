#!/usr/bin/env python3
"""
resize.py - Resize product images for web.
Recommended size: 1200px on the longest side, saved as WebP.
Requires Pillow: pip install Pillow

Usage: python tools/resize.py <input_dir> <output_dir>
"""

import sys
from pathlib import Path
try:
    from PIL import Image, ImageOps
except ImportError:
    print("Error: Pillow is not installed. Please run: pip install Pillow")
    sys.exit(1)

MAX_SIZE = 1200


def resize_image(input_path, output_path):
    try:
        with Image.open(input_path) as img:
            # Phone photos are often stored sideways with a rotation tag.
            # This turns them upright so they don't come out rotated.
            img = ImageOps.exif_transpose(img)

            # Transparent areas (cut-out PNGs) would turn black if we just
            # dropped the transparency, so paint them white first.
            has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
            if has_alpha:
                rgba = img.convert("RGBA")
                background = Image.new("RGB", rgba.size, (255, 255, 255))
                background.paste(rgba, mask=rgba.getchannel("A"))
                img = background
            else:
                img = img.convert("RGB")

            # Shrink so the longest side is MAX_SIZE (never enlarges small images)
            img.thumbnail((MAX_SIZE, MAX_SIZE), Image.Resampling.LANCZOS)

            img.save(output_path, "WEBP", quality=85, optimize=True)
            print(f"Resized and saved: {output_path}")
    except Exception as e:
        print(f"Failed to process {input_path}: {e}")


def main():
    if len(sys.argv) < 3:
        print("Usage: python tools/resize.py <input_dir> <output_dir>")
        sys.exit(1)

    input_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])

    if not input_dir.exists():
        print(f"Input directory does not exist: {input_dir}")
        sys.exit(1)

    output_dir.mkdir(parents=True, exist_ok=True)

    valid_exts = {".jpg", ".jpeg", ".png", ".webp"}

    for file_path in sorted(input_dir.glob("*")):
        if file_path.suffix.lower() in valid_exts:
            out_path = output_dir / (file_path.stem + ".webp")
            resize_image(file_path, out_path)


if __name__ == "__main__":
    main()
