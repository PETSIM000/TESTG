// Rangs classés FIGHT DYNASTY : échelle ELO et affichage de l'art officiel de Max
// (dossier fight-dynasty-assets, importé dans public/ranks/ par scripts/import_rank_assets.sh).
// Règles (rangs.html) : art utilisé tel quel, boîte carrée + object-fit: contain, jamais coupé ;
// fond noir fondu par mix-blend-mode: screen ; animé (mp4) à partir de Diamant ;
// plaques (saison, numéro DYNASTY) et divisions = valeurs du moteur en texte HTML.

export const RANKS = [
  { id: 'bronze', n: 'Bronze', min: 0 },
  { id: 'argent', n: 'Argent', min: 1500 },
  { id: 'or', n: 'Or', min: 3000 },
  { id: 'platine', n: 'Platine', min: 4500 },
  { id: 'diamant', n: 'Diamant', min: 6000 },
  { id: 'maitre', n: 'Maître', min: 7500 },
  { id: 'champion', n: 'Champion', min: 9000 },
  { id: 'dynasty', n: 'DYNASTY', min: 10000 },
];

const ANIMATED_FROM = 4; // Diamant
const VIDEO_MIN_SIZE = 64; // listes longues et petites tailles : image fixe (la .webp sert de repli)
const DIVS = ['III', 'II', 'I'];
const byId = Object.fromEntries(RANKS.map((r, i) => [r.id, { ...r, i }]));

function get(id) {
  const r = byId[id];
  if (!r) throw new Error(`rang inconnu : ${id}`);
  return r;
}

/** Rang et division (III → I) pour un ELO 0 – 10 000. DYNASTY n'a pas de division. */
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

function art(r, kind, size, still) {
  const base = `ranks/${kind}-${r.id}`;
  const animated = r.i >= ANIMATED_FROM && size >= VIDEO_MIN_SIZE && !still && !preferStill();
  return animated
    ? `<video autoplay loop muted playsinline disablepictureinpicture preload="auto" poster="${base}.webp" aria-hidden="true"><source src="${base}-anim.mp4" type="video/mp4"></video>`
    : `<img src="${base}.webp" alt="" loading="lazy" decoding="async">`;
}

/** Badge d'un rang (intemporel). `div` : division III/II/I affichée dessous. `still` : image fixe. */
export function badgeHTML(id, { size = 120, div = '', still = false, engrave = '' } = {}) {
  const r = get(id);
  return (
    `<span class="fd-badge fd-r-${r.id}" style="--s:${size}px" role="img" aria-label="${r.n}${div ? ' ' + div : ''}">` +
    art(r, 'badge', size, still) +
    (div ? `<b class="fd-div">${div}</b>` : '') +
    (engrave ? `<b class="fd-plaque fd-grave">${engrave}</b>` : '') +
    `</span>`
  );
}

/** Cadre de profil : photo ronde dessous (57 %), cadre entier par-dessus, plaques du moteur en bas. */
export function frameHTML({ rank, season = 1, pos, size = 160, photo = '', still = false } = {}) {
  const r = get(rank);
  const tags = r.id === 'dynasty' && pos != null ? [`#${pos}`, `S${season}`] : [`S${season}`];
  return (
    `<span class="fd-frame fd-r-${r.id}" style="--s:${size}px" role="img" aria-label="Cadre ${r.n}">` +
    `<span class="fd-avatar">${photo}</span>` +
    `<span class="fd-cadre">${art(r, 'cadre', size, still)}</span>` +
    `<span class="fd-plaques">${tags.map((t) => `<b class="fd-plaque">${t}</b>`).join('')}</span>` +
    `</span>`
  );
}

/** Collection du profil : badges DYNASTY gagnés en fin de saison (à vie), gravés « #rang — Saison ». */
export function collectionHTML(items = []) {
  if (!items.length) return `<p class="fd-coll-vide">Aucun badge DYNASTY pour l'instant. Termine une saison dans le top 250 mondial pour le garder à vie.</p>`;
  return `<div class="fd-coll">${items.map((x) => badgeHTML('dynasty', { size: 96, still: true, engrave: `#${x.pos} — S${x.season}` })).join('')}</div>`;
}
