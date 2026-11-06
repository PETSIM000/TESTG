// Rangs classés FIGHT DYNASTY : échelle ELO (brief §4) et visuels tirés des vidéos de Max
// (public/ranks/, scripts/rank_assets.sh). Fond noir fondu : fusion « screen » sur l'interface sombre.
// Le badge est intemporel (jamais de saison) ; la saison est sur le cadre.
// Diamant → DYNASTY : clips vidéo en boucle ; en dessous : image fixe.

export const RANKS = [
  { id: 'bronze', n: 'Bronze', min: 0, mid: '#e0a06a' },
  { id: 'argent', n: 'Argent', min: 1500, mid: '#d5dce8' },
  { id: 'or', n: 'Or', min: 3000, mid: '#f5c451' },
  { id: 'platine', n: 'Platine', min: 4500, mid: '#a9e3ee' },
  { id: 'diamant', n: 'Diamant', min: 6000, mid: '#8fd0ff' },
  { id: 'maitre', n: 'Maître', min: 7500, mid: '#c49cff' },
  { id: 'champion', n: 'Champion', min: 9000, mid: '#ffd766' },
  { id: 'dynasty', n: 'DYNASTY', min: 10000, mid: '#ffe27a' },
];

const ANIMATED_FROM = 4; // Diamant
const VIDEO_MIN_SIZE = 64; // en dessous, une image fixe suffit (listes, en-tête)
const DIVS = ['III', 'II', 'I'];
const byId = Object.fromEntries(RANKS.map((r, i) => [r.id, { ...r, i }]));

// Géométrie de chaque art, en fractions du carré du cadre : trou de l'avatar et plaque de saison.
// Bronze → Platine reprennent l'art Champion recoloré, donc sa géométrie.
const CHAMPION_ART = { badgeRatio: 334 / 280, hole: [0.49, 0.555, 0.28], plateY: 0.875 };
const ART = {
  diamant: { badgeRatio: 334 / 280, hole: [0.5, 0.51, 0.29], plateY: 0.855 },
  maitre: { badgeRatio: 334 / 280, hole: [0.53, 0.51, 0.25], plateY: 0.815 },
  champion: CHAMPION_ART,
  dynasty: { badgeRatio: 1, hole: [0.49, 0.53, 0.27], plateY: 0.905, plates2: [0.39, 0.61] },
};
const art = (id) => ART[id] || CHAMPION_ART;

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

// Mouvement réduit ou économie de données : jamais de vidéo.
function preferStill() {
  try {
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    if (typeof navigator !== 'undefined' && navigator.connection && navigator.connection.saveData) return true;
  } catch (e) { /* navigateur ancien : on anime */ }
  return false;
}

function media(r, kind, size, still) {
  const base = `ranks/${r.id}-${kind}`;
  const animated = r.i >= ANIMATED_FROM && size >= VIDEO_MIN_SIZE && !still && !preferStill();
  return animated
    ? `<video class="fd-art" autoplay muted loop playsinline disablepictureinpicture preload="auto" poster="${base}.webp" aria-hidden="true"><source src="${base}.mp4" type="video/mp4"></video>`
    : `<img class="fd-art" src="${base}.webp" alt="" loading="lazy" decoding="async">`;
}

/** Badge d'un rang (intemporel). `div` : plaque III/II/I dessous. `still` : forcer l'image fixe. */
export function badgeHTML(id, { size = 120, div = '', still = false } = {}) {
  const r = get(id);
  const h = Math.round(size * art(r.id).badgeRatio);
  return (
    `<span class="fd-badge fd-r-${r.id}" style="--w:${size}px;--h:${h}px;--c:${r.mid}" role="img" aria-label="${r.n}${div ? ' ' + div : ''}">` +
    media(r, 'badge', size, still) +
    (div ? `<b class="fd-div">${div}</b>` : '') +
    `</span>`
  );
}

/** Cadre de profil : art du rang, avatar dans le trou, saison (et n° mondial DYNASTY) sur le cadre. */
export function frameHTML({ rank, season = 1, pos, size = 132, avatar = '', still = false } = {}) {
  const r = get(rank);
  const a = art(r.id);
  const [cx, cy, rad] = a.hole;
  const dyn = r.id === 'dynasty';
  // L'art porte déjà « S1 » (et « #1 » pour DYNASTY) : on ne redessine que si le texte diffère.
  const bakedOk = season === 1 && (!dyn || pos == null || pos === 1);
  let plates = '';
  if (!bakedOk) {
    const tags = dyn ? [`#${pos ?? 1}`, `S${season}`] : [`S${season}`];
    const xs = dyn ? a.plates2 : [0.5];
    plates = tags.map((t, i) => `<b class="fd-plate" style="left:${xs[i] * 100}%;top:${a.plateY * 100}%">${t}</b>`).join('');
  }
  return (
    `<span class="fd-frame fd-r-${r.id}" style="--w:${size}px;--c:${r.mid}" role="img" aria-label="Cadre ${r.n}">` +
    `<span class="fd-hole" style="left:${(cx - rad) * 100}%;top:${(cy - rad) * 100}%;width:${rad * 200}%;height:${rad * 200}%">${avatar}</span>` +
    media(r, 'frame', size, still) +
    plates +
    `</span>`
  );
}
