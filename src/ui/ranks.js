// Rangs classés FIGHT DYNASTY : échelle ELO (brief §4) et visuels SVG (charte §3-4).
// Le badge est intemporel (jamais de saison) ; la saison est gravée sur le cadre.

export const RANKS = [
  { id: 'bronze', n: 'Bronze', min: 0, hi: '#f0c49a', mid: '#c98a5a', lo: '#7a4a28' },
  { id: 'argent', n: 'Argent', min: 1500, hi: '#ffffff', mid: '#c9d2e0', lo: '#8f9bb0' },
  { id: 'or', n: 'Or', min: 3000, hi: '#fff1b8', mid: '#f5c451', lo: '#a8760a' },
  { id: 'platine', n: 'Platine', min: 4500, hi: '#e8fbff', mid: '#9ad8e6', lo: '#5fa9bd' },
  { id: 'diamant', n: 'Diamant', min: 6000, hi: '#e6f4ff', mid: '#8fb8ff', lo: '#4f80ff', fx: '#9fd2ff' },
  { id: 'maitre', n: 'Maître', min: 7500, hi: '#efe3ff', mid: '#b48cff', lo: '#8a5cf5', fx: '#b48cff' },
  { id: 'champion', n: 'Champion', min: 9000, hi: '#fff6c8', mid: '#f5c451', lo: '#b8860b', fx: '#ffe27a' },
  { id: 'dynasty', n: 'DYNASTY', min: 10000, hi: '#fff1b8', mid: '#f5c451', lo: '#8a6206', fx: '#c8102e' },
];

const ANIMATED_FROM = 4; // Diamant
const DIVS = ['III', 'II', 'I'];
const byId = Object.fromEntries(RANKS.map((r, i) => [r.id, { ...r, i }]));

function get(id) {
  const r = byId[id];
  if (!r) throw new Error(`rang inconnu : ${id}`);
  return r;
}

/** Rang et division (III → I) pour un ELO. DYNASTY n'a pas de division. */
export function rankFromElo(elo) {
  const e = Number.isFinite(elo) ? Math.max(0, elo) : 0;
  let i = 0;
  while (i + 1 < RANKS.length && e >= RANKS[i + 1].min) i++;
  const r = RANKS[i];
  if (r.id === 'dynasty') return { id: r.id, n: r.n, div: '' };
  const span = RANKS[i + 1].min - r.min;
  const d = Math.min(2, Math.floor(((e - r.min) / span) * 3));
  return { id: r.id, n: r.n, div: DIVS[d] };
}

let uid = 0;
const nid = (p) => `fd${p}${++uid}`;

function metal(id, r, dark = false) {
  return dark
    ? `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a33"/><stop offset=".55" stop-color="#0b0b10"/><stop offset="1" stop-color="#000"/></linearGradient>`
    : `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${r.hi}"/><stop offset=".5" stop-color="${r.mid}"/><stop offset="1" stop-color="${r.lo}"/></linearGradient>`;
}

const SHIELD = 'M60 6 L108 20 Q110 74 92 102 Q78 124 60 134 Q42 124 28 102 Q10 74 12 20 Z';
const SHIELD_IN = 'M60 15 L100 27 Q101 74 85 98 Q73 116 60 124 Q47 116 35 98 Q19 74 20 27 Z';

// Gant de boxe stylisé (profil), centré sur l'origine, poing vers le haut.
const GLOVE = 'M-12 15 L-12 4 C-16 -4 -15 -18 -4 -21 C8 -24 16 -16 15 -4 C14 4 12 10 10 15 Z';
const THUMB = 'M-12 7 C-18 5 -19 -6 -12 -8 C-8 -7 -7 -2 -8 4 Z';
const SHINE = 'M-6 -16 C0 -19 8 -17 11 -10';

function gloves(fill, stroke) {
  const g = (x, rot) =>
    `<g transform="translate(${x} 60) rotate(${rot}) scale(1.08)">` +
    `<path d="${GLOVE}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>` +
    `<path d="${THUMB}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>` +
    `<path d="${SHINE}" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2.2" stroke-linecap="round"/>` +
    `<rect x="-13" y="14" width="24" height="10" rx="3" fill="#f5f6fa" stroke="${stroke}" stroke-width="1.8"/>` +
    `<rect x="-13" y="17.5" width="24" height="3" fill="#c8102e"/></g>`;
  return g(46, -24) + g(74, 24);
}

function belt(plate, strap) {
  return (
    `<path d="M24 96 Q60 104 96 96 L94 108 Q60 116 26 108 Z" fill="${strap}" stroke="rgba(0,0,0,.55)" stroke-width="1.5"/>` +
    `<rect x="46" y="94" width="28" height="20" rx="5" fill="url(#${plate})" stroke="rgba(0,0,0,.6)" stroke-width="1.5"/>` +
    `<path d="M60 98 l2.6 4.4 4.4 .5 -3.4 3 .9 4.4 -4.5-2.3 -4.5 2.3 .9-4.4 -3.4-3 4.4-.5z" fill="rgba(0,0,0,.45)"/>`
  );
}

