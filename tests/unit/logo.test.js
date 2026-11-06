import { describe, it, expect } from 'vitest';
import { crestSVG, drawCrest, CREST, logoHTML, LOGO, _setLogoImage } from '../../src/ui/logo.js';

describe('logo FIGHT DYNASTY', () => {
  it('SVG avec le nom du jeu et la signature', () => {
    const s = crestSVG({ title: true, tagline: 'MOBILE BOXING MANAGEMENT' });
    expect(s.startsWith('<svg')).toBe(true);
    expect(s).toContain('FIGHT');
    expect(s).toContain('DYNASTY');
    expect(s).toContain('MOBILE BOXING MANAGEMENT');
  });
  it('écusson seul : pas de texte', () => {
    expect(crestSVG()).not.toContain('<text');
  });
  it('ids uniques entre deux logos', () => {
    const ids = (s) => [...s.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    const a = ids(crestSVG()), b = ids(crestSVG());
    expect(a.length).toBeGreaterThan(0);
    expect(a.some((x) => b.includes(x))).toBe(false);
  });
  it('lauriers : au moins 8 feuilles de chaque côté', () => {
    expect(CREST.leaves.length).toBeGreaterThanOrEqual(16);
  });
  it('drawCrest dessine sur un contexte canvas sans planter', () => {
    const calls = [];
    const ctx = new Proxy({}, { get: (t, k) => (k in t ? t[k] : (...a) => { calls.push(k); return { addColorStop() {} }; }), set: (t, k, v) => { t[k] = v; return true; } });
    globalThis.Path2D = class { constructor(d) { this.d = d; } };
    drawCrest(ctx, 100, 100, 80);
    expect(calls).toContain('fill');
    expect(calls).toContain('save');
    expect(calls).toContain('restore');
  });
  it('logo officiel de Max : image du dossier brand/', () => {
    expect(LOGO.full).toBe('brand/logo.webp');
    const s = logoHTML('full');
    expect(s).toContain('<img');
    expect(s).toContain('src="brand/logo.webp"');
    expect(s).toContain('alt="FIGHT DYNASTY"');
  });
  it('drawCrest dessine l’image du logo de Max dès qu’elle est chargée', () => {
    const calls = [];
    const ctx = new Proxy({}, { get: (t, k) => (k in t ? t[k] : (...a) => { calls.push(k); return { addColorStop() {} }; }), set: (t, k, v) => { t[k] = v; return true; } });
    globalThis.Path2D = class { constructor(d) { this.d = d; } };
    _setLogoImage({ complete: true, naturalWidth: 600, naturalHeight: 636 });
    drawCrest(ctx, 100, 100, 80);
    expect(calls).toContain('drawImage');
    _setLogoImage(null);
  });
});
