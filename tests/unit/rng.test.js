import { describe, it, expect, afterEach } from 'vitest';
import { createRng, setRng, rnd } from '../../src/core/rng.js';

describe('createRng', () => {
  it('même graine ⇒ même suite de 100 valeurs', () => {
    const a = createRng(1), b = createRng(1);
    const sa = Array.from({ length: 100 }, a), sb = Array.from({ length: 100 }, b);
    expect(sa).toEqual(sb);
  });
  it('toutes les valeurs sont dans [0, 1)', () => {
    const g = createRng(7);
    for (let i = 0; i < 1000; i++) { const v = g(); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); }
  });
  it('graine différente ⇒ suite différente', () => {
    const a = createRng(1), b = createRng(2);
    expect(Array.from({ length: 10 }, a)).not.toEqual(Array.from({ length: 10 }, b));
  });
});

describe('rnd / setRng', () => {
  afterEach(() => setRng(Math.random));
  it('rnd utilise le générateur injecté', () => {
    setRng(createRng(5));
    const x = rnd();
    expect(x).toBe(createRng(5)());
  });
});
