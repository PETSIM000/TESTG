import { describe, it, expect } from 'vitest';
import { ownedFrames, frameId, resolveSlot, frameLabel } from '../../src/ui/frames.js';

const me = (o = {}) => ({ id: 'p1', elo: 2547, frames: [{ rank: 'or', season: 1 }, { rank: 'diamant', season: 2 }], ...o });

describe('inventaire de cadres', () => {
  it('liste les cadres gagnés en fin de saison', () => {
    expect(ownedFrames(me()).map(frameId)).toEqual(['or-s1', 'diamant-s2']);
  });
  it('ajoute le cadre DYNASTY numéroté seulement pendant le top 250 en direct', () => {
    expect(ownedFrames(me({ dpos: 7, season: 3 })).map(frameId)).toContain('dynasty-live');
    expect(ownedFrames(me({ dpos: 0 })).map(frameId)).not.toContain('dynasty-live');
  });
  it('rien d’inventé : aucun cadre si le serveur n’en donne pas', () => {
    expect(ownedFrames({ id: 'p2', elo: 1000 })).toEqual([]);
  });
  it('ignore les entrées invalides', () => {
    expect(ownedFrames(me({ frames: [{ rank: 'fer', season: 1 }, { rank: 'or', season: 'x' }, null] }))).toEqual([]);
  });
});

describe('équiper / vitrine', () => {
  it('un cadre possédé peut être équipé', () => {
    expect(resolveSlot(me(), 'or-s1')).toMatchObject({ rank: 'or', season: 1 });
  });
  it('« Aucun cadre » ou cadre inconnu ⇒ rien', () => {
    expect(resolveSlot(me(), '')).toBeNull();
    expect(resolveSlot(me(), 'champion-s9')).toBeNull();
  });
  it('sorti du top 250 ⇒ le cadre numéroté se déséquipe tout seul', () => {
    expect(resolveSlot(me({ dpos: 12, season: 1 }), 'dynasty-live')).toMatchObject({ rank: 'dynasty', pos: 12 });
    expect(resolveSlot(me({ dpos: 0 }), 'dynasty-live')).toBeNull();
  });
  it('libellé lisible', () => {
    expect(frameLabel({ rank: 'or', season: 1 })).toBe('Or · S1');
    expect(frameLabel({ rank: 'dynasty', season: 3, pos: 7, live: true })).toBe('DYNASTY #7 · S3');
  });
});
