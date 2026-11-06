// @vitest-environment jsdom
// Règle n° 8 (Max, 2026-11-05) : la bourse grossit avec la crédibilité et le classement.
import './setup-dom.js';
import { it, expect, afterEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { worldGen, getState, purse, rankIdx } from '../../src/game/legacy.js';

afterEach(() => setRng(Math.random));

function pair() {
  setRng(createRng(12));
  worldGen({ club: 'T', mgr: 'T', diff: 'normal', home: 'CA', slot: 1 });
  const S = getState();
  const unranked = [...S.fa, ...S.boxers].filter((b) => !b.champ && rankIdx(b) >= 50);
  return { S, a: unranked[0], b: unranked[1] };
}

it('un inconnu touche environ 3 000 $', () => {
  const { a, b } = pair();
  a.fame = 1; b.fame = 1;
  const p = purse(a, b, null);
  expect(p).toBeGreaterThanOrEqual(2500);
  expect(p).toBeLessThanOrEqual(4000);
});

it('même rang, plus de crédibilité ⇒ bourse plus grosse', () => {
  const { a, b } = pair();
  b.fame = 10;
  a.fame = 5; const low = purse(a, b, null);
  a.fame = 60; const high = purse(a, b, null);
  expect(high).toBeGreaterThan(low);
});
