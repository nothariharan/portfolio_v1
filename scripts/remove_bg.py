"""Remove the flat near-white background from a sprite while preserving
interior white/gray regions (shirt stripes, laptop, cup, glasses).

Strategy: flood-fill from the image borders and only clear pixels that are
(a) near-white/low-saturation AND (b) connected to the border. Interior
whites are never touched because they aren't reachable from the edge.
A light edge feather removes the leftover white fringe.
"""

import sys
from collections import deque
import numpy as np
from PIL import Image


def remove_bg(path: str, min_bright: int = 205, max_sat: int = 24, feather: int = 1):
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(np.int16)

    bright = rgb.min(axis=2) >= min_bright
    sat = (rgb.max(axis=2) - rgb.min(axis=2)) <= max_sat
    candidate = bright & sat  # background-like pixels (near white / light gray)

    # BFS flood fill from every border pixel that is a candidate
    bg = np.zeros((h, w), dtype=bool)
    dq = deque()

    def seed(y, x):
        if candidate[y, x] and not bg[y, x]:
            bg[y, x] = True
            dq.append((y, x))

    for x in range(w):
        seed(0, x)
        seed(h - 1, x)
    for y in range(h):
        seed(y, 0)
        seed(y, w - 1)

    while dq:
        y, x = dq.popleft()
        if y > 0:
            seed(y - 1, x)
        if y < h - 1:
            seed(y + 1, x)
        if x > 0:
            seed(y, x - 1)
        if x < w - 1:
            seed(y, x + 1)

    alpha = arr[:, :, 3].copy()
    alpha[bg] = 0

    # Feather: soften the ring of kept pixels touching the background so we
    # don't leave a hard white halo around the outline.
    if feather > 0:
        kept = ~bg
        for _ in range(feather):
            # neighbours-of-background among kept pixels
            edge = np.zeros((h, w), dtype=bool)
            edge[1:, :] |= bg[:-1, :]
            edge[:-1, :] |= bg[1:, :]
            edge[:, 1:] |= bg[:, :-1]
            edge[:, :-1] |= bg[:, 1:]
            ring = edge & kept
            # only feather light-ish ring pixels (anti-aliased white fringe)
            light_ring = ring & (rgb.min(axis=2) >= 180)
            alpha[light_ring] = (alpha[light_ring] * 0.4).astype(np.uint8)

    arr[:, :, 3] = alpha
    out = Image.fromarray(arr, "RGBA")

    # report tight bounding box of remaining content
    ys, xs = np.where(arr[:, :, 3] > 8)
    bbox = (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())) if len(xs) else None
    cleared = int(bg.sum())
    out.save(path)
    print(f"{path}: {w}x{h} | cleared {cleared} px ({cleared / (w*h):.0%}) | bbox {bbox}")


if __name__ == "__main__":
    for p in sys.argv[1:]:
        remove_bg(p)
