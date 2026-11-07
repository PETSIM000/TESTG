// Campagne / carrière FIGHT DYNASTY : logique pure (sans interface, testable).
// Le joueur est un MANAGER : héritage, ères du monde, chapitre de saison, rivaux qui s'adaptent.
// Branché dans legacy.js (nextWeek, newYear, newFight, drawOf, écran Écurie).

/** Ères : le style dominant change tous les 2 ans. Le style à la mode paie mieux et les jeunes du monde le suivent. */
export const ERAS = [
  { id: 'cogneurs', n: 'Ère des cogneurs', stat: 'pow', txt: 'Le public paie pour les KO.' },
  { id: 'techniciens', n: 'Ère des techniciens', stat: 'def', txt: 'La défense est à la mode.' },
  { id: 'vitesse', n: 'Ère de la vitesse', stat: 'spd', txt: 'Les mains rapides font vendre.' },
  { id: 'guerriers', n: 'Ère des guerriers', stat: 'sta', txt: 'Le public veut des guerres.' },
];
export const ERA_YEARS = 2;
export const ERA_PURSE = 0.15; // +15 % de bourse si le meilleur atout du boxeur est le style de l'ère

/** Année de jeu (1, 2, …) à partir de la semaine S.t (1 = première semaine). */
export const yearOf = (t) => Math.floor((Math.max(1, t) - 1) / 52) + 1;

export function eraOf(t) {
  return ERAS[Math.floor((yearOf(t) - 1) / ERA_YEARS) % ERAS.length];
}

/** Meilleur atout d'un boxeur parmi les 4 styles d'ère. */
export function topStat(b) {
  let best = 'pow';
  for (const k of ['pow', 'def', 'spd', 'sta']) if ((+b[k] || 0) > (+b[best] || 0)) best = k;
  return best;
}

/** Multiplicateur de bourse selon l'ère (1 ou 1 + ERA_PURSE). */
export const eraPurse = (b, t) => (topStat(b) === eraOf(t).stat ? 1 + ERA_PURSE : 1);

/** Compteurs de carrière du manager (créés une fois, gardés dans la sauvegarde). */
export function careerInit(S) {
  if (!S.car) S.car = { earned: 0, last: S.money || 0, belts: [], champs: [], exes: [], told: [], chap: {}, startT: S.t || 1 };
  return S.car;
}

/** Score d'héritage : titres, champions formés, longévité, argent gagné, Temple de la renommée. */
export function legacyScore(c, { t = 1, hof = 0 } = {}) {
  const parts = {
    titres: c.belts.length * 120,
    champions: c.champs.length * 250,
    annees: (yearOf(t) - 1) * 40,
    argent: Math.floor(c.earned / 10000),
    temple: hof * 150,
  };
  return { total: Object.values(parts).reduce((a, b) => a + b, 0), parts };
}

/**
 * Une semaine de carrière : argent gagné (hausses nettes), titres et champions formés.
 * `mine` = boxeurs du joueur ; `beltsOf(b)` = liste des ceintures détenues.
 */
export function careerWeek(S, mine, beltsOf) {
  const c = careerInit(S);
  const d = (S.money || 0) - c.last;
  if (d > 0) c.earned += d;
  c.last = S.money || 0;
  for (const b of mine) {
    const bl = beltsOf(b) || [];
    for (const k of bl) {
      const key = `${b.id}:${k}`;
      if (!c.belts.includes(key)) c.belts.push(key);
    }
    if (bl.length && !c.champs.includes(b.id)) c.champs.push(b.id);
  }
  return c;
}

/** Objectifs du chapitre de la saison (= année de jeu). Même chapitre pour tout le monde. */
export function chapterOf(t) {
  const y = yearOf(t);
  const n = 2 + Math.min(4, y - 1); // la barre monte chaque saison
  return {
    season: y,
    goals: [
      { id: 'wins', n: `Gagner ${4 + y * 2} combats`, need: 4 + y * 2 },
      { id: 'kos', n: `Gagner ${n} combats par KO`, need: n },
      { id: 'sign', n: 'Signer 2 nouveaux boxeurs', need: 2 },
      { id: 'top10', n: 'Avoir un boxeur dans le top 10', need: 1 },
      { id: 'title', n: 'Gagner une ceinture', need: 1 },
    ],
  };
}

function chapRow(S) {
  const c = careerInit(S);
  const y = yearOf(S.t);
  return (c.chap[y] = c.chap[y] || {});
}

/** Ajoute une progression au chapitre courant (k = id d'objectif). */
export function chapterAdd(S, k, v = 1) {
  const ch = chapRow(S);
  ch[k] = (ch[k] || 0) + v;
  return ch[k];
}

/** Fixe une progression « état » (top 10 atteint, etc.) au maximum déjà vu. */
export function chapterSet(S, k, v) {
  const ch = chapRow(S);
  ch[k] = Math.max(ch[k] || 0, v);
  return ch[k];
}

/** État du chapitre : objectifs avec progression, nombre réussi, terminé ou non. */
export function chapterState(S) {
  const c = careerInit(S);
  const ch = chapterOf(S.t);
  const p = c.chap[ch.season] || {};
  const goals = ch.goals.map((g) => ({ ...g, got: Math.min(g.need, p[g.id] || 0), ok: (p[g.id] || 0) >= g.need }));
  const done = goals.filter((g) => g.ok).length;
  return { season: ch.season, goals, done, all: done === goals.length };
}

/** Rival qui apprend : chaque combat déjà livré contre ce boxeur lui donne un point d'adaptation (max 3). */
export function adaptOf(opp, mineId) {
  const m = opp && opp.met ? +opp.met[mineId] || 0 : 0;
  return Math.min(3, m);
}
export function meet(opp, mineId) {
  opp.met = opp.met || {};
  opp.met[mineId] = (opp.met[mineId] || 0) + 1;
}
