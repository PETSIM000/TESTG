import { describe, it, expect } from 'vitest';
import { RANKS, rankFromElo, badgeSVG, frameSVG } from '../../src/ui/ranks.js';

describe('échelle des rangs (brief §4)', () => {
  it('8 rangs dans l’ordre Bronze → DYNASTY', () => {
    expect(RANKS.map((r) => r.id)).toEqual(['bronze', 'argent', 'or', 'platine', 'diamant', 'maitre', 'champion', 'dynasty']);
  });
  it('bornes ELO exactes', () => {
    expect(RANKS.map((r) => r.min)).toEqual([0, 1500, 3000, 4500, 6000, 7500, 9000, 10000]);
  });
  it('rankFromElo : rang et division III → I', () => {
    expect(rankFromElo(0)).toMatchObject({ id: 'bronze', div: 'III' });
    expect(rankFromElo(499)).toMatchObject({ id: 'bronze', div: 'III' });
    expect(rankFromElo(500)).toMatchObject({ id: 'bronze', div: 'II' });
    expect(rankFromElo(1499)).toMatchObject({ id: 'bronze', div: 'I' });
    expect(rankFromElo(1500)).toMatchObject({ id: 'argent', div: 'III' });
    expect(rankFromElo(9999)).toMatchObject({ id: 'champion', div: 'I' });
  });
  it('DYNASTY à 10 000 : pas de division', () => {
    expect(rankFromElo(10000)).toMatchObject({ id: 'dynasty', div: '' });
    expect(rankFromElo(12000)).toMatchObject({ id: 'dynasty', div: '' });
  });
  it('ELO négatif ou invalide ⇒ Bronze III', () => {
    expect(rankFromElo(-50)).toMatchObject({ id: 'bronze', div: 'III' });
    expect(rankFromElo(NaN)).toMatchObject({ id: 'bronze', div: 'III' });
  });
});

describe('badges', () => {
  it('un SVG par rang, sans aucune saison', () => {
    for (const r of RANKS) {
      const s = badgeSVG(r.id);
      expect(s.startsWith('<svg')).toBe(true);
      expect(s).not.toMatch(/\bS\d+\b/);
    }
  });
  it('animé seulement à partir de Diamant', () => {
    const anim = RANKS.map((r) => badgeSVG(r.id).includes('fd-anim'));
    expect(anim).toEqual([false, false, false, false, true, true, true, true]);
  });
  it('ids SVG uniques entre deux badges sur la même page', () => {
    const ids = (s) => [...s.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    const a = ids(badgeSVG('or')), b = ids(badgeSVG('or'));
    expect(a.some((x) => b.includes(x))).toBe(false);
  });
});

describe('cadres', () => {
  it('la saison est sur le cadre', () => {
    expect(frameSVG({ rank: 'or', season: 1 })).toContain('S1');
  });
  it('DYNASTY porte numéro mondial et saison', () => {
    const s = frameSVG({ rank: 'dynasty', season: 2, pos: 7 });
    expect(s).toContain('#7');
    expect(s).toContain('S2');
  });
  it('rang inconnu ⇒ erreur claire', () => {
    expect(() => badgeSVG('fer')).toThrow(/rang inconnu/);
  });
});
