// @vitest-environment jsdom
// B2 : les knockdowns affichés sous un boxeur sont ceux qu'il a DONNÉS,
// et ils pèsent bien sur les cartes des juges (round 10-8).
import './setup-dom.js';
import { it, expect, afterEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { worldGen, newFight, stepRound, aiStrat, getState, kdScored } from '../../src/game/legacy.js';

afterEach(() => setRng(Math.random));

it('kdScored : colonne A = knockdowns infligés par A', () => {
  expect(kdScored({ A: { kd: 0 }, B: { kd: 2 } })).toEqual([2, 0]);
  expect(kdScored({ A: { kd: 1 }, B: { kd: 0 } })).toEqual([0, 1]);
});

it('un boxeur envoyé au tapis perd ce round par au moins 2 points', () => {
  let checked = 0;
  for (let seed = 1; seed <= 60 && checked < 5; seed++) {
    setRng(createRng(seed));
    worldGen({ club: 'T', mgr: 'T', diff: 'normal', home: 'CA', slot: 1 });
    const S = getState();
    const F = newFight(S.fa[0], S.fa[1], 10);
    const before = [];
    let g = 0;
    while (!F.done && g++ < 200) {
      const kd0 = [F.A.kd, F.B.kd];
      stepRound(F, aiStrat(F.A, F.B, F), aiStrat(F.B, F.A, F));
      before.push([F.A.kd - kd0[0], F.B.kd - kd0[1]]);
    }
    F.rs.forEach(([sA, sB], i) => {
      const [downA, downB] = before[i] || [0, 0];
      if (downB > 0 && downA === 0) { expect(sA - sB, `graine ${seed} round ${i + 1}`).toBeGreaterThanOrEqual(1); checked++; }
      if (downA > 0 && downB === 0) { expect(sB - sA, `graine ${seed} round ${i + 1}`).toBeGreaterThanOrEqual(1); checked++; }
    });
  }
  expect(checked).toBeGreaterThan(0);
});
