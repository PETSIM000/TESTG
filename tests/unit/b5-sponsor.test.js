// @vitest-environment jsdom
// B5 : un sponsor aide sans effacer la gestion (bourses ~3 000 $, coûts ~1 700 $/sem.).
import './setup-dom.js';
import { it, expect } from 'vitest';
import { sponsorTerms } from '../../src/game/legacy.js';

const unknown = { fol: 300, fame: 1, belts: 0 };
const ranked = { fol: 20000, fame: 20, belts: 0 };
const champ = { fol: 2_000_000, fame: 70, belts: 2 };
const total = (t) => t.pay * t.weeks + t.bonus;

it('inconnu : le contrat complet vaut entre 3 000 $ et 4 bourses (12 000 $)', () => {
  const t = sponsorTerms(unknown);
  expect(total(t)).toBeGreaterThanOrEqual(3000);
  expect(total(t)).toBeLessThanOrEqual(12000);
});

it('le paiement hebdo d’un inconnu reste sous 30 % des coûts (1 700 $/sem.)', () => {
  expect(sponsorTerms(unknown).pay).toBeLessThanOrEqual(510);
});

it('le bonus n’est jamais massif : au plus 6 semaines de paiement', () => {
  for (const b of [unknown, ranked, champ]) { const t = sponsorTerms(b); expect(t.bonus).toBeLessThanOrEqual(t.pay * 6); }
});

it('crédibilité ⇒ plus d’argent : inconnu < classé < champion', () => {
  expect(sponsorTerms(unknown).pay).toBeLessThan(sponsorTerms(ranked).pay);
  expect(sponsorTerms(ranked).pay).toBeLessThan(sponsorTerms(champ).pay);
});

it('montants arrondis à 50 $', () => {
  for (const b of [unknown, ranked, champ]) expect(sponsorTerms(b).pay % 50).toBe(0);
});
