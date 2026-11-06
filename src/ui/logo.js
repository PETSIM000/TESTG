// Logo FIGHT DYNASTY : l'image officielle de Max (public/brand/, scripts/make-brand-assets.sh).
// Le dessin vectoriel plus bas ne sert que de secours sur canvas tant que l'image n'est pas chargée.

export const LOGO = { full: 'brand/logo.webp' };

/** Balise <img> du logo officiel (détouré, fond transparent). */
export function logoHTML(kind = 'full', cls = '') {
  return `<img class="fd-logo ${cls}" src="${LOGO[kind]}" alt="FIGHT DYNASTY" decoding="async">`;
}

let markImg = null;
if (typeof Image !== 'undefined' && typeof document !== 'undefined') {
  markImg = new Image();
  markImg.src = LOGO.full;
}
/** Tests seulement : remplace l'image chargée. */
export function _setLogoImage(img) { markImg = img; }
/** Promesse résolue quand l'écusson est prêt (pour redessiner les canvas). */
export const logoReady = markImg && markImg.decode ? markImg.decode().catch(() => {}) : Promise.resolve();


const SHIELD = 'M100 30 L166 48 Q170 120 140 158 Q122 180 100 192 Q78 180 60 158 Q30 120 34 48 Z';
const FIELD = 'M100 40 L157 55 Q160 118 133 152 Q117 171 100 181 Q83 171 67 152 Q40 118 43 55 Z';
const CROWN = 'M72 92 L77 64 L90 80 L100 58 L110 80 L123 64 L128 92 Z';
const CROWN_BAND = 'M71 90 L129 90 L127 99 L73 99 Z';
const GLOVE = 'M-13 16 L-14 2 C-19 -10 -13 -25 2 -25 C15 -25 20 -14 18 -2 C17 6 14 12 11 16 Z';
const THUMB = 'M-14 3 C-20 0 -20 -10 -14 -12 C-9 -11 -7 -5 -8 1 Z';
const CREASE = 'M-8 1 C-4 2 -1 -1 0 -6 M3 -19 C8 -14 10 -8 9 -1';
const LEAF = 'M0 0 Q7 -4.2 15 0 Q7 4.2 0 0 Z';
const STAR = (x, y, r) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.42 : r;
    d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `;
  }
  return d + 'Z';
};

// Feuilles de laurier le long de deux arcs, du bas de l'écusson vers les côtés.
function laurels() {
  const leaves = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 11; i++) {
      const t = 0.1 + i * 0.085;
      const a = Math.PI / 2 + side * t * 2.3; // angle autour du centre (100, 112)
      const cx = 100 + Math.cos(a) * 90, cy = 112 + Math.sin(a) * 86;
      const rot = (a * 180) / Math.PI + (side > 0 ? 100 : -100) + (i % 2 ? 18 : -18) * side;
      leaves.push({ cx: +cx.toFixed(1), cy: +cy.toFixed(1), rot: +rot.toFixed(1), k: +(1.6 - i * 0.05).toFixed(2) });
    }
  }
  return leaves;
}

export const CREST = { shield: SHIELD, field: FIELD, crown: CROWN, band: CROWN_BAND, leaves: laurels(), stars: [STAR(64, 74, 6), STAR(136, 74, 6)] };

let uid = 0;

/** Logo SVG. `title` ajoute « FIGHT DYNASTY » au-dessus, `tagline` le ruban du bas. */
export function crestSVG({ title = false, tagline = '', size = 200 } = {}) {
  const k = ++uid, gold = `fdlg${k}`, red = `fdlr${k}`, gl = `fdlgl${k}`;
  const top = title ? 96 : 0, bot = tagline ? 34 : 0;
  const h = 220 + top + bot;
  const leaf = (l) => `<path d="${LEAF}" transform="translate(${l.cx} ${l.cy}) rotate(${l.rot}) scale(${l.k})"/>`;
  const glove = (x, rot) =>
    `<g transform="translate(${x} 132) rotate(${rot}) scale(1.85)"><path d="${GLOVE}" fill="url(#${gl})" stroke="#3a1a02" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<path d="${THUMB}" fill="url(#${gl})" stroke="#3a1a02" stroke-width="1.4" stroke-linejoin="round"/><path d="${CREASE}" fill="none" stroke="rgba(58,26,2,.55)" stroke-width="1.2" stroke-linecap="round"/>` +
    `<path d="M-7 -20 C0 -23 9 -20 13 -12" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.8" stroke-linecap="round"/>` +
    `<rect x="-13" y="14" width="24" height="9" rx="2.5" fill="#f5f6fa" stroke="#3a1a02" stroke-width="1.2"/><rect x="-13" y="17" width="24" height="3" fill="#c8102e"/></g>`;
  const titleSVG = title
    ? `<g font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" text-anchor="middle" fill="url(#${gold})" stroke="#3a1a02" stroke-width="2" paint-order="stroke">` +
      `<text x="100" y="50" font-size="58" letter-spacing="2">FIGHT</text><text x="100" y="98" font-size="52" letter-spacing="1">DYNASTY</text></g>`
    : '';
  const tagSVG = tagline
    ? `<g transform="translate(0 ${top + 214})"><path d="M14 0 L186 0 L180 13 L186 26 L14 26 L20 13 Z" fill="#0b0b10" stroke="url(#${gold})" stroke-width="2.5"/>` +
      `<text x="100" y="18" text-anchor="middle" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="700" font-size="13" letter-spacing="1" fill="#f5f6fa">${tagline}</text></g>`
    : '';
  return (
    `<svg class="fd-crest" viewBox="0 0 200 ${h}" width="${size}" height="${Math.round((size * h) / 200)}" role="img" aria-label="FIGHT DYNASTY">` +
    `<defs><linearGradient id="${gold}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset=".45" stop-color="#f4c542"/><stop offset=".7" stop-color="#a87a08"/><stop offset="1" stop-color="#ffe27a"/></linearGradient>` +
    `<radialGradient id="${red}" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#ff4a5e"/><stop offset=".55" stop-color="#b3101f"/><stop offset="1" stop-color="#4a0610"/></radialGradient>` +
    `<linearGradient id="${gl}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".2" stop-color="#ffe9a8"/><stop offset=".6" stop-color="#f4c542"/><stop offset="1" stop-color="#9c7006"/></linearGradient></defs>` +
    titleSVG +
    `<g transform="translate(0 ${top})">` +
    `<g fill="url(#${gold})" stroke="#3a1a02" stroke-width=".8">${CREST.leaves.map(leaf).join('')}</g>` +
    `<path d="${SHIELD}" fill="url(#${gold})" stroke="#3a1a02" stroke-width="2.5"/>` +
    `<path d="${FIELD}" fill="url(#${red})" stroke="#3a1a02" stroke-width="1.5"/>` +
    `<path d="M58 70 L58 150 M142 70 L142 150" stroke="rgba(255,226,122,.35)" stroke-width="3"/>` +
    CREST.stars.map((d) => `<path d="${d}" fill="url(#${gold})"/>`).join('') +
    glove(102, -18) +
    `<path d="${CROWN}" fill="url(#${gold})" stroke="#3a1a02" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="${CROWN_BAND}" fill="url(#${gold})" stroke="#3a1a02" stroke-width="1.5"/>` +
    `<path d="M40 58 L100 42 L160 58" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2"/>` +
    `</g>` +
    tagSVG +
    `</svg>`
  );
}

