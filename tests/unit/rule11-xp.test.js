// @vitest-environment jsdom
// Règle n° 11 (Max, 2026-11-05) : l'entraînement ne donne plus d'XP ; on progresse en combattant.
import './setup-dom.js';
import { it, expect, afterEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { worldGen, getState, train } from '../../src/game/legacy.js';

afterEach(() => setRng(Math.random));

it('10 semaines d’entraînement intense : XP et niveau inchangés', () => {
  setRng(createRng(2));
  worldGen({ club: 'T', mgr: 'T', diff: 'normal', home: 'CA', slot: 1 });
  const S = getState();
  const b = S.fa.shift();
  Object.assign(b, { mine: true, plan: 'intense', fatigue: 0, morale: 80, hist: [], lvl: 1, xp: 0 });
  S.boxers.push(b);
  for (let w = 0; w < 10; w++) { b.fatigue = 0; train(b); }
  expect(b.xp).toBe(0);
  expect(b.lvl).toBe(1);
});
