"""Soft-edged greyscale masks for scripts/rank_assets.sh (white centre fading to black at the border).

Usage: python scripts/rank_masks.py <out dir>
"""
import math
import sys
from pathlib import Path
from PIL import Image


def mask(w, h, inner):
    """Ellipse filling the box; fully white inside `inner` (fraction of the radius), black at the edge."""
    im = Image.new('L', (w, h))
    px = im.load()
    for y in range(h):
        for x in range(w):
            d = math.hypot((x + 0.5 - w / 2) / (w / 2), (y + 0.5 - h / 2) / (h / 2))
            t = min(1.0, max(0.0, (1.0 - d) / (1.0 - inner)))
            px[x, y] = round(255 * t * t * (3 - 2 * t))  # smoothstep
    return im.convert('RGB')


if __name__ == '__main__':
    out = Path(sys.argv[1])
    mask(280, 334, 0.82).save(out / 'badge-280x334.png')
    mask(300, 300, 0.84).save(out / 'round-300.png')
    mask(320, 320, 0.88).save(out / 'round-320.png')
