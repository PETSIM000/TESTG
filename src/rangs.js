// Page de démonstration : chaque rang avec son badge et son cadre animés en grand,
// puis le rendu exact du classement ELO. Sert à voir toutes les animations d'un coup.
import './styles/game.css';
import './styles/ranks.css';
import './styles/rangs.css';
import { RANKS, badgeHTML, frameHTML } from './ui/ranks.js';

const range = (i) => {
  const r = RANKS[i];
  const fmt = (n) => n.toLocaleString('fr-CA');
  return i < RANKS.length - 1 ? `${fmt(r.min)} – ${fmt(RANKS[i + 1].min - 1)} ELO` : `${fmt(r.min)} ELO et +`;
};
const kind = (i) => (i >= 4 ? 'Animé + reflet + lueur' : 'Reflet + lueur');

const cards = RANKS.map((r, i) => `
  <article class="rg-card" data-rk="${r.id}" id="${r.id}">
    <header><h2>${r.n}</h2><span>${range(i)}</span><em>${kind(i)}</em></header>
    <div class="rg-pair">
      <figure>${badgeHTML(r.id, { size: 200, div: r.id === 'dynasty' ? '' : 'I' })}<figcaption>Badge</figcaption></figure>
      <figure>${frameHTML({ rank: r.id, season: 1, pos: r.id === 'dynasty' ? 1 : undefined, size: 240, initials: 'MX' })}<figcaption>Cadre</figcaption></figure>
    </div>
  </article>`).join('');

// Démo du classement : un gérant par rang, même balisage que dans le jeu.
const lb = RANKS.slice().reverse().map((r, i) => `
  <div class="rg-row"><span><b>${i + 1}. Gérant ${r.n}</b><br><small>${12 - i}-${i}-0</small></span>
  <span class="lbrk">${badgeHTML(r.id, { size: 46, live: true })}<span><b>${r.min.toLocaleString('fr-CA')}</b><br><small>${r.n}${r.id === 'dynasty' ? '' : ' I'}</small></span></span></div>`).join('');

document.getElementById('rangs').innerHTML = `
  <header class="rg-head"><h1>FIGHT DYNASTY</h1><p>Les 8 rangs : badge et cadre, animations en direct.</p>
    <nav>${RANKS.map((r) => `<a href="#${r.id}">${r.n}</a>`).join('')}<a href="#elo">Classement ELO</a></nav></header>
  ${cards}
  <section class="rg-card" id="elo"><header><h2>Classement ELO</h2><span>Rendu exact du jeu (onglet Gérants)</span></header><div class="rg-lb">${lb}</div></section>
  <p class="rg-foot"><a href="./">← Retour au jeu</a></p>`;
