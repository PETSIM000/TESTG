// @vitest-environment jsdom
// Campagne / carrière : preuves chiffrées (section 11 du prompt de Max, 2026-11-06).
import './setup-dom.js';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createRng, setRng } from '../../src/core/rng.js';
import { vCampaign, worldGen, getState, nextWeek, rankIdx, campWeekCost, campTotal, drawOf, train, inactivityTick } from '../../src/game/legacy.js';
import { eraOf, eraPurse, yearOf, legacyScore, chapterState, chapterAdd, adaptOf, meet, careerInit } from '../../src/game/career.js';

let S;
function weeks(n) {
  for (let i = 0; i < n; i++) {
    S.event = null; S.queue = []; S.neg = null; S.notice = null;
    for (const b of S.boxers) if (b.mine) b.contract = 52;
    nextWeek(true);
  }
}
function signFA(over = {}) {
  const b = S.fa.shift();
  Object.assign(b, { mine: true, hist: [], booked: false, contract: 52, morale: 80, loy: 90, lastFight: S.t, lvl: 1, xp: 0, sp: 0, plan: 'normal' }, over);
  S.boxers.push(b);
  return b;
}
beforeEach(() => {
  setRng(createRng(42));
  worldGen({ club: 'T', mgr: 'T', diff: 'normal', home: 'CA', slot: 1 });
  S = getState();
  S.money = 5e7; // la simulation teste le temps et le monde, pas la faillite
});
afterEach(() => setRng(Math.random));

describe('ères et héritage (logique pure)', () => {
  it('l’ère change tous les 2 ans', () => {
    expect(eraOf(1).id).toBe('cogneurs');
    expect(eraOf(52 * 2 + 1).id).toBe('techniciens');
    expect(eraOf(52 * 4 + 1).id).toBe('vitesse');
  });
  it('bourse +15 % si le style du boxeur est celui de l’ère', () => {
    expect(eraPurse({ pow: 80, def: 50, spd: 50, sta: 50 }, 1)).toBeCloseTo(1.15);
    expect(eraPurse({ pow: 40, def: 80, spd: 50, sta: 50 }, 1)).toBe(1);
  });
  it('le score d’héritage additionne titres, champions, années, argent, Temple', () => {
    const L = legacyScore({ belts: ['a:WBC', 'a:IBF'], champs: ['a'], earned: 1e6 }, { t: 52 * 3 + 1, hof: 1 });
    expect(L.parts).toEqual({ titres: 240, champions: 250, annees: 120, argent: 100, temple: 150 });
    expect(L.total).toBe(860);
  });
  it('rival qui apprend : +1 adaptation par combat déjà livré, max 3', () => {
    const o = {};
    expect(adaptOf(o, 'x')).toBe(0);
    meet(o, 'x'); meet(o, 'x');
    expect(adaptOf(o, 'x')).toBe(2);
    meet(o, 'x'); meet(o, 'x');
    expect(adaptOf(o, 'x')).toBe(3);
  });
});

describe('simulation de carrière sur 5 ans', () => {
  it('le temps avance, un boxeur vieillit et prend sa retraite, l’héritage monte, le monde bouge', () => {
    const young = signFA({ age: 20 });
    const old = signFA({ age: 37 });
    const div = young.div;
    const before = S.boxers.filter((b) => b.div === div && !b.mine).map((b) => b.id).sort();
    const top0 = S.boxers.filter((b) => b.div === div).sort((a, b) => rankIdx(a) - rankIdx(b)).slice(0, 10).map((b) => b.id);
    const L0 = legacyScore(careerInit(S), { t: S.t, hof: (S.hof || []).length }).total;

    weeks(52 * 5);

    expect(yearOf(S.t)).toBe(6);
    expect(young.age).toBe(25);
    expect(S.boxers.includes(old)).toBe(false);
    expect((S.hof || []).length).toBeGreaterThan(0);
    const L1 = legacyScore(careerInit(S), { t: S.t, hof: (S.hof || []).length }).total;
    expect(L1).toBeGreaterThan(L0);
    const after = S.boxers.filter((b) => b.div === div && !b.mine).map((b) => b.id).sort();
    expect(after).not.toEqual(before);
    const top1 = S.boxers.filter((b) => b.div === div).sort((a, b) => rankIdx(a) - rankIdx(b)).slice(0, 10).map((b) => b.id);
    expect(top1).not.toEqual(top0);
    console.log(`[sim] an ${yearOf(S.t)} · héritage ${L0} → ${L1} · ${S.hof.length} au Temple · top 10 changé : ${top1.filter((x) => !top0.includes(x)).length}/10`);
  }, 120000);

  it('règles chiffrées : camp, XP, inactivité, bourse', () => {
    const b = signFA({ age: 24 });
    expect(campTotal(3)).toBeGreaterThan(campWeekCost(0) * 3);
    const xp0 = b.xp, lvl0 = b.lvl;
    for (let i = 0; i < 10; i++) train(b);
    expect([b.xp, b.lvl]).toEqual([xp0, lvl0]);
    S.log = []; S.t = 100; b.lastFight = 100 - 11;
    const f0 = b.fame;
    inactivityTick(b);
    expect(b.fame).toBe(f0);
    expect(S.log.length).toBeGreaterThan(0);
    const list = S.boxers.filter((x) => x.div === b.div && !x.mine);
    const champ = list.find((x) => x.champ);
    const nobody = [...list].sort((x, y) => rankIdx(y) - rankIdx(x))[0];
    expect(drawOf(champ)).toBeGreaterThan(drawOf(nobody) * 10);
    console.log(`[règles] camp 1 sem ${campTotal(1)} $ · 3 sem ${campTotal(3)} $ · bourse inconnu ${Math.round(drawOf(nobody))} $ · champion ${Math.round(drawOf(champ))} $`);
  });

  it('chapitre de saison : objectifs qui se cochent', () => {
    for (let i = 0; i < 6; i++) chapterAdd(S, 'wins');
    const st = chapterState(S);
    expect(st.season).toBe(1);
    expect(st.goals.find((g) => g.id === 'wins').ok).toBe(true);
    expect(st.all).toBe(false);
  });

  it('la carte campagne de l’Écurie s’affiche (saison, ère, héritage, chapitre)', () => {
    const h = vCampaign();
    expect(h).toContain('Saison 1');
    expect(h).toContain('Ère des cogneurs');
    expect(h).toContain('Héritage');
    expect(h).toContain('0/5 objectifs');
  });
});