function ornaments(r, fx) {
  switch (r.id) {
    case 'diamant':
      return `<g class="fd-anim fd-sparkle" fill="${r.fx}">` +
        `<path d="M22 22 l2 6 6 2 -6 2 -2 6 -2-6 -6-2 6-2z"/><path d="M98 40 l1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5-4.5 -4.5-1.5 4.5-1.5z"/>` +
        `<path d="M86 112 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5-4 -4-1.5 4-1.5z"/></g>`;
    case 'maitre':
      return `<g class="fd-anim fd-wings" fill="url(#${fx})" opacity=".95">` +
        `<path d="M14 40 C-4 44 -6 70 6 84 C8 70 12 62 20 58 Z"/><path d="M106 40 C124 44 126 70 114 84 C112 70 108 62 100 58 Z"/></g>` +
        `<g class="fd-anim fd-flame" fill="${r.fx}" opacity=".85"><path d="M60 2 C52 -8 56 -16 60 -22 C64 -16 68 -8 60 2 Z" transform="translate(0 8)"/></g>`;
    case 'champion':
      return `<circle class="fd-anim fd-halo" cx="60" cy="70" r="66" fill="none" stroke="${r.fx}" stroke-width="3" stroke-dasharray="6 10" opacity=".8"/>`;
    case 'dynasty':
      return `<path class="fd-anim fd-energy" d="${SHIELD}" fill="none" stroke="${r.fx}" stroke-width="3" stroke-dasharray="40 300" stroke-linecap="round"/>` +
        `<path d="M40 2 L46 -10 L53 0 L60 -14 L67 0 L74 -10 L80 2 Z" transform="translate(0 8)" fill="url(#${fx})" stroke="#3a2a02" stroke-width="1.5"/>`;
    default:
      return '';
  }
}

/** Badge SVG d'un rang (intemporel). `div` optionnel : plaque III/II/I sous le badge. */
export function badgeSVG(id, { size = 120, div = '' } = {}) {
  const r = get(id);
  const m = nid('m'), g = nid('g'), fx = nid('f');
  const dyn = r.id === 'dynasty';
  const animated = r.i >= ANIMATED_FROM;
  const rim = dyn ? 'url(#' + g + ')' : 'url(#' + m + ')';
  const h = Math.round(size * (div ? 1.36 : 1.17));
  return (
    `<svg class="fd-badge fd-r-${r.id}${animated ? ' fd-animated' : ''}" viewBox="-10 -14 140 ${div ? 178 : 154}" width="${size}" height="${h}" role="img" aria-label="${r.n}${div ? ' ' + div : ''}">` +
    `<defs>${metal(m, r, dyn)}${metal(g, byId.or)}${metal(fx, r)}</defs>` +
    ornaments(r, fx) +
    `<path d="${SHIELD}" fill="${rim}" stroke="rgba(0,0,0,.65)" stroke-width="2"/>` +
    `<path d="${SHIELD_IN}" fill="${dyn ? '#0b0b10' : 'rgba(10,12,18,.82)'}" stroke="${dyn ? r.mid : 'rgba(255,255,255,.35)'}" stroke-width="1.5"/>` +
    `<path d="M24 30 L60 19 L96 30 Q96 40 94 46 Q60 34 26 46 Q24 40 24 30 Z" fill="rgba(255,255,255,.10)"/>` +
    gloves(`url(#${dyn ? g : m})`, dyn ? '#3a2a02' : 'rgba(0,0,0,.6)') +
    belt(dyn ? g : m, dyn ? '#c8102e' : '#1a1d26') +
    (div
      ? `<g transform="translate(60 150)"><rect x="-22" y="-11" width="44" height="22" rx="6" fill="#0b0d14" stroke="url(#${m})" stroke-width="2"/>` +
        `<text y="6" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="16" fill="${r.mid}">${div}</text></g>`
      : '') +
    `</svg>`
  );
}

/** Cadre de profil autour d'un avatar : couleur du rang, saison gravée, et numéro mondial pour DYNASTY. */
export function frameSVG({ rank, season, pos, size = 132 } = {}) {
  const r = get(rank);
  const m = nid('m'), g = nid('g');
  const dyn = r.id === 'dynasty';
  const animated = r.i >= ANIMATED_FROM;
  const plate = (x, txt, w = 34) =>
    `<g transform="translate(${x} 122)"><rect x="${-w / 2}" y="-10" width="${w}" height="20" rx="5" fill="${dyn ? '#0b0b10' : '#0f121a'}" stroke="url(#${dyn ? g : m})" stroke-width="2"/>` +
    `<text y="5" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" font-weight="900" font-size="13" fill="${dyn ? '#f5c451' : r.mid}">${txt}</text></g>`;
  const plates = [];
  if (season != null) plates.push('S' + season);
  if (dyn && pos != null) plates.unshift('#' + pos);
  const xs = plates.length === 2 ? [46, 86] : [66];
  return (
    `<svg class="fd-frame fd-r-${r.id}${animated ? ' fd-animated' : ''}" viewBox="0 0 132 136" width="${size}" height="${Math.round((size * 136) / 132)}" role="img" aria-label="Cadre ${r.n}">` +
    `<defs>${metal(m, r, dyn)}${metal(g, byId.or)}</defs>` +
    (r.fx ? `<circle class="fd-anim fd-glow" cx="66" cy="62" r="60" fill="none" stroke="${r.fx}" stroke-width="4" opacity=".55"/>` : '') +
    `<circle cx="66" cy="62" r="56" fill="none" stroke="url(#${m})" stroke-width="10"/>` +
    (dyn
      ? `<circle cx="66" cy="62" r="56" fill="none" stroke="url(#${g})" stroke-width="3"/>` +
        `<circle class="fd-anim fd-energy" cx="66" cy="62" r="56" fill="none" stroke="#c8102e" stroke-width="3" stroke-dasharray="30 322" stroke-linecap="round"/>`
      : '') +
    `<circle cx="66" cy="62" r="50.5" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/>` +
    plates.map((p, i) => plate(xs[i], p)).join('') +
    `</svg>`
  );
}
