// @vitest-environment jsdom
// B23 : un gala ne se crée pas au-delà de la trésorerie ; son budget est payé
// à la création puis verrouillé ; la soirée ne le facture pas une 2e fois.
import './setup-dom.js';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { worldGen, getState, ui, createGala, galaUpfront, galaNight, arenaList } from '../../src/game/legacy.js';

let S;
beforeEach(() => {
  setRng(createRng(4));
  worldGen({ club: 'T', mgr: 'T', diff: 'normal', home: 'CA', slot: 1 });
  S = getState();
  S.galas = S.galas || [];
});
afterEach(() => setRng(Math.random));

const gn = (promo) => ({ arena: arenaList().find((a) => a.lvl <= 1).id, city: 'home', wk: 4, price: 45, promo, tv: 'loc', x: {} });

describe('création', () => {
  it('refusée si la caisse ne couvre pas le budget (80 000 $ de promo avec 25 000 $)', () => {
    S.money = 25000;
    ui.gn = gn(80000);
    const g = createGala();
    expect(g).toBeFalsy();
    expect(S.money).toBe(25000);
    expect(S.galas.length).toBe(0);
  });

  it('acceptée : budget débité une fois, champs verrouillés', () => {
    S.money = 25000;
    ui.gn = gn(2000);
    const g = createGala();
    expect(g).toBeTruthy();
    expect(g.locked).toBe(true);
    expect(S.money).toBe(25000 - galaUpfront(g));
    expect(g.paid).toBe(galaUpfront(g));
  });

  it('gala annulé faute de combats : on récupère le budget moins les frais', () => {
    S.money = 25000;
    ui.gn = gn(2000);
    const g = createGala();
    const after = S.money;
    galaNight(g);
    expect(S.money).toBe(after + g.paid - g.res.loss);
  });
});
