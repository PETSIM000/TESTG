// Rangs classés FIGHT DYNASTY : échelle ELO et affichage de l'art officiel de Max
// (dossier « fight-dynasty-assets V2 », importé dans public/ranks/ par scripts/import_rank_assets.sh).
// Balisage exact de composants.html : .fd-badge > img|video ; .fd-frame > .fd-avatar + .fd-cadre + .fd-plaque.
// Images alpha (fond transparent) ; animé à partir de Diamant = WebP animé transparent (V3, boucle aller-retour) ;
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
const FX_MIN_SIZE = 56; // en dessous (vignettes de liste), pas d'effet
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
const animate = (r, size, still) => r.i >= ANIMATED_FROM && size >= VIDEO_MIN_SIZE && !still && !preferStill();

/** Badge d'un rang (intemporel). `div` : division III/II/I sous le badge. `still` : image fixe. */
export function badgeHTML(id, { size = 120, div = '', still = false, engrave = '' } = {}) {
  const r = get(id);
  const src = animate(r, size, still) ? `ranks/badge-${r.id}-anim.webp` : `ranks/badge-${r.id}${size < VIDEO_MIN_SIZE ? '-sm' : ''}.webp`;
  // Effets permanents (reflet qui balaie le badge, lueur qui respire) à partir de 56 px, pour tous les rangs.
  // Le reflet prend la forme exacte du badge : l'image sert de masque (--img).
  const fx = size >= FX_MIN_SIZE && !still;
  const box = `<div class="fd-badge${fx ? ' fd-fx' : ''}" style="--size:${size}px;--img:url('${src}')" data-rk="${r.id}"><img src="${src}" alt="Badge ${r.n}" decoding="async"></div>`;
  if (!div && !engrave) return box;
  return `<span class="fd-rk">${box}${div ? `<b class="fd-div">${div}</b>` : ''}${engrave ? `<b class="fd-grave">${engrave}</b>` : ''}</span>`;
}

/** Cadre de profil : avatar rond dessous, cadre entier dessus, plaque du moteur. */
export function frameHTML({ rank, season = 1, pos, size = 220, initials = '', photo = '', still = false } = {}) {
  const r = get(rank);
  const avatar = photo
    ? `<img class="fd-avatar" src="${photo}" alt="">`
    : `<span class="fd-avatar fd-ini">${initials}</span>`;
  const cadre = animate(r, size, still)
    ? `<img class="fd-cadre" src="ranks/cadre-${r.id}-anim.webp" alt="Cadre ${r.n}">`
    : `<img class="fd-cadre" src="ranks/cadre-${r.id}.webp" alt="Cadre ${r.n}">`;
  const plaque = r.id === 'dynasty' && pos != null ? `#${pos} · S${season}` : `S${season}`;
  return `<div class="fd-frame" style="--size:${size}px">${avatar}${cadre}<div class="fd-plaque">${plaque}</div></div>`;
}

/** Collection du profil : badges DYNASTY gagnés en fin de saison (à vie), gravés « #rang · Saison ». */
export function collectionHTML(items = []) {
  if (!items.length) return `<p class="fd-coll-vide">Aucun badge DYNASTY pour l'instant. Termine une saison dans le top 250 mondial pour le garder à vie.</p>`;
  return `<div class="fd-coll">${items.map((x) => badgeHTML('dynasty', { size: 96, still: true, engrave: `#${x.pos} · S${x.season}` })).join('')}</div>`;
}
