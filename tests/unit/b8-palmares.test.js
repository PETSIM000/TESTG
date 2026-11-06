// @vitest-environment jsdom
// B8 : le Palmarès ne doit pas dire « Titre vacant » pour un boxeur qui vient d'être sacré.
import './setup-dom.js';
import { it, expect } from 'vitest';
import { palmHow } from '../../src/game/legacy.js';

it('ancienne entrée « Titre vacant » ⇒ libellé de sacre', () => {
  expect(palmHow({ how: 'Titre vacant' })).toBe('Remporte le titre vacant');
});
it('les autres entrées restent telles quelles', () => {
  expect(palmHow({ how: 'Bat Lewis Brown aux points' })).toBe('Bat Lewis Brown aux points');
});
