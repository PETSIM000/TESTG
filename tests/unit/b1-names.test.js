// @vitest-environment jsdom
// B1 : le nom du vainqueur doit être exactement celui d'un des deux boxeurs.
import './setup-dom.js';
import { it, expect, afterEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { worldGen, newFight, stepRound, aiStrat, getState } from '../../src/game/legacy.js';

afterEach(() => setRng(Math.random));

it('le texte du résultat nomme le vrai vainqueur (20 graines)', () => {
  for (let seed = 1; seed <= 20; seed++) {
    setRng(createRng(seed));
    worldGen({ club: 'Test Gym', mgr: 'Test', diff: 'normal', home: 'CA', slot: 1 });
    const S = getState();
    const me = S.boxers.find((b) => b.mine) || S.boxers[0];
    const op = S.fa[0];
    const F = newFight(me, op, 10);
    let g = 0;
    while (!F.done && g++ < 200) stepRound(F, aiStrat(F.A, F.B, F), aiStrat(F.B, F.A, F));
    if (!F.res || F.res.w === 'D') continue;
    const winner = F.res.w === 'A' ? me : op;
    expect(F.res.txt.startsWith(winner.name), `graine ${seed} : ${F.res.txt} / ${winner.name}`).toBe(true);
  }
});
