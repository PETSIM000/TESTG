// @vitest-environment jsdom
// B6 : la colonne P4P affiche le score qui sert au tri.
import './setup-dom.js';
import { it, expect, afterEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { worldGen, p4pList, p4pShown } from '../../src/game/legacy.js';

afterEach(() => setRng(Math.random));

it('les scores affichés sont triés du plus haut au plus bas', () => {
  for (let seed = 1; seed <= 5; seed++) {
    setRng(createRng(seed));
    worldGen({ club: 'T', mgr: 'T', diff: 'normal', home: 'CA', slot: 1 });
    const shown = p4pList().map(p4pShown);
    expect(shown.length).toBeGreaterThan(3);
    for (let i = 1; i < shown.length; i++) expect(shown[i], `graine ${seed} rang ${i + 1}`).toBeLessThanOrEqual(shown[i - 1]);
  }
});
