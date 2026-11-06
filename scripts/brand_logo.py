"""Cuts Max's FIGHT DYNASTY logo out of its arena background and builds the web + phone versions.

Usage: python scripts/brand_logo.py <logo.jpg> <public dir>
Needs Pillow only. Output:
  brand/logo.webp      transparent logo (splash, menus)
  icons/icon-*.png     square phone icons (logo centred in the maskable safe zone on a dark red stage)
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter


def cut_out(im):
    """Mask = everything the dark background flood cannot reach, minus thin bits (ring ropes, lights)."""
    w, h = im.size
    m = im.convert('L').point(lambda v: 255 if v > 80 else 0)
    for p in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, h - 1), (w // 2, 0), (0, h // 2), (w - 1, h // 2)]:
        if m.getpixel(p) == 0:
            ImageDraw.floodfill(m, p, 128)
    body = m.point(lambda v: 0 if v == 128 else 255)
    body = body.filter(ImageFilter.MinFilter(25)).filter(ImageFilter.MaxFilter(25))  # drop ropes and spotlights
    ImageDraw.floodfill(body, (w // 2, int(h * 0.65)), 200)  # keep only the logo itself
    mask = body.point(lambda v: 255 if v == 200 else 0)
    mask = mask.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(1.2))  # restore the black outline, soft edge
    out = im.copy()
    out.putalpha(mask)
    return out.crop(mask.getbbox())


def stage(size):
    """Dark arena backdrop: red glow from above, black edges."""
    bg = Image.new('RGB', (size, size), (7, 8, 12))
    glow = Image.new('L', (size, size), 0)
    d = ImageDraw.Draw(glow)
    r = int(size * 0.62)
    d.ellipse((size // 2 - r, int(size * 0.38) - r, size // 2 + r, int(size * 0.38) + r), fill=255)
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.18))
    bg.paste(Image.new('RGB', (size, size), (122, 12, 28)), (0, 0), glow)
    return bg


def icon(logo, size, safe=0.86):
    bg = stage(size)
    k = safe * size / max(logo.size)
    lw, lh = int(logo.width * k), int(logo.height * k)
    lg = logo.resize((lw, lh), Image.LANCZOS)
    shadow = Image.new('L', (size, size), 0)
    pos = ((size - lw) // 2, (size - lh) // 2 + int(size * 0.01))
    shadow.paste(lg.getchannel('A'), (pos[0], pos[1] + int(size * 0.02)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(size * 0.025)).point(lambda v: int(v * 0.7))
    bg.paste(Image.new('RGB', (size, size), (0, 0, 0)), (0, 0), shadow)
    bg.paste(lg, pos, lg)
    return bg


def main(src, public):
    public = Path(public)
    (public / 'brand').mkdir(parents=True, exist_ok=True)
    (public / 'icons').mkdir(parents=True, exist_ok=True)
    logo = cut_out(Image.open(src).convert('RGB'))
    logo.resize((600, round(600 * logo.height / logo.width)), Image.LANCZOS).save(public / 'brand' / 'logo.webp', quality=90, method=6)
    for s in (180, 192, 512):
        icon(logo, s).save(public / 'icons' / f'icon-{s}.png', optimize=True)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
