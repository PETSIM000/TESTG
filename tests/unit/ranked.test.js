import { describe, it, expect } from 'vitest';
import { RK_BASE, RK_STYLES, RK_ABIL, rkStats, rkValid, botRk } from '../../src/ui/ranked.js';

describe('Classé : tout le monde au même overall', () => {
  it('base 75 pour tous', () => {
    expect(RK_BASE).toBe(75);
  });
  it('5 styles, tous avec le même total de points (équilibré)', () => {
    expect(Object.keys(RK_STYLES)).toEqual(['cogneur', 'technicien', 'defensif', 'pression', 'contreur']);
    for (const id of Object.keys(RK_STYLES)) {
      const s = rkStats(id);
      expect(s.pow + s.spd + s.def + s.sta + s.chin).toBe(75 * 5);
    }
  });
  it('le cogneur frappe plus fort, le défensif défend mieux', () => {
    expect(rkStats('cogneur').pow).toBeGreaterThan(75);
    expect(rkStats('defensif').def).toBeGreaterThan(75);
  });
  it('7 habiletés de combat au choix', () => {
    expect(RK_ABIL).toEqual(['fer', 'finisseur', 'contre', 'moteur', 'eclair', 'bombe', 'roc']);
  });
});

describe('validation du boxeur Classé (mêmes règles que le serveur)', () => {
  it('nom 2 à 16, style connu, 2 habiletés différentes', () => {
    expect(rkValid({ name: 'Kid Max', style: 'cogneur', abil: ['bombe', 'fer'] })).toBe(true);
    expect(rkValid({ name: 'K', style: 'cogneur', abil: ['bombe', 'fer'] })).toBe(false);
    expect(rkValid({ name: 'Kid Max', style: 'ninja', abil: ['bombe', 'fer'] })).toBe(false);
    expect(rkValid({ name: 'Kid Max', style: 'cogneur', abil: ['bombe', 'bombe'] })).toBe(false);
    expect(rkValid({ name: 'Kid Max', style: 'cogneur', abil: ['bombe'] })).toBe(false);
    expect(rkValid({ name: 'Kid Max', style: 'cogneur', abil: ['bombe', 'showman'] })).toBe(false);
  });
  it('adversaire sans boxeur Classé (IA) : boxeur stable tiré de son id', () => {
    const a = botRk({ id: 'abc', name: 'Rocco' }), b = botRk({ id: 'abc', name: 'Rocco' });
    expect(a).toEqual(b);
    expect(rkValid(a)).toBe(true);
  });
});
