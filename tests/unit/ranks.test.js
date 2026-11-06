import { describe, it, expect } from 'vitest';
import { RANKS, rankFromElo, badgeHTML, frameHTML, collectionHTML } from '../../src/ui/ranks.js';

describe('échelle des rangs (spec rangs.html)', () => {
  it('8 rangs dans l’ordre Bronze → DYNASTY', () => {
    expect(RANKS.map((r) => r.id)).toEqual(['bronze', 'argent', 'or', 'platine', 'diamant', 'maitre', 'champion', 'dynasty']);
  });
  it('bornes ELO exactes', () => {
    expect(RANKS.map((r) => r.min)).toEqual([0, 1500, 3000, 4500, 6000, 7500, 9000, 10000]);
  });
  it('rankFromElo : rang et division III → I', () => {
    expect(rankFromElo(0)).toMatchObject({ id: 'bronze', div: 'III' });
    expect(rankFromElo(500)).toMatchObject({ id: 'bronze', div: 'II' });
    expect(rankFromElo(1499)).toMatchObject({ id: 'bronze', div: 'I' });
    expect(rankFromElo(1500)).toMatchObject({ id: 'argent', div: 'III' });
    expect(rankFromElo(9999)).toMatchObject({ id: 'champion', div: 'I' });
    expect(rankFromElo(10000)).toMatchObject({ id: 'dynasty', div: '' });
    expect(rankFromElo(NaN)).toMatchObject({ id: 'bronze', div: 'III' });
  });
});

describe('badge (composants.html)', () => {
  it('.fd-badge carrée (--size) avec l’image alpha officielle', () => {
    for (const r of RANKS) {
      const s = badgeHTML(r.id, { size: 96, still: true });
      expect(s).toMatch(new RegExp(`<div class="fd-badge[^"]*" style="--size:96px[^"]*" data-rk="${r.id}"><img src="ranks/badge-${r.id}.webp"`));
    }
  });
  it('animé (WebP transparent, simple <img>) seulement à partir de Diamant ; plus aucune vidéo', () => {
    const anim = RANKS.map((r) => badgeHTML(r.id, { size: 96 }).includes('-anim.webp'));
    expect(anim).toEqual([false, false, false, false, true, true, true, true]);
    for (const r of RANKS) expect(badgeHTML(r.id, { size: 96 })).not.toContain('<video');
    expect(badgeHTML('diamant', { size: 96 })).toContain('<img src="ranks/badge-diamant-anim.webp"');
  });
  it('petite vignette de liste : image fixe, même boîte carrée', () => {
    const s = badgeHTML('dynasty', { size: 28 });
    expect(s).not.toContain('<video');
    expect(s).toMatch(/<div class="fd-badge" style="--size:28px[^"]*" data-rk="dynasty"><img src="ranks\/badge-dynasty-sm.webp"/);
  });
  it('division affichée par le moteur, hors de l’image', () => {
    expect(badgeHTML('or', { div: 'II' })).toContain('<b class="fd-div">II</b>');
  });
  it('rang inconnu ⇒ erreur claire', () => {
    expect(() => badgeHTML('fer')).toThrow(/rang inconnu/);
  });
});

describe('cadre (composants.html)', () => {
  it('.fd-frame > .fd-avatar + .fd-cadre + .fd-plaque saison', () => {
    const s = frameHTML({ rank: 'or', season: 3, size: 200, initials: 'AR' });
    expect(s).toMatch(/^<div class="fd-frame" style="--size:200px"><span class="fd-avatar fd-ini">AR<\/span><img class="fd-cadre" src="ranks\/cadre-or.webp"[^>]*><div class="fd-plaque">S3<\/div><\/div>$/);
  });
  it('DYNASTY : « #numéro · saison » en texte', () => {
    expect(frameHTML({ rank: 'dynasty', season: 1, pos: 37 })).toContain('<div class="fd-plaque">#37 · S1</div>');
  });
  it('cadre animé (img.fd-cadre WebP transparent) à partir de Diamant', () => {
    expect(frameHTML({ rank: 'champion', season: 1, size: 160 })).toContain('<img class="fd-cadre" src="ranks/cadre-champion-anim.webp"');
    expect(frameHTML({ rank: 'platine', season: 1, size: 160 })).not.toContain('<video');
  });
});

describe('collection DYNASTY à vie', () => {
  it('badge gravé du rang final et de la saison', () => {
    const s = collectionHTML([{ pos: 37, season: 1 }]);
    expect(s).toContain('ranks/badge-dynasty.webp');
    expect(s).toContain('#37 · S1');
  });
  it('vide : message clair, rien d’inventé', () => {
    expect(collectionHTML([])).toContain('Aucun badge DYNASTY');
  });
});

describe('effets permanents (tous les rangs)', () => {
  it('à partir de 56 px, chaque badge a l’effet de reflet en boucle (classe fd-fx) et son image en masque', () => {
    for (const r of RANKS) {
      const s = badgeHTML(r.id, { size: 96 });
      expect(s).toContain('fd-fx');
      expect(s).toMatch(/--img:url\('ranks\/badge-/);
    }
  });
  it('petites vignettes de liste : pas d’effet (léger)', () => {
    expect(badgeHTML('or', { size: 30 })).not.toContain('fd-fx');
  });
});
