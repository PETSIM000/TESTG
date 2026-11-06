// @vitest-environment jsdom
// Caractérise le moteur de combat ACTUEL (bugs compris : ils se corrigent en Phase 2).
import './setup-dom.js';
import { describe, it, expect, afterEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { worldGen, newFight, stepRound, aiStrat, getState } from '../../src/game/legacy.js';

function simulate(seed) {
  setRng(createRng(seed));
  worldGen({ club: 'Test Gym', mgr: 'Test', diff: 'normal', home: 'CA', slot: 1 });
  const S = getState();
  const pool = S.fa.length >= 2 ? S.fa : S.boxers;
  const F = newFight(pool[0], pool[1], 10);
  let guard = 0;
  while (!F.done && guard++ < 200) stepRound(F, aiStrat(F.A, F.B, F), aiStrat(F.B, F.A, F));
  return F;
}

describe('moteur de combat', () => {
  afterEach(() => setRng(Math.random));

  it('un combat se termine avec un résultat valide', () => {
    const F = simulate(42);
    expect(F.done).toBe(true);
    expect(F.res).toBeTruthy();
    expect(F.cards).toHaveLength(3);
    expect(F.r).toBeLessThanOrEqual(10);
  });

  it('même graine ⇒ même combat', () => {
    const a = simulate(42), b = simulate(42);
    expect(JSON.stringify(a.res)).toBe(JSON.stringify(b.res));
    expect(a.cards).toEqual(b.cards);
    expect(a.r).toBe(b.r);
  });

  it('graines différentes ⇒ combats différents', () => {
    const outs = new Set();
    for (let s = 1; s <= 20; s++) { const F = simulate(s); outs.add(JSON.stringify([F.res, F.cards, F.r])); }
    expect(outs.size).toBeGreaterThan(1);
  });
});
