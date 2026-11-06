// @vitest-environment jsdom
// Règle n° 12 (Max, 2026-11-05) : chaque semaine de camp coûte plus cher que la précédente.
import './setup-dom.js';
import { it, expect, afterEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { worldGen, getState, train, campWeekCost, campTotal } from '../../src/game/legacy.js';

afterEach(() => setRng(Math.random));

it('coût strictement croissant semaine après semaine', () => {
  for (let i = 1; i < 10; i++) expect(campWeekCost(i)).toBeGreaterThan(campWeekCost(i - 1));
});

it('8 semaines coûtent au moins une bourse (3 000 $) de plus que 6', () => {
  expect(campTotal(8) - campTotal(6)).toBeGreaterThanOrEqual(3000);
});

it('un camp court reste abordable (≤ 2 000 $ pour 4 semaines)', () => {
  expect(campTotal(4)).toBeLessThanOrEqual(2000);
});

it('chaque semaine de camp est débitée de la caisse', () => {
  setRng(createRng(6));
  worldGen({ club: 'T', mgr: 'T', diff: 'normal', home: 'CA', slot: 1 });
  const S = getState();
  const b = S.fa.shift(), op = S.fa[0];
  Object.assign(b, { mine: true, fatigue: 0, morale: 80, hist: [] });
  S.boxers.push(b);
  S.fights.push({ id: 'fx', a: b.id, b: op.id, week: S.t + 6, prep: 10, auto: true, plan: [], bon: {}, gp: null });
  S.money = 20000;
  train(b); train(b);
  expect(S.money).toBe(20000 - campWeekCost(0) - campWeekCost(1));
});