/** Dessine l'écusson (sans texte) sur un canvas 2D, centré en (cx, cy), inscrit dans un rayon R. */
export function drawCrest(ctx, cx, cy, R, { flat = false } = {}) {
  if (markImg && markImg.complete && markImg.naturalWidth) {
    ctx.save();
    if (!flat) { ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = R * 0.12; ctx.shadowOffsetY = R * 0.04; }
    const iw = markImg.naturalWidth, ih = markImg.naturalHeight || iw;
    const k = (R * 2) / Math.max(iw, ih);
    ctx.drawImage(markImg, cx - (iw * k) / 2, cy - (ih * k) / 2, iw * k, ih * k);
    ctx.restore();
    return;
  }
  const s = (R * 2) / 220;
  ctx.save();
  ctx.translate(cx - 100 * s, cy - 110 * s);
  ctx.scale(s, s);
  const gold = ctx.createLinearGradient(0, 30, 0, 192);
  gold.addColorStop(0, '#fff6c8'); gold.addColorStop(0.45, '#f4c542'); gold.addColorStop(0.7, '#a87a08'); gold.addColorStop(1, '#ffe27a');
  const red = ctx.createRadialGradient(90, 70, 5, 100, 110, 90);
  red.addColorStop(0, '#ff4a5e'); red.addColorStop(0.55, '#b3101f'); red.addColorStop(1, '#4a0610');
  ctx.strokeStyle = '#3a1a02';
  if (!flat) { ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4; }
  ctx.fillStyle = gold;
  const leafP = new Path2D(LEAF);
  for (const l of CREST.leaves) {
    ctx.save(); ctx.translate(l.cx, l.cy); ctx.rotate((l.rot * Math.PI) / 180); ctx.scale(l.k, l.k);
    ctx.fill(leafP); ctx.restore();
  }
  ctx.lineWidth = 2.5; ctx.fill(new Path2D(SHIELD)); ctx.shadowColor = 'transparent'; ctx.stroke(new Path2D(SHIELD));
  ctx.fillStyle = red; ctx.lineWidth = 1.5; ctx.fill(new Path2D(FIELD)); ctx.stroke(new Path2D(FIELD));
  ctx.fillStyle = gold; for (const d of CREST.stars) ctx.fill(new Path2D(d));
  const gl = ctx.createLinearGradient(-15, -22, 15, 22);
  gl.addColorStop(0, '#fff'); gl.addColorStop(0.2, '#ffe9a8'); gl.addColorStop(0.6, '#f4c542'); gl.addColorStop(1, '#9c7006');
  ctx.save(); ctx.translate(102, 132); ctx.rotate((-18 * Math.PI) / 180); ctx.scale(1.85, 1.85);
  ctx.fillStyle = gl; ctx.lineWidth = 1.4; ctx.fill(new Path2D(GLOVE)); ctx.stroke(new Path2D(GLOVE)); ctx.fill(new Path2D(THUMB)); ctx.stroke(new Path2D(THUMB));
  ctx.strokeStyle = 'rgba(58,26,2,.55)'; ctx.lineWidth = 1.2; ctx.stroke(new Path2D(CREASE)); ctx.strokeStyle = '#3a1a02';
  ctx.fillStyle = '#f5f6fa'; ctx.fillRect(-13, 14, 24, 9); ctx.fillStyle = '#c8102e'; ctx.fillRect(-13, 17, 24, 3);
  ctx.restore();
  ctx.fillStyle = gold; ctx.lineWidth = 1.8; ctx.fill(new Path2D(CROWN)); ctx.stroke(new Path2D(CROWN)); ctx.fill(new Path2D(CROWN_BAND)); ctx.stroke(new Path2D(CROWN_BAND));
  ctx.restore();
}
