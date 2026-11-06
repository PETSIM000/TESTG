// Hasard du jeu. Par défaut Math.random ; les tests injectent une graine
// pour rendre un combat ou une saison reproductible.

/** Générateur mulberry32 : même graine ⇒ même suite, valeurs dans [0, 1). */
export function createRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let source = Math.random;

/** Remplace la source de hasard (tests, replays). */
export function setRng(fn) { source = fn; }

/** Nombre aléatoire dans [0, 1) depuis la source courante. */
export function rnd() { return source(); }
