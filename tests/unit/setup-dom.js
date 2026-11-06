// Charge le markup de index.html dans jsdom avant d'importer le jeu.
import fs from 'node:fs';
const html = fs.readFileSync('index.html', 'utf8');
document.documentElement.innerHTML = html.replace(/<script[\s\S]*?<\/script>/g, '');
window.HTMLCanvasElement.prototype.getContext = () => null;
window.scrollTo = () => {};
window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
// jsdom n'a pas de canvas : un faux contexte 2D suffit au chargement.
globalThis.CanvasRenderingContext2D = class { fillText() {} measureText() { return { width: 0 }; } };
