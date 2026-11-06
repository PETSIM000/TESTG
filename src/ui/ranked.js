// Mode CLASSÉ (décision de Max) : tout le monde part au même overall (75). Le joueur choisit un nom,
// un style (boosts fixes, même total pour tous les styles) et 2 habiletés. Seul ce mode fait bouger le rang.
// Les règles de validation sont les mêmes que celles du serveur (cr_rk_set).

export const RK_BASE = 75;

// Écart par rapport à la base pour chaque stat ; la somme vaut toujours 0 (équilibre).
export const RK_STYLES = {
  cogneur: { n: 'Cogneur', eng: 'agr', d: { pow: 8, chin: 2, spd: -4, def: -4, sta: -2 }, txt: 'Grosse puissance, cherche le K.O.' },
  technicien: { n: 'Technicien', eng: 'eq', d: { spd: 6, def: 4, pow: -4, chin: -3, sta: -3 }, txt: 'Vitesse et précision, gagne aux points.' },
  defensif: { n: 'Défensif', eng: 'pru', d: { def: 8, chin: 2, pow: -5, spd: -3, sta: -2 }, txt: 'Difficile à toucher, use l’adversaire.' },
  pression: { n: 'Pression', eng: 'corps', d: { sta: 8, chin: 2, pow: -4, spd: -2, def: -4 }, txt: 'Avance sans arrêt, travaille au corps.' },
  contreur: { n: 'Contreur', eng: 'eq', d: { spd: 4, def: 4, pow: 0, sta: -4, chin: -4 }, txt: 'Attend l’erreur et punit en contre.' },
};

// Habiletés utiles en combat uniquement.
export const RK_ABIL = ['fer', 'finisseur', 'contre', 'moteur', 'eclair', 'bombe', 'roc'];

const STAT_KEYS = ['pow', 'spd', 'def', 'sta', 'chin'];

export function rkStats(style) {
  const d = (RK_STYLES[style] || RK_STYLES.technicien).d;
  return Object.fromEntries(STAT_KEYS.map((k) => [k, RK_BASE + (d[k] || 0)]));
}

export function rkValid(c) {
  if (!c || typeof c.name !== 'string') return false;
  const nm = c.name.trim();
  if (nm.length < 2 || nm.length > 16 || !/^[\p{L}\p{N} .-]+$/u.test(nm)) return false;
  if (!RK_STYLES[c.style]) return false;
  const a = c.abil;
  return Array.isArray(a) && a.length === 2 && a[0] !== a[1] && a.every((x) => RK_ABIL.includes(x));
}

// Joueur sans boxeur Classé (IA, ancien compte) : boxeur stable déduit de son id.
function hash(s) {
  let h = 2166136261;
  for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  return h;
}
export function botRk(p) {
  const h = hash(p.id);
  const styles = Object.keys(RK_STYLES);
  const a1 = RK_ABIL[h % RK_ABIL.length];
  const rest = RK_ABIL.filter((x) => x !== a1);
  const name = String(p.name || 'Boxeur').replace(/[^\p{L}\p{N} .-]/gu, '').trim().slice(0, 16);
  return { name: name.length >= 2 ? name : 'Boxeur', style: styles[(h >>> 3) % styles.length], abil: [a1, rest[(h >>> 7) % rest.length]] };
}
