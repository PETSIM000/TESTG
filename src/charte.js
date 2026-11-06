// Page de vérification de la charte (Phase 1) : rendu réel des assets à l'échelle du jeu.
import './styles/game.css';
import './styles/ranks.css';
import './styles/charte.css';
import { RANKS, badgeSVG, frameSVG } from './ui/ranks.js';
import { crestSVG, drawCrest } from './ui/logo.js';

const swatches = [
  ['Fond nuit', '--bg'], ['Surface', '--s2'], ['Texte', '--ink'], ['Secondaire', '--muted'],
  ['Or Dynasty', '--gold'], ['Rouge cuir', '--red'], ['Victoire', '--green'], ['Alerte', '--warn'],
];

const el = document.getElementById('charte');
el.innerHTML = `
  <header class="ch-head"><h1>FIGHT DYNASTY</h1><p>Charte visuelle v1 · vérification dans le build</p></header>
  <section><h2>Logo</h2><div class="ch-row">${crestSVG({ title: true, tagline: 'MOBILE BOXING MANAGEMENT', size: 220 })}${crestSVG({ size: 96 })}${crestSVG({ size: 40 })}<canvas id="ch-cv" width="240" height="240" style="width:120px;height:120px"></canvas></div></section>
  <section><h2>Palette</h2><div class="ch-sw">${swatches.map(([n, v]) => `<div><i style="background:var(${v})"></i><b>${n}</b><code>${v}</code></div>`).join('')}</div></section>
  <section><h2>Badges · 96 px</h2><div class="ch-grid">${RANKS.map((r, i) => `<figure>${badgeSVG(r.id, { size: 96, div: r.id === 'dynasty' ? '' : ['III', 'II', 'I'][i % 3] })}<figcaption>${r.n}</figcaption></figure>`).join('')}</div></section>
  <section><h2>Badges · 40 px (liste, en-tête)</h2><div class="ch-row">${RANKS.map((r) => badgeSVG(r.id, { size: 40 })).join('')}</div></section>
  <section><h2>Cadres · saison sur le cadre</h2><div class="ch-grid">${RANKS.map((r, i) => `<figure class="ch-av">${frameSVG({ rank: r.id, season: 1, pos: r.id === 'dynasty' ? 1 : undefined, size: 120 })}<span class="ch-face">${'AR'}</span><figcaption>${r.n}</figcaption></figure>`).join('')}</div></section>
  <section><h2>Typographie</h2><p class="ch-disp">12-0 · 9 KO · #23</p><p>Texte Barlow 15 px : un libellé court, une ligne.</p><p class="ch-mono">25 000 $ · 1 017 ELO</p></section>
`;

document.fonts.ready.then(() => drawCrest(document.getElementById('ch-cv').getContext('2d'), 120, 120, 110));
