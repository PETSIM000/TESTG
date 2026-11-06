// @vitest-environment jsdom
import './setup-dom.js';
import { describe, it, expect } from 'vitest';
import { rpOf, onRk, seasonNow, vOnHead, rankLadder } from '../../src/game/legacy.js';

describe('Phase 4 : rang du gérant sur l’échelle 0 – 10 000', () => {
  it('un nouveau compte (1000 ELO serveur) part de Bronze III à 0', () => {
    expect(rpOf(1000)).toBe(0);
    expect(rpOf(900)).toBe(0);
    expect(onRk(1000)).toMatchObject({ id: 'bronze', n: 'Bronze III', rp: 0 });
  });
  it('2547 ELO serveur (meilleur joueur actuel) = Diamant, pas DYNASTY', () => {
    expect(rpOf(2547)).toBe(6188);
    expect(onRk(2547)).toMatchObject({ id: 'diamant', n: 'Diamant III' });
  });
  it('DYNASTY seulement à 10 000 points (3500 ELO serveur)', () => {
    expect(onRk(3499).id).toBe('champion');
    expect(onRk(3500)).toMatchObject({ id: 'dynasty', n: 'DYNASTY', nx: null });
  });
  it('points restants jusqu’à la division suivante', () => {
    const k = onRk(1100); // 400 pts, Bronze III → Bronze II à 500
    expect(k.nx).toBe('Bronze II');
    expect(k.need).toBe(100);
    expect(k.pct).toBe(80);
  });
  it('icône du rang = badge officiel', () => {
    expect(onRk(1000).ic).toContain('ranks/badge-bronze-sm.webp');
  });
  it('saison 1 démarre le 2 novembre 2026 (28 jours)', () => {
    expect(seasonNow(new Date('2026-11-06T12:00:00'))).toBe(1);
    expect(seasonNow(new Date('2026-12-01T12:00:00'))).toBe(2);
  });
  it('en-tête : badge et points ; pas de cadre avant la fin de la saison', () => {
    const html = vOnHead({ name: 'Max', elo: 2547, code: 'AB12', coins: 0, w: 0, l: 0, d: 0, kos: 0 }, 0);
    expect(html).toContain('ranks/badge-diamant');
    expect(html).toMatch(/class="fd-badge[ "]/);
    expect(html).toContain('6188');
    expect(html).not.toContain('fd-frame');
  });
  it('échelle des récompenses : seulement l’ELO du gérant, nouvelle échelle', () => {
    // Bronze III (1050 ELO serveur = 200 pts) avec un boxeur coté 1100 : rien d'atteint au-dessus de Bronze III.
    const L = rankLadder({ elo: 1050 }, { best: 1100, done: [], list: [{ r: 850, n: 'Bronze II', c: 50 }, { r: 900, n: 'Bronze I', c: 80 }] });
    expect(L[0]).toMatchObject({ n: 'Bronze III', got: true, cur: true });
    expect(L.filter((x) => x.got).map((x) => x.n)).toEqual(['Bronze III']);
    expect(L.find((x) => x.n === 'Bronze II')).toMatchObject({ rp: 500, got: false, need: 300 });
  });
  it('anciennes récompenses du serveur (ancienne échelle) : pas de bouton à réclamer', () => {
    const L = rankLadder({ elo: 1200 }, { best: 1200, done: [], list: [{ r: 850, n: 'Bronze II', c: 50 }] });
    expect(L.find((x) => x.n === 'Bronze II')).toMatchObject({ got: true, claim: null });
  });
  it('nouvelles récompenses (après migration) : réclamables une fois atteintes', () => {
    const L = rankLadder({ elo: 1200 }, { best: 1200, done: [], list: [{ r: 1125, rp: 500, n: 'Bronze II', c: 50 }] });
    expect(L.find((x) => x.n === 'Bronze II')).toMatchObject({ got: true, claim: { r: 1125, c: 50 } });
  });
});
