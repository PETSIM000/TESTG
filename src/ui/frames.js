// Cadres de profil = cosmétiques possédés, que le joueur équipe ou retire (modèle bannières Clash Royale).
// - Inventaire : cadres de fin de saison (rang final) envoyés par le serveur dans `me.frames`,
//   plus le cadre DYNASTY numéroté tant que le joueur est dans le top 250 EN DIRECT (`me.dpos`).
// - Deux emplacements indépendants : cadre équipé sur l'avatar, cadre en vitrine sur la bannière.
// - Rien n'est équipé d'office ; un emplacement qui vise un cadre plus possédé redevient vide.
import { RANKS } from './ranks.js';

const RANK_NAME = Object.fromEntries(RANKS.map((r) => [r.id, r.n]));
const int = (v) => (Number.isInteger(+v) && +v > 0 ? +v : null);

export const frameId = (f) => (f.live ? 'dynasty-live' : `${f.rank}-s${f.season}`);

/** Cadres possédés par le joueur, dans l'ordre reçu, sans doublon. */
export function ownedFrames(me) {
  const out = [];
  const seen = new Set();
  for (const f of Array.isArray(me && me.frames) ? me.frames : []) {
    if (!f || !RANK_NAME[f.rank] || !int(f.season)) continue;
    const x = { rank: f.rank, season: int(f.season), ...(f.rank === 'dynasty' && int(f.pos) ? { pos: int(f.pos) } : {}) };
    if (!seen.has(frameId(x))) { seen.add(frameId(x)); out.push(x); }
  }
  const pos = int(me && me.dpos);
  if (pos && pos <= 250) out.push({ rank: 'dynasty', season: int(me.season) || 1, pos, live: true });
  return out;
}

/** Cadre réellement affiché pour un emplacement choisi (null = aucun cadre). */
export function resolveSlot(me, wanted) {
  if (!wanted) return null;
  return ownedFrames(me).find((f) => frameId(f) === wanted) || null;
}

export function frameLabel(f) {
  return f.rank === 'dynasty' && f.pos ? `DYNASTY #${f.pos} · S${f.season}` : `${RANK_NAME[f.rank]} · S${f.season}`;
}
