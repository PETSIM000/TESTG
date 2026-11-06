// @vitest-environment jsdom
import './setup-dom.js';
import { it, expect } from 'vitest';

it('la 3D est active quand WebGL est disponible', async () => {
  window.HTMLCanvasElement.prototype.getContext = (k) => (k === 'webgl' ? {} : null);
  const { has3D } = await import('../../src/game/legacy.js');
  expect(has3D()).toBe(true);
});
