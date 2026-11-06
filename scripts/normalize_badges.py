"""Recadre les badges de rang : contenu centré, même taille dans un carré, fond rond intégré.

- Bronze → Platine : l'art va jusqu'aux bords ; un fondu circulaire est cuit dans l'alpha
  (avant : masque CSS sur l'image seulement, donc le reflet affichait encore un carré).
- Tous : boîte englobante (alpha > 128, union de toutes les images pour les WebP animés),
  centrée dans un carré, côté = plus grande dimension × MARGE.
Usage : python scripts/normalize_badges.py public/ranks
"""
import sys, glob, os
from PIL import Image, ImageDraw, ImageFilter

RADIAL = ('bronze', 'argent', 'or', 'platine')
MARGE = 1.04


def frames(path):
    im = Image.open(path)
    out, durs = [], []
    for i in range(getattr(im, 'n_frames', 1)):
        im.seek(i)
        out.append(im.convert('RGBA'))
        durs.append(im.info.get('duration', 40))
    return out, durs


def radial(size):
    w, h = size
    r = min(w, h) / 2
    m = Image.new('L', size, 0)
    d = ImageDraw.Draw(m)
    # opaque jusqu'à 62 % du rayon, fondu jusqu'à 72 % : retire les rayons orange autour de l'emblème
    steps = 40
    for s in range(steps, -1, -1):
        t = s / steps
        rr = r * (0.62 + 0.10 * t)
        v = int(255 * (1 - t))
        d.ellipse((w / 2 - rr, h / 2 - rr, w / 2 + rr, h / 2 + rr), fill=v)
    return m.filter(ImageFilter.GaussianBlur(r * 0.01))


def process(path, rk):
    fr, durs = frames(path)
    W, H = fr[0].size
    if rk in RADIAL:
        m = radial((W, H))
        for f in fr:
            a = Image.composite(f.split()[3], Image.new('L', f.size, 0), m)
            f.putalpha(a)
    box = None
    # animé : boîte de la 1re image seulement (des particules couvrent tout le carré dans d'autres images)
    for f in fr[:1]:
        b = f.split()[3].point(lambda v: 255 if v > 128 else 0).getbbox()
        if b:
            box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    bw, bh = box[2] - box[0], box[3] - box[1]
    side = int(max(bw, bh) * MARGE)
    cx, cy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
    target = max(W, H)  # taille de sortie : on garde la résolution d'origine
    out = []
    for f in fr:
        sq = Image.new('RGBA', (side, side), (0, 0, 0, 0))
        sq.paste(f, (int(round(side / 2 - cx)), int(round(side / 2 - cy))), f)
        out.append(sq.resize((target, target), Image.LANCZOS))
    if len(out) > 1:
        out[0].save(path, save_all=True, append_images=out[1:], duration=durs, loop=0, quality=82, method=4, lossless=False)
    else:
        out[0].save(path, quality=90, method=4)
    return box, side


if __name__ == '__main__':
    d = sys.argv[1]
    for p in sorted(glob.glob(os.path.join(d, 'badge-*.webp'))):
        rk = os.path.basename(p)[6:].split('-')[0].split('.')[0]
        print(os.path.basename(p), process(p, rk))
