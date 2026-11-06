// Page de vérification de la charte (Phase 1) : rendu réel des assets à l'échelle du jeu.
import './styles/game.css';
import './styles/ranks.css';
import './styles/charte.css';
import { RANKS, badgeHTML, frameHTML } from './ui/ranks.js';
import { logoHTML, drawCrest, logoReady } from './ui/logo.js';

const swatches = [
  ['Fond nuit', '--bg'], ['Surface', '--s2'], ['Texte', '--ink'], ['Secondaire', '--muted'],
  ['Or Dynasty', '--gold'], ['Rouge cuir', '--red'], ['Victoire', '--green'], ['Alerte', '--warn'],
];

const el = document.getElementById('charte');
el.innerHTML = `
  <header class="ch-head"><h1>FIGHT DYNASTY</h1><p>Charte visuelle v1 · vérification dans le build</p></header>
  <section><h2>Logo</h2><div class="ch-row">${logoHTML('full', 'ch-logo')}<img class="ch-icon" src="icons/icon-192.png" alt="Icône"><canvas id="ch-cv" width="240" height="240" style="width:120px;height:120px"></canvas></div></section>
  <section><h2>Palette</h2><div class="ch-sw">${swatches.map(([n, v]) => `<div><i style="background:var(${v})"></i><b>${n}</b><code>${v}</code></div>`).join('')}</div></section>
  <section><h2>Badges · 120 px</h2><div class="ch-grid">${RANKS.map((r, i) => `<figure>${badgeHTML(r.id, { size: 120, div: r.id === 'dynasty' ? '' : ['III', 'II', 'I'][i % 3] })}<figcaption>${r.n}</figcaption></figure>`).join('')}</div></section>
  <section><h2>Badges · 40 px (liste, en-tête)</h2><div class="ch-row">${RANKS.map((r) => badgeHTML(r.id, { size: 40 })).join('')}</div></section>
  <section><h2>Cadres · saison sur le cadre</h2><div class="ch-grid">${RANKS.map((r, i) => `<figure>${frameHTML({ rank: r.id, season: i < 4 ? 1 : 2, pos: r.id === 'dynasty' ? 7 : undefined, size: 150, avatar: '<span class="ch-face">AR</span>' })}<figcaption>${r.n}</figcaption></figure>`).join('')}</div></section>
  <section><h2>Typographie</h2><p class="ch-disp">12-0 · 9 KO · #23</p><p>Texte Barlow 15 px : un libellé court, une ligne.</p><p class="ch-mono">25 000 $ · 1 017 ELO</p></section>
`;

logoReady.then(() => drawCrest(document.getElementById('ch-cv').getContext('2d'), 120, 120, 110));
