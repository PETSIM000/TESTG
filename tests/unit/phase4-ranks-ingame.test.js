// @vitest-environment jsdom
import './setup-dom.js';
import { describe, it, expect } from 'vitest';
import { rpOf, onRk, seasonNow, vOnHead } from '../../src/game/legacy.js';

describe('Phase 4 : rang du compte sur l’échelle 0 – 10 000', () => {
  it('conversion de l’ELO serveur en points de rang', () => {
    expect(rpOf(700)).toBe(0);
    expect(rpOf(800)).toBe(0);
    expect(rpOf(1000)).toBe(1600);
    expect(rpOf(2050)).toBe(10000);
  });
  it('rang et division selon les points', () => {
    expect(onRk(1000)).toMatchObject({ id: 'argent', n: 'Argent III', rp: 1600 });
    expect(onRk(1600)).toMatchObject({ id: 'diamant', n: 'Diamant III', rp: 6400 });
    expect(onRk(1750)).toMatchObject({ id: 'maitre', n: 'Maître III', rp: 7600 });
    expect(onRk(2100)).toMatchObject({ id: 'dynasty', n: 'DYNASTY', nx: null });
  });
  it('points restants jusqu’à la division suivante', () => {
    const k = onRk(1000); // 1600 pts, Argent III → Argent II à 2000
    expect(k.nx).toBe('Argent II');
    expect(k.need).toBe(400);
    expect(k.pct).toBe(20);
  });
  it('icône du rang = badge officiel, pas l’ancien SVG', () => {
    expect(onRk(1000).ic).toContain('ranks/argent-badge.webp');
  });
  it('saison 1 démarre le 2 novembre 2026 (28 jours)', () => {
    expect(seasonNow(new Date('2026-11-06T12:00:00'))).toBe(1);
    expect(seasonNow(new Date('2026-12-01T12:00:00'))).toBe(2);
  });
  it('en-tête en ligne : cadre du rang avec saison, badge et points', () => {
    const html = vOnHead({ name: 'Max', elo: 1600, code: 'AB12', coins: 0, w: 0, l: 0, d: 0, kos: 0 }, 0);
    expect(html).toContain('fd-frame fd-r-diamant');
    expect(html).toContain('fd-badge fd-r-diamant');
    expect(html).toContain('6400');
  });
});
