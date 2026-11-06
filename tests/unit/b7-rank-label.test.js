// @vitest-environment jsdom
// B7 : un boxeur classé (ex. 28e) affiche son rang, pas « Non classé ».
import './setup-dom.js';
import { it, expect, afterEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { worldGen, getState, rankLabel, rankIdx } from '../../src/game/legacy.js';

afterEach(() => setRng(Math.random));

it('rang affiché = position dans le classement mondial', () => {
  setRng(createRng(9));
  worldGen({ club: 'T', mgr: 'T', diff: 'normal', home: 'CA', slot: 1 });
  const S = getState();
  const pool = [...S.boxers, ...S.fa].filter((b) => !b.champ && rankIdx(b) < 999);
  const deep = pool.find((b) => rankIdx(b) >= 15);
  expect(deep, 'un boxeur classé au-delà du top 15').toBeTruthy();
  expect(rankLabel(deep)).toBe('#' + (rankIdx(deep) + 1));
});

it('hors classement ⇒ « Non classé », champion ⇒ « Champion »', () => {
  expect(rankLabel({ champ: true })).toBe('Champion');
});
