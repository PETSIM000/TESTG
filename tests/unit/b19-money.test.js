// @vitest-environment jsdom
// B19 : l'en-tête montre le montant exact jusqu'à 999 999 $.
import './setup-dom.js';
import { it, expect } from 'vitest';
import { moneyS } from '../../src/game/legacy.js';

it('100 833 $ s’affiche exactement (pas « 101 k$ »)', () => {
  expect(moneyS(100833).replace(/\s/g, ' ')).toBe('100 833 $');
});
it('les millions restent abrégés', () => {
  expect(moneyS(2_500_000)).toBe('2,5 M$');
});
