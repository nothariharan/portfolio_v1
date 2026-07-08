"""Tightly crop transparent margins from the new bgless sprites and write
them into the filenames the app already references."""
from PIL import Image

JOBS = [
    ("public/sprites/hari_stand_bgless.png", "public/sprites/hari_stand.png"),
    ("public/sprites/hari_sit_bgless.png", "public/sprites/hari_sit.png"),
]

PAD = 8  # small breathing room around the figure (px)

for src, dst in JOBS:
    im = Image.open(src).convert("RGBA")
    alpha = im.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        print(f"{src}: no content, skipped")
        continue
    l, t, r, b = bbox
    l = max(0, l - PAD)
    t = max(0, t - PAD)
    r = min(im.width, r + PAD)
    b = min(im.height, b + PAD)
    cropped = im.crop((l, t, r, b))
    cropped.save(dst)
    print(f"{src} {im.size} -> {dst} {cropped.size}")
