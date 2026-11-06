// @vitest-environment jsdom
// B3 : un combat à la date exacte de fin de récupération doit être accepté.
import './setup-dom.js';
import { it, expect, afterEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { worldGen, getState, propose } from '../../src/game/legacy.js';

afterEach(() => setRng(Math.random));

function setup(seed) {
  setRng(createRng(seed));
  worldGen({ club: 'T', mgr: 'T', diff: 'normal', home: 'CA', slot: 1 });
  const S = getState();
  const me = S.fa.shift();
  Object.assign(me, { mine: true, hist: [] });
  S.boxers.push(me);
  S.t = 11; me.lastFight = 11; me.booked = false;
  const op = [...S.fa, ...S.boxers].find((b) => !b.mine && b.div === me.div && !b.booked && !b.champ);
  return { S, me, op };
}

it('accepté à lastFight + 6 (borne incluse)', () => {
  for (let seed = 1; seed <= 10; seed++) {
    const { me, op } = setup(seed);
    if (!op) continue;
    const f = propose(me.id, op.id, { week: me.lastFight + 6 });
    expect(f, `graine ${seed}`).toBeTruthy();
    expect(f.week).toBe(17);
  }
});

it('refusé avant la fin de la récupération', () => {
  const { me, op } = setup(3);
  expect(propose(me.id, op.id, { week: me.lastFight + 5 })).toBeNull();
});
