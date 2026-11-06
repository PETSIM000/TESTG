// @vitest-environment jsdom
// Règle n° 10 (Max, 2026-11-05) : au moins 1 combat par 3 mois (13 sem.),
// sinon perte de crédibilité — et le gérant est averti avant et après.
import './setup-dom.js';
import { it, expect, afterEach, beforeEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { worldGen, getState, inactivityTick, inactiveWeeks, INACTIVE_MAX } from '../../src/game/legacy.js';

let S, b;
beforeEach(() => {
  setRng(createRng(8));
  worldGen({ club: 'T', mgr: 'T', diff: 'normal', home: 'CA', slot: 1 });
  S = getState();
  b = S.fa.shift();
  Object.assign(b, { mine: true, hist: [], fame: 20, booked: false });
  S.boxers.push(b);
  S.log = [];
});
afterEach(() => setRng(Math.random));

it('limite = 13 semaines', () => expect(INACTIVE_MAX).toBe(13));

it('avertissement 2 semaines avant, sans perte', () => {
  S.t = 50; b.lastFight = 50 - 11;
  inactivityTick(b);
  expect(b.fame).toBe(20);
  expect(S.log.some((l) => /inactif dans 2 sem/.test(l.txt))).toBe(true);
});

it('à 13 semaines : perte de crédibilité + message', () => {
  S.t = 50; b.lastFight = 37;
  inactivityTick(b);
  expect(b.fame).toBeLessThan(20);
  expect(S.log.some((l) => /inactif/.test(l.txt))).toBe(true);
});

it('un boxeur qui a un combat réservé n’est pas puni', () => {
  S.t = 50; b.lastFight = 37; b.booked = true;
  inactivityTick(b);
  expect(b.fame).toBe(20);
});

it('pas de punition silencieuse : rien entre l’avertissement et la limite sauf message', () => {
  S.t = 50; b.lastFight = 45;
  inactivityTick(b);
  expect(b.fame).toBe(20);
  expect(inactiveWeeks(b)).toBe(5);
});
