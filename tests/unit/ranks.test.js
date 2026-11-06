import { describe, it, expect } from 'vitest';
import { RANKS, rankFromElo, badgeHTML, frameHTML } from '../../src/ui/ranks.js';

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
  it('Diamant → DYNASTY : vidéo en boucle, muette, avec image fixe de secours', () => {
    for (const id of ['diamant', 'maitre', 'champion', 'dynasty']) {
      const s = badgeHTML(id, { size: 96 });
      expect(s).toContain('<video');
      expect(s).toMatch(/autoplay/);
      expect(s).toMatch(/muted/);
      expect(s).toMatch(/loop/);
      expect(s).toMatch(/playsinline/);
      expect(s).toContain(`ranks/${id}-badge.mp4`);
      expect(s).toContain(`poster="ranks/${id}-badge.webp"`);
    }
  });
  it('Bronze → Platine : image fixe, jamais de vidéo', () => {
    for (const id of ['bronze', 'argent', 'or', 'platine']) {
      const s = badgeHTML(id, { size: 96 });
      expect(s).not.toContain('<video');
      expect(s).toContain(`ranks/${id}-badge.webp`);
    }
  });
  it('petite taille (liste) : image fixe même pour un rang animé', () => {
    expect(badgeHTML('dynasty', { size: 40 })).not.toContain('<video');
  });
  it('option still : image fixe (téléphones faibles, mouvement réduit)', () => {
    expect(badgeHTML('maitre', { size: 120, still: true })).not.toContain('<video');
  });
  it('le badge ne porte jamais de saison', () => {
    for (const r of RANKS) expect(badgeHTML(r.id, { div: 'II' })).not.toMatch(/\bS\d+\b/);
  });
  it('division affichée sous le badge', () => {
    expect(badgeHTML('or', { div: 'II' })).toContain('>II<');
  });
  it('rang inconnu ⇒ erreur claire', () => {
    expect(() => badgeHTML('fer')).toThrow(/rang inconnu/);
  });
});

describe('cadres', () => {
  it('cadre animé à partir de Diamant', () => {
    expect(frameHTML({ rank: 'champion', season: 1, size: 132 })).toContain('ranks/champion-frame.mp4');
    expect(frameHTML({ rank: 'argent', season: 1, size: 132 })).not.toContain('<video');
  });
  it('saison 1 : la plaque « S1 » de l’art suffit, pas de surcouche', () => {
    expect(frameHTML({ rank: 'or', season: 1 })).not.toContain('fd-plate');
  });
  it('autre saison : plaque redessinée avec la bonne saison', () => {
    const s = frameHTML({ rank: 'or', season: 3 });
    expect(s).toContain('fd-plate');
    expect(s).toContain('S3');
  });
  it('DYNASTY : numéro mondial et saison sur le cadre', () => {
    const s = frameHTML({ rank: 'dynasty', season: 2, pos: 7 });
    expect(s).toContain('#7');
    expect(s).toContain('S2');
  });
  it('avatar placé dans le trou du cadre', () => {
    const s = frameHTML({ rank: 'diamant', season: 1, avatar: '<b>AR</b>' });
    expect(s).toContain('fd-hole');
    expect(s).toContain('<b>AR</b>');
  });
});
