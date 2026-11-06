// Code du jeu (ancien index.html), regroupé en un seul module en attendant le découpage par domaine.
import * as THREE from 'three';
import { rnd } from '../core/rng.js';
import { drawCrest, logoReady } from '../ui/logo.js';
import { RANKS, rankFromElo, badgeHTML, frameHTML } from '../ui/ranks.js';

// Boutons de langue et d'avis rendus en HTML (ex-onclick inline).
document.addEventListener('click', (e) => {
  const l = e.target.closest && e.target.closest('[data-gl]');
  if (l) { setLang(l.dataset.gl); return; }
  if (e.target.closest && e.target.closest('[data-gfb]')) openFB();
  if (e.target.closest && e.target.closest('[data-upd]')) doUpd();
});

/* ===== langue FR / EN ===== */
let LANG=(()=>{try{return localStorage.getItem('bm_lang')||''}catch(e){return''}})();
const I18N_EN={"🔒 Ton mot de passe est chiffré : personne ne peut le lire. On ne demande ni courriel ni numéro de téléphone. Garde ton mot de passe en lieu sûr : sans courriel, on ne peut pas le récupérer.": "🔒 Your password is encrypted: nobody can read it. We never ask for an email or phone number. Keep your password somewhere safe: without an email, we can't recover it.", "Bâtis une écurie en ligne : un boxeur par catégorie, que tu fais progresser combat après combat contre de vrais gérants. Ton compte marche sur n’importe quel téléphone.": "Build an online stable: one boxer per weight class that you level up fight after fight against real managers. Your account works on any phone.", "Les futurs champions boxent d’abord chez les amateurs. Suis les tournois, envoie tes recruteurs et signe les meilleurs avant les autres promotions (dès 17 ans).": "Future champions box as amateurs first. Follow the tournaments, send your scouts and sign the best before other promotions do (from age 17).", "Points GOAT : victoires, KO, titres, défenses, undisputed (+200), victoires contre des champions, titres dans plusieurs divisions, tournois et récompenses.": "GOAT points: wins, KOs, titles, defences, undisputed (+200), wins over champions, titles in several divisions, tournaments and awards.", ". Adversaires du même poids et de niveau proche. Bats le champion 👑 (#1) en 12 rounds pour lui prendre la ceinture (après 2 combats).": ". Opponents of the same weight and a similar level. Beat the champion 👑 (#1) over 12 rounds to take the belt (after 2 fights).", ", formés chez toi (300 $/sem. chacun). Ils boxent chez les amateurs et passent pros avec toi à 17 ans, gratuitement et ultra loyaux.": ", trained by you ($300/wk each). They box as amateurs and turn pro with you at 17, for free and ultra loyal.", "Tu vends le combat principal toi-même (25 000 $ de production). Payant seulement si le combat principal est très populaire (90+).": "You sell the main event yourself ($25,000 production). Only pays off if the main event is very popular (90+).", "Son contrat se termine cette semaine. Renouvelle-le ou laisse-le partir : la semaine ne peut pas avancer avant ta décision.": "His contract ends this week. Renew it or let him go: the week can't advance until you decide.", "La promotion réserve elle-même des combats pour ses boxeurs libres. Tu peux quand même réserver ceux que tu veux.": "The promotion books fights for its free boxers itself. You can still book the ones you want.", "Équipe tes gants, culottes et entrées dans la fiche de chaque boxeur → 🎨 Style. Le badge s’équipe dans 🏷️ Profil.": "Equip gloves, trunks and entrances in each boxer's page → 🎨 Style. Badges are equipped in 🏷️ Profile.", "💡 En ligne, c’est toi le coin : réagis vite aux moments clés et suis les conseils pour faire pencher le combat.": "💡 Online, you're the corner: react fast at key moments and follow the advice to swing the fight.", "Les champions de chaque catégorie. Ils sont dans Écurie → Amateurs : signe-les avant les autres promotions !": "The champions of each weight class. They're in Stable → Amateurs: sign them before other promotions!", "Pour continuer à gagner de l’XP, il doit battre un mentor de son niveau en 6 rounds. Récompense : +3 points.": "To keep earning XP, he must beat a mentor of his level over 6 rounds. Reward: +3 points.", "), seulement ceux qu’il peut affronter maintenant. Les champions apparaissent quand il est dans le top 10.": "), only the ones he can fight right now. Champions appear once he's in the top 10.", "Avant de passer une semaine ou d’aller au combat, te prévenir s’il reste des choses importantes à faire.": "Before skipping a week or going to a fight, warn you if important things are left to do.", "· chance de gagner son pouvoir mythique, puis ses 2 pouvoirs exclusifs deviennent possibles aux tirages": "· chance to win its mythic power, then its 2 exclusive powers become possible in rolls", "Tu n’as pas encore de titre. Ils se débloquent dans la passe de saison (paliers 3, 8, 13, 18, 23, 28).": "You don't have a title yet. They unlock in the season pass (tiers 3, 8, 13, 18, 23, 28).", "Personne pour l’instant. Dans la fiche d’un boxeur de 30 ans ou plus : Contrat → Prendre sa retraite.": "Nobody yet. In the page of a boxer aged 30 or more: Contract → Retire.", "⚠️ Sauvegardée seulement sur ce téléphone. Connecte-toi au mode En ligne pour la relier à ton compte.": "⚠️ Saved only on this phone. Log in to Online mode to link it to your account.", "Tu paies son club, puis tu négocies son salaire. Le prix suit sa note, ses abonnés et ses ceintures.": "You pay his club, then negotiate his salary. The price follows his rating, followers and belts.", "Les boxeurs de tes amis apparaissent en premier quand tu cherches un combat dans leur catégorie.": "Your friends' boxers show up first when you look for a fight in their weight class.", "Touche Envoyer, puis choisis la personne qui t’a envoyé le jeu (Messages, WhatsApp, Messenger…).": "Tap Send, then pick the person who sent you the game (Messages, WhatsApp, Messenger…).", "Aucun combat. Ajoute au moins un combat, sinon le gala est annulé (50 % de la location perdue).": "No fights. Add at least one fight, or the gala is cancelled (50% of the rental lost).", "Exclusif au GOAT. +7 % de précision, +15 % de dégâts, reçoit 15 % moins, +20 % de knockdowns.": "GOAT exclusive. +7% accuracy, +15% damage, takes 15% less, +20% knockdowns.", "Exclusif à Viktor Volkov. Reçoit 20 % moins, presque impossible à garder au sol, +8 de vie.": "Viktor Volkov exclusive. Takes 20% less, almost impossible to keep down, +8 health.", "Exclusif à Hans Krüger. +18 % de dégâts, +35 % de knockdowns, coups à la tête plus forts.": "Hans Krüger exclusive. +18% damage, +35% knockdowns, stronger head shots.", "Exclusif à Marcus King. +12 % de dégâts, +25 % pour finir, crochets à la tête plus forts.": "Marcus King exclusive. +12% damage, +25% to finish, stronger hooks to the head.", "Pour aller plus vite, utilise ×2 ou ×4 en haut. Les moments clés apparaissent quand même.": "To go faster, use ×2 or ×4 at the top. Key moments still show up.", "! 8 boxeurs, 3 tours sur la saison. Accepte ou refuse : rien ne se fait sans ton accord.": "! 8 boxers, 3 rounds over the season. Accept or decline: nothing happens without your OK.", "Exclusif à Marcus King. +14 % de dégâts, +30 % pour finir, +5 % de précision et cardio.": "Marcus King exclusive. +14% damage, +30% to finish, +5% accuracy and cardio.", "Exclusif à Rosario Vega. +30 % pour finir un adversaire ébranlé, +15 % de knockdowns.": "Rosario Vega exclusive. +30% to finish a hurt opponent, +15% knockdowns.", "S’il accepte, son combat contre cet adversaire est placé tout de suite au calendrier.": "If he accepts, his fight against this opponent is added to the calendar right away.", "Chaque stat va de 40 à 60 au départ. Tu gagnes 4 points à chaque niveau, jusqu’à 95.": "Each stat starts between 40 and 60. You get 4 points per level, up to 95.", "Ses stats exactes et son potentiel sont inconnus. Envoie un recruteur le voir boxer.": "His exact stats and potential are unknown. Send a scout to watch him box.", "par stat (selon le potentiel). Au-delà de 70, puis 85, chaque point coûte plus cher.": "per stat (depending on potential). Past 70, then 85, each point costs more.", "Exclusif à Big Mike Duvall. +55 % de knockdowns, +12 % de dégâts et attaque plus.": "Big Mike Duvall exclusive. +55% knockdowns, +12% damage and attacks more.", "Exclusif à Viktor Volkov. Reçoit 18 % moins, se relève beaucoup mieux, +5 de vie.": "Viktor Volkov exclusive. Takes 18% less, gets up much better, +5 health.", "Afficher le % de victoire à la réservation, dans le camp et pendant les combats.": "Show the win % when booking, in camp and during fights.", "Exclusif à Rosario Vega. +40 % pour finir, +10 % de dégâts, +20 % de knockdowns.": "Rosario Vega exclusive. +40% to finish, +10% damage, +20% knockdowns.", "Gros chèque d’une grande chaîne, seulement pour une carte de 110+ de popularité.": "Big cheque from a major network, only for a card with 110+ popularity.", "contrat à la fois. Tu as 7 jours pour le remplir. Nouvelles offres chaque jour.": "contract at a time. You have 7 days to complete it. New offers every day.", "Diffusé sur ta chaîne : pas de droits à payer, et ça fait grimper tes abonnés.": "Aired on your channel: no rights to pay, and it grows your subscribers.", "+12 % d’XP par étoile, conseils pendant le combat et évaluation du potentiel.": "+12% XP per star, advice during the fight and potential evaluation.", "+5 % de précision, +14 % de dégâts, reçoit 12 % moins et +20 % de knockdowns.": "+5% accuracy, +14% damage, takes 12% less and +20% knockdowns.", "Exclusif à Seamus O’Hara. +12 % de dégâts, +20 % de knockdowns et coupe plus.": "Seamus O’Hara exclusive. +12% damage, +20% knockdowns and cuts more.", "Personne dans ton coin. Engage un entraîneur-chef pour recevoir des conseils.": "Nobody in your corner. Hire a head coach to get advice.", "Exclusif à Hans Krüger. Reçoit 12 % moins, +10 % de dégâts, se relève mieux.": "Hans Krüger exclusive. Takes 12% less, +10% damage, gets up better.", "Exclusif à Li Wei. +50 % de knockdowns, +14 % de dégâts, coupe et précision.": "Li Wei exclusive. +50% knockdowns, +14% damage, cuts and accuracy.", "Exclusif à Seamus O’Hara. +16 % de dégâts, +30 % de knockdowns et +5 de vie.": "Seamus O’Hara exclusive. +16% damage, +30% knockdowns and +5 health.", "Exclusif à Takeshi Mori. +16 % de coups, +6 % de précision et esquive mieux.": "Takeshi Mori exclusive. +16% punches, +6% accuracy and dodges better.", "Sans entraîneur-chef, pas de vrai rapport. Engage-en un dans l’onglet Staff.": "Without a head coach, no real report. Hire one in the Staff tab.", "S’essouffle 25 % moins vite, +5 % d’énergie et +4 % de vie entre les rounds.": "Tires 25% slower, +5% energy and +4% health between rounds.", "Exclusif à Ángel Ríos. +8 % de précision, esquive 9 % mieux, +6 % de coups.": "Ángel Ríos exclusive. +8% accuracy, dodges 9% better, +6% punches.", "Pas encore d’amis. Envoie ton code à tes amis, ou entre le leur ci-dessus.": "No friends yet. Send your code to your friends, or enter theirs above.", ". Sous 40 % de préparation, il risque de rater le poids (amende de 20 %).": ". Under 40% preparation, he may miss weight (20% fine).", "Aucun boxeur. Change le gym d’un boxeur depuis sa fiche (onglet Contrat).": "No boxers. Change a boxer's gym from his page (Contract tab).", "Exclusif au GOAT. +5 % de précision, +12 % de dégâts, reçoit 12 % moins.": "GOAT exclusive. +5% accuracy, +12% damage, takes 12% less.", "Exclusif à Li Wei. +40 % de knockdowns, +10 % de dégâts, coupe beaucoup.": "Li Wei exclusive. +40% knockdowns, +10% damage, cuts a lot.", "Il cherche ses mots… Un meilleur entraîneur donnerait de vrais conseils.": "He's searching for words… A better coach would give real advice.", "Les 💰 se gagnent surtout ici. Un combat n’en rapporte que quelques-unes.": "💰 are mostly earned here. A fight only gives a few.", ") et entre au Temple de la renommée. Il est disponible comme entraîneur": ") and enters the Hall of Fame. He's available as a coach", "Exclusif à Takeshi Mori. Lance 14 % plus de coups et +5 % de précision.": "Takeshi Mori exclusive. Throws 14% more punches and +5% accuracy.", "Reçoit 15 % moins de dégâts, tombe 30 % moins souvent, +5 % de dégâts.": "Takes 15% less damage, goes down 30% less often, +5% damage.", "Soins d’élite : guérison immédiate. Cryothérapie : forme remise à 100.": "Elite care: instant healing. Cryotherapy: form reset to 100.", "Tu testes le jeu avant sa sortie. Dis franchement ce que tu en penses.": "You're testing the game before release. Tell us honestly what you think.", "+12 % de dégâts, +8 % en forme et +15 % contre un adversaire ébranlé.": "+12% damage, +8% when fresh and +15% against a hurt opponent.", "Ceinture vacante : elle ira au meilleur boxeur d’ici qui a 3 combats.": "Vacant belt: it will go to the best local boxer with 3 fights.", "Interviews, commanditaires, jeunes espoirs, provocations et imprévus.": "Interviews, sponsors, young prospects, trash talk and surprises.", "Une plateforme paie des droits fixes si la carte a 70+ de popularité.": "A platform pays fixed rights if the card has 70+ popularity.", "+20 % de dégâts contre un adversaire ébranlé et +10 % de knockdowns.": "+20% damage against a hurt opponent and +10% knockdowns.", "Des espoirs de ton pays arrivent chaque mois chez les agents libres.": "Prospects from your country join the free agents every month.", "dans la course ! Son combat se place tout seul dans ton calendrier.": "in the race! His fight is added to your calendar automatically.", "+4 % de précision, +10 % de dégâts et reçoit 10 % moins de dégâts.": "+4% accuracy, +10% damage and takes 10% less damage.", "Exclusif à Big Mike Duvall. +40 % de knockdowns et +8 % de dégâts.": "Big Mike Duvall exclusive. +40% knockdowns and +8% damage.", "Message copié ! Colle-le dans Messages ou WhatsApp pour l’envoyer.": "Message copied! Paste it in Messages or WhatsApp to send it.", "Récupère 8 % de vie entre les rounds et +10 % de dégâts en danger.": "Recovers 8% health between rounds and +10% damage when in danger.", "Tous les boxeurs de cette organisation ont déjà un combat prévu. 👊": "Every boxer in this organization already has a fight booked. 👊", "Tu pourras changer de région 7 jours après ton dernier changement.": "You can change region 7 days after your last change.", "ne s’est pas battu à temps : pénalité de 8 000 $ du commanditaire.": "didn't fight in time: $8,000 penalty from the sponsor.", "Nom d’utilisateur : 3 à 16 caractères (lettres, chiffres, _ . -).": "Username: 3 to 16 characters (letters, numbers, _ . -).", "Ton écurie est vide. Va dans Agents libres pour signer un boxeur.": "Your stable is empty. Go to Free agents to sign a boxer.", "+6 % de précision, l’adversaire −6 % et lance 6 % plus de coups.": "+6% accuracy, opponent −6% and throws 6% more punches.", "Meilleure récupération entre les rounds et guérison plus rapide.": "Better recovery between rounds and faster healing.", "Pas de récompense cette année. Plus de victoires l’an prochain !": "No reward this year. More wins next year!", "S’essouffle 20 % moins vite pendant le combat. Non remboursable.": "Tires 20% slower during the fight. Non-refundable.", "25 000 $ et un vieil entraîneur bénévole. L’expérience prévue.": "$25,000 and an old volunteer coach. Experience required.", "Agrandis le gym principal avec les vestiaires (Installations).": "Expand your main gym with the locker rooms (Facilities).", "Exclusif à Ángel Ríos. +7 % de précision et esquive 7 % mieux.": "Ángel Ríos exclusive. +7% accuracy and dodges 7% better.", "Il ne peut pas se battre avant la fin du camp. Ensuite : +4 en": "He can't fight until the camp ends. Then: +4 in", "S’essouffle 15 % moins vite et récupère 2 % d’énergie de plus.": "Tires 15% slower and recovers 2% more energy.", "Victoire si le combat était ce soir (forme et prépa actuelles)": "Win chance if the fight were tonight (current form and prep)", "Aucun trait. Un nouveau trait se débloque tous les 5 niveaux.": "No traits. A new trait unlocks every 5 levels.", "Gagner sans aller au tapis, adversaire sous 25 % de précision": "Win without going down, opponent under 25% accuracy", "Rapports de repérage complets et plan de match plus efficace.": "Full scouting reports and a more effective game plan.", "Voir les deux boxeurs s’affronter sur le ring, coup par coup.": "Watch both boxers face off in the ring, punch by punch.", "Arrête vite : plus de TKO quand un boxeur est en difficulté.": "Stops it fast: more TKOs when a boxer is in trouble.", "Débloque le plan Sparring. +15 % d’XP par étoile. Jusqu’à 2.": "Unlocks the Sparring plan. +15% XP per star. Up to 2.", "La capitale de la boxe : billets chers et vente PPV boostée.": "The boxing capital: pricey tickets and boosted PPV sales.", "Prêt à gagner tout de suite, mais il progressera peu (limite": "Ready to win right now, but he'll improve little (limit", "Viens boxer contre moi sur FIGHT DYNASTY 🥊 ! Mon code ami :": "Come box against me on FIGHT DYNASTY 🥊! My friend code:", "+18 % de revenus de billets si la salle est à moitié pleine": "+18% ticket revenue if the venue is half full", "Il est en camp : l’intensité se règle dans l’écran du camp.": "He's in camp: intensity is set in the camp screen.", "Nom (3+ lettres) et tag (2 à 4 lettres ou chiffres) requis.": "Name (3+ letters) and tag (2 to 4 letters or numbers) required.", "Ring et boxeurs en 3D. Désactive si ton téléphone ralentit.": "3D ring and boxers. Turn off if your phone slows down.", "Ton boxeur applique automatiquement la consigne conseillée.": "Your boxer automatically follows the recommended instruction.", "Ton public. Les boxeurs de ton pays attirent plus de monde.": "Your crowd. Boxers from your country draw more people.", "Très attentive aux coupures : arrêts médicaux plus rapides.": "Very careful with cuts: faster medical stoppages.", "Tu as déjà un commanditaire. Termine ou quitte ton contrat.": "You already have a sponsor. Finish or leave your contract.", "sem.). Chaque semaine blessé fait perdre de la préparation.": "wk). Each week injured costs preparation.", "+3 % de précision contre cet adversaire. Non remboursable.": "+3% accuracy against this opponent. Non-refundable.", "+45 % de knockdowns, +10 % de dégâts et +50 % de coupures.": "+45% knockdowns, +10% damage and +50% cuts.", "sem.). Il ne peut pas signer de combat avant d’être guéri.": "wk). He can't sign a fight until he's healed.", "/sem. Dans tes galas, choisis la diffusion « Ta chaîne ».": "/wk. In your galas, pick the « Your channel » broadcast.", "PPV : combat principal pas assez populaire, pas d’achats.": "PPV: main event not popular enough, no buys.", "Tu réserves toi-même tous les combats de cette promotion.": "You book every fight of this promotion yourself.", "avait promis un KO… les médias se moquent. −4 popularité.": "promised a KO… the media mock him. −4 popularity.", "est épuisé : repos automatique jusqu’à ce qu’il récupère.": "is exhausted: automatic rest until he recovers.", "par stat avec l’entraînement. C’est un pari sur l’avenir.": "per stat with training. It's a bet on the future.", "Badges aux paliers 5, 10, 15, 20, 25 et 30 de la passe :": "Badges at pass tiers 5, 10, 15, 20, 25 and 30:", "Les 3 emplacements sont pris. Choisis celui à remplacer.": "All 3 slots are taken. Choose the one to replace.", "Reçoit 15 % moins de dégâts et tombe 25 % moins souvent.": "Takes 15% less damage and goes down 25% less often.", "Débloque des titres aux paliers 3, 8, 13, 18, 23 et 28.": "Unlocks titles at tiers 3, 8, 13, 18, 23 and 28.", "L’adversaire est 5 % moins précis et +2 % de précision.": "The opponent is 5% less accurate and +2% accuracy.", "Mot de passe : au moins 8 caractères, différent du nom.": "Password: at least 8 characters, different from the name.", "Petits droits télé, dès que la carte est un peu connue.": "Small TV rights, as soon as the card is a bit known.", "Écurie pleine : agrandis les vestiaires ou ouvre un gym": "Stable full: expand the locker rooms or open a gym", "+1 seconde pour réagir et bonus de réaction plus fort.": "+1 second to react and a stronger reaction bonus.", "Laisse se battre : plus de remontées et de KO tardifs.": "Lets them fight: more comebacks and late KOs.", "choisit chaque semaine selon la forme et l’adversaire.": "picks each week based on form and opponent.", "−12 % de blessures et guérison plus rapide par niveau.": "−12% injuries and faster healing per level.", "+15 % de dégâts en danger et lance 3 % plus de coups.": "+15% damage when in danger and throws 3% more punches.", "Choisis un plan : le bon plan donne un gros avantage.": "Pick a plan: the right plan gives a big edge.", "Aucune catégorie en commun pour un combat en direct.": "No weight class in common for a live fight.", "Ce boxeur a déjà affronté cette légende aujourd’hui.": "This boxer already fought this legend today.", "C’est un cogneur. Reste mobile et punis ses entrées.": "He's a puncher. Stay mobile and punish his entries.", "Foule bruyante, parfaite pour les boxeurs canadiens.": "Loud crowd, perfect for Canadian boxers.", "Le président ou un recruteur peut lancer une guerre.": "The president or a recruiter can start a war.", "👑 Compte administrateur : tout est gratuit pour toi.": "👑 Admin account: everything is free for you.", "Touche une semaine à venir, puis choisis la séance.": "Tap an upcoming week, then pick the session.", "⚡ Dépenser tous les points de stats automatiquement": "⚡ Spend all stat points automatically", "+10 % de préparation par niveau pendant les camps.": "+10% preparation per level during camps.", "2 boxeurs confirmés de haut niveau (note 70 à 80).": "2 proven high-level boxers (rating 70 to 80).", "Aucune victoire cette semaine. Allez, au travail !": "No wins this week. Come on, get to work!", "Bonus doublé quand tu suis le conseil de ton coin.": "Bonus doubled when you follow your corner's advice.", "Libère des salaires ou décroche une grosse bourse.": "Free up salaries or land a big purse.", "−12 % de fatigue par étoile et moins de blessures.": "−12% fatigue per star and fewer injuries.", "+12 % de dégâts tant qu’il a plus de 70 % de vie.": "+12% damage while he has more than 70% health.", "+15 % de dégâts et +25 % de chances de knockdown.": "+15% damage and +25% knockdown chance.", "/250 XP de saison · gagne des combats pour monter": "/250 season XP · win fights to level up", "C’est ma dernière offre : à prendre ou à laisser.": "This is my final offer: take it or leave it.", "Maximum 3 combats par jour contre le même boxeur.": "Maximum 3 fights per day against the same boxer.", "Mon agent rigole encore. Reviens avec du sérieux.": "My agent is still laughing. Come back with something serious.", "Séances Cardio, Repos et Affûtage plus efficaces.": "Cardio, Rest and Sharpening sessions more effective.", "boxeurs sont à vendre : rachète la promotion pour": "boxers are for sale: buy the promotion for", "🤖 Aucun joueur libre à ton niveau : adversaire IA": "🤖 No free player at your level: AI opponent", "Académie pleine. Agrandis-la dans Installations.": "Academy full. Expand it in Facilities.", "Il travaille au corps pour user ses adversaires.": "He works the body to wear opponents down.", "Laisse un peu plus de chances au boxeur ébranlé.": "Gives a hurt boxer a bit more of a chance.", "Le plus d’XP. Demande un partenaire de sparring.": "The most XP. Requires a sparring partner.", "On perd aux points. Il faut prendre des risques.": "We're losing on points. We have to take risks.", "Récupère 3 % d’énergie de plus entre les rounds.": "Recovers 3% more energy between rounds.", "Sa garde est fermée en haut. Travaille au corps.": "His guard is tight up top. Work the body.", "ferme ses portes : ses boxeurs signent ailleurs.": "closes its doors: its boxers sign elsewhere.", "−7 % sur les salaires et l’entretien par niveau.": "−7% on salaries and upkeep per level.", "+10 % de dégâts, mais lance 3 % moins de coups.": "+10% damage, but throws 3% fewer punches.", "+25 % de dégâts quand l’adversaire est ébranlé.": "+25% damage when the opponent is hurt.", "Article premium : débloque-le dans la boutique.": "Premium item: unlock it in the shop.", "Ce boxeur a déjà fait le tournoi cette semaine.": "This boxer already did the tournament this week.", "amateurs passent pros chez d’autres promotions.": "amateurs turn pro with other promotions.", "! Victoire après sa blessure : +8 % d’abonnés.": "! Win after his injury: +8% followers.", "+10 % sur les revenus de tes galas par niveau.": "+10% on your gala revenue per level.", ". Le titre ne change de main que si on le bat.": ". The title only changes hands if he's beaten.", "10 000 $ et aucun staff. Chaque dollar compte.": "$10,000 and no staff. Every dollar counts.", "3 jeunes de 17 à 19 ans à très fort potentiel.": "3 youngsters aged 17 to 19 with very high potential.", "50 000 $ en caisse et un entraîneur 2 étoiles.": "$50,000 in the bank and a 2-star coach.", ": tu la retrouves sur n’importe quel appareil.": ": you'll find it on any device.", "Lance 12 % plus de coups et +3 % de précision.": "Throws 12% more punches and +3% accuracy.", "Ses coups au corps vident 50 % plus d’énergie.": "His body shots drain 50% more energy.", "Trop d’essais ratés. Réessaie dans 15 minutes.": "Too many failed attempts. Try again in 15 minutes.", "Tu mènes. Boxe intelligemment, pas de bêtises.": "You're ahead. Box smart, no mistakes.", "Un des boxeurs n’est plus libre : défi annulé.": "One of the boxers is no longer available: challenge cancelled.", "te lance un défi Club contre Club : 3 combats,": "challenges you to a Club vs Club fight: 3 bouts,", "☁️ Sauvegarde automatique, reliée à ton compte": "☁️ Auto-save, linked to your account", "🏛️ Prendre sa retraite (Temple de la renommée)": "🏛️ Retire (Hall of Fame)", "! +3 points de stats. La progression reprend.": "! +3 stat points. Progress resumes.", ". Nouvel essai possible la semaine prochaine.": ". New attempt possible next week.", "Attends quelques secondes entre deux combats.": "Wait a few seconds between two fights.", "Bats la légende précédente pour la débloquer.": "Beat the previous legend to unlock it.", "Beaucoup d’XP, fatigue et risque de blessure.": "Lots of XP, fatigue and injury risk.", "Les adversaires les plus proches de sa note (": "The opponents closest to his rating (", "Pas assez de participants dans cette division": "Not enough entrants in this division", "Plus précis contre un adversaire qui attaque.": "More accurate against an opponent who attacks.", "Ton boxeur est blessé : impossible de signer.": "Your boxer is injured: can't sign.", "Ton boxeur est épuisé : laisse-le se reposer.": "Your boxer is exhausted: let him rest.", "est champion undisputed (WBC, WBA, WBO, IBF).": "is undisputed champion (WBC, WBA, WBO, IBF).", "💰. Ensuite c’est à toi pour tous tes boxeurs.": "💰. After that it's on you for all your boxers.", "Agents libres et staff de meilleure qualité.": "Better free agents and staff.", "Aucun boxeur de ce pays dans cette division.": "No boxer from this country in this division.", "Choisis d’abord un boxeur dans « Réserver ».": "First pick a boxer in « Book ».", "C’est une blague ? Tu me manques de respect.": "Is this a joke? You're disrespecting me.", "Nom d’utilisateur ou mot de passe incorrect.": "Wrong username or password.", "Pour ce pays : ceinture nationale seulement.": "For this country: national belt only.", "+1,5 % de précision et l’adversaire −1,5 %.": "+1.5% accuracy and opponent −1.5%.", "+2,5 % de précision et l’adversaire −1,5 %.": "+2.5% accuracy and opponent −1.5%.", "Les deux mots de passe ne sont pas pareils.": "The two passwords don't match.", "Plus de moral et de loyauté chaque semaine.": "More morale and loyalty every week.", "Ton boxeur est blessé : il doit se reposer.": "Your boxer is injured: he must rest.", "Tu as déjà un boxeur dans chaque catégorie.": "You already have a boxer in every weight class.", "Un futur champion du monde si tout va bien.": "A future world champion if all goes well.", "est à toi ! Gère ses boxeurs dans l’Écurie.": "is yours! Manage its boxers in the Stable.", "ex. Club international, on vise le top 10 !": "e.g. International club, aiming for the top 10!", ". Un nouveau point d’atout est disponible.": ". A new perk point is available.", "Déjà solide, il peut encore monter jusqu’à": "Already solid, he can still climb up to", "Joue quelques combats pour voir ta courbe.": "Play a few fights to see your curve.", "La loyauté monte plus vite chaque semaine.": "Loyalty grows faster every week.", "Les salles débordent. Billets moins chers.": "Packed venues. Cheaper tickets.", "Plus précis contre un adversaire agressif.": "More accurate against an aggressive opponent.", "Tu as déjà un boxeur dans cette catégorie.": "You already have a boxer in this weight class.", "Vérification anti-robot échouée. Réessaie.": "Anti-bot check failed. Try again.", "est mécontent et réclame une augmentation.": "is unhappy and wants a raise.", "· L’arbitre arrête le combat pour protéger": "· The referee stops the fight to protect", "⚔️ Défi accepté ! 3 combats au calendrier.": "⚔️ Challenge accepted! 3 fights on the calendar.", "). Choisis ton boxeur puis un adversaire.": "). Pick your boxer then an opponent.", "). Revends-en une pour racheter celle-ci.": "). Sell one to buy this one.", "Protège ses boxeurs, choisit ses combats.": "Protects his boxers, picks his fights.", "Récupère plus d’énergie entre les rounds.": "Recovers more energy between rounds.", "est blessé : reporte ou annule le combat.": "is injured: postpone or cancel the fight.", "+8 % sur la part des bourses par niveau.": "+8% on purse share per level.", "Invitation à la Super Série sans réponse": "Super Series invitation without an answer", "Pas de connexion : on réessaie plus tard": "No connection: we'll try again later", "Prépare vite, mais fatigue et blessures.": "Fast prep, but fatigue and injuries.", "Quitte ton club pour rejoindre celui-ci.": "Leave your club to join this one.", "victoires du club). +100 000 $, +300 XP.": "club wins). +$100,000, +300 XP.", "À jour · même si tu changes de téléphone": "Up to date · even if you change phones", "+20 % de dégâts quand il est en danger.": "+20% damage when he's in danger.", ": tous les participants seront évalués.": ": all entrants will be evaluated.", "Combat annulé : l’adversaire est parti.": "Fight cancelled: the opponent left.", "Encaisse beaucoup mieux les gros coups.": "Takes big shots much better.", "Il est en camp pour un combat officiel.": "He's in camp for an official fight.", "Sa loyauté baisse deux fois moins vite.": "His loyalty drops half as fast.", "Suit l’argent : PPV et grandes chaînes.": "Follows the money: PPV and major networks.", "Ton rôle dans le club ne permet pas ça.": "Your club role doesn't allow that.", "Touche encore pour écraser cette partie": "Tap again to overwrite this save", "Trop de tentatives. Réessaie plus tard.": "Too many attempts. Try again later.", "Tu manques d’air. Ralentis et récupère.": "You're out of breath. Slow down and recover.", "+30 % de knockdowns et +4 % de dégâts.": "+30% knockdowns and +4% damage.", "+60 % de chances d’ouvrir une coupure.": "+60% chance to open a cut.", ", formé à ton académie, passe pro avec": ", trained at your academy, turns pro with", "Adore les gros galas et le trash-talk.": "Loves big galas and trash talk.", "Aucun club disponible pour une guerre.": "No club available for a war.", "Beaucoup plus de chances de knockdown.": "Much higher knockdown chance.", "Boxeur complet, sans grosse faiblesse.": "Complete boxer, no big weakness.", "Calcul des chances en cours, réessaie.": "Calculating odds, try again.", "Confirmer l’annulation (popularité −3)": "Confirm the cancellation (popularity −3)", "Il est ébranlé ! Va chercher l’arrêt !": "He's hurt! Go for the stoppage!", "Jeune et brut : il peut monter jusqu’à": "Young and raw: he can climb up to", "Personne de disponible pour l’instant.": "Nobody available right now.", "Résiste beaucoup mieux aux gros coups.": "Withstands big shots much better.", "Sa loyauté chute vite quand ça va mal.": "His loyalty drops fast when things go wrong.", "Ton boxeur est en camp d’entraînement.": "Your boxer is in training camp.", ". Une revanche paierait 50 % de plus.": ". A rematch would pay 50% more.", "Accepte tous les défis, même risqués.": "Accepts every challenge, even risky ones.", "Aucun combat en ligne pour l’instant.": "No online fights yet.", "Bon équilibre préparation et fatigue.": "Good balance of preparation and fatigue.", "Cet adversaire n’est plus disponible.": "This opponent is no longer available.", "Gagner avec plus de 35 % de précision": "Win with more than 35% accuracy", "Gagner par arrêt en 3 rounds ou moins": "Win by stoppage in 3 rounds or less", "Il doit avoir 17 ans pour passer pro.": "He must be 17 to turn pro.", "Maximum 80 combats en ligne par jour.": "Maximum 80 online fights per day.", "Récupère 6 % de vie entre les rounds.": "Recovers 6% health between rounds.", "ne répond plus · Réclamer la victoire": "isn't responding · Claim the win", "· tu n’as pas de boxeur dans ce poids": "· you have no boxer at this weight", "📅 Défis de la semaine · nouveaux dans": "📅 Weekly challenges · new ones in", "+2 % de précision et +2 % de dégâts.": "+2% accuracy and +2% damage.", "+4 % de précision et +5 % de dégâts.": "+4% accuracy and +5% damage.", "+80 % de coupures et +3 % de dégâts.": "+80% cuts and +3% damage.", ": aucune défense depuis 26 semaines.": ": no defence in 26 weeks.", "Atteindre une demi-finale de tournoi": "Reach a tournament semi-final", "Entrer dans le top 10 de sa division": "Enter his division's top 10", "Gagner 3 combats officiels d’affilée": "Win 3 official fights in a row", "Lancer 450 coups dans un même combat": "Throw 450 punches in a single fight", "Ta session a expiré. Reconnecte-toi.": "Your session expired. Log in again.", "Tu es touché ! Couvre-toi et survis.": "You're hurt! Cover up and survive.", "Un combat officiel t’attend d’abord.": "An official fight is waiting first.", "encaisse lourd, son coin s’inquiète.": "is taking heavy shots, his corner is worried.", "💨 Ta série de victoires est terminée": "💨 Your win streak is over", "🔧 Ce qu’il faut améliorer ou ajouter": "🔧 What should be improved or added", "(Plan de départ|Consigne en direct)": "(Starting plan|Live instruction)", "Bats d’abord la légende précédente.": "Beat the previous legend first.", "Boutique de produits dérivés niveau": "Merchandise shop level", "Ce boxeur a déjà toute son énergie.": "This boxer already has full energy.", "Ce nom d’utilisateur est déjà pris.": "This username is already taken.", "Ceintures conservées pour l’instant": "Belts kept for now", "Faire 3 séances de sparring en camp": "Do 3 sparring sessions in camp", "Fait grandir ses boxeurs lentement.": "Develops his boxers slowly.", "Laisser venir et punir ses entrées.": "Let him come and punish his entries.", "Le serveur ne répond pas. Réessaie.": "The server isn't responding. Try again.", "Pas assez d’argent pour cette prime": "Not enough money for this bonus", "Pas de boxeur dans cette catégorie.": "No boxer in this weight class.", "Préparation lente, il arrive frais.": "Slow prep, he arrives fresh.", "Seulement si tu as battu la légende": "Only if you've beaten the legend", "Une construction est déjà en cours.": "A construction is already in progress.", "User l’adversaire pour le ralentir.": "Wear the opponent down to slow him.", "Victoire : l’adversaire a abandonné": "Win: the opponent quit", "avait annoncé un KO. +6 popularité.": "had announced a KO. +6 popularity.", "gagne par arrêt médical (coupure de": "wins by medical stoppage (cut on", "pour évaluer tous les participants.": "to evaluate all entrants.", "10 boxeurs historiques à affronter": "10 historic boxers to face", "Commence une nouvelle carrière ici": "Start a new career here", "Défi Club contre Club sans réponse": "Club vs Club challenge without an answer", "Il recule, garde haute, et contre.": "He backs up, guard high, and counters.", "L’adversaire est 2 % moins précis.": "The opponent is 2% less accurate.", "L’adversaire est 3 % moins précis.": "The opponent is 3% less accurate.", "L’adversaire est 4 % moins précis.": "The opponent is 4% less accurate.", "On attend sa réponse… (expire dans": "Waiting for his answer… (expires in", "Ton offre par rapport à sa demande": "Your offer compared to his demand", "Un membre du staff quitte le club.": "A staff member leaves the club.", "Un seul camp toutes les 12 heures.": "Only one camp every 12 hours.", "est ébranlé, les jambes flanchent.": "is hurt, his legs are buckling.", "prime de signature · contrat 3 ans": "signing bonus · 3-year contract", "% d’XP pour les boxeurs de ce gym": "% XP for boxers at this gym", "+5 % de spectateurs, +commandites": "+5% spectators, +sponsors", ">🔍 Envoyer un recruteur · 5 000 $": ">🔍 Send a scout · $5,000", "Arbitre classique, sans surprise.": "Classic referee, no surprises.", "Avec tout ce que j’apporte ? Non.": "With everything I bring? No.", "Les plus grosses foules d’Europe.": "The biggest crowds in Europe.", "Pas assez d’argent pour le rachat": "Not enough money for the buyout", "Peu d’XP, presque pas de fatigue.": "Little XP, almost no fatigue.", "boxeurs passent sous ta bannière.": "boxers come under your banner.", "il ne fait plus confiance au club": "he no longer trusts the club", "kg). Amende de 20 % de la bourse.": "kg). 20% purse fine.", "ne se relève pas. C’est terminé !": "doesn't get up. It's over!", "résultats dans Écurie → Amateurs.": "results in Stable → Amateurs.", "🔴 EN DIRECT contre un vrai joueur": "🔴 LIVE against a real player", "+2 places de boxeur dans ce gym.": "+2 boxer slots at this gym.", "Annuler le camp (50 % remboursé)": "Cancel the camp (50% refunded)", "Aucun changement pour l’instant.": "No changes for now.", "Champion du monde (une ceinture)": "World champion (one belt)", "Dernière semaine : frais et vif.": "Last week: fresh and sharp.", "Le médecin examine la coupure de": "The doctor checks the cut of", "On se rapproche. Fais un effort.": "We're getting closer. Make an effort.", "Pas assez d’argent pour la prime": "Not enough money for the bonus", "Préparation normale, sans frais.": "Normal preparation, no cost.", "Public fidèle, gros marché télé.": "Loyal crowd, big TV market.", "Rapport du recruteur · potentiel": "Scout report · potential", "Récupère mieux entre les rounds.": "Recovers better between rounds.", "Répartition des points invalide.": "Invalid point distribution.", "doit réussir l’épreuve du niveau": "must pass the level test", "quitte le club : fin de contrat.": "leaves the club: end of contract.", "☀️ Défis du jour · nouveaux dans": "☀️ Daily challenges · new ones in", "⚔️ Tu gagnes le Club contre Club": "⚔️ You win the Club vs Club", "+ le trophée pour le vainqueur.": "+ the trophy for the winner.", "+10 % de popularité de la carte": "+10% card popularity", "24 % par heure (boost ×2 actif)": "24% per hour (×2 boost active)", "Aucun ami dans cette catégorie.": "No friends in this weight class.", "Aucune médaille pour l’instant.": "No medals yet.", "Battre un adversaire mieux noté": "Beat a higher-rated opponent", "Big Earl « Laisse-aller » Jones": "Big Earl « Let-it-go » Jones", "Ce boxeur n’a plus la ceinture.": "This boxer no longer has the belt.", "Ce nom ou ce tag est déjà pris.": "This name or tag is already taken.", "Devenir champion de sa division": "Become champion of his division", "Dre Sophie « Protectrice » Côté": "Dr. Sophie « Protector » Côté", "Gagner après être allé au tapis": "Win after being knocked down", "Gala créé ! Ajoute des combats.": "Gala created! Add fights.", "Il est méfiant et demande plus.": "He's wary and asks for more.", "Il est vidé. Mets la pression !": "He's drained. Put on the pressure!", "Le club est lourdement endetté.": "The club is deep in debt.", "Rien à faire. Bravo, gérant ! 👊": "Nothing to do. Well done, manager! 👊", "Récupère la forme, prépare peu.": "Recovers form, little prep.", "est coupé à l’arcade ! (coupure": "is cut over the eye! (cut", "kg. Amende : 20 % de la bourse.": "kg. Fine: 20% of the purse.", "(écurie pleine pour l’instant)": "(stable full for now)", "+1 place de boxeur par niveau.": "+1 boxer slot per level.", "+15 % de chances de knockdown.": "+15% knockdown chance.", "Championnats du monde amateurs": "Amateur World Championships", "Endurance : s’essouffle moins.": "Stamina: tires less.", "Jab, mobilité, le garder loin.": "Jab, movement, keep him at range.", "Plus longue série de victoires": "Longest win streak", "Récupère la forme et le moral.": "Recovers form and morale.", "Ton message part directement à": "Your message goes straight to", "des points de stats à dépenser": "stat points to spend", "devient champion intérimaire (": "becomes interim champion (", "entre au Temple de la renommée": "enters the Hall of Fame", "par stat) et vieillit bientôt.": "per stat) and will age soon.", "places, galas sans location et": "slots, galas without rental and", "réactions parfaites de suite !": "perfect reactions in a row!", "À exploiter pendant le combat.": "To exploit during the fight.", "🔥 Excellente chimie (+16 % XP)": "🔥 Excellent chemistry (+16% XP)", ">Recruter un jeune · 20 000 $": ">Recruit a youngster · $20,000", "Combat de championnat signé !": "Championship fight signed!", "Confirmer : il quitte le club": "Confirm: he leaves the club", "Confirmer : libérer ce boxeur": "Confirm: release this boxer", "Confirmer : quitter le club ?": "Confirm: leave the club?", "Gagne 50 % plus de notoriété.": "Gains 50% more fame.", "Il ne sera pas guéri à temps.": "He won't be healed in time.", "Les achats arrivent bientôt !": "Purchases are coming soon!", "Merci ! Ton avis est envoyé 🙌": "Thanks! Your feedback was sent 🙌", "Réussir une épreuve de palier": "Pass a tier test", "Tous les défis sont réussis !": "All challenges completed!", "Trop fatigué (forme sous 40).": "Too tired (form under 40).", "rejoignent les agents libres.": "join the free agents.", "rejoint ton écurie en ligne !": "joins your online stable!", "saigne de l’arcade ! (coupure": "is bleeding over the eye! (cut", "⚔️ Lancer une nouvelle guerre": "⚔️ Start a new war", "🎬 Reprises sur ce téléphone (": "🎬 Replays on this phone (", "👤 Recherche d’un vrai joueur…": "👤 Looking for a real player…", "). +50 000 $, +5 popularité.": "). +$50,000, +5 popularity.", "+20 % d’XP à l’entraînement.": "+20% XP in training.", ". Tout le monde prend un an.": ". Everyone gets a year older.", ". Tout se gagne sur le ring.": ". Everything is won in the ring.", ": combat obligatoire refusé.": ": mandatory fight refused.", ">Accepter sa demande · prime": ">Accept his demand · bonus", "Bon équilibre XP et fatigue.": "Good balance of XP and fatigue.", "Combat reporté de 3 semaines": "Fight postponed by 3 weeks", "Des jeunes de 12 à 14 ans de": "Youngsters aged 12 to 14 from", "Et NOUVEAU champion du monde": "And the NEW world champion", "Gala des récompenses de l’an": "Awards gala of the year", "Il est déjà engagé ou blessé": "He's already booked or injured", "Le soigneur referme la plaie": "The cutman closes the wound", "Plus jeune champion du monde": "Youngest world champion", "Plus vieux champion du monde": "Oldest world champion", "Poids lourd : pas de limite.": "Heavyweight: no limit.", "Reçoit 10 % moins de dégâts.": "Takes 10% less damage.", "S’essouffle 20 % moins vite.": "Tires 20% slower.", "Ton club est déjà en guerre.": "Your club is already at war.", "contrats signés ou prolongés": "contracts signed or extended", "ne veut pas renégocier avant": "won't renegotiate before", "participe à la Super Série !": "joins the Super Series!", "pour continuer à progresser.": "to keep progressing.", "se blesse à l’entraînement :": "gets injured in training:", "signe avec le club (prime de": "signs with the club (bonus of", "échoue à l’épreuve du niveau": "fails the level test", "−20 % d’XP à l’entraînement.": "−20% XP in training.", "⏩ Jusqu’au prochain combat ·": "⏩ Until the next fight ·", "✓ Conseillé contre son style": "✓ Recommended against his style", "💢 Mauvaise chimie (−10 % XP)": "💢 Bad chemistry (−10% XP)", "(racheter prolonge de 24 h)": "(buying again extends by 24 h)", "+ titre « Légende vivante »": "+ title « Living Legend »", ". Ils te traitent de lâche.": ". They call you a coward.", "Ce boxeur n’est pas blessé.": "This boxer isn't injured.", "Déjà un défi cette semaine.": "Already a challenge this week.", "Gagner par décision unanime": "Win by unanimous decision", "Garder toutes ses ceintures": "Keep all his belts", "Il avance et cherche le KO.": "He comes forward looking for the KO.", "Il reste des choses à faire": "There are still things to do", "Le combat n’a pas commencé.": "The fight hasn't started.", "Mon avis sur FIGHT DYNASTY": "My feedback on FIGHT DYNASTY", "Prochain camp possible dans": "Next camp possible in", "Rabais de loyauté appliqué.": "Loyalty discount applied.", "Reste sur le plan de match.": "Stick to the game plan.", "Reviens demain pour le jour": "Come back tomorrow for day", "Reçoit 4 % moins de dégâts.": "Takes 4% less damage.", "Suivre les conseils du coin": "Follow the corner's advice", "S’essouffle 8 % moins vite.": "Tires 8% slower.", "Ton boxeur a déjà un combat": "Your boxer already has a fight", "Un combat t’attend d’abord.": "A fight is waiting first.", "est blessé avant son combat": "is injured before his fight", "réussit l’épreuve du niveau": "passes the level test", "· +5 % de plus pour ceux de": "· +5% more for those from", "✓ Tes recruteurs seront aux": "✓ Your scouts will be at the", "🔍 Rapport du recruteur reçu": "🔍 Scout report received", ") · quart de finale contre": ") · quarter-final against", ">❄️ Cryothérapie · 8 000 $": ">❄️ Cryotherapy · $8,000", "Aréna du club (événements)": "Club arena (events)", "Aucun joueur avec ce code.": "No player with this code.", "Aucun plan de match choisi": "No game plan chosen", "Avancer et couper le ring.": "Press forward and cut off the ring.", "Déjà publié cette semaine.": "Already posted this week.", "Gagner 2 combats officiels": "Win 2 official fights", "Gagner 4 combats par arrêt": "Win 4 fights by stoppage", "Gagner 6 combats officiels": "Win 6 official fights", "Palmarès de la Super Série": "Super Series honours", "Pas de connexion Internet.": "No Internet connection.", "Pas loin… mais pas encore.": "Close… but not yet.", "Recherche d’un adversaire…": "Looking for an opponent…", "Sièges VIP au bord du ring": "VIP ringside seats", "Une construction à la fois": "One construction at a time", "ans) entre à ton académie.": "years) joins your academy.", "est envoyé au tapis par un": "is sent to the canvas by a", "⏱️ 10 dernières secondes !": "⏱️ Last 10 seconds!", "🏆 TU GAGNES LE TOURNOI ! +": "🏆 YOU WIN THE TOURNAMENT! +", "📍 Il est dans les câbles !": "📍 He's on the ropes!", "🤖 Vérification anti-robot…": "🤖 Anti-bot check…", "10 victoires pour le club": "10 wins for the club", "2e pouvoir au niveau 10 ·": "2nd power at level 10 ·", "Avec 100 % de préparation": "With 100% preparation", "Belle vitrine européenne.": "Great European showcase.", "Bourses prévues (minimum)": "Planned purses (minimum)", "Championnats continentaux": "Continental Championships", "Chargement des ceintures…": "Loading belts…", "Crée ton premier boxeur !": "Create your first boxer!", "Dans le coin \\(1 minute\\)": "In the corner (1 minute)", "Déjà tenté cette semaine.": "Already tried this week.", "Envoie tes recruteurs aux": "Send your scouts to the", "Gagner un combat de titre": "Win a title fight", "Gagner un combat officiel": "Win an official fight", "Gala des récompenses · an": "Awards gala · year", "Galas prévus (estimation)": "Planned galas (estimate)", "Je peux descendre un peu.": "I can come down a bit.", "Lance 10 % plus de coups.": "Throws 10% more punches.", "Nom du boxeur trop court.": "Boxer name too short.", "Nouveau trait à choisir :": "New trait to choose:", "Plus de défenses de titre": "Most title defences", "Renouvellement de contrat": "Contract renewal", "Série de connexion : jour": "Login streak: day", "Tombe 20 % moins souvent.": "Goes down 20% less often.", "Tony « Le Vétéran » Russo": "Tony « The Veteran » Russo", "Tu as abandonné le combat": "You quit the fight", "Tu n’es pas dans un club.": "You're not in a club.", "Un boxeur classé (top 15)": "A ranked boxer (top 15)", "accepte l’invitation à la": "accepts the invitation to the", "annulé faute de combats :": "cancelled for lack of fights:", "devient champion national": "becomes national champion", "est remis de sa blessure.": "has recovered from his injury.", "gagne le Club contre Club": "wins the Club vs Club", "pour son prochain combat.": "for his next fight.", "remporte la Super Série !": "wins the Super Series!", "son combat de championnat": "his championship fight", "⏩ Avancer jusqu’au combat": "⏩ Advance to the fight", "🏛️ Exclusifs des légendes": "🏛️ Legend exclusives", "👤 Combat en direct contre": "👤 Live fight against", "📜 Changements de ceinture": "📜 Belt changes", "🧱 Tu es dans les câbles !": "🧱 You're on the ropes!", "🩹 Ton boxeur est blessé :": "🩹 Your boxer is injured:", ": quart de finale contre": ": quarter-final against", "Champion : top 10 requis": "Champion: top 10 required", "Confirme le mot de passe": "Confirm password", "Confirmer l’annulation ?": "Confirm the cancellation?", "Entre le code de ton ami": "Enter your friend's code", "Grand Prix international": "International Grand Prix", "La salle passe au niveau": "The venue goes up to level", "Lance 4 % plus de coups.": "Throws 4% more punches.", "Lance 5 % plus de coups.": "Throws 5% more punches.", "Lance 8 % plus de coups.": "Throws 8% more punches.", "Marc « Le Juste » Gagnon": "Marc « The Fair » Gagnon", "Rang pas encore atteint.": "Rank not reached yet.", "Recherche d’adversaires…": "Looking for opponents…", "Signer un nouveau boxeur": "Sign a new boxer", "Tu es déjà dans un club.": "You're already in a club.", "arrêt de l’arbitre (TKO)": "referee stoppage (TKO)", "de bourse et le trophée.": "purse and the trophy.", "victoires de tes boxeurs": "wins by your boxers", "· plan de match efficace": "· effective game plan", "⏳ Connexion au combat de": "⏳ Connecting to the fight of", "👋 Content de te revoir !": "👋 Good to see you again!", "🤝 Bonne chimie (+8 % XP)": "🤝 Good chemistry (+8% XP)", "🥊 AVIS FIGHT DYNASTY (v": "🥊 FIGHT DYNASTY FEEDBACK (v", ") prend la ceinture des": ") takes the belt of", "). +2 places de boxeur.": "). +2 boxer slots.", "3e pouvoir au niveau 20": "3rd power at level 20", "Avertir avant d’avancer": "Warn before advancing", "Bourses des adversaires": "Opponent purses", "Changer le mot de passe": "Change password", "Coups touchés par round": "Punches landed per round", "Crée un boxeur d’abord.": "Create a boxer first.", "C’est ton propre code 😅": "That's your own code 😅", "Denis « Le Strict » Roy": "Denis « The Strict » Roy", "Défi pas encore réussi.": "Challenge not completed yet.", "Déjà au niveau maximum.": "Already at max level.", "Emplacement verrouillé.": "Slot locked.", "Gagner un combat par KO": "Win a fight by KO", "Inscription remboursée.": "Entry fee refunded.", "Le combat commence dans": "The fight starts in", "Meilleure note atteinte": "Best rating reached", "Plus de titres mondiaux": "Most world titles", "Prochaine campagne dans": "Next campaign in", "Se blesse plus souvent.": "Gets injured more often.", "Show musical et entrées": "Music show and entrances", "Temple de la renommée ·": "Hall of Fame ·", "Tu annules le combat de": "You cancel the fight of", "Tu as ignoré le défi de": "You ignored the challenge from", "Tu passes gérant niveau": "You're now manager level", "Un boxeur dans le top 5": "A boxer in the top 5", "Un camp est déjà actif.": "A camp is already active.", "Un entraîneur 3 étoiles": "A 3-star coach", "Une écurie de 3 boxeurs": "A stable of 3 boxers", "devient champion linéal": "becomes lineal champion", "du pays sur la carte (+": "from the country on the card (+", "est libéré par le club.": "is released by the club.", "🐞 Bugs ou écrans brisés": "🐞 Bugs or broken screens", ">Engager un entraîneur": ">Hire a coach", "Adversaire introuvable": "Opponent not found", "Championnats nationaux": "National Championships", "Chargement du tournoi…": "Loading tournament…", "Choisir un autre pays…": "Choose another country…", "Choisis un emplacement": "Choose a slot", "Combat de championnat.": "Championship fight.", "Confirmer le retrait ?": "Confirm the withdrawal?", "Content de te revoir !": "Good to see you again!", "Dernier anniversaire (": "Last birthday (", "Il peut monter jusqu’à": "He can climb up to", "Partenaire de sparring": "Sparring partner", "Prochaine édition dans": "Next edition in", "Rachat payé à son club": "Buyout paid to his club", "Titre national signé !": "National title signed!", "Tombe plus facilement.": "Goes down more easily.", "Victoires vs champions": "Wins vs champions", "ans · promoteur depuis": "yrs · promoter since", "est à bout de souffle.": "is out of breath.", "et suis le point vert.": "and follow the green dot.", "gagne la Super Série !": "wins the Super Series!", "pour le titre national": "for the national title", "promotions (ton club +": "promotions (your club +", "règle ses comptes avec": "settles the score with", "· décision obligatoire": "· mandatory decision", "⚠️ Il arme sa droite !": "⚠️ He's loading up the right!", "✅ Camp terminé : +4 en": "✅ Camp done: +4 in", "🏢 Nouvelle promotion :": "🏢 New promotion:", "👑 COMBAT POUR LE TITRE": "👑 TITLE FIGHT", "👑 NOUVEAU CHAMPION ! ·": "👑 NEW CHAMPION! ·", "🟡 Champion intérimaire": "🟡 Interim champion", "🩸 Il saigne à l’arcade": "🩸 He's bleeding over the eye", "(+5 points de stats).": "(+5 stat points).", "(camp normal, reposé)": "(normal camp, rested)", "(maximum 95 par stat)": "(max 95 per stat)", "). Premiers boxeurs :": "). First boxers:", "+12 énergie, +3 santé": "+12 energy, +3 health", ": objectif réussi par": ": goal achieved by", ">💰 Négocier le rachat": ">💰 Negotiate the buyout", "Avis FIGHT DYNASTY v": "FIGHT DYNASTY feedback v", "CHAMPION UNDISPUTED !": "UNDISPUTED CHAMPION!", "Chargement du profil…": "Loading profile…", "Choisir mes boxeurs →": "Choose my boxers →", "Coffre du jour · Jour": "Daily chest · Day", "Confirmer la retraite": "Confirm retirement", "Confirmer l’abandon ?": "Confirm quitting?", "Entraînement en cours": "Training in progress", "Frais de ville hôte (": "Host city fee (", "Gagner 2 défis de gym": "Win 2 gym challenges", "Gagner un défi de gym": "Win a gym challenge", "Pas d’entrée spéciale": "No special entrance", "Résultat non envoyé :": "Result not sent:", "Tes autres promotions": "Your other promotions", "Ton boxeur est blessé": "Your boxer is injured", "\\n\\n🔧 À améliorer :\\n": "\\n\\n🔧 To improve:\\n", "entre dans le tournoi": "enters the tournament", "est champion national": "is national champion", "et arrête le combat !": "and stops the fight!", "kg pour une limite de": "kg for a limit of", "pour pouvoir le tirer": "to be able to roll it", "sem.) : pas de combat": "wk): no fight", "Événements aléatoires": "Random events", "✍️ Contrat signé avec": "✍️ Contract signed with", "🏷️ Équiper un titre ›": "🏷️ Equip a title ›", "💥 Faillite · à vendre": "💥 Bankrupt · for sale", "🔒 Mot de passe changé": "🔒 Password changed", "🛍️ Boutique améliorée": "🛍️ Shop upgraded", ") d’ici 10 semaines.": ") within 10 weeks.", "+12 % de spectateurs": "+12% spectators", "/10 légendes battues": "/10 legends beaten", ": sa loyauté baisse.": ": his loyalty drops.", "Abonnements des gyms": "Gym memberships", "Aucun camp en cours.": "No camp in progress.", "Bombe dans la droite": "Bomb in the right hand", "Combat pour le titre": "Title fight", "Confirmer : tu perds": "Confirm: you lose", "Conférence de presse": "Press conference", "Connecté en tant que": "Logged in as", "Continuer le tournoi": "Continue the tournament", "Continuer quand même": "Continue anyway", "David contre Goliath": "David vs Goliath", "Déchirure à l’épaule": "Shoulder tear", "Entraîneur 2★ requis": "2★ coach required", "Expire cette semaine": "Expires this week", "Gagner par KO ou TKO": "Win by KO or TKO", "Gants d’or régionaux": "Regional Golden Gloves", "Grande aréna du club": "Big club arena", "Nouveau gym ouvert à": "New gym opened in", "Pas assez de points.": "Not enough points.", "Pas encore construit": "Not built yet", "Pas encore de partie": "No save yet", "Pour rester, je veux": "To stay, I want", "Premier badge de gym": "First gym badge", "Précision et timing.": "Accuracy and timing.", "Préparateur physique": "Strength coach", "Rachat du contrat de": "Contract buyout of", "Racheter son contrat": "Buy out his contract", "Retirer de mon choix": "Remove from my picks", "Rien pour l’instant.": "Nothing for now.", "Salaires des boxeurs": "Boxer salaries", "Travailleur au corps": "Body puncher", "Trophées remportés :": "Trophies won:", "Tu as déjà 100 amis.": "You already have 100 friends.", "Un potentiel limité.": "Limited potential.", "champion intérimaire": "interim champion", "combat cette semaine": "fight this week", "concessionnaire auto": "car dealership", "dans le rouge depuis": "in the red for", "fait les yeux doux à": "is flirting with", "inquiète le médecin.": "worries the doctor.", "la semaine prochaine": "next week", "rejoint ton écurie !": "joins your stable!", "te défie en direct !": "challenges you live!", "⚔️ Dernières guerres": "⚔️ Latest wars", "⚔️ Lancer une guerre": "⚔️ Start a war", "🎭 Il baisse sa garde": "🎭 He's dropping his guard", "🏅 NOUVEAU CHAMPION ·": "🏅 NEW CHAMPION ·", "👑 NOUVEAU CHAMPION !": "👑 NEW CHAMPION!", "📜 Combat obligatoire": "📜 Mandatory fight", "🔄 Il change de garde": "🔄 He switches stance", "🤝 Contrat rempli ! +": "🤝 Contract fulfilled! +", "🫁 Enchaîner au corps": "🫁 Work the body", "! Loyauté maximale.": "! Maximum loyalty.", "+précision ce round": "+accuracy this round", "/sem. d’événements.": "/wk of events.", "100 000 $ en caisse": "$100,000 in the bank", ">Lancer la chaîne ·": ">Launch the channel ·", ">Ouvrir un bureau ·": ">Open an office ·", "Aucun combat connu.": "No known fights.", "Boxeur introuvable.": "Boxer not found.", "Catégorie invalide.": "Invalid weight class.", "Champion national ·": "National champion ·", "Champion undisputed": "Undisputed champion", "Chances de victoire": "Win chances", "Chargement du club…": "Loading club…", "Combat de ton gala.": "Fight on your gala.", "Combat introuvable.": "Fight not found.", "Création du compte…": "Creating account…", "Défaite par abandon": "Loss by retirement", "ENCHAÎNE AU CORPS !": "WORK THE BODY!", "Gants dorés juniors": "Junior Golden Gloves", "Gestion automatique": "Automatic management", "Les 8 badges de gym": "The 8 gym badges", "Lions de Paris Boxe": "Paris Lions Boxing", "Ouvrir le coffre (+": "Open the chest (+", "Papillon et abeille": "Butterfly and bee", "Pas assez d’argent.": "Not enough money.", "Plus de points GOAT": "Most GOAT points", "Productions du Ring": "Ring Productions", "Profil introuvable.": "Profile not found.", "Récupération rapide": "Fast recovery", "Salle communautaire": "Community hall", "Seigneurs de guerre": "Warlords", "Un boxeur niveau 10": "A level 10 boxer", "Un très bon espoir.": "A very good prospect.", "ans. Fiche finale :": "yrs. Final record:", "boisson énergisante": "energy drink", "champion national !": "national champion!", "coups portés contre": "punches thrown against", "devient le rival de": "becomes the rival of", "fait faillite ! Ses": "goes bankrupt! Its", "prend sa retraite (": "retires (", "prend sa retraite :": "retires:", "prend sa retraite à": "retires at", "semaines de gestion": "weeks of management", "signe l’agent libre": "signs free agent", "· dernière saison !": "· final season!", "Écurie trop grosse.": "Stable too big.", "Épreuve débloquée :": "Test unlocked:", "↩️ Tourner à droite": "↩️ Turn right", "↪️ Tourner à gauche": "↪️ Turn left", "✓ Choisir ce boxeur": "✓ Choose this boxer", "＋ Ajouter un combat": "＋ Add a fight", "🏅 Épreuve réussie !": "🏅 Test passed!", "🏋️ En camp · encore": "🏋️ In camp · still", "🏋️ Lancer un camp (": "🏋️ Start a camp (", "📋 Conseil du coin :": "📋 Corner advice:", "📍 Trouver ma région": "📍 Find my region", "📨 Demande envoyée à": "📨 Request sent to", "📨 Demander à entrer": "📨 Ask to join", "🤝 Rejoindre ce club": "🤝 Join this club", "! +1 point d’atout": "! +1 perk point", "+3 % de précision.": "+3% accuracy.", ": touche une carte": ": tap a card", ">🩺 Soins d’élite ·": ">🩺 Elite care ·", "Aucun atout encore": "No perks yet", "Aucun club trouvé.": "No club found.", "Aucun revenu télé.": "No TV revenue.", "Avant de continuer": "Before continuing", "Bûcheron d’Irlande": "Irish Lumberjack", "Calendrier amateur": "Amateur calendar", "Centre des congrès": "Convention centre", "Chargement du gym…": "Loading gym…", "Charger une partie": "Load a save", "Code de sauvegarde": "Save code", "Combat obligatoire": "Mandatory fight", "Confirmer la vente": "Confirm the sale", "Coups plus lourds.": "Heavier punches.", "Endurance de robot": "Robot stamina", "Expédition espoirs": "Prospect expedition", "FEINTE, AU CORPS !": "FEINT, TO THE BODY!", "Grand amphithéâtre": "Grand amphitheatre", "METS LA PRESSION !": "PUT ON THE PRESSURE!", "Objectif atteint :": "Goal reached:", "Ouvrir la boutique": "Open the shop", "Pas assez d’argent": "Not enough money", "Pas encore choisie": "Not chosen yet", "Plus grosse bourse": "Biggest purse", "Prime de signature": "Signing bonus", "Quitter le contrat": "Leave the contract", "Reporter de 3 sem.": "Postpone 3 wks", "Récupère la forme.": "Recovers form.", "Région non choisie": "Region not chosen", "Réserver un combat": "Book a fight", "Soigner la coupure": "Treat the cut", "Soins d’élite pour": "Elite care for", "S’inscrire · 100 💰": "Sign up · 100 💰", "Tournoi en cours :": "Tournament in progress:", "abonnés · retraite": "followers · retirement", "baisse les coudes.": "drops his elbows.", "de défendre contre": "to defend against", "gagne par décision": "wins by decision", "le créateur du jeu": "the game's creator", "n’est préparé qu’à": "is only prepared at", "pour le finaliste,": "for the runner-up,", "prolonge d’un an à": "extends by one year at", "rejoint le staff (": "joins the staff (", "rejoint l’académie": "joins the academy", "sans plan de match": "without a game plan", "vêtements de sport": "sportswear", "Éliminé du tournoi": "Knocked out of the tournament", "équipement de boxe": "boxing gear", "⚔️ Contre ton club": "⚔️ Against your club", "✅ Qualifié pour la": "✅ Qualified for the", "✅ Récompense reçue": "✅ Reward received", "➕ Nouveau boxeur (": "➕ New boxer (", "🎭 Feinte + crochet": "🎭 Feint + hook", "🎵 Musique (coupée)": "🎵 Music (muted)", "💰 Pari gagnant : +": "💰 Winning bet: +", "📜 Derniers combats": "📜 Latest fights", "📨 Envoyer mon avis": "📨 Send my feedback", "🔴 Défier en direct": "🔴 Challenge live", "🧰 Coffre quotidien": "🧰 Daily chest", "🫁 Tu manques d’air": "🫁 You're out of breath", ") : il est guéri.": "): he's healed.", "+défense ce round": "+defence this round", ">Passer l’épreuve": ">Take the test", "Académie jeunesse": "Youth academy", "Annuler ce combat": "Cancel this fight", "Aucune sauvegarde": "No saves", "Boxeur de l’année": "Boxer of the year", "Campagne mondiale": "World campaign", "Ce défi a expiré.": "This challenge has expired.", "Champion national": "National champion", "Chercher un club…": "Search for a club…", "Choisir le boxeur": "Choose the boxer", "Choisir à la main": "Choose manually", "Dieu de la guerre": "God of war", "Divisions titrées": "Divisions with titles", "Entrée électrique": "Electric entrance", "FEINTE, CROCHET !": "FEINT, HOOK!", "Fiche de l’écurie": "Stable sheet", "Fin de la reprise": "End of replay", "Gérant de l’année": "Manager of the year", "Le laisser partir": "Let him go", "Libérer ce boxeur": "Release this boxer", "Mission réussie !": "Mission accomplished!", "Mission réussie :": "Mission accomplished:", "Nom d’utilisateur": "Username", "Organiser un gala": "Organize a gala", "Pas encore évalué": "Not evaluated yet", "Passe complétée !": "Pass completed!", "Points à placer :": "Points to spend:", "Première victoire": "First win", "Province / région": "Province / region", "Pub au Super Bowl": "Super Bowl ad", "Rachat de contrat": "Contract buyout", "Salle améliorée !": "Venue upgraded!", "Semaines champion": "Weeks as champion", "Semaines normales": "Normal weeks", "Souffle du dragon": "Dragon's breath", "Stats de départ ·": "Starting stats ·", "Tu es invité à la": "You're invited to the", "VISE LA COUPURE !": "AIM FOR THE CUT!", "atteint le niveau": "reaches level", "boxeurs repérés !": "boxers scouted!", "chez les amateurs": "in the amateurs", "crochet du gauche": "left hook", "de tous les temps": "of all time", "d’ici 6 semaines.": "within 6 weeks.", "ne renouvelle pas": "doesn't renew", "places · location": "seats · rental", "prend le dessus :": "takes over:", "rejoint le club !": "joins the club!", "ton gym principal": "your main gym", "uppercut au corps": "body uppercut", "· EN PAY-PER-VIEW": "· ON PAY-PER-VIEW", "· début du déclin": "· start of decline", "· déclin accéléré": "· accelerated decline", "Écris à ton club…": "Write to your club…", "❌ Mauvais choix !": "❌ Wrong choice!", "🎭 Feinte + direct": "🎭 Feint + straight", "🎮 Réagis vite aux": "🎮 React fast to", "🎯 Défi réussi : +": "🎯 Challenge completed: +", "🎲 Tout relancer (": "🎲 Reroll all (", "👍 Ce que tu aimes": "👍 What you like", "💎 Champion linéal": "💎 Lineal champion", "💪 Points placés !": "💪 Points spent!", "😴 Épuisé (énergie": "😴 Exhausted (energy", "😵 Tu es ébranlé !": "😵 You're hurt!", "🤝 Commanditaire ·": "🤝 Sponsor ·", "🤝 Défier un ami (": "🤝 Challenge a friend (", "🥊 COMBAT EN LIGNE": "🥊 ONLINE FIGHT", "🩹 Blessé · encore": "🩹 Injured · still", "$, ta part 50 %)": "$, your share 50%)", ") passe pro avec": ") turns pro with", ": objectif raté.": ": goal missed.", "Ajuster la garde": "Adjust the guard", "Article inconnu.": "Unknown item.", "Aréna municipale": "Municipal arena", "Boxeur précédent": "Previous boxer", "COMBAT PRINCIPAL": "MAIN EVENT", "Champ. nationaux": "National champ.", "Chasseur de foie": "Liver hunter", "Contrat prolongé": "Contract extended", "Coup de tonnerre": "Thunderclap", "Créer mon boxeur": "Create my boxer", "Créer mon compte": "Create my account", "Cœur de champion": "Champion's heart", "Cœur de guerrier": "Warrior's heart", "Défi réussi pour": "Challenge completed for", "Emplacement vide": "Empty slot", "Entrée du dragon": "Dragon entrance", "Expédition élite": "Elite expedition", "FEINTE, DIRECT !": "FEINT, STRAIGHT!", "Garde hermétique": "Airtight guard", "Homme d’affaires": "Businessman", "Maintenant c’est": "Now it's", "Plan conseillé :": "Recommended plan:", "Produits dérivés": "Merchandise", "Promesse tenue !": "Promise kept!", "Quartier général": "Headquarters", "Quarts de finale": "Quarter-finals", "RESPIRE, BOUGE !": "BREATHE, MOVE!", "Revanche prise !": "Revenge taken!", "Ring de sparring": "Sparring ring", "Région invalide.": "Invalid region.", "Santé financière": "Financial health", "Synchronisation…": "Syncing…", "Tendon d’Achille": "Achilles tendon", "Titres nationaux": "National titles", "Toi contre lui :": "You vs him:", "Tournée des gyms": "Gym tour", "Travail au corps": "Body work", "Trop haut classé": "Ranked too high", "Télé et affiches": "TV and posters", "\\n\\n👍 J’aime :\\n": "\\n\\n👍 I like:\\n", "a refusé le défi": "declined the challenge", "boxeurs recrutés": "boxers recruited", "boxeurs · profit": "boxers · profit", "creuse au corps,": "digs to the body,", "crochet du droit": "right hook", "de combat expire": "fight expires", "de prime restant": "bonus remaining", "devient champion": "becomes champion", "direct au plexus": "straight to the solar plexus", "le commanditaire": "the sponsor", "perd la ceinture": "loses the belt", "perte/an estimée": "estimated loss/yr", "qui fait reculer": "that drives back", "quitte le club :": "leaves the club:", "sem. pour signer": "wks to sign", "signe avec toi !": "signs with you!", "son grand combat": "his big fight", "· KNOCKDOWN ! Un": "· KNOCKDOWN! A", "Épreuve · niveau": "Test · level", "★ dans le staff.": "★ on the staff.", "✅ C’est bien moi": "✅ That's me", "🎟️ Voir la passe": "🎟️ View the pass", "🎭 Feinte + corps": "🎭 Feint + body", "🎯 Viser l’arcade": "🎯 Aim for the eyebrow", "🎲 Nouveau visage": "🎲 New face", "🏆 1re victoire :": "🏆 1st win:", "💸 Pari perdu : −": "💸 Lost bet: −", "🔥 En feu ce soir": "🔥 On fire tonight", "😓 Soir difficile": "😓 Tough night", "🤝 Commanditaires": "🤝 Sponsors", "🧒 Ton académie ·": "🧒 Your academy ·", "(bourse −10 %).": "(purse −10%).", "+5 % de dégâts.": "+5% damage.", "+8 % de dégâts.": "+8% damage.", ". Notoriété −3.": ". Fame −3.", "4 badges de gym": "4 gym badges", ": gérant niveau": ": manager level", "Aucun candidat.": "No candidates.", "Boxe à distance": "Boxing at range", "Ceinture perdue": "Belt lost", "Champ. national": "National champ.", "Choix invalide.": "Invalid choice.", "Colosse de Kyiv": "Colossus of Kyiv", "Combat annulé :": "Fight cancelled:", "Confirmer 100 💰": "Confirm 100 💰", "Coupe nationale": "National cup", "Créer un compte": "Create an account", "C’est ton club.": "It's your club.", "Demande envoyée": "Request sent", "Défense et jab.": "Defence and jab.", "Défi gagné chez": "Challenge won at", "Défi perdu chez": "Challenge lost at", "Empereur dragon": "Dragon emperor", "Entraîneur-chef": "Head coach", "Et le vainqueur": "And the winner", "Feux d’artifice": "Fireworks", "Force de l’ours": "Bear strength", "Gérer le gala ›": "Manage the gala ›", "Invitation pour": "Invitation for", "Jeux olympiques": "Olympic Games", "K.-O. technique": "Technical knockout", "KO). +25 000 $.": "KO). +$25,000.", "Légende vivante": "Living legend", "Machine à coups": "Punch machine", "Marteau de Thor": "Thor's hammer", "Meilleure série": "Best streak", "Menton de verre": "Glass chin", "Pas assez de 💰.": "Not enough 💰.", "Pique d’abeille": "Bee sting", "Plus long règne": "Longest reign", "Prix du marché.": "Market price.", "Prévu le jour J": "Planned for fight day", "Quart de finale": "Quarter-final", "Quitter le club": "Leave the club", "Round disputé :": "Close round:", "Réseaux sociaux": "Social media", "Rétine décollée": "Detached retina", "Salle de cardio": "Cardio room", "Titres mondiaux": "World titles", "VOLE LE ROUND !": "STEAL THE ROUND!", "XP entraînement": "Training XP", "crochet au foie": "liver hook", "depuis le début": "since the start", "direct du droit": "right straight", "en construction": "under construction", "galas organisés": "galas organized", "paiement mobile": "mobile payment", "par semaine sur": "per week on", "passe au niveau": "moves up to level", "prochain combat": "next fight", "rate le poids (": "misses weight (", "vise le foie de": "targets the liver of", "· gérant niveau": "· manager level", "· sans location": "· no rental", "Épreuve requise": "Test required", "à la signature.": "on signing.", "⏳ En attente de": "⏳ Waiting for", "🎉 Compte créé !": "🎉 Account created!", "🎪 Ajout au gala": "🎪 Added to gala", "🎵 Musique : non": "🎵 Music: off", "🎵 Musique : oui": "🎵 Music: on", "👑 Championnat ·": "👑 Championship ·", "👔 Gérants (ELO)": "👔 Managers (ELO)", "📡 Localisation…": "📡 Locating…", "🔇 Sons (coupés)": "🔇 Sounds (muted)", "😐 Chimie neutre": "😐 Neutral chemistry", "🤖 Adversaire IA": "🤖 AI opponent", "🤝 Commanditaire": "🤝 Sponsor", "🤝 Défier un ami": "🤝 Challenge a friend", "🥊 Fiche du club": "🥊 Club page", "% de public) ·": "% of crowd) ·", "% par tirage ·": "% per roll ·", "%) · prêt dans": "%) · ready in", "12 % par heure": "12% per hour", ">🥊 Défier avec": ">🥊 Challenge with", "ACCROCHE-TOI !": "HANG ON!", "Actuellement :": "Currently:", "Ajouter un ami": "Add a friend", "Attends encore": "Wait a bit more", "Aucun pouvoir.": "No powers.", "Aucune coupure": "No cuts", "BADGE obtenu :": "BADGE earned:", "Bienvenue chez": "Welcome to", "Boxeur suivant": "Next boxer", "Boxeurs du gym": "Gym boxers", "Camp invalide.": "Invalid camp.", "Centre médical": "Medical centre", "Choisis encore": "Choose again", "Combat signé !": "Fight signed!", "Combat signé :": "Fight signed:", "Combats animés": "Animated fights", "Contrat annulé": "Contract cancelled", "Côte fracturée": "Fractured rib", "Entrée du loup": "Wolf entrance", "Main de pierre": "Hand of stone", "Mains fragiles": "Fragile hands", "Mur des succès": "Wall of achievements", "Nouveau boxeur": "New boxer", "Part du club :": "Club share:", "Pas assez de 💰": "Not enough 💰", "Pesée publique": "Public weigh-in", "Plus d’abonnés": "More followers", "Point faible :": "Weak spot:", "Production PPV": "PPV production", "Roi de Londres": "King of London", "Salaire / sem.": "Salary / wk", "Se déconnecter": "Log out", "Second souffle": "Second wind", "Tireur d’élite": "Sharpshooter", "Titre national": "National title", "Un pro solide.": "A solid pro.", "XP quand même.": "XP anyway.", "\\n\\n🐞 Bugs :\\n": "\\n\\n🐞 Bugs:\\n", "avant la prime": "before the bonus", "avant retraite": "before retirement", "est éliminé en": "is knocked out in", "fait faillite.": "goes bankrupt.", "fin de contrat": "end of contract", "font match nul": "fight to a draw", "pour rejoindre": "to join", "quitte le club": "leaves the club", "son adversaire": "his opponent", "· Catégories :": "· Weight classes:", "Éclair d’Osaka": "Osaka Lightning", "Écurie pleine.": "Stable full.", "⏱️ Trop lent !": "⏱️ Too slow!", "✅ Actif encore": "✅ Still active", "❄️ Forme à 100": "❄️ Form at 100", "🏛️ PANTHÉON 🏛️": "🏛️ PANTHEON 🏛️", "💥 Il vacille !": "💥 He's wobbling!", "💰 Pari placé :": "💰 Bet placed:", "🔥 Le retour de": "🔥 The return of", "/sem. pendant": "/wk during", ">Construire :": ">Build:", "Agents libres": "Free agents", "Aréna du club": "Club arena", "Aucun boxeur.": "No boxers.", "Aucun combat.": "No fights.", "Aucun membre.": "No members.", "Aucun pouvoir": "No power", "Aucune offre.": "No offers.", "Boxeur retiré": "Boxer retired", "Carte à venir": "Upcoming card", "Combat annulé": "Fight cancelled", "Combats en 3D": "3D fights", "Corps d’acier": "Body of steel", "Coup de hache": "Axe blow", "Court préavis": "Short notice", "Début de l’an": "Start of the year", "Défi envoyé à": "Challenge sent to", "Déjà réclamé.": "Already claimed.", "Entrée en feu": "Fire entrance", "Entrée royale": "Royal entrance", "Finaliste : +": "Runner-up: +", "Forme normale": "Normal form", "Frappe lourde": "Heavy hitter", "Grande chaîne": "Major network", "Gym principal": "Main gym", "Gérant depuis": "Manager since", "Gérant niveau": "Manager level", "Il te restera": "You'll have left", "Jeu de jambes": "Footwork", "KO de l’année": "KO of the year", "La coupure de": "The cut of", "Le plus grand": "The greatest", "Leçon de boxe": "Boxing lesson", "Mains rapides": "Fast hands", "Menton de fer": "Iron chin", "Message vide.": "Empty message.", "Moteur diesel": "Diesel engine", "Nom au hasard": "Random name", "Note maximale": "Top rating", "Odeur du sang": "Smell of blood", "Points GOAT ·": "GOAT points ·", "Poste vacant.": "Vacant position.", "Profit / sem.": "Profit / wk", "Profit estimé": "Estimated profit", "Titre mondial": "World title", "Trop fatigué.": "Too tired.", "Tu l’as déjà.": "You already have it.", "Un club rival": "A rival club", "Vieille école": "Old school", "au vainqueur.": "to the winner.", "cette semaine": "this week", "de ton niveau": "at your level", "en sous-carte": "on the undercard", "est remplacé.": "is replaced.", "est ton ami !": "is your friend!", "ex. La Foudre": "e.g. The Lightning", "global · Niv.": "overall · Lvl.", "global · cote": "overall · rating", "par semaine).": "per week).", "trophées pour": "trophies for", "victoires ! +": "wins! +", "· KNOCKDOWN !": "· KNOCKDOWN!", "· adversaires": "· opponents", "À surveiller.": "One to watch.", "Écurie pleine": "Stable full", "Œil de tireur": "Marksman's eye", "⚔️ Toi contre": "⚔️ You vs", "⚡ Points auto": "⚡ Auto points", "✍️ Signer pro": "✍️ Sign pro", "🎯 À sa portée": "🎯 Within reach", "🏆 Super Série": "🏆 Super Series", "🏆 Vainqueur !": "🏆 Winner!", "🏢 Tu rachètes": "🏢 You buy", "🏳️ Abandonner": "🏳️ Quit", "👀 Ouverture !": "👀 Opening!", "👑 TU AS BATTU": "👑 YOU BEAT", "💎 Champion de": "💎 Champion of", "📨 Sur demande": "📨 On request", "🔕 Désactivées": "🔕 Off", "🤖 CONTRE L’IA": "🤖 VS AI", "🥵 Il est vidé": "🥵 He's drained", "% par tirage": "% per roll", "/sem. (prime": "/wk (bonus", ": 8 boxeurs,": ": 8 boxers,", ">Améliorer ·": ">Upgrade ·", ">🥊 Combattre": ">🥊 Fight", "Aucune promo": "No promotion", "Badge obtenu": "Badge earned", "CODE DU CLUB": "CLUB CODE", "Code copié !": "Code copied!", "Coups portés": "Punches thrown", "Dans l’élite": "Among the elite", "Départ canon": "Fast start", "Dôme du club": "Club dome", "Fiche du gym": "Gym page", "Galas passés": "Past galas", "Grand Maître": "Grand Master", "Gym ouvert à": "Gym opened in", "LE CROCHET !": "THE HOOK!", "LÉGENDAIRE !": "LEGENDARY!", "L’UPPERCUT !": "THE UPPERCUT!", "Me connecter": "Log me in", "Mot de passe": "Password", "Note moyenne": "Average rating", "Place encore": "Spots left", "Premier sang": "First blood", "Q.I. de boxe": "Boxing IQ", "Rang maximum": "Max rank", "Récupération": "Recovery", "SORS DE LÀ !": "GET OUT OF THERE!", "Se connecter": "Log in", "Titre vacant": "Vacant title", "Remporte le titre vacant": "Wins the vacant title", "Version test": "Test version", "au gagnant !": "to the winner!", "aucun boxeur": "no boxers", "construite !": "built!", "construite (": "built (", "eau minérale": "mineral water", "est blessé (": "is injured (", "est déchu de": "is stripped of", "l’adversaire": "the opponent", "moments clés": "key moments", "sont invités": "are invited", "· au tour de": "· turn of", "· objectif :": "· goal:", "· récompense": "· reward", "À déterminer": "To be decided", "⚔️ EN GUERRE": "⚔️ AT WAR", "✅ Débloqué ·": "✅ Unlocked ·", "✅ maintenant": "✅ now", "✨ MYTHIQUE ✨": "✨ MYTHIC ✨", "⭐ Niveau max": "⭐ Max level", "💥 Faillite :": "💥 Bankruptcy:", "🔇 Sons : non": "🔇 Sounds: off", "🔊 Sons : oui": "🔊 Sounds: on", "🔴 COIN ROUGE": "🔴 RED CORNER", "(principal)": "(main)", ">Agrandir ·": ">Expand ·", "Agent libre": "Free agent", "Améliorer ·": "Upgrade ·", "Aucun club.": "No clubs.", "Chargement…": "Loading…", "Commandites": "Sponsorships", "Confirmer :": "Confirm:", "Confirmer ?": "Confirm?", "Conquérants": "Conquerors", "C’est toi !": "That's you!", "Diamant III": "Diamond III", "Droits télé": "TV rights", "Défi expiré": "Challenge expired", "Déjà engagé": "Already booked", "Démolisseur": "Wrecker", "Exclusif de": "Exclusive of", "Expire dans": "Expires in", "Gala créé :": "Gala created:", "Garde haute": "High guard", "LE DIRECT !": "THE STRAIGHT!", "La ceinture": "The belt", "Main cassée": "Broken hand", "Match nul (": "Draw (", "Mes boxeurs": "My boxers", "Nom du club": "Club name", "Négociateur": "Negotiator", "Platine III": "Platinum III", "Potentiel ?": "Potential?", "Prix du PPV": "PPV price", "Préparation": "Preparation", "Prêts (17+)": "Ready (17+)", "Revenus : +": "Revenue: +", "Récompenses": "Awards", "Salle vidéo": "Video room", "Super Série": "Super Series", "Super-léger": "Super lightweight", "Télé locale": "Local TV", "aspirant #1": "#1 contender", "aujourd’hui": "today", "combat dans": "fight in", "en quarts (": "in the quarters (", "la victoire": "the win", "passe pro !": "turns pro!", "puis plan «": "then plan «", "remporte la": "wins the", "remporte le": "wins the", "suppléments": "extras", "victoires ·": "wins ·", "· finaliste": "· runner-up", "· réactions": "· reactions", "· ⬆️ Niveau": "· ⬆️ Level", "Étude vidéo": "Video study", "à disputer.": "to be fought.", "— Choisir —": "— Choose —", "⏸️ Attendre": "⏸️ Wait", "⚔️ Victoire": "⚔️ Win", "✅ Parfait !": "✅ Perfect!", "✓ Contrat :": "✓ Contract:", "🎉 JACKPOT !": "🎉 JACKPOT!", "🎯 Recruteur": "🎯 Scout", "👑 Légende ·": "👑 Legend ·", "👑 Président": "👑 President", "💰 + trophée": "💰 + trophy", "📰 Actualité": "📰 News", "🔥 Accélérer": "🔥 Speed up", "🔴 EN DIRECT": "🔴 LIVE", "🔵 COIN BLEU": "🔵 BLUE CORNER", "🛡️ Prudence": "🛡️ Caution", "🤼 Accrocher": "🤼 Clinch", "🥊 Combattre": "🥊 Fight", "🥊 Commencer": "🥊 Start", "🧘 Récupérer": "🧘 Recover", "(ta part :": "(your share:", ") après le": ") after the", ". Profit :": ". Profit:", ". Tu paies": ". You pay", "Argent III": "Silver III", "Aux points": "On points", "Campagne «": "Campaign «", "Classement": "Rankings", "Club plein": "Club full", "Connexion…": "Connecting…", "Contrat de": "Contract of", "Diamant II": "Diamond II", "Déconnecté": "Logged out", "Désactiver": "Turn off", "Entraîneur": "Coach", "FINIS-LE !": "FINISH HIM!", "Jab piston": "Piston jab", "Le Royaume": "The Kingdom", "Légendaire": "Legendary", "Mon compte": "My account", "Mon équipe": "My team", "Niveau max": "Max level", "Non classé": "Unranked", "Objectif :": "Goal:", "Pas lancée": "Not launched", "Platine II": "Platinum II", "Plus de KO": "More KOs", "Porto Rico": "Puerto Rico", "Premier KO": "First KO", "Prétendant": "Contender", "Revendre ·": "Sell ·", "Réclamer +": "Claim +", "Réputation": "Reputation", "Sa demande": "His demand", "Ton boxeur": "Your boxer", "Ton code :": "Your code:", "Ton prénom": "Your first name", "Trop jeune": "Too young", "Tu as déjà": "You already have", "Tu revends": "You sell", "Victoire !": "Victory!", "XP gérant.": "manager XP.", "achats PPV": "PPV buys", "actif (+4)": "active (+4)", "aux points": "on points", "décline la": "declines the", "en attente": "pending", "en demies,": "in the semis,", "en quarts,": "in the quarters,", "est invité": "is invited", "jeux vidéo": "video games", "la défaite": "the loss", "places · +": "seats · +", "plus forts": "stronger", "prolonge !": "extends!", "reporté au": "postponed to", "signe avec": "signs with", "ton compte": "your account", "téléphones": "phones", "· Niveau ≈": "· Level ≈", "· Revanche": "· Rematch", "· cartes :": "· cards:", "· pas prêt": "· not ready", "· remplace": "· replaces", "· tu paies": "· you pay", "À DROITE !": "TO THE RIGHT!", "À GAUCHE !": "TO THE LEFT!", "Éliminé en": "Knocked out in", "États-Unis": "United States", "à réclamer": "to claim", "↙️ Esquive": "↙️ Slip", "⚔️ Défi de": "⚔️ Challenge from", "⚡ Pression": "⚡ Pressure", "✅ Accepter": "✅ Accept", "⬅️ Crochet": "⬅️ Hook", "🌐 En ligne": "🌐 Online", "🎨 Modifier": "🎨 Edit", "🏆 Trophées": "🏆 Trophies", "🏆 Victoire": "🏆 Victory", "🏛️ Légende": "🏛️ Legend", "💥 Faillite": "💥 Bankruptcy", "💥 Échanger": "💥 Trade punches", "💰 Investir": "💰 Invest", "🔥 Série de": "🔥 Streak of", "🥊 Écurie (": "🥊 Stable (", "🧘 Respirer": "🧘 Breathe", "🧘 Souffler": "🧘 Catch breath", "🩹 Blessure": "🩹 Injury", "🫁 Au corps": "🫁 To the body", "! Prime :": "! Bonus:", "(méfiant)": "(wary)", ">Accepter": ">Accept", ">Inscrire": ">Enter", "Acheter ·": "Buy ·", "Améliorer": "Upgrade", "Argent II": "Silver II", "Bourses :": "Purses:", "Bureaux :": "Offices:", "Catégorie": "Weight class", "Ceintures": "Belts", "Combat de": "Fight of", "Confirmer": "Confirm", "Confirmés": "Proven", "Conseillé": "Recommended", "Continuer": "Continue", "Contrat :": "Contract:", "Création…": "Creating…", "Diamant I": "Diamond I", "ESQUIVE !": "SLIP!", "En guerre": "At war", "Expéditif": "Quick finisher", "Il laisse": "He lets", "La Havane": "Havana", "Le Mentor": "The Mentor", "Le Temple": "The Temple", "Match nul": "Draw", "Mondial :": "World:", "Médailles": "Medals", "Médaillés": "Medalists", "Notoriété": "Fame", "Personne.": "Nobody.", "Platine I": "Platinum I", "Plus tard": "Later", "Précision": "Accuracy", "Puissance": "Power", "Rejoindre": "Join", "Récupérer": "Recover", "Réessayer": "Try again", "Semaine ▸": "Week ▸", "Suivant →": "Next →", "Ta chaîne": "Your channel", "Ta région": "Your region", "Ton offre": "Your offer", "Tête dure": "Hard head", "\\nÉcran :": "\\nScreen:", "au tapis.": "down.", "boxeurs ·": "boxers ·", "catégorie": "weight class", "de frais.": "in fees.", "de prime.": "bonus.", "d’or pour": "of gold for", "gagne par": "wins by", "gratuit (": "free (", "ordonne à": "orders", "par arrêt": "by stoppage", "par stat.": "per stat.", "places, +": "seats, +", "remboursé": "refunded", "semaines.": "weeks.", "t’a défié": "challenged you", "vu il y a": "seen", "· titre «": "· title «", "Équilibré": "Balanced", "Événement": "Event", "↩️ Contre": "↩️ Counter", "✅ Réclamé": "✅ Claimed", "❌ Défaite": "❌ Loss", "➡️ Direct": "➡️ Straight", "🌀 Pivoter": "🌀 Pivot", "🎁 Gratuit": "🎁 Free", "🎵 Musique": "🎵 Music", "🏃 Reculer": "🏃 Back off", "🏆 Défense": "🏆 Defence", "🧱 Bloquer": "🧱 Block", "🩺 Guéri !": "🩺 Healed!", "% d’XP ·": "% XP ·", ") · Niv.": ") · Lvl.", "/sem. et": "/wk and", ">Valider": ">Confirm", "Accepter": "Accept", "Activées": "On", "Actuel :": "Current:", "Affûtage": "Sharpening", "Agressif": "Aggressive", "Argent I": "Silver I", "Au corps": "To the body", "BLOQUE !": "BLOCK!", "Blessé (": "Injured (", "CONTRE !": "COUNTER!", "Chance :": "Chance:", "Combat !": "Fight!", "Confirmé": "Proven", "Coup sec": "Snap punch", "Débloqué": "Unlocked", "Débutant": "Beginner", "Défendre": "Defend", "Défenses": "Defences", "Défensif": "Defensive", "Défier ·": "Challenge ·", "En ligne": "Online", "Entrée :": "Entrance:", "Gagne le": "Wins the", "Il gagne": "He wins", "Juge 1 :": "Judge 1:", "Légendes": "Legends", "Ma carte": "My card", "Mon pays": "My country", "Négocier": "Negotiate", "Ouvrir +": "Open +", "Palmarès": "Record", "Panthéon": "Pantheon", "Partie :": "Save:", "Pouvoirs": "Powers", "Rang max": "Max rank", "Repérage": "Scouting", "Roi lion": "Lion king", "Réglages": "Settings", "Régulier": "Regular", "Réserver": "Book", "Surnom :": "Nickname:", "Ta ville": "Your city", "Tes amis": "Your friends", "Ton avis": "Your feedback", "Ton club": "Your club", "Ton coin": "Your corner", "Ton gala": "Your gala", "Tournois": "Tournaments", "Un rival": "A rival", "Victoire": "Victory", "Vétérans": "Veterans", "\\nNote :": "\\nRating:", "abonnés.": "followers.", "achats à": "buys at", "blessé).": "injured).", "chez les": "at", "contre 1": "vs 1", "coups de": "punches of", "de repos": "of rest", "de stats": "of stats", "de suite": "in a row", "domine :": "dominates:", "débloqué": "unlocked", "défenses": "defences", "d’arrêt.": "stoppage.", "en ligne": "online", "en santé": "healthy", "fin dans": "ends in", "gagne le": "wins the", "global (": "overall (", "global ·": "overall ·", "médaille": "medal", "partagée": "shared", "passe en": "moves to", "place un": "lands a", "pour son": "for his", "trophées": "trophies", "un rival": "a rival", "· combat": "· fight", "· demain": "· tomorrow", "· depuis": "· since", "· occupé": "· busy", "· 🔒 niv.": "· 🔒 lvl.", "ÉPIQUE !": "EPIC!", "Éruption": "Eruption", "à placer": "to spend", "← Retour": "← Back", "⚡ Forcer": "⚡ Force", "✅ Battue": "✅ Beaten", "✅ Demain": "✅ Tomorrow", "✋ Manuel": "✋ Manual", "✓ Choisi": "✓ Chosen", "✓ Équipé": "✓ Equipped", "✕ Fermer": "✕ Close", "🏆 Succès": "🏆 Achievements", "💎 Linéal": "💎 Lineal", "📍 Région": "📍 Region", "🔓 Ouvert": "🔓 Open", "🔥 Retour": "🔥 Comeback", "🛡️ Tenir": "🛡️ Hold", "🧱 Bloque": "🧱 Block", "+ titre": "+ title", ", prime": ", bonus", "/sem. ·": "/wk ·", ">Défier": ">Challenge", ">Signer": ">Sign", "Activer": "Turn on", "Annuler": "Cancel", "Aussi :": "Also:", "Bientôt": "Soon", "Blessé.": "Injured.", "Boxeurs": "Boxers", "Ce soir": "Tonight", "Changer": "Change", "Choisir": "Choose", "Combats": "Fights", "Défaite": "Loss", "Défense": "Defence", "Envoyée": "Sent", "Fantôme": "Ghost", "Il perd": "He loses", "Je veux": "I want", "Juges :": "Judges:", "Le GOAT": "The GOAT", "Le ring": "The ring", "Loyauté": "Loyalty", "Légende": "Legend", "Prudent": "Cautious", "Préfère": "Prefers", "Refuser": "Decline", "Suivant": "Next", "Super !": "Great!", "Sénégal": "Senegal", "Ta note": "Your rating", "Ta part": "Your share", "Titre !": "Title!", "Ton nom": "Your name", "Vendu :": "Sold:", "Vitesse": "Speed", "Vétéran": "Veteran", "XP pour": "XP for", "abonnés": "followers", "bientôt": "soon", "ce soir": "tonight", "défense": "defence", "détenue": "held", "jab sec": "snap jab", "médical": "medical", "perd la": "loses the", "réagit…": "reacts…", "terminé": "over", "trophée": "trophy", "· frais": "· fees", "· prime": "· bonus", "· titre": "· title", "· 🤝 ami": "· 🤝 friend", "Égalité": "Tie", "Épreuve": "Test", "⚖ Pesée": "⚖ Weigh-in", "✅ À toi": "✅ Yours", "⭐ Atout": "⭐ Perk", "🌍 Monde": "🌍 World", "🏳️ Pays": "🏳️ Country", "👑 À toi": "👑 Yours", "💥 Finir": "💥 Finish", "🔄 Autre": "🔄 Other", ", avec": ", with", ", sem.": ", wk", "/sem.,": "/wk,", "Annulé": "Cancelled", "Argent": "Money", "Aucune": "None", "Blessé": "Injured", "Boxeur": "Boxer", "Brésil": "Brazil", "Départ": "Start", "En feu": "On fire", "Fermer": "Close", "Fidèle": "Loyal", "Gérant": "Manager", "Jour J": "Fight day", "Maître": "Master", "Menton": "Chin", "Niveau": "Level", "Or III": "Gold III", "PLACES": "SEATS", "Retour": "Back", "Réseau": "Network", "Voir ›": "View ›", "activé": "on", "ans) :": "yrs):", "blessé": "injured", "en jeu": "at stake", "engagé": "booked", "face à": "against", "gagnée": "won", "par KO": "by KO", "sem. ·": "wk ·", "· Beau": "· Nice", "· Sem.": "· Wk", "Épique": "Epic", "✅ Reçu": "✅ Received", "💰 Pari": "💰 Bet", "🔊 Sons": "🔊 Sounds", "🔒 Bats": "🔒 Beat", ") bat": ") beats", "/sem.": "/wk", "2 ans": "2 yrs", "3 ans": "3 yrs", "Aucun": "None", "Durée": "Duration", "Défis": "Challenges", "Forme": "Form", "Léger": "Lightweight", "Or II": "Gold II", "Passé": "Past", "Repos": "Rest", "Sûr ?": "Sure?", "Titre": "Title", "ans ·": "yrs ·", "coupé": "cut", "d’ici": "within", "gagné": "won", "signé": "signed", "sur 3": "of 3", "· Niv": "· Lvl", "· SUR": "· OF", "Élite": "Elite", "🤝 Nul": "🤝 Draw", "1 an": "1 yr", "Cote": "Rating", "NOTE": "RATING", "Niv.": "Lvl.", "Or I": "Gold I", "niv.": "lvl.", "prêt": "ready", "sem.": "wk", "· an": "· yr", "DÉF": "DEF", "IA": "AI", "Agrandir": "Expand", "Ajouter": "Add", "Allemagne": "Germany", "An": "Year", "Anniversaires": "Birthdays", "Argentine": "Argentina", "Atout": "Perk", "Australie": "Australia", "Bagarreur": "Brawler", "Bagarreurs": "Brawlers", "Battu": "Beaten", "Billets": "Tickets", "Bleu": "Blue", "Bombe": "Bomb", "Bosseur": "Grinder", "Caisse": "Bank", "Calculateur": "Calculator", "Calendrier": "Calendar", "Candidats": "Candidates", "Chef": "Head", "Combattre": "Fight", "Commanditaires": "Sponsors", "Commun": "Common", "Complet": "Complete", "Construire": "Build", "Coq": "Bantamweight", "Coupeur": "Cutter", "Coupure": "Cut", "Coupures": "Cuts", "Cracovie": "Krakow", "Crochet": "Hook", "Dans": "In", "Demander": "Ask", "Difficile": "Hard", "Documentaire": "Documentary", "Dortoirs": "Dorms", "Dynastie": "Dynasty", "Détroit": "Detroit", "Effacer": "Erase", "Enclume": "Anvil", "Entretien": "Upkeep", "Espoir": "Prospect", "Espoirs": "Prospects", "Facile": "Easy", "Fiche": "Page", "Finisseur": "Finisher", "Flamboyant": "Flashy", "Foudre": "Lightning", "Gagner": "Win", "Gaucher": "Southpaw", "Gestionnaire": "Manager", "Guerriers": "Warriors", "Hambourg": "Hamburg", "Immortel": "Immortal", "Inscription": "Sign-up", "Installations": "Facilities", "Intouchable": "Untouchable", "Irlande": "Ireland", "Italie": "Italy", "Japon": "Japan", "Limite": "Limit", "Location": "Rental", "Londres": "London", "Lourd": "Heavyweight", "Manille": "Manila", "Marteau": "Hammer", "Meilleurs": "Best", "Membre": "Member", "Mexique": "Mexico", "Mondial": "World", "Montagne": "Mountain", "Motivateur": "Motivator", "Motiver": "Motivate", "Mouche": "Flyweight", "Moyen": "Middleweight", "Mythique": "Mythic", "Nom": "Name", "Note": "Rating", "Nouvelle": "New", "Nul": "Draw", "Objectifs": "Goals", "Offre": "Offer", "Offres": "Offers", "Or": "Gold", "Paresseux": "Lazy", "Pays": "Country", "Perd": "Loses", "Philadelphie": "Philadelphia", "Phénix": "Phoenix", "Places": "Seats", "Plein": "Full", "Plume": "Featherweight", "Pologne": "Poland", "Potentiel": "Potential", "Pression": "Pressure", "Promoteur": "Promoter", "Proposer": "Propose", "Protecteur": "Protector", "Puncheur": "Puncher", "Rangs": "Ranks", "Rapport": "Report", "Recrues": "Recruits", "Renvoyer": "Fire", "Requin": "Shark", "Requis": "Required", "Respiration": "Breathing", "Retirer": "Remove", "Rivaux": "Rivals", "Signe": "Signs", "Signer": "Sign", "Soigneur": "Cutman", "Soins": "Care", "Son": "His", "Stade": "Stadium", "Succursale": "Branch", "Tempête": "Storm", "Toi": "You", "Tonnerre": "Thunder", "Tornade": "Tornado", "Tournoi": "Tournament", "Tous": "All", "Valeur": "Value", "Varsovie": "Warsaw", "Vert": "Green", "Vestiaires": "Locker rooms", "Violet": "Purple", "Voir": "View", "Écurie": "Stable", "Valider": "Confirm", "Envoyer": "Send", "Quitter": "Leave", "Membres": "Members", "Guerres": "Wars", "Boutique": "Shop", "Profil": "Profile", "Amis": "Friends", "Charger": "Load", "Sauvegarder": "Save", "Partager": "Share", "Commencer": "Start", "Précédent": "Previous", "Acheter": "Buy", "Vendre": "Sell", "Supprimer": "Delete", "Renommer": "Rename", "Modifier": "Edit", "Terminer": "Finish", "Payer": "Pay", "Gratuit": "Free", "Rang": "Rank", "Victoires": "Wins", "Défaites": "Losses", "Nuls": "Draws", "Titres": "Titles", "Saison": "Season", "Semaine": "Week", "Jour": "Day", "Coffre": "Chest", "Passe": "Pass", "Trophées": "Trophies", "Énergie": "Energy", "Moral": "Morale", "Recruter": "Recruit", "Libérer": "Release", "Entraîner": "Train", "Chargement": "Loading", "Moi": "Me", "Mur": "Wall", "Objectif": "Goal", "Adversaire": "Opponent", "Arbitre": "Referee", "Juges": "Judges", "Contrat": "Contract", "Salaire": "Salary", "Popularité": "Popularity", "Welter": "Welterweight", "Mi-lourd": "Light heavyweight", "Cogneur": "Puncher", "Combat": "Fight", "Finale": "Final", "Signature": "Signing", "Volcan": "Volcano", "Pressing": "Pressure", "Rose": "Pink", "Super-moyen": "Super middleweight", "Poids lourd": "Heavyweight", "Super-coq": "Super bantamweight", "Super-plume": "Super featherweight", "Super-welter": "Super welterweight", "boxeurs. Ils restent dans leur promotion, mais tu touches les profits chaque semaine et une part de chacun de leurs combats. Tu peux aussi faire passer n’importe lequel dans ton écurie, gratuitement.": "boxers. They stay in their promotion, but you collect the profits every week and a share of each of their fights. You can also move any of them into your stable, for free.", "📣 Campagnes marketing et 🩺 soins : dans la fiche de chaque boxeur. 💰 Racheter le contrat d’un boxeur d’un autre club : dans sa fiche de repérage. 🎪 Galas et 🏢 installations : dans leurs onglets.": "📣 Marketing campaigns and 🩺 care: in each boxer's page. 💰 Buy out a boxer from another club: in his scouting page. 🎪 Galas and 🏢 facilities: in their tabs.", "Bats-les dans l’ordre. Une tentative par jour, par légende et par boxeur. 12 rounds. Chaque légende battue débloque 2 pouvoirs exclusifs (Mythique et 🏛️ Panthéon) que tu peux ensuite tirer.": "Beat them in order. One attempt per day, per legend and per boxer. 12 rounds. Each legend beaten unlocks 2 exclusive powers (Mythic and 🏛️ Pantheon) that you can then roll.", "Livre pour livre : les meilleurs boxeurs du monde, toutes catégories confondues (note, ceintures, invaincu, victoires contre des champions, titres dans plusieurs divisions).": "Pound for pound: the best boxers in the world, all weight classes combined (rating, belts, unbeaten, wins over champions, titles in several divisions).", "Une partie prête : 2 000 000 $, 6 bons boxeurs (dont un champion WBC et IBO), staff 4-5 étoiles, installations et 2 gyms. Elle va dans l’emplacement choisi ci-dessus.": "A ready save: $2,000,000, 6 good boxers (including a WBC and IBO champion), 4-5 star staff, facilities and 2 gyms. It goes into the slot chosen above.", "🔒 Ta position exacte n’est jamais enregistrée : seuls ton pays et ta province le sont (arrondie à ~10 km pour la recherche). Changement possible une fois par 7 jours.": "🔒 Your exact position is never stored: only your country and province are (rounded to ~10 km for the lookup). Can be changed once every 7 days.", "Des promoteurs proposent des combats clés en main. Un court préavis paie plus, mais laisse moins de temps pour se préparer. Les offres expirent après 2 semaines.": "Promoters offer turnkey fights. Short notice pays more, but leaves less time to prepare. Offers expire after 2 weeks.", "🏆 Les ceintures des champions sont en jeu dans chacun de leurs combats : bats un champion et tu repars avec sa ceinture. Le vainqueur peut finir unifié !": "🏆 Champions' belts are on the line in every one of their fights: beat a champion and you leave with his belt. The winner can become unified!", ". Chaque nouveau rang atteint donne une récompense à réclamer (une seule fois). À partir de Diamant, chaque rang ajoute aussi un trophée à ton profil.": ". Each new rank reached gives a reward to claim (only once). From Diamond on, each rank also adds a trophy to your profile.", "Tournois à élimination d’un soir : 8 boxeurs de la division de ton boxeur, 3 combats de 4 rounds d’affilée. La fatigue et les blessures s’accumulent.": "One-night elimination tournaments: 8 boxers from your boxer's division, 3 fights of 4 rounds in a row. Fatigue and injuries add up.", "Les promotions rivales et leurs écuries. Touche une promotion pour voir ses boxeurs. Si une promotion fait faillite, tu peux la racheter (maximum": "Rival promotions and their stables. Tap a promotion to see its boxers. If a promotion goes bankrupt, you can buy it (maximum", "Chaque fédération a son propre classement. Top 10 pour défier son champion. Les 4 grandes ceintures réunies font un champion undisputed.": "Each federation has its own rankings. Top 10 to challenge its champion. The 4 major belts together make an undisputed champion.", "Chaque province et chaque pays a sa propre ceinture dans les 9 catégories. Bats le champion de ta région pour lui voler sa ceinture !": "Each province and each country has its own belt in all 9 weight classes. Beat your region's champion to steal his belt!", "Organise tes propres soirées : tu choisis l’arène, la date et le prix des billets, tu paies les adversaires et tu gardes les revenus.": "Run your own nights: you pick the arena, the date and ticket prices, you pay the opponents and you keep the revenue.", "Tes premiers espoirs viennent d’ici, et tu montes d’abord le classement national de ce pays avant de viser les ceintures mondiales.": "Your first prospects come from here, and you climb this country's national rankings first before aiming for world belts.", "Monter : +puissance, −vitesse. Descendre : +vitesse, −cardio et menton. Il perd ses ceintures et 40 % de ses points de classement.": "Moving up: +power, −speed. Moving down: +speed, −cardio and chin. He loses his belts and 40% of his ranking points.", "Pour soutenir le jeu. Le style ne change rien en combat, et les pièces 💰 servent surtout à jouer plus (énergie, camps, rerolls).": "To support the game. Style changes nothing in fights, and 💰 coins are mostly for playing more (energy, camps, rerolls).", "Les gérants IA se battent entre eux toutes les 2 minutes : les classements, les ceintures et les clubs bougent même sans toi.": "AI managers fight each other every 2 minutes: rankings, belts and clubs move even without you.", "Aucune offre pour l’instant. Les promoteurs contactent ton club chaque semaine, plus souvent quand tes boxeurs sont connus.": "No offers for now. Promoters contact your club every week, more often when your boxers are well known.", "L’XP se mérite : beaucoup contre un adversaire plus fort, presque rien contre un plus faible. Chaque niveau donne 5 points.": "XP is earned: a lot against a stronger opponent, almost nothing against a weaker one. Each level gives 5 points.", "Un bureau attire les talents de ce pays (agents libres, amateurs) et remplit plus tes galas dans ce pays (+10 % de public).": "An office attracts talent from that country (free agents, amateurs) and fills your galas there more (+10% crowd).", "Partie maximale : 50 M$, gérant niveau 30, tout au maximum, 18 boxeurs dont 9 champions undisputed à 99 (un par division).": "Max save: $50M, manager level 30, everything maxed, 18 boxers including 9 undisputed champions at 99 (one per division).", "/sem.) et 15 % des bourses de ses victoires. « Faire passer dans mon écurie » amène un boxeur dans ton club principal": "/wk) and 15% of his winning purses. « Move into my stable » brings a boxer to your main club", "Ton rang vient de ta meilleure cote : celle de ton gérant (ELO) ou de ton meilleur boxeur. Meilleure cote actuelle :": "Your rank comes from your best rating: your manager's (ELO) or your best boxer's. Current best rating:", "Touche un adversaire pour son rapport complet. Les % tiennent compte du camp que ton boxeur aura le temps de faire (plus de semaines = meilleure préparation).": "Tap an opponent for his full report. The % assume a normal camp and a rested boxer on fight day.", "Affronte un club de force équivalente pendant 24 h : le club dont les membres gagnent le plus de combats l’emporte.": "Face a club of similar strength for 24 h: the club whose members win the most fights takes it.", "Bûcheron irlandais des années 60, il cognait comme une hache. Il commence fort : tiens le coup les premiers rounds.": "Irish lumberjack from the 60s, he hit like an axe. He starts strong: hold on through the early rounds.", "Choisis une partie pour entrer en ligne (ton écurie en ligne est séparée de ta carrière, elle ne change rien).": "Pick a save to go online (your online stable is separate from your career, it changes nothing).", "sans plan de match. Ton entraîneur peut choisir le plan conseillé pour chacun, et les camps se gèrent en auto.": "without a game plan. Your coach can pick the recommended plan for each, and camps can run on auto.", "» en haut pour les gérer, les entraîner et leur réserver des combats, comme ton club. Tu touches ses profits (": "» at the top to manage them, train them and book their fights, like your club. You collect its profits (", ". Il veut monter d’une catégorie pour devenir champion dans plusieurs divisions et entrer dans l’histoire.": ". He wants to move up a weight class to become a multi-division champion and make history.", "d’entraînement (plus le boxeur est haut niveau, plus le camp est long et cher). +4 dans une stat pour son": "of training (the higher the boxer's level, the longer and pricier the camp). +4 in a stat for his", "Sur ton autre appareil : Réglages (l’engrenage) → Exporter ma sauvegarde → Copier le code. Colle-le ici.": "On your other device: Settings (the gear) → Export my save → Copy the code. Paste it here.", "Partie maximale : 50 M$, gérant niveau 30, 18 boxeurs dont 9 champions undisputed. Tout est au maximum.": "Max save: $50M, manager level 30, 18 boxers including 9 undisputed champions. Everything is maxed.", "Coin Rouge Empire · An 5, sem. 13 · 83,5 M$ · 24 boxeurs. Elle va dans l’emplacement choisi ci-dessus.": "Coin Rouge Empire · Year 5, wk 13 · $83.5M · 24 boxers. It goes into the slot chosen above.", "Fais travailler ton argent : chaque investissement rapporte chaque semaine ou rend ton club plus fort.": "Put your money to work: each investment pays every week or makes your club stronger.", "Organise tes galas chez toi, sans location. Elle rapporte aussi chaque semaine (concerts, événements).": "Host your galas at home, with no rental. It also earns every week (concerts, events).", "Tes atouts montent tout seuls en jouant : signe des boxeurs, gagne des combats, organise des galas.": "Your perks level up on their own as you play: sign boxers, win fights, run galas.", "Tes boxeurs retraités. Un ancien champion peut revenir comme entraîneur (onglet Staff, candidats).": "Your retired boxers. A former champion can come back as a coach (Staff tab, candidates).", "Partie de test : 2 000 000 $, 6 boxeurs, staff et installations au maximum de test. Amuse-toi !": "Test save: $2,000,000, 6 boxers, staff and facilities at test max. Have fun!", "Classement de tous les temps, toutes divisions. Touche un boxeur pour voir son mur des succès.": "All-time rankings, all divisions. Tap a boxer to see his wall of achievements.", "8 boxeurs de ta catégorie, à élimination : quart, demie, finale. Inscription 100 💰. Gagnant :": "8 boxers from your weight class, knockout format: quarter, semi, final. Entry 100 💰. Winner:", "Une piste de style en plus (entrées, gants, rings). Seulement de l’apparence, aucun avantage.": "One more style track (entrances, gloves, rings). Looks only, no advantage.", "Fin de carrière : grosse perte annuelle, récupération plus lente, blessures plus fréquentes.": "End of career: big yearly decline, slower recovery, more frequent injuries.", "T-shirts, gants, casquettes : les revenus suivent les abonnés de tes boxeurs. Maintenant : +": "T-shirts, gloves, caps: revenue follows your boxers' followers. Now: +", "! Ses ceintures sont libérées. Objectif : un titre dans une 2e division (+150 points GOAT).": "! His belts are vacated. Goal: a title in a 2nd division (+150 GOAT points).", "Loyauté sous 25 : il réclame une augmentation. À 5 : il part. Au-dessus de 80 : +10 % d’XP.": "Loyalty under 25: he asks for a raise. At 5: he leaves. Above 80: +10% XP.", "Ta propre chaîne de streaming. Les abonnés suivent les abonnés de tes boxeurs et tes galas.": "Your own streaming channel. Subscribers follow your boxers' followers and your galas.", "Le % tient compte de la forme du soir de chacun : un boxeur en feu peut créer la surprise.": "The % accounts for each one's form on the night: a boxer on fire can cause an upset.", "Envoie tes recruteurs dans un pays : les boxeurs trouvés arrivent chez les agents libres.": "Send your scouts to a country: boxers found join the free agents.", "On dit qu’il n’a jamais perdu un round. Son souffle du dragon met tout le monde au tapis.": "They say he never lost a round. His dragon's breath puts everyone on the canvas.", "Un poids lourd du Bronx qui explose sans prévenir. Ses knockdowns arrivent de nulle part.": "A Bronx heavyweight who explodes without warning. His knockdowns come out of nowhere.", "Les autres clubs signent des agents libres et peuvent faire des offres sur tes boxeurs.": "Other clubs sign free agents and can make offers for your boxers.", "Un jeune de 18 ans se présente au gym. Pas d’agent, des gants usés et beaucoup de cœur.": "An 18-year-old shows up at the gym. No agent, worn-out gloves and a lot of heart.", "Ce code ne fonctionne pas. Vérifie qu’il est complet : il commence par CRZ1: ou CRJ1:.": "This code doesn't work. Check it's complete: it starts with CRZ1: or CRJ1:.", "Pas d’idée ? Touche 🎲 pour un nom au hasard. Tu pourras jouer avec n’importe quel nom.": "No idea? Tap 🎲 for a random name. You can play with any name.", "sans plan de match. Signe tous tes combats d’abord, puis planifie les camps d’un coup.": "without a game plan. Sign all your fights first, then plan the camps at once.", ". Les combats de titre, les rivalités et les boxeurs populaires remplissent la salle.": ". Title fights, rivalries and popular boxers fill the venue.", "Le buzz explose : +4 popularité et bourse +10 %, mais l’adversaire est piqué au vif.": "The buzz explodes: +4 popularity and purse +10%, but the opponent is stung.", "Il vole comme un papillon et pique comme une abeille. Presque impossible à toucher.": "He floats like a butterfly and stings like a bee. Almost impossible to hit.", ": victoire +30 trophées (plus contre un club plus fort), égalité +10, défaite −15.": ": win +30 trophies (more against a stronger club), tie +10, loss −15.", "Nouvelle liste toutes les 4 semaines. Prime de signature : 10 semaines de salaire.": "New list every 4 weeks. Signing bonus: 10 weeks of salary.", ". Son corps ralentit. Il te demande ton avis : continuer ou partir en champion ?": ". His body is slowing down. He asks your opinion: keep going or leave as a champion?", "Bâtis ton écurie en ligne : un boxeur par catégorie, monte au classement mondial": "Build your online stable: one boxer per weight class, climb the world rankings", "Un gala pour un hôpital pour enfants invite ton club. Les frais sont de 2 000 $.": "A children's hospital gala invites your club. The fee is $2,000.", "Chaque saison, les 8 meilleurs boxeurs d’une division s’affrontent sur 3 tours.": "Each season, the 8 best boxers of a division face off over 3 rounds.", "3 missions par mois, avec de l’argent et de l’XP de gérant. Nouvelles missions": "3 missions per month, with money and manager XP. New missions", "Le corps ralentit : vitesse, cardio et menton baissent chaque année. XP ×0,6.": "The body slows down: speed, cardio and chin drop every year. XP ×0.6.", "Une montagne de muscles qui n’est jamais tombée. Il faudra frapper longtemps.": "A mountain of muscle who has never gone down. You'll have to hit him for a long time.", "Le requin de Tijuana : dès que tu saignes, il attaque. Évite d’être ébranlé.": "The shark of Tijuana: as soon as you bleed, he attacks. Avoid getting hurt.", "Les records de tous les temps de ton univers, Temple de la renommée compris.": "All-time records of your universe, Hall of Fame included.", "Le badge 🎖️ devant ton nom, partout dans le jeu. Merci de soutenir le jeu !": "The 🎖️ badge before your name, everywhere in the game. Thanks for supporting the game!", "Le plus rapide de sa génération. Il lance deux coups quand tu en lances un.": "The fastest of his generation. He throws two punches when you throw one.", "· finaliste 300 · demi-finaliste 100. Un tournoi par boxeur et par semaine.": "· runner-up 300 · semi-finalist 100. One tournament per boxer per week.", ", s’il se bat dans les 8 prochaines semaines. Sinon : 8 000 $ de pénalité.": ", if he fights within the next 8 weeks. Otherwise: $8,000 penalty.", "Le buzz monte (+5 notoriété), mais la commission inflige 1 500 $ d’amende.": "The buzz grows (+5 fame), but the commission hands out a $1,500 fine.", "Au sommet de sa carrière. Il gagne en expérience (défense) chaque année.": "At the peak of his career. He gains experience (defence) every year.", "Connecte-toi pour les relier à ton compte et ne plus jamais les perdre ›": "Log in to link them to your account and never lose them again ›", "L’énergie de tous tes boxeurs remonte 2 fois plus vite (24 % par heure).": "The energy of all your boxers refills 2× faster (24% per hour).", "Nouveaux candidats toutes les 4 semaines. Frais : 6 semaines de salaire.": "New candidates every 4 weeks. Fee: 6 weeks of salary.", "Rejoins un club : guerres de clubs, objectif de la semaine, chat et mur.": "Join a club: club wars, weekly goal, chat and wall.", "et le trophée au vainqueur. La prochaine commence à la semaine 3 de l’an": "and the trophy to the winner. The next one starts in week 3 of year", "XP · Le niveau débloque les arènes, les villes de gala et les tournois.": "XP · Level unlocks arenas, gala cities and tournaments.", "Deux paires exclusives pour tous tes boxeurs : or massif et noir & or.": "Two exclusive pairs for all your boxers: solid gold and black & gold.", "Progresse très vite : XP d’entraînement ×1,3 et il mûrit chaque année.": "Improves very fast: training XP ×1.3 and he matures every year.", "a été vu en boîte de nuit à 3 h du matin, la veille d’un entraînement.": "was seen at a nightclub at 3 a.m., the night before training.", "part en champion. Il entre au Temple de la renommée avec les honneurs.": "leaves as a champion. He enters the Hall of Fame with honours.", "Le meilleur de l’histoire. Le battre fait de toi une légende vivante.": "The greatest in history. Beating him makes you a living legend.", "Un dragon et une pluie de flammes quand ton boxeur monte sur le ring.": "A dragon and a rain of flames when your boxer steps into the ring.", ". Pendant le camp, il ne peut pas se battre. Un seul camp toutes les": ". During camp, he can't fight. Only one camp every", "Encore en progression : XP ×1,1. Il approche de son meilleur niveau.": "Still improving: XP ×1.1. He's nearing his best level.", "Notifications refusées : autorise-les dans les réglages du téléphone": "Notifications refused: allow them in your phone settings", "Roi de Londres pendant 10 ans. Il finit toujours ce qu’il commence.": "King of London for 10 years. He always finishes what he starts.", ". +2 places de boxeur et des revenus d’abonnements chaque semaine.": ". +2 boxer slots and membership revenue every week.", "Une marque de boissons énergisantes offre 6 000 $ pour commanditer": "An energy drink brand offers $6,000 to sponsor", "promet un KO ! S’il ne le fait pas, les médias vont s’en souvenir.": "promises a KO! If he doesn't deliver, the media will remember.", ". Chaque bonus (jusqu’à 3) renforce ce domaine le soir du combat.": ". Each bonus (up to 3) boosts that area on fight night.", "continue. Le public l’adore… mais le déclin pourrait s’accélérer.": "keeps going. The crowd loves him… but the decline could speed up.", "Champion d’Europe en 1975. Une droite comme un marteau de forge.": "European champion in 1975. A right hand like a forge hammer.", "📨 Demande envoyée. Un président ou un recruteur doit l’accepter.": "📨 Request sent. A president or recruiter must accept it.", "Appuie longtemps sur l’image pour l’enregistrer ou la partager.": "Long-press the image to save or share it.", "Belle soirée : +3 notoriété et +4 loyauté pour toute l’écurie.": "Great night: +3 fame and +4 loyalty for the whole stable.", "se plaint d’une douleur à la main droite après l’entraînement.": "complains of pain in his right hand after training.", "⚔️ La guerre est lancée ! 24 h pour gagner le plus de combats.": "⚔️ The war has started! 24 h to win the most fights.", "Choisis un de tes boxeurs de cette division dans « Réserver »": "Pick one of your boxers from this division in « Book »", "Crée ton club, choisis ton pays et tes deux premiers boxeurs": "Create your club, choose your country and your first two boxers", "Viens boxer contre moi sur FIGHT DYNASTY 🥊 Mon code ami :": "Come box against me on FIGHT DYNASTY 🥊 My friend code:", ": il est mieux classé que toi (le battre te fait monter).": ": he's ranked higher than you (beating him moves you up).", "Il quitte ton écurie pour de bon et libère sa catégorie.": "He leaves your stable for good and frees up his weight class.", "· bats le champion de ta région pour prendre sa ceinture": "· beat your region's champion to take his belt", "Change les couleurs du jeu et les gants de tes boxeurs.": "Changes the game's colours and your boxers' gloves.", "Seulement de l’apparence. Ce que tu débloques est à toi": "Looks only. What you unlock is yours", ", pour tous tes boxeurs : changer ensuite est gratuit.": ", for all your boxers: switching afterwards is free.", ", puis ouvre le jeu depuis l’icône (iOS 16.4 ou plus).": ", then open the game from the icon (iOS 16.4 or later).", "Impossible de trouver ta région. Choisis-la à la main.": "Couldn't find your region. Pick it manually.", "Une récompense de style à chaque palier de la saison.": "A style reward at every tier of the season.", "décline l’invitation. Un autre boxeur prend sa place.": "declines the invitation. Another boxer takes his place.", "(plus si l’adversaire est plus fort). Défaite : −15.": "(more if the opponent is stronger). Loss: −15.", "Badge doré sur ton profil, merci de soutenir le jeu": "Gold badge on your profile, thanks for supporting the game", "Localisation refusée : choisis ta région à la main.": "Location refused: pick your region manually.", "🎁 Ta nouvelle carrière est prête dans l’emplacement": "🎁 Your new career is ready in slot", "· 100 XP par victoire (+50 KO), 60 nul, 40 défaite": "· 100 XP per win (+50 KO), 60 draw, 40 loss", "Dis-nous ce qui marche et ce qu’il faut améliorer": "Tell us what works and what needs improving", "Tes nouveaux camps durent 2 fois moins longtemps.": "Your new camps last half as long.", "Une récompense de style à chaque niveau de saison": "A style reward at every season level", "rejoint l’écurie pour 120 $/sem. Gros potentiel !": "joins the stable for $120/wk. Big potential!", "/sem. · salaires réduits (contrats de promotion)": "/wk · reduced salaries (promotion contracts)", "(300 par pouvoir), tous différents des actuels.": "(300 per power), all different from the current ones.", "Ouvert : tout le monde peut entrer sans demande": "Open: anyone can join without a request", "Deux culottes exclusives : or et noir de nuit.": "Two exclusive trunks: gold and midnight black.", "Tes boxeurs gagnent 50 % plus d’XP par combat.": "Your boxers earn 50% more XP per fight.", "Installe d’abord le jeu sur l’écran d’accueil": "First install the game on your home screen", "Pour les vrais gérants : chaque dollar compte": "For real managers: every dollar counts", "Tes carrières sont seulement sur ce téléphone": "Your careers are only on this phone", "⚔️ Touche encore pour lancer la guerre (24 h)": "⚔️ Tap again to start the war (24 h)", "(2 de base + vestiaires + 2 par gym ouvert).": "(2 base + locker rooms + 2 per open gym).", "/20 · les bonus profitent à tous tes boxeurs": "/20 · bonuses benefit all your boxers", "Motifs exclusifs (flammes, drapeau, éclairs)": "Exclusive patterns (flames, flag, lightning)", "Pour défier ce champion, il faut être top 10": "To challenge this champion, you must be top 10", "Pour recevoir les notifications sur iPhone :": "To get notifications on iPhone:", "Ton appareil ne permet pas les notifications": "Your device doesn't support notifications", "Bats les 3 boxeurs d’un gym pour son badge.": "Beat a gym's 3 boxers for its badge.", "Ce qui est mêlant, trop dur, ce qui manque…": "What's confusing, too hard, what's missing…", "/sem. + 15 % des bourses de ses victoires.": "/wk + 15% of his winning purses.", "Impossible de lire la sauvegarde intégrée.": "Couldn't read the built-in save.", "Ton appareil ne permet pas la localisation": "Your device doesn't support location", "et le trophée au vainqueur. Il participe ?": "and the trophy to the winner. Does he take part?", "reste classe : moral et loyauté en hausse.": "stays classy: morale and loyalty up.", "L’expérience prévue : chaque choix compte": "The intended experience: every choice matters", "🏆 Tournoi de la semaine · se termine dans": "🏆 Tournament of the week · ends in", "fait face aux médias. Quel ton adopter ?": "faces the media. What tone to take?", "sur les réseaux et réclame une revanche.": "on social media and demands a rematch.", "Entrée exclusive avec dragon et flammes": "Exclusive entrance with dragon and flames", "La commission inflige 1 500 $ d’amende.": "The commission hands out a $1,500 fine.", "Un vieil entraîneur bénévole (1 étoile)": "An old volunteer coach (1 star)", "au gagnant (le perdant paie la moitié).": "to the winner (the loser pays half).", "te défie : Club contre Club, 3 combats,": "challenges you: Club vs Club, 3 fights,", "Guérit tout de suite un boxeur blessé.": "Instantly heals an injured boxer.", "faible mais peut devenir une légende ·": "weak but can become a legend ·", "Aucun avantage à acheter · Aucune pub": "No advantage for sale · No ads", "10 Count Games présente FIGHT DYNASTY": "10 Count Games presents FIGHT DYNASTY", "Ton logo et tes couleurs sur le ring.": "Your logo and colours on the ring.", "Un pouvoir : 400 💰 · Tous d’un coup :": "One power: 400 💰 · All at once:", "se repose une semaine par précaution.": "rests for a week as a precaution.", "Beaucoup d’abonnés, risque d’amende.": "Lots of followers, risk of a fine.", "Blessures plus rares et plus courtes": "Rarer and shorter injuries", "Ton logo et tes couleurs sur le ring": "Your logo and colours on the ring", "gagne maintenant, ne progresse plus.": "wins now, no longer improves.", "📖 Tous les pouvoirs et leurs chances": "📖 All powers and their odds", "Les juges ont rendu leur décision :": "The judges have reached their decision:", "paie l’amende, mais n’apprécie pas.": "pays the fine, but doesn't like it.", "👁️ Voir mon profil comme les autres": "👁️ View my profile as others see it", "🥊 Fiche du club depuis la fondation": "🥊 Club record since its founding", "Vitesse par défaut de l’animation.": "Default animation speed.", "voulait partir… loyauté en baisse.": "wanted to leave… loyalty down.", "Barres : forme · moral · loyauté.": "Bars: form · morale · loyalty.", "Défense de titre obligatoire pour": "Mandatory title defence for", "Le buzz monte : +5 notoriété pour": "The buzz grows: +5 fame for", "Les combats en 3D, les ceintures…": "3D fights, belts…", "peut apprendre un nouveau trait !": "can learn a new trait!", "🏋️ Amélioration du gym terminée !": "🏋️ Gym upgrade complete!", "Le résultat réel varie de ±12 %.": "The actual result varies by ±12%.", "Partager → Sur l’écran d’accueil": "Share → Add to Home Screen", "Pour découvrir le jeu tranquille": "To discover the game at ease", "Ses boxeurs sont à toi : dans l’": "Its boxers are yours: in the", "avant la semaine d’entraînement.": "before the training week.", "sem., sinon il perd la ceinture.": "wks, or he loses the belt.", "📣 Mur du club · 7 derniers jours": "📣 Club wall · last 7 days", "🔍 Envoyer un recruteur · 5 000 $": "🔍 Send a scout · $5,000", "Nouvelle carrière · emplacement": "New career · slot", "Prendre sa retraite en champion": "Retire as a champion", "Sélectionne le code et copie-le": "Select the code and copy it", "🎲 Tous les pouvoirs relancés (−": "🎲 All powers rerolled (−", "📱 Ta sauvegarde de l’ordinateur": "📱 Your computer save", ") · touche pour voir le profil": ") · tap to view profile", "➜ Faire passer dans mon écurie": "➜ Move into my stable", "Tu ajoutes les combats après.": "You add fights afterwards.", "de ton boxeur · gain possible": "of your boxer · possible gain", "est blessé pendant son camp (": "gets injured during camp (", "· gros prix et pouvoirs rares": "· big prizes and rare powers", "📤 Partager ma carte de gérant": "📤 Share my manager card", "Les rangs de club se gagnent": "Club ranks are earned", "Recruter un jeune · 20 000 $": "Recruit a youngster · $20,000", "Tu refuses l’augmentation de": "You refuse the raise of", "Tu refuses poliment l’offre.": "You politely decline the offer.", "Un journaliste veut parler à": "A journalist wants to talk to", "🏟️ Objectif du club : +250 💰": "🏟️ Club goal: +250 💰", "💬 Donner mon avis sur le jeu": "💬 Give feedback on the game", "🔎 Expéditions de recrutement": "🔎 Scouting expeditions", "🚀 Charger la partie maximale": "🚀 Load the max save", "Accepter sa demande · prime": "Accept his demand · bonus", "Aucun boxeur pour l’instant": "No boxers yet", "Gants dorés brillants en 3D": "Shiny gold gloves in 3D", "Impossible de créer l’image": "Couldn't create the image", "Ta sauvegarde est chargée !": "Your save is loaded!", "pour racheter le contrat de": "to buy out the contract of", "⚔️ Récompense de guerre : +": "⚔️ War reward: +", "🔕 Notifications désactivées": "🔕 Notifications turned off", ". Gagne : +300 💰 chacun et": ". Win: +300 💰 each and", "Carte de gérant · en ligne": "Manager card · online", "Passe de saison cosmétique": "Cosmetic season pass", "est content, mais fatigué.": "is happy, but tired.", "réclame une augmentation :": "asks for a raise:", "seulement avec les guerres": "only through wars", "📩 Invitation : Super Série": "📩 Invitation: Super Series", "🔔 Notifications activées !": "🔔 Notifications turned on!", "🤝 Bienvenue dans le club !": "🤝 Welcome to the club!", "Charger la partie de test": "Load the test save", "C’est toi ! Gérant niveau": "That's you! Manager level", "Des abonnés et + loyauté.": "Followers and + loyalty.", "Des abonnés, sans risque.": "Followers, no risk.", "Entraîneur-chef 2 étoiles": "2-star head coach", "Négocier une prolongation": "Negotiate an extension", "Où, et ce qui s’est passé": "Where, and what happened", "Partie maximale chargée !": "Max save loaded!", "Projection sur 4 semaines": "4-week projection", "Territoires du Nord-Ouest": "Northwest Territories", "Tu déclines l’invitation.": "You decline the invitation.", "❄️ Cryothérapie · 8 000 $": "❄️ Cryotherapy · $8,000", "! Quart de finale contre": "! Quarter-final against", "+ trophée (points GOAT).": "+ trophy (GOAT points).", "250 💰 pour chaque membre": "250 💰 for each member", "Changements de champions": "Champion changes", "Partie de test chargée !": "Test save loaded!", "Plan conseillé pour tous": "Recommended plan for all", "Popularité de la carte :": "Card popularity:", "Voir les 8 rangs de club": "View the 8 club ranks", "✅ Nouveau membre accepté": "✅ New member accepted", "🎤 Mesdames et messieurs…": "🎤 Ladies and gentlemen…", "🏅 Récompense de rang : +": "🏅 Rank reward: +", "🏗️ Construction lancée :": "🏗️ Construction started:", "📍 Ceintures de ta région": "📍 Your region's belts", ". Il n’est pas content.": ". He's not happy.", "25 000 $ pour commencer": "$25,000 to start", "50 000 $ pour commencer": "$50,000 to start", "Augmentation accordée à": "Raise granted to", "Dans le coin (1 minute)": "In the corner (1 minute)", "Ouvrir un nouveau gym :": "Open a new gym:", "Provoquer tout le monde": "Trash-talk everyone", "Terre-Neuve-et-Labrador": "Newfoundland and Labrador", "boxeurs à racheter pour": "boxers to buy for", "promotions : ton club +": "promotions: your club +", "s’entraîne maintenant à": "now trains at", "Énergie 8 % plus rapide": "Energy 8% faster", "🎨 Création de ta carte…": "🎨 Creating your card…", "🎲 Relancer les pouvoirs": "🎲 Reroll powers", "👑 Panthéon des légendes": "👑 Pantheon of legends", "Fonder un club (500 💰)": "Found a club (500 💰)", "Objectif de la semaine": "Weekly goal", "Revanche signée contre": "Rematch signed against", "Tes 2 premiers boxeurs": "Your first 2 boxers", "apprécie ta confiance.": "appreciates your trust.", "solide tout de suite ·": "solid right away ·", "⚡ Points dépensés pour": "⚡ Points spent for", "✈️ Recruteurs réservés": "✈️ Scouts booked", "✨ Badge devant ton nom": "✨ Badge before your name", "🌍 Bureaux à l’étranger": "🌍 Offices abroad", "🏅 Rangs et récompenses": "🏅 Ranks and rewards", "🏆 Inscrit au tournoi !": "🏆 Entered in the tournament!", "💰 Parier sur le combat": "💰 Bet on the fight", "📍 Région enregistrée :": "📍 Region saved:", "📺 Ta chaîne est lancée": "📺 Your channel is live", ": regarde la ceinture": ": look at the belt", ": tu es mieux classé.": ": you're ranked higher.", "Aucun staff au départ": "No staff at the start", "Camps 8 % plus courts": "Camps 8% shorter", "Défenses obligatoires": "Mandatory defences", "Engager un entraîneur": "Hire a coach", "Estimation financière": "Financial estimate", "Le jeune repart déçu.": "The kid leaves disappointed.", "Le plus grand de tous": "The greatest of all", "Monter de catégorie ?": "Move up a weight class?", "Sauvegarde importée !": "Save imported!", "Sauvegardes reliées à": "Saves linked to", "de combat en attente.": "fight pending.", "Île-du-Prince-Édouard": "Prince Edward Island", "🎨 Couleur de ton club": "🎨 Your club colour", "🏷️ Titre sous ton nom": "🏷️ Title under your name", ". Accepte ou refuse.": ". Accept or decline.", "8 caractères minimum": "8 characters minimum", "Accepter la revanche": "Accept the rematch", "Catégorie de poids ·": "Weight class ·", "Ce combat se termine": "This fight ends", "Culottes légendaires": "Legendary trunks", "C’est un MATCH NUL !": "It's a DRAW!", "Lui donner sa chance": "Give him his chance", "L’énergie remonte de": "Energy refills by", "Nouveau mot de passe": "New password", "Offre de combat pour": "Fight offer for", "Pas de province pour": "No province for", "Salle d’entraînement": "Training room", "Ses derniers combats": "His latest fights", "Tu as quitté le club": "You left the club", "Vidéo d’entraînement": "Training video", "de stats à dépenser.": "stat points to spend.", "par arrêt médical au": "by medical stoppage in", "Âge & vieillissement": "Age & ageing", "← Retour aux boxeurs": "← Back to boxers", "⚔️ Dernière guerre :": "⚔️ Last war:", "⚠️ Retirer ce boxeur": "⚠️ Remove this boxer", "🏷️ Titre affiché : «": "🏷️ Displayed title: «", "💰 Négocier le rachat": "💰 Negotiate the buyout", "📍 Région (ceintures)": "📍 Region (belts)", "Affiche enregistrée": "Poster saved", "Aucun combat prévu.": "No fights planned.", "Monter de catégorie": "Move up a weight class", "Mot de passe actuel": "Current password", "Nouvel entraîneur :": "New coach:", "Places de boxeurs :": "Boxer slots:", "Repos d’une semaine": "One week of rest", "Ring d’entraînement": "Training ring", "Spectateurs estimés": "Estimated spectators", "Un jeune à la porte": "A kid at the door", "Vitesse des combats": "Fight speed", "ami choisit à qui l": "friend chooses who", "ans et porte encore": "yrs and still wears", "reste, un peu déçu.": "stays, a bit disappointed.", "🎪 Organiser un gala": "🎪 Organize a gala", "💥 À vendre · encore": "💥 For sale · still", "🛍️ Produits dérivés": "🛍️ Merchandise", "🥊 Gérer ses boxeurs": "🥊 Manage his boxers", "Combats de légende": "Legend fights", "Consigne en direct": "Live instruction", "Entrée sur le ring": "Ring entrance", "Gants en or massif": "Solid gold gloves", "Il demande environ": "He's asking for about", "Lancer la chaîne ·": "Launch the channel ·", "Le Marteau de 1975": "The Hammer of 1975", "Offre de transfert": "Transfer offer", "Ouvrir un bureau ·": "Open an office ·", "Quitter la reprise": "Leave the replay", "Rester et défendre": "Stay and defend", "Touche pour passer": "Tap to skip", "d’atout de gérant.": "manager perk.", "⚔️ GUERRE EN COURS": "⚔️ WAR IN PROGRESS", "⚔️ Guerre de clubs": "⚔️ Club war", "⚔️ Guerres de club": "⚔️ Club wars", "✨ Passe cosmétique": "✨ Cosmetic pass", "🎟️ Passe de saison": "🎟️ Season pass", "Ce gym est plein.": "This gym is full.", "Choisis un boxeur": "Choose a boxer", "Coulisses du club": "Club backstage", "Douleur à la main": "Hand pain", "Déroulé du combat": "Fight log", "ENTRÉE ÉLECTRIQUE": "ELECTRIC ENTRANCE", "Entrée « Dragon »": "« Dragon » entrance", "Finir le round ▸▸": "Finish the round ▸▸", "Importer et jouer": "Import and play", "Nouvelle carrière": "New career", "Ring personnalisé": "Custom ring", "Ton nom de gérant": "Your manager name", "Écart de conduite": "Misconduct", "🏋️ Camps terminés": "🏋️ Camps done", "💰 Avec tes pièces": "💰 With your coins", "📩 Défis en direct": "📩 Live challenges", "📩 Invitation à la": "📩 Invitation to the", "🩺 Soins d’élite ·": "🩺 Elite care ·", "Défis personnels": "Personal challenges", "ENTRÉE DU DRAGON": "DRAGON ENTRANCE", "Le Dernier Round": "The Last Round", "Le Titan de Kyiv": "The Titan of Kyiv", "L’Éclair d’Osaka": "The Osaka Lightning", "Nom de la soirée": "Night name", "Passe cosmétique": "Cosmetic pass", "Passer l’épreuve": "Take the test", "aux points après": "on points after", "gagnés en jouant": "earned by playing", "ronge son frein.": "is getting restless.", "🏟️ Aréna du club": "🏟️ Club arena", "💰 remboursés sur": "💰 refunded on", "🔋 Pleine énergie": "🔋 Full energy", "🧰 Coffre du jour": "🧰 Daily chest", "800 💰 + trophée": "800 💰 + trophy", "Amende de 500 $": "$500 fine", "Badge affiché :": "Displayed badge:", "Demande annulée": "Request cancelled", "Demande refusée": "Request declined", "Défis de rivaux": "Rival challenges", "Fermer les yeux": "Look the other way", "Fonder ton club": "Found your club", "Gala de charité": "Charity gala", "Gérer le camp ›": "Manage the camp ›", "Mauvaise idée :": "Bad idea:", "Nouvelle-Écosse": "Nova Scotia", "Points de stats": "Stat points", "Profit estimé :": "Estimated profit:", "Promettre un KO": "Promise a KO", "Reprise arrêtée": "Replay stopped", "Récupération ×2": "Recovery ×2", "Se termine dans": "Ends in", "TV est lancée !": "TV is live!", "a tout gagné en": "won it all in", "de match choisi": "plan chosen", "est invité à la": "is invited to the", "· camps en auto": "· auto camps", "🏗️ Gym amélioré": "🏗️ Gym upgraded", "🏢 Fiche du club": "🏢 Club page", "🏢 Racheter pour": "🏢 Buy for", "📋 Voir la fiche": "📋 View page", "🔓 Débloqué pour": "🔓 Unlocked for", "🔧 À améliorer :": "🔧 To improve:", "/30 · fin dans": "/30 · ends in", "Caisse estimée": "Estimated bank", "Classements de": "Rankings of", "Contrat signé.": "Contract signed.", "Débloquer pour": "Unlock for", "Encore un an !": "One more year!", "Fonde ton club": "Found your club", "Gestion de boxe": "Boxing management", "Membre expulsé": "Member kicked", "Plan de départ": "Starting plan", "Prix du billet": "Ticket price", "Simuler la fin": "Simulate the end", "des promotions": "of the promotions", "✅ Club modifié": "✅ Club updated", "⬇️ Télécharger": "⬇️ Download", "🏟️ Club créé !": "🏟️ Club created!", "👑 Ta promotion": "👑 Your promotion", "💬 Chat du club": "💬 Club chat", "🔔 Fin du round": "🔔 End of round", "Camp annulé :": "Camp cancelled:", "Créer le gala": "Create the gala", "ENTRÉE EN FEU": "FIRE ENTRANCE", "ENTRÉE ROYALE": "ROYAL ENTRANCE", "Le Professeur": "The Professor", "Le Silencieux": "The Silent One", "Le vieux lion": "The old lion", "Plan de match": "Game plan", "Rangs de club": "Club ranks", "Sac de frappe": "Heavy bag", "de ton compte": "of your account", "pour le club.": "for the club.", "💰 et équipé !": "💰 and equipped!", "🥊 Défier avec": "🥊 Challenge with", "% de chances": "% chance", "+30 trophées": "+30 trophies", "Avec un code": "With a code", "Badge retiré": "Badge removed", "Club de boxe": "Boxing club", "Entraînement": "Training", "Les Cogneurs": "The Punchers", "Plan pour le": "Plan for the", "Titre retiré": "Title removed", "Ton club · #": "Your club · #", "Tu cries : «": "You shout: «", "Type de camp": "Camp type", "← Ton niveau": "← Your level", "Le Bûcheron": "The Lumberjack", "Le Roi Lion": "The Lion King", "Le renvoyer": "Fire him", "Les Faucons": "The Falcons", "Les juges :": "The judges:", "Main de Fer": "Iron Hand", "Pour tester": "For testing", "Rôle retiré": "Role removed", "pour de bon": "for good", "se moque de": "mocks", "À débloquer": "To unlock", "Événement ·": "Event ·", "à l’instant": "just now", "👔 Gérants (": "👔 Managers (", "📈 Ton ELO ·": "📈 Your ELO ·", "Boxeurs de": "Boxers of", "En ligne ·": "Online ·", "Le Bastion": "The Bastion", "Le Glacier": "The Glacier", "Le Marteau": "The Hammer", "Le Taureau": "The Bull", "Rapport de": "Report of", "Ton niveau": "Your level", "Ton rôle :": "Your role:", "Ville hôte": "Host city", "débloqué !": "unlocked!", "est blessé": "is injured", "· Gérant :": "· Manager:", "✅ Équipé !": "✅ Equipped!", "🎨 Style de": "🎨 Style of", "🏋️ Camp de": "🏋️ Camp of", "🏋️ Ton gym": "🏋️ Your gym", "💰 Ton pari": "💰 Your bet", "💰 une fois": "💰 once", ". Jusqu’à": ". Up to", "Au sommet": "At the peak", "En montée": "Rising", "En rodage": "Breaking in", "La Foudre": "The Lightning", "Le Dragon": "The Dragon", "Le Renard": "The Fox", "Le Volcan": "The Volcano", "Traits de": "Traits of", "récupérée": "recovered", "énergie +": "energy +", "⚡ Énergie": "⚡ Energy", "✅ Terminé": "✅ Done", "✓ Signé :": "✓ Signed:", "🎨 Emblème": "🎨 Emblem", "Académie": "Academy", "Décision": "Decision", "Décliner": "Decline", "Fiche de": "Page of", "La Forge": "The Forge", "L’Éclair": "The Flash", "Nord-Est": "Northeast", "PRÉSENTE": "PRESENTS", "Ton pays": "Your country", "activé !": "activated!", "monte en": "moves up to", "pièces !": "coins!", "présente": "presents", "une-deux": "one-two", "Épreuves": "Tests", "% durée": "% duration", "Déroulé": "Fight log", "Le Boss": "The Boss", "Le Loup": "The Wolf", "Rachète": "Buy back", "Rouillé": "Rusty", "· fondé": "· founded", "À faire": "To do", "Écran :": "Screen:", "à faire": "to do", "Aperçu": "Preview", "Déclin": "Decline", "Défi ·": "Challenge ·", "Défier": "Challenge", "Entrée": "Entrance", "Le Mur": "The Wall", "Montée": "Rising", "Pièces": "Coins", "et ses": "and his", "gérant": "manager", "Équipé": "Equipped", "Arène": "Arena", "Gérer": "Manage", "Pesée": "Weigh-in", "Prépa": "Prep", "SÉRIE": "STREAK", "Série": "Streak", "lancé": "launched", "sur 5": "of 5", "série": "streak", "Prêt": "Ready", "PIÈCES": "COINS", "Actualiser": "Refresh", "Compte": "Account", "plein ›": "full ›", "Classements": "Rankings", "Historique": "History", "catégories libres": "free weight classes", "Donner mon avis": "Give feedback", "Un boxeur par catégorie de poids (9 au maximum). Il commence autour de 48 global avec 1 pouvoir (2e au niveau 10, 3e au niveau 20 ; change-les avec tes 💰). Chaque combat lui donne de l’XP : il monte de niveau, tu places ses points et il grimpe au classement de sa catégorie jusqu’à la ceinture.": "One boxer per weight class (9 max). He starts around 48 overall with 1 power (2nd at level 10, 3rd at level 20; change them with your 💰). Every fight gives him XP: he levels up, you spend his points and he climbs his weight class rankings all the way to the belt.", "⚡ Répartir automatiquement": "⚡ Auto-distribute", "— Choisis son pays —": "— Pick his country —", "🌍 Pays à choisir": "🌍 Country to pick", "Choisis son pays": "Pick his country", "Choisis le pays de ton boxeur": "Pick your boxer’s country", "Bats-les dans l’ordre. Une tentative par jour, par légende et par boxeur. 12 rounds. Bats chaque légende 3 fois pour gagner ses 3 récompenses ★★★.": "Beat them in order. One attempt per day, per legend and per boxer. 12 rounds. Beat each legend 3 times to earn its 3 rewards ★★★.", "1re victoire": "1st win", "2e victoire": "2nd win", "3e victoire": "3rd win", " + légende suivante": " + next legend", "légende suivante": "next legend", "ses 2 pouvoirs exclusifs aux tirages": "its 2 exclusive powers in rolls", "garanti": "guaranteed", "🏆 Toutes les récompenses ! Revanche :": "🏆 All rewards! Rematch:", "💰 par victoire.": "💰 per win.", "étoiles": "stars", "légendes battues": "legends beaten", "2e victoire contre la légende": "2nd win against the legend", "fois pour pouvoir le tirer": "times to be able to roll it", "Tous ses emplacements de pouvoir sont déjà Panthéon : pouvoir non ajouté": "All his power slots are already Pantheon: power not added", "2e victoire ! +": "2nd win! +", "3e victoire ! +": "3rd win! +", "· ses 2 pouvoirs exclusifs peuvent maintenant sortir aux tirages !": "· his 2 exclusive powers can now come up in rolls!", "· toutes les récompenses de": "· all the rewards of", "· légende suivante débloquée": "· next legend unlocked", "👑 Revanche gagnée · +": "👑 Rematch won · +", "Bats-les dans l’ordre. Une tentative par jour, par légende et par boxeur. 12 rounds. Chaque victoire fait tourner la roue : 1 des 4 récompenses. Ensuite, 7 jours avant de pouvoir la réaffronter. La légende suivante se débloque dès ta 1re victoire.": "Beat them in order. 12 rounds. Each win spins the wheel: 1 of 4 rewards. Then 7 days before you can face that legend again. The next legend unlocks with your 1st win.", "🎡 Roue des récompenses": "🎡 Reward wheel", "Pouvoirs aux tirages ✅": "Powers in rolls ✅", "Ses 2 pouvoirs exclusifs aux tirages": "His 2 exclusive powers in rolls", "1re victoire : la légende suivante se débloque": "1st win: the next legend unlocks", "⏳ Revanche possible dans": "⏳ Rematch available in", "Récompense de la roue des légendes": "Legend wheel reward", "Cette légende se repose : reviens dans quelques jours.": "This legend is resting: come back in a few days.", "La roue tourne…": "The wheel is spinning…", "Légende suivante débloquée": "Next legend unlocked", "Ses 2 pouvoirs exclusifs peuvent maintenant sortir aux tirages ! (+": "His 2 exclusive powers can now come up in rolls! (+", "ajouté à ton boxeur !": "added to your boxer!", "Prochain combat contre": "Next fight against", "dans 7 jours.": "in 7 days.", "Super ! 🔥": "Awesome! 🔥", "battu !": "beaten!", "· ✅ battue": "· ✅ beaten"};
const I18N_W={"victoire": "win", "victoires": "wins", "défaite": "loss", "défaites": "losses", "combat": "fight", "combats": "fights", "boxeur": "boxer", "boxeurs": "boxers", "semaine": "week", "semaines": "weeks", "jour": "day", "jours": "days", "heure": "hour", "heures": "hours", "gagne": "wins", "gagné": "won", "perd": "loses", "perdu": "lost", "contre": "vs", "niveau": "level", "ceinture": "belt", "ceintures": "belts", "titre": "title", "titres": "titles", "champion": "champion", "membres": "members", "membre": "member", "président": "president", "recruteur": "recruiter", "trophées": "trophies", "nuls": "draws", "nul": "draw", "arrêt": "stoppage", "décision": "decision", "unanime": "unanimous", "partagée": "split", "majoritaire": "majority", "abonnés": "followers", "popularité": "popularity", "énergie": "energy", "forme": "form", "blessé": "injured", "prêt": "ready", "repos": "rest", "camp": "camp", "entraînement": "training", "gérant": "manager", "gérants": "managers", "adversaire": "opponent", "adversaires": "opponents", "rang": "rank", "cote": "rating", "global": "overall", "pouvoir": "power", "pouvoirs": "powers", "emplacement": "slot", "aujourd’hui": "today", "demain": "tomorrow", "hier": "yesterday", "maintenant": "now", "toi": "you", "ami": "friend", "amis": "friends", "club": "club", "guerre": "war", "guerres": "wars", "égalité": "tie", "récompense": "reward", "coffre": "chest", "gratuit": "free", "prix": "price", "acheter": "buy", "légende": "legend", "légendes": "legends", "battue": "beaten", "battu": "beaten", "débloqué": "unlocked", "verrouillé": "locked", "tirage": "roll", "chance": "chance", "rounds": "rounds", "round": "round", "juge": "judge", "juges": "judges", "arbitre": "referee", "coupure": "cut", "dégâts": "damage", "précision": "accuracy", "esquive": "dodge", "coups": "punches", "coup": "punch", "vie": "health", "plus": "more", "moins": "less", "sans": "without", "avec": "with", "tous": "all", "toutes": "all", "aucun": "no", "aucune": "no", "nouveau": "new", "nouvelle": "new", "meilleur": "best", "meilleure": "best", "plein": "full"};
const I18N_P=[
 [/encore (\d+) pour /g,'$1 more for '],[/\((\d+) cat\u00E9gories? libres?\)/g,'($1 free weight classes)'],[/nouveaux dans /g,'new in '],
 [/^(\d+) victoires?$/,'$1 wins'],[/(\d+) j (\d+) h/g,'$1 d $2 h'],[/(\d+) h (\d+) min/g,'$1 h $2 min'],[/il y a (\d+) (min|h|j)/g,(m,a,b)=>`${a} ${b==='j'?'d':b} ago`],
 [/(\d+) semaines?/g,(m,a)=>a+(a==='1'?' week':' weeks')],[/(\d+) jours?/g,(m,a)=>a+(a==='1'?' day':' days')],[/(\d+) heures?/g,(m,a)=>a+(a==='1'?' hour':' hours')],
 [/(\d+) combats?/g,(m,a)=>a+(a==='1'?' fight':' fights')],[/(\d+) boxeurs?/g,(m,a)=>a+(a==='1'?' boxer':' boxers')],[/(\d+) membres?/g,(m,a)=>a+(a==='1'?' member':' members')],
 [/(\d+) ans\b/g,'$1 yrs'],[/\bNiv\. /g,'Lvl. '],[/ et /g,' and '],[/ contre /g,' vs '],[/ pour /g,' for '],[/ avec /g,' with '],[/ par /g,' by '],[/ de /g,' of '],[/ du /g,' of the '],[/ des /g,' of the '],[/ au /g,' to the '],[/ en /g,' in ']];
const I18N_C=new Map();let I18N_IX=null;
function i18nIx(){I18N_IX=new Map();const ks=Object.keys(I18N_EN).filter(k=>k.length>=5).sort((a,b)=>b.length-a.length);for(const k of ks){const h=k.slice(0,3);let a=I18N_IX.get(h);if(!a)I18N_IX.set(h,a=[]);a.push(k)}}
const isL=c=>!!c&&/[A-Za-z\u00C0-\u00FF\u2019']/.test(c);
function trCore(s){let o=I18N_EN[s];if(o!=null)return o;
  if(s.includes(' · ')){const P=s.split(' · ');if(P.length>1)return P.map(trCore).join(' · ')}
  if(!I18N_IX)i18nIx();let r='',i=0,hit=0;
  while(i<s.length){if(!isL(s[i-1])||!isL(s[i])){const L=I18N_IX.get(s.substr(i,3));if(L){let f=null;for(const k of L)if(s.startsWith(k,i)&&!(isL(k[k.length-1])&&isL(s[i+k.length]))){f=k;break}
      if(f){r+=I18N_EN[f];i+=f.length;hit=1;continue}}}
    r+=s[i];i++}
  r=r.replace(/[A-Za-z\u00C0-\u00FF\u2019']+/g,w=>{const t=I18N_W[w]||I18N_W[w.toLowerCase()];if(t==null)return w;hit=1;return w[0]===w[0].toUpperCase()&&w[0]!==w[0].toLowerCase()?t[0].toUpperCase()+t.slice(1):t});
  if(/[\u00E0\u00E2\u00E7\u00E9\u00E8\u00EA\u00EB\u00EE\u00EF\u00F4\u00FB\u00F9\u0153\u2019]|\b(le|la|les|un|une|ton|ta|tes|ses|son|sa|est|pas|plus|dans|pour|encore|nouveaux)\b/i.test(r))for(const[re,f]of I18N_P)r=r.replace(re,f);
  return r}
function tr(s){if(LANG!=='en'||!s||typeof s!=='string')return s;const t=s.trim();if(!t||!/[A-Za-z\u00C0-\u00FF]/.test(t))return s;
  let o=I18N_C.get(t);if(o==null){o=trCore(t);if(I18N_C.size>8000)I18N_C.clear();I18N_C.set(t,o)}
  return o===t?s:s.replace(t,o)}
const I18N_SKIP=new Set(['SCRIPT','STYLE','TEXTAREA','INPUT','CODE']);
function i18nEl(n){if(LANG!=='en')return;
  if(n.nodeType===3){const p=n.parentNode;if(!p||I18N_SKIP.has(p.nodeName)||(p.closest&&p.closest('[data-noi18n]')))return;const v=n.nodeValue,t=tr(v);if(t!==v)n.nodeValue=t;return}
  if(n.nodeType!==1||I18N_SKIP.has(n.nodeName)&&n.nodeName!=='INPUT')return;
  const at=e=>{for(const a of['placeholder','title','aria-label']){const v=e.getAttribute&&e.getAttribute(a);if(v){const t=tr(v);if(t!==v)e.setAttribute(a,t)}}};
  at(n);if(n.nodeName==='INPUT')return;if(n.closest&&n.closest('[data-noi18n]'))return;
  const w=document.createTreeWalker(n,5,{acceptNode:x=>x.nodeType===1?(I18N_SKIP.has(x.nodeName)&&x.nodeName!=='INPUT'||x.hasAttribute('data-noi18n')?2:1):1});
  let x;while(x=w.nextNode()){if(x.nodeType===3){const p=x.parentNode;if(p&&I18N_SKIP.has(p.nodeName))continue;const v=x.nodeValue,t=tr(v);if(t!==v)x.nodeValue=t}else at(x)}}
let I18N_MO=null;
function i18nStart(){if(LANG!=='en'||I18N_MO)return;document.documentElement.lang='en';i18nEl(document.body);
  I18N_MO=new MutationObserver(ms=>{for(const m of ms){if(m.type==='childList')m.addedNodes.forEach(i18nEl);else if(m.type==='characterData')i18nEl(m.target);else if(m.type==='attributes')i18nEl(m.target)}});
  I18N_MO.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label']})}
(()=>{const f=CanvasRenderingContext2D.prototype.fillText,g=CanvasRenderingContext2D.prototype.measureText;
  CanvasRenderingContext2D.prototype.fillText=function(t,...a){return f.call(this,tr(String(t)),...a)};
  CanvasRenderingContext2D.prototype.measureText=function(t){return g.call(this,tr(String(t)))}})();
function setLang(l,silent){LANG=l==='en'?'en':'fr';try{localStorage.setItem('bm_lang',LANG)}catch(e){}
  try{if(typeof ON!=='undefined'&&ON.token)rpc('cr_set_lang',{p_token:ON.token,p_lang:LANG}).catch(()=>{})}catch(e){}
  if(!silent){try{sessionStorage.setItem('fd_skip_splash','1')}catch(e){}location.reload()}}
function langPick(){if(LANG)return;const el=document.createElement('div');el.id='langpick';el.setAttribute('data-noi18n','');
  el.innerHTML=`<div class="lp-card"><div class="lp-ic">🌍</div><b>Choisis ta langue</b><span>Choose your language</span>
    <button data-l="fr"><i>🇫🇷</i>Français</button><button data-l="en"><i>🇬🇧</i>English</button><small>Tu pourras changer plus tard dans les réglages · You can change it later in settings</small></div>`;
  el.addEventListener('click',e=>{const b=e.target.closest('button[data-l]');if(!b)return;LANG=b.dataset.l;try{localStorage.setItem('bm_lang',LANG)}catch(x){}el.remove();if(LANG==='en')i18nStart()});
  document.body.appendChild(el)}

function bmLogo(c,cx,cy,R,o){drawCrest(c,cx,cy,R,{flat:!!(o&&o.flat)})}
(function(){const sp=document.getElementById('splash');if(!sp)return;let done=false;
  // B20 : après un changement de langue, pas de nouvelle intro.
  try{if(sessionStorage.getItem('fd_skip_splash')){sessionStorage.removeItem('fd_skip_splash');sp.remove();return}}catch(e){}
  const end=()=>{if(done)return;done=true;sp.classList.add('out');setTimeout(()=>sp.remove(),650)};
  sp.addEventListener('click',end);setTimeout(end,4300)})();

(function(){function fit(){const r=document.documentElement,a=Math.min(screen.width,screen.height),b=Math.max(screen.width,screen.height),w=innerHeight>=innerWidth?a:b;
  if(matchMedia('(pointer:coarse)').matches&&w>200&&innerWidth>w+4){r.style.setProperty('--fitw',w+'px');r.classList.add('fitw')}else r.classList.remove('fitw')}
  fit();addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,300))})();
document.addEventListener('change',e=>{const t=e.target;if(!t.dataset||!t.dataset.sa)return;const b=document.createElement('button');b.hidden=true;b.dataset.a=t.dataset.sa;b.dataset[t.dataset.sk||'k']=t.value;document.body.appendChild(b);b.click();b.remove()});
const selH=(act,items,cur,key)=>`<select class="selx" data-sa="${act}" data-sk="${key||'k'}">${items.map(([k,n])=>`<option value="${k}" ${k===cur?'selected':''}>${n}</option>`).join('')}</select>`;
const GAME_V='0.9';
// Où arrivent les avis des testeurs (laisser vide = l'ami choisit à qui l'envoyer)
const FB_TO={sms:'',email:'',nom:'le créateur du jeu'};
/* ---- avis des testeurs (partage par Messages, WhatsApp, etc.) ---- */
const FBK='coin-rouge-avis';let FB={n:0,like:'',fix:'',bug:'',nm:''};
function fbLoad(){try{const v=JSON.parse(localStorage.getItem(FBK)||'null');if(v)FB={...FB,...v}}catch(e){}}
function fbSave(){try{localStorage.setItem(FBK,JSON.stringify(FB))}catch(e){}}
function fbText(){const st=typeof S!=='undefined'&&S?(()=>{const m=S.boxers.filter(b=>b.mine);return`Partie : ${S.club||''} · an ${Math.floor((S.t-1)/52)+1}, sem. ${(S.t-1)%52+1} · ${m.length} boxeurs · ${S.stats?S.stats.wins:0} victoires · ${Math.round(S.money).toLocaleString('fr-CA')} $`})():'Pas encore de partie';
  return`🥊 AVIS FIGHT DYNASTY (v${GAME_V})${FB.nm?' — de '+FB.nm:''}\nNote : ${FB.n?'⭐'.repeat(FB.n)+' ('+FB.n+'/5)':'—'}\n\n👍 J’aime :\n${FB.like||'—'}\n\n🔧 À améliorer :\n${FB.fix||'—'}\n\n🐞 Bugs :\n${FB.bug||'—'}\n\n${st}\nÉcran : ${innerWidth}×${innerHeight}`}
function fbRender(msg){const el=document.getElementById('fb'),e=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  el.innerHTML=`<div class="mcard nt fbf" role="dialog" aria-label="Donner mon avis"><span class="lab">Version test ${GAME_V}</span><h3>Ton avis</h3><div class="mbody">
  <p class="small" style="margin:0 0 6px">Tu testes le jeu avant sa sortie. Dis franchement ce que tu en penses. ${FB_TO.sms||FB_TO.email?`Ton message part directement à ${e(FB_TO.nom)}.`:'Touche Envoyer, puis choisis la personne qui t’a envoyé le jeu (Messages, WhatsApp, Messenger…).'}</p>
  <label>Ta note</label><div class="fbst">${[1,2,3,4,5].map(i=>`<button type="button" data-fbn="${i}" class="${FB.n>=i?'on':''}" aria-label="${i} sur 5">⭐</button>`).join('')}</div>
  <label for="fb-like">👍 Ce que tu aimes</label><textarea id="fb-like" data-fbk="like" placeholder="Les combats en 3D, les ceintures…">${e(FB.like)}</textarea>
  <label for="fb-fix">🔧 Ce qu’il faut améliorer ou ajouter</label><textarea id="fb-fix" data-fbk="fix" placeholder="Ce qui est mêlant, trop dur, ce qui manque…">${e(FB.fix)}</textarea>
  <label for="fb-bug">🐞 Bugs ou écrans brisés</label><textarea id="fb-bug" data-fbk="bug" placeholder="Où, et ce qui s’est passé">${e(FB.bug)}</textarea>
  <label for="fb-nm">Ton prénom</label><input id="fb-nm" data-fbk="nm" placeholder="Facultatif" value="${e(FB.nm)}" autocomplete="given-name">
  ${msg?`<p class="small" style="margin:10px 0 0;color:var(--green);font-weight:700">${msg}</p>`:''}</div>
  <div class="row" style="gap:8px;margin-top:12px;flex-wrap:nowrap"><button type="button" class="btn" data-fbx="close" style="flex:none">Fermer</button><button type="button" class="btn pri" data-fbx="send" style="flex:1;margin:0;min-height:48px">📨 Envoyer mon avis</button></div></div>`;el.hidden=false}
function openFB(){fbLoad();fbRender()}
async function fbSend(){const t=fbText();
  if(FB_TO.sms){location.href='sms:'+FB_TO.sms+(/iPhone|iPad|Mac/.test(navigator.userAgent)?'&':'?')+'body='+encodeURIComponent(t);return}
  if(FB_TO.email){location.href='mailto:'+FB_TO.email+'?subject='+encodeURIComponent('Avis FIGHT DYNASTY v'+GAME_V)+'&body='+encodeURIComponent(t);return}
  try{if(navigator.share){await navigator.share({title:'Mon avis sur FIGHT DYNASTY',text:t});fbRender('Merci ! Ton avis est envoyé 🙌');return}}catch(e){if(e&&e.name==='AbortError')return}
  try{await navigator.clipboard.writeText(t);fbRender('Message copié ! Colle-le dans Messages ou WhatsApp pour l’envoyer.');return}catch(e){}
  location.href='sms:?&body='+encodeURIComponent(t)}
document.addEventListener('click',e=>{const el=document.getElementById('fb');if(!el||el.hidden||!el.contains(e.target))return;
  const n=e.target.closest('[data-fbn]');if(n){FB.n=+n.dataset.fbn;fbSave();fbRender();return}
  const x=e.target.closest('[data-fbx]');if(x){if(x.dataset.fbx==='close')el.hidden=true;else fbSend();return}
  if(e.target===el)el.hidden=true});
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.fbk;if(k){FB[k]=e.target.value;fbSave()}});
/* ================= DONNÉES ================= */
const DIVS=[{id:'mouche',n:'Mouche',kg:'51 kg'},{id:'coq',n:'Coq',kg:'54 kg'},{id:'plume',n:'Plume',kg:'57 kg'},{id:'leger',n:'Léger',kg:'61 kg'},{id:'sleger',n:'Super-léger',kg:'64 kg'},{id:'welter',n:'Welter',kg:'67 kg'},{id:'moyen',n:'Moyen',kg:'73 kg'},{id:'milourd',n:'Mi-lourd',kg:'79 kg'},{id:'lourd',n:'Lourd',kg:'+91 kg'}];
const FIRST=["Jake","Marcus","Liam","Noah","Mateo","Luis","Carlos","André","Félix","Ibrahim","Moussa","Dmitri","Tomasz","Kwame","Diego","Rafael","Callum","Conor","Kenji","Yuto","Ryan","Jonathan","Malik","Oleksandr","Gabriel","Hugo","Tristan","Omar","Bruno","Sacha","Darius","Isaiah","Manny","Erislandy","Lukas","Marco"];
const LAST=["Johnson","Walker","Murphy","Kelly","Diallo","Okafor","Ramirez","Vargas","Kowalski","Novak","Petrov","Mensah","Silva","Moreau","Rossi","Dubois","Haddad","Nguyen","Santos","García","Bianchi","Taylor","Evans","Mbaye","Castillo","Sato","Inoue","Fischer","Müller","Kim","Reyes","Cruz","Usenko","Ortega"];
const NICKS=["Le Marteau","La Foudre","Le Mur","Bulldozer","L’Éclair","Le Bûcheron","Main de pierre","Le Renard","Dynamite","Le Taureau","Le Silencieux","Le Professeur","Tempête","Le Loup","Le Glacier","Coup de tonnerre"];
const CITIES=["Las Vegas","New York","Londres","Mexico","Tokyo","Paris","Manchester","Dublin","Manille","Toronto","Montréal","Berlin","Kyiv","Accra","Madrid","San Juan"];
const STYLES={agr:'Cogneur',eq:'Complet',pru:'Défensif',corps:'Travailleur au corps'};
const STRAT={agr:{o:1.25,d:.85,dr:1.35,n:'Agressif',j:.34},eq:{o:1,d:1,dr:1,n:'Équilibré',j:.5},pru:{o:.78,d:1.22,dr:.72,n:'Prudent',j:.64},corps:{o:1,d:.95,dr:1.05,body:1,n:'Au corps',j:.36}};
const PLANS={repos:{n:'Repos',xp:0,fat:-25,d:'Récupère la forme et le moral.'},leger:{n:'Léger',xp:.6,fat:4,inj:.004,d:'Peu d’XP, presque pas de fatigue.'},normal:{n:'Normal',xp:1,fat:8,inj:.01,d:'Bon équilibre XP et fatigue.'},intense:{n:'Intense',xp:1.5,fat:15,inj:.035,d:'Beaucoup d’XP, fatigue et risque de blessure.'},sparring:{n:'Sparring',xp:1.8,fat:12,inj:.04,d:'Le plus d’XP. Demande un partenaire de sparring.'}};
const STATS=[['pow','Puissance','PUI'],['spd','Vitesse','VIT'],['def','Défense','DÉF'],['sta','Cardio','CAR'],['chin','Menton','MEN']];
const TRAITS={
 fer:{n:'Menton de fer',d:'Résiste beaucoup mieux aux gros coups.',g:1},
 finisseur:{n:'Finisseur',d:'+25 % de dégâts quand l’adversaire est ébranlé.',g:1},
 contre:{n:'Contre-attaquant',d:'Plus précis contre un adversaire agressif.',g:1},
 moteur:{n:'Moteur diesel',d:'S’essouffle 20 % moins vite.',g:1},
 eclair:{n:'Mains rapides',d:'Lance 10 % plus de coups.',g:1},
 bombe:{n:'Bombe dans la droite',d:'Beaucoup plus de chances de knockdown.',g:1},
 roc:{n:'Récupération rapide',d:'Récupère mieux entre les rounds.',g:1},
 showman:{n:'Showman',d:'Gagne 50 % plus de notoriété.',g:1},
 bosseur:{n:'Bosseur',d:'+20 % d’XP à l’entraînement.',g:1},
 fidele:{n:'Fidèle',d:'Sa loyauté baisse deux fois moins vite.',g:1},
 verre:{n:'Menton de verre',d:'Tombe plus facilement.',g:0},
 fragile:{n:'Mains fragiles',d:'Se blesse plus souvent.',g:0},
 diva:{n:'Diva',d:'Sa loyauté chute vite quand ça va mal.',g:0},
 paresseux:{n:'Paresseux',d:'−20 % d’XP à l’entraînement.',g:0}};
const POS=Object.keys(TRAITS).filter(k=>TRAITS[k].g), NEG=Object.keys(TRAITS).filter(k=>!TRAITS[k].g);
const ROLES={coach:{n:'Entraîneur-chef',d:'+12 % d’XP par étoile, conseils pendant le combat et évaluation du potentiel.'},phys:{n:'Préparateur physique',d:'−12 % de fatigue par étoile et moins de blessures.'},cut:{n:'Soigneur',d:'Meilleure récupération entre les rounds et guérison plus rapide.'},spar:{n:'Partenaire de sparring',d:'Débloque le plan Sparring. +15 % d’XP par étoile. Jusqu’à 2.'}};
/* atouts du gérant : ils se gagnent en jouant (plus de points à dépenser) */
const PERKQ={neg:{q:'contrats signés ou prolongés',st:'negs',t:[8,25,60]},mot:{q:'victoires de tes boxeurs',st:'wins',t:[20,80,250]},rec:{q:'galas organisés',st:'galasDone',t:[2,6,15]},res:{q:'boxeurs recrutés',st:'sign',t:[4,12,30]},ges:{q:'semaines de gestion',st:'weeks',t:[40,130,300]}};
function perkVal(k){const q=PERKQ[k],st=S.stats||{};return k==='ges'?S.t:k==='rec'?(S.galas||[]).filter(g=>g.done).length:(st[q.st]||0)}
function syncPerks(){const M=S.mgr;if(!M.legacy){M.legacy={...M.perks};M.pts=0}for(const k in PERKQ){const v=perkVal(k),e=PERKQ[k].t.filter(t=>v>=t).length,old=M.perks[k]||0,nv=Math.max(e,M.legacy[k]||0);if(nv>old&&S.t>1){toast(`⭐ Atout ${PERKS[k].n} niveau ${nv} !`);log(`⭐ ${PERKS[k].n} passe au niveau ${nv} : ${PERKS[k].d}`,'gold')}M.perks[k]=nv}}
const PERKS={neg:{n:'Négociateur',d:'+8 % sur la part des bourses par niveau.'},mot:{n:'Motivateur',d:'La loyauté monte plus vite chaque semaine.'},rec:{n:'Promoteur',d:'+10 % sur les revenus de tes galas par niveau.'},res:{n:'Réseau',d:'Agents libres et staff de meilleure qualité.'},ges:{n:'Gestionnaire',d:'−7 % sur les salaires et l’entretien par niveau.'}};
const GYMS=[["Brooklyn Boxing Club","New York",48],["Gimnasio El Toro","Mexico",52],["Southbank Elite","Londres",56],["Le Temple","Paris",60],["Iron Works","Toronto",64],["Ken Gym","Tokyo",68],["Kyiv Steel Academy","Kyiv",72],["Wild Card","Los Angeles",77]];
const SKIN=['#f2cba9','#e3b08a','#c98c63','#a3693f','#7c4b2b','#56331e'], HAIRC=['#17110d','#3a2416','#6b4a2b','#a5784a','#d8bd86','#8b9099'], TRUNK=['#ff3d52','#4f80ff','#f4c34f','#3fd88a','#a77bff','#e9e9e9','#16181f','#ffd23a','#0a0a0a'];
const DEFSET={anim:true,td:true,odds:true,autoAdv:false,events:true,speed:1,warn:true};
const CAMPS={std:{n:'Standard',c:0,d:'Préparation normale, sans frais.'},video:{n:'Étude vidéo',c:1500,d:'+3 % de précision contre cet adversaire. Non remboursable.'},alt:{n:'Altitude',c:4000,d:'S’essouffle 20 % moins vite pendant le combat. Non remboursable.'}};
const SAL=[0,160,320,600,1000,1500], COST=[0,15000,40000,90000,180000], SHARE=.33, KEY='coin-rouge-v2';
const ACH=[
 ['win1','Première victoire',()=>S.stats.wins>=1,3000,60],
 ['ko1','Premier KO',()=>S.stats.kos>=1,3000,60],
 ['roster3','Une écurie de 3 boxeurs',()=>mine().length>=3,2000,40],
 ['badge1','Premier badge de gym',()=>S.stats.badges>=1,4000,80],
 ['top15','Un boxeur classé (top 15)',()=>mine().some(b=>rankIdx(b)<15),5000,80],
 ['coach3','Un entraîneur 3 étoiles',()=>S.staff.coach&&S.staff.coach.stars>=3,0,80],
 ['lvl10','Un boxeur niveau 10',()=>mine().some(b=>b.lvl>=10),6000,100],
 ['wins10','10 victoires pour le club',()=>S.stats.wins>=10,8000,120],
 ['top5','Un boxeur dans le top 5',()=>mine().some(b=>rankIdx(b)<5),10000,150],
 ['badge4','4 badges de gym',()=>S.stats.badges>=4,15000,200],
 ['nat','Champion national',()=>mine().some(b=>b.nchamp),10000,150],
 ['undisp','Champion undisputed',()=>mine().some(isUndisp),100000,800],
 ['champ','Champion du monde (une ceinture)',()=>mine().some(b=>b.champ),25000,300],
 ['rich','100 000 $ en caisse',()=>S.money>=100000,0,200],
 ['badge8','Les 8 badges de gym',()=>S.stats.badges>=8,50000,500]];

/* ================= PAYS ================= */
const NAT={
 CA:{n:'Canada',p:'qc',c:['Montréal','Québec','Laval','Gatineau','Trois-Rivières','Sherbrooke','Saguenay','Toronto','Vancouver']},
 US:{n:'États-Unis',p:'en',c:['Las Vegas','New York','Philadelphie','Détroit','Los Angeles','Houston','Chicago']},
 MX:{n:'Mexique',p:'es',c:['Mexico','Guadalajara','Tijuana','Monterrey','Culiacán']},
 GB:{n:'Royaume-Uni',p:'en',c:['Londres','Manchester','Liverpool','Sheffield','Cardiff','Glasgow']},
 IE:{n:'Irlande',p:'ie',c:['Dublin','Belfast','Cork']},
 FR:{n:'France',p:'fr',c:['Paris','Lyon','Marseille','Lille','Toulouse']},
 CU:{n:'Cuba',p:'es',c:['La Havane','Santiago de Cuba','Camagüey']},
 PR:{n:'Porto Rico',p:'es',c:['San Juan','Bayamón','Ponce']},
 PH:{n:'Philippines',p:'ph',c:['Manille','General Santos','Cebu']},
 JP:{n:'Japon',p:'jp',c:['Tokyo','Osaka','Yokohama']},
 GH:{n:'Ghana',p:'af',c:['Accra','Kumasi']},
 NG:{n:'Nigeria',p:'af',c:['Lagos','Abuja','Ibadan']},
 UA:{n:'Ukraine',p:'ua',c:['Kyiv','Kharkiv','Odessa']},
 KZ:{n:'Kazakhstan',p:'kz',c:['Almaty','Astana']},
 PL:{n:'Pologne',p:'pl',c:['Varsovie','Cracovie','Gdańsk']},
 DE:{n:'Allemagne',p:'de',c:['Berlin','Hambourg','Munich']},
 IT:{n:'Italie',p:'it',c:['Rome','Naples','Milan']},
 AU:{n:'Australie',p:'en',c:['Sydney','Melbourne','Brisbane']},
 BR:{n:'Brésil',p:'br',c:['São Paulo','Rio de Janeiro','Salvador']},
 AR:{n:'Argentine',p:'es',c:['Buenos Aires','Córdoba','Rosario']},
 SN:{n:'Sénégal',p:'sn',c:['Dakar','Thiès']},
 MA:{n:'Maroc',p:'ma',c:['Casablanca','Rabat','Marrakech']}};
const NAMES={
 qc:[['Olivier','Liam','Noah','Ethan','Samuel','Félix','Gabriel','Owen','Logan','Alexis','Jacob','Ryan','David','Lucas','Nathan','William','Mathieu','Dylan'],['Smith','Brown','Wilson','Martin','Roy','Gagnon','Campbell','Stewart','MacDonald','Singh','Lee','Taylor','Anderson','Côté','Thompson','Leblanc','Chen','Murray']],
 en:[['Jake','Tyler','Marcus','Devin','Jordan','Connor','Shawn','Terrence','Andre','Mike','Chris','Ryan','Darius','Brandon','Isaiah','Lewis'],['Johnson','Williams','Brown','Miller','Davis','Walker','Carter','Jackson','Hughes','Taylor','Robinson','Price','Mitchell','Green','Harris','Cole']],
 ie:[['Conor','Sean','Patrick','Ciaran','Eoin','Declan','Liam','Cillian'],['O’Brien','Murphy','Kelly','Walsh','McCarthy','Byrne','Doyle','Quinn']],
 fr:[['Hugo','Lucas','Théo','Nathan','Enzo','Karim','Yanis','Bilal','Maxime','Romain','Souleymane'],['Martin','Bernard','Dubois','Moreau','Lefebvre','Laurent','Girard','Haddad','Benali','Mercier','Traoré']],
 es:[['Carlos','Luis','Diego','Juan','Miguel','Jorge','Rafael','Alejandro','Óscar','Andrés','Yordan','Emilio'],['Ramírez','Vargas','Hernández','García','Martínez','López','Castillo','Santos','Rodríguez','Torres','Flores','Álvarez']],
 ph:[['Jerome','Rodel','Arnel','Jomar','Mark','Rey','Jayson','Albert','Romel'],['Reyes','Bautista','Villanueva','Ramos','Mendoza','Aquino','Navarro','Dela Cruz']],
 jp:[['Takuma','Kenta','Ryota','Daiki','Shun','Yuto','Haruki','Kazuki'],['Tanaka','Suzuki','Takahashi','Watanabe','Ito','Yamamoto','Nakamura','Kobayashi']],
 af:[['Kwame','Kofi','Emmanuel','Isaac','Samuel','Chinedu','Tunde','Ifeanyi','Kwabena','Yaw'],['Mensah','Owusu','Boateng','Asante','Okafor','Adeyemi','Okonkwo','Eze','Addo','Nwosu']],
 ua:[['Oleksandr','Dmytro','Andriy','Serhiy','Vasyl','Taras','Bohdan','Mykola'],['Kovalenko','Shevchenko','Bondarenko','Tkachenko','Kravchenko','Melnyk','Boyko','Polishchuk']],
 kz:[['Daniyar','Yerlan','Nurlan','Aslan','Zhanibek','Beibut','Askar'],['Abdrakhmanov','Seitkali','Nurlanov','Bekov','Zhaksybekov','Tursynov']],
 pl:[['Tomasz','Krzysztof','Piotr','Kamil','Mateusz','Łukasz','Paweł'],['Kowalski','Nowak','Wiśniewski','Wójcik','Kamiński','Zieliński','Szymański']],
 de:[['Lukas','Jonas','Felix','Leon','Tim','Niklas','Max'],['Müller','Schmidt','Schneider','Fischer','Weber','Wagner','Becker']],
 it:[['Marco','Luca','Matteo','Alessandro','Davide','Simone','Andrea'],['Rossi','Russo','Ferrari','Esposito','Bianchi','Romano','Colombo']],
 br:[['João','Lucas','Gabriel','Rafael','Thiago','Bruno','Felipe'],['Silva','Santos','Oliveira','Souza','Pereira','Costa','Almeida']],
 sn:[['Moussa','Ibrahima','Cheikh','Mamadou','Ousmane','Abdoulaye','Pape'],['Diallo','Ndiaye','Diop','Fall','Sow','Mbaye','Faye']],
 ma:[['Youssef','Mehdi','Hamza','Anas','Ayoub','Omar','Yassine'],['El Amrani','Benali','Alaoui','Bennani','Tazi','Idrissi','Chraibi']]};
const NATW={US:14,MX:9,GB:8,CA:5,PH:5,JP:4,CU:4,UA:4,FR:4,PR:3,KZ:3,GH:3,NG:3,AU:3,AR:3,IE:2,PL:2,DE:2,IT:2,BR:2,SN:2,MA:2};
const CITYNAT={};for(const[k,v]of Object.entries(NAT))for(const c of v.c)CITYNAT[c]=k;
const DIFF={facile:{n:'Facile',d:'50 000 $ en caisse et un entraîneur 2 étoiles.'},normal:{n:'Normal',d:'25 000 $ et un vieil entraîneur bénévole. L’expérience prévue.'},difficile:{n:'Difficile',d:'10 000 $ et aucun staff. Chaque dollar compte.'}};
const PROMOS=['Nord Boxing','Titan Fight Night','Productions du Ring','Red Line Promotions','Empire Boxe','Iron Bell Boxing','Crown & Glove'];
/* ================= v19 : PROMOTIONS ================= */
const PRN=[['Nord Boxing','CA'],['Productions du Ring','CA'],['Maple Leaf Fights','CA'],['Titan Fight Night','US'],['Red Line Promotions','US'],['Southside Fight Co.','US'],['Iron Bell Boxing','US'],['Sol Azteca Promociones','MX'],['Crown & Glove','GB'],['Royal Fist Promotions','GB'],['Celtic Warrior Promotions','IE'],['Lions de Paris Boxe','FR'],['Empire Boxe','FR'],['Samurai Fist Promotions','JP'],['Black Star Promotions','GH'],['Lagos Kings Boxing','NG'],['Manila Thunder','PH'],['Steel Bear Boxing','UA'],['Kaiser Box-Promotion','DE'],['Andes Boxeo','AR'],['Atlas Boxing Group','MA'],['Blue Corner Group',''],['Phoenix Rising Boxing',''],['Thunder Ring Promotions','']];
const PRMAX=3; // ton club + 2 promotions rachetées
const PRC=['#ff3b50','#f5c451','#4f80ff','#38d98a','#a46bff','#ff9f43','#2ec4d6','#e84393'];
function newPromo(used){const free=PRN.filter(([n])=>!used.has(n));const [n,nat]=free.length?pick(free):[pick(PRN)[0]+' II',''];
  return{id:'p'+(S.uid++),n,nat:nat&&NAT[nat]?nat:pick(Object.keys(NAT)),cash:ri(60,420)*1000,neg:0,since:S.t,own:false,sale:null,w:.5+R()*1.6,c:pick(PRC)}}
function ensurePromos(){if(!S.promos||!S.promos.length){S.promos=[];const u=new Set();for(let i=0;i<14;i++){const q=newPromo(u);u.add(q.n);S.promos.push(q)}}
  for(const b of S.boxers)if(!b.mine)prOf(b);
  for(const p of S.promos)if(p.own&&!p.dead){if(p.auto===undefined)p.auto=true;for(const b of S.boxers)if(!b.mine&&!b.retired&&b.pr===p.id)brandIn(b,p)}}
const promoAlive=()=>(S.promos||[]).filter(p=>!p.dead);
function prOf(b){if(b&&b.brand)return(S.promos||[]).find(x=>x.id===b.brand)||null;if(!b||b.mine||b.fa)return null;let p=b.pr&&S.promos&&S.promos.find(x=>x.id===b.pr&&!x.dead);
  if(!p&&S.promos){const L=promoAlive();if(!L.length)return null;let t=0;const ws=L.map(x=>{const w=x.w*(x.nat===b.nat?4:1);t+=w;return w});let r=R()*t;p=L[L.length-1];for(let i=0;i<L.length;i++){r-=ws[i];if(r<=0){p=L[i];break}}b.pr=p.id}
  return p}
const prBoxers=p=>S.boxers.filter(b=>!b.retired&&(b.mine?b.brand===p.id:b.pr===p.id));
function prScore(p,L){L=L||prBoxers(p);let sc=0;for(const b of L){sc+=Math.max(0,ovr(b)-55)*2+beltsOf(b).length*60+(isUndisp(b)?150:0)+(b.nchamp?12:0)+Math.min(40,Math.sqrt(fol(b))/40)}return Math.round(sc)}
function prValue(p,L){L=L||prBoxers(p);return Math.round(L.reduce((s,b)=>s+buyPrice(b),0)*.3/1000)*1000}
const prPrice=p=>Math.max(100000,Math.round(prValue(p)*.55/1000)*1000);
function prNet(p,L){L=L||prBoxers(p);return Math.round(L.reduce((s,b)=>s+b.fame*12+Math.sqrt(fol(b))*.6+Math.max(0,ovr(b)-55)*14-(p.own?0:marketSal(b)*.5),0)-2500)}
const prSal=b=>Math.max(60,Math.round(marketSal(b)*.5/10)*10);
function brandIn(b,p){Object.assign(b,{mine:true,brand:p.id,pr:p.id,morale:b.morale||70,loy:Math.max(b.loy||0,70),plan:'normal',hist:b.hist||[],lvl:b.lvl||1,xp:b.xp||0,sp:b.sp||0,contract:999,salary:prSal(b),booked:!!b.booked,lastFight:b.lastFight||S.t-2});delete b.fa}
function brandOut(b){for(const f of S.fights.filter(f=>f.a===b.id)){const o=getB(f.b);if(o)o.booked=false;const g=f.ev&&(S.galas||[]).find(x=>x.id===f.ev);}S.fights=S.fights.filter(f=>f.a!==b.id);S.queue=(S.queue||[]).filter(id=>S.fights.some(f=>f.id===id));b.mine=false;b.brand=null;b.booked=false;b.salary=0}
const myPromos=()=>promoAlive().filter(p=>p.own);
function promoWeek(){if(!S.promos)return;const sc=promoAlive().map(p=>prScore(p)),avg=sc.reduce((a,b)=>a+b,0)/Math.max(1,sc.length);
  for(const p of promoAlive()){const L=prBoxers(p);
    if(p.own){const n=prNet(p,L);S.money+=n;S.fin&&(S.fin.pro=(S.fin.pro||0)+n);p.lastNet=n;continue}
    if(p.sale){if(S.t>=p.sale.until)dissolvePromo(p);continue}
    p.cash+=Math.round(2500+(prScore(p,L)-avg)*10+(R()-.5)*34000);
    if(p.cash<0){p.neg++;if(p.neg>=9)bankrupt(p)}else p.neg=0}
  const used=new Set(promoAlive().map(p=>p.n));while(promoAlive().length<14){const q=newPromo(used);used.add(q.n);q.cash=ri(250,500)*1000;q.fresh=S.t;S.promos.push(q);{const pool=S.boxers.filter(b=>!b.mine&&!b.retired&&!b.champ&&b.pr!==q.id&&(()=>{const o=prOf(b);return o&&!o.own&&!o.sale})());for(let i=0;i<12&&pool.length;i++){const b=pool.splice(ri(0,pool.length-1),1)[0];b.pr=q.id}}log(`🏢 Nouvelle promotion : ${q.n} (${flag(q.nat)} ${NAT[q.nat].n}).`)}}
function bankrupt(p){p.sale={price:prPrice(p),until:S.t+6};p.cash=0;if(myPromos().length>=PRMAX-1){log(`${p.n} fait faillite.`);return}
  log(`💥 ${p.n} fait faillite ! Ses ${prBoxers(p).length} boxeurs sont à vendre : rachète la promotion pour ${$(p.sale.price)} d’ici 6 semaines.`,'gold');toast(`💥 Faillite : ${p.n}`)}
function dissolvePromo(p){const L=prBoxers(p);p.dead=true;p.sale=null;for(const b of L){b.pr=null;prOf(b)}log(`${p.n} ferme ses portes : ses boxeurs signent ailleurs.`)}
function buyPromo(id){const p=(S.promos||[]).find(x=>x.id===id);if(!p||!p.sale||p.own)return;
  if(myPromos().length>=PRMAX-1){toast(`Maximum ${PRMAX} promotions (ton club + ${PRMAX-1}).`);return}
  if(S.money<p.sale.price){toast('Pas assez d’argent.');return}
  const L0=prBoxers(p);S.money-=p.sale.price;p.own=true;p.auto=true;p.sale=null;p.neg=0;p.bought=S.t;mgrXP(200);for(const b of L0)brandIn(b,p);log(`🏢 Tu rachètes ${p.n} ! ${prBoxers(p).length} boxeurs passent sous ta bannière.`,'gold');toast(`🏢 ${p.n} est à toi ! Gère ses boxeurs dans l’Écurie.`)}
function sellPromo(id){const p=(S.promos||[]).find(x=>x.id===id);if(!p||!p.own)return;const v=Math.round(prValue(p)*.45/1000)*1000;for(const b of prBoxers(p))if(b.mine)brandOut(b);S.money+=v;p.own=false;p.cash=v;p.neg=0;log(`Tu revends ${p.n} pour ${$(v)}.`);toast(`Vendu : ${$(v)}`)}
function prMove(id){const b=getB(id),p=prOf(b);if(!b||!p||!p.own)return;if(club().length>=rosterCap()){toast('Écurie pleine.');return}
  Object.assign(b,{mine:true,brand:null,morale:75,loy:65,plan:b.plan||'normal',hist:b.hist||[],lvl:b.lvl||1,xp:b.xp||0,sp:b.sp||0,contract:52,salary:marketSal(b),pr:null,lastFight:b.lastFight||S.t-2});delete b.fa;log(`${b.name} quitte ${p.n} pour rejoindre ${S.club}.`,'gold');toast(`${sur(b)} rejoint ton écurie !`)}
const PRSTY=[['Flamboyant','Adore les gros galas et le trash-talk.'],['Calculateur','Protège ses boxeurs, choisit ses combats.'],['Vieille école','Fait grandir ses boxeurs lentement.'],['Bagarreur','Accepte tous les défis, même risqués.'],['Homme d’affaires','Suit l’argent : PPV et grandes chaînes.']];
function prBoss(p){if(!p.boss){const nat=p.nat||'US';p.boss={name:natName(nat),nat,age:ri(38,74),sty:ri(0,PRSTY.length-1),rep:ri(1,5),since:ri(1985,2020)}}return p.boss}
function h2hAdd(op,r){op.vsMe=op.vsMe||{w:0,l:0,d:0};op.vsMe[r]++;const p=prOf(op);if(p){p.vsMe=p.vsMe||{w:0,l:0,d:0};p.vsMe[r]++}}
function h2hInit(){if(S.h2h28)return;S.h2h28=1;const byN={};for(const b of S.boxers)if(!b.mine)byN[b.name]=b;for(const m of mine())for(const h of m.hist||[]){const o=byN[h.opp];if(!o)continue;h2hAdd(o,h.res==='V'?'w':h.res==='D'?'l':'d')}}
const h2hTxt=v=>v?`${v.w}V-${v.l}D-${v.d}N`:'0V-0D-0N';
const prRec=L=>L.reduce((a,b)=>({w:a.w+b.w,l:a.l+b.l,d:a.d+b.d,ko:a.ko+b.ko}),{w:0,l:0,d:0,ko:0});
const prChip=b=>{const p=(!b.mine||b.brand)&&S.boxers.includes(b)&&prOf(b);return p?`<span class="chip" style="border-color:${p.c}">🏢 ${esc(p.n)}${p.own?' 👑':''}</span>`:''};
const flag=c=>c&&c.length===2?String.fromCodePoint(...[...c].map(ch=>127397+ch.charCodeAt(0))):'';
const initials=n=>(n||'').split(/\s+/).filter(Boolean).map(w=>w[0]).join('').slice(0,3).toUpperCase()||'CR';
function pickNat(noHome){if(S&&S.offices&&S.offices.length&&R()<.2)return pick(S.offices);const h=S&&S.home;let tot=0;const e=Object.entries(NATW).filter(([c])=>!(noHome&&c===h)).map(([c,w])=>{if(!noHome&&c===h)w+=6;tot+=w;return[c,w]});let r=R()*tot;for(const[c,w]of e){if((r-=w)<0)return c}return'US'}
function natName(c){const p=NAMES[(NAT[c]||NAT.CA).p];return pick(p[0])+' '+pick(p[1])}
const potG=b=>b.pot>=82?'A+':b.pot>=75?'A':b.pot>=68?'B':b.pot>=60?'C':'D';
function natList(nat,div){return S.boxers.filter(b=>b.nat===nat&&b.div===div&&!b.retired).sort((a,b)=>b.pts-a.pts)}
function natIdx(b){return natList(b.nat,b.div).filter(x=>!x.nchamp).indexOf(b)}
function natLabel(b){return b.nchamp?`Champion ${NAT[b.nat].n}`:`#${natIdx(b)+1} ${NAT[b.nat].n}`}
function ensureNat(nat,div){const l=natList(nat,div),cs=l.filter(b=>b.nchamp);if(cs.length>1)for(const b of cs.slice(1))b.nchamp=false;if(l.length>=2&&!cs.length){l[0].nchamp=true;if(S.t>1&&nat===S.home)log(`${flag(nat)} ${l[0].name} devient champion national ${divN(div)}.`)}}
function ensureAllNat(){for(const n of Object.keys(NAT))for(const d of DIVS)ensureNat(n,d.id)}
function canNat(me,op){if(!op.nchamp||op.nat!==me.nat||me.inj||me.booked||op.booked||op.inj)return false;const i=natIdx(me);return i>=0&&i<3}

/* ================= OUTILS ================= */
const R=rnd, ri=(a,b)=>Math.floor(a+R()*(b-a+1)), cl=(v,a,b)=>Math.max(a,Math.min(b,v)), pick=a=>a[Math.floor(R()*a.length)];
const $=n=>Math.round(n).toLocaleString('fr-CA')+' $';
const ord=n=>n+(n===1?'er':'e');
const sur=b=>b.name.split(' ').slice(1).join(' ');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const has=(b,k)=>!!(b.traits&&b.traits.includes(k));
const divN=id=>DIVS.find(d=>d.id===id).n;
const when=t=>`An ${Math.floor((t-1)/52)+1} · Sem. ${((t-1)%52)+1}`;
const need=l=>Math.round(100+l*60+l*l*4), mneed=l=>100+l*60;
const capOf=b=>Math.min(99,b.pot+6);
const statCost=(b,k)=>{const v=Math.floor(b[k]);return(v<70?1:v<85?2:3)+(k==='chin'?1:0)};
function shade(h,f){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?0:255,p=Math.abs(f);r=Math.round(r+(t-r)*p);g=Math.round(g+(t-g)*p);b=Math.round(b+(t-b)*p);return'#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}
let S, ui={tab:'ecurie',esub:'mine',csub:'cal',bookFor:null,div:null,confirm:null,fight:null,sheet:null,gym:0,gymBoxer:null};

/* ================= MOTEUR : BOXEURS ================= */
function ovr(b){return Math.round(b.pow*.24+b.spd*.24+b.def*.22+b.sta*.15+b.chin*.15)}
function genTraits(){const t=[];if(R()<.55)t.push(pick(POS));if(R()<.15){const k=pick(POS);if(!t.includes(k))t.push(k)}if(R()<.22)t.push(pick(NEG));return t}
function makeBoxer(o){
  const v=()=>cl(Math.round(o.ovr+(R()-.5)*24),20,96);
  const nat=o.nat||pickNat(),b={id:'b'+(S.uid++),nat,name:natName(nat),nick:R()<.35?pick(NICKS):'',age:o.age,div:o.div,city:pick(NAT[nat].c),
    pow:v(),spd:v(),def:v(),sta:v(),chin:v(),pot:0,w:0,l:0,d:0,ko:0,fame:1,morale:70,fatigue:10,inj:0,salary:0,
    mine:false,champ:false,pts:0,lastFight:S.t-ri(0,20),booked:false,retired:false,style:pick(['agr','eq','pru','corps']),
    plan:'normal',hist:[],lvl:1,xp:0,sp:0,traits:genTraits(),loy:60,contract:52,lastCh:0,
    look:{skin:ri(0,5),hair:ri(0,5),hc:ri(0,5),beard:R()<.45?ri(1,3):0,scar:R()<.15,tr:ri(0,6)}};
  b.pot=cl(ovr(b)+(o.pot||0),ovr(b),99);
  return b;
}
/* ================= v21 : CIRCUIT AMATEUR ================= */
const AMEV=[{w:8,id:'gants',n:'Gants dorés juniors',ic:'🥊',lvl:1,junior:1},{w:14,id:'nat',n:'Championnats nationaux',ic:'🏁',lvl:1},{w:30,id:'cont',n:'Championnats continentaux',ic:'🌎',lvl:2},{w:44,id:'monde',n:'Championnats du monde amateurs',ic:'🌍',lvl:3,odd:1},{w:30,id:'jo',n:'Jeux olympiques',ic:'🏅',lvl:4,oly:1}];
const AMBON={gants:[20000,8000,4000],nat:[15000,6000,3000],cont:[45000,18000,9000],monde:[120000,50000,25000],jo:[300000,120000,60000]};
const amYear=()=>Math.floor((S.t-1)/52)+1,amWeek=()=>(S.t-1)%52+1;
function amEventsOf(y){return AMEV.filter(e=>e.oly?y%4===0:e.id==='cont'?y%4!==0:e.odd?y%2===1:true)}
function newAm(age){const nat=R()<.3?S.home:pickNat(),b=makeBoxer({div:pick(DIVS).id,nat,ovr:ri(30,44)+(age-15)*2,age,pot:ri(18,42)});b.am={w:0,l:0,med:[]};b.amId=b.id;b.fame=1;return b}
function ensureAm(){if(!S.am||!S.am.length){S.am=[];for(let i=0;i<110;i++){const b=newAm(ri(15,20));const n=ri(0,(b.age-14)*8);b.am.w=Math.round(n*(.4+R()*.5));b.am.l=n-b.am.w;S.am.push(b)}}}
const amOvrSeen=b=>b.scout?ovr(b):Math.round(ovr(b)/5)*5;
function amPrice(b){if(b.acadMine)return 0;const m=b.am.med||[];return Math.round((8000+m.reduce((s,x)=>s+((AMBON[x.e]||[0,0,0])[x.r]||0),0)+Math.max(0,ovr(b)-45)*1500)/1000)*1000}
const MEDI=['🥇','🥈','🥉'];
const medTxt=b=>(b.am.med||[]).slice(-6).map(x=>MEDI[x.r]).join('');
function amFight(a,b){const p=1/(1+Math.exp(-(ovr(a)-ovr(b)+(R()-.5)*14)/5));return R()<p?[a,b]:[b,a]}
function runAmEvent(ev){const y=amYear(),L=[],lines=[];
  for(const d of DIVS){let pool=S.am.filter(b=>b.div===d.id&&(!ev.junior||b.age<=18));
    if(ev.id==='nat')pool=pool.filter(b=>b.nat===S.home);
    else if(ev.id!=='gants'){const best={};for(const b of pool.sort((x,z)=>ovr(z)-ovr(x)))if(!best[b.nat])best[b.nat]=b;pool=Object.values(best)}
    pool=pool.sort((x,z)=>ovr(z)-ovr(x)).slice(0,8);if(pool.length<2)continue;
    let r=pool.slice(),lost=[];while(r.length>1){const nx=[];for(let i=0;i<r.length;i+=2){if(!r[i+1]){nx.push(r[i]);continue}const[w,l]=amFight(r[i],r[i+1]);w.am.w++;l.am.l++;nx.push(w);lost.push(l)}r=nx}
    const g=r[0],s2=lost[lost.length-1],br=lost.slice(-3,-1);
    for(const[b,rk]of[[g,0],[s2,1],...br.map(x=>[x,2])])if(b){b.am.med.push({e:ev.id,n:ev.n,y,r:rk});b.fame=cl(b.fame+[6,3,2][rk]*ev.lvl,1,100);if(ev.lvl>=3)b.pot=cl(b.pot+(rk===0?2:1),0,99)}
    lines.push(`<b>${d.n}</b> : 🥇 ${flag(g.nat)} ${esc(g.name)}${s2?` · 🥈 ${flag(s2.nat)} ${esc(s2.name)}`:''}`);
    if(S.amScout===ev.id+y)for(const b of pool)b.scout=1}
  S.amHist=S.amHist||[];S.amHist.unshift({id:ev.id,n:ev.n,y,t:S.t});if(S.amHist.length>30)S.amHist.length=30;
  const home=S.am.filter(b=>(b.am.med||[]).some(m=>m.e===ev.id&&m.y===y&&m.r===0)&&b.nat===S.home).length;
  log(`${ev.ic} ${ev.n} ${y} : ${home?`${home} médaille${home>1?'s':''} d’or pour ${flag(S.home)} ${NAT[S.home].n} !`:'résultats dans Écurie → Amateurs.'}`,ev.lvl>=3?'gold':'');
  if(ev.lvl>=3){const nt={t:`${ev.ic} ${ev.n} · an ${y}`,lines:['Les champions de chaque catégorie. Ils sont dans Écurie → Amateurs : signe-les avant les autres promotions !',...lines]};if(S.notice)S.notice.lines.push(`<b>${ev.n}</b>`,...lines);else S.notice=nt}}
function amWeekTick(){if(!S.am)return;const y=amYear(),w=amWeek();for(const ev of amEventsOf(y))if(ev.w===w)runAmEvent(ev)}
function amNewYear(){if(!S.am)return;for(const b of S.am){if(b.acadMine)continue;b.age++;const g=Math.min(Math.max(0,b.pot-ovr(b)),ri(1,5));if(g>0)for(const k of['pow','spd','def','sta','chin'])b[k]=cl(b[k]+g*(.6+R()*.8),1,99)}
  for(const b of acadKids()){b.age++;const g=Math.min(Math.max(0,b.pot-ovr(b)),ri(2,6));if(g>0)for(const k of['pow','spd','def','sta','chin'])b[k]=cl(b[k]+g*(.7+R()*.8),1,99)}
  const out=S.am.filter(b=>b.age>=22&&!b.acadMine);S.am=S.am.filter(b=>b.age<22||b.acadMine);
  for(const b of out){delete b.scout;b.pts=0;b.fame=cl(b.fame,1,60);S.boxers.push(b);prOf(b)}
  if(out.length)log(`🎓 ${out.length} amateurs passent pros chez d’autres promotions.`);
  while(S.am.length<110)S.am.push(newAm(ri(15,16)))}
function signAm(id){const b=(S.am||[]).find(x=>x.id===id);if(!b)return;if(b.acadMine&&b.age>=17){b.autoAsk=0;b.age=Math.max(b.age,17);acadWeek();return}if(b.age<17){toast('Il doit avoir 17 ans pour passer pro.');return}
  if(club().length>=rosterCap()){toast('Écurie pleine.');return}const c=amPrice(b);if(S.money<c){toast('Pas assez d’argent.');return}
  S.money-=c;S.am=S.am.filter(x=>x!==b);delete b.amId;Object.assign(b,{mine:true,morale:85,loy:75,plan:'normal',lastFight:S.t-2,hist:[],lvl:1,xp:0,sp:0,contract:156,salary:marketSal(b),pts:0,fame:cl(b.fame,1,100),scout:1});S.boxers.push(b);mcAdd('sign');
  log(`✍️ ${b.name} (${b.am.w}-${b.am.l} chez les amateurs${medTxt(b)?' '+medTxt(b):''}) passe pro avec ${S.club} ! Prime : ${$(c)}.`,'gold');toast(`✍️ ${sur(b)} signe avec toi !`)}
function scoutAm(id){const b=(S.am||[]).find(x=>x.id===id);if(!b||b.scout)return;if(S.money<5000){toast('Pas assez d’argent.');return}S.money-=5000;b.scout=1;toast('🔍 Rapport du recruteur reçu')}
function vAm(){ensureAm();const y=amYear(),w=amWeek(),evs=[...amEventsOf(y).filter(e=>e.w>=w).map(e=>({e,y})),...amEventsOf(y+1).map(e=>({e,y:y+1}))].slice(0,4);
  const f=ui.amf||'top',L=S.am.filter(b=>f==='top'?true:f==='home'?b.nat===S.home:f==='med'?(b.am.med||[]).length:b.age>=17).sort((a,b)=>((b.am.med||[]).length*4+amOvrSeen(b))-((a.am.med||[]).length*4+amOvrSeen(a))).slice(0,40);
  const nx=evs[0],big=evs.find(x=>x.e.lvl>=3);
  const K=acadKids();const acad=`<div class="panel"><div class="ph"><span class="lab">🧒 Ton académie · ${K.length}/${acadMax()}</span><button class="btn sm gold" data-a="acadin" ${S.money>=20000&&K.length<acadMax()?'':'disabled'}>Recruter un jeune · 20 000 $</button></div><p class="small" style="margin:0 0 6px">Des jeunes de 12 à 14 ans de ${flag(S.home)} ${NAT[S.home].n}, formés chez toi (300 $/sem. chacun). Ils boxent chez les amateurs et passent pros avec toi à 17 ans, gratuitement et ultra loyaux.</p>${K.length?`<div class="list">${K.map(b=>`<button class="rowc" data-a="amopen" data-id="${b.id}"><div class="av">${avatar(b,'red')}</div><div class="rc-m"><div class="nm">${esc(b.name)}</div><div class="meta">${b.age} ans · ${divN(b.div)} · ${b.am.w}-${b.am.l} ${medTxt(b)}</div></div><div class="ovr"><b>${ovr(b)}</b><small>POT ${potG(b)}</small></div></button>`).join('')}</div>`:''}</div>`;
  return acad+`<p class="lede">Les futurs champions boxent d’abord chez les amateurs. Suis les tournois, envoie tes recruteurs et signe les meilleurs avant les autres promotions (dès 17 ans).</p>
  <div class="panel"><span class="lab">Calendrier amateur</span><div style="display:grid;gap:6px;margin-top:8px">${evs.map(({e,y:yy})=>{const wk=(yy-1)*52+e.w+1,dt=wk-S.t;return`<div class="row" style="justify-content:space-between;gap:8px"><span>${e.ic} <b>${e.n}</b> <span class="small">an ${yy}</span></span><span class="chip ${e.lvl>=3?'gold':''}">${dt<=0?'cette semaine':`dans ${dt} sem.`}</span></div>`}).join('')}</div>
    ${big?`<div class="row" style="justify-content:space-between;gap:8px;margin-top:10px"><span class="small">${S.amScout===big.e.id+big.y?'✓ Tes recruteurs seront aux '+big.e.n+' : tous les participants seront évalués.':`Envoie tes recruteurs aux ${big.e.n} pour évaluer tous les participants.`}</span>${S.amScout===big.e.id+big.y?'':`<button class="btn sm gold" data-a="amtrip" data-k="${big.e.id+big.y}" ${S.money>=40000?'':'disabled'}>✈️ 40 000 $</button>`}</div>`:''}</div>
  ${segH('amf',[['top','Meilleurs'],['home',flag(S.home)+' Mon pays'],['med','Médaillés'],['pro','Prêts (17+)']],f)}
  <div class="list" style="margin-top:10px">${L.map(b=>`<button class="rowc" data-a="amopen" data-id="${b.id}"><div class="av">${avatar(b,'blue')}</div><div class="rc-m"><div class="nm">${flag(b.nat)} ${esc(b.name)}</div><div class="meta">${divN(b.div)} · <span class="${agePh(b)[2]}" style="font-weight:800">${b.age} ans</span> · ${b.am.w}-${b.am.l} amateur</div>
    <div class="chips s">${medTxt(b)?`<span class="chip gold">${medTxt(b)}</span>`:''}<span class="chip">${b.scout?'Potentiel '+potG(b):'Potentiel ?'}</span>${b.age>=17?`<span class="chip">${moneyS(amPrice(b))}</span>`:'<span class="chip">Trop jeune</span>'}</div></div><div class="ovr"><b>${b.scout?ovr(b):'~'+amOvrSeen(b)}</b><small>NOTE</small></div></button>`).join('')}</div>`}
function vAmSheet(b){const full=club().length>=rosterCap(),c=amPrice(b);
  return`<div class="in"><button class="back" data-a="close">← Retour</button>
  <div class="hero c t-e"><div class="av md">${avatar(b,'blue')}</div><div style="min-width:0;flex:1"><span class="tier-tag">Amateur · ${STYLES[b.style]}</span><div class="nm">${esc(b.name)}</div><div class="sub">${flag(b.nat)} ${esc(b.city)} · ${divN(b.div)} · ${b.age} ans · ${b.am.w}-${b.am.l} chez les amateurs</div><div class="chips s">${ageChip(b)}${medTxt(b)?`<span class="chip gold">${medTxt(b)}</span>`:''}</div></div><div class="ovr"><b>${b.scout?ovr(b):'~'+amOvrSeen(b)}</b><small>NOTE</small></div></div>
  ${b.scout?statsPanel(b,false)+`<div class="panel"><span class="lab">Rapport du recruteur · potentiel ${potG(b)}</span><p class="small" style="margin:6px 0 0">Il peut monter jusqu’à <b>${Math.min(99,b.pot+6)}</b> par stat. ${b.pot>=80?'Un futur champion du monde si tout va bien.':b.pot>=70?'Un très bon espoir.':b.pot>=60?'Un pro solide.':'Un potentiel limité.'}</p></div><div class="panel"><span class="lab">Traits</span><div class="tgrid" style="margin-top:8px">${traitList(b)}</div></div>`
    :`<div class="panel"><span class="lab">Pas encore évalué</span><p class="small" style="margin:6px 0 10px">Ses stats exactes et son potentiel sont inconnus. Envoie un recruteur le voir boxer.</p><button class="btn gold" data-a="amscout" data-id="${b.id}" ${S.money>=5000?'':'disabled'}>🔍 Envoyer un recruteur · 5 000 $</button></div>`}
  <div class="panel"><span class="lab">Médailles</span>${(b.am.med||[]).length?`<ul class="log">${b.am.med.slice().reverse().map(m=>`<li>${MEDI[m.r]} ${esc(m.n)} <span class="small">an ${m.y}</span></li>`).join('')}</ul>`:'<p class="small" style="margin:6px 0 0">Aucune médaille pour l’instant.</p>'}</div>
  <div class="mbar"><div style="flex:1;min-width:0"><b>${$(c)}</b><span class="small"> prime de signature · contrat 3 ans</span></div><button class="btn pri" data-a="amsign" data-id="${b.id}" ${b.age<17||full||S.money<c?'disabled':''}>${b.age<17?'Trop jeune':full?'Écurie pleine':'✍️ Signer pro'}</button></div></div>`}
const unbeatP=b=>b.age<=21?.8:b.age<=24?.55:ovr(b)>=80?.4:ovr(b)>=72?.25:ovr(b)>=62?.12:.05;
function seedRecord(b){
  const n=Math.max(0,b.age<=21?ri(0,3)+(b.age-18)*ri(1,3):(b.age-19)*ri(1,2)+ri(0,3)), wr=cl(.6+(ovr(b)-55)/45,.25,.97);
  if(R()<unbeatP(b)){b.d=n>6&&R()<.15?1:0;b.w=n-b.d;b.l=0}
  else{b.w=Math.round(n*wr); b.d=R()<.25?Math.min(ri(0,1),n-b.w):0; b.l=Math.max(0,n-b.w-b.d);if(!b.l&&n>0){b.l=1;b.w=Math.max(0,b.w-1)}}
  b.ko=Math.round(b.w*(.3+b.pow/250));
  b.pts=Math.max(0,Math.round((ovr(b)-42)*8+ri(-15,25)));
  b.fame=cl(Math.round((ovr(b)-42)*1.4+ri(0,8)),1,100);
}
const getB=id=>S.boxers.find(b=>b.id===id)||S.fa.find(b=>b.id===id);
const mine=()=>S.boxers.filter(b=>b.mine&&!b.retired);
const club=()=>mine().filter(b=>!b.brand);
const orgB=()=>{const p=ui.ebrand&&myPromos().find(x=>x.id===ui.ebrand);if(!p)ui.ebrand=null;return p?mine().filter(b=>b.brand===p.id):club()};
const orgSel=()=>{const MP=myPromos();return MP.length?selH('borg',[['',`🥊 ${esc(S.club)} (principal)`],...MP.map(p=>[p.id,`🏢 ${esc(p.n)}`])],ui.ebrand||''):''};
const rankList=div=>S.boxers.filter(b=>b.div===div&&!b.retired&&!b.champ).sort((a,b)=>b.pts-a.pts);
const champOf=div=>champsOf(div)[0];
function rankIdx(b){if(b.champ)return-1;const i=rankList(b.div).indexOf(b);return i<0?999:i}
// B7 : tout boxeur présent au classement affiche son rang (avant : top 15 seulement).
function rankLabel(b){const i=rankIdx(b);return i<0?'Champion':i<999?'#'+(i+1):'Non classé'}
function ensureChamp(div){ensureBelts(div);return null}
const rosterCap=()=>2+((S.fac&&S.fac.vest)||0)+(S.branches||[]).reduce((s,g)=>s+(g.cap||2),0);
function marketSal(b){return Math.max(120,Math.round(((ovr(b)-30)*9+b.fame*3+(b.lvl||1)*10)/10)*10)}
function log(txt,kind){S.log.unshift({t:S.t,txt,kind:kind||''});if(S.log.length>150)S.log.length=150}
let toastQ=[],toastOn=false;
function toast(t){toastQ.push(t);if(!toastOn)nextToast()}
function nextToast(){const el=document.getElementById('toast');if(!toastQ.length){toastOn=false;el.hidden=true;return}toastOn=true;el.textContent=toastQ.shift();el.hidden=false;setTimeout(nextToast,2400)}

function addXP(b,x){
  b.xp+=Math.round(x);
  while(b.xp>=need(b.lvl)){
    if(b.mine&&b.lvl%5===0&&!(b.pal&&b.pal[b.lvl])){b.xp=need(b.lvl)-1;if(!b.gate){b.gate=1;log(`${b.name} doit réussir l’épreuve du niveau ${b.lvl} pour continuer à progresser.`,'gold');toast(`Épreuve débloquée : ${sur(b)}`)}break}
    b.xp-=need(b.lvl);b.lvl++;b.sp+=5;
    if(b.lvl%5===0&&b.traits.filter(k=>TRAITS[k].g).length<4&&!b.trOpt){const o=POS.filter(k=>!b.traits.includes(k)).sort(()=>R()-.5).slice(0,3);if(o.length)b.trOpt=o}
    if(b.mine){toast(`${b.name} passe au niveau ${b.lvl} !`);log(`${b.name} atteint le niveau ${b.lvl} (+5 points de stats).`,'good')}
  }
}
function mgrXP(x){const m=S.mgr;m.xp+=Math.round(x);while(m.xp>=mneed(m.lvl)){m.xp-=mneed(m.lvl);m.lvl++;toast(`Gérant niveau ${m.lvl} ! +1 point d’atout`);log(`Tu passes gérant niveau ${m.lvl}. Un nouveau point d’atout est disponible.`,'gold')}}
function spend(b,k){const c=statCost(b,k);if(b.sp<c||Math.floor(b[k])+1>capOf(b))return false;b.sp-=c;b[k]=Math.floor(b[k])+1;return true}
const canSpend=b=>b.sp>0&&STATS.some(([k])=>Math.floor(b[k])+1<=capOf(b)&&statCost(b,k)<=b.sp);
function autoSpend(b){const pr={agr:['pow','sta','spd','def'],eq:['spd','def','pow','sta'],pru:['def','spd','sta','pow'],corps:['sta','pow','def','spd']}[b.style];let ok=true;while(ok){ok=false;for(const k of pr)if(spend(b,k))ok=true}}

/* ================= MOTEUR : MONDE ================= */
function staffSalary(){const s=S.staff;return[s.coach,s.phys,s.cut,...s.spar].filter(Boolean).reduce((a,x)=>a+x.salary,0)}
function genStaff(){
  const out=[],res=S.mgr.perks.res;
  for(let i=0;i<6;i++){const role=pick(['coach','phys','cut','spar','spar','coach']);let st=ri(1,3);if(R()<.12+.12*res)st++;if(R()<.05+.05*res)st++;st=cl(st,1,5);
    out.push({id:'s'+(S.uid++),role,name:natName(S.home||'CA'),stars:st,salary:SAL[st]+ri(0,4)*10})}
  return out;
}
function genFA(){
  const out=[],res=S.mgr?S.mgr.perks.res:0;
  for(let i=0;i<16;i++){
    const r=R(),d=pick(DIVS).id;let b;
    if(r<.6)b=makeBoxer({div:d,ovr:ri(38,52)+res*2,age:ri(18,21),pot:ri(16,38)+res*3});
    else if(r<.85)b=makeBoxer({div:d,ovr:ri(50,62)+res*2,age:ri(24,30),pot:ri(1,8)+res});
    else b=makeBoxer({div:d,ovr:ri(60,69)+res*2,age:ri(31,34),pot:ri(0,2)});
    seedRecord(b);
    if(b.age<22){b.pts=Math.round(b.pts*.3);b.fame=cl(Math.round(b.fame*.5),1,100)}
    b.salary=marketSal(b);b.fa=true;out.push(b);
  }
  return out;
}
function genGyms(){
  return GYMS.map(([name,city,o])=>({name,city,o,beaten:0,m:[-3,0,4].map((off,j)=>{
    const b=makeBoxer({div:'welter',nat:CITYNAT[city]||'CA',ovr:o+off,age:ri(22,32),pot:0});seedRecord(b);
    if(j===2&&!b.traits.some(k=>TRAITS[k].g))b.traits.unshift(pick(POS));
    return b})}));
}
function worldGen(o){
  S={v:2,uid:1,t:1,money:{facile:50000,normal:25000,difficile:10000}[o.diff]||25000,gym:1,boxers:[],fa:[],fights:[],queue:[],log:[],fin:null,
     staff:{coach:null,phys:null,cut:null,spar:[]},market:[],mgr:{lvl:1,xp:0,pts:0,perks:{neg:0,mot:0,rec:0,res:0,ges:0}},
     gyms:[],ach:{},stats:{wins:0,kos:0,titles:0,badges:0},set:Object.assign({...DEFSET},S&&S.set||{}),event:null,
     club:o.club,mgrName:o.mgr,home:o.home,diff:o.diff,slot:o.slot,offers:[],champHist:[],belts:{},fac:{vest:0,ring:0,cardio:0,med:0,video:0,dorm:0,acad:0},branches:[],galas:[],tcd:{},tour:null};
  for(const d of DIVS){
    for(let i=0;i<52;i++){const b=makeBoxer({div:d.id,ovr:44+i*.78+ri(-2,2),age:ri(21,33),pot:ri(0,6)});seedRecord(b);S.boxers.push(b)}
    for(let i=0;i<16;i++){const b=makeBoxer({div:d.id,nat:o.home,ovr:ri(38,56),age:ri(19,30),pot:ri(0,10)});seedRecord(b);b.pts=Math.round(b.pts*.6);S.boxers.push(b)}
    ensureChamp(d.id);
  }
  ensureAllNat();
  if(o.diff!=='difficile')S.staff.coach={id:'s0',role:'coach',name:natName(o.home),stars:o.diff==='facile'?2:1,salary:o.diff==='facile'?160:120};
  S.fa=genFA();S.market=genStaff();S.gyms=genGyms();S.promos=null;ensurePromos();S.am=null;ensureAm();
}
function genPool(){
  const h=S.home,specs=[['Espoir',18,20,40,46,25,38],['Espoir',18,21,41,47,22,34],['Espoir',19,21,42,48,20,30],['Confirmé',23,27,50,55,4,10],['Confirmé',24,28,51,56,4,9],['Confirmé',23,26,49,54,6,12],['Vétéran',29,32,57,62,0,3],['Vétéran',30,33,58,63,0,2]];
  const foreign=new Set([ri(0,7),ri(0,7)]);
  ui.ng.pool=specs.map(([g,a1,a2,o1,o2,p1,p2],i)=>{const b=makeBoxer({div:pick(DIVS).id,nat:foreign.has(i)?pickNat(1):h,ovr:ri(o1,o2),age:ri(a1,a2),pot:ri(p1,p2)});
    seedRecord(b);b.pts=Math.round(b.pts*(g==='Espoir'?.2:.6));b.fame=cl(Math.round(b.fame*.5),1,100);b.salary=marketSal(b);b.grp=g;return b});
  ui.ng.picks=[];
}
function finishNew(){
  const pk=ui.ng.picks.map(i=>ui.ng.pool[i]);if(pk.length!==2)return;
  for(const b of pk){delete b.fa;Object.assign(b,{mine:true,morale:80,loy:72,plan:'normal',lastFight:S.t-2,hist:[],lvl:1,xp:0,sp:0,contract:52,booked:false});S.boxers.push(b)}
  ensureAllNat();
  log(`${S.mgrName} fonde ${S.club} (${flag(S.home)} ${NAT[S.home].n}). Premiers boxeurs : ${pk.map(b=>b.name).join(' et ')}. Tout se gagne sur le ring.`,'gold');
  const s=S;ui.ng=null;enterGame(s);toast(`Bienvenue chez ${S.club} !`);
}
// Règle n° 12 (Max, 2026-11-05) : chaque semaine de camp coûte plus cher que la précédente,
// pour que la durée du camp redevienne une vraie décision (8 sem. ≈ +3 500 $ par rapport à 6).
function campWeekCost(i){return Math.round(250*Math.pow(1.35,i)/50)*50}
function campTotal(n){let s=0;for(let i=0;i<n;i++)s+=campWeekCost(i);return s}
// Règle n° 10 (Max, 2026-11-05) : au moins 1 combat par 3 mois, sinon perte de crédibilité.
// Le gérant est averti 2 semaines avant, puis à chaque perte (jamais de punition silencieuse).
const INACTIVE_MAX=13;
function inactiveWeeks(b){return S.t-(b.lastFight??S.t)}
function inactivityTick(b){if(!b.mine||b.retired||b.booked)return;const w=inactiveWeeks(b);
  if(w===INACTIVE_MAX-2){log(`⏳ ${b.name} sera inactif dans 2 sem. : réserve-lui un combat pour garder sa crédibilité.`,'warn');toast(`⏳ ${sur(b)} : combat à réserver d’ici 2 sem.`)}
  else if(w>=INACTIVE_MAX&&(w-INACTIVE_MAX)%4===0){b.fame=cl(b.fame-3,1,100);log(`📉 ${b.name} est inactif depuis ${w} sem. : −3 de crédibilité.`,'bad');toast(`📉 ${sur(b)} inactif : −3 crédibilité`)}}
function train(b){
  const cut=S.staff.cut?S.staff.cut.stars:0,phys=S.staff.phys?S.staff.phys.stars:0,coach=S.staff.coach?S.staff.coach.stars:0,fc=S.fac||{};
  const cf=S.fights.find(z=>z.a===b.id&&z.week>=S.t);
  if(b.inj>0){if(cf){cf.prep=cl((cf.prep??10)-6,0,100);(cf.log=cf.log||[]).push('inj');cf.wk=(cf.wk||0)+1}b.inj--;if(b.inj>0&&R()<.15*cut+.12*(fc.med||0))b.inj--;b.fatigue=cl(b.fatigue-15,0,100);if(!b.inj)log(`${b.name} est remis de sa blessure.`);return}
  b.morale=cl(b.morale+(b.morale<60?1:-.5)+.5*(fc.dorm||0),0,100);
  let foc=null,P;
  if(cf){if(cf.auto!==false&&!cf.gp){const op=getB(cf.b);if(op)cf.gp=bestGP(op.style)}foc=campFocus(b,cf);const Fo=FOC[foc];P={xp:Fo.xp,fat:Fo.fat,inj:Fo.inj}}
  else{if(b.plan==='sparring'&&!S.staff.spar.length)b.plan='normal';P=PLANS[b.plan]||PLANS.normal;if(b.fatigue>=80&&P.xp){P=PLANS.repos;if(!b.autoR)log(`${b.name} est épuisé : repos automatique jusqu’à ce qu’il récupère.`);b.autoR=1}else if(b.fatigue<50)b.autoR=0;
    if(!P.xp){b.fatigue=cl(b.fatigue-25-phys*4-3*(fc.cardio||0),0,100);b.morale=cl(b.morale+3,0,100);return}}
  const spar=(cf?foc==='spar':b.plan==='sparring')?S.staff.spar.reduce((s,y)=>s+y.stars,0):0;
  // Règle n° 11 (Max, 2026-11-05) : l'entraînement prépare (forme, camp), il ne donne plus d'XP.
  if(cf){const Fo=FOC[foc],cc=campWeekCost(cf.wk||0);S.money-=cc;
    const g=Fo.prep*(1+.08*coach+.05*phys)*(1+.1*(fc.ring||0))*((foc==='cardio'||foc==='repos'||foc==='aff')?1+.15*(fc.cardio||0):1)*(foc==='spar'?1+.1*spar:1)*(1-b.fatigue/220)+(cf.camp==='video'?1:cf.camp==='alt'?2:0);
    cf.prep=cl(Math.round((cf.prep??10)+g),0,100);cf.wk=(cf.wk||0)+1;cf.bon=cf.bon||{};if(Fo.bon)cf.bon[Fo.bon]=(cf.bon[Fo.bon]||0)+1;(cf.log=cf.log||[]).push(foc);
    if(foc==='spar')mcAdd('spar')}
  const df=P.fat-((foc==='repos'||foc==='aff')?3*(fc.cardio||0):0);b.fatigue=cl(b.fatigue+(df>0?df*(1-.12*phys):df*(1+.12*phys)),0,100);
  const inj=P.inj*(b.fatigue>65?2.5:1)*(1-.12*phys)*(1-.12*(fc.med||0))*(has(b,'fragile')?1.6:1);
  if(R()<inj){b.inj=ri(1,4);log(`${b.name} se blesse à l’entraînement : ${b.inj} semaine${b.inj>1?'s':''} d’arrêt.`,'bad')}
}
function weeklyLoyalty(b){
  let d=0;if(b.morale>60)d+=.6;if(b.morale<40)d-=.8;if(S.t-b.lastFight>10)d-=.7;if(S.money<0)d-=2;d+=.3*S.mgr.perks.mot+.3*((S.fac&&S.fac.dorm)||0);
  if(d<0){if(has(b,'diva'))d*=2;if(has(b,'fidele'))d*=.5}
  b.loy=cl(b.loy+d,0,100);
  if(b.loy<25&&!b.raiseAsk&&(b.raiseCd||0)<=S.t){b.raiseAsk=Math.round(b.salary*1.3/10)*10;log(`${b.name} est mécontent et réclame une augmentation.`,'bad')}
}
function leave(b,why){b.mine=false;b.salary=0;b.raiseAsk=0;log(`${b.name} quitte le club : ${why}.`,'bad');toast(`${b.name} quitte le club`)}

/* ================= COMBAT ================= */
let FORM=.2,KOD=.75,KOP=.62;
function rollForm(X){const nd=1+(R()+R()-1)*FORM,k=nd/(X.df||1);X.pow*=k;X.spd*=k;X.def*=k;X.sta*=k;X.df=nd;return X}
function fighter(b){const fm=(1-b.fatigue/250)*(.92+b.morale/800);
  return rollForm({b,pow:b.pow*fm,spd:b.spd*fm,def:b.def*fm,sta:b.sta*fm,chin:b.chin+(has(b,'fer')?12:0)-(has(b,'verre')?12:0),hp:100,en:100,kd:0,land:0,thr:0})}
const REFS=[{id:'n',n:'Marc « Le Juste » Gagnon',t:'Normal',d:'Arbitre classique, sans surprise.',hp:22,p:.16,kh:25,kr:3,ct:3,cp:.35,ic:'⚖️'},
 {id:'s',n:'Denis « Le Strict » Roy',t:'Strict',d:'Arrête vite : plus de TKO quand un boxeur est en difficulté.',hp:32,p:.26,kh:32,kr:2,ct:3,cp:.5,ic:'🛑'},
 {id:'l',n:'Big Earl « Laisse-aller » Jones',t:'Laisse-aller',d:'Laisse se battre : plus de remontées et de KO tardifs.',hp:12,p:.08,kh:18,kr:4,ct:3,cp:.2,ic:'🔥'},
 {id:'m',n:'Dre Sophie « Protectrice » Côté',t:'Protecteur',d:'Très attentive aux coupures : arrêts médicaux plus rapides.',hp:24,p:.18,kh:25,kr:3,ct:2,cp:.4,ic:'🩺'},
 {id:'v',n:'Tony « Le Vétéran » Russo',t:'Vétéran',d:'Laisse un peu plus de chances au boxeur ébranlé.',hp:18,p:.12,kh:22,kr:3,ct:3,cp:.3,ic:'🎖️'}];
const refOf=F=>F.ref||REFS[0];
function newFight(a,b,rounds,title,camp){const F={ref:REFS[Math.floor(R()*REFS.length)],A:fighter(a),B:fighter(b),r:0,ph:0,rd:null,rs:[],rst:[],cs:null,rounds,title,cards:[[0,0],[0,0],[0,0]],log:[],done:false,res:null,strat:'eq',adv:null,cut:a.mine&&S.staff.cut?S.staff.cut.stars:0};F.A.camp=camp||'';return F}
const prepM=p=>.95+(p==null?60:p)*.0009;
function exchange(A,B,sa,sb,k=1){
  const ef=.55+.45*A.en/100;
  const att=(28+A.spd*.32)*sa.o*ef*(has(A.b,'eclair')?1.1:1)*(has(A.b,'jab')?1.05:1)*(1+abS(A.b,'att'))*k*prepM(A.prep);
  const acc=cl(.2+(A.spd-B.def*sb.d*(B.guard?1.06:1)*(1+(B.bt||0)*.03)*(1-(B.cut||0)*.03))/260+(R()-.5)*.08+(has(A.b,'contre')&&sb===STRAT.agr?.05:0)+(A.camp==='video'?.015:0)+(A.gpb?.02:0)-(B.gpb?.01:0)+(A.boost?.025:0)+(A.cnt?.05:0)-(A.cntd?.03:0)+(A.motiv?.015:0)+(A.bs||0)*.012+(A.gpb?(A.vid||0)*.006:0)+(has(A.b,'sniper')?.03:0)-(has(B.b,'mur')?.03:0)-(has(B.b,'esquive')?.02:0)-(has(B.b,'fantome')?.04:0)+(has(A.b,'goat')?.04:0)+abS(A.b,'acc')-abS(B.b,'dacc')+(A.rxA||0)+(A.fol||0),.07,.6);
  const lx=att*acc,landed=Math.floor(lx)+(R()<lx%1?1:0);
  const js=sa.j||.5,thr=Math.round(att),jT=Math.round(thr*js),jL=Math.min(landed,Math.round(landed*js*1.15/(js*1.15+(1-js)*.85)));
  A.thr+=thr;A.land+=landed;A.jT=(A.jT||0)+jT;A.jL=(A.jL||0)+jL;A.pT=(A.pT||0)+thr-jT;A.pL=(A.pL||0)+landed-jL;
  const dmg=KOD*landed*(.62+A.pow/95)*(.8+R()*.4)*ef*(sa.body?.8:1)*(1.2-B.chin/220)*(has(A.b,'finisseur')&&B.hp<40?1.25:1)*(.85+(1-js)*.3)*(1+(A.bp||0)*.04)*(has(A.b,'cogneur')?1.08:1)*(has(A.b,'guerrier')&&A.hp<40?1.2:1)*(has(B.b,'acier')?.9:1)*(has(A.b,'canon')&&A.hp>70?1.12:1)*(has(A.b,'marteau')?1.15:1)*(has(A.b,'goat')?1.1:1)*(has(B.b,'immortel')?.85:1)*(has(B.b,'goat')?.9:1)*(1+abS(A.b,'dmg')+(A.hp<40?abS(A.b,'low'):0)+(A.hp>70?abS(A.b,'high'):0)+(B.hp<40?abS(A.b,'fin'):0))*(1-abS(B.b,'dtk'))*(A.rxD||1);
  B.hp-=dmg;
  if(sa.body)B.en-=landed*.25*(has(A.b,'foie')?1.5:1);
  const p=KOP*Math.pow(A.pow/100,2)*.012*(1+(100-Math.max(B.hp,0))/45)*(1.35-B.chin/140)*(sa.body?.7:1)*(has(A.b,'bombe')?1.4:1)*(has(A.b,'uppercut')?1.15:1)*(has(A.b,'marteau')?1.25:1)*(has(B.b,'immortel')?.75:1)*(1+abS(A.b,'kd'))*(1-abS(B.b,'kdt'))*(.8+(1-js)*.4);
  let kd=0,cut=0;
  if(R()<1-Math.pow(1-p,landed)){kd=1;B.hp-=5;if(B.hp<35&&R()<.3){kd=2;B.hp-=5}}
  if(!sa.body&&(B.cut||0)<3&&R()<dmg*.0055*(has(B.b,'verre')?1.3:1)*(has(A.b,'coupeur')?1.6:1)*(1+abS(A.b,'cut'))){B.cut=(B.cut||0)+1;cut=1}
  return{landed,dmg,kd,cut,jL,pL:landed-jL};
}
function aiStrat(me,op,F){
  if(me.hp<35||me.en<25)return'pru';
  if(op.hp<35||op.en<30)return'agr';
  if(F.r>=F.rounds-3){const j=F.cards[0],d=me===F.A?j[0]-j[1]:j[1]-j[0];if(d<0)return'agr'}
  return R()<.65?me.b.style:pick(['agr','eq','pru','corps']);
}
const PN={j:['jab','double jab','jab sec'],p:['crochet du gauche','direct du droit','uppercut','crochet du droit','une-deux'],b:['crochet au foie','uppercut au corps','direct au plexus']};
const CORNER={souffle:{n:'Récupérer',d:'+12 énergie, +3 santé'},coupure:{n:'Soigner la coupure',d:'Le soigneur referme la plaie'},motiver:{n:'Motiver',d:'+précision ce round'},plan:{n:'Ajuster la garde',d:'+défense ce round'}};
const autoCorner=A=>A.cut>=2?'coupure':A.en<65?'souffle':'motiver';
function corner(F){
  const c2=S.staff&&S.staff.coach&&S.staff.coach.stars>=2;
  for(const X of[F.A,F.B]){let c=X===F.A?F.cs:(F.csB||null);
    if(!c||(c==='coupure'&&!X.cut)||(c==='plan'&&!c2))c=autoCorner(X);
    if(has(X.b,'roc'))X.en=cl(X.en+5,0,100);if(has(X.b,'cardio'))X.en=cl(X.en+3,0,100);if(has(X.b,'souffle'))X.hp=cl(X.hp+6,0,100);{const e=abS(X.b,'en'),h=abS(X.b,'hp');if(e)X.en=cl(X.en+e,0,100);if(h)X.hp=cl(X.hp+h,0,100)}
    if(c==='souffle'){X.en=cl(X.en+10,0,100);X.hp=cl(X.hp+2,0,100)}
    else if(c==='coupure'){X.en=cl(X.en+4,0,100);if(R()<.45+.1*(X===F.A?F.cut:1))X.cut--}
    else if(c==='motiver')X.boost=1;
    else if(c==='plan')X.guard=1;
    if(X===F.A)F.lastCs=c}
  F.cs=null;F.csB=null;
}
function stepPhase(F,sa,sb){
  const A=F.A,B=F.B,SA=STRAT[sa],SB=STRAT[sb];A.cnt=(F.ustr||S.set.autoAdv)&&CNT[sb]===sa?1:0;B.cntd=A.cnt;
  if(F.ph===0){if(F.r>0)corner(F);F.r++;F.rd={dA:0,dB:0,kdA:0,kdB:0,lA:0,lB:0,L:[],sa,sb,s0:[A.thr,A.land,B.thr,B.land,A.pL||0,B.pL||0]}}
  const rd=F.rd,p=F.ph,hp0=[A.hp,B.hp],th0=[A.thr,B.thr];rd.sa=sa;rd.sb=sb;
  const ea=exchange(A,B,SA,SB,1/3),eb=exchange(B,A,SB,SA,1/3);
  rd.dA+=ea.dmg;rd.dB+=eb.dmg;rd.lA+=ea.landed;rd.lB+=eb.landed;rd.kdB+=ea.kd;rd.kdA+=eb.kd;A.kd+=eb.kd;B.kd+=ea.kd;
  for(const[X,s]of[[A,SA],[B,SB]])X.en=cl(X.en-12/3*s.dr*(1-abS(X.b,'sta'))*(1-(X.bc||0)*.07)*(1.4-X.sta/110)*(has(X.b,'moteur')?.8:1)*(X.camp==='alt'?.8:1)*(1.06-(X.prep==null?60:X.prep)*.001),0,100);
  const na=sur(A.b),nb=sur(B.b),sec=p*60+ri(4,57),clk=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
  const pn=(s,e)=>e.pL>=e.jL?pick(s.body?PN.b:PN.p):pick(PN.j);
  if(ea.kd)rd.L.push({k:1,t:`${clk} · KNOCKDOWN ! Un ${pn(SA,ea)} de ${na} envoie ${nb} au tapis.`});
  if(eb.kd)rd.L.push({k:1,t:`${clk} · KNOCKDOWN ! ${na} est envoyé au tapis par un ${pn(SB,eb)} de ${nb}.`});
  if(ea.cut)rd.L.push({k:1,t:`${clk} · ${nb} est coupé à l’arcade ! (coupure ${B.cut}/3)`});
  if(eb.cut)rd.L.push({k:1,t:`${clk} · ${na} saigne de l’arcade ! (coupure ${A.cut}/3)`});
  if(!ea.kd&&ea.pL>=3&&R()<.3)rd.L.push({t:`${clk} · Beau ${pick(SA.body?PN.b:PN.p)} de ${na} qui fait reculer ${nb}.`});
  if(!eb.kd&&eb.pL>=3&&R()<.3)rd.L.push({t:`${clk} · ${nb} place un ${pick(SB.body?PN.b:PN.p)} sur ${na}.`});
  const RF=refOf(F),chk=(X,kR,kP,w)=>X.hp<=0?{w,m:'KO'}:kR>=RF.kr?{w,m:'TKO'}:(X.hp<RF.hp&&R()<RF.p)?{w,m:'TKO'}:(kP>=1&&X.hp<RF.kh&&R()<.35)?{w,m:'KO'}:null;
  const stop=B.hp<=A.hp?(chk(B,rd.kdB,ea.kd,'A')||chk(A,rd.kdA,eb.kd,'B')):(chk(A,rd.kdA,eb.kd,'B')||chk(B,rd.kdB,ea.kd,'A'));
  F.ev={p,a:{thr:A.thr-th0[0],land:ea.landed,kd:ea.kd,body:!!SA.body},b:{thr:B.thr-th0[1],land:eb.landed,kd:eb.kd,body:!!SB.body},hp0,hp1:[A.hp,B.hp],stop};
  F.ph++;
  if(stop){
    const W=stop.w==='A'?A:B,Lo=stop.w==='A'?B:A;
    F.done=true;F.res={w:stop.w,m:stop.m,r:F.r,txt:`${W.b.name} gagne par ${stop.m==='KO'?'KO':'arrêt de l’arbitre (TKO)'} à ${clk} du ${ord(F.r)} round`};
    rd.L.push({k:1,t:stop.m==='KO'?`${clk} · ${sur(Lo.b)} ne se relève pas. C’est terminé !`:`${clk} · L’arbitre arrête le combat pour protéger ${sur(Lo.b)}.`});
    F.log.unshift({r:F.r,L:[...rd.L,...roundNotes(F)]});return;
  }
  if(F.ph===3)endRound(F);
}
function roundNotes(F){
  const A=F.A,B=F.B,rd=F.rd,na=sur(A.b),nb=sur(B.b),L=[];
  if(rd.lA>rd.lB*1.4&&rd.lA>6)L.push({t:`${na} domine : ${rd.lA} coups portés contre ${rd.lB}.`});
  else if(rd.lB>rd.lA*1.4&&rd.lB>6)L.push({t:`${nb} prend le dessus : ${rd.lB} coups portés contre ${rd.lA}.`});
  else L.push({t:`Round disputé : ${rd.lA} coups de ${na} contre ${rd.lB} de ${nb}.`});
  if(rd.sa==='corps'&&rd.lA>5)L.push({t:`${na} creuse au corps, ${nb} baisse les coudes.`});
  if(rd.sb==='corps'&&rd.lB>5)L.push({t:`${nb} vise le foie de ${na}.`});
  if(B.hp<40&&B.hp>0)L.push({t:`${nb} est ébranlé, les jambes flanchent.`});
  if(A.hp<40&&A.hp>0)L.push({t:`${na} encaisse lourd, son coin s’inquiète.`});
  for(const X of[A,B]){if(X.en<25)L.push({t:`${sur(X.b)} est à bout de souffle.`});if((X.cut||0)>=2)L.push({k:1,t:`La coupure de ${sur(X.b)} inquiète le médecin.`})}
  return L;
}
// Knockdowns DONNÉS par chaque coin : X.kd compte les fois où X est allé au tapis.
function kdScored(F){return[F.B.kd,F.A.kd]}
function endRound(F){
  const A=F.A,B=F.B,rd=F.rd,s0=rd.s0;
  const la=A.land-s0[1],lb=B.land-s0[3],pa=(A.pL||0)-s0[4],pb=(B.pL||0)-s0[5],base=(la-lb)*1+(pa-pb)*.6+(rd.dA-rd.dB)*.25;
  for(let j=0;j<3;j++){const diff=base+(R()-.5)*3.2;let sA=diff>=0?10:9,sB=diff>=0?9:10;if(Math.abs(diff)<.45&&!rd.kdA&&!rd.kdB){sA=10;sB=10}sA-=rd.kdA;sB-=rd.kdB;if(sA===sB&&rd.kdA!==rd.kdB){if(rd.kdB>rd.kdA)sB--;else sA--}const m=10-Math.max(sA,sB);sA+=m;sB+=m;F.cards[j][0]+=sA;F.cards[j][1]+=sB;if(!j)F.rs.push([sA,sB])}
  F.rst.push({at:A.thr-s0[0],al:A.land-s0[1],bt:B.thr-s0[2],bl:B.land-s0[3],ap:(A.pL||0)-s0[4],bp:(B.pL||0)-s0[5]});
  A.boost=A.guard=B.boost=B.guard=0;
  F.log.unshift({r:F.r,L:[...rd.L,...roundNotes(F)],s:F.rs[F.rs.length-1]});
  F.ph=0;
  for(const[X,w]of[[A,'B'],[B,'A']])if((X.cut||0)>=refOf(F).ct&&R()<refOf(F).cp){const W=w==='A'?A:B;F.done=true;F.res={w,m:'TKO',r:F.r,type:'médical',txt:`${W.b.name} gagne par arrêt médical (coupure de ${sur(X.b)}) après le ${ord(F.r)} round`};F.log[0].L.push({k:1,t:`Le médecin examine la coupure de ${sur(X.b)} et arrête le combat !`});return}
  if(F.r>=F.rounds){
    F.done=true;let a=0,b=0;for(const c of F.cards){if(c[0]>c[1])a++;else if(c[1]>c[0])b++}
    const sc=F.cards.map(c=>`${c[0]}-${c[1]}`).join(', ');
    if(a>=2||b>=2){const w=a>=2?'A':'B',n=Math.max(a,b),o=Math.min(a,b),type=n===3?'unanime':o===1?'partagée':'majoritaire';
      F.res={w,m:'DEC',r:F.r,type,txt:`${(w==='A'?A:B).b.name} gagne par décision ${type} (${sc})`}}
    else F.res={w:null,m:'DEC',r:F.r,type:'nul',txt:`Match nul (${sc})`};
  }else for(const X of[A,B]){X.en=cl(X.en+4+X.sta/25,0,100);X.hp=cl(X.hp+(1+X.chin/45)*(has(X.b,'roc')?1.5:1)+(X===A?F.cut*.6:0)-((X.cut||0)>=2?1.5:0),0,100)}
}
function stepRound(F,sa,sb){do{stepPhase(F,sa,sb)}while(F.ph!==0&&!F.done)}
function cloneF(F){return{...F,ustr:0,A:{...F.A},B:{...F.B},cards:F.cards.map(c=>c.slice()),rs:[],rst:[],log:[],rd:F.rd?{...F.rd,L:[]}:null}}
function oddsRound(F,n){let w=0;for(let i=0;i<n;i++){const G=cloneF(F);let g=0;while(!G.done&&!G.rs.length&&g++<400)stepPhase(G,aiStrat(G.A,G.B,G),bStrat(G));if(G.rs.length){const[a,b]=G.rs[0];w+=a>b?1:a<b?0:.5}else if(G.done)w+=G.res.w==='A'?1:G.res.w?0:.5}const p=Math.round(w/n*100);return{w:p,d:0,l:100-p,rnd:1}}
function oddsFrom(F,n,keep){let w=0,d=0;for(let i=0;i<n;i++){const G=cloneF(F);if(!F.r&&!keep){rollForm(G.A);rollForm(G.B)}while(!G.done)stepPhase(G,aiStrat(G.A,G.B,G),bStrat(G));if(!G.res.w)d++;else if(G.res.w==='A')w++}return{w:Math.round(w/n*100),d:Math.round(d/n*100),l:Math.round((n-w-d)/n*100)}}
const GP={pression:{n:'Pression',d:'Avancer et couper le ring.',beats:'pru'},contre:{n:'Contre-attaque',d:'Laisser venir et punir ses entrées.',beats:'agr'},corps:{n:'Travail au corps',d:'User l’adversaire pour le ralentir.',beats:'eq'},distance:{n:'Boxe à distance',d:'Jab, mobilité, le garder loin.',beats:'corps'}};
const bestGP=st=>Object.keys(GP).find(k=>GP[k].beats===st);
const CINT={recup:{n:'Récupération',m:.35,plan:'leger',fat:-14,d:'Récupère la forme, prépare peu.'},leger:{n:'Léger',m:.75,plan:'leger',fat:-4,d:'Préparation lente, il arrive frais.'},normal:{n:'Normal',m:1,plan:'normal',fat:5,d:'Bon équilibre préparation et fatigue.'},intense:{n:'Intense',m:1.35,plan:'intense',fat:12,d:'Prépare vite, mais fatigue et blessures.'}};
const STYD={agr:'Il avance et cherche le KO.',eq:'Boxeur complet, sans grosse faiblesse.',pru:'Il recule, garde haute, et contre.',corps:'Il travaille au corps pour user ses adversaires.'};
function applyCamp(F,f){F.A.camp=f.camp||'';F.A.prep=f.prep??10;F.A.gpb=f.gp&&GP[f.gp]&&GP[f.gp].beats===F.B.b.style?1:0;const bo=f.bon||{};F.A.bc=Math.min(3,bo.car||0);F.A.bs=Math.min(3,bo.spa||0);F.A.bt=Math.min(3,bo.tec||0);F.A.bp=Math.min(3,bo.pow||0);F.A.vid=(S.fac&&S.fac.video)||0}
function weighIn(f,a){if(f.wi)return f.wi;const d=DIVS.find(x=>x.id===a.div)||{},L=parseFloat(d.kg);
  if(String(d.kg).startsWith('+')||!L){f.wi={ok:true,txt:'Poids lourd : pas de limite.'};return f.wi}
  const prep=f.prep??10,fr=x=>x.toFixed(1).replace('.',',');
  if(R()<Math.max(0,(40-prep)/55)+(a.fatigue>75?.08:0)){const kg=fr(L+.3+R()*1.2);f.wi={ok:false,txt:`${kg} kg pour une limite de ${L} kg. Amende : 20 % de la bourse.`};a.morale=cl(a.morale-8,0,100);log(`${a.name} rate le poids (${kg} kg). Amende de 20 % de la bourse.`,'bad')}
  else f.wi={ok:true,txt:`${fr(L-.1-R()*.8)} kg pour une limite de ${L} kg.`};
  return f.wi}
function postpone(fid){const f=S.fights.find(x=>x.id===fid);if(!f||(f.post||0)>=2)return;f.week+=3;f.post=(f.post||0)+1;f.purse=Math.round(f.purse*.9/100)*100;f.wi=null;log(`Combat de ${getB(f.a).name} reporté au ${when(f.week)} (bourse −10 %).`);toast('Combat reporté de 3 semaines')}
function cancelFight(fid){const f=S.fights.find(x=>x.id===fid);if(!f)return;const a=getB(f.a),b=getB(f.b);S.fights=S.fights.filter(x=>x!==f);S.queue=S.queue.filter(x=>x!==fid);if(a){a.booked=false;a.fame=cl(a.fame-3,1,100);a.morale=cl(a.morale-5,0,100)}if(b)b.booked=false;log(`Tu annules le combat de ${a?a.name:'?'}. Notoriété −3.`,'bad');toast('Combat annulé');ui.sheet=null}
function crOf(b){if(!b.cr){const bl=S.belts?beltsOf(b):[],byB={};for(const k of bl)byB[k]=1;const ch=bl.length>0;
  const tw=Math.max(b.tw||0,bl.length);b.cr={tw,byB,def:ch&&!b.mine?ri(0,Math.min(5,Math.floor(b.w/7))):0,und:bl.length&&isUndisp(b)?1:0,cw:ch?(b.mine?8*bl.length:ri(4,40)):0,wc:tw,divs:ch||b.tw?[b.div]:[],st:b.l===0?b.w:Math.round(b.w/(b.l+1)),cs:b.l===0?b.w:0,nt:b.nchamp?1:0,aw:0}}return b.cr}
function goat(b){const c=crOf(b);return Math.max(0,Math.round(b.w*3+b.ko*2-b.l+c.tw*40+c.def*25+c.und*200+c.cw*1.5+c.wc*30+Math.max(0,c.divs.length-1)*150+(b.troph||[]).length*35+c.aw*60+c.nt*15+c.st*4+Math.max(0,Math.max(b.ovrMax||0,ovr(b))-75)*6))}
const GTIER=[[150,'Espoir'],[400,'Prétendant'],[800,'Élite'],[1500,'Légende'],[2500,'Hall of Fame'],[1e9,'GOAT']];
const gTier=g=>GTIER.find(t=>g<t[0])[1];
function goatBoard(){const L=S.boxers.filter(b=>!b.retired).map(b=>({b,g:goat(b)}));for(const h of(S.hof||[]))L.push({h,g:h.g||0});return L.sort((x,y)=>y.g-x.g)}
const goatRank=b=>goatBoard().findIndex(x=>x.b===b)+1;
function crFight(W,L,Lch,title,st,lb,Wb0,wasU){const c=crOf(W);if(Lch)c.wc++;c.cs++;c.st=Math.max(c.st,c.cs);crOf(L).cs=0;
  if(!title)return;if(lb.length){c.tw+=lb.length;for(const k of lb)c.byB[k]=(c.byB[k]||0)+1;if(!c.divs.includes(W.div))c.divs.push(W.div)}
  if(Wb0.some(k=>st.includes(k)))c.def++;
  if(isUndisp(W)&&!wasU){c.und++;if(W.mine)toast(`👑 ${sur(W)} UNDISPUTED !`)}}
function wallPanel(b){const c=crOf(b),g=goat(b),r=goatRank(b),bl=beltsOf(b);
  const T=[[c.tw,'Titres mondiaux',c.tw],[c.def,'Défenses',c.def>=3],[c.cw,'Semaines champion',c.cw>=26],[c.wc,'Victoires vs champions',c.wc],[c.divs.length,'Divisions titrées',c.divs.length>1],[c.st,'Meilleure série',c.st>=10],[b.ko,'KO',b.ko>=20],[c.nt,'Titres nationaux',c.nt],[(b.troph||[]).length,'Tournois',(b.troph||[]).length],[c.aw,'Récompenses',c.aw],[Math.max(b.ovrMax||0,ovr(b)),'Note maximale',Math.max(b.ovrMax||0,ovr(b))>=90],[`${b.w}-${b.l}-${b.d}`,'Fiche',0]];
  return`<div class="panel"><div class="ph"><span class="lab">Mur des succès</span>${c.und?`<span class="undis">👑 UNDISPUTED ×${c.und}</span>`:''}</div>
  <div class="goat" style="margin-top:6px"><div class="gp num">${g}</div><div><div class="gt">${gTier(g)}</div><div class="small">Points GOAT · <b>#${r}</b> de tous les temps</div></div></div>
  <div class="shelf">${BELTS.map(k=>{const n=c.byB[k]||0,h=bl.includes(k);return`<div class="${h?'held':n?'':'off'}">${beltSvg(k,54)}<b>×${n}</b><small>${h?'détenue':n?'gagnée':'jamais'}</small></div>`}).join('')}</div>
  <div class="wall">${T.map(([v,l,hot])=>`<div class="${hot?'hot':''}"><b class="num">${v}</b><small>${l}</small></div>`).join('')}</div>
  ${(b.troph||[]).length?`<p class="small" style="margin:8px 0 0">🏆 ${b.troph.map(t=>esc(t.n)).join(' · ')}</p>`:''}
  <p class="small" style="margin:8px 0 0">Points GOAT : victoires, KO, titres, défenses, undisputed (+200), victoires contre des champions, titres dans plusieurs divisions, tournois et récompenses.</p></div>`}
function applyResult(F,f){
  const A=F.A.b,B=F.B.b,res=F.res,title=F.title,f0A=fol(A),f0B=fol(B);crOf(A);crOf(B);
  for(const X of[A,B]){X.booked=false;X.lastFight=S.t;X.fatigue=cl(X.fatigue+30,0,100)}
  let W=null,L=null,stop=res.m!=='DEC';
  if(!res.w){A.d++;B.d++;A.pts+=5;B.pts+=5;addFol(A,fol(A)*.01);addFol(B,fol(B)*.01)}
  else{
    W=res.w==='A'?A:B;L=res.w==='A'?B:A;
    W.w++;L.l++;if(stop)W.ko++;
    W.pts+=Math.round(18+Math.max(0,L.pts-W.pts)*.25+(stop?4:0));
    L.pts=Math.max(0,Math.round(L.pts-(10+Math.max(0,L.pts-W.pts)*.15)));
    W.fame=cl(W.fame+(2+L.fame*.08+(stop?1:0)+(title?12:0))*(has(W,'showman')?1.5:1),1,100);L.fame=cl(L.fame-1.5,1,100);
    W.morale=cl(W.morale+15,0,100);L.morale=cl(L.morale-15,0,100);
    addFol(W,f0A===undefined?0:fol(W)*(.025+(stop?.02:0)+(title?.08:0))+fol(L)*.03+40);addFol(L,-fol(L)*.02);
    if(S.lineal&&S.lineal[L.div]===L.id&&W.div===L.div){S.lineal[L.div]=W.id;if(W.mine||L.mine)log(`💎 ${W.name} devient champion linéal ${divN(W.div)} !`,'gold')}
    {const Lch=L.champ,Wb0=beltsOf(W),wasU=isUndisp(W),st=Array.isArray(title)?title:BELTS,lb=title?transferBelts(W,L,st,stop):[];crFight(W,L,Lch,title,st,lb,Wb0,wasU)}
    if(F.ntitle&&L.nchamp&&W.nat===L.nat){L.nchamp=false;W.nchamp=true;crOf(W).nt++;if(W.mine){log(`${flag(W.nat)} ${W.name} est champion national ${NAT[W.nat].n} !`,'gold');toast(`${flag(W.nat)} ${sur(W)} champion national !`)}}
    if(stop&&R()<.6*(has(L,'fragile')?1.3:1)*(L.age>=33?1+(L.age-32)*.08:1)){L.inj=Math.max(1,ri(3,7)-(L.mine?((S.fac&&S.fac.med)||0):0));if(R()<.08){L.inj=ri(12,26);L.longI=pick(LONGI);L.comeback=1;if(L.mine||W.mine)log(`🚑 ${L.name} : ${L.longI}. Absent ${L.inj} semaines.`,'bad')}}
    if(W.comeback&&!W.inj){W.comeback=0;addFol(W,fol(W)*.08);W.fame=cl(W.fame+5,1,100);if(W.mine){log(`🔥 Le retour de ${W.name} ! Victoire après sa blessure : +8 % d’abonnés.`,'gold');toast(`🔥 Le retour de ${sur(W)} !`)}}
  }
  for(const[X,fx]of[[A,F.A],[B,F.B]])if(fx.hp<30&&!X.inj&&R()<.3)X.inj=ri(1,3);
  for(const[X,Y]of[[A,B],[B,A]])if(!X.mine){X.hist=X.hist||[];X.hist.unshift({t:S.t,opp:Y.name,res:!res.w?'N':(W===X?'V':'D'),m:res.m,r:res.r,title});if(X.hist.length>5)X.hist.length=5}
  if(!f&&res.w&&S.promos){const pw=prOf(W),pl=prOf(L),pu=purse(W,L,title);let g=0;if(pw&&pw.own)g+=pu*.15;if(pl&&pl.own)g+=pu*.07;if(g){S.money+=Math.round(g);S.fin&&(S.fin.pro=(S.fin.pro||0)+Math.round(g))}}
  for(const X of[A,B])if(X.mine&&!X.brand&&S.rec){const r=!res.w?'d':(W===X?'w':'l');S.rec[r]++;if(r==='w'&&stop)S.rec.ko++}
  if(W&&W.mine&&W.spons){if(W.spons.gk==='wins'||(W.spons.gk==='kos'&&stop))W.spons.prog=(W.spons.prog||0)+1}
  {const pu=purse(A,B,title);const big=pu>=purse(B,A,title)?A:B;recHit('purse',Math.max(pu,purse(B,A,title)),big)}
  if(res.w!==undefined&&(A.mine||B.mine)&&!(A.mine&&B.mine)){const me=A.mine?A:B,op=me===A?B:A,r=!res.w?'d':(W===me?'w':'l');h2hAdd(op,r)}
  if(f&&f.ss&&S.ss){const Wn=W||(ovr(A)>=ovr(B)?A:B);ssRecord(f.ss.k,f.ss.i,Wn.id)}
  if(f){
    const me=A.mine?A:B,op=me===A?B:A,won=W===me;
    const share=f.own?0:Math.round(f.purse*SHARE*(won?1.25:1)*(1+.08*S.mgr.perks.neg)*(f.wi&&!f.wi.ok?.8:1));
    S.money+=share;
    const MF=me===A?F.A:F.B,OF=me===A?F.B:F.A;me.hist.unshift({t:S.t,opp:op.name,res:res.w?(won?'V':'D'):'N',m:res.m,r:res.r,title,cb:[MF.land,MF.thr,OF.land,OF.thr]});
    for(const key in (S.mand||{}))if(S.mand[key].ch===me.id&&S.mand[key].op===op.id)delete S.mand[key];
    if(f.bet)settleBet(f,won,!res.w);if(f.cvc&&S.cvc&&S.cvc.fids.includes(f.id))S.cvc.res.push(won);if(f.mand&&won)me.lastMand=S.t;
    if(won&&me.rival===op.id){me.rival=null;addXP(me,60);me.fame=cl(me.fame+4,1,100);me.morale=cl(me.morale+10,0,100);log(`Revanche prise ! ${me.name} règle ses comptes avec ${op.name}.`,'gold');toast('Revanche prise !')}
    else if(!won||res.type==='partagée'){if(me.rival!==op.id)log(`${op.name} devient le rival de ${me.name}. Une revanche paierait 50 % de plus.`);me.rival=op.id}
    if(won){me.yw=(me.yw||0)+1;if(stop)me.yko=(me.yko||0)+1;me.ovrMax=Math.max(me.ovrMax||0,ovr(me))}
    if(f.press==='ko'){if(won&&stop){me.fame=cl(me.fame+6,1,100);log(`Promesse tenue ! ${me.name} avait annoncé un KO. +6 popularité.`,'gold')}else{me.fame=cl(me.fame-4,1,100);me.morale=cl(me.morale-8,0,100);log(`${me.name} avait promis un KO… les médias se moquent. −4 popularité.`,'bad')}}
    me.loy=cl(me.loy+(won?5:res.w?-3*(has(me,'diva')?2:1)*(has(me,'fidele')?.5:1):0),0,100);
    const q=cl(1+(ovr(op)-ovr(me))*.05,.3,1.6),xp=Math.round((30+(won?40:0)+(won&&stop?15:0)+(won&&title?120:0)+(won&&F.ntitle?60:0))*q);
    addXP(me,xp);recordStats(me,F,won,true);
    if(won){S.stats.wins++;if(stop)S.stats.kos++;if(title)S.stats.titles++;mcAdd('wins');if(stop)mcAdd('kos');if(title||F.ntitle)mcAdd('titles')}
    mgrXP((won?40:10)+(won&&stop?15:0)+(won&&title?150:0));
    log(`${res.txt}.${title?' Combat de championnat.':''} ${f.own?'Combat de ton gala.':'Part du club : '+$(share)+'.'} ${(()=>{const g=fol(me)-(me===A?f0A:f0B);return(g>=0?'+':'−')+fmtK(Math.abs(g))+' abonnés.'})()} +${xp} XP pour ${me.name}.${me.inj?` Blessé ${me.inj} sem.`:''}`,won?'good':res.w?'bad':'');
  }
}
function quickFight(a,b,title,nt){
  const F=newFight(a,b,title?12:10,title);F.ntitle=!!nt;
  while(!F.done)stepRound(F,aiStrat(F.A,F.B,F),aiStrat(F.B,F.A,F));
  applyResult(F,null);
}
function aiWeek(){
  for(const d of DIVS){
    for(let k=0;k<4;k++){
      if(R()>.42)continue;
      const list=rankList(d.id).filter(b=>(!b.mine||(b.brand&&(prOf(b)||{}).auto&&!upF(b)))&&!b.booked&&!b.inj&&S.t-b.lastFight>=6);
      if(list.length<2)continue;
      const i=ri(0,list.length-2),A=list[i];let j=Math.min(list.length-1,i+ri(1,3));
      if(A.l===0&&A.age<=28&&R()<.85){const soft=list.slice(i+1).filter(o=>ovr(o)<=ovr(A)-7&&!(o.l===0&&o.age<=28));if(soft.length)j=list.indexOf(soft[ri(0,Math.min(4,soft.length-1))])}
      const Bj=list[j];if(Bj.l===0&&Bj.age<=28&&ovr(A)>ovr(Bj)-7&&R()<.85)continue;
      quickFight(A,Bj,false);
    }
    const B=S.belts[d.id]||{};
    for(const k of BELTS){const h=getB(B[k]);if(!h||h.mine||h.booked||h.inj||S.t-h.lastFight<12||R()>.08)continue;
      const uni=R()<.05,ch=bodyList(d.id,k).filter(b=>!b.mine&&!b.booked&&!b.inj&&b!==h&&(uni?b.champ:!b.champ)).slice(0,4);if(!ch.length)continue;const c=pick(ch);
      quickFight(h,c,[...new Set([...beltsOf(h),...beltsOf(c)])])}
    for(const c of champsOf(d.id))if(c.mine&&!c.booked&&S.t-c.lastFight>26){const bl=beltsOf(c);for(const k of bl)B[k]=null;log(`${c.name} est déchu de ${bl.join(', ')} : aucune défense depuis 26 semaines.`,'bad');ensureBelts(d.id)}
  }
}
function newYear(){
  for(const b of S.boxers){
    if(b.retired)continue;b.age++;const s0={};for(const[k]of STATS)s0[k]=b[k];
    if(b.age>=32){const k=(b.age-31)*.9*(b.age>=35?1.4:1)*(b.oldPush?1.3:1)*(has(b,'bosseur')?.85:1);b.spd=cl(b.spd-k*(.5+R()*1.5),1,99);b.sta=cl(b.sta-k*(.5+R()*1.5),1,99);b.chin=cl(b.chin-k*(.3+R()*1.2),1,99);b.pow=cl(b.pow-k*R()*.8,1,99);if(b.age>=34)b.def=cl(b.def-k*R()*.6,1,99)}
    else if(b.age>=27)b.def=cl(b.def+R()*1.4,1,Math.min(99,capOf(b)));
    if(b.mine&&b.age<=21)for(const s of['pow','spd','sta','chin'])b[s]=cl(b[s]+R()*1.6,1,Math.min(99,capOf(b)));
    if(!b.mine&&!b.booked&&b.age<29){const g=Math.min(b.pot-ovr(b),ri(1,5));if(g>0)for(const s of['pow','spd','def','sta'])b[s]=cl(b[s]+g*(.6+R()*.8),1,99)}
    if(b.mine){const d={};for(const[k]of STATS)d[k]=Math.round((b[k]-s0[k])*10)/10;b.agel={a:b.age,d};const tx=Object.entries(d).filter(([,v])=>Math.abs(v)>=.5).map(([k,v])=>`${(STATS.find(s=>s[0]===k)||[,k])[1]} ${v>0?'+':'−'}${Math.abs(v).toFixed(0)}`).join(', ');
      if(tx||[22,27,32,35].includes(b.age))(S.ageL=S.ageL||[]).push(`🎂 <b>${esc(b.name)}</b> a ${b.age} ans · ${agePh(b)[1]}${tx?' : '+tx:''}${b.age===32?' · début du déclin':b.age===35?' · déclin accéléré':''}${b.age===RET_AGE-1?' · dernière saison !':''}`)}
    if(!b.booked&&((!b.mine&&b.age>=34&&R()<(b.age-33)*.22)||(b.mine&&b.age>=RET_AGE))){
      b.retired=true;if(b.mine){hofAdd(b);for(const k of beltsOf(b))S.belts[b.div][k]=null}if(b.mine)log(`${b.name} prend sa retraite à ${b.age} ans. Fiche finale : ${b.w}-${b.l}-${b.d}.`);
      if(b.champ)log(`${b.name} prend sa retraite : ${beltsOf(b).join(', ')} vacant.`)
    }
  }
  S.boxers=S.boxers.filter(b=>!b.retired);
  for(const d of DIVS){
    const n=S.boxers.filter(b=>b.div===d.id&&!b.mine).length;
    for(let i=n;i<64;i++){const nb=makeBoxer({div:d.id,ovr:ri(46,62),age:ri(19,23),pot:ri(6,24)});seedRecord(nb);nb.pts=Math.round(nb.pts*.5);S.boxers.push(nb)}
    for(let i=0,c=n;i<4&&c<78;i++,c++){const nb=makeBoxer({div:d.id,ovr:ri(44,56),age:ri(18,21),pot:ri(18,38)});seedRecord(nb);nb.pts=Math.round(nb.pts*.3);nb.fame=cl(Math.round(nb.fame*.5),1,100);S.boxers.push(nb);prOf(nb)}
    ensureBelts(d.id);
  }
  log(`Début de l’an ${Math.floor((S.t-1)/52)+1}. Tout le monde prend un an.`);
}
function nextWeek(quiet){
  if(S.event){renderEvent();return}
  if(S.queue.length){openFight(S.queue[0]);return}
  if(S.neg){renderNeg();return}
  {const ex=mine().find(b=>b.contract<=1);if(ex){openNeg(ex.id,true);return}}
  S.t++;ui.oc={};
  for(const b of mine()){train(b);inactivityTick(b);if(b.age>=32)b.fatigue=cl(b.fatigue+(b.age-31)*.6,0,100);weeklyLoyalty(b);folWeek(b)}
  for(const b of S.boxers)if(!b.mine){if(b.inj>0)b.inj--;b.fatigue=cl(b.fatigue-10,5,100)}
  const g=1-.07*S.mgr.perks.ges;
  const sal=Math.round((mine().reduce((s,b)=>s+b.salary,0)+staffSalary())*g),upk=Math.round((150*S.gym+facLv()*90+(S.branches||[]).length*300)*g),spo=mine().reduce((s,b)=>s+Math.round(b.fame*8),0)+brIncome()+merchInc()+(S.arena?ARENA_LV[S.arena].inc:0);
  S.money+=spo-sal-upk;S.fin={spo,sal,upk};
  for(const b of mine()){
    if(b.spDue&&S.t>b.spDue){if(b.lastFight<b.spFrom){S.money-=8000;log(`${b.name} ne s’est pas battu à temps : pénalité de 8 000 $ du commanditaire.`,'bad')}b.spDue=0}
    if(b.brand)continue;
    b.contract--;
    if(b.booked)continue;
    if(b.loy<=5)leave(b,'il ne fait plus confiance au club');
    else if(b.contract<=0)leave(b,'fin de contrat');
  }
  aiWeek();aiNational();offersWeek();promoWeek();ensureAllNat();amWeekTick();syncPerks();gymInit();ssWeek();if(!S.event&&S.ss&&(S.ss.inv||[]).length){const id=S.ss.inv.find(x=>getB(x));if(id)S.event={k:'ssinv',b:id};else S.ss.inv=[]}sponsWeek();interimWeek();mandWeek();rivalWeek();careerEvents();acadWeek();tvWeek();for(const d in(S.belts||{}))for(const c of champsOf(d))crOf(c).cw++;
  if((S.t-1)%52===0&&S.t>1){awards();S.ageL=[];newYear();amNewYear();ensureAllNat();if(S.ageL.length){if(S.notice)S.notice.lines.push('<b>Anniversaires</b>',...S.ageL);else S.notice={t:'Anniversaires',lines:S.ageL}}S.ageL=null}
  rivalsWeek();
  if(S.t%4===0){S.fa=genFA();S.market=genStaff();for(let i=0;i<((S.fac&&S.fac.acad)||0);i++){const p=makeBoxer({div:pick(DIVS).id,nat:S.home,ovr:ri(38,45),age:ri(17,19),pot:ri(28,40)+5*S.fac.acad});seedRecord(p);p.pts=0;p.fame=1;p.salary=marketSal(p);p.fa=true;p.acad=1;S.fa.unshift(p)}}
  if(!S.ctr||S.t>S.ctr.until)newContracts();
  for(const f of S.fights.filter(f=>f.week===S.t)){
    const a=getB(f.a),b=getB(f.b);
    if(!a||!b||a.inj||b.inj||!a.mine){
      S.fights=S.fights.filter(x=>x!==f);if(a){a.booked=false;a.morale=cl(a.morale-10,0,100);a.fame=cl(a.fame-3,1,100)}if(b)b.booked=false;
      log(`Combat annulé : ${a?a.name:'?'} contre ${b?b.name:'?'}${a&&a.inj?' (blessure)':''}.`,'bad');
    }else S.queue.push(f.id);
  }
  for(const g of (S.galas||[]))if(!g.done&&g.week===S.t)galaNight(g);
  maybeEvent();
  if(!S.event){const f=S.fights.find(x=>x.week===S.t+1&&!x.press&&(x.title||x.ntitle||x.ev||(getB(x.a)&&getB(x.a).rival===x.b)));if(f)S.event={k:'press',b:f.a}}ui.confirm=null;if(quiet)return;save();render();
  if(S.queue.length&&!S.event)openFight(S.queue[0]);
}

/* ================= ACTIONS ================= */
function roundsFor(a,b,title){return title?12:(rankIdx(a)<15&&rankIdx(b)<15)?10:8}
/* bourses réalistes : selon le rang, les ceintures et la popularité (vedette = gros chèque) */
function drawOf(b){const r=rankIdx(b),bl=beltsOf(b).length;let v=b.champ?700000*(1+.5*(bl-1))*(isUndisp(b)?1.5:1):r<5?220000:r<15?70000:r<30?22000:r<50?9000:ovr(b)<50?3500:5000;
  return v+Math.min(12e6,fol(b)*.05)+(b.nchamp?10000:0)}
// Règle n° 8 (Max, 2026-11-05) : la crédibilité (notoriété) du boxeur pèse sur sa bourse ;
// rester actif la fait monter (règle n° 10).
const credF=b=>.85+cl(b.fame||1,1,100)/100*.6;
function purse(a,b,title){return Math.max(1500,Math.round((drawOf(a)*.65+drawOf(b)*.35)*credF(a)*(title?1.35:1)*(a.rival===b.id?1.5:1)/100)*100)}
const myShare=p=>Math.round(p*SHARE*(1+.08*S.mgr.perks.neg));
function canBook(me,op){
  if(me.inj)return'Ton boxeur est blessé';
  if(me.booked)return'Ton boxeur a déjà un combat';
  if(op.booked)return'Déjà engagé';
  if(op.inj)return'Blessé';
  const rm=rankIdx(me),ro=rankIdx(op);
  if(op.champ)return titleOpts(me,op).length?null:'Champion : top 10 requis';
  if(ro<15&&ro<rm-6)return'Trop haut classé';
  return null;
}
/* ================= v30 ================= */
/* fiche du club depuis la fondation */
function recInit(){if(!S.rec||!S.recV){S.rec={w:0,l:0,d:0,ko:0};S.recV=2}}
const recTxt=()=>{const r=S.rec||{w:0,l:0,d:0,ko:0};return`${r.w}-${r.l}-${r.d} (${r.ko} KO)`};
/* #14 livre pour livre */
function p4pScore(b){return ovr(b)*1.5+beltsOf(b).length*4+(isUndisp(b)?8:0)+(S.lineal&&isLineal(b)?4:0)+(b.l===0&&b.w>=10?4:0)+Math.min(8,crOf(b).wc*2)+Math.min(6,multiDiv(b)*2)}
// B6 : la colonne P4P montre le score de tri (avant : la note, d'où l'ordre « faux »).
function p4pShown(x){return Math.round(x.s)}
function p4pList(){return S.boxers.filter(b=>!b.retired&&(b.champ||rankIdx(b)<15)).map(b=>({b,s:p4pScore(b)})).sort((x,y)=>y.s-x.s).slice(0,25)}
/* #15 records */
function recHit(k,v,b,extra){S.records=S.records||{};const r=S.records[k];if(!r||(k==='young'?v<r.v:v>r.v))S.records[k]={v,nm:b.name,nat:b.nat,mine:!!b.mine,id:b.id,t:S.t,...(extra||{})}}
function recordsList(){const all=S.boxers.filter(b=>!b.retired),H=S.hof||[],best=(f,lab,fmt)=>{let bb=null,bv=-1;for(const b of all){const v=f(b);if(v>bv){bv=v;bb=b}}for(const h of H){const v=f.h?f.h(h):-1;if(v>bv){bv=v;bb={name:h.nm,nat:h.nat,hof:1}}}return{lab,v:bv,b:bb,fmt}};
  const cw=b=>crOf(b).cw;cw.h=h=>h.cw||0;const df=b=>crOf(b).def;df.h=h=>h.def||0;const ko=b=>b.ko;ko.h=h=>h.ko||0;const st=b=>crOf(b).st;st.h=h=>h.st||0;const tw=b=>crOf(b).tw;tw.h=h=>h.tw||0;const fo=b=>fol(b);fo.h=h=>h.fol||0;const om=b=>Math.max(b.ovrMax||0,ovr(b));om.h=h=>h.best||0;const gt=b=>goat(b);gt.h=h=>h.g||0;
  const L=[best(cw,'Plus long règne',v=>v+' semaine'+(v>1?'s':'')),best(df,'Plus de défenses de titre',v=>v+' défense'+(v>1?'s':'')),best(tw,'Plus de titres mondiaux',v=>v+' titre'+(v>1?'s':'')),best(ko,'Plus de KO',v=>v+' KO'),best(st,'Plus longue série de victoires',v=>v+' victoire'+(v>1?'s':'')),best(fo,'Plus d’abonnés',v=>fmtK(v)),best(om,'Meilleure note atteinte',v=>v),best(gt,'Plus de points GOAT',v=>v)];
  const R=S.records||{};if(R.young)L.push({lab:'Plus jeune champion du monde',v:R.young.v,b:{name:R.young.nm,nat:R.young.nat,mine:R.young.mine},fmt:v=>v+' ans'});if(R.old)L.push({lab:'Plus vieux champion du monde',v:R.old.v,b:{name:R.old.nm,nat:R.old.nat,mine:R.old.mine},fmt:v=>v+' ans'});if(R.purse)L.push({lab:'Plus grosse bourse',v:R.purse.v,b:{name:R.purse.nm,nat:R.purse.nat,mine:R.purse.mine},fmt:v=>moneyS(v)});return L}
/* #16 commanditaires personnels */
const BRANDS=[['Volt','boisson énergisante'],['Kodiak','vêtements de sport'],['Atlas','montres'],['Vortex','équipement de boxe'],['Nordik','eau minérale'],['Titan Auto','concessionnaire auto'],['Pixel Arena','jeux vidéo'],['MaplePay','paiement mobile'],['Ironclad','suppléments'],['Lumen','téléphones']];
const SGOAL={wins:{n:g=>`Gagner ${g} combat${g>1?'s':''}`},kos:{n:g=>`Gagner ${g} combat${g>1?'s':''} par KO`},keep:{n:()=>'Garder toutes ses ceintures'},fol:{n:g=>`Gagner ${fmtK(g)} abonnés`}};
function sponsWeek(){S.sOff=(S.sOff||[]).filter(o=>o.exp>=S.t&&getB(o.b)&&getB(o.b).mine&&!getB(o.b).spons);
  for(const b of club()){if(b.spons){b.sTaken=(b.sTaken||0)+1;const c=b.spons;S.money+=c.pay;
      if(S.t>=c.until){const ok=sponsDone(b);if(ok){S.money+=c.bonus;b.morale=cl(b.morale+5,0,100);log(`🤝 ${c.brand} : objectif réussi par ${b.name} ! Bonus ${$(c.bonus)}.`,'gold');toast(`🤝 Bonus ${c.brand} : +${moneyS(c.bonus)}`)}else{b.fame=cl(b.fame-2,1,100);log(`🤝 ${c.brand} ne renouvelle pas ${b.name} : objectif raté.`,'bad')}b.spons=null}continue}
    if(S.sOff.length>=2||S.sOff.some(o=>o.b===b.id)||R()>.01+Math.min(.05,fol(b)/2e8)+beltsOf(b).length*.01)continue;
    const[br,cat]=pick(BRANDS),{pay,bonus,weeks}=sponsorTerms({fol:fol(b),fame:b.fame,belts:beltsOf(b).length}),gk=beltsOf(b).length&&R()<.4?'keep':R()<.25?'kos':R()<.3?'fol':'wins';
    const g=gk==='wins'?ri(2,3):gk==='kos'?ri(1,2):gk==='fol'?Math.max(1000,Math.round(fol(b)*.15/1000)*1000):0;
    S.sOff.push({id:'so'+(S.uid++),b:b.id,brand:br,cat,pay,weeks,gk,g,bonus,exp:S.t+3})}}
// B5 : un sponsor aide sans effacer la gestion. Paiement selon la crédibilité
// (abonnés, notoriété, ceintures), bonus de résultat limité à 4 semaines de paiement.
function sponsorTerms({fol=0,fame=1,belts=0}){const pay=Math.min(6000,Math.round((250+fol*.0012+belts*700+fame*15)/50)*50);return{pay,bonus:pay*4,weeks:26}}
function sponsDone(b){const c=b.spons;if(!c)return false;return c.gk==='keep'?beltsOf(b).length>=c.base:c.gk==='fol'?fol(b)-c.base>=c.g:(c.prog||0)>=c.g}
function sponsAccept(id){const o=(S.sOff||[]).find(x=>x.id===id),b=o&&getB(o.b);if(!b)return;S.sOff=S.sOff.filter(x=>x!==o);b.spons={brand:o.brand,cat:o.cat,pay:o.pay,gk:o.gk,g:o.g,bonus:o.bonus,until:S.t+o.weeks,prog:0,base:o.gk==='keep'?beltsOf(b).length:o.gk==='fol'?fol(b):0};addFol(b,fol(b)*.02);log(`🤝 ${b.name} signe avec ${o.brand} (${o.cat}) : ${$(o.pay)}/sem. pendant ${o.weeks} sem.`,'good');toast(`🤝 ${sur(b)} × ${o.brand}`)}
function sponsPanel(b){const c=b.spons;if(!c)return'';const p=c.gk==='keep'?(beltsOf(b).length>=c.base?1:0):c.gk==='fol'?Math.max(0,fol(b)-c.base):(c.prog||0),g=c.gk==='keep'?1:c.g;
  return`<div class="panel"><div class="ph"><span class="lab">🤝 Commanditaire · ${esc(c.brand)}</span><b>${moneyS(c.pay)}/sem.</b></div><p class="small" style="margin:0 0 6px">${esc(c.cat)} · objectif : <b>${SGOAL[c.gk].n(c.g)}</b> d’ici ${when(c.until)} · bonus ${moneyS(c.bonus)}</p><div class="trk gold"><i style="width:${Math.min(100,p/Math.max(1,g)*100)}%"></i></div><span class="small">${c.gk==='keep'?(p?'Ceintures conservées pour l’instant':'Ceinture perdue'):c.gk==='fol'?`${fmtK(p)} / ${fmtK(g)}`:`${p}/${g}`}</span></div>`}
/* avertissements avant d'avancer */
function preChecks(){const L=[],up=S.fights.filter(f=>{const a=getB(f.a);return a&&a.mine&&f.week-S.t<=2});
  for(const f of up){const a=getB(f.a);if(!f.gp)L.push({ic:'📋',t:`${esc(sur(a))} combat ${f.week===S.t?'cette semaine':'dans '+(f.week-S.t)+' sem.'} sans plan de match`,a:`data-a="opencamp" data-id="${f.id}"`});if(a.inj)L.push({ic:'🩹',t:`${esc(sur(a))} est blessé avant son combat`,a:`data-a="opencamp" data-id="${f.id}"`});if((f.prep??10)<35&&f.week-S.t<=1)L.push({ic:'⚠️',t:`${esc(sur(a))} n’est préparé qu’à ${f.prep??10} %`,a:`data-a="opencamp" data-id="${f.id}"`})}
  for(const b of club())if(b.contract<=2&&!b.brand)L.push({ic:'📝',t:`Contrat de ${esc(sur(b))} : ${b.contract} sem.`,a:`data-a="neg" data-id="${b.id}"`});
  if(S.ss&&(S.ss.inv||[]).length)L.push({ic:'📩',t:'Invitation à la Super Série sans réponse',a:`data-a="tab" data-k="defis"`});
  if(S.cvc&&!S.cvc.acc)L.push({ic:'⚔️',t:'Défi Club contre Club sans réponse',a:`data-a="todolist"`});
  for(const m of Object.values(S.mand||{}))if(m.until-S.t<=3){const b=getB(m.ch);if(b)L.push({ic:'📜',t:`Combat obligatoire ${m.k} de ${esc(sur(b))} : ${Math.max(0,m.until-S.t)} sem. pour signer`,a:`data-a="todolist"`})}
  const sp=club().filter(canSpend).length;if(sp)L.push({ic:'⬆️',t:`${sp} boxeur${sp>1?'s ont':' a'} des points de stats à dépenser`,a:`data-a="spall"`,fix:'⚡ Auto'});
  const ex=(S.offers||[]).filter(o=>o.exp<=S.t).length;if(ex)L.push({ic:'📨',t:`${ex} offre${ex>1?'s':''} de combat expire${ex>1?'nt':''} cette semaine`,a:`data-a="gooff"`});
  return L}
function showWarn(L,act){ui.warnFor=act;const el=document.getElementById('warn');el.innerHTML=`<div class="mcard nt" role="dialog" aria-label="Avant de continuer"><span class="lab">Avant de continuer</span><h3>Il reste des choses à faire</h3><div class="mbody">${L.map(x=>`<div class="tli"><p>${x.ic} ${x.t}</p><button class="btn sm gold" ${x.a} data-wfix="1">${x.fix||'Voir'}</button></div>`).join('')}</div>
  <div class="row" style="gap:8px;margin-top:12px;flex-wrap:nowrap"><button class="btn" data-a="warnx" style="flex:none">Retour</button><button class="btn pri" data-a="warngo" style="flex:1;margin:0">Continuer quand même</button></div></div>`;el.hidden=false}
function guardAdvance(act){if(S.set.warn===false||ui.warnOk===S.t+':'+act.a){ui.warnOk=null;return true}const L=preChecks();if(!L.length)return true;showWarn(L,act);return false}
/* ================= v27 : MONDE PLUS PROFOND ================= */
/* #20 thème du club */
const THEMES={rouge:{n:'Rouge',c:'#ff3b50',c2:'#c8102e'},bleu:{n:'Bleu',c:'#4f80ff',c2:'#2d55d6'},vert:{n:'Vert',c:'#38d98a',c2:'#1f9e60'},violet:{n:'Violet',c:'#a46bff',c2:'#7a4cd6'},or:{n:'Or',c:'#f5c451',c2:'#b8860b'},orange:{n:'Orange',c:'#ff9f43',c2:'#d9731c'},rose:{n:'Rose',c:'#ff5fa2',c2:'#c2186b'},argent:{n:'Argent',c:'#c9d1e0',c2:'#7c8699'}};
const myCol=()=>(THEMES[(S&&S.theme)||'rouge']||THEMES.rouge).c;
function applyTheme(){const t=THEMES[(S&&S.theme)||'rouge']||THEMES.rouge,r=document.documentElement;if(!r||!r.style||!r.style.setProperty)return;r.style.setProperty('--red',t.c);r.style.setProperty('--red2',t.c2);const h=t.c.replace('#','');r.style.setProperty('--rgb',[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)).join(','));r.style.setProperty('--red-g',`linear-gradient(180deg,${t.c} 0%,${t.c} 45%,${t.c2} 100%)`)}
/* #6 chimie boxeur / entraîneur */
function chemOf(b){const g=b.gym&&gymOf(b.gym),cn=g&&g.coach?g.coach.name:'';if(!cn)return 0;if(b.chemC!==cn){b.chemC=cn;b.chem=R()<.15?-1:R()<.55?0:R()<.85?1:2}return b.chem}
const chemF=b=>[.9,1,1.08,1.16][(chemOf(b)||0)+1]||1;
const chemTxt=b=>{const c=chemOf(b);return c<0?'💢 Mauvaise chimie (−10 % XP)':c===0?'😐 Chimie neutre':c===1?'🤝 Bonne chimie (+8 % XP)':'🔥 Excellente chimie (+16 % XP)'};
/* #3 paris */
function betOdds(f){const a=getB(f.a),b=getB(f.b);const o=matchOdds(a,b,f.rounds,projF(f));return o&&o.w!=null?o:null}
function placeBet(fid,side,amt){const f=S.fights.find(x=>x.id===fid);if(!f||f.bet)return;const o=betOdds(f);if(!o){toast('Calcul des chances en cours, réessaie.');return}if(S.money<amt){toast('Pas assez d’argent');return}
  const p=side==='w'?Math.max(3,o.w):Math.max(3,o.l),mult=Math.round(Math.min(25,Math.max(1.05,95/p))*100)/100;S.money-=amt;f.bet={side,amt,mult};toast(`💰 Pari placé : ${$(amt)} à ${String(mult).replace('.',',')} contre 1`)}
function settleBet(f,won,draw){const bt=f.bet;if(!bt)return;let g=0;if(draw)g=bt.amt;else if((bt.side==='w')===won)g=Math.round(bt.amt*bt.mult);if(g){S.money+=g;log(`💰 Pari ${draw?'remboursé':'gagné'} : +${$(g)}.`,'gold');toast(`💰 Pari gagnant : +${moneyS(g)}`)}else log(`💸 Pari perdu : −${$(bt.amt)}.`,'bad')}
/* #11 ceinture linéale, #12 intérim et super champion */
function linealOf(div){S.lineal=S.lineal||{};let id=S.lineal[div],h=id&&getB(id);if(!h||h.retired||h.div!==div||!S.boxers.includes(h)){const c=champsOf(div).sort((a,b)=>(isUndisp(b)-isUndisp(a))||beltsOf(b).length-beltsOf(a).length||ovr(b)-ovr(a))[0];S.lineal[div]=c?c.id:null;h=c||null}return h}
const isLineal=b=>!!b&&linealOf(b.div)===b;
const isSuper=b=>{const l=beltsOf(b);return l.includes('WBA')&&l.filter(k=>MAJOR.includes(k)).length>=2};
function interimOf(div,k){S.interim=S.interim||{};const id=(S.interim[div]||{})[k],b=id&&getB(id);return b&&!b.retired&&b.div===div?b:null}
function interimWeek(){S.interim=S.interim||{};for(const d of DIVS){const B=(S.belts||{})[d.id]||{};S.interim[d.id]=S.interim[d.id]||{};for(const k of BELTS){const h=getB(B[k]),cur=interimOf(d.id,k);
    if(h&&h.inj>=8&&!cur){const c=bodyList(d.id,k).find(b=>!b.champ&&!b.inj&&!b.mine&&!b.booked);if(c){S.interim[d.id][k]=c.id;if(h.mine||mine().some(m=>m.div===d.id))log(`🟡 ${k} ${divN(d.id)} : ${c.name} devient champion intérimaire (${h.name} blessé).`)}}
    else if(cur&&h&&!h.inj&&!h.mine&&!cur.mine&&!h.booked&&!cur.booked&&R()<.2){quickFight(h,cur,[k]);S.interim[d.id][k]=null}
    else if(cur&&(!h||h===cur))S.interim[d.id][k]=null}}}
/* #10 combats obligatoires */
function mandWeek(){S.mand=S.mand||{};for(const b of mine())for(const k of beltsOf(b)){const key=b.div+'|'+k,m=S.mand[key];
    if(m&&m.ch!==b.id){delete S.mand[key];continue}
    if(!m&&S.t-(b.lastMand||0)>=30&&S.t-b.lastFight<40&&R()<.12){const it=interimOf(b.div,k),op=it||bodyList(b.div,k).find(x=>!x.mine&&!x.retired);if(op){S.mand[key]={ch:b.id,op:op.id,k,until:S.t+10};b.lastMand=S.t;log(`📜 La ${k} ordonne à ${b.name} de défendre contre ${op.name} (${it?'champion intérimaire':'aspirant #1'}) d’ici 10 semaines.`,'bad');toast(`📜 Combat obligatoire ${k} pour ${sur(b)}`)}}
    else if(m&&S.t>m.until){const f=upF(b),op=getB(m.op);if(f&&f.b===m.op){continue}delete S.mand[key];S.belts[b.div][k]=null;ensureBelts(b.div);log(`❌ ${b.name} perd la ceinture ${k} : combat obligatoire refusé.`,'bad');toast(`❌ ${sur(b)} perd la ${k}`)}}}
function mandSign(key){const m=(S.mand||{})[key];if(!m)return;const me=getB(m.ch),op=getB(m.op);if(!me||!op)return;if(me.booked){const f=upF(me);if(f)cancelFight(f.id)}if(op.booked){const f=S.fights.find(x=>x.b===op.id);if(f)cancelFight(f.id);op.booked=false}
  ui.bookFor=me.id;const f=propose(me.id,op.id,{belts:beltsOf(me),force:1,week:Math.min(m.until,S.t+6)});if(f){f.mand=key;delete S.mand[key];afterBook(f)}}
/* #7 blessures longues et retours */
const LONGI=['Main cassée','Déchirure à l’épaule','Côte fracturée','Rétine décollée','Tendon d’Achille'];
/* #2 promotion rivale et Club contre Club */
function rivalPromo(){const L=promoAlive().filter(p=>!p.own);if(!L.length)return null;let r=L.find(p=>p.id===S.rivalP);if(!r){const me=prScore(null,club());r=L.sort((a,b)=>Math.abs(prScore(a)-me)-Math.abs(prScore(b)-me))[0];S.rivalP=r.id}return r}
function rivalWeek(){const r=rivalPromo();if(!r)return;
  if(S.t%9===0){const c=club().filter(b=>!b.booked&&b.loy<40&&!b.champ&&ovr(b)>=50);if(c.length&&R()<.35){const b=pick(c);b.loy=cl(b.loy-6,0,100);log(`🗡️ ${r.n} fait les yeux doux à ${b.name} : sa loyauté baisse.`,'bad')}}
  if(!S.cvc&&S.t-(S.cvcLast||0)>=20&&R()<.1){const pr=[];const used=new Set();for(const me of sortB(club()).filter(b=>!b.booked&&!b.inj)){const op=prBoxers(r).filter(o=>o.div===me.div&&!o.booked&&!o.inj&&!used.has(o.id)&&Math.abs(ovr(o)-ovr(me))<=8).sort((a,b)=>Math.abs(ovr(a)-ovr(me))-Math.abs(ovr(b)-ovr(me)))[0];if(op){pr.push([me.id,op.id]);used.add(op.id)}if(pr.length>=3)break}
    if(pr.length===3){const pot=Math.round(Math.max(300000,prValue(r)*.08)/10000)*10000;S.cvc={pid:r.id,pairs:pr,week:S.t+6,pot,until:S.t+2,acc:false,fids:[],res:[]};S.cvcLast=S.t;log(`⚔️ ${r.n} te lance un défi Club contre Club : 3 combats, ${$(pot)} au gagnant !`,'gold');toast(`⚔️ Défi de ${r.n} !`)}}
  if(S.cvc&&!S.cvc.acc&&S.t>S.cvc.until){log(`Tu as ignoré le défi de ${(S.promos.find(x=>x.id===S.cvc.pid)||{}).n}. Ils te traitent de lâche.`,'bad');for(const b of club())b.morale=cl(b.morale-3,0,100);S.cvc=null}
  if(S.cvc&&S.cvc.acc&&S.cvc.res.length===S.cvc.pairs.length){const w=S.cvc.res.filter(Boolean).length,p=(S.promos.find(x=>x.id===S.cvc.pid)||{n:'?'});if(w>=2){S.money+=S.cvc.pot;log(`⚔️ Tu gagnes le Club contre Club ${w}-${3-w} face à ${p.n} ! +${$(S.cvc.pot)}`,'gold');toast(`⚔️ Victoire ${w}-${3-w} ! +${moneyS(S.cvc.pot)}`);for(const b of club())b.morale=cl(b.morale+5,0,100)}else{S.money-=Math.round(S.cvc.pot*.5);log(`⚔️ ${p.n} gagne le Club contre Club ${3-w}-${w}. Tu paies ${$(Math.round(S.cvc.pot*.5))}.`,'bad')}S.cvc=null}}
function cvcAccept(){const c=S.cvc;if(!c||c.acc)return;for(const[a,b]of c.pairs){const me=getB(a),op=getB(b);if(!me||!op||me.booked||op.booked){toast('Un des boxeurs n’est plus libre : défi annulé.');S.cvc=null;return}}
  for(const[a,b]of c.pairs){const f=propose(a,b,{force:1,week:c.week});if(f){f.cvc=1;c.fids.push(f.id)}}c.acc=true;toast('⚔️ Défi accepté ! 3 combats au calendrier.');ui.csub='cal'}
/* #8 vieux champion, #9 montée de catégorie */
function careerEvents(){for(const b of mine()){if(S.event)return;
    if(b.age>=35&&b.champ&&!b.booked&&!b.oldAsk){b.oldAsk=S.t;S.event={k:'oldchamp',b:b.id};return}
    if(b.champ&&crOf(b).def>=3&&!b.upAsk&&b.age<33&&!b.booked&&DIVS.findIndex(d=>d.id===b.div)<DIVS.length-1&&R()<.05){b.upAsk=S.t;S.event={k:'moveup',b:b.id};return}}}
const multiDiv=b=>(crOf(b).divs||[]).length;
const mdChip=b=>multiDiv(b)>=2?`<span class="chip gold">💎 Champion de ${multiDiv(b)} divisions</span>`:'';
/* #13 académie jeunesse */
const acadMax=()=>4+2*((S.fac&&S.fac.acad)||0);
const acadKids=()=>(S.am||[]).filter(b=>b.acadMine);
function acadRecruit(){if(acadKids().length>=acadMax()){toast('Académie pleine. Agrandis-la dans Installations.');return}if(S.money<20000){toast('Pas assez d’argent');return}S.money-=20000;const b=newAm(ri(12,14));b.nat=S.home;b.name=natName(S.home);b.city=pick(NAT[S.home].c);b.pot=cl(b.pot+ri(4,12),0,99);b.acadMine=1;b.scout=1;S.am.push(b);log(`🧒 ${b.name} (${b.age} ans) entre à ton académie.`,'good');toast(`🧒 ${sur(b)} rejoint l’académie`)}
function acadWeek(){if(!S.am)return;S.money-=acadKids().length*300;for(const b of acadKids())if(b.age>=17&&club().length<rosterCap()&&!b.autoAsk){b.autoAsk=1;S.am=S.am.filter(x=>x!==b);delete b.amId;Object.assign(b,{mine:true,acadMine:0,morale:90,loy:90,plan:'normal',lastFight:S.t-2,hist:[],lvl:1,xp:0,sp:0,contract:208,salary:marketSal(b),pts:0});S.boxers.push(b);log(`🎓 ${b.name}, formé à ton académie, passe pro avec ${S.club} ! Loyauté maximale.`,'gold');toast(`🎓 ${sur(b)} passe pro !`)}}
/* #14 chaîne de streaming */
const TV_COST=2500000;
function tvWeek(){const t=S.tv;if(!t)return;const tf=club().reduce((s,b)=>s+fol(b),0),target=Math.round(Math.sqrt(tf)*55+(S.galas||[]).filter(g=>g.done).length*800);t.subs=Math.round(t.subs+(target-t.subs)*.06);const inc=Math.round(t.subs*.25);S.money+=inc;t.last=inc}
/* #15 bureaux à l'étranger */
const OFF_COST=1000000,OFF_MAX=4;
/* ================= v23 : SUPER SÉRIE (tournoi de la saison) ================= */
const SSP=[250000,750000,2000000,5000000];const SSRN=['Quarts de finale','Demi-finales','Finale'];
function ssSeeds(d){const L=[...champsOf(d),...rankList(d)].filter((b,i,a)=>a.indexOf(b)===i&&!b.retired);return L.slice(0,8)}
function ssStart(){const y=amYear(),used=(S.ssHist||[]).slice(0,4).map(h=>h.div),cands=DIVS.filter(d=>!used.includes(d.id)),d=(cands.find(x=>mine().some(b=>b.div===x.id&&ssSeeds(x.id).includes(b)))||pick(cands.length?cands:DIVS));
  const sd=ssSeeds(d.id);if(sd.length<8)return;S.ss={y,div:d.id,n:`Super Série ${d.n}`,slots:sd.map(b=>b.id),r:[[null,null,null,null],[null,null],[null]],wk:[S.t+8,S.t+20,S.t+32],cur:0,done:false,sched:{},inv:sd.filter(b=>b.mine).map(b=>b.id),invUntil:S.t+3};
  const mi=sd.filter(b=>b.mine);log(`🏆 ${S.ss.n} ${y} : 8 boxeurs, ${$(SSP[3])} au vainqueur.${mi.length?` ${mi.map(b=>b.name).join(', ')} ${mi.length>1?'sont invités':'est invité'} !`:''}`,'gold');
  if(mi.length){const t={t:`🏆 ${S.ss.n}`,lines:[`Tu es invité à la ${S.ss.n} ! 8 boxeurs, 3 tours sur la saison. Accepte ou refuse : rien ne se fait sans ton accord.`,...mi.map(b=>`🥊 <b>${esc(b.name)}</b> affrontera ${esc((getB(ssOpp(b.id))||{}).name||'?')} en quarts (${when(S.ss.wk[0])}).`),`Bourses : ${moneyS(SSP[0])} en quarts, ${moneyS(SSP[1])} en demies, ${moneyS(SSP[2])} pour le finaliste, ${moneyS(SSP[3])} + le trophée pour le vainqueur.`]};if(S.notice)S.notice.lines.push(...t.lines);else S.notice=t}}
const SEEDP=[[0,7],[3,4],[1,6],[2,5]];
function ssPairs(k){const ss=S.ss;if(!ss)return[];if(k===0)return SEEDP.map(([a,b])=>[ss.slots[a],ss.slots[b]]);const prev=ss.r[k-1];const out=[];for(let i=0;i<prev.length;i+=2)out.push([prev[i],prev[i+1]]);return out}
const ssStake=(A,B)=>A&&B&&A.div===B.div?[...new Set([...beltsOf(A),...beltsOf(B)])]:[];
function ssPair(k,i){return ssPairs(k)[i]||[]}
function ssOpp(id){const ss=S.ss;if(!ss)return null;const P=ssPairs(ss.cur);for(const[a,b]of P){if(a===id)return b;if(b===id)return a}return null}
function ssMine(){const ss=S.ss;if(!ss||ss.done)return[];return ssPairs(ss.cur).flat().map(getB).filter(b=>b&&b.mine)}
function ssPay(b,place){if(!b)return;const p=SSP[place];if(b.mine){const c=Math.round(p*SHARE);S.money+=c;log(`🏆 ${b.name} touche ${$(p)} à la ${S.ss.n} (ta part : ${$(c)}).`,'gold')}addFol(b,fol(b)*.03*(place+1));b.fame=cl(b.fame+2*(place+1),1,100)}
function ssRecord(k,i,w){const ss=S.ss;if(!ss||ss.r[k][i])return;ss.r[k][i]=w;const[a,b]=ssPair(k,i),l=w===a?b:a;ssPay(getB(l),k);
  if(ss.r[k].every(Boolean)){if(k===2){const W=getB(w);ss.done=true;ssPay(W,3);if(W){W.troph=W.troph||[];W.troph.push({n:ss.n+' '+ss.y,t:S.t});crOf(W).aw++}(S.ssHist=S.ssHist||[]).unshift({y:ss.y,n:ss.n,div:ss.div,w:W?W.name:'?',nat:W?W.nat:'CA',mine:!!(W&&W.mine)});
      log(`🏆 ${W?W.name:'?'} remporte la ${ss.n} ${ss.y} !`,'gold');if(W&&W.mine){toast(`🏆 ${sur(W)} gagne la Super Série !`);S.notice={t:`🏆 ${ss.n} ${ss.y}`,lines:[`<b>${esc(W.name)}</b> remporte la Super Série ! ${$(SSP[3])} de bourse et le trophée.`]}}}
    else{ss.cur=k+1;ss.sched={};log(`🏆 ${ss.n} : ${SSRN[k+1].toLowerCase()} ${when(ss.wk[k+1])}.`)}}}
function ssReplace(id){const ss=S.ss;if(!ss)return;const i=ss.slots.indexOf(id);if(i<0)return;const L=[...champsOf(ss.div),...rankList(ss.div)].filter(b=>!b.mine&&!b.retired&&!ss.slots.includes(b.id));const n=L[0];if(n){ss.slots[i]=n.id;log(`🏆 ${S.ss.n} : ${n.name} remplace ${getB(id).name}.`)}ss.inv=(ss.inv||[]).filter(x=>x!==id)}
function ssAccept(id){const ss=S.ss;if(!ss||!(ss.inv||[]).includes(id))return;const b=getB(id),op=getB(ssOpp(id));ss.inv=ss.inv.filter(x=>x!==id);(ss.acc=ss.acc||[]).push(id);
  if(b&&op){const cf=upF(b);if(cf&&cf.week>=ss.wk[0]-1)cancelFight(cf.id);const P=ssPairs(0),i=P.findIndex(p=>p.includes(id));if(!upF(b)&&!op.booked){const f=propose(b.id,op.id,{force:1,week:ss.wk[0],belts:ssStake(b,op)});if(f){f.ss={k:0,i};f.rounds=12;ss.sched[i]=f.id}}}
  toast(`✅ ${sur(b)} participe à la Super Série !`);log(`🏆 ${b.name} accepte l’invitation à la ${ss.n} : quart de finale contre ${op?op.name:'?'}, ${when(ss.wk[0])}.`,'gold')}
function ssRefuse(id){const b=getB(id);ssReplace(id);if(b){b.morale=cl(b.morale-6,0,100);log(`${b.name} décline la ${S.ss.n}.`)}}
function ssWeek(){const y=amYear(),w=amWeek();if(w===3&&(!S.ss||S.ss.y!==y))ssStart();const ss=S.ss;if(!ss||ss.done)return;
  
  const k=ss.cur,P=ssPairs(k);
  if(S.t>=ss.wk[k]-4&&S.t<ss.wk[k])P.forEach(([a,b],i)=>{if(ss.sched[i]||ss.r[k][i]||(ss.inv||[]).includes(a)||(ss.inv||[]).includes(b))return;const A=getB(a),B=getB(b);if(!A||!B)return;const me=A.mine?A:B.mine?B:null;if(!me)return;const op=me===A?B:A;
    if(me.booked||op.booked){const cf=S.fights.find(f=>f.a===me.id&&!f.ss);if(cf&&cf.week<ss.wk[k]-1)return;if(cf)cancelFight(cf.id)}
    const st=ssStake(me,op),f=propose(me.id,op.id,{force:1,week:ss.wk[k],belts:st});if(f){f.ss={k,i};f.rounds=12;ss.sched[i]=f.id;log(`🏆 ${S.ss.n} : ${me.name} vs ${op.name} ${when(f.week)}.`,'gold')}});
  if(S.t>=ss.wk[k])P.forEach(([a,b],i)=>{if(ss.r[k][i])return;const A=getB(a),B=getB(b);
    if(!A||!B||A.retired||B.retired){ssRecord(k,i,A&&!A.retired?a:b);return}
    if(A.mine||B.mine){const f=S.fights.find(x=>x.id===ss.sched[i]);if(f&&S.t<=ss.wk[k]+1)return;ssRecord(k,i,A.mine?b:a);return}
    if(A.booked||B.booked){ssRecord(k,i,ovr(A)>=ovr(B)?a:b);return}
    const wa=A.w,st=ssStake(A,B);quickFight(A,B,st.length?st:false);ssRecord(k,i,A.w>wa?a:b)})}
function propose(meId,opId,o={}){
  const me=getB(meId),op=getB(opId);if(!me||!op||me.booked||op.booked)return null;if(me.inj){toast('Ton boxeur est blessé : impossible de signer.');return null}
  let title=null;
  if(o.n){if(!canNat(me,op))return null}
  else if(o.belts&&o.belts.length)title=o.belts;
  else if(op.champ&&!o.force){const t=titleOpts(me,op);if(!t.length)return null;title=t}
  else if(!o.force&&canBook(me,op))return null;
  const g=o.ev?(S.galas||[]).find(x=>x.id===o.ev&&!x.done):null,nt=!!o.n,wk=g?g.week:(o.week||S.t+4);
  if(me.mine&&!o.force&&wk<(me.lastFight||-99)+6){toast(`${sur(me)} doit récupérer : pas de combat avant ${when(me.lastFight+6)}`);return null}
  const p=o.purse||Math.round((purse(me,op,title)+(nt?12000:0))*(wk-S.t<=2?1.1:1)/100)*100;
  const f={id:'f'+(S.uid++),a:me.id,b:op.id,week:wk,title,ntitle:nt,rounds:title?12:nt?10:roundsFor(me,op,false),purse:p,start:S.t,prep:10,auto:true,plan:[],bon:{},gp:null};
  if(g){f.own=true;f.ev=g.id;f.pay=Math.round(p*.6)}
  S.fights.push(f);me.booked=op.booked=true;S.offers=(S.offers||[]).filter(x=>x.a!==me.id);
  log(`Combat signé : ${me.name} contre ${flag(op.nat)} ${op.name}${title?' pour '+title.join(', '):nt?' pour le titre national':''}${g?' · gala '+g.name:''}, ${f.rounds} rounds, ${when(f.week)}.`);
  toast(title?'Combat de championnat signé !':nt?'Titre national signé !':'Combat signé !');ui.csub='cal';return f;
}
function sign(id){
  const b=S.fa.find(x=>x.id===id);if(!b)return;
  const cost=b.salary*10;if(club().length>=rosterCap()||S.money<cost)return;
  S.money-=cost;S.fa=S.fa.filter(x=>x!==b);delete b.fa;mcAdd('sign');
  Object.assign(b,{mine:true,morale:75,loy:60,plan:'normal',lastFight:S.t,hist:[],lvl:1,xp:0,sp:0,contract:52});
  S.boxers.push(b);log(`${b.name} signe avec le club (prime de ${$(cost)}, ${$(b.salary)} par semaine).`,'good');toast(`${b.name} rejoint le club !`);
}
function renewCost(b){const a=askOf(b,'renew');return{ns:a.sal,bonus:a.bonus}}
function renew(id){const b=getB(id),{ns,bonus}=renewCost(b);if(S.money<bonus)return;S.money-=bonus;b.salary=ns;b.contract=52;b.loy=cl(b.loy+10,0,100);log(`${b.name} prolonge d’un an à ${$(ns)}/sem. (prime ${$(bonus)}).`,'good');toast('Contrat prolongé')}
function release(id){const b=getB(id);if(!b||b.booked)return;b.mine=false;b.salary=0;log(`${b.name} est libéré par le club.`)}
function hire(id){
  const c=S.market.find(x=>x.id===id);if(!c)return;const fee=c.salary*6;if(S.money<fee)return;
  if(c.role==='spar'){if(S.staff.spar.length>=2)return;S.staff.spar.push(c)}
  else{const old=S.staff[c.role];if(old)log(`${old.name} est remplacé.`);S.staff[c.role]=c}
  S.money-=fee;S.market=S.market.filter(x=>x!==c);log(`${c.name} rejoint le staff (${ROLES[c.role].n}, ${c.stars}★).`,'good');toast(`${c.name} engagé`);
}
function fireStaff(id){const s=S.staff;if(s.coach&&s.coach.id===id)s.coach=null;else if(s.phys&&s.phys.id===id)s.phys=null;else if(s.cut&&s.cut.id===id)s.cut=null;else s.spar=s.spar.filter(x=>x.id!==id);log('Un membre du staff quitte le club.')}
function upgrade(){const lv=S.gym;if(lv>=5)return;const c=COST[lv];if(S.money<c)return;S.money-=c;S.gym++;log(`La salle passe au niveau ${S.gym} (${$(c)}).`,'good');toast('Salle améliorée !')}
function perk(k){if(S.mgr.pts<1||S.mgr.perks[k]>=3)return;S.mgr.pts--;S.mgr.perks[k]++;log(`Atout ${PERKS[k].n} niveau ${S.mgr.perks[k]}.`)}
function checkAch(){
  for(const b of mine())checkMs(b);
  checkCtr();
  for(const[id,n,f,cash,xp]of ACH){if(S.ach[id])continue;let ok=false;try{ok=f()}catch(e){}
    if(ok){S.ach[id]=S.t;S.money+=cash;mgrXP(xp);log(`Objectif atteint : ${n}.${cash?` +${$(cash)}`:''} +${xp} XP gérant.`,'gold');toast(`Objectif : ${n} !`)}}
}

/* ================= v7 : CEINTURES ================= */
const BELTS=['WBC','WBA','WBO','IBF','IBO'],MAJOR=['WBC','WBA','WBO','IBF'];
const BELTC={WBC:'#1f9e60',WBA:'#c8102e',WBO:'#2d55d6',IBF:'#a8790b',IBO:'#7a4cd6'};
function beltsOf(b){const B=S.belts&&S.belts[b.div];return B?BELTS.filter(k=>B[k]===b.id):[]}
// B8 : « Titre vacant » se lisait comme « pas de champion ». Anciennes sauvegardes converties à l'affichage.
function palmHow(h){return h.how==='Titre vacant'?'Remporte le titre vacant':h.how}
function syncChamp(){const ids=new Set();for(const d in S.belts)for(const k of BELTS)if(S.belts[d][k])ids.add(S.belts[d][k]);for(const b of S.boxers)b.champ=ids.has(b.id)}
const isUndisp=b=>{const l=beltsOf(b);return MAJOR.every(k=>l.includes(k))};
function bodyBias(b,k){b.bo=b.bo||{};if(b.bo[k]==null)b.bo[k]=ri(-25,25);return b.bo[k]}
function bodyList(div,k){const h=S.belts&&S.belts[div]&&S.belts[div][k];return S.boxers.filter(b=>b.div===div&&!b.retired&&b.id!==h).sort((a,b)=>(b.pts+bodyBias(b,k))-(a.pts+bodyBias(a,k)))}
function bodyIdx(b,k){const i=bodyList(b.div,k).indexOf(b);return i<0?999:i}
function champsOf(div){const B=(S.belts||{})[div]||{};return[...new Set(BELTS.map(k=>B[k]).filter(Boolean))].map(getB).filter(Boolean)}
function ensureBelts(div){S.belts=S.belts||{};const B=S.belts[div]=S.belts[div]||{};
  for(const k of BELTS){const h=B[k]&&getB(B[k]);if(!h||h.retired||h.div!==div||!S.boxers.includes(h)){const l=bodyList(div,k),t=l.find(b=>!b.mine&&!beltsOf(b).length)||l.find(b=>!b.mine)||l[0];B[k]=t?t.id:null;
    if(t){t.fame=cl(t.fame+5,1,100);S.champHist&&S.champHist.unshift({t:S.t,div,nm:t.name,nat:t.nat,mine:t.mine,belt:k,how:'Remporte le titre vacant'});if(S.champHist&&S.champHist.length>120)S.champHist.length=120}}}
  syncChamp()}
const titleTxt=t=>Array.isArray(t)?t.join(' · '):'Titre mondial';
const beltSvg=(k,w=34)=>{const c=BELTC[k]||'#d4a017';return`<svg class="bsvg" viewBox="0 0 80 36" width="${w}" height="${Math.round(w*.45)}" role="img" aria-label="Ceinture ${k}"><rect x="1" y="9" width="78" height="18" rx="6" fill="${c}" stroke="rgba(0,0,0,.35)"/><rect x="4" y="11" width="72" height="3.5" rx="1.7" fill="#fff" opacity=".22"/><circle cx="11" cy="18" r="5" fill="#f0cb5c" stroke="#7a5a10"/><circle cx="69" cy="18" r="5" fill="#f0cb5c" stroke="#7a5a10"/><path d="M25 3h30l7 7v16l-7 7H25l-7-7V10z" fill="#f6d46a" stroke="#7a5a10" stroke-width="1.5"/><path d="M28 7h24l4 4v14l-4 4H28l-4-4V11z" fill="#d9a92f"/><text x="40" y="21.6" text-anchor="middle" font-size="9.5" font-weight="900" font-family="system-ui,-apple-system,sans-serif" fill="#2a1c00">${k}</text></svg>`};
const undBadge='<span class="undis">👑 UNDISPUTED</span>';
const beltChips=(b,w=34)=>`<span class="blts">${beltsOf(b).map(k=>beltSvg(k,w)).join('')}</span>`+(isUndisp(b)?undBadge:'')+(S&&isLineal(b)?'<span class="chip gold">💎 Linéal</span>':'')+(isSuper(b)&&!isUndisp(b)?'<span class="chip">WBA Super</span>':'');
function titleOpts(me,op){if(!op.champ||me.inj||me.booked||op.booked||op.inj)return[];const ob=beltsOf(op),mb=beltsOf(me),ok=ob.filter(k=>mb.length||bodyIdx(me,k)<10);return ok.length?[...new Set([...ok,...mb])]:[]}
function titleDef(me,op){if(!me.champ||op.champ||op.booked||op.inj||me.inj||me.booked)return[];return beltsOf(me).filter(k=>bodyIdx(op,k)<15)}
function transferBelts(W,L,stake,stop){const lb=beltsOf(L).filter(k=>stake.includes(k));if(!lb.length)return[];
  for(const k of lb){S.belts[W.div][k]=W.id;S.champHist.unshift({t:S.t,div:W.div,nm:W.name,nat:W.nat,mine:W.mine,belt:k,how:'Bat '+L.name+(stop?' par arrêt':' aux points')})}
  if(S.champHist.length>120)S.champHist.length=120;syncChamp();
  recHit('young',W.age,W);if(!(S.records&&S.records.old)||W.age>S.records.old.v)recHit('old',W.age,W);if(W.mine){W.tw=(W.tw||0)+lb.length;log(`${W.name} remporte ${lb.join(', ')} !${isUndisp(W)?' CHAMPION UNDISPUTED !':''}`,'gold');toast(`🏆 ${sur(W)} : ${lb.join(' · ')}`)}
  else if(L.mine)log(`${L.name} perd ${lb.join(', ')}.`,'bad');
  else if(mine().some(m=>m.div===W.div))log(`${divN(W.div)} : ${W.name} prend ${lb.join(', ')} à ${L.name}.`);
  return lb}

/* ================= v7 : INSTALLATIONS ================= */
const FAC={
 vest:{n:'Vestiaires',d:'+1 place de boxeur par niveau.',max:6,base:10000},
 ring:{n:'Ring de sparring',d:'+10 % de préparation par niveau pendant les camps.',max:5,base:12000},
 cardio:{n:'Salle de cardio',d:'Séances Cardio, Repos et Affûtage plus efficaces.',max:5,base:9000},
 med:{n:'Centre médical',d:'−12 % de blessures et guérison plus rapide par niveau.',max:5,base:15000},
 video:{n:'Salle vidéo',d:'Rapports de repérage complets et plan de match plus efficace.',max:3,base:14000},
 dorm:{n:'Dortoirs',d:'Plus de moral et de loyauté chaque semaine.',max:3,base:16000},
 acad:{n:'Académie jeunesse',d:'Des espoirs de ton pays arrivent chaque mois chez les agents libres.',max:3,base:20000}};
const facCost=(k,l)=>Math.round(FAC[k].base*Math.pow(2.1,l)/1000)*1000;
const facLv=()=>Object.values(S.fac||{}).reduce((s,v)=>s+v,0);
function buildFac(k){const l=S.fac[k]||0;if(l>=FAC[k].max)return;const c=facCost(k,l);if(S.money<c){toast('Pas assez d’argent');return}S.money-=c;S.fac[k]=l+1;log(`${FAC[k].n} niveau ${l+1} (${$(c)}).`,'good');toast(`${FAC[k].n} niveau ${l+1} !`)}
const brCost=()=>50000*((S.branches||[]).length+1);
/* ---- gyms façon FIGHT DYNASTY : chaque gym a son entraîneur, sa capacité et ses boxeurs ---- */
function gymInit(){S.hq=S.hq||{coach:{name:natName(S.home),nat:S.home,stars:2},t:1};
  (S.branches||[]).forEach((g,i)=>{if(!g.id)g.id='gy'+i+'_'+(g.t||0);if(!g.coach)g.coach={name:natName(g.nat||S.home),nat:g.nat||S.home,stars:ri(1,3)};if(!g.cap)g.cap=2});
  const gyms=allGyms(),load={};for(const g of gyms)load[g.id]=0;for(const b of club())if(b.gym&&load[b.gym]!==undefined)load[b.gym]++;else b.gym=null;
  for(const b of sortB(club()))if(!b.gym){const g=(load.hq<gyms[0].cap?gyms[0]:null)||gyms.find(x=>x.id!=='hq'&&x.nat===b.nat&&load[x.id]<x.cap)||gyms.find(x=>load[x.id]<x.cap)||gyms[0];b.gym=g.id;load[g.id]++}}
function allGyms(){const hq={id:'hq',name:S.club,city:'Quartier général',nat:S.home,coach:S.hq.coach,cap:2+((S.fac&&S.fac.vest)||0),t:S.hq.t||1,hq:1};
  return[hq,...(S.branches||[]).map(g=>({...g,name:`${S.club} ${g.city}`}))]}
const gymOf=id=>allGyms().find(g=>g.id===id);
const gymBoxers=id=>club().filter(b=>b.gym===id);
function gymRec(id){const L=gymBoxers(id);return L.reduce((a,b)=>({w:a.w+b.w,l:a.l+b.l,d:a.d+b.d,ko:a.ko+b.ko}),{w:0,l:0,d:0,ko:0})}
const gymXP=b=>{const g=b.gym&&gymOf(b.gym);return g?(1+.04*((g.coach&&g.coach.stars)||1))*(g.nat===b.nat?1.05:1):1};
const gymUpCost=g=>40000*(g.cap||2);
const coachCost=g=>[0,60000,180000,450000,900000][(g.coach&&g.coach.stars)||1]||0;
function vGym(g){const L=sortB(gymBoxers(g.id)),r=gymRec(g.id),c=g.coach||{};
  return`<div class="in"><button class="back" data-a="close">← Retour</button>
  <div class="panel" style="border-color:rgba(245,196,81,.45)"><span class="lab">${g.hq?'Gym principal':'Succursale'} · depuis ${when(g.t||1)}</span><h2 style="margin:4px 0 2px;overflow-wrap:anywhere">${esc(g.name)}</h2><div class="small">${flag(g.nat)} ${esc(g.city)} · ${L.length}/${g.cap} boxeurs</div>
    <div class="trk gold" style="margin-top:8px;height:8px"><i style="width:${pct(L.length/Math.max(1,g.cap)*100)}%"></i></div>
    <div class="s4" style="margin-top:12px">${[[`${r.w}-${r.l}-${r.d}`,'Fiche du gym'],[r.ko,'KO'],[L.filter(b=>b.champ).length,'Champions'],[g.cap,'Places']].map(([v,l])=>`<div><b style="font-size:16px">${v}</b><small>${l}</small></div>`).join('')}</div></div>
  <div class="panel"><div class="ph"><span class="lab">Entraîneur-chef</span><span class="chip gold">${'★'.repeat(c.stars||1)}${'☆'.repeat(4-(c.stars||1))}</span></div><b>${flag(c.nat||g.nat)} ${esc(c.name||'—')}</b><div class="small">+${4*(c.stars||1)} % d’XP pour les boxeurs de ce gym${g.hq?'':` · +5 % de plus pour ceux de ${NAT[g.nat].n}`}</div>
    ${(c.stars||1)<4?`<button class="btn sm gold" style="margin-top:8px" data-a="gymcoach" data-id="${g.id}" ${S.money>=coachCost(g)?'':'disabled'}>Engager un entraîneur ${'★'.repeat((c.stars||1)+1)} · ${$(coachCost(g))}</button>`:''}</div>
  ${g.hq?'<p class="small" style="margin:0">Agrandis le gym principal avec les vestiaires (Installations).</p>':`<div class="panel"><span class="lab">Agrandir</span><p class="small" style="margin:6px 0 8px">+2 places de boxeur dans ce gym.</p><button class="btn pri" data-a="gymup" data-id="${g.id}" ${S.money>=gymUpCost(g)?'':'disabled'}>Agrandir · ${$(gymUpCost(g))}</button></div>`}
  <span class="lab">Boxeurs du gym</span><div class="list">${L.map(b=>boxRow(b)).join('')||'<div class="panel small">Aucun boxeur. Change le gym d’un boxeur depuis sa fiche (onglet Contrat).</div>'}</div></div>`}
const brIncome=()=>(S.branches||[]).reduce((s,b,i)=>s+500+250*i,0);
function openBranch(city){if((S.branches||[]).some(b=>b.city===city))return;const c=brCost();if(S.money<c){toast('Pas assez d’argent');return}S.money-=c;S.branches.push({id:'gy'+S.uid++,city,nat:CITYNAT[city]||S.home,t:S.t,cap:2,coach:{name:natName(CITYNAT[city]||S.home),nat:CITYNAT[city]||S.home,stars:1}});log(`Nouveau gym ouvert à ${city} (${$(c)}). +2 places de boxeur.`,'gold');toast(`Gym ouvert à ${city} !`)}

/* ================= v7 : CAMP SEMAINE PAR SEMAINE ================= */
const FOC={
 cardio:{n:'Cardio',ic:'❤️',prep:12,fat:6,xp:.9,inj:.008,bon:'car',d:'Endurance : s’essouffle moins.'},
 spar:{n:'Sparring',ic:'🥊',prep:16,fat:10,xp:1.5,inj:.03,bon:'spa',d:'Précision et timing.'},
 tech:{n:'Technique',ic:'🎯',prep:12,fat:5,xp:1,inj:.006,bon:'tec',d:'Défense et jab.'},
 force:{n:'Puissance',ic:'💪',prep:12,fat:8,xp:1,inj:.012,bon:'pow',d:'Coups plus lourds.'},
 repos:{n:'Repos',ic:'💤',prep:2,fat:-16,xp:0,inj:0,d:'Récupère la forme.'},
 aff:{n:'Affûtage',ic:'⚡',prep:7,fat:-8,xp:.4,inj:.004,d:'Dernière semaine : frais et vif.'}};
const BONN={car:'Cardio',spa:'Sparring',tec:'Technique',pow:'Puissance'};
function autoFocus(b,cf){const left=cf.week-S.t;if(b.fatigue>45)return'repos';if(left<=0)return'aff';
  const op=getB(cf.b),pref={agr:['tech','cardio','spar','force'],eq:['force','spar','cardio','tech'],pru:['spar','force','cardio','tech'],corps:['cardio','tech','spar','force']}[op?op.style:'eq'],bo=cf.bon||{};
  let best=pref[0],bc=99;for(const k of pref){const n=bo[FOC[k].bon]||0;if(n<bc){bc=n;best=k}}
  if(best==='spar'&&b.fatigue>30)best='tech';return best}
function campFocus(b,cf){const i=cf.wk||0;if(cf.auto===false&&cf.plan&&cf.plan[i])return cf.plan[i];return autoFocus(b,cf)}
function skipTo(fid){const f=S.fights.find(x=>x.id===fid);ui.skipF=null;if(!f)return;ui.sheet=null;let n=0;
  while(S.t<f.week&&n++<40){nextWeek(true);if(S.event||S.queue.length||S.neg)break}
  ui.skipF=S.fights.includes(f)&&S.t<f.week?fid:null;
  if(S.neg){save();render();return}
  save();render();if(S.event)renderEvent();else if(S.queue.length)openFight(S.queue[0])}

/* ================= v7 : GALAS ================= */
const GCITY=[{id:'home',n:'Ta ville',nat:null,att:1,price:1,tv:1,fee:0,lvl:1,d:'Ton public. Les boxeurs de ton pays attirent plus de monde.'},
  {id:'mtl',n:'Montréal',nat:'CA',att:1.05,price:1,tv:1,fee:8000,lvl:2,d:'Foule bruyante, parfaite pour les boxeurs canadiens.'},
  {id:'mex',n:'Mexico',nat:'MX',att:1.25,price:.8,tv:1,fee:12000,lvl:3,d:'Les salles débordent. Billets moins chers.'},
  {id:'par',n:'Paris',nat:'FR',att:1.05,price:1.05,tv:1.1,fee:20000,lvl:4,d:'Belle vitrine européenne.'},
  {id:'ldn',n:'Londres',nat:'GB',att:1.3,price:1.1,tv:1.2,fee:35000,lvl:5,d:'Les plus grosses foules d’Europe.'},
  {id:'tok',n:'Tokyo',nat:'JP',att:1.05,price:1.15,tv:1.15,fee:30000,lvl:6,d:'Public fidèle, gros marché télé.'},
  {id:'veg',n:'Las Vegas',nat:'US',att:1.15,price:1.35,tv:1.4,fee:60000,lvl:7,d:'La capitale de la boxe : billets chers et vente PPV boostée.'}];
const GTV=[{id:'none',n:'Aucune'},{id:'loc',n:'Télé locale'},{id:'str',n:'Streaming'},{id:'big',n:'Grande chaîne'},{id:'ppv',n:'Pay-per-view'},{id:'own',n:'Ta chaîne'}];
const PPVP=[40,60,80,100];
const GX={presse:{n:'Conférence de presse',d:'+10 % de popularité de la carte',c:5000},pesee:{n:'Pesée publique',d:'+5 % de spectateurs, +commandites',c:4000},show:{n:'Show musical et entrées',d:'+12 % de spectateurs',c:25000},vip:{n:'Sièges VIP au bord du ring',d:'+18 % de revenus de billets si la salle est à moitié pleine',c:10000}};
const ARENAS=[{id:'salle',n:'Salle communautaire',cap:800,rent:1500,lvl:1},{id:'arena',n:'Aréna municipale',cap:3500,rent:7000,lvl:3},{id:'centre',n:'Centre des congrès',cap:8000,rent:20000,lvl:5},{id:'amphi',n:'Grand amphithéâtre',cap:16000,rent:55000,lvl:8},{id:'stade',n:'Stade',cap:45000,rent:160000,lvl:12}];
const PRICES=[20,35,50,75,120,200],PROMOB=[0,3000,10000,30000,80000];
const galaFights=g=>S.fights.filter(f=>f.ev===g.id);
function galaEst(g,rnd){
  const fs=galaFights(g),ar=arenaList().find(a=>a.id===g.arena)||ARENAS[0];let pop=0,mainP=0;
  let mainF=0;for(const f of fs){const a=getB(f.a),b=getB(f.b);if(!a||!b)continue;const fl=fol(a)+fol(b);const p=a.fame+b.fame+Math.sqrt(fl)/12+(f.title?25*(Array.isArray(f.title)?f.title.length:1):0)+(f.ntitle?12:0)+(a.rival===b.id?10:0);if(p>mainP){mainP=p;mainF=fl}pop+=p}
  const X=g.x||{},C=GCITY.find(c=>c.id===(g.city||'home'))||GCITY[0],cn=C.nat||S.home;let loc=0;for(const f of fs){for(const id of[f.a,f.b]){const x=getB(id);if(x&&x.nat===cn)loc++}}
  pop=Math.round((pop+mainP*.6)*(X.presse?1.1:1));
  const promoF=1+Math.min(1.4,g.promo/25000),priceF=Math.pow(45*C.price/g.price,.85),pro=1+.1*(S.mgr.perks.rec||0),k=rnd?(.88+R()*.24):1;
  const attF=C.att*(C.nat&&(S.offices||[]).includes(C.nat)?1.1:1)*(1+Math.min(.45,loc*.12))*(X.pesee?1.05:1)*(X.show?1.12:1);
  const att=Math.round(Math.min(ar.cap,(40+Math.pow(pop,1.6)*.6)*promoF*priceF*attF*k));
  const tickets=Math.round(att*g.price*(X.vip&&att>=ar.cap*.5?1.18:1)),spons=Math.round(pop*60*promoF*k*(X.pesee?1.1:1));
  const tvm=g.tv||(g.ppv?'ppv':'loc'),tv=Math.round(tvm==='none'?0:tvm==='loc'?Math.max(0,pop-60)*120*C.tv:tvm==='str'?(pop>=70?pop*450:0)*C.tv:tvm==='big'?(pop>=110?pop*1100:0)*C.tv:tvm==='own'?(S.tv?Math.round(S.tv.subs*.4+pop*200):0):Math.max(0,pop-80)*60*C.tv);
  const pp=g.ppvp||60,ppvOn=tvm==='ppv',ppvOk=mainP>=90,ppvBuys=ppvOn&&ppvOk?Math.round((mainP*mainP*.3+folEco(mainF)*.03)*promoF*k*C.tv*Math.pow(60/pp,1.1)):0,ppvRev=Math.round(ppvBuys*pp*.5),ppvCost=ppvOn&&ppvOk?25000:0;
  const pay=fs.reduce((s,f)=>s+(f.pay||0),0),prod=4000+2500*fs.length,xc=Object.keys(GX).reduce((s,q)=>s+(X[q]?GX[q].c:0),0),fee=C.fee;
  const rev=Math.round((tickets+spons+tv+ppvRev)*pro),cost=ar.rent+g.promo+ppvCost+pay+prod+xc+fee;
  return{att,cap:ar.cap,tickets,spons,tv,tvm,ppvOk,ppvOn,ppvBuys,ppvRev,ppvCost,pay,prod,xc,fee,city:C,loc,rent:ar.rent,promo:g.promo,rev,cost,profit:rev-cost,pop,n:fs.length,mainP,ar};
}
function createGala(){const n=ui.gn;if(!n)return;const ar=arenaList().find(a=>a.id===n.arena);if(!ar||S.mgr.lvl<ar.lvl)return;
  const C=GCITY.find(c=>c.id===n.city)||GCITY[0];if(S.mgr.lvl<C.lvl){toast(`${C.n} : gérant niveau ${C.lvl} requis`);return}
  const g={id:'g'+(S.uid++),name:(n.name||'').trim()||`${S.club} Fight Night ${(S.galas||[]).length+1}`,arena:n.arena,week:S.t+n.wk,price:n.price,promo:n.promo,ppv:n.tv==='ppv',city:n.city||'home',tv:n.tv||'loc',ppvp:n.ppvp||60,x:{...(n.x||{})},done:false};
  const up=galaUpfront(g);if(S.money<up){toast(`Fonds insuffisants : ${$(up)} requis pour ce gala`);return null}
  S.money-=up;g.paid=up;g.locked=true;
  S.galas.push(g);log(`Gala créé : ${g.name} (${ar.n}), ${when(g.week)}.`,'good');toast('Gala créé ! Ajoute des combats.');return g}
// B23 : le budget engagé (location, promo, extras, frais de ville) se paie à la création.
function galaUpfront(g){const ar=arenaList().find(a=>a.id===g.arena)||ARENAS[0],C=GCITY.find(c=>c.id===(g.city||'home'))||GCITY[0],X=g.x||{};
  return ar.rent+(+g.promo||0)+Object.keys(GX).reduce((s,q)=>s+(X[q]?GX[q].c:0),0)+C.fee}
function galaNight(g){
  if(!galaFights(g).length){const loss=Math.round((arenaList().find(a=>a.id===g.arena)||ARENAS[0]).rent*.5);S.money+=(g.paid||0)-loss;g.done=true;g.res={cancel:true,loss};log(`Gala ${g.name} annulé faute de combats : ${$(loss)} de frais.`,'bad');return}
  const r=galaEst(g,true);S.money+=r.profit+(g.paid||0);g.done=true;g.res=r;mcAdd('galas');
  for(const f of galaFights(g)){const a=getB(f.a);if(a){a.fame=cl(a.fame+2,1,100);addFol(a,r.att*1.5+r.ppvBuys*2)}}
  log(`${g.name} : ${r.att.toLocaleString('fr-CA')} spectateurs${r.ppvBuys?`, ${r.ppvBuys.toLocaleString('fr-CA')} achats PPV`:''}. Profit : ${$(r.profit)}.`,r.profit>=0?'gold':'bad');toast(`🎪 ${g.name} : ${r.profit>=0?'+':''}${$(r.profit)}`)}

/* ================= v7 : TOURNOIS ================= */
const TOURS=[{id:'reg',n:'Gants d’or régionaux',lvl:1,fee:1000,prize:6000,dif:-2,cd:5},{id:'nat',n:'Coupe nationale',lvl:4,fee:3000,prize:18000,dif:3,cd:8},{id:'int',n:'Grand Prix international',lvl:8,fee:8000,prize:50000,dif:8,cd:12}];
const RNDN=['Quart de finale','Demi-finale','Finale'];
function tourReady(b){return b&&!b.inj&&!b.booked&&b.fatigue<=60&&!S.queue.length}
function enterTour(tid,bid){const T=TOURS.find(x=>x.id===tid),b=getB(bid);S.tcd=S.tcd||{};
  if(!T||!tourReady(b)||S.mgr.lvl<T.lvl||S.money<T.fee||(S.tcd[tid]||0)>S.t||S.tour)return;
  const tgt=ovr(b)+T.dif,pool=S.boxers.filter(x=>x.div===b.div&&!x.mine&&!x.booked&&!x.inj).sort((x,y)=>Math.abs(ovr(x)-tgt)-Math.abs(ovr(y)-tgt)).slice(0,12).sort(()=>R()-.5).slice(0,7);
  if(pool.length<7){toast('Pas assez de participants dans cette division');return}
  S.money-=T.fee;S.tcd[tid]=S.t+T.cd;S.tour={tid,b:bid,alive:[bid,...pool.map(x=>x.id)],round:0,hp:100,en:100};
  log(`${b.name} entre dans le tournoi ${T.n} (${$(T.fee)}).`);startTourFight()}
function startTourFight(){const t=S.tour;if(!t)return;const me=getB(t.b),i=t.alive.indexOf(t.b),op=getB(t.alive[i^1]);if(!me||!op){S.tour=null;return}
  op.fatigue=10;const F=newFight(me,op,4,false);F.tour=t.round+1;F.A.hp=t.hp;F.A.en=t.en;beginFight(F)}
function tourAfter(F){const t=S.tour,T=TOURS.find(x=>x.id===t.tid),me=F.A.b;let won=F.res.w==='A';if(!F.res.w)won=F.cards[0][0]>=F.cards[0][1]?R()<.6:R()<.4;
  me.fatigue=cl(me.fatigue+12,0,100);recordStats(me,F,won,false);addXP(me,Math.round((won?35:15)*(1+t.round*.4)*cl(1+(ovr(F.B.b)-ovr(me))*.05,.3,1.6)));
  if(!won){if(t.round===1){S.money+=T.fee;mcAdd('tourSF')}if(t.round===2){S.money+=Math.round(T.prize*.35);me.fame=cl(me.fame+3,1,100)}
    log(`${me.name} est éliminé en ${RNDN[t.round].toLowerCase()} du ${T.n}.${t.round===2?` Finaliste : +${$(Math.round(T.prize*.35))}.`:t.round===1?' Inscription remboursée.':''}`,'bad');S.tour=null;return false}
  const nal=[];for(let j=0;j<t.alive.length;j+=2){const a=t.alive[j],bb=t.alive[j+1];if(a===t.b||bb===t.b){nal.push(t.b);continue}
    const A=getB(a),B=getB(bb);if(!A||!B){nal.push(A?a:bb);continue}const G=newFight(A,B,4,false);while(!G.done)stepRound(G,aiStrat(G.A,G.B,G),aiStrat(G.B,G.A,G));nal.push(G.res.w==='B'?bb:a)}
  t.alive=nal;t.round++;t.hp=cl(F.A.hp+35,0,100);t.en=cl(F.A.en+45,0,100);if(t.round===1)mcAdd('tourSF');
  if(t.alive.length===1){S.money+=T.prize;me.fame=cl(me.fame+6,1,100);me.troph=(me.troph||[]);me.troph.push({n:T.n,t:S.t});S.stats.trophies=(S.stats.trophies||0)+1;mgrXP(60+t.round*20);
    log(`🏆 ${me.name} remporte le ${T.n} ! +${$(T.prize)}.`,'gold');toast(`🏆 ${sur(me)} gagne le ${T.n} !`);S.tour=null;return false}
  log(`${me.name} passe en ${RNDN[t.round].toLowerCase()} du ${T.n}.`,'good');return true}

/* ================= v7 : CONTRATS DU MOIS ================= */
const CTR=[{id:'w2',n:'Gagner 2 combats officiels',k:'wins',g:2,cash:6000,xp:80},{id:'ko',n:'Gagner un combat par KO',k:'kos',g:1,cash:5000,xp:70},{id:'gym',n:'Gagner un défi de gym',k:'gym',g:1,cash:3000,xp:50},{id:'spar',n:'Faire 3 séances de sparring en camp',k:'spar',g:3,cash:3000,xp:50},{id:'sign',n:'Signer un nouveau boxeur',k:'sign',g:1,cash:4000,xp:60},{id:'gala',n:'Organiser un gala',k:'galas',g:1,cash:8000,xp:100},{id:'tour',n:'Atteindre une demi-finale de tournoi',k:'tourSF',g:1,cash:5000,xp:80},{id:'trial',n:'Réussir une épreuve de palier',k:'trial',g:1,cash:4000,xp:60},{id:'tit',n:'Gagner un combat de titre',k:'titles',g:1,cash:10000,xp:150}];
function mcAdd(k,n){S.stats=S.stats||{};if(k==='sign'||k==='galas')S.stats[k]=(S.stats[k]||0)+(n||1);if(!S.mc)S.mc={};S.mc[k]=(S.mc[k]||0)+(n||1)}
const CTRX=['gym','tour'];
function newContracts(){S.mc={};S.ctr={until:S.t+4,list:CTR.filter(c=>!CTRX.includes(c.id)).sort(()=>R()-.5).slice(0,3).map(c=>c.id),done:[]}}
const ctrMul=()=>1+S.mgr.lvl*.5;
function checkCtr(){if(!S.ctr)return;for(const id of S.ctr.list){if(S.ctr.done.includes(id))continue;const c=CTR.find(x=>x.id===id);if(c&&(S.mc[c.k]||0)>=c.g){S.ctr.done.push(id);S.money+=Math.round(c.cash*ctrMul());mgrXP(c.xp);log(`Mission réussie : ${c.n}. +${$(Math.round(c.cash*ctrMul()))}.`,'gold');toast(`✓ Contrat : ${c.n}`)}}}

/* ================= v7 : % DE VICTOIRE EN ARRIÈRE-PLAN ================= */
function oddsKey(a,b,rounds,f){return[f?'':'w'+(ui.bw||4),a.id,b.id,ovr(a),ovr(b),Math.round(a.fatigue/8),Math.round(b.fatigue/8),rounds,f?[f.proj?'p':'',f.camp,Math.round((f.prep??10)/5),f.gp,JSON.stringify(f.bon||{})].join(','):'',S.t].join('|')}
const projF=f=>{const wl=Math.max(0,f.week-S.t),o=getB(f.b),a=getB(f.a),bo={...(f.bon||{})},coach=S.staff.coach?S.staff.coach.stars:0,phys=S.staff.phys?S.staff.phys.stars:0,fc=S.fac||{};
  let prep=f.prep??10,fat=a?a.fatigue:20;const pref={agr:['tech','cardio','spar','force'],eq:['force','spar','cardio','tech'],pru:['spar','force','cardio','tech'],corps:['cardio','tech','spar','force']}[o?o.style:'eq'];
  for(let i=0;i<wl;i++){let foc;if(fat>45)foc='repos';else if(i===wl-1)foc='aff';else{let bc=99;for(const k of pref){if(k==='spar'&&(!S.staff.spar.length||fat>30))continue;const n=bo[FOC[k].bon]||0;if(n<bc){bc=n;foc=k}}foc=foc||'tech'}
    const Fo=FOC[foc];prep+=Fo.prep*(1+.08*coach+.05*phys)*(1+.1*(fc.ring||0))*(1-fat/220)+(f.camp==='video'?1:f.camp==='alt'?2:0);if(Fo.bon)bo[Fo.bon]=(bo[Fo.bon]||0)+1;fat=cl(fat+Fo.fat-phys*2,0,100)}
  return{...f,prep:Math.min(100,Math.round(prep)),gp:f.gp||(f.auto!==false&&o?bestGP(o.style):null),bon:bo,proj:1,fat:Math.round(fat)}};
function oddsF(a,b,rounds,f){f=f||projF({a:a.id,b:b.id,week:S.t+(ui.bw||4),prep:10,camp:''});const F=newFight(a,b,rounds,false);if(f.proj){if(f.fat!=null){const Y=fighter({...a,fatigue:f.fat});Y.b=a;Y.camp='';F.A=Y}if(b.fatigue>20){const Y=fighter({...b,fatigue:20});Y.b=b;Y.camp='';F.B=Y}}applyCamp(F,f);return F}
function matchOdds(a,b,rounds,f){ui.oc=ui.oc||{};const k=oddsKey(a,b,rounds,f);if(ui.oc[k])return ui.oc[k];
  if(ui.syncOdds)return ui.oc[k]=oddsFrom(oddsF(a,b,rounds,f),100);
  ui.oq=ui.oq||new Map();if(!ui.oq.has(k))ui.oq.set(k,[a.id,b.id,rounds,f?{...f}:null]);if(!ui.oqT)ui.oqT=setTimeout(runOdds,40);return{w:null}}
function runOdds(){ui.oqT=0;if(!S)return;const t0=performance.now();
  for(const[k,v]of ui.oq){ui.oq.delete(k);const a=getB(v[0]),b=getB(v[1]);if(a&&b)ui.oc[k]=oddsFrom(oddsF(a,b,v[2],v[3]),100);if(performance.now()-t0>28)break}
  if(ui.oq.size)ui.oqT=setTimeout(runOdds,16);else if(!ui.menu)render()}
/* ================= NÉGOCIATIONS ================= */
const prefYrs=b=>b.age<26?1:b.age<=31?2:3;
function demandSal(b){const r=b.fa?999:rankIdx(b);return Math.max(120,Math.round(((ovr(b)-30)*10+Math.sqrt(fol(b))*1.2+b.w*6+b.ko*4+beltsOf(b).length*350+(b.nchamp?120:0)+(r<15?(15-r)*25:0))/10)*10)}
function askOf(b,kind){let s=demandSal(b);if(kind==='renew')s*=b.loy>70?.9:b.loy<40?1.2:1;if(has(b,'diva'))s*=1.15;s=Math.round(s/10)*10;return{sal:s,bonus:Math.round(s*(kind!=='renew'?8:4)/100)*100,yrs:prefYrs(b)}}
const negV=(o,b)=>o.sal*(1-.08*Math.abs(o.yrs-prefYrs(b)))+o.bonus/(26*o.yrs);
function buyNeed(b){if(!b)return 0;return b.champ?18:rankIdx(b)<10?10:ovr(b)>=78?12:rankIdx(b)<25?5:0}
function openNeg(id,forced){const b=getB(id);if(!b)return;const kind=b.mine?'renew':b.fa?'fa':'buy';if(kind==='buy'&&buyNeed(b)>S.mgr.lvl){toast(`🔒 Gérant niveau ${buyNeed(b)} requis pour convaincre ce boxeur`);return}if(kind==='buy'&&(b.booked||b.inj)){toast('Il est déjà engagé ou blessé');return}
  if(kind!=='renew'&&club().length>=rosterCap()){toast('Écurie pleine : agrandis les vestiaires ou ouvre un gym');return}
  if(!forced&&kind==='renew'&&(b.negCd||0)>S.t){toast(`${sur(b)} ne veut pas renégocier avant ${b.negCd-S.t} sem.`);return}
  const ask=askOf(b,kind),y=ask.yrs>1?'s':'';if(kind==='buy')ask.buy=buyPrice(b);
  S.neg={id,kind,forced:!!forced,ask,offer:{sal:Math.round(ask.sal*.85/10)*10,bonus:Math.round(ask.bonus*.7/100)*100,yrs:ask.yrs},pat:3,mood:0,
    msg:kind!=='renew'?`Je veux ${$(ask.sal)} par semaine sur ${ask.yrs} an${y}, avec ${$(ask.bonus)} à la signature.`:`Pour rester, je veux ${$(ask.sal)} par semaine sur ${ask.yrs} an${y} et ${$(ask.bonus)} de prime.`};
  ui.confirm=null;renderNeg()}
function negReasons(b){const r=[`👥 ${fmtK(fol(b))} abonnés`,`Fiche ${b.w}-${b.l}-${b.d} (${b.ko} KO)`,`Note ${ovr(b)}`];if(b.champ)r.push('Champion '+beltsOf(b).join(' · '));if(b.nchamp)r.push('Champion national');if(!b.fa&&rankIdx(b)<15)r.push('Monde '+rankLabel(b));
  if(b.mine)r.push(`Loyauté ${Math.round(b.loy)}${b.loy>70?' (rabais)':b.loy<40?' (méfiant)':''}`);if(has(b,'diva'))r.push('Diva');r.push(`Préfère ${prefYrs(b)} an${prefYrs(b)>1?'s':''}`);return r}
function negPropose(){const n=S.neg,b=n&&getB(n.id);if(!b||n.pat<=0)return;const o=n.offer;if(o.bonus>S.money){toast('Pas assez d’argent pour cette prime');return}
  const ratio=negV(o,b)/negV(n.ask,b),loyF=b.mine?(.6+b.loy/250):.85;
  if(ratio>=1||(ratio>=.92&&R()<(ratio-.88)/.12*loyF)){negClose(true,o);return}
  n.pat--;
  if(ratio<.85){n.ask={...n.ask,sal:Math.round(n.ask.sal*1.04/10)*10};if(b.mine)b.loy=cl(b.loy-5,0,100);n.mood=-1;
    n.msg=pick(['C’est une blague ? Tu me manques de respect.','Avec tout ce que j’apporte ? Non.','Mon agent rigole encore. Reviens avec du sérieux.'])+` Maintenant c’est ${$(n.ask.sal)}/sem.`}
  else{n.ask={...n.ask,sal:Math.max(o.sal,Math.round((n.ask.sal-(n.ask.sal-o.sal)*.35)/10)*10),bonus:Math.max(o.bonus,Math.round((n.ask.bonus-(n.ask.bonus-o.bonus)*.3)/100)*100)};n.mood=0;
    n.msg=pick(['On se rapproche. Fais un effort.','Pas loin… mais pas encore.','Je peux descendre un peu.'])+` ${$(n.ask.sal)}/sem. et ${$(n.ask.bonus)} de prime.`}
  if(n.pat<=0)n.msg+=' C’est ma dernière offre : à prendre ou à laisser.';renderNeg()}
function negClose(ok,o){const n=S.neg,b=n&&getB(n.id);if(!b){S.neg=null;renderNeg();return}
  if(ok){o=o||n.ask;if(o.bonus>S.money){toast('Pas assez d’argent pour la prime');return}
    if(n.kind==='buy'){if(club().length>=rosterCap()){toast('Écurie pleine');return}if(S.money<o.bonus+n.ask.buy){toast('Pas assez d’argent pour le rachat');return}S.money-=n.ask.buy;Object.assign(b,{mine:true,morale:80,loy:55,plan:'normal',hist:b.hist||[],lvl:Math.max(1,Math.round((ovr(b)-40)/3)),xp:0,sp:0,pal:{5:1,10:1,15:1,20:1}});mcAdd('sign');log(`Rachat du contrat de ${b.name} : ${$(n.ask.buy)}.`,'gold')}
    if(n.kind==='fa'){if(club().length>=rosterCap()){toast('Écurie pleine');return}S.fa=S.fa.filter(x=>x!==b);delete b.fa;Object.assign(b,{mine:true,morale:75,loy:60,plan:'normal',lastFight:S.t,hist:[],lvl:1,xp:0,sp:0});S.boxers.push(b);mcAdd('sign')}
    S.stats=S.stats||{};S.stats.negs=(S.stats.negs||0)+1;S.money-=o.bonus;const gen=o.sal>=n.ask.sal;b.salary=o.sal;b.contract=o.yrs*52;b.raiseAsk=0;b.loy=cl(b.loy+(gen?8:3),0,100);
    log(`${b.name} ${n.kind!=='renew'?'signe':'prolonge'} : ${$(o.sal)}/sem., ${o.yrs} an${o.yrs>1?'s':''}, prime ${$(o.bonus)}.`,'good');toast(n.kind!=='renew'?`${sur(b)} rejoint le club !`:`${sur(b)} prolonge !`)}
  else if(n.kind==='renew'){if(n.forced){const f=upF(b);if(f)cancelFight(f.id);b.mine=false;b.salary=0;b.booked=false;log(`${b.name} quitte le club : fin de contrat.`,'bad');toast(`${sur(b)} quitte le club`)}
    else{b.negCd=S.t+4;if(n.pat<3)b.loy=cl(b.loy-3,0,100)}}
  S.neg=null;ui.confirm=null;if(ui.sheet&&ui.sheet.startsWith('fa:')&&ok)ui.sheet=null;save();render();if(ui.skipF&&!S.event&&!S.queue.length)skipTo(ui.skipF)}
function renderNeg(){const el=document.getElementById('neg');if(!el)return;const n=S&&S.neg,b=n&&getB(n.id);if(!b){if(S&&S.neg)S.neg=null;el.hidden=true;return}
  const o=n.offer,ratio=negV(o,b)/negV(n.ask,b),pc=Math.round(cl(ratio,0,1.3)*100),y=x=>x>1?'s':'';
  const step=(k,lab,v)=>`<div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="small">${lab}</span><div class="row" style="gap:6px;flex-wrap:nowrap"><button class="btn sm" data-a="negs" data-k="${k}" data-v="-1" aria-label="Moins">−</button><b class="num" style="min-width:96px;text-align:center">${v}</b><button class="btn sm" data-a="negs" data-k="${k}" data-v="1" aria-label="Plus">+</button></div></div>`;
  el.innerHTML=`<div class="mcard neg" role="dialog" aria-label="Négociation"><span class="lab">${n.kind==='buy'?'Rachat de contrat':n.kind==='fa'?'Signature':'Renouvellement de contrat'}${n.forced?' · décision obligatoire':''}</span>
    <div class="row" style="margin:10px 0 8px;flex-wrap:nowrap"><div class="av sm ${tcls(b)}">${avatar(b)}</div><div style="min-width:0"><b>${flag(b.nat)} ${esc(b.name)}</b><div class="small">${b.mine?`Contrat : ${b.contract} sem. · ${$(b.salary)}/sem.`:'Agent libre'}</div></div></div>
    ${n.forced?'<p class="small" style="color:var(--warn);margin:0 0 8px">Son contrat se termine cette semaine. Renouvelle-le ou laisse-le partir : la semaine ne peut pas avancer avant ta décision.</p>':''}
    <div class="bubn ${n.mood<0?'bad':''}">« ${esc(n.msg)} »</div>
    <div class="chips s" style="margin:8px 0">${negReasons(b).map(r=>`<span class="chip">${esc(r)}</span>`).join('')}</div>
    ${n.kind==='buy'?`<div class="rstat" style="margin-bottom:6px"><span>Rachat payé à son club</span><b>${$(n.ask.buy)}</b></div>`:''}<div class="rstat"><span>Sa demande</span><b>${$(n.ask.sal)}/sem. · ${n.ask.yrs} an${y(n.ask.yrs)} · prime ${$(n.ask.bonus)}</b></div>
    <div style="display:grid;gap:9px;margin:12px 0"><span class="lab">Ton offre</span>${step('sal','Salaire / sem.',$(o.sal))}${step('bonus','Prime de signature',$(o.bonus))}
      <div class="row" style="justify-content:space-between"><span class="small">Durée</span>${segH('negy',[[1,'1 an'],[2,'2 ans'],[3,'3 ans']],o.yrs)}</div>
      <div><div class="row small" style="justify-content:space-between"><span>Ton offre par rapport à sa demande</span><b style="color:${ratio>=1?'var(--green)':ratio>=.92?'var(--gold)':'#ff7b8b'}">${pc} %</b></div><div class="trk ${ratio>=1?'green':ratio>=.92?'gold':'red'}" style="height:7px;margin-top:4px"><i style="width:${Math.min(100,pc)}%"></i></div></div>
      <div class="row small" style="justify-content:space-between"><span>Patience</span><span style="letter-spacing:3px">${[0,1,2].map(i=>i<n.pat?'●':'○').join('')}</span></div></div>
    <div class="stack" style="gap:8px">${n.pat>0?`<button class="btn pri big" data-a="negp">Proposer</button>`:''}<button class="btn gold" data-a="negok" ${n.ask.bonus>S.money?'disabled':''}>Accepter sa demande · prime ${$(n.ask.bonus)}</button>
      <button class="btn danger" data-a="negno">${n.forced?(ui.confirm==='negno'?'Confirmer : il quitte le club':'Le laisser partir'):'Fermer'}</button></div></div>`;
  el.hidden=false}
/* ================= v11 : INVESTIR ================= */
const ARENA_LV=[null,{n:'Aréna du club',cap:6000,cost:2000000,inc:5000},{n:'Grande aréna du club',cap:15000,cost:8000000,inc:15000},{n:'Dôme du club',cap:30000,cost:25000000,inc:40000}];
function arenaList(){const a=S&&S.arena||0;return a?[{id:'home',n:`${ARENA_LV[a].n} · sans location`,cap:ARENA_LV[a].cap,rent:0,lvl:1},...ARENAS]:ARENAS}
function buildArena(){const l=(S.arena||0)+1;if(l>3)return;const c=ARENA_LV[l].cost;if(S.money<c){toast('Pas assez d’argent');return}S.money-=c;S.arena=l;log(`${ARENA_LV[l].n} construite (${$(c)}) : ${ARENA_LV[l].cap.toLocaleString('fr-CA')} places, galas sans location et ${$(ARENA_LV[l].inc)}/sem. d’événements.`,'gold');toast(`🏟️ ${ARENA_LV[l].n} construite !`)}
const merchCost=()=>100000*Math.pow(2,S.merch||0);
const merchInc=()=>Math.round(mine().reduce((s,b)=>s+folEco(fol(b)),0)*.0015*(S.merch||0));
function buildMerch(){if((S.merch||0)>=5)return;const c=merchCost();if(S.money<c){toast('Pas assez d’argent');return}S.money-=c;S.merch=(S.merch||0)+1;log(`Boutique de produits dérivés niveau ${S.merch} (${$(c)}).`,'good');toast('🛍️ Boutique améliorée')}
const MKT=[{n:'Réseaux sociaux',c:25000,f:2},{n:'Télé et affiches',c:100000,f:3},{n:'Campagne mondiale',c:400000,f:5},{n:'Documentaire',c:2000000,f:7},{n:'Pub au Super Bowl',c:10000000,f:10}];
function doMkt(b,i){return;const m=MKT[i];if(!b||(b.mkt||0)>S.t||S.money<m.c)return;S.money-=m.c;const g=addFol(b,m.c*(1.2+R()*.6)*(1-fol(b)/FOLCAP)*(has(b,'showman')?1.3:1));b.fame=cl(b.fame+m.f,1,100);b.mkt=S.t+4;log(`Campagne « ${m.n} » pour ${b.name} (${$(m.c)}) : +${fmtK(g)} abonnés.`,'good');toast(`📣 +${fmtK(g)} abonnés`)}
function doHeal(b){if(!b||!b.inj)return;const c=15000*b.inj;if(S.money<c)return;S.money-=c;b.inj=0;log(`Soins d’élite pour ${b.name} (${$(c)}) : il est guéri.`,'good');toast('🩺 Guéri !')}
function doCryo(b){if(!b||b.fatigue<5||S.money<8000)return;S.money-=8000;b.fatigue=0;toast('❄️ Forme à 100')}
function buyPrice(b){return Math.round((demandSal(b)*40+b.fame*3000+beltsOf(b).length*400000+(b.nchamp?50000:0)+Math.max(0,ovr(b)-60)*8000)/1000)*1000}
const EXPE=[{id:'esp',n:'Expédition espoirs',c:50000,d:'3 jeunes de 17 à 19 ans à très fort potentiel.'},{id:'eli',n:'Expédition élite',c:250000,d:'2 boxeurs confirmés de haut niveau (note 70 à 80).'}];
function doExpe(id,nat){const E=EXPE.find(x=>x.id===id);if(!E||S.money<E.c)return;S.money-=E.c;const out=[];
  if(id==='esp')for(let i=0;i<3;i++){const b=makeBoxer({div:pick(DIVS).id,nat,ovr:ri(40,48),age:ri(17,19),pot:ri(32,45)});seedRecord(b);b.pts=0;b.fame=cl(b.fame,1,10);out.push(b)}
  else for(let i=0;i<2;i++){const b=makeBoxer({div:pick(DIVS).id,nat,ovr:ri(70,80),age:ri(24,29),pot:ri(2,8)});seedRecord(b);out.push(b)}
  for(const b of out){b.salary=marketSal(b);b.fa=true;b.scout=1;S.fa.unshift(b)}
  log(`${E.n} en ${NAT[nat].n} (${$(E.c)}) : ${out.map(b=>b.name).join(', ')} rejoignent les agents libres.`,'gold');toast(`🔎 ${out.length} boxeurs repérés !`)}

/* ================= v11 : CARRIÈRE ================= */
function changeDiv(b,dir){const i=DIVS.findIndex(d=>d.id===b.div),j=i+dir;if(!b||b.booked||j<0||j>=DIVS.length)return;const old=b.div,lost=beltsOf(b);
  for(const k of lost)S.belts[old][k]=null;b.nchamp=false;b.div=DIVS[j].id;
  if(dir>0){b.pow=cl(b.pow+2,1,99);b.spd=cl(b.spd-2,1,99);b.chin=cl(b.chin-1,1,99)}else{b.spd=cl(b.spd+2,1,99);b.sta=cl(b.sta-3,1,99);b.chin=cl(b.chin-2,1,99)}
  b.pts=Math.round(b.pts*.6);b.fatigue=cl(b.fatigue+15,0,100);ensureBelts(old);ensureAllNat();
  log(`${b.name} ${dir>0?'monte':'descend'} en ${DIVS[j].n}.${lost.length?` Il laisse ${lost.join(', ')} vacant.`:''}`,'gold');toast(`⚖️ ${sur(b)} passe en ${DIVS[j].n}`)}
function hofAdd(b){S.hof=S.hof||[];S.hof.unshift({g:goat(b),cw:crOf(b).cw,def:crOf(b).def,st:crOf(b).st,nm:b.name,nat:b.nat,rec:`${b.w}-${b.l}-${b.d}`,ko:b.ko,tw:b.tw||0,fol:fol(b),t:S.t,tro:(b.troph||[]).length,best:Math.max(b.ovrMax||0,ovr(b)),div:b.div,look:b.look})}
function retireB(b){if(!b||!b.mine||b.booked||b.age<30)return;hofAdd(b);
  for(const k of beltsOf(b))S.belts[b.div][k]=null;b.mine=false;b.retired=true;S.boxers=S.boxers.filter(x=>x!==b);ensureBelts(b.div);ensureAllNat();
  const st=Math.min(5,2+((b.tw||0)>0?2:0)+(ovr(b)>=80?1:0));S.market.unshift({id:'s'+(S.uid++),role:'coach',name:b.name,stars:st,salary:SAL[st],legend:1});
  log(`${b.name} prend sa retraite (${b.w}-${b.l}-${b.d}) et entre au Temple de la renommée. Il est disponible comme entraîneur ${st}★ dans le staff.`,'gold');toast(`🏛️ ${sur(b)} entre au Temple de la renommée`);ui.sheet=null}
function awards(){const m=mine(),yr=Math.floor((S.t-2)/52)+1;if(!m.length)return;const L=[];
  const boy=[...m].sort((a,b)=>((b.yw||0)*3+(b.yko||0)*2+b.fame/20)-((a.yw||0)*3+(a.yko||0)*2+a.fame/20))[0],koy=[...m].sort((a,b)=>(b.yko||0)-(a.yko||0))[0],tot=m.reduce((s,b)=>s+(b.yw||0),0);
  if(boy&&boy.yw){crOf(boy).aw++;S.money+=50000;boy.fame=cl(boy.fame+5,1,100);L.push(`🏆 <b>Boxeur de l’année</b> : ${esc(boy.name)} (${boy.yw} victoire${boy.yw>1?'s':''}). +50 000 $, +5 popularité.`)}
  if(koy&&koy.yko){crOf(koy).aw++;S.money+=25000;koy.fame=cl(koy.fame+3,1,100);L.push(`💥 <b>KO de l’année</b> : ${esc(koy.name)} (${koy.yko} KO). +25 000 $.`)}
  if(tot>=8){S.money+=100000;mgrXP(300);L.push(`👔 <b>Gérant de l’année</b> : ${esc(S.mgrName)} (${tot} victoires du club). +100 000 $, +300 XP.`)}
  if(!L.length)L.push('Pas de récompense cette année. Plus de victoires l’an prochain !');
  for(const b of m){b.yw=0;b.yko=0}S.notice={t:`Gala des récompenses · an ${yr}`,lines:L};log(`Gala des récompenses de l’an ${yr}.`,'gold')}

/* ================= v11 : RIVAUX ================= */
const RIVN=['Titan Boxing Club','Gold Fist Promotions','Iron Ring Gym','Phoenix Boxe','Kings Gym','Northside Fighters'];
function genRivals(){return RIVN.slice(0,4).map((n,i)=>({id:'r'+i,n,nat:pick(Object.keys(NATW)),rep:ri(35,75),money:ri(2,20)*100000,signed:0}))}
function rivalsWeek(){S.rivals=S.rivals||genRivals();
  for(const r of S.rivals){r.rep=cl(r.rep+(R()-.48)*2,10,99);r.money+=ri(5,25)*1000}
  if(S.t%4===1&&S.fa.length>4)for(const r of S.rivals){if(R()>.5)continue;const best=[...S.fa].filter(b=>!b.scout).sort((a,b)=>ovr(b)-ovr(a))[0];if(best){S.fa=S.fa.filter(x=>x!==best);r.signed++;log(`${r.n} signe l’agent libre ${best.name} (${ovr(best)}).`)}}
  if(!S.event&&R()<.07){const c=mine().filter(b=>!b.booked&&ovr(b)>=55);if(c.length){const b=pick(c),r=pick(S.rivals);S.event={k:'bid',b:b.id,v:Math.round(buyPrice(b)*(.9+R()*.7)/1000)*1000,r:r.id}}}}
const rivN=id=>((S.rivals||[]).find(r=>r.id===id)||{n:'Un club rival'}).n;
/* --- défis personnels & épreuves --- */
const MISS={
 w1:{t:1,n:'Premier sang',d:'Gagner un combat officiel',k:'wins',g:1,xp:90},
 ko1:{t:1,n:'Puncheur',d:'Gagner par KO ou TKO',k:'kos',g:1,xp:130},
 unan:{t:1,n:'Leçon de boxe',d:'Gagner par décision unanime',k:'unan',g:1,xp:120},
 acc:{t:1,n:'Tireur d’élite',d:'Gagner avec plus de 35 % de précision',k:'acc35',g:1,xp:120},
 gym2:{t:1,n:'Tournée des gyms',d:'Gagner 2 défis de gym',k:'gymW',g:2,xp:110},
 up1:{t:2,n:'David contre Goliath',d:'Battre un adversaire mieux noté',k:'upsets',g:1,xp:200},
 str3:{t:2,n:'En feu',d:'Gagner 3 combats officiels d’affilée',k:'streak',g:3,xp:240},
 clean:{t:2,n:'Intouchable',d:'Gagner sans aller au tapis, adversaire sous 25 % de précision',k:'clean',g:1,xp:220},
 vol:{t:2,n:'Machine à coups',d:'Lancer 450 coups dans un même combat',k:'vol',g:1,xp:180},
 fast:{t:2,n:'Expéditif',d:'Gagner par arrêt en 3 rounds ou moins',k:'ko3',g:1,xp:260,sp:1},
 come:{t:3,n:'Cœur de champion',d:'Gagner après être allé au tapis',k:'comeback',g:1,xp:320,sp:2},
 w6:{t:3,n:'Régulier',d:'Gagner 6 combats officiels',k:'wins',g:6,xp:350,sp:1},
 ko4:{t:3,n:'Démolisseur',d:'Gagner 4 combats par arrêt',k:'kos',g:4,xp:420,sp:2},
 top10:{t:3,n:'Dans l’élite',d:'Entrer dans le top 10 de sa division',k:'rank10',g:1,xp:400,sp:2},
 title:{t:4,n:'La ceinture',d:'Devenir champion de sa division',k:'titleW',g:1,xp:800,sp:3}};
const ROM=['','I','II','III','IV'];
const STYLEM={agr:['ko1','fast','ko4','vol'],eq:['unan','up1','acc','str3'],pru:['clean','unan','acc','up1'],corps:['vol','ko1','come','str3']};
const MS0=()=>({wins:0,kos:0,streak:0,upsets:0,ko3:0,unan:0,comeback:0,clean:0,gymW:0,titleW:0,acc35:0,vol:0});
function nextMission(b){const taken=new Set([...b.msDone,...b.ms.map(m=>m.id)]),pref=STYLEM[b.style]||[];return Object.keys(MISS).filter(i=>!taken.has(i)).sort((x,y)=>(MISS[x].t-MISS[y].t)||((pref.includes(x)?0:1)-(pref.includes(y)?0:1)))[0]||null}
function initMs(b){if(!b.st)b.st=MS0();if(!b.msDone)b.msDone=[];if(!b.ms)b.ms=[];while(b.ms.length<3){const id=nextMission(b);if(!id)break;const k=MISS[id].k;b.ms.push({id,base:k==='streak'||k==='rank10'?0:(b.st[k]||0)})}}
function msProg(b,m){const M=MISS[m.id];if(M.k==='rank10')return rankIdx(b)<10?1:0;if(M.k==='streak')return Math.min(M.g,b.st.streak);return Math.min(M.g,Math.max(0,(b.st[M.k]||0)-m.base))}
function checkMs(b){initMs(b);let any=0;for(const m of[...b.ms]){const M=MISS[m.id];if(msProg(b,m)>=M.g){b.ms=b.ms.filter(x=>x!==m);b.msDone.push(m.id);addXP(b,M.xp);if(M.sp)b.sp+=M.sp;log(`Défi réussi pour ${b.name} : « ${M.n} ». +${M.xp} XP${M.sp?` et +${M.sp} point${M.sp>1?'s':''} de stats`:''}.`,'gold');toast(`✓ ${sur(b)} : ${M.n}`);any=1}}if(any)initMs(b)}
function recordStats(me,F,won,official){initMs(me);const s=me.st,X=F.A.b===me?F.A:F.B,O=X===F.A?F.B:F.A,stop=F.res.m!=='DEC';
  if(official){if(won){s.wins++;s.streak++;if(stop)s.kos++;if(stop&&F.res.r<=3)s.ko3++;if(ovr(O.b)>ovr(me))s.upsets++;if(F.res.type==='unanime')s.unan++;if(X.kd>0)s.comeback++;if(!X.kd&&O.thr&&O.land/O.thr<.25)s.clean++;if(F.title)s.titleW++}else s.streak=0}
  if(won&&X.thr&&X.land/X.thr>.35)s.acc35++;if(X.thr>=450)s.vol++;
  if(F.ex&&won)s.gymW++}
const MENTORS=['Réjean','Gaston','Marcel','Hector','Rocco','Aldo','Bernard'];
function trialReady(b){return b.gate&&!b.inj&&b.fatigue<=60&&b.lastTrial!==S.t&&!S.queue.length}
function startTrial(id){const b=getB(id);if(!b||!trialReady(b))return;
  const ex=makeBoxer({div:b.div,ovr:ovr(b)+Math.floor(b.lvl/10),age:ri(31,36),pot:0});ex.name=pick(MENTORS)+' '+pick(LAST);ex.nick='Le Mentor';ex.traits=[pick(POS)];
  const F=newFight(b,ex,6,false);F.trial={id:b.id,lvl:b.lvl};beginFight(F)}
const TIERS=[[85,'l','Légende'],[75,'e','Élite'],[65,'g','Or'],[55,'s','Argent'],[0,'b','Bronze']];
const tierOf=b=>{const o=ovr(b);return TIERS.find(t=>o>=t[0])};
const tcls=b=>'t-'+tierOf(b)[1];

/* --- combat interactif --- */
function advise(F){
  const me=F.A,op=F.B,lead=F.cards[0][0]-F.cards[0][1],c=S.staff.coach;
  if(!c)return{s:null,why:'Personne dans ton coin. Engage un entraîneur-chef pour recevoir des conseils.'};
  if(c.stars===1&&R()<.4)return{s:null,why:'Il cherche ses mots… Un meilleur entraîneur donnerait de vrais conseils.'};
  if(me.hp<35)return{s:'pru',why:'Tu es touché ! Couvre-toi et survis.'};
  if(op.hp<35)return{s:'agr',why:'Il est ébranlé ! Va chercher l’arrêt !'};
  if(me.en<35)return{s:'pru',why:'Tu manques d’air. Ralentis et récupère.'};
  if(op.en<40)return{s:'agr',why:'Il est vidé. Mets la pression !'};
  if(F.r>=F.rounds-2&&lead<0)return{s:'agr',why:'On perd aux points. Il faut prendre des risques.'};
  if(F.r>=F.rounds-2&&lead>2)return{s:'pru',why:'Tu mènes. Boxe intelligemment, pas de bêtises.'};
  {const pl=F.stage==='live'?F.bs:F.bsNext;if(pl&&c.stars>=2&&R()<.5+c.stars*.1)return{s:CNT[pl],why:`Il part en mode ${STRAT[pl].n}. Réponds en ${STRAT[CNT[pl]].n} !`}}
  if(op.b.def>me.b.spd+6)return{s:'corps',why:'Sa garde est fermée en haut. Travaille au corps.'};
  if(c.stars>=3&&op.b.style==='agr')return{s:has(me.b,'contre')?'eq':'pru',why:'C’est un cogneur. Reste mobile et punis ses entrées.'};
  return{s:'eq',why:'Reste sur le plan de match.'};
}
function openFight(fid){
  const f=S.fights.find(x=>x.id===fid);if(!f){S.queue=S.queue.filter(x=>x!==fid);return}
  {const a0=getB(f.a);if(a0&&a0.mine&&a0.inj>0){S.queue=S.queue.filter(x=>x!==fid);if((f.post||0)<2){postpone(fid);toast(`🩹 ${sur(a0)} est blessé : combat reporté de 3 semaines`)}else{const b0=getB(f.b);S.fights=S.fights.filter(x=>x!==f);a0.booked=false;if(b0)b0.booked=false;log(`Combat de ${a0.name} annulé : il est encore blessé.`,'bad');toast(`🩹 ${sur(a0)} toujours blessé : combat annulé`)}save();render();return}}
  const a=getB(f.a),F=newFight(a,getB(f.b),f.rounds,f.title);F.f=f;F.ntitle=!!f.ntitle;F.rival=a.rival===f.b;applyCamp(F,f);if(f.press==='prov')F.B.motiv=1;F.wi=weighIn(f,a);if(!F.wi.ok)F.A.hp=92;beginFight(F);
}
function startChallenge(){
  const g=S.gyms[ui.gym],me=getB(ui.gymBoxer);if(!g||!me||!canChallenge(me)||g.beaten>=3)return;
  const op=g.m[g.beaten];op.div=me.div;op.fatigue=10;op.morale=70;
  const F=newFight(me,op,g.beaten===2?8:6,false);F.ex={g:ui.gym};beginFight(F);
}
function canChallenge(b){return!b.inj&&b.fatigue<=60&&b.lastCh!==S.t&&!S.queue.length}
const mkVis=()=>({pt:-1,pd:240,arm:0,body:0,hit:-1,dodge:-1,block:-1,kdT:-1,kdHold:0,ko:false});
function setDisp(F){F.disp={hp:[F.A.hp,F.B.hp],en:[F.A.en,F.B.en]}}
const coachName=()=>S.staff.coach?S.staff.coach.name.split(' ')[0]:'Ton coin';
function beginFight(F){
  try{tutFightAdj(F)}catch(e){}F.stage='intro';F.adv=advise(F);if(F.adv.s){F.strat=F.adv.s;F.ustr=1}bNext(F);
  F.odds=S.set.odds?oddsRound(F,95):null;F.speed=S.set.speed||1;F.clock=0;
  setDisp(F);F.vis={A:mkVis(),B:mkVis()};AN=null;FX=[];
  ui.fight=F;buildFight();
}
const CNT={pru:'agr',agr:'pru',eq:'corps',corps:'eq'};
function bStrat(F){const x=F.B,y=F.A;if(F.ph===0||!F.bs){F.bs=F.bsNext||aiStrat(x,y,F);F.bsNext=null}if(x.hp<35||x.en<25)return'pru';if(y.hp<35||y.en<30)return'agr';return F.bs}
function bNext(F){if(!F.done&&!F.bsNext)F.bsNext=aiStrat(F.B,F.A,F)}
function curStrat(F){return S.set.autoAdv&&F.adv&&F.adv.s?F.adv.s:F.ustr?F.strat:aiStrat(F.A,F.B,F)}
function goRound(){const F=ui.fight;if(!F||F.done||AN)return;F.stage='live';if(F.adv)showBub(`${coachName()} : ${F.adv.why}`);nextPhase()}
function nextPhase(){
  const F=ui.fight;if(!F||F.done)return;
  F.strat=curStrat(F);
  stepPhase(F,F.strat,bStrat(F));if(F.ph===0)bNext(F);
  const ev=F.ev;
  if(!F.done){F.adv=advise(F);if(F.ph!==0&&F.adv.s&&F.adv.s!==F.strat)showBub(`${coachName()} : ${F.adv.why}`)}
  if(S.set.anim){animatePhase(ev,afterPhase);updateFight()}else{setDisp(F);afterPhase()}
}
function afterPhase(){
  const F=ui.fight;if(!F)return;setDisp(F);
  if(F.done){F.stage='done';F.odds=null;updateFight();return}
  if(F.ph===0){F.stage='between';F.vis.A.kdT=F.vis.B.kdT=-1;if(S.set.odds)F.odds=oddsRound(F,50);updateFight();return}
  if(S.set.odds)F.odds=oddsRound(F,40);
  nextPhase();
}
function settle(F){F.vis={A:mkVis(),B:mkVis()};if(F.done&&F.res.m!=='DEC'){const v=F.vis[F.res.w==='A'?'B':'A'];v.ko=true;v.kdT=performance.now()-2000;F.koTxt=F.res.m}setDisp(F)}
function skipRound(){
  const F=ui.fight;if(!F||F.done)return;AN=null;
  do{stepPhase(F,curStrat(F),bStrat(F));if(!F.done)F.adv=advise(F)}while(F.ph!==0&&!F.done);bNext(F);
  settle(F);F.stage=F.done?'done':'between';F.odds=!F.done&&S.set.odds?oddsRound(F,50):null;updateFight();
}
function simAll(){
  const F=ui.fight;if(!F)return;AN=null;
  while(!F.done){stepPhase(F,curStrat(F),bStrat(F));if(!F.done)F.adv=advise(F)}
  settle(F);F.stage='done';F.odds=null;updateFight();
}
function fightDone(){
  const F=ui.fight;if(!F||!F.done)return;AN=null;let tourNext=false;
  if(F.online){onDone(F)}else if(F.tour){tourNext=tourAfter(F)}else if(F.trial){const me=F.A.b,won=F.res.w==='A';me.fatigue=cl(me.fatigue+20,0,100);me.lastTrial=S.t;recordStats(me,F,won,false);
    if(won){mcAdd('trial');me.pal=me.pal||{};me.pal[F.trial.lvl]=1;me.gate=0;me.sp+=3;me.morale=cl(me.morale+10,0,100);log(`${me.name} réussit l’épreuve du niveau ${F.trial.lvl} ! +3 points de stats. La progression reprend.`,'gold');toast('🏅 Épreuve réussie !');addXP(me,1)}
    else{me.morale=cl(me.morale-5,0,100);log(`${me.name} échoue à l’épreuve du niveau ${F.trial.lvl}. Nouvel essai possible la semaine prochaine.`,'bad')}
  }else if(F.ex){
    const g=S.gyms[F.ex.g],me=F.A.b,won=F.res.w==='A',tier=F.ex.g+1;
    me.fatigue=cl(me.fatigue+22,0,100);me.lastCh=S.t;if(F.A.hp<30&&R()<.25)me.inj=ri(1,2);
    me.morale=cl(me.morale+(won?8:-6),0,100);
    const xp=Math.round((won?40+tier*12:15)*cl(1+(ovr(F.B.b)-ovr(me))*.05,.3,1.6));addXP(me,xp);recordStats(me,F,won,false);
    if(won){
      const cash=tier*1500;S.money+=cash;g.beaten++;mcAdd('gym');mgrXP(30);
      log(`Défi gagné chez ${g.name} : ${F.res.txt}. +${$(cash)}, +${xp} XP.`,'good');
      if(g.beaten===3){const bonus=tier*4000;S.money+=bonus;S.stats.badges++;mgrXP(100);log(`BADGE obtenu : ${g.name} ! +${$(bonus)}.`,'gold');toast(`🏅 Badge ${g.name} !`)}
    }else log(`Défi perdu chez ${g.name} : ${F.res.txt}. +${xp} XP quand même.`,'bad');
  }else{
    applyResult(F,F.f);
    S.fights=S.fights.filter(x=>x!==F.f);S.queue=S.queue.filter(x=>x!==F.f.id);
  }
  ui.fight=null;document.getElementById('fx').hidden=true;if(RAF){cancelAnimationFrame(RAF);RAF=0}dispose3();
  save();render();
  if(tourNext){startTourFight();return}
  if(S.queue.length&&!S.event)openFight(S.queue[0]);
  else if(ui.skipF&&!S.event&&!S.neg)skipTo(ui.skipF);
}
function setCamp(fid,k){
  const f=S.fights.find(x=>x.id===fid);if(!f||f.week<=S.t||(f.camp||'std')===k)return;
  const c=CAMPS[k].c;if(S.money<c){toast('Pas assez d’argent');return}
  S.money-=c;f.camp=k;log(`Camp « ${CAMPS[k].n} » pour ${getB(f.a).name}${c?` (${$(c)})`:''}.`);toast(`Camp : ${CAMPS[k].n}`);
}


/* ================= v44 : MODE EN LIGNE ================= */
const SB_URL='https://hlqhasvorjdutyhyibao.supabase.co',SB_KEY='sb_publishable_PiCmbjESB8hXaSfsFVdAmQ_yVeO34Ci',ONK='cr_acct';
let ON=null;try{ON=JSON.parse(localStorage.getItem(ONK)||'null');if(!ON||typeof ON.token!=='string'||!/^[0-9a-f]{64}$/.test(ON.token))ON=null}catch(e){ON=null}
try{localStorage.removeItem('cr_online')}catch(e){}
const onSave=()=>{try{ON?localStorage.setItem(ONK,JSON.stringify(ON)):localStorage.removeItem(ONK)}catch(e){}};
const ONERR={session:'Ta session a expiré. Reconnecte-toi.',login:'Nom d’utilisateur ou mot de passe incorrect.',locked:'Trop d’essais ratés. Réessaie dans 15 minutes.',username:'Nom d’utilisateur : 3 à 16 caractères (lettres, chiffres, _ . -).',password:'Mot de passe : au moins 8 caractères, différent du nom.',taken:'Ce nom d’utilisateur est déjà pris.',captcha:'Vérification anti-robot échouée. Réessaie.',rate:'Trop de tentatives. Réessaie plus tard.',code:'Aucun joueur avec ce code.',self:'C’est ton propre code 😅',max:'Tu as déjà 100 amis.',opp:'Cet adversaire n’est plus disponible.',slow:'Attends quelques secondes entre deux combats.',daily:'Maximum 3 combats par jour contre le même boxeur.',dailyall:'Maximum 80 combats en ligne par jour.',roster:'Écurie trop grosse.',full:'Tu as déjà un boxeur dans chaque catégorie.',divtaken:'Tu as déjà un boxeur dans cette catégorie.',div:'Catégorie invalide.',bname:'Nom du boxeur trop court.',stats:'Répartition des points invalide.',pts:'Pas assez de points.',nobox:'Boxeur introuvable.',coins:'Pas assez de 💰.',slot:'Emplacement verrouillé.',noopp:'Personne de disponible pour l’instant.',nomatch:'Combat introuvable.',quest:'Défi pas encore réussi.',claimed:'Déjà réclamé.',injured:'Ton boxeur est blessé : il doit se reposer.',tired:'Ton boxeur est épuisé : laisse-le se reposer.',campon:'Un camp est déjà actif.',camp:'Camp invalide.',style:'Choix invalide.',noprof:'Profil introuvable.',inclub:'Tu es déjà dans un club.',clubname:'Nom (3+ lettres) et tag (2 à 4 lettres ou chiffres) requis.',clubtaken:'Ce nom ou ce tag est déjà pris.',nodiv:'Pas de boxeur dans cette catégorie.',invite:'Ce défi a expiré.',tourdone:'Ce boxeur a déjà fait le tournoi cette semaine.',incamp:'Ton boxeur est en camp d’entraînement.',campcd:'Un seul camp toutes les 12 heures.',rank:'Rang pas encore atteint.',nocamp:'Aucun camp en cours.',item:'Article inconnu.',full:'Ce boxeur a déjà toute son énergie.',noinj:'Ce boxeur n’est pas blessé.',sponson:'Tu as déjà un commanditaire. Termine ou quitte ton contrat.',norole:'Ton rôle dans le club ne permet pas ça.',noclub:'Tu n’es pas dans un club.',leglock:'Bats d’abord la légende précédente.',legcd:'Cette légende se repose : reviens dans quelques jours.',legday:'Ce boxeur a déjà affronté cette légende aujourd’hui.',waron:'Ton club est déjà en guerre.',nowar:'Aucun club disponible pour une guerre.',owned:'Tu l’as déjà.',paysoon:'Les achats arrivent bientôt !',premonly:'Article premium : débloque-le dans la boutique.',geo:'Région invalide.',geowait:'Tu pourras changer de région 7 jours après ton dernier changement.',nobelt:'Ce boxeur n’a plus la ceinture.',building:'Une construction est déjà en cours.',gymmax:'Déjà au niveau maximum.',chatempty:'Message vide.'};
async function rpc(fn,body){
  let r;try{r=await fetch(SB_URL+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(body||{}),cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'})}catch(e){throw new Error('Pas de connexion Internet.')}
  const t=await r.text();let j=null;try{j=t?JSON.parse(t):null}catch(e){}
  if(!r.ok){const m=(j&&j.message)||'';if(m==='session'){ON=null;onSave()}throw new Error(ONERR[m]||'Le serveur ne répond pas. Réessaie.')}
  if(j&&j.error)throw new Error(ONERR[j.error]||'Erreur.');
  return j;
}
/* preuve de travail anti-robot (calcul SHA-256 dans un worker) */
function powSolve(nonce,bits){const K=new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);const W=new Uint32Array(64),M=new Uint8Array(64),mask=(0xffffffff<<(32-bits))>>>0;for(let i=0;i<nonce.length;i++)M[i]=nonce.charCodeAt(i);for(let c=0;c<6e7;c++){const s=String(c),L=nonce.length+s.length;for(let i=0;i<s.length;i++)M[nonce.length+i]=s.charCodeAt(i);M[L]=0x80;for(let i=L+1;i<62;i++)M[i]=0;M[62]=(L*8)>>>8;M[63]=(L*8)&255;for(let i=0;i<16;i++)W[i]=(M[i*4]<<24)|(M[i*4+1]<<16)|(M[i*4+2]<<8)|M[i*4+3];for(let i=16;i<64;i++){const a=W[i-15],b=W[i-2];W[i]=(((a>>>7|a<<25)^(a>>>18|a<<14)^(a>>>3))+W[i-7]+((b>>>17|b<<15)^(b>>>19|b<<13)^(b>>>10))+W[i-16])|0}let A=0x6a09e667,B=0xbb67ae85,C=0x3c6ef372,D=0xa54ff53a,E=0x510e527f,F=0x9b05688c,G=0x1f83d9ab,H=0x5be0cd19;for(let i=0;i<64;i++){const t1=(H+((E>>>6|E<<26)^(E>>>11|E<<21)^(E>>>25|E<<7))+((E&F)^(~E&G))+K[i]+W[i])|0,t2=(((A>>>2|A<<30)^(A>>>13|A<<19)^(A>>>22|A<<10))+((A&B)^(A&C)^(B&C)))|0;H=G;G=F;F=E;E=(D+t1)|0;D=C;C=B;B=A;A=(t1+t2)|0}if((((A+0x6a09e667)>>>0)&mask)===0)return s}return null};
function powRun(nonce,bits){return new Promise(res=>{
  try{const u=URL.createObjectURL(new Blob([powSolve.toString()+';onmessage=e=>postMessage(powSolve(e.data[0],e.data[1]))'],{type:'text/javascript'})),w=new Worker(u);
    w.onmessage=e=>{w.terminate();URL.revokeObjectURL(u);res(e.data)};w.onerror=()=>{w.terminate();res(powSolve(nonce,bits))};w.postMessage([nonce,bits])}
  catch(e){setTimeout(()=>res(powSolve(nonce,bits)),30)}})}
async function onCaptcha(kind){const c=await rpc('cr_challenge',{p_kind:kind});const sol=await powRun(c.nonce,c.bits);if(sol==null)throw new Error(ONERR.captcha);return{p_ch:c.id,p_sol:sol}}
/* nettoyage des données reçues (défense en profondeur) */
const ON_DIV=['mouche','coq','plume','leger','sleger','welter','moyen','milourd','lourd'];
const onI=(v,a,b,d)=>typeof v==='number'&&isFinite(v)?Math.max(a,Math.min(b,Math.round(v))):d;
const onT=(v,n)=>String(v==null?'':v).replace(/[<>&"'`\\/=(){}\[\];]/g,'').slice(0,n).trim();
function onClean(o){o=o||{};const L=o.look||{};return{id:/^[A-Za-z0-9_]{1,24}$/.test(o.id)?o.id:'x',name:onT(o.name,40)||'Boxeur',nick:onT(o.nick,30),nat:/^[A-Z]{2}$/.test(o.nat)&&NAT[o.nat]?o.nat:'CA',div:ON_DIV.includes(o.div)?o.div:'moyen',age:onI(o.age,16,50,25),
  pow:onI(o.pow,1,99,50),spd:onI(o.spd,1,99,50),def:onI(o.def,1,99,50),sta:onI(o.sta,1,99,50),chin:onI(o.chin,1,99,50),w:onI(o.w,0,999,0),l:onI(o.l,0,999,0),d:onI(o.d,0,999,0),ko:onI(o.ko,0,999,0),fame:onI(o.fame,0,100,1),
  style:['agr','eq','pru','corps'].includes(o.style)?o.style:'eq',traits:(Array.isArray(o.traits)?o.traits:[]).filter(t=>typeof t==='string'&&TRAITS[t]).slice(0,6),belts:(Array.isArray(o.belts)?o.belts:[]).filter(t=>BELTS.includes(t)).slice(0,5),
  look:{skin:onI(L.skin,0,5,2),hair:onI(L.hair,0,5,1),hc:onI(L.hc,0,5,1),beard:onI(L.beard,0,3,0),scar:L.scar===true,tr:onI(L.tr,0,8,0)}}}
const onP=p=>p&&Object.assign({},p,{name:onT(p.name,16),club:onT(p.club,30),code:onT(p.code,8),elo:onI(p.elo,0,9999,1000),w:onI(p.w,0,99999,0),l:onI(p.l,0,99999,0),d:onI(p.d,0,99999,0),kos:onI(p.kos,0,99999,0),hw:onI(p.hw,0,9999,0),hl:onI(p.hl,0,9999,0),hd:onI(p.hd,0,9999,0),divs:(Array.isArray(p.divs)?p.divs:[]).filter(d=>ON_DIV.includes(d))});
let onB=o=>o&&Object.assign(onClean(o),{id:String(o.id||'').replace(/[^0-9a-f-]/g,'').slice(0,36),pid:String(o.pid||'').replace(/[^0-9a-f-]/g,'').slice(0,36),ovr:onI(o.ovr,1,99,50),lvl:onI(o.lvl,1,40,1),xp:onI(o.xp,0,99999,0),need:onI(o.need,1,99999,65),pts:onI(o.pts,0,999,0),rating:onI(o.rating,0,9999,1000),rank:onI(o.rank,1,99999,999),streak:onI(o.streak,-999,999,0),mgr:onT(o.mgr,16),melo:onI(o.melo,0,9999,1000),bot:o.bot===true,abil:(Array.isArray(o.abil)?o.abil:[]).filter(k=>typeof k==='string'&&ONAB[k]).slice(0,3),slots:onI(o.slots,1,3,1),fat:onI(o.fat,0,100,0),inj:onI(o.inj,0,99999,0),campleft:onI(o.campleft,0,99999,0),campcd:onI(o.campcd,0,999999,0),camp:ONCAMP[o.camp]?o.camp:null,cos:{glove:o.cos&&/^[0-9GN]$/.test(o.cos.glove)?o.cos.glove:null,ent:o.cos&&ENT[o.cos.ent]?o.cos.ent:null}});
const onUi=()=>ui.on||(ui.on={sub:'ecurie',auth:'signup',home:null,rank:{},rdiv:null,busy:false,msg:'',err:'',acct:false,box:null,opps:null,up:null,cr:null,top:null});
const onR=()=>{if(ui.tab==='online'&&!ui.fight&&!ui.menu)render()};
const ONTIER=r=>r>=1400?['💎','Élite']:r>=1200?['🥇','Prétendant']:r>=1050?['🥈','Pro']:r>=950?['🥉','Espoir']:['🟤','Débutant'];
const onFights=b=>b.w+b.l+b.d;
const onRankTxt=b=>onFights(b)<3?'Non classé':b.rank===1?'👑 Champion':'#'+b.rank;
async function onLoad(force){
  const u=onUi();if(!ON||u.busy)return;if(!force&&u.home&&Date.now()-u.last<30000)return;
  u.busy=true;u.err='';onR();
  try{const h=await rpc('cr_ob_mine',{p_token:ON.token});if(LANG&&!window._langSent){window._langSent=1;rpc('cr_set_lang',{p_token:ON.token,p_lang:LANG}).catch(()=>{})}u.home={me:onP(h.me),boxers:(h.boxers||[]).map(onB),friends:(h.friends||[]).map(onP),feed:h.feed||[]};u.home.me.coins=onI(h.me.coins,0,9e7,0);u.last=Date.now();u.rank={};u.top=null;u.quests=null;if(!u.dly)setTimeout(()=>dlyLoad(true),900)}
  catch(e){u.err=e.message}
  u.busy=false;onR();
}
async function onQuests(){const u=onUi();u.qbusy=true;try{const r=await rpc('cr_quests',{p_token:ON.token});u.quests={dleft:onI(r.dleft,0,9e6,0),wleft:onI(r.wleft,0,9e6,0),list:(r.list||[]).map(q=>({id:onT(q.id,20),t:onT(q.t,60),p:q.p==='w'?'w':'d',n:onI(q.n,1,999,1),v:onI(q.v,0,99999,0),c:onI(q.c,0,9999,0),done:q.done===true}))};if(u.home)u.home.me.coins=onI(r.coins,0,9e7,u.home.me.coins)}catch(e){u.err=e.message;u.quests={dleft:0,wleft:0,list:[]}}u.qbusy=false;onR()}
async function onClaim(id){try{const r=await rpc('cr_quest_claim',{p_token:ON.token,p_q:id});toast(`🎯 Défi réussi : +${onI(r.gain,0,9999,0)} 💰`);await onQuests()}catch(e){toast(e.message)}}
async function onClubTop(){const u=onUi();try{u.ctop=((await rpc('cr_club_top',{}))||[]).map(clubP)}catch(e){u.err=e.message;u.ctop=[]}onR()}
async function onRankLoad(dv){const u=onUi();try{u.rank[dv]=((await rpc('cr_ob_rank',{p_div:dv}))||[]).map(onB)}catch(e){u.err=e.message;u.rank[dv]=[]}onR()}
async function onTop(){const u=onUi();try{u.top=((await rpc('cr_top',{}))||[]).map(onP)}catch(e){u.err=e.message;u.top=[]}onR()}
async function onOpps(bid){const u=onUi();u.box=bid;u.opps=null;onR();
  try{const r=await rpc('cr_ob_opps',{p_token:ON.token,p_box:bid});u.opps={friends:(r.friends||[]).map(onB),match:(r.match||[]).map(onB)}}catch(e){u.opps={friends:[],match:[],err:e.message}}onR()}
const onVal=id=>{const e=document.getElementById(id);return e?e.value:''};
async function onAuth(kind){
  const u=onUi(),user=onVal('on-user').trim(),pass=onVal('on-pass'),hp=onVal('on-web');
  if(!/^[A-Za-z0-9_.-]{3,16}$/.test(user)){u.err=ONERR.username;onR();return}
  if(pass.length<8){u.err=ONERR.password;onR();return}
  if(kind==='signup'&&pass!==onVal('on-pass2')){u.err='Les deux mots de passe ne sont pas pareils.';onR();return}
  u.busy=true;u.err='';u.msg='🤖 Vérification anti-robot…';onR();
  try{const cap=await onCaptcha(kind);u.msg=kind==='signup'?'Création du compte…':'Connexion…';onR();
    const r=kind==='signup'?await rpc('cr_signup',{p_user:user,p_pass:pass,p_club:'',p_hp:hp,...cap}):await rpc('cr_login',{p_user:user,p_pass:pass,...cap});
    ON={token:r.token,name:onT(r.me.name,16)};onSave();u.busy=false;u.msg='';u.home=null;toast(kind==='signup'?'🎉 Compte créé !':'👋 Content de te revoir !');cloudSync();await onLoad(true)}
  catch(e){u.busy=false;u.msg='';u.err=e.message;onR()}
}
async function onLogout(){const t=ON&&ON.token;ON=null;onSave();ui.on=null;onR();try{if(t)await rpc('cr_logout',{p_token:t})}catch(e){}toast('Déconnecté')}
async function onPass(){const o=onVal('on-old'),n=onVal('on-new');if(n.length<8){toast(ONERR.password);return}
  try{await rpc('cr_password',{p_token:ON.token,p_old:o,p_new:n});toast('🔒 Mot de passe changé');onUi().acct=false;onR()}catch(e){toast(e.message)}}
async function onAddFriend(){
  const c=onVal('on-code').trim().toUpperCase();if(c.length<4){toast('Entre le code de ton ami');return}
  try{const f=onP(await rpc('cr_add_friend',{p_token:ON.token,p_code:c}));toast(`🤝 ${f.name} est ton ami !`);await onLoad(true)}catch(e){toast(e.message)}
}
async function onShareCode(){
  const code=onUi().home&&onUi().home.me.code;if(!code)return;const txt=`Viens boxer contre moi sur FIGHT DYNASTY 🥊 ! Mon code ami : ${code}\n${location.origin}/`;
  try{if(navigator.share){await navigator.share({text:txt});return}}catch(e){return}
  try{await navigator.clipboard.writeText(txt);toast('Code copié !')}catch(e){toast('Ton code : '+code)}
}
/* --- création d'un boxeur en ligne --- */
const ONSTAT=[['pow','Puissance'],['spd','Vitesse'],['def','Défense'],['sta','Cardio'],['chin','Menton']];
const onRandLook=()=>({skin:ri(0,5),hair:ri(0,5),hc:ri(0,5),beard:R()<.45?ri(1,3):0,scar:R()<.15,tr:ri(0,6)});
function onNewCr(dv){const nat='';return{div:dv,nat,name:natName('US'),style:'eq',look:onRandLook(),st:{pow:40,spd:40,def:40,sta:40,chin:40}}}
const onLeft=c=>240-ONSTAT.reduce((a,[k])=>a+c.st[k],0);
async function onCreate(){
  const u=onUi(),c=u.cr;if(!c)return;c.name=onVal('on-bname').trim()||c.name;
  if(!c.nat){toast('Choisis le pays de ton boxeur');return}
  if(onLeft(c)!==0){toast(`Place encore ${onLeft(c)} point${onLeft(c)>1?'s':''}`);return}
  u.busy=true;onR();
  try{const b=onB(await rpc('cr_ob_create',{p_token:ON.token,p_div:c.div,p_name:c.name,p_nat:c.nat,p_style:c.style,p_look:c.look,p_stats:c.st}));
    u.cr=null;u.busy=false;toast(`🥊 ${b.name} rejoint ton écurie en ligne !`);await onLoad(true)}
  catch(e){u.busy=false;toast(e.message);onR()}
}
async function onSpend(){
  const u=onUi(),p=u.up;if(!p)return;const add={};let n=0;for(const[k]of ONSTAT){add[k]=p.add[k]||0;n+=add[k]}if(!n)return;
  try{await rpc('cr_ob_spend',{p_token:ON.token,p_box:p.id,p_add:add});u.up=null;toast('💪 Points placés !');await onLoad(true)}catch(e){toast(e.message)}
}
async function onRetire(id){try{await rpc('cr_ob_retire',{p_token:ON.token,p_box:id});ui.confirm=null;toast('Boxeur retiré');await onLoad(true)}catch(e){toast(e.message)}}
/* --- combat --- */
function onFighter(b,mine){const c=onClean(b);if(b.camp&&ONCAMP[b.camp])c[b.camp]=Math.min(99,c[b.camp]+4);return Object.assign(c,{rating:b.rating||1000,glv:b.cos&&b.cos.glove!=null?GLV[b.cos.glove]:null,ent:b.cos&&b.cos.ent||null,traits:(b.abil||[]).slice(),id:'on_'+b.id,mine,fatigue:10+Math.round((b.fat||0)*.4),morale:70,salary:0,hist:[],pot:0,lvl:b.lvl||1,xp:0,sp:0,champ:false,pts:0,retired:false,booked:false,inj:0})}
function onStart(oid){
  const u=onUi(),mb=u.home&&u.home.boxers.find(b=>b.id===u.box),op=u.foundB&&u.foundB.id===oid?u.foundB:u.opps&&u.opps.friends.find(x=>x.id===oid);
  if(!mb||!op){toast('Adversaire introuvable');return}
  const title=u.legF==null&&op.rank===1&&onFights(op)>=3&&onFights(mb)>=2,f0=FORM;FORM=.08;let F;try{F=newFight(onFighter(mb,true),onFighter(op,false),title||u.legF!=null?12:10,false)}finally{FORM=f0}
  F.cut=1;F.online={fid:op.id,bid:mb.id,n:op.mgr,title,bn:op.name,tour:u.tourF||null,belt:u.beltF||null,legend:u.legF??null};u.tourF=null;u.beltF=null;u.legF=null;u.found=null;u.list=false;beginFight(F);
}
async function onDone(F){
  if(F.replay)return;
  rpSave(F);
  if(F.live){clearInterval(F.lvT);const u=onUi();u.opps=null;u.box=null;u.found=null;u.foundB=null;u.skip=null;u.list=false;await onLoad(true);return}
  const r=F.res,res=r.w==='A'?'W':r.w==='B'?'L':'D',o=F.online,u=onUi();
  try{const x=o.legend!=null?await rpc('cr_legend_report',{p_token:ON.token,p_box:o.bid,p_idx:o.legend,p_res:res,p_method:r.m==='KO'||r.m==='TKO'?r.m:'DEC',p_rnd:r.r||0}):await rpc('cr_ob_report',{p_token:ON.token,p_box:o.bid,p_opp:o.fid,p_res:res,p_method:r.m==='KO'||r.m==='TKO'?r.m:'DEC',p_rnd:r.r||0,p_rx:onI(F.rxOk,0,12,0)});
    const ups=onI(x.ups,0,40,0);if(x.tour){const t=x.tour;setTimeout(()=>toast(t.champ?`🏆 TU GAGNES LE TOURNOI ! +${onI(t.prize,0,9999,0)} 💰 + trophée`:t.won?`✅ Qualifié pour la ${TRN[onI(t.round,0,2,0)+1].toLowerCase()} !`:`Éliminé du tournoi${t.prize?` · +${onI(t.prize,0,9999,0)} 💰`:''}`),2600);u.tour=null}if(x.inj)setTimeout(()=>toast(`🩹 Ton boxeur est blessé : ${onTime(onI(x.injm,1,999,240)*60)} de repos`),5200);if(onI(x.sbonus,0,999,0))setTimeout(()=>toast(`🔥 Série de ${onI(x.streak,0,999,0)} victoires ! +${onI(x.sbonus,0,999,0)} 💰 bonus`),1800);else if(res==='L'&&u.home&&onI(u.home.me.ostreak,0,999,0)>=2)setTimeout(()=>toast('💨 Ta série de victoires est terminée'),1800);if(x.legend){const lg=x.legend,L=LEG[onI(lg.idx,0,9,0)];u.leg=null;if(lg.prize)setTimeout(()=>legWheel(onI(lg.idx,0,9,0),String(lg.prize),onI(lg.gain,0,99999,0),lg.abil,lg.first,lg.title),900)}if(o.belt&&res==='W')setTimeout(()=>toast(`🏅 NOUVEAU CHAMPION · ${o.belt} !`),2400);if(o.belt){u.gb={}}u.pass=null;if(u.home)u.home.me.coins=(u.home.me.coins||0)+onI(x.coins,0,9999,0);toast(`${res==='W'?(x.title?'👑 NOUVEAU CHAMPION !':'🏆 Victoire'):res==='L'?'❌ Défaite':'🤝 Nul'} · +${onI(x.xp,0,999,0)} XP · ELO ${x.d>=0?'+':''}${onI(x.d,-99,99,0)} · +${onI(x.coins,0,9999,0)} 💰${F.rxN?` · réactions ${F.rxOk||0}/${F.rxN}`:''}${ups?` · ⬆️ Niveau ${onI(x.box&&x.box.lvl,1,40,1)} (+${ups*4} pts)`:''}`)}
  catch(e){toast('Résultat non envoyé : '+e.message)}
  u.opps=null;u.box=null;u.found=null;u.foundB=null;u.skip=null;u.list=false;await onLoad(true);
}
/* --- affichage --- */
const onDiv=d=>(DIVS.find(x=>x.id===d)||{n:'?'}).n;
const onRec=p=>`${p.w}-${p.l}-${p.d}`;
const onAgo=t=>{const m=Math.round((Date.now()-new Date(t))/60000);return!(m>=0)?'':m<2?'en ligne':m<60?`vu il y a ${m} min`:m<1440?`vu il y a ${Math.round(m/60)} h`:`vu il y a ${Math.round(m/1440)} j`};
const onTag=p=>p.bot?' <span class="chip" style="font-size:10px">IA</span>':'';
const ONIN='width:100%;font:inherit;font-size:16px;color:var(--ink);background:rgba(0,0,0,.4);border:1px solid var(--line2);border-radius:12px;padding:12px 13px';
const onBar=(v,max,cls)=>`<div class="trk ${cls||'gold'}" style="margin:4px 0"><i style="width:${Math.max(0,Math.min(100,Math.round(v/max*100)))}%"></i></div>`;
function vOnAuth(){const u=onUi(),su=u.auth==='signup';
  return`<div class="panel"><div style="margin-bottom:12px">${segH('onauth',[['signup','Créer un compte'],['login','Se connecter']],u.auth)}</div>
    <p class="lede" style="margin:0 0 12px">${su?'Bâtis une écurie en ligne : un boxeur par catégorie, que tu fais progresser combat après combat contre de vrais gérants. Ton compte marche sur n’importe quel téléphone.':'Content de te revoir !'}</p>
    <div class="stack" style="gap:10px">
    <label class="fld"><span>Nom d’utilisateur</span><input id="on-user" maxlength="16" autocomplete="username" autocapitalize="off" spellcheck="false" style="${ONIN}" placeholder="ex. Max_514"></label>
    <label class="fld"><span>Mot de passe</span><input id="on-pass" type="password" maxlength="72" autocomplete="${su?'new-password':'current-password'}" style="${ONIN}" placeholder="8 caractères minimum"></label>
    ${su?`<label class="fld"><span>Confirme le mot de passe</span><input id="on-pass2" type="password" maxlength="72" autocomplete="new-password" style="${ONIN}"></label>`:''}
    <input id="on-web" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
    </div>
    <button class="btn pri big" style="margin-top:14px;width:100%" data-a="${su?'onsignup':'onlogin'}" ${u.busy?'disabled':''}>${u.busy?esc(u.msg||'…'):su?'Créer mon compte':'Me connecter'}</button>
    ${u.err?`<p class="small" style="color:#ff7b8b;margin:10px 0 0">${esc(u.err)}</p>`:''}
    <p class="small" style="margin:12px 0 0">🔒 Ton mot de passe est chiffré : personne ne peut le lire. On ne demande ni courriel ni numéro de téléphone. Garde ton mot de passe en lieu sûr : sans courriel, on ne peut pas le récupérer.</p></div>`}
function vOnBox(b){const rk=onRk(b.rating),rd=onReady(b),e=100-(b.fat||0),champ=b.rank===1&&onFights(b)>=3;
  return`<div class="bxc ${champ?'champ':''}">
    <div class="bxc-top"><a href="#" data-a="onbx" data-id="${b.id}" class="av bxc-av">${avatar(b,'red')}</a>
      <div class="bxc-id"><a href="#" data-a="onbx" data-id="${b.id}" class="bxc-name">${flag(b.nat)} ${esc(b.name)}</a>
        <div class="bxc-sub">${onDiv(b.div)} · ${onRec(b)}${b.streak>=3?` · 🔥${b.streak}`:''}</div>
        <div class="bxc-chips"><span class="chip ${champ?'gold':''}">${onRankTxt(b)}</span>${(b.belts||[]).map(g=>`<span class="chip gold">🏅 ${esc(geoScopeName(g.s,g.n))}</span>`).join('')}</div></div>
      <div class="bxc-ovr"><b>${b.ovr}</b><span>GLOBAL</span></div></div>
    <div class="bxc-xp"><span>Niv. ${b.lvl}</span>${b.lvl<40?onBar(b.xp,b.need):'<i>max</i>'}<span>${b.lvl<40?`${b.xp}/${b.need}`:''}</span></div>
    <a href="#" class="bxc-st" data-a="onbx" data-id="${b.id}"><div class="bxc-ab">${b.abil.map(k=>ONAB[k]?`<i class="hx r${abR(k)}" title="${esc(ONAB[k][1])} · ${RARN[abR(k)]}">${abHex(k,34)}</i>`:'').join('')}${Array.from({length:3-b.slots},()=>'<i class="lk">🔒</i>').join('')}</div>
      <div class="bxc-en ${rd.ok?'':'bad'}"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span>${rd.ok?`⚡ ${e} %`:esc(rd.t.split(' · ')[0])}</span><span>${rd.ok?(b.fat?onTime(enFull(b)):'plein'):esc((rd.t.split(' · ')[1]||'').replace('encore ',''))} ›</span></div>${onBar(e,100,e>=30?'green':'')}</div></a>
    <div class="bxc-act"><button class="btn pri" data-a="onopp" data-id="${b.id}" ${rd.ok?'':'disabled'}>🥊 Combattre</button>
      ${b.pts?`<button class="btn gold ic" data-a="onup" data-id="${b.id}">💪<small>+${b.pts}</small></button>`:''}
      <button class="btn ic" data-a="${b.camp||b.campcd>0?'onbx':'oncamp'}" data-id="${b.id}" ${b.camp||b.campcd>0?'':''}>🏋️<small>${b.camp?(b.campleft>0?onTime(b.campleft):'prêt'):b.campcd>0?onTime(b.campcd):'Camp'}</small></button>
      <button class="btn ic" data-a="onsty" data-id="${b.id}">🎨<small>Style</small></button></div></div>`}
function vOnUp(b){const p=onUi().up,used=ONSTAT.reduce((a,[k])=>a+(p.add[k]||0),0),left=b.pts-used;
  return`<div class="panel"><div class="ph"><b class="nm" style="font-size:20px">💪 ${esc(b.name)}</b><button class="btn sm" data-a="onupx">← Retour</button></div>
    <p class="small" style="margin:0 0 8px">Points à placer : <b>${left}</b> (maximum 95 par stat)</p>
    ${ONSTAT.map(([k,n])=>{const v=b[k]+(p.add[k]||0);return`<div class="row" style="justify-content:space-between;flex-wrap:nowrap;margin:6px 0"><span style="width:90px">${n}</span><span style="flex:1;min-width:0">${onBar(v,99)}</span><b class="num" style="width:34px;text-align:right">${v}</b><button class="btn sm" data-a="onupm" data-k="${k}" ${p.add[k]?'':'disabled'}>−</button><button class="btn sm" data-a="onupp" data-k="${k}" ${left>0&&v<95?'':'disabled'}>+</button></div>`}).join('')}
    <button class="btn pri big" style="width:100%;margin-top:8px" data-a="onupok" ${used?'':'disabled'}>Valider</button></div>`}
function vOnCreate(){const u=onUi(),c=u.cr,left=onLeft(c),mine=u.home?u.home.boxers.map(b=>b.div):[],free=ON_DIV.filter(d=>!mine.includes(d));if(!free.includes(c.div))c.div=free[0];
  const pv=Object.assign({},c.st,{look:c.look,nat:c.nat,name:c.name});
  return`<div class="panel"><div class="ph"><b class="nm" style="font-size:20px">Nouveau boxeur</b><button class="btn sm" data-a="oncrx">← Retour</button></div>
    <div class="row" style="flex-wrap:nowrap;gap:12px"><div class="av lg">${avatar(pv,'red')}</div><div style="min-width:0;flex:1" class="stack">
      <button class="btn sm" data-a="onlook">🎲 Nouveau visage</button><span class="small">${c.nat?flag(c.nat)+' '+NAT[c.nat].n:'🌍 Pays à choisir'}</span></div></div>
    <label class="fld" style="margin-top:10px"><span>Nom</span><div class="row" style="flex-wrap:nowrap"><input id="on-bname" maxlength="28" value="${esc(c.name)}" style="${ONIN};flex:1;min-width:0" autocomplete="off"><button class="btn" data-a="onrname">🎲</button></div></label>
    <span class="lab" style="display:block;margin-top:10px">Catégorie</span><div style="margin-top:6px">${selH('oncdiv',free.map(d=>[d,onDiv(d)]),c.div,'k')}</div>
    <span class="lab" style="display:block;margin-top:10px">Pays</span><div style="margin-top:6px">${selH('oncnat',[['','— Choisis son pays —'],...Object.keys(NAT).map(k=>[k,flag(k)+' '+NAT[k].n])],c.nat,'k')}</div>
    <span class="lab" style="display:block;margin-top:10px">Style</span><div style="margin-top:6px">${segH('oncsty',Object.entries(STRAT).filter(([k])=>['agr','eq','pru','corps'].includes(k)).map(([k,s])=>[k,s.n]),c.style)}</div>
    <span class="lab" style="display:block;margin-top:12px">Stats de départ · <b style="color:${left?'var(--gold,#f5c451)':'var(--green)'}">${left} point${left>1?'s':''} à placer</b></span>
    ${ONSTAT.map(([k,n])=>`<div class="row" style="justify-content:space-between;flex-wrap:nowrap;margin:6px 0"><span style="width:90px">${n}</span><span style="flex:1;min-width:0">${onBar(c.st[k],60)}</span><b class="num" style="width:28px;text-align:right">${c.st[k]}</b><button class="btn sm" data-a="oncm" data-k="${k}" ${c.st[k]>40?'':'disabled'}>−</button><button class="btn sm" data-a="oncp" data-k="${k}" ${left>0&&c.st[k]<60?'':'disabled'}>+</button></div>`).join('')}
    <button class="btn sm" style="width:100%;margin-top:4px" data-a="oncauto" ${left?'':'disabled'}>⚡ Répartir automatiquement</button><p class="small" style="margin:6px 0 0">Chaque stat va de 40 à 60 au départ. Tu gagnes 4 points à chaque niveau, jusqu’à 95.</p>
    <button class="btn pri big" style="width:100%;margin-top:12px" data-a="oncok" ${left||u.busy||!c.nat?'disabled':''}>${u.busy?'Création…':!c.nat?'Choisis son pays':'Créer mon boxeur'}</button></div>`}
function vOnOpps(){const u=onUi(),b=u.home.boxers.find(x=>x.id===u.box);if(!b){u.box=null;return''}
  const O=u.opps,row=(o,fr)=>{const diff=o.ovr-b.ovr,champ=o.rank===1&&onFights(o)>=3&&onFights(b)>=2;
    return`<div class="panel" style="padding:12px"><div class="row" style="flex-wrap:nowrap;gap:10px"><div class="av sm" style="width:44px;height:44px">${avatar(o,'blue')}</div><span style="min-width:0;flex:1"><b>${flag(o.nat)} ${esc(o.name)}</b> ${champ?'<span class="chip gold">👑 Champion</span>':''}<br>
      <span class="small">${o.ovr} global (${diff>0?'+':''}${diff}) · Niv. ${o.lvl} · ${onRec(o)} · ${onRankTxt(o)}</span><br><span class="small">${fr?'🤝 ':''}${esc(o.mgr)}${onTag(o)}</span></span>
      <button class="btn ${champ?'gold':'pri'} sm" data-a="ongo" data-id="${o.id}">${champ?'Titre !':'Combattre'}</button></div></div>`};
  return`<div class="panel"><div class="ph"><b class="nm" style="font-size:20px">🤝 Défier un ami</b><button class="btn sm" data-a="onlistx">← Retour</button></div>
    <p class="small" style="margin:0">${onDiv(b.div)} · ${b.ovr} global · cote ${b.rating}. Adversaires du même poids et de niveau proche. Bats le champion 👑 (#1) en 12 rounds pour lui prendre la ceinture (après 2 combats).</p></div>
    ${!O?'<p class="small">Recherche d’adversaires…</p>':O.err?`<p class="small" style="color:#ff7b8b">${esc(O.err)}</p>`:
    `${O.friends.length?`<span class="lab" style="display:block;margin:12px 0 6px">Tes amis</span><div class="list" style="grid-template-columns:1fr">${O.friends.map(o=>row(o,1)).join('')}</div>`:''}
     ${O.friends.length?'':'<p class="small">Aucun ami dans cette catégorie.</p>'}
     `}`}
function vOnline(){
  const u=onUi(),hdr=`<div class="row" style="justify-content:space-between;margin-bottom:10px;flex-wrap:nowrap"><h2 style="margin:0">🌐 En ligne</h2><button class="btn sm" data-a="onexit">← Menu</button></div>`;
  if(!ON)return hdr+vOnAuth();
  if(!u.home&&!u.busy&&!u.err)setTimeout(()=>onLoad(),0);
  const H=u.home;
  if(!H)return hdr+`<div class="panel"><p class="small" style="margin:0">${u.err?esc(u.err):'Chargement…'}</p>${u.err?'<button class="btn" style="margin-top:8px" data-a="onref">Réessayer</button>':''}</div>`;
  const me=H.me;
  if(u.acct)return hdr+`<div class="panel"><div class="ph"><b class="nm" style="font-size:20px">Mon compte</b><button class="btn sm" data-a="onacct">← Retour</button></div>
    <p class="small">Connecté en tant que <b>${esc(me.name)}</b>.</p>
    <span class="lab">Changer le mot de passe</span><div class="stack" style="gap:8px;margin-top:6px"><input id="on-old" type="password" autocomplete="current-password" placeholder="Mot de passe actuel" style="${ONIN}"><input id="on-new" type="password" autocomplete="new-password" placeholder="Nouveau mot de passe" style="${ONIN}"><button class="btn" data-a="onpass">Changer</button></div>
    <span class="lab" style="display:block;margin-top:14px">Son</span><div class="row" style="margin-top:6px"><button class="btn" data-a="autog" data-k="music">${AU.music?'🎵 Musique : oui':'🎵 Musique : non'}</button><button class="btn" data-a="autog" data-k="sfx">${AU.sfx?'🔊 Sons : oui':'🔇 Sons : non'}</button></div>
    <button class="btn" style="margin-top:14px;width:100%" data-a="onlogout">Se déconnecter</button></div>`;
  if(u.shop)return hdr+vOnShop();
  if(u.bx){const b=(H.boxers.find(x=>x.id===u.bx))||ONBX[u.bx];if(b)return hdr+vOnBx(b);u.bx=null}
  if(u.mev)return hdr+vOnMe();
  if(u.legv)return hdr+vOnLeg();
  if(u.gymv)return hdr+vOnGym();
  if(u.passv)return hdr+vOnPass();
  if(u.rkv)return hdr+vOnRanks();
  if(u.prof)return hdr+vOnProf();
  if(u.cview)return hdr+vOnClubView();
  if(u.inv)return hdr+vOnInvWait();
  if(u.sty){const b=H.boxers.find(x=>x.id===u.sty);if(b)return hdr+vOnStyle(b);u.sty=null}
  if(u.camp){const b=H.boxers.find(x=>x.id===u.camp);if(b)return hdr+vOnCamp(b);u.camp=null}
  if(u.cr)return hdr+vOnCreate();
  if(u.up){const b=H.boxers.find(x=>x.id===u.up.id);if(b)return hdr+vOnUp(b);u.up=null}
  if(u.box){if(u.srch)return hdr+vOnSearch();if(u.found&&!u.list)return hdr+vOnFound();if(u.opps)return hdr+vOnOpps();return hdr+vOnSearch()}
  const champs=H.boxers.filter(b=>b.rank===1&&onFights(b)>=3).length;
  const prof=vOnHead(me,champs);
  const sub=u.sub,seg=`<div class="otabs">${[['ecurie','glove','Écurie'],['defis','target','Défis'],['cls','trophy','Rangs'],['amis','club','Club'],['hist','chart','Combats']].map(([k,i,n])=>`<button data-a="onsub" data-k="${k}" aria-pressed="${sub===k}">${ic(i)}<b>${n}</b></button>`).join('')}</div>`;
  let body='';
  if(sub==='ecurie'){const free=ON_DIV.filter(d=>!H.boxers.some(b=>b.div===d));
    body=(H.boxers.length?'':`<div class="panel"><b>Crée ton premier boxeur !</b><p class="small" style="margin:6px 0 0">Un boxeur par catégorie de poids (9 au maximum). Il commence autour de 48 global avec 1 pouvoir (2e au niveau 10, 3e au niveau 20 ; change-les avec tes 💰). Chaque combat lui donne de l’XP : il monte de niveau, tu places ses points et il grimpe au classement de sa catégorie jusqu’à la ceinture.</p></div>`)+
      `<div class="list" style="grid-template-columns:1fr;margin-top:8px">${H.boxers.map(vOnBox).join('')}</div>`+
      (free.length?`<button class="btn ${H.boxers.length?'':'pri big'}" style="width:100%;margin-top:10px" data-a="oncr">➕ Nouveau boxeur (${free.length} catégorie${free.length>1?'s':''} libre${free.length>1?'s':''})</button>`:'')}
  else if(sub==='cls'&&(u.geo==='C'||u.geo==='R'))body=geoSeg()+vOnGeo(u.geo);
  else if(sub==='cls'){const dv=u.rdiv||(H.boxers[0]&&H.boxers[0].div)||'leger';u.rdiv=dv;
    if(dv==='news'){body=geoSeg()+`<div style="margin-bottom:8px">${selH('onrdiv',[['news','📰 Actualité'],['mgr','👔 Gérants (ELO)'],['clubs','🏟️ Clubs'],...ON_DIV.map(d=>[d,(H.boxers.some(b=>b.div===d)?'⭐ ':'')+onDiv(d)])],dv,'k')}</div>`+vOnNews()}else{
    const L=dv==='mgr'?u.top:dv==='clubs'?u.ctop:u.rank[dv];if(!L)setTimeout(()=>dv==='mgr'?onTop():dv==='clubs'?onClubTop():onRankLoad(dv),0);
    body=geoSeg()+`<div style="margin-bottom:8px">${selH('onrdiv',[['news','📰 Actualité'],['mgr','👔 Gérants (ELO)'],['clubs','🏟️ Clubs'],...ON_DIV.map(d=>[d,(H.boxers.some(b=>b.div===d)?'⭐ ':'')+onDiv(d)])],dv,'k')}</div>`+
      (!L?'<p class="small">Chargement…</p>':dv==='clubs'?vClubBoard(L):dv==='mgr'?`<div class="panel">${L.map((p,i)=>`<div class="row" style="justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap"><span style="min-width:0"><b>${i+1}. ${onMgrLink(p.id,p.name)}</b>${onTag(p)}${p.id===me.id?' <span class="chip gold">Toi</span>':''}<br><span class="small">${onRec(p)}</span></span><span style="text-align:right"><b class="num">${rpOf(p.elo)}</b><br><span class="small">${onRk(p.elo).ic} ${onRk(p.elo).n}</span></span></div>`).join('')}</div>`:
      `<div class="panel">${L.map((b,i)=>`<div class="row" style="justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap;gap:8px"><span style="min-width:0"><b>${i===0?'👑':(i+1)+'.'} ${bxL(b,flag(b.nat)+' '+esc(b.name))}</b>${b.pid===me.id?' <span class="chip gold">Toi</span>':''}<br><span class="small">${b.ovr} global · Niv. ${b.lvl} · ${onRec(b)} · ${onMgrLink(b.pid,b.mgr)}${onTag(b)}</span></span><span style="text-align:right"><b class="num">${b.rating}</b></span></div>`).join('')||'<p class="small">Personne.</p>'}</div>`)}}
  else if(sub==='defis'){const Q=u.quests;if(!Q&&!u.qbusy)setTimeout(onQuests,0);
    const tl=sec=>{sec=Math.max(0,sec|0);const h=Math.floor(sec/3600);return h>=24?`${Math.floor(h/24)} j ${h%24} h`:h?`${h} h ${Math.floor(sec%3600/60)} min`:`${Math.floor(sec/60)} min`};
    const row=q=>{const ok=q.v>=q.n;return`<div class="panel" style="padding:12px"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px"><span style="min-width:0;flex:1"><b>${esc(q.t)}</b><br><span class="small">${Math.min(q.v,q.n)}/${q.n}</span>${onBar(Math.min(q.v,q.n),q.n,ok?'green':'gold')}</span>
      ${q.done?'<span class="chip">✅ Réclamé</span>':`<button class="btn ${ok?'gold':''} sm" data-a="onclaim" data-k="${esc(q.id)}" ${ok?'':'disabled'}>+${q.c} 💰</button>`}</div></div>`};
    const qr=q=>{const ok=q.v>=q.n;return`<div class="qrow ${q.done?'done':ok?'ok':''}"><span class="qt"><b>${esc(q.t)}</b><span class="qb">${onBar(Math.min(q.v,q.n),q.n,ok?'green':'gold')}</span></span><span class="qv">${Math.min(q.v,q.n)}/${q.n}</span>
      ${q.done?'<span class="qc">✅</span>':`<button class="btn ${ok?'gold':''} sm" data-a="onclaim" data-k="${esc(q.id)}" ${ok?'':'disabled'}>+${q.c} 💰</button>`}</div>`};
    const nClaim=Q?Q.list.filter(q=>q.v>=q.n&&!q.done).length:0,ds=u.dsub||'q';
    const DS=[['q',`☀️ Défis${nClaim?` <i class="dsn">${nClaim}</i>`:''}`],['leg','👑 Légendes'],['tour','🏆 Tournoi'],['pass','🎟️ Passe'],['spons','🤝 Commandites']];
    body=`<div class="dsub">${DS.map(([k,n])=>`<button data-a="ondsub" data-k="${k}" aria-pressed="${ds===k}">${n}</button>`).join('')}</div>`+
      (ds==='leg'?vOnLeg():ds==='tour'?vOnTour():ds==='pass'?(vOnPassCard()||'<p class="small">Chargement…</p>'):ds==='spons'?(vOnSpons()||'<p class="small">Chargement…</p>'):
      vOnDaily()+(!Q?'<p class="small">Chargement…</p>':`<div class="panel qpanel"><div class="qh"><b>☀️ Aujourd’hui</b><span class="small">nouveaux dans ${tl(Q.dleft)}</span></div>${Q.list.filter(q=>q.p==='d').map(qr).join('')}</div>
      <div class="panel qpanel"><div class="qh"><b>📅 Cette semaine</b><span class="small">nouveaux dans ${tl(Q.wleft)}</span></div>${Q.list.filter(q=>q.p==='w').map(qr).join('')}</div>`))}
  else if(sub==='amis')body=vOnClub()+vOnWall()+`<div class="panel" style="margin-top:8px"><span class="lab">Ajouter un ami</span><div class="row" style="margin-top:8px;flex-wrap:nowrap"><input id="on-code" maxlength="8" placeholder="CODE" autocomplete="off" autocapitalize="characters" style="${ONIN};flex:1;min-width:0;letter-spacing:.12em;text-transform:uppercase"><button class="btn pri" data-a="onadd">Ajouter</button></div><p class="small" style="margin:8px 0 0">Les boxeurs de tes amis apparaissent en premier quand tu cherches un combat dans leur catégorie.</p></div>
    <div class="list" style="grid-template-columns:1fr;margin-top:8px">${H.friends.map((f,i)=>`<div class="panel" style="padding:13px"><div class="ph"><div style="min-width:0"><b>${i+1}. ${onMgrLink(f.id,f.name)}</b><span class="small" style="display:block">${onRec(f)} · ${onAgo(f.seen)}</span></div><span class="chip">${onRk(f.elo).ic} ${f.elo}</span></div>
      <span class="small">Toi contre lui : <b class="num">${f.hw}-${f.hl}-${f.hd}</b> · Catégories : ${f.divs.map(onDiv).join(', ')||'aucun boxeur'}</span>
      ${(()=>{const com=H.boxers.filter(b=>f.divs.includes(b.div));if(!com.length)return'<p class="small" style="margin:6px 0 0;opacity:.7">Aucune catégorie en commun pour un combat en direct.</p>';
        if(u.invPick===f.id)return`<div class="row" style="margin-top:8px;gap:6px">${com.map(b=>`<button class="btn pri sm" data-a="oninvgo" data-id="${f.id}" data-k="${b.id}">${onDiv(b.div)} · ${esc(b.name)}</button>`).join('')}</div>`;
        return`<button class="btn pri sm" style="margin-top:8px" data-a="oninvfr" data-id="${f.id}">🔴 Défier en direct</button>`})()}</div>`).join('')||'<div class="panel"><p class="small" style="margin:0">Pas encore d’amis. Envoie ton code à tes amis, ou entre le leur ci-dessus.</p></div>'}</div>`;
  else body=vOnHist();
  return hdr+prof+seg+body+'<div style="height:90px"></div>';
}
/* ===== emblèmes de rang personnalisés ===== */
const RKF=[['bz','#ffd9b0','#c8743a','#4a1f08','#ff9a4a'],['ag','#ffffff','#b6c2d3','#3c4556','#dfe8ff'],['or','#fff6c8','#f4c542','#7a5200','#ffd23a'],
  ['pl','#dcfffb','#3fd9cb','#0a4a55','#5ff7e6'],['dm','#eef3ff','#7da9ff','#3a1fae','#b59bff'],['ma','#d8ffe6','#2fd27a','#064a2a','#6dffb0'],
  ['gm','#ffd0d6','#d4143a','#2a0008','#ff4060'],['ch','#ffffff','#ffd86b','#6a3ad0','#7ff3ff'],['lg','#fff0b0','#ff6a2a','#6a0010','#ffb02a']];
function rkSVG(i,px){i=Math.max(0,Math.min(18,i|0));const fam=i<15?Math.floor(i/3):i-10,sub=i<15?i%3+1:0,[id,l,m,d,gl]=RKF[fam];px=px||22;
  const G=`<defs><linearGradient id="rk${id}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".45" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></linearGradient>
    <linearGradient id="rk${id}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${d}"/><stop offset="1" stop-color="#07080c"/></linearGradient>
    <radialGradient id="rk${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${gl}" stop-opacity=".55"/><stop offset="1" stop-color="${gl}" stop-opacity="0"/></radialGradient>
    ${fam===7?`<linearGradient id="rkchp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ff3ff"/><stop offset=".33" stop-color="#ffd86b"/><stop offset=".66" stop-color="#ff7ad9"/><stop offset="1" stop-color="#8a6bff"/></linearGradient>`:''}</defs>`;
  const fillM=fam===7?'url(#rkchp)':`url(#rk${id}m)`;
  const wing=s=>{const n=Math.min(5,fam+1);let p='';for(let k=0;k<n;k++){const y=32+k*8,len=Math.min(44,30-k*4+fam*2);p+=`<path d="M${50+s*20} ${y} Q${50+s*(24+len*.6)} ${y-10-k} ${50+s*(22+len)} ${y-4+k*2} Q${50+s*(24+len*.55)} ${y+2} ${50+s*20} ${y+7} Z" fill="${fillM}" stroke="${d}" stroke-width="1.2"/>`}return p};
  const rays=fam>=4?`<g opacity="${fam>=7?.75:.55}">${Array.from({length:fam>=7?16:12},(_,k,a)=>{const n=fam>=7?16:12,w=.12;return`<path d="M50 50 L${(50+Math.cos(k*2*Math.PI/n-w)*50).toFixed(1)} ${(50+Math.sin(k*2*Math.PI/n-w)*50).toFixed(1)} L${(50+Math.cos(k*2*Math.PI/n+w)*50).toFixed(1)} ${(50+Math.sin(k*2*Math.PI/n+w)*50).toFixed(1)}Z" fill="${gl}" opacity="${k%2?.35:.7}"/>`}).join('')}</g>`:'';
  const spikes=fam>=2?(fam>=6?`<path d="M30 20 L33 0 L41 14 L50 -4 L59 14 L67 0 L70 20 Z" fill="${fillM}" stroke="${d}" stroke-width="1.4"/>`:`<path d="M34 18 L38 4 L44 15 L50 0 L56 15 L62 4 L66 18 Z" fill="${fillM}" stroke="${d}" stroke-width="1.4"/>`):'';
  const flames=fam>=6?`<path d="M50 2 C40 14 30 10 26 24 C20 16 14 26 18 36 C10 34 8 48 16 56 L84 56 C92 48 90 34 82 36 C86 26 80 16 74 24 C70 10 60 14 50 2 Z" fill="${fam===8?'#ff3b1f':fam===6?'#a0001c':'#7a5cff'}" opacity=".85" transform="translate(50 50) scale(1.18) translate(-50 -54)"/><path d="M50 10 C44 20 36 18 34 28 C30 24 26 30 28 38 L72 38 C74 30 70 24 66 28 C64 18 56 20 50 10 Z" fill="${fam===8?'#ffd23a':fam===6?'#ff4060':'#7ff3ff'}" opacity=".9"/>`:'';
  const shield=`<path d="M50 9 L82 21 V47 C82 68 67 83 50 93 C33 83 18 68 18 47 V21 Z" fill="${fillM}" stroke="${d}" stroke-width="2.4"/>
    <path d="M50 17 L74 26 V47 C74 63 63 75 50 83 C37 75 26 63 26 47 V26 Z" fill="url(#rk${id}i)" stroke="${l}" stroke-opacity=".6" stroke-width="1.2"/>`;
  const star=(cx,cy,r)=>{let p='';for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr=k%2?r*.42:r;p+=`${k?'L':'M'}${(cx+Math.cos(a)*rr).toFixed(1)} ${(cy+Math.sin(a)*rr).toFixed(1)}`}return`<path d="${p}Z" fill="${fillM}" stroke="${d}" stroke-width="1"/>`};
  const glove=`<g transform="translate(50 48) rotate(-18)"><path d="M-9 10 C-15 2 -14 -14 -2 -16 C9 -18 15 -10 13 0 C12 7 9 10 6 11 Z" fill="${fillM}" stroke="${d}" stroke-width="1.4"/><path d="M-10 0 C-17 -1 -17 -9 -11 -9 C-7 -9 -6 -5 -6 -2" fill="${fillM}" stroke="${d}" stroke-width="1.4"/><rect x="-10" y="10" width="17" height="7" rx="1.5" fill="#f2f2f2" stroke="${d}" stroke-width="1.2"/></g>`;
  const crown=`<path d="M33 60 L30 36 L41 46 L50 30 L59 46 L70 36 L67 60 Z" fill="${fillM}" stroke="#fff3c0" stroke-width="1.4"/><circle cx="50" cy="30" r="3" fill="#fff"/><circle cx="30" cy="36" r="2.4" fill="#fff"/><circle cx="70" cy="36" r="2.4" fill="#fff"/>`;
  const ico=fam===4?`<path d="M50 30 L64 42 L50 68 L36 42 Z" fill="${fillM}" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/><path d="M36 42 H64 M50 30 L45 42 L50 68 L55 42 Z" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>`
    :fam===5?`<path d="M36 64 C26 54 28 38 36 30 M64 64 C74 54 72 38 64 30" fill="none" stroke="${l}" stroke-width="3" stroke-linecap="round"/>${[0,1,2,3].map(k=>`<ellipse cx="${33-k*.5}" cy="${58-k*8}" rx="4" ry="2" fill="${m}" transform="rotate(-40 ${33-k*.5} ${58-k*8})"/><ellipse cx="${67+k*.5}" cy="${58-k*8}" rx="4" ry="2" fill="${m}" transform="rotate(40 ${67+k*.5} ${58-k*8})"/>`).join('')}${star(50,47,13)}`
    :fam===6?`<path d="M36 30 Q30 22 26 26 Q32 30 36 38 Z M64 30 Q70 22 74 26 Q68 30 64 38 Z" fill="${l}"/>${star(50,48,16)}<circle cx="50" cy="48" r="4" fill="#fff"/>`
    :fam===7?`<rect x="30" y="40" width="40" height="18" rx="5" fill="${fillM}" stroke="#fff" stroke-width="1.4"/><circle cx="50" cy="49" r="8" fill="#14070a" stroke="#ffd86b" stroke-width="1.6"/>${star(50,49,6)}<path d="M26 44 h4 v10 h-4z M70 44 h4 v10 h-4z" fill="#ffd86b"/>`
    :fam===8?crown:fam===3?star(50,47,17)+`<circle cx="50" cy="47" r="4" fill="#fff" opacity=".85"/>`:glove;
  const pips=sub?`<g>${[0,1,2].map(k=>{const on=k<sub,x=50+(k-1)*11;return`<path d="M${x} 79 l4 4 -4 4 -4 -4Z" fill="${on?l:'#20242e'}" stroke="${d}" stroke-width="1"/>`}).join('')}</g>`:'';
  return`<svg class="rkic" viewBox="0 0 100 100" width="${px}" height="${px}" aria-hidden="true">${G}<circle cx="50" cy="50" r="48" fill="url(#rk${id}g)"/>${rays}${flames}${spikes}${fam?wing(-1)+wing(1):''}${shield}${ico}${pips}</svg>`}


/* --- rangs ELO (boxeurs et gérants) --- */
const ONRK=[[0,'🥉','Bronze III'],[850,'🥉','Bronze II'],[900,'🥉','Bronze I'],[950,'🥈','Argent III'],[1000,'🥈','Argent II'],[1050,'🥈','Argent I'],[1100,'🥇','Or III'],[1150,'🥇','Or II'],[1200,'🥇','Or I'],[1250,'💠','Platine III'],[1300,'💠','Platine II'],[1350,'💠','Platine I'],[1400,'💎','Diamant III'],[1450,'💎','Diamant II'],[1500,'💎','Diamant I'],[1600,'🌿','Maître'],[1700,'🩸','Grand Maître'],[1850,'🏆','Champion'],[2000,'👑','Légende']];
/* Phase 4 : un seul rang par compte, échelle 0 – 10 000 (brief §4). Les points de rang sont une
   remise à l'échelle de l'ELO du serveur : 1000 (nouveau compte) = 0 pt (Bronze III), 3500 = 10 000 (DYNASTY).
   Seul le gérant a un rang ; les boxeurs n'en ont plus. */
const rpOf=e=>Math.max(0,((+e||0)-1000)*4);
const seasonNow=(d=new Date())=>Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(2026,10,2))/864e5/28)+1;
const RKSTEPS=(()=>{const s=[];RANKS.forEach((r,i)=>{if(r.id==='dynasty'){s.push({rp:r.min,id:r.id,n:r.n});return}const span=RANKS[i+1].min-r.min;['III','II','I'].forEach((d,k)=>s.push({rp:r.min+Math.ceil(span*k/3),id:r.id,n:r.n+' '+d}))});return s})();
function onRk(r){const rp=rpOf(r);let i=0;for(let j=0;j<RKSTEPS.length;j++)if(rp>=RKSTEPS[j].rp)i=j;const c=RKSTEPS[i],n=RKSTEPS[i+1];
  return{i,id:c.id,rp,ic:badgeHTML(c.id,{size:20}),n:c.n,nx:n?n.n:null,need:n?n.rp-rp:0,pct:n?Math.round((rp-c.rp)/(n.rp-c.rp)*100):100}}
const onRkChip=r=>{const k=onRk(r);return`<span class="chip rk">${k.ic} ${k.n}</span>`};
/* --- pouvoirs (en ligne) --- */
const ONAB={hache:["🪓", "Coup de hache", "Exclusif à Seamus O’Hara. +12 % de dégâts, +20 % de knockdowns et coupe plus."],bucheron:["🌲", "Bûcheron d’Irlande", "Exclusif à Seamus O’Hara. +16 % de dégâts, +30 % de knockdowns et +5 de vie."],sang:["🩸", "Odeur du sang", "Exclusif à Rosario Vega. +30 % pour finir un adversaire ébranlé, +15 % de knockdowns."],tiburon:["🦈", "El Tiburón", "Exclusif à Rosario Vega. +40 % pour finir, +10 % de dégâts, +20 % de knockdowns."],magma:["🌋", "Magma", "Exclusif à Big Mike Duvall. +40 % de knockdowns et +8 % de dégâts."],eruption:["💥", "Éruption", "Exclusif à Big Mike Duvall. +55 % de knockdowns, +12 % de dégâts et attaque plus."],enclume:["⚒️", "Enclume", "Exclusif à Hans Krüger. Reçoit 12 % moins, +10 % de dégâts, se relève mieux."],thor:["🔨", "Marteau de Thor", "Exclusif à Hans Krüger. +18 % de dégâts, +35 % de knockdowns, coups à la tête plus forts."],tonnerre:["🌩️", "Tonnerre", "Exclusif à Takeshi Mori. Lance 14 % plus de coups et +5 % de précision."],osaka:["⛩️", "Éclair d’Osaka", "Exclusif à Takeshi Mori. +16 % de coups, +6 % de précision et esquive mieux."],montagne:["🏔️", "Montagne", "Exclusif à Viktor Volkov. Reçoit 18 % moins, se relève beaucoup mieux, +5 de vie."],colosse:["🗿", "Colosse de Kyiv", "Exclusif à Viktor Volkov. Reçoit 20 % moins, presque impossible à garder au sol, +8 de vie."],roi:["👑", "Roi de Londres", "Exclusif à Marcus King. +12 % de dégâts, +25 % pour finir, crochets à la tête plus forts."],royaume:["🏰", "Le Royaume", "Exclusif à Marcus King. +14 % de dégâts, +30 % pour finir, +5 % de précision et cardio."],abeille:["🐝", "Pique d’abeille", "Exclusif à Ángel Ríos. +7 % de précision et esquive 7 % mieux."],mariposa:["🌸", "La Mariposa", "Exclusif à Ángel Ríos. +8 % de précision, esquive 9 % mieux, +6 % de coups."],souffledr:["🔥", "Souffle du dragon", "Exclusif à Li Wei. +40 % de knockdowns, +10 % de dégâts, coupe beaucoup."],empereur:["🐉", "Empereur dragon", "Exclusif à Li Wei. +50 % de knockdowns, +14 % de dégâts, coupe et précision."],legende:["🏅", "Légende vivante", "Exclusif au GOAT. +5 % de précision, +12 % de dégâts, reçoit 12 % moins."],plusgrand:["🌟", "Le plus grand", "Exclusif au GOAT. +7 % de précision, +15 % de dégâts, reçoit 15 % moins, +20 % de knockdowns."],fer:['🪨','Menton de fer','Encaisse beaucoup mieux les gros coups.'],finisseur:['🎯','Finisseur','+25 % de dégâts quand l’adversaire est ébranlé.'],contre:['↩️','Contre-attaquant','Plus précis contre un adversaire qui attaque.'],
 moteur:['⚙️','Moteur diesel','S’essouffle 20 % moins vite.'],eclair:['⚡','Mains rapides','Lance 10 % plus de coups.'],bombe:['💣','Bombe','Beaucoup plus de chances de knockdown.'],roc:['🔋','Récupération','Récupère plus d’énergie entre les rounds.'],
 sniper:['👁️','Œil de tireur','+3 % de précision.'],mur:['🧱','Garde hermétique','L’adversaire est 3 % moins précis.'],cogneur:['🔨','Frappe lourde','+8 % de dégâts.'],guerrier:['❤️‍🔥','Cœur de guerrier','+20 % de dégâts quand il est en danger.'],
 acier:['🛡️','Corps d’acier','Reçoit 10 % moins de dégâts.'],foie:['🫁','Chasseur de foie','Ses coups au corps vident 50 % plus d’énergie.'],instinct:['🧠','Instinct','+1 seconde pour réagir et bonus de réaction plus fort.'],vision:['📋','Q.I. de boxe','Bonus doublé quand tu suis le conseil de ton coin.'],jab:['🥊','Jab piston','Lance 5 % plus de coups.'],cardio:['🫀','Cardio','Récupère 3 % d’énergie de plus entre les rounds.'],esquive:['💨','Jeu de jambes','L’adversaire est 2 % moins précis.'],uppercut:['⤴️','Uppercut','+15 % de chances de knockdown.'],coupeur:['🩸','Coupeur','+60 % de chances d’ouvrir une coupure.'],canon:['🚀','Départ canon','+12 % de dégâts tant qu’il a plus de 70 % de vie.'],fantome:['👻','Fantôme','L’adversaire est 4 % moins précis.'],souffle:['🌬️','Second souffle','Récupère 6 % de vie entre les rounds.'],marteau:['⚒️','Marteau','+15 % de dégâts et +25 % de chances de knockdown.'],immortel:['♾️','Immortel','Reçoit 15 % moins de dégâts et tombe 25 % moins souvent.'],goat:['🐐','Le GOAT','+4 % de précision, +10 % de dégâts et reçoit 10 % moins de dégâts.'],garde:['🛡️','Garde haute','Reçoit 4 % moins de dégâts.'],crochet:['🪝','Crochet','+5 % de dégâts.'],respire:['🌀','Respiration','S’essouffle 8 % moins vite.'],pressing:['🏃','Pressing','Lance 4 % plus de coups.'],coupsec:['✂️','Coup sec','+2 % de précision et +2 % de dégâts.'],patient:['⏳','Patient','+1,5 % de précision et l’adversaire −1,5 %.'],gaucher:['🫲','Gaucher','+2,5 % de précision et l’adversaire −1,5 %.'],tetedure:['🗿','Tête dure','Tombe 20 % moins souvent.'],tornade:['🌪️','Tornade','Lance 8 % plus de coups.'],boucher:['🔪','Boucher','+80 % de coupures et +3 % de dégâts.'],pitbull:['🐶','Pitbull','+15 % de dégâts en danger et lance 3 % plus de coups.'],robot:['🤖','Endurance de robot','S’essouffle 15 % moins vite et récupère 2 % d’énergie de plus.'],requin:['🦈','Requin','+20 % de dégâts contre un adversaire ébranlé et +10 % de knockdowns.'],cobra:['🐍','Cobra','+4 % de précision et +5 % de dégâts.'],ours:['🐻','Force de l’ours','+10 % de dégâts, mais lance 3 % moins de coups.'],phenix:['🐦‍🔥','Phénix','Récupère 8 % de vie entre les rounds et +10 % de dégâts en danger.'],ninja:['🥷','Ninja','L’adversaire est 5 % moins précis et +2 % de précision.'],volcan:['🌋','Volcan','+30 % de knockdowns et +4 % de dégâts.'],titan:['🏛️','Titan','Reçoit 15 % moins de dégâts, tombe 30 % moins souvent, +5 % de dégâts.'],foudre:['🌩️','Foudre','Lance 12 % plus de coups et +3 % de précision.'],lion:['🦁','Roi lion','+12 % de dégâts, +8 % en forme et +15 % contre un adversaire ébranlé.'],machine:['🦾','Machine','S’essouffle 25 % moins vite, +5 % d’énergie et +4 % de vie entre les rounds.'],dieu:['🔱','Dieu de la guerre','+5 % de précision, +14 % de dégâts, reçoit 12 % moins et +20 % de knockdowns.'],dragonab:['🐲','Souffle du dragon','+45 % de knockdowns, +10 % de dégâts et +50 % de coupures.'],papillon:['🦋','Papillon et abeille','+6 % de précision, l’adversaire −6 % et lance 6 % plus de coups.']};
const ABX={hache:{"dmg": 0.12, "kd": 0.2, "cut": 0.4},bucheron:{"dmg": 0.16, "kd": 0.3, "hp": 5},sang:{"fin": 0.3, "kd": 0.15, "acc": 0.03},tiburon:{"fin": 0.4, "dmg": 0.1, "kd": 0.2},magma:{"kd": 0.4, "dmg": 0.08},eruption:{"kd": 0.55, "dmg": 0.12, "att": 0.04},enclume:{"dtk": 0.12, "dmg": 0.1, "kdt": 0.3},thor:{"dmg": 0.18, "kd": 0.35, "high": 0.08},tonnerre:{"att": 0.14, "acc": 0.05},osaka:{"att": 0.16, "acc": 0.06, "dacc": 0.05},montagne:{"dtk": 0.18, "kdt": 0.4, "hp": 5},colosse:{"dtk": 0.2, "kdt": 0.5, "hp": 8, "dmg": 0.06},roi:{"dmg": 0.12, "fin": 0.25, "high": 0.1},royaume:{"dmg": 0.14, "fin": 0.3, "acc": 0.05, "sta": 0.1},abeille:{"acc": 0.07, "dacc": 0.07},mariposa:{"acc": 0.08, "dacc": 0.09, "att": 0.06},souffledr:{"kd": 0.4, "dmg": 0.1, "cut": 0.5},empereur:{"kd": 0.5, "dmg": 0.14, "cut": 0.6, "acc": 0.04},legende:{"acc": 0.05, "dmg": 0.12, "dtk": 0.12},plusgrand:{"acc": 0.07, "dmg": 0.15, "dtk": 0.15, "kd": 0.2, "sta": 0.1},garde:{dtk:.04},crochet:{dmg:.05},respire:{sta:.08},pressing:{att:.04},coupsec:{acc:.02,dmg:.02},patient:{acc:.015,dacc:.015},gaucher:{acc:.025,dacc:.015},tetedure:{kdt:.2},tornade:{att:.08},boucher:{cut:.8,dmg:.03},pitbull:{low:.15,att:.03},robot:{sta:.15,en:2},requin:{fin:.2,kd:.1},cobra:{acc:.04,dmg:.05},ours:{dmg:.1,att:-.03},phenix:{hp:8,low:.1},ninja:{dacc:.05,acc:.02},volcan:{kd:.3,dmg:.04},titan:{dtk:.15,kdt:.3,dmg:.05},foudre:{att:.12,acc:.03},lion:{dmg:.12,high:.08,fin:.15},machine:{sta:.25,en:5,hp:4},dieu:{acc:.05,dmg:.14,dtk:.12,kd:.2},dragonab:{kd:.45,dmg:.1,cut:.5},papillon:{acc:.06,dacc:.06,att:.06}};
const abS=(b,f)=>{let v=0;const t=b&&b.traits;if(t)for(const k of t){const e=ABX[k];if(e&&e[f])v+=e[f]}return v};
const ONRAR={hache:5,bucheron:6,sang:5,tiburon:6,magma:5,eruption:6,enclume:5,thor:6,tonnerre:5,osaka:6,montagne:5,colosse:6,roi:5,royaume:6,abeille:5,mariposa:6,souffledr:5,empereur:6,legende:5,plusgrand:6,garde:1,crochet:1,respire:1,pressing:1,coupsec:1,patient:1,gaucher:2,tetedure:2,tornade:2,boucher:2,pitbull:2,robot:2,requin:3,cobra:3,ours:3,phenix:3,ninja:3,volcan:3,titan:4,foudre:4,lion:4,machine:4,dieu:5,dragonab:5,papillon:5,sniper:1,mur:1,cogneur:1,roc:1,eclair:1,moteur:1,jab:1,cardio:1,contre:2,foie:2,acier:2,fer:2,vision:2,esquive:2,uppercut:2,coupeur:2,finisseur:3,guerrier:3,instinct:3,canon:3,fantome:3,souffle:3,bombe:4,marteau:4,immortel:4,goat:5};
const RARN=['','Commun','Rare','Épique','Légendaire','Mythique','Panthéon'],RARC=['','#9aa3b2','#4f9dff','#b36bff','#ffb020','#ff3d6e','#ffd23a'],RARP=['',50,28,15,6,1,.8];
const ABLEG={hache:0,bucheron:0,sang:1,tiburon:1,magma:2,eruption:2,enclume:3,thor:3,tonnerre:4,osaka:4,montagne:5,colosse:5,roi:6,royaume:6,abeille:7,mariposa:7,souffledr:8,empereur:8,legende:9,plusgrand:9};const abLegOf=i=>Object.keys(ABLEG).filter(k=>ABLEG[k]===i);
const abR=k=>ONRAR[k]||1;

/* ===== icônes maison (SVG) ===== */
const ICP={
 glove:'<path d="M7 17c-2-2-2.5-7 .5-9.5C10 5.5 15 5 17 8c1.6 2.4 1 6-1 8l-1 1H8z"/><path d="M7.5 10.5C5 10 4 12 5 13.5S7 15 8 14"/><path d="M8 17h7v3H8z"/><path d="M10 8.5c2-.8 4-.3 5 1"/>',
 target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><path d="M17 7l3-3M18 4h2v2"/>',
 trophy:'<path d="M8 4h8v5a4 4 0 01-8 0z"/><path d="M8 6H5c0 3 1.5 4.5 3.2 4.6M16 6h3c0 3-1.5 4.5-3.2 4.6"/><path d="M12 13v3M9 20h6M10 16h4l1 4H9z"/>',
 club:'<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><circle cx="12" cy="10" r="2.2"/><path d="M8.5 16c.6-2 2-3 3.5-3s2.9 1 3.5 3"/>',
 chart:'<path d="M4 20V4M4 20h16"/><path d="M7 15l4-5 3 3 5-7"/><circle cx="19" cy="6" r="1.3" fill="currentColor"/>',
 tag:'<path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="8" r="1.5"/>',
 gym:'<path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/>',
 cart:'<path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H7"/><circle cx="9.5" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
 share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6"/>',
 refresh:'<path d="M20 11a8 8 0 10-2.3 6.3"/><path d="M20 4v7h-7"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
 belt:'<rect x="2" y="9" width="20" height="6" rx="2"/><path d="M8 7h8l1.5 2.5v5L16 17H8l-1.5-2.5v-5z"/><circle cx="12" cy="12" r="2"/>',
 bolt:'<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>'};
function ic(n,cls){return`<svg class="ico ${cls||''}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICP[n]||''}</svg>`}
/* badge hexagonal des pouvoirs */
const RARG=['',['#d5dbe5','#6b7383'],['#9cd0ff','#1f5fd0'],['#e3c4ff','#7a2fd0'],['#ffe29a','#d07a00'],['#ffb3c8','#7b2bd8'],['#fff6c8','#c98a00']];
function abHex(k,px){const r=abR(k),[a,b]=RARG[r]||RARG[1],e=ONAB[k]?ONAB[k][0]:'?';px=px||30;
  return`<svg class="abhex r${r}" viewBox="0 0 40 40" width="${px}" height="${px}" aria-hidden="true"><defs><linearGradient id="ah${r}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <path d="M20 1.5 37 11v18L20 38.5 3 29V11z" fill="url(#ah${r})"/><path d="M20 5 34 13v14L20 35 6 27V13z" fill="#0d1018" opacity=".88"/>
    ${r>=6?`<path d="M20 1.5 37 11v18L20 38.5 3 29V11z" fill="none" stroke="#ffe27a" stroke-width="2"><animate attributeName="stroke-opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite"/></path>`:''}${r>=4?`<path d="M20 1.5 37 11v18L20 38.5 3 29V11z" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>`:''}
    <text x="20" y="21.5" text-anchor="middle" dominant-baseline="middle" font-size="15">${e}</text></svg>`}

/* ===== rareté des pouvoirs ===== */
function abCard(q){const r=abR(q);return`<div class="abcard r${r}"><span class="abic">${abHex(q,44)}</span><span style="flex:1;min-width:0"><b>${esc(ONAB[q][1])}</b> <span class="abtag r${r}">${RARN[r]}</span><br><span class="small">${esc(ONAB[q][2])}</span></span></div>`}
function abCatalog(){const u=onUi(),G=u.leg,bt=G?(G.x||[]):[];if(!G&&ON.token&&!u.legL){u.legL=1;setTimeout(()=>legLoad().then(()=>u.legL=0),0)}return`<div class="abcat"><div class="abcat-h r6"><b>🏛️ Exclusifs des légendes</b><span>Récompense de la roue des légendes</span></div>${LEG.map((L,i)=>abLegOf(i).map(k=>{const ok=bt.includes(i);return`<div class="abcat-i ${ok?'':'lk'}"><span>${abHex(k,30)}</span><span><b>${esc(ONAB[k][1])}</b> <span class="abtag r${abR(k)}">${RARN[abR(k)]}</span><br><span class="small">${ok?`✅ Débloqué · ${abR(k)===6?'0,8':'1,7'} % par tirage`:`🔒 Gagne « 🔓 Pouvoirs » à la roue de ${esc(L.n)}`}</span></span></div>`}).join('')).join('')}${[5,4,3,2,1].map(r=>{const L=Object.keys(ONAB).filter(k=>abR(k)===r&&ABLEG[k]==null);return`<div class="abcat-h r${r}"><b>${RARN[r]}</b><span>${RARP[r]} % par tirage · ${L.length} pouvoir${L.length>1?'s':''}</span></div>${L.map(k=>`<div class="abcat-i"><span>${abHex(k,30)}</span><span><b>${esc(ONAB[k][1])}</b><br><span class="small">${esc(ONAB[k][2])}</span></span></div>`).join('')}`}).join('')}</div>`}
function abReveal(k){if(!ONAB[k])return;const r=abR(k);if(r<3){toast(`🎲 ${RARN[r]} : ${ONAB[k][0]} ${ONAB[k][1]}`);return}
  let el=document.getElementById('abrv');if(el)el.remove();el=Object.assign(document.createElement('div'),{id:'abrv',className:'abrv r'+r});
  el.innerHTML=`<div class="abrv-rays"></div><div class="abrv-card"><span class="abrv-t">${r===6?'🏛️ PANTHÉON 🏛️':r===5?'✨ MYTHIQUE ✨':r===4?'LÉGENDAIRE !':'ÉPIQUE !'}</span><span class="abrv-ic">${abHex(k,110)}</span><b>${esc(ONAB[k][1])}</b><span class="small">${esc(ONAB[k][2])}</span><span class="small" style="opacity:.7;margin-top:6px">${ABLEG[k]!=null?`Exclusif de ${esc(LEG[ABLEG[k]].n)}`:`Chance : ${RARP[r]} %`}</span><button class="btn gold" style="margin-top:12px;width:100%">Wow 🔥</button></div>`;
  document.body.appendChild(el);el.addEventListener('click',()=>el.remove());try{sfx(r>=4?'win':'cash')}catch(e){}}

const onAbChip=k=>ONAB[k]?`<span class="chip abr r${abR(k)}" title="${esc(ONAB[k][2])}">${ONAB[k][0]} ${esc(ONAB[k][1])}</span>`:'';
async function onReroll(id,slot){const u=onUi();try{const r=await rpc('cr_ob_reroll',{p_token:ON.token,p_box:id,p_slot:slot});const k=onT(r.new,20);abReveal(k);ui.confirm=null;await onLoad(true);const bb=onUi().home&&onUi().home.boxers.find(x=>x.id===id);if(bb)ONBX[id]=bb}catch(e){toast(e.message)}}
/* --- contexte neutre : le mode en ligne n'utilise jamais ta carrière --- */
function onStub(){return{v:2,onStub:1,set:{...DEFSET,events:false,autoAdv:false,speed:2},staff:{coach:{name:'Coach',stars:2,nat:'CA'},cut:{stars:1},spar:[]},queue:[],event:null,neg:null,theme:null,belts:{},boxers:[],fights:[],fa:[],club:'En ligne',home:'CA',t:1,money:0,mgr:{lvl:1,perks:{},xp:0},stats:{},rivals:[],promos:[],galas:[],uid:1}}
function onEnter(){S=onStub();ui.skipF=null;setTimeout(invWatch,1500);ui.menu=null;closeMenu();Object.assign(ui,{tab:'online',sheet:null,fight:null,confirm:null});document.getElementById('menu').hidden=true;render()}
/* --- recherche d'adversaire --- */
async function onSearch(bid,skip){
  const u=onUi(),b=u.home.boxers.find(x=>x.id===bid);if(!b)return;
  if(skip&&u.skip&&u.skip.cost>(u.home.me.coins||0)){toast(ONERR.coins);return}
  u.box=bid;u.found=null;u.list=false;u.srch={t0:Date.now()};onR();
  if(!skip&&!TUTS){const j=await lvQueue(bid,u);if(!u.srch||u.box!==bid)return;if(j){lvPresent(j,bid,()=>lvStart(j,bid));return}u.srch={t0:Date.now()-1200};const el=document.getElementById('srch-live');if(el)el.textContent='🤖 Aucun joueur libre à ton niveau : adversaire IA';}
  let r=null,fr=null;try{[r,fr]=await Promise.all([rpc('cr_ob_find',{p_token:ON.token,p_box:bid,p_skip:!!skip}),u.opps&&u.opps.bid===bid?Promise.resolve(null):rpc('cr_ob_opps',{p_token:ON.token,p_box:bid})])}
  catch(e){u.srch=null;u.box=null;toast(e.message==='Erreur.'?'Personne de disponible pour l’instant.':e.message);onR();return}
  if(fr)u.opps={bid,friends:(fr.friends||[]).map(onB),match:(fr.match||[]).map(onB)};
  const op=onB(r.opp);u.skip={skips:onI(r.skips,0,999,0),cost:onI(r.cost,0,9999,0)};u.home.me.coins=onI(r.coins,0,9999999,u.home.me.coins||0);
  const names=[...(u.opps?u.opps.match:[]),op].map(x=>x.name);let i=0;
  const tick=setInterval(()=>{const el=document.getElementById('srch-n');if(!el||!u.srch){clearInterval(tick);return}el.textContent=names[i++%names.length]},120);
  setTimeout(()=>{clearInterval(tick);if(!u.srch)return;u.srch=null;u.foundB=op;u.found=op.id;onR()},Math.max(0,(skip?1300:2400)-(Date.now()-u.srch.t0)));
}
function vOnSearch(){const u=onUi(),b=u.home.boxers.find(x=>x.id===u.box);
  return`<div class="panel srch"><div class="radar"><i></i><i></i><i></i><div class="av lg">${avatar(b,'red')}</div></div>
    <b class="nm" style="font-size:22px;display:block;text-align:center;margin-top:14px">Recherche d’un adversaire…</b>
    <p class="small" style="text-align:center;margin:6px 0 0">${onDiv(b.div)} · ${b.ovr} global · cote ${b.rating}</p>
    <p class="small" id="srch-live" style="text-align:center;margin:10px 0 0;color:var(--green)">${u.srch&&u.srch.live?'👤 Recherche d’un vrai joueur…':'🤖 Adversaire IA'}</p><p class="num" id="srch-n" style="text-align:center;margin:6px 0 0;font-size:16px;opacity:.75">…</p>
    <button class="btn" style="width:100%;margin-top:14px" data-a="onoppx">Annuler</button></div>`}
function vOnFound(){const u=onUi(),b=u.home.boxers.find(x=>x.id===u.box),o=u.foundB&&u.foundB.id===u.found?u.foundB:u.opps&&u.opps.friends.find(x=>x.id===u.found);
  if(!b||!o){u.found=null;return vOnOpps()}
  const champ=o.rank===1&&onFights(o)>=3&&onFights(b)>=2,fr=!!(u.opps&&u.opps.friends.some(x=>x.id===o.id)),sk=u.skip||{skips:0,cost:0};
  return`<div class="found">${onTape(b,o,{bot:o.bot&&!fr,title:champ})}
    <p class="small" style="margin:10px 0 0">💡 En ligne, c’est toi le coin : réagis vite aux moments clés et suis les conseils pour faire pencher le combat.</p>
    <div class="row" style="flex-wrap:nowrap;margin-top:12px"><button class="btn ${champ?'gold':'pri'} big" style="flex:2" data-a="ongo" data-id="${o.id}">🥊 ${champ?'Combat pour le titre':'Combattre'}</button><button class="btn" style="flex:1;line-height:1.15" data-a="onskip" data-id="${b.id}">🔄 Autre<br><span class="small">${sk.cost?sk.cost+' 💰':`gratuit (${Math.max(0,2-sk.skips)}/2)`}</span></button></div>
    ${u.opps&&u.opps.friends.length?`<button class="btn ghost" style="width:100%;margin-top:8px" data-a="onlist">🤝 Défier un ami (${u.opps.friends.length})</button>`:''}
    <button class="btn ghost" style="width:100%;margin-top:6px" data-a="onoppx">← Retour</button></div>`}

/* --- fiche de présentation (façon UFC) --- */
function onTape(b,o,opt){opt=opt||{};const H=onUi().home,me=H?H.me:{name:'Toi',elo:1000};
  const side=(x,c,mgr,melo,bot)=>{const k=onRk(x.rating),mk=onRk(melo),xg=Object.assign({},x,{glv:x.cos&&x.cos.glove!=null?GLV[x.cos.glove]:null});return`<div class="tp-s ${c}"><div class="av lg">${avatar(xg,c)}</div>
    <div class="tp-n">${bxL(x,flag(x.nat)+' '+esc(x.name))}</div>${x.nick?`<div class="tp-k">« ${esc(x.nick)} »</div>`:''}
    ${x.cos&&x.cos.ent&&ENT[x.cos.ent]?`<div class="tp-k">${ENT[x.cos.ent][0]} ${ENT[x.cos.ent][1]}</div>`:''}
    <div class="tp-r num">${x.w}-${x.l}-${x.d}<small> · ${x.ko} KO</small></div>
    <div class="tp-c"><span class="chip ${x.rank===1&&onFights(x)>=3?'gold':''}">${onRankTxt(x)} ${onDiv(x.div)}</span></div>
    <div class="tp-m"><span class="lab">Gérant</span><b>${esc(mgr)}</b>${bot?' <span class="chip" style="font-size:10px">IA</span>':''}<span class="small">${mk.ic} ${mk.n} · ${mk.rp}</span></div></div>`};
  const rows=[['Global','ovr'],['Niveau','lvl'],['Puissance','pow'],['Vitesse','spd'],['Défense','def'],['Cardio','sta'],['Menton','chin'],['Cote','rating']];
  const tape=rows.map(([n,k])=>`<div class="tp-row"><b class="${b[k]>o[k]?'up':''}">${b[k]}</b><span>${n}</span><b class="${o[k]>b[k]?'up':''}">${o[k]}</b></div>`).join('');
  const ab=x=>(x.abil||[]).map(onAbChip).join(' ')||'<span class="small">—</span>';
  return`<div class="tape ${opt.title?'title':''}"><div class="tp-h"><span>${opt.live?'🔴 EN DIRECT':opt.bot?'🤖 CONTRE L’IA':'🥊 COMBAT EN LIGNE'}</span><b>${opt.title?'👑 COMBAT POUR LE TITRE':'COMBAT PRINCIPAL'}</b><span>${onDiv(b.div)} · ${opt.title?12:10} rounds</span></div>
    <div class="tp-grid">${side(b,'red',me.name,me.elo,false)}<div class="tp-vs">VS</div>${side(o,'blue',o.mgr,o.melo,o.bot)}</div>
    <div class="tp-tape">${tape}</div>
    <div class="tp-ab"><div>${ab(b)}</div><span class="lab">Pouvoirs</span><div style="text-align:right">${ab(o)}</div></div>
    ${opt.cd?`<div class="tp-cd">Le combat commence dans <b id="tp-cd">${opt.cd}</b>…</div>`:''}</div>`}
function lvPresent(j,bid,cb){const u=onUi(),side=j.side==='A'?'A':'B',me=onB(side==='A'?j.b1:j.b2),op=onB(side==='A'?j.b2:j.b1),mb=u.home&&u.home.boxers.find(x=>x.id===bid);if(mb)me.abil=mb.abil;
  u.srch=null;const el=document.getElementById('pres')||Object.assign(document.createElement('div'),{id:'pres',className:'pres'});document.body.appendChild(el);
  let n=5;el.innerHTML=`<div class="pres-in">${onTape(me,op,{live:1,title:!!j.title,cd:n})}</div>`;el.hidden=false;
  const t=setInterval(()=>{n--;const c=document.getElementById('tp-cd');if(c)c.textContent=n;if(n<=0){clearInterval(t);el.hidden=true;cb()}},1000)}
/* --- moments clés (réaction) --- */
const RXG={vacille:{a:.07,d:1.25},ebranle:{bA:-.08,en:4,hp:2},vide:{a:.05,d:1.15},souffle:{en:10},coupure:{a:.04,d:1.2},fin:{a:.06},ouverture:{a:.05,d:1.15},droite:{bA:-.07,a:.02},feinte:{a:.05,d:1.12},garde:{a:.04,bA:-.04},cables:{bA:-.07,a:.02},cablesb:{a:.05,d:1.2}};
const RX3=(id,t,h,opts,ok)=>({id,t,h,o:opts,ok,g:RXG[id]});
const RXSIT=F=>{const A=F.A,B=F.B,U=[],N=[];
  if(B.hp<45)U.push(RX3('vacille','💥 Il vacille !','FINIS-LE !',[['💥 Finir','a'],['🛡️ Prudence','b'],['🫁 Au corps','c']],'a'));
  if(A.hp<40)U.push(RX3('ebranle','😵 Tu es ébranlé !','ACCROCHE-TOI !',[['🤼 Accrocher','a'],['💥 Échanger','b'],['🏃 Reculer','c']],'a'));
  if(B.en<35)U.push(RX3('vide','🥵 Il est vidé','METS LA PRESSION !',[['⚡ Pression','a'],['🧘 Souffler','b'],['👊 Jab','c']],'a'));
  if(A.en<30)U.push(RX3('souffle','🫁 Tu manques d’air','RESPIRE, BOUGE !',[['🧘 Respirer','a'],['⚡ Forcer','b'],['🤼 Accrocher','c']],'a'));
  if(B.cut)U.push(RX3('coupure','🩸 Il saigne à l’arcade','VISE LA COUPURE !',[['🎯 Viser l’arcade','a'],['🫁 Au corps','b'],['👊 Jab','c']],'a'));
  if(F.ph===2)U.push(RX3('fin','⏱️ 10 dernières secondes !','VOLE LE ROUND !',[['🔥 Accélérer','a'],['🛡️ Tenir','b'],['🧘 Récupérer','c']],'a'));
  const dir=(id,t,arr)=>{const x=pick(arr);return RX3(id,t,x[2],arr.map(y=>[y[0],y[1]]),x[1])};
  N.push(dir('ouverture','👀 Ouverture !',[['⬅️ Crochet','a','LE CROCHET !'],['➡️ Direct','b','LE DIRECT !'],['⬆️ Uppercut','c','L’UPPERCUT !']]));
  N.push(dir('droite','⚠️ Il arme sa droite !',[['↙️ Esquive','a','ESQUIVE !'],['🧱 Bloque','b','BLOQUE !'],['↩️ Contre','c','CONTRE !']]));
  N.push(dir('feinte','🎭 Il baisse sa garde',[['🎭 Feinte + crochet','a','FEINTE, CROCHET !'],['🎭 Feinte + direct','b','FEINTE, DIRECT !'],['🎭 Feinte + corps','c','FEINTE, AU CORPS !']]));
  N.push(dir('garde','🔄 Il change de garde',[['↪️ Tourner à gauche','a','À GAUCHE !'],['↩️ Tourner à droite','b','À DROITE !'],['👊 Double jab','c','DOUBLE JAB !']]));
  N.push(R()<.5?RX3('cables','🧱 Tu es dans les câbles !','SORS DE LÀ !',[['🌀 Pivoter','a'],['🧱 Bloquer','b'],['💥 Échanger','c']],'a'):RX3('cablesb','📍 Il est dans les câbles !','ENCHAÎNE AU CORPS !',[['🫁 Enchaîner au corps','a'],['👊 Jab','b'],['⏸️ Attendre','c']],'a'));
  return U.length&&R()<.6?pick(U):pick(N)};
function rxOpen(F){
  const s=RXSIT(F),inst=has(F.A.b,'instinct'),rt=F.A.b.rating||1000,ms=(rt>=1500?2500:rt>=1400?2800:rt>=1250?3200:rt>=1100?3700:4200)+(inst?1300:0)+(TUTS?6000:0);
  if(rt>=1250&&!TUTS){s.h=s.h.split(/[ ,]/)[0].replace(/[!,]/g,'')+' !'}if(rt>=1400&&!inst&&R()<.35)s.h='…';
  s.o=s.o.sort(()=>R()-.5);F.rx={s,until:Date.now()+ms};
  const el=document.getElementById('rx')||Object.assign(document.createElement('div'),{id:'rx',className:'rx'});document.getElementById('fx').appendChild(el);
  el.innerHTML=`<div class="rxc"><b class="rxt">${s.t}</b><span class="rxh">${esc(coachName())} : « ${s.h} »</span><div class="rxb">${s.o.map(([n,k])=>`<button class="btn big" data-a="rxp" data-k="${k}">${n}</button>`).join('')}</div><div class="rxbar"><i style="animation-duration:${ms}ms"></i></div></div>`;el.hidden=false;
  F.rxT=setTimeout(()=>rxClose(F,null),ms);
}
function rxClose(F,k){
  if(!F||!F.rx||ui.fight!==F)return;clearTimeout(F.rxT);const s=F.rx.s,inst=has(F.A.b,'instinct')?1.25:1;F.rx=null;
  const el=document.getElementById('rx');if(el)el.hidden=true;
  if(k===s.ok){const g=s.g;F.A.rxA=(g.a||0)*inst;F.A.rxD=1+((g.d||1)-1)*inst;F.B.rxA=(g.bA||0)*inst;if(g.en)F.A.en=cl(F.A.en+g.en*inst,0,100);if(g.hp)F.A.hp=cl(F.A.hp+g.hp,0,100);F.rxOk=(F.rxOk||0)+1;F.rxS=(F.rxS||0)+1;showBub(F.rxS>=3?`🔥 ${F.rxS} réactions parfaites de suite !`:'✅ Parfait !')}
  else{F.A.rxA=k==null?-.02:-.04;F.rxS=0;showBub(k==null?'⏱️ Trop lent !':'❌ Mauvais choix !')}
  F.rxN=(F.rxN||0)+1;
  if(F.live){F.lvRx={rx:k===s.ok?'good':k==null?'slow':'bad',rxk:s.id};lvSubmit(F,{strat:F.strat});return}
  F.rxGo=true;nextPhase();
}
const _onNext=nextPhase;
nextPhase=function(){const F=ui.fight;
  if(F&&F.online&&!F.done){
    if(F.rx)return;
    if(F.rxGo)F.rxGo=false;
    else{F.A.rxA=0;F.A.rxD=1;F.B.rxA=0;
      F.since=(F.since||0)+1;
      if(F.stage==='live'&&F.r>0&&F.since>=2&&R()<.45){F.since=0;rxOpen(F);return}}
    const vis=has(F.A.b,'vision')?2:1;F.A.fol=F.adv&&F.adv.s&&F.strat===F.adv.s?.02*vis:0;
  }
  _onNext();
};
function onIntro(F){if(!F.online)return'';const a=F.A.b,b=F.B.b;
  return`<div class="rstat" style="display:block"><div class="row" style="justify-content:space-between;gap:6px;align-items:flex-start;flex-wrap:nowrap"><div style="flex:1;min-width:0">${(a.traits||[]).map(onAbChip).join(' ')||'<span class="small">Aucun pouvoir</span>'}</div><div style="flex:1;min-width:0;text-align:right">${(b.traits||[]).map(onAbChip).join(' ')}</div></div>
  <p class="small" style="margin:8px 0 0">🎮 Réagis vite aux <b>moments clés</b> et suis le point vert.</p></div>`}
/* --- en ligne : pas de simulation, conseils du coin mis en avant --- */
const _onCtl=ctlHTML;
ctlHTML=function(F){let h=_onCtl(F);if(!F.online)return h;
  h=h.replace(/<button[^>]*data-a="(fsim|fskip)"[^>]*>[\s\S]*?<\/button>/g,'');
  if(F.stage==='between'){const rec=autoCorner(F.A),c=CORNER[rec];
    if(c)h=h.replace(`<b>${c.n}</b>`,`<b>⭐ ${c.n}</b>`);
    const st=F.adv&&F.adv.s&&STRAT[F.adv.s];
    h=h.replace('<div class="cgrid">',`<p class="small" style="margin:0 0 6px;color:#f5c451">📋 Conseil du coin : ${c?'⭐ '+c.n:''}${st?' puis plan « '+st.n+' »':''}</p><div class="cgrid">`)}
  if(F.stage==='live')h+=`<p class="small" style="margin:6px 0 0;text-align:center">Pour aller plus vite, utilise ×2 ou ×4 en haut. Les moments clés apparaissent quand même.</p>`;
  return h};
const _onSkip=skipRound,_onSimAll=simAll;
skipRound=function(){if(ui.fight&&ui.fight.online)return;_onSkip()};
simAll=function(){if(ui.fight&&ui.fight.online)return;_onSimAll()};

/* ================= COMBAT EN DIRECT ENTRE VRAIS JOUEURS ================= */
const LV_WAIT=12000;
function lvStrip(X){const o={};for(const k in X)if(k!=='b')o[k]=X[k];return o}
function lvSer(F){return{A:lvStrip(F.A),B:lvStrip(F.B),r:F.r,ph:F.ph,rounds:F.rounds,rd:F.rd,rs:F.rs,rst:F.rst,cards:F.cards,log:F.log.slice(0,14),done:F.done,res:F.res,ev:F.ev||null}}
const lvSw=w=>w==='A'?'B':w==='B'?'A':w;
function lvMirror(C){const M={...C,A:C.B,B:C.A,cards:(C.cards||[]).map(c=>[c[1],c[0]]),rs:(C.rs||[]).map(x=>[x[1],x[0]]),
  rst:(C.rst||[]).map(x=>({at:x.bt,al:x.bl,ap:x.bp,bt:x.at,bl:x.al,bp:x.ap})),log:(C.log||[]).map(e=>({...e,s:e.s?[e.s[1],e.s[0]]:e.s})),
  res:C.res?{...C.res,w:lvSw(C.res.w)}:C.res};
  if(C.rd){const d=C.rd,s0=d.s0||[0,0,0,0,0,0];M.rd={...d,dA:d.dB,dB:d.dA,kdA:d.kdB,kdB:d.kdA,lA:d.lB,lB:d.lA,sa:d.sb,sb:d.sa,s0:[s0[2],s0[3],s0[0],s0[1],s0[5],s0[4]]}}
  if(C.ev){const e=C.ev;M.ev={...e,a:e.b,b:e.a,hp0:[e.hp0[1],e.hp0[0]],hp1:[e.hp1[1],e.hp1[0]],stop:e.stop?{...e.stop,w:lvSw(e.stop.w)}:null}}
  return M}
function lvApply(F,st){const C=F.live.side==='A'?st:lvMirror(st),num=v=>typeof v==='number'&&isFinite(v);
  for(const k of['A','B']){const X=F[k],Y=C[k]||{};for(const q in Y)if(q!=='b'&&(num(Y[q])||typeof Y[q]==='string'||Y[q]==null))X[q]=Y[q]}
  F.r=onI(C.r,0,12,F.r);F.ph=onI(C.ph,0,3,F.ph);F.rd=C.rd||null;F.rs=C.rs||[];F.rst=C.rst||[];F.cards=C.cards||F.cards;F.log=(C.log||[]).map(e=>({r:onI(e.r,0,12,0),s:e.s,L:(e.L||[]).map(l=>({k:l.k?1:0,t:onT(l.t,200)}))}));
  F.done=!!C.done;F.res=C.res?{...C.res,txt:onT(C.res.txt,160)}:null;F.ev=C.ev||null}
async function lvQueue(bid,u){
  const t0=Date.now();u.srch={t0,live:true,n:0};onR();
  while(u.srch&&u.srch.live&&Date.now()-t0<LV_WAIT){
    let j=null;try{j=await rpc('cr_live_join',{p_token:ON.token,p_box:bid})}catch(e){break}
    if(!u.srch||!j)break;
    if(j.status==='match')return j;
    u.srch.n=onI(j.waiting,0,999,0);const el=document.getElementById('srch-live');if(el)el.textContent=`👤 Recherche d’un vrai joueur… ${Math.ceil((LV_WAIT-(Date.now()-t0))/1000)} s${u.srch.n?` · ${u.srch.n} en attente`:''}`;
    await new Promise(r=>setTimeout(r,1500));
  }
  try{await rpc('cr_live_leave',{p_token:ON.token,p_box:bid})}catch(e){}
  try{const j=await rpc('cr_live_join',{p_token:ON.token,p_box:bid});if(j&&j.status==='match')return j;await rpc('cr_live_leave',{p_token:ON.token,p_box:bid})}catch(e){}
  return null}
function lvStart(j,bid){
  const u=onUi(),mb=u.home.boxers.find(b=>b.id===bid),side=j.side==='A'?'A':'B',me=onB(side==='A'?j.b1:j.b2),op=onB(side==='A'?j.b2:j.b1);
  me.abil=mb?mb.abil:me.abil;u.srch=null;u.found=null;
  const f0=FORM;FORM=.08;let F;try{F=newFight(onFighter(me,true),onFighter(op,false),j.title?12:10,false)}finally{FORM=f0}
  F.cut=1;F.online={fid:op.id,bid,n:op.mgr,title:!!j.title,bn:op.name,live:1};F.live={mid:String(j.mid).replace(/[^0-9a-f-]/g,''),side,step:0,sent:false,init:side==='A',busy:false,wait0:0};
  beginFight(F);F.odds=null;updateFight();toast(`👤 Combat en direct contre ${op.mgr} !`);
  if(side==='A')rpc('cr_live_state',{p_token:ON.token,p_mid:F.live.mid,p_step:-1,p_state:lvSer(F)}).catch(()=>{});
  F.lvT=setInterval(()=>lvTick(F),800);
}
async function lvSubmit(F,inp){const L=F.live;if(!L||L.sent||F.done)return;L.sent=true;L.wait0=Date.now();
  const body={strat:inp.strat||F.strat||'eq',cs:inp.cs||null,fol:!!(F.adv&&F.adv.s&&F.strat===F.adv.s)};if(F.lvRx){body.rx=F.lvRx.rx;body.rxk=F.lvRx.rxk;F.lvRx=null}
  updateFight();try{const r=await rpc('cr_live_input',{p_token:ON.token,p_mid:L.mid,p_step:L.step,p_in:body});if(r&&r.ok===false&&r.status&&r.status!=='live')lvTick(F)}catch(e){L.sent=false;toast(e.message);updateFight()}}
function lvEff(inp,X,Y){if(!inp)return;const inst=has(X.b,'instinct')?1.25:1,g=RXG[inp.rxk];
  if(inp.rx==='good'&&g){X.rxA+=(g.a||0)*inst;X.rxD*=1+((g.d||1)-1)*inst;Y.rxA+=(g.bA||0)*inst;if(g.en)X.en=cl(X.en+g.en*inst,0,100);if(g.hp)X.hp=cl(X.hp+g.hp,0,100)}
  else if(inp.rx==='bad')X.rxA-=.04;else if(inp.rx==='slow')X.rxA-=.02;
  X.fol=inp.fol?.02*(has(X.b,'vision')?2:1):0}
function lvCompute(F,a,b){
  F.A.rxA=0;F.A.rxD=1;F.B.rxA=0;F.B.rxD=1;lvEff(a,F.A,F.B);lvEff(b,F.B,F.A);
  const sa=a&&a.strat||'eq',sb=b&&b.strat||F.lvLastB||'eq';F.lvLastB=sb;
  if(F.ph===0&&F.r>0){F.cs=a&&a.cs||null;F.csB=b&&b.cs||null}
  stepPhase(F,sa,sb)}
let lvAnim=false;
function lvPlay(F){F.stage='live';F.live.sent=false;
  const go=()=>lvAfter(F);
  if(S.set.anim&&F.ev){lvAnim=true;animatePhase(F.ev,()=>{lvAnim=false;go()});updateFight()}else go()}
function lvAfter(F){if(ui.fight!==F)return;setDisp(F);
  if(F.done){F.stage='done';F.odds=null;updateFight();if(F.live.side==='A'&&!F.live.fin)lvFinish(F);return}
  if(F.ph===0){F.stage='between';F.vis.A.kdT=F.vis.B.kdT=-1;if(S.set.odds)F.odds=oddsRound(F,40);F.adv=advise(F);updateFight();return}
  F.adv=advise(F);if(S.set.odds)F.odds=oddsRound(F,40);updateFight();
  F.since=(F.since||0)+1;
  if(F.r>0&&F.since>=2&&R()<.45){F.since=0;rxOpen(F);return}
  lvSubmit(F,{strat:F.strat})}
async function lvFinish(F){F.live.fin=true;const r=F.res||{};
  try{const x=await rpc('cr_live_finish',{p_token:ON.token,p_mid:F.live.mid,p_w:r.w==='A'?'A':r.w==='B'?'B':'D',p_method:r.m==='KO'||r.m==='TKO'?r.m:'DEC',p_rnd:onI(r.r,0,12,0)});lvReward(F,x.rw)}catch(e){F.live.fin=false;toast('Résultat non envoyé : '+e.message)}}
function lvReward(F,rw){if(!rw||F.live.rwShown)return;F.live.rwShown=true;const u=onUi(),ups=onI(rw.ups,0,40,0);
  if(u.home)u.home.me.coins=(u.home.me.coins||0)+onI(rw.coins,0,9999,0);if(onI(rw.sbonus,0,999,0))setTimeout(()=>toast(`🔥 Série de ${onI(rw.streak,0,999,0)} victoires ! +${onI(rw.sbonus,0,999,0)} 💰 bonus`),1800);
  toast(`${rw.title?'👑 NOUVEAU CHAMPION ! · ':''}+${onI(rw.xp,0,999,0)} XP · ELO ${rw.d>=0?'+':''}${onI(rw.d,-99,99,0)} · +${onI(rw.coins,0,9999,0)} 💰${ups?` · ⬆️ +${ups*4} pts`:''}`)}
async function lvTick(F){
  if(ui.fight!==F||!F.live){clearInterval(F.lvT);return}
  const L=F.live;if(L.busy||lvAnim||F.rx)return;L.busy=true;
  try{const p=await rpc('cr_live_poll',{p_token:ON.token,p_mid:L.mid,p_have:L.init?L.step:-1});
    F.lvAge=onI(p.other_age,0,99999,0);
    if(p.status!=='live'){
      if(p.status==='cancel'){clearInterval(F.lvT);toast('Combat annulé : l’adversaire est parti.');F.done=true;F.res={w:null,m:'DEC',r:F.r,txt:'Combat annulé'};F.stage='done';updateFight();return}
      if(!F.done||F.stage!=='done'){if(p.state){lvApply(F,p.state)}if(!F.done&&p.res){F.done=true;const w=F.live.side==='A'?p.res.w:lvSw(p.res.w);F.res={w:w==='D'?null:w,m:'TKO',r:F.r,txt:w===(F.live.side==='A'?'A':'A')?'Victoire : l’adversaire a abandonné':'Défaite par abandon'}}F.stage='done';updateFight()}
      lvReward(F,p.rw);clearInterval(F.lvT);return}
    if(!L.init&&p.state){lvApply(F,p.state);L.init=true;L.step=onI(p.step,0,999,0);F.adv=advise(F);updateFight();return}
    if(L.side==='B'){if(p.step>L.step&&p.state){lvApply(F,p.state);L.step=p.step;lvPlay(F)}else updateFight();return}
    // hôte : calcule quand les deux consignes sont là
    const a=p.in1&&typeof p.in1==='object'?p.in1:null,b=p.in2&&typeof p.in2==='object'?p.in2:null;
    const lim=F.stage==='live'?15000:45000,late=L.sent&&!b&&Date.now()-L.wait0>lim;
    if(a&&(b||late)){lvCompute(F,a,b);const r=await rpc('cr_live_state',{p_token:ON.token,p_mid:L.mid,p_step:L.step,p_state:lvSer(F)});
      if(r&&r.ok){L.step=onI(r.step,0,999,L.step+1);lvPlay(F)}}else updateFight()}
  catch(e){}finally{L.busy=false}}
async function lvForfeit(F){try{const r=await rpc('cr_live_forfeit',{p_token:ON.token,p_mid:F.live.mid});if(r.status==='live'){toast(`Attends encore ${Math.ceil(r.wait||5)} s`);return}lvTick(F)}catch(e){toast(e.message)}}
async function lvQuit(F){if(ui.confirm!=='lvq'){ui.confirm='lvq';updateFight();return}ui.confirm=null;try{await rpc('cr_live_quit',{p_token:ON.token,p_mid:F.live.mid})}catch(e){}clearInterval(F.lvT);F.done=true;F.res={w:'B',m:'TKO',r:F.r,txt:'Tu as abandonné le combat'};F.stage='done';updateFight()}
const _lvGo=goRound;
goRound=function(){const F=ui.fight;if(F&&F.live&&!F.done){if(!F.live.init)return;lvSubmit(F,{strat:F.strat,cs:F.ph===0&&F.r>0?(F.cs||autoCorner(F.A)):null});return}_lvGo()};
const _lvCtl=ctlHTML;
ctlHTML=function(F){let h=_lvCtl(F);if(!F.live)return h;const L=F.live,nm=esc(F.online.n||'l’adversaire');
  if(!L.init)return`<div class="rstat"><span>⏳ Connexion au combat de ${nm}…</span></div>`;
  if(F.stage!=='done'){
    if(L.sent&&(F.stage==='intro'||F.stage==='between'))h=h.replace(/<button class="btn pri big"[^>]*data-a="fround"[^>]*>[\s\S]*?<\/button>/,`<button class="btn big" style="flex:2" disabled>⏳ En attente de ${nm}…</button>`);
    if(L.sent&&F.stage==='live'&&Date.now()-L.wait0>1500)h=`<div class="rstat"><span>⏳ ${nm} réagit…</span></div>`+h;
    if((F.lvAge||0)>40)h+=`<button class="btn gold" style="width:100%;margin-top:8px" data-a="lvff">${nm} ne répond plus · Réclamer la victoire</button>`;
    h+=`<button class="btn ghost sm" style="margin-top:8px" data-a="lvq">${ui.confirm==='lvq'?'Confirmer l’abandon ?':'🏳️ Abandonner'}</button>`;
    h=h.replace('<span class="chip ','<span class="chip ');
  }
  return`<div class="small" style="text-align:center;margin-bottom:6px;color:var(--green)">🔴 EN DIRECT contre un vrai joueur</div>`+h};
/* ================= v44 : PROFILS, DÉFI DIRECT, CAMP, FATIGUE, TOURNOI, REPRISES, CLUBS, STYLE ================= */
const GLV=['#ff3d52','#4f80ff','#f4c34f','#3fd88a','#a77bff','#e9e9e9','#16181f','#ff8a2a','#ff5fb8','#22d3ee'];GLV.G='#ffd23a';GLV.N='#0d0d0d';
const ENT={feu:['🔥','Entrée en feu'],couronne:['👑','Entrée royale'],eclair:['⚡','Entrée électrique'],loup:['🐺','Entrée du loup'],artifice:['🎆','Feux d’artifice'],glace:['🧊','Sang-froid'],dragon:['🐉','Entrée du dragon']};
const ONCAMP={pow:['💥','Puissance'],spd:['⚡','Vitesse'],def:['🛡️','Défense'],sta:['🫁','Cardio'],chin:['🪨','Menton']};
const onTime=sec=>{sec=Math.max(0,sec|0);const h=Math.floor(sec/3600);return h?`${h} h ${Math.floor(sec%3600/60)} min`:`${Math.max(1,Math.ceil(sec/60))} min`};
const onReady=b=>b.campleft>0?{ok:false,t:`🏋️ En camp · encore ${onTime(b.campleft)}`}:b.inj>0?{ok:false,t:`🩹 Blessé · encore ${onTime(b.inj)}`}:b.fat>70?{ok:false,t:`😴 Épuisé (énergie ${100-b.fat} %) · prêt dans ${onTime((b.fat-70)*(b.fatrate||300))}`}:{ok:true};
/* --- reprises (enregistrées sur ce téléphone) --- */
function onSnap(b){const o={};for(const k of['id','name','nick','nat','age','div','pow','spd','def','sta','chin','w','l','d','ko','style','traits','look','fame'])if(b[k]!==undefined)o[k]=b[k];return o}
const RPK='cr_replays';
function rpLoad(){try{const a=JSON.parse(localStorage.getItem(RPK)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function rpSave(F){if(!F.online||!F.rpf||!F.rpf.length||F.replay)return;const fx=b=>{const o=onSnap(b);o.rating=b.rating;o.glv=b.glv;o.ent=b.ent;o.nick=b.nick;return o};
  const L=rpLoad();L.unshift({at:Date.now(),n:F.online.n,A:fx(F.A.b),B:fx(F.B.b),rounds:F.rounds,txt:F.res?onT(F.res.txt,160):'',w:F.res?F.res.w:null,m:F.res?F.res.m:'',f:F.rpf});
  try{localStorage.setItem(RPK,JSON.stringify(L.slice(0,6)))}catch(e){try{localStorage.setItem(RPK,JSON.stringify(L.slice(0,2)))}catch(e2){}}}
const _rpAnim=animatePhase;
animatePhase=function(ev,cb){const F=ui.fight;if(F&&F.online&&!F.replay){(F.rpf||(F.rpf=[])).push({ev,hp:[F.A.hp,F.B.hp],en:[F.A.en,F.B.en],kd:[F.A.kd,F.B.kd],cut:[F.A.cut||0,F.B.cut||0],land:[F.A.land,F.B.land],thr:[F.A.thr,F.B.thr],r:F.r,ph:F.ph,cards:F.cards.map(c=>c.slice())})}return _rpAnim(ev,cb)};
function rpPlay(i){const R0=rpLoad()[i];if(!R0)return;const mk=(b,m)=>Object.assign(onFighter(Object.assign({},b,{abil:[]}),m),{glv:b.glv});
  const F=newFight(mk(R0.A,true),mk(R0.B,false),R0.rounds||10,false);F.online={n:R0.n,replay:1};F.replay={d:R0,i:0};beginFight(F);F.stage='live';F.odds=null;F.speed=2;updateFight();setTimeout(()=>rpNext(F),600)}
function rpNext(F){if(ui.fight!==F)return;const fr=F.replay.d.f[F.replay.i++];
  if(!fr){F.done=true;F.res={w:F.replay.d.w,m:F.replay.d.m,r:F.r,txt:F.replay.d.txt||'Fin de la reprise'};settle(F);F.stage='done';updateFight();return}
  F.A.hp=fr.hp[0];F.B.hp=fr.hp[1];F.A.en=fr.en[0];F.B.en=fr.en[1];F.A.kd=fr.kd[0];F.B.kd=fr.kd[1];F.A.cut=fr.cut[0];F.B.cut=fr.cut[1];F.A.land=fr.land[0];F.B.land=fr.land[1];F.A.thr=fr.thr[0];F.B.thr=fr.thr[1];F.r=fr.r;F.ph=fr.ph;F.cards=fr.cards;
  _rpAnim(fr.ev,()=>{setDisp(F);updateFight();rpNext(F)});updateFight()}
/* --- profil public --- */
async function onProfile(pid){const u=onUi();u.prof={id:pid,d:null};onR();window.scrollTo(0,0);
  try{const r=await rpc('cr_profile',{p_token:ON.token,p_pid:pid});u.prof.d={p:onP(r.p),since:r.p.since,club:r.p.club?{name:onT(r.p.club.name,24),tag:onT(r.p.club.tag,4)}:null,trophies:(Array.isArray(r.p.trophies)?r.p.trophies:[]).slice(-20).map(t=>({t:onT(t.t,60),box:onT(t.box,40)})),
    boxers:(r.boxers||[]).map(onB),h2h:onP(r.h2h||{}),friend:r.friend===true,feed:(r.feed||[]).slice(0,12)}}catch(e){u.prof=null;toast(e.message)}onR()}
const onMgrLink=(pid,name,extra)=>pid?`<a href="#" class="mgrl" data-a="onprof" data-id="${esc(pid)}">${esc(name)}</a>${extra||''}`:esc(name);
function vOnProf(){const u=onUi(),P=u.prof,d=P.d;
  if(!d)return`<div class="panel"><p class="small">Chargement du profil…</p></div>`;
  const p=d.p,k=onRk(p.elo),me=u.home&&u.home.me&&u.home.me.id===P.id;
  return`<div class="panel"><div class="ph"><div style="min-width:0"><b class="nm" style="font-size:22px">${esc(p.name)}</b>${p.bot?' <span class="chip">IA</span>':''}${onStreak(p,1)}${onBadge(p)?' '+onBadge(p):''}${onTitle(p)}${p.cc?` <span class="chip">${ccFlag(p.cc)} ${esc(p.rn?onT(p.rn,40):ccName(p.cc))}</span>`:''}${d.club?` <span class="chip">[${esc(d.club.tag)}] ${esc(d.club.name)}</span>`:''}<span class="small" style="display:block">Gérant depuis ${new Date(d.since).toLocaleDateString('fr-CA')}</span></div><button class="btn sm" data-a="onprofx">← Retour</button></div>
    <div class="row" style="justify-content:space-between;margin-top:8px"><span>${k.ic} <b>${k.n}</b> · ${rpOf(p.elo)} ELO</span><span class="num">${onRec(p)} · ${p.kos} KO</span></div>
    ${!me?`<p class="small" style="margin:8px 0 0">Toi contre lui : <b class="num">${d.h2h.hw||0}-${d.h2h.hl||0}-${d.h2h.hd||0}</b>${d.friend?' · 🤝 ami':''}</p>`:''}
    ${d.friend&&!p.bot?`<button class="btn pri" style="width:100%;margin-top:10px" data-a="oninvfr" data-id="${esc(p.id)}">🔴 Défier en direct</button>`:''}</div>
    ${d.trophies.length?`<span class="lab" style="display:block;margin:12px 0 6px">🏆 Trophées</span><div class="panel">${d.trophies.map(t=>`<div class="small" style="padding:3px 0">🏆 ${esc(t.t.replace(/· ([a-z]+)$/,(m,x)=>'· '+onDiv(x)))} — ${esc(t.box)}</div>`).join('')}</div>`:''}
    <span class="lab" style="display:block;margin:12px 0 6px">🥊 Écurie (${d.boxers.length})</span><div class="list" style="grid-template-columns:1fr">${d.boxers.map(b=>`<div class="panel" style="padding:10px"><div class="row" style="flex-wrap:nowrap;gap:10px"><div class="av sm" style="width:44px;height:44px">${avatar(b,'blue')}</div><span style="min-width:0;flex:1"><b>${bxL(b,flag(b.nat)+' '+esc(b.name))}</b>${b.nick?` <i class="small">« ${esc(b.nick)} »</i>`:''}<br><span class="small">${onDiv(b.div)} · ${b.ovr} global · Niv. ${b.lvl} · ${onRec(b)} · ${onRankTxt(b)}</span></span><span class="small" style="text-align:right">${b.rating}</span></div></div>`).join('')||'<p class="small">Aucun boxeur.</p>'}</div>
    <span class="lab" style="display:block;margin:12px 0 6px">📜 Derniers combats</span><div class="panel">${d.feed.map(m=>{const w=m.res===0?'Nul':(m.res===1?m.n1:m.n2);return`<div class="small" style="padding:4px 0;border-bottom:1px solid var(--line)">${esc(onT(m.b1,40))} vs ${esc(onT(m.b2,40))} · <b>${esc(onT(w,16))}</b> ${m.method==='DEC'?'aux points':esc(m.method)}</div>`}).join('')||'<p class="small">Aucun combat.</p>'}</div>`}
/* --- défi direct entre amis --- */
let invT=0;
function invWatch(){clearInterval(invT);invT=setInterval(invTick,5000);invTick()}
async function invTick(){if(!ON||ui.tab!=='online'||ui.fight||ui.menu)return;const u=onUi();
  try{const r=await rpc('cr_invites',{p_token:ON.token});u.inc=(r.inc||[]).map(i=>({id:onT(i.id,40),from:onT(i.from,16),div:ON_DIV.includes(i.div)?i.div:'moyen',box:onB(i.box),mine:i.mine?String(i.mine).replace(/[^0-9a-f-]/g,''):null}));
    const o=r.out;if(u.inv&&o&&o.id===u.inv.id){if(o.status==='accepted'&&o.m){const j=o.m,bid=u.inv.box;u.inv=null;lvPresent(j,bid,()=>lvStart(j,bid));return}
      if(o.status==='refused'||o.status==='expired'||o.status==='cancel'){toast(o.status==='refused'?`${u.inv.to} a refusé le défi`:'Défi expiré');u.inv=null}}
    invBanner()}catch(e){}}
function invBanner(){const u=onUi(),i=(u.inc||[])[0];let el=document.getElementById('invb');
  if(!i||ui.fight){if(el)el.hidden=true;return}
  if(!el){el=Object.assign(document.createElement('div'),{id:'invb',className:'invb'});document.body.appendChild(el)}
  el.innerHTML=`<b>📩 ${esc(i.from)} te défie en direct !</b><span class="small">${onDiv(i.div)} · ${esc(i.box.name)} (${i.box.ovr})${i.mine?'':' · tu n’as pas de boxeur dans ce poids'}</span><div class="row" style="flex-wrap:nowrap;margin-top:8px"><button class="btn pri" style="flex:1" data-a="oninvok" data-id="${esc(i.id)}" ${i.mine?'':'disabled'}>Accepter</button><button class="btn" style="flex:1" data-a="oninvno" data-id="${esc(i.id)}">Refuser</button></div>`;el.hidden=false}
async function invAnswer(id,ok){const u=onUi(),i=(u.inc||[]).find(x=>x.id===id);u.inc=(u.inc||[]).filter(x=>x.id!==id);invBanner();
  try{const j=await rpc('cr_invite_answer',{p_token:ON.token,p_inv:id,p_ok:ok});if(ok&&j.status==='match'&&i){ui.fight=null;lvPresent(j,i.mine,()=>lvStart(j,i.mine))}}catch(e){toast(e.message)}}
async function invSend(pid,bid){const u=onUi(),f=u.home.friends.find(x=>x.id===pid),b=u.home.boxers.find(x=>x.id===bid);if(!f||!b)return;
  const rd=onReady(b);if(!rd.ok){toast(rd.t);return}
  try{const r=await rpc('cr_invite',{p_token:ON.token,p_box:bid,p_to:pid});u.inv={id:onT(r.id,40),to:f.name,box:bid,t0:Date.now()};u.invPick=null;onR();invWatch()}catch(e){toast(e.message)}}
function vOnInvWait(){const u=onUi(),s=Math.max(0,120-Math.round((Date.now()-u.inv.t0)/1000));
  return`<div class="panel srch"><div class="radar"><i></i><i></i><i></i><div class="av lg">${avatar(u.home.boxers.find(b=>b.id===u.inv.box)||{},'red')}</div></div>
    <b class="nm" style="font-size:20px;display:block;text-align:center;margin-top:14px">Défi envoyé à ${esc(u.inv.to)}</b><p class="small" style="text-align:center">On attend sa réponse… (expire dans ${Math.ceil(s/60)} min)</p>
    <button class="btn" style="width:100%;margin-top:10px" data-a="oninvx">Annuler</button></div>`}
/* --- clubs --- */
/* --- série de victoires --- */
const onStreak=(p,big)=>{const n=onI(p&&p.ostreak,0,999,0);return n>=3?(big?` <span class="chip gold">🔥 ${n} de suite</span>`:` · 🔥 <b>${n}</b> de suite`):''};
/* --- coffre quotidien --- */
const DLY_R=[30,40,50,60,80,100,250];
async function dlyLoad(pop){const u=onUi();try{const r=await rpc('cr_daily',{p_token:ON.token,p_claim:false});u.dly={day:onI(r.day,1,7,1),claimed:r.claimed===true};if(pop&&!u.dly.claimed&&ui.tab==='online'&&!ui.fight)chestShow()}catch(e){u.dly={day:1,claimed:true,err:1}}onR()}
const dly7=(d,cl)=>`<div class="dly7">${DLY_R.map((c,i)=>{const n=i+1,ok=n<d||(n===d&&cl),now=n===d&&!cl;return`<i class="${ok?'ok':''} ${now?'now':''} ${n===7?'big':''}">J${n}<b>${ok?'✓':n===7?'🎁':c}</b>${n===7?'250+':'💰'}</i>`}).join('')}</div>`;
function chestShow(){const u=onUi(),D=u.dly;if(!D)return;let el=document.getElementById('chestm');
  if(!el){el=Object.assign(document.createElement('div'),{id:'chestm',className:'chm'});document.body.appendChild(el)}
  const got=D.got;
  el.innerHTML=`<div class="box"><span class="ico">${got?'✨':'🧰'}</span><b class="nm" style="font-size:22px;display:block">${got?`+${got.gain+got.bonus} 💰`:`Coffre du jour · Jour ${D.day}`}</b>
    <p class="small" style="margin:6px 0 0">${got?(got.bonus?`🎉 JACKPOT ! ${got.gain} + ${got.bonus} 💰 bonus`:`Reviens demain pour le jour ${D.day%7+1}.`):'Connecte-toi chaque jour : la récompense monte jusqu’au jour 7 (250 💰 + chance de jackpot 500 💰). Un jour manqué = retour au jour 1.'}</p>
    ${dly7(D.day,D.claimed)}
    ${got?`<button class="btn pri" style="width:100%" data-a="dlyx">Super !</button>`:`<button class="btn gold" style="width:100%" data-a="dlyopen">Ouvrir le coffre (+${DLY_R[D.day-1]} 💰)</button><button class="btn ghost sm" style="width:100%;margin-top:6px" data-a="dlyx">Plus tard</button>`}</div>`;
  el.hidden=false;try{sfx('win')}catch(e){}}
function chestHide(){const el=document.getElementById('chestm');if(el)el.hidden=true;const u=onUi();if(u.dly)u.dly.got=null;onR()}
async function dlyClaim(){const u=onUi();if(u.dly&&u.dly.busy)return;if(u.dly)u.dly.busy=1;
  try{const r=await rpc('cr_daily',{p_token:ON.token,p_claim:true});const g={gain:onI(r.gain,0,9999,0),bonus:onI(r.bonus,0,9999,0)};
    u.dly={day:onI(r.day,1,7,1),claimed:true,got:g};if(u.home)u.home.me.coins=(u.home.me.coins||0)+g.gain+g.bonus;chestShow()}
  catch(e){if(u.dly)u.dly.busy=0;toast(e.message)}onR()}
function vOnDaily(){const u=onUi(),D=u.dly;if(!D){if(!u.dlyL){u.dlyL=1;setTimeout(()=>dlyLoad(false),0)}return''}
  return`<div class="panel" style="margin-bottom:10px"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px"><span><span class="lab">🧰 Coffre quotidien</span><span class="small" style="display:block">Série de connexion : jour ${D.day}/7</span></span>
    ${D.claimed?'<span class="chip">✅ Demain</span>':`<button class="btn gold sm" data-a="dlyopen">Ouvrir +${DLY_R[D.day-1]} 💰</button>`}</div>${dly7(D.day,D.claimed)}</div>`}
/* --- commanditaires --- */
const spT=sec=>{sec=Math.max(0,sec|0);const h=Math.floor(sec/3600);return h>=24?`${Math.floor(h/24)} j ${h%24} h`:`${h} h ${Math.floor(sec%3600/60)} min`};
const spO=o=>o&&({id:onT(o.id,10),brand:onT(o.brand,24),t:onT(o.t,60),n:onI(o.n,1,999,1),c:onI(o.c,0,9999,0),v:onI(o.v,0,9999,0),left:onI(o.left,0,9e6,0)});
async function spLoad(act,i){const u=onUi();if(act&&u.sp)u.sp.busy=1;
  try{const r=await rpc('cr_sponsor',{p_token:ON.token,p_act:act||'get',p_i:i|0});u.sp={offers:(r.offers||[]).map(spO),active:r.active?spO(r.active):null};
    if(act==='sign')toast(`✍️ Contrat signé avec ${u.sp.active?u.sp.active.brand:'le commanditaire'} !`);
    if(act==='claim'){const g=onI(r.gain,0,9999,0);toast(`🤝 Contrat rempli ! +${g} 💰`);if(u.home)u.home.me.coins=(u.home.me.coins||0)+g}
    if(act==='quit')toast('Contrat annulé')}
  catch(e){toast(e.message);if(!u.sp)u.sp={offers:[],active:null,err:1};u.sp.busy=0}onR()}
function vOnSpons(){const u=onUi(),P=u.sp;if(!P){if(!u.spL){u.spL=1;setTimeout(()=>spLoad(),0)}return''}
  const A=P.active;
  if(A){const ok=A.v>=A.n;return`<div class="panel" style="margin-bottom:10px;border-color:var(--gold)"><span class="lab">🤝 Commanditaire</span>
    <div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px;margin-top:6px"><span style="min-width:0;flex:1"><b>${esc(A.brand)}</b><br><span class="small">${esc(A.t)} · ${Math.min(A.v,A.n)}/${A.n}</span>${onBar(Math.min(A.v,A.n),A.n,ok?'green':'gold')}<span class="small">⏳ ${spT(A.left)} restants</span></span>
    <button class="btn ${ok?'gold':''} sm" data-a="spclaim" ${ok&&!P.busy?'':'disabled'}>+${A.c} 💰</button></div>
    <button class="btn ghost sm" style="margin-top:8px" data-a="spquit">${ui.confirm==='spq'?'Confirmer l’annulation ?':'Quitter le contrat'}</button></div>`}
  return`<div class="panel" style="margin-bottom:10px"><span class="lab">🤝 Commanditaires</span><p class="small" style="margin:4px 0 8px">Signe <b>un</b> contrat à la fois. Tu as 7 jours pour le remplir. Nouvelles offres chaque jour.</p>
    ${P.offers.map((o,i)=>`<div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px;padding:8px 0;border-top:1px solid var(--line)"><span style="min-width:0;flex:1"><b>${esc(o.brand)}</b><br><span class="small">${esc(o.t)}</span></span><span style="text-align:right"><b class="num" style="color:var(--gold)">${o.c} 💰</b><br><button class="btn pri sm" data-a="spsign" data-k="${i}" ${P.busy?'disabled':''}>Signer</button></span></div>`).join('')||'<p class="small">Aucune offre.</p>'}</div>`}
/* --- clubs --- */
/* ===== clubs v2 : page, emblèmes, rangs de club, guerres ===== */
const CLR={president:['👑 Président','pr'],recruteur:['🎯 Recruteur','rc'],membre:['Membre','']};
Object.assign(ICP,{crown:'<path d="M3 18l1.5-10 5 4.5L12 5l2.5 7.5 5-4.5L21 18z"/><path d="M3 21h18"/>',skull:'<path d="M12 3a8 8 0 00-5 14v3h10v-3a8 8 0 00-5-14z"/><circle cx="9" cy="11" r="1.6" fill="currentColor"/><circle cx="15" cy="11" r="1.6" fill="currentColor"/><path d="M10 20v-2M14 20v-2M11 15h2"/>',
 star:'<path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z"/>',fire:'<path d="M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2.5 1.5-3.5 2-6 1.5 1.5 2 3 2 3s1-4 1-7z"/>',
 wolf:'<path d="M4 4l4 5h8l4-5-1 9-3 4-4 3-4-3-3-4z"/><circle cx="9.5" cy="12" r="1" fill="currentColor"/><circle cx="14.5" cy="12" r="1" fill="currentColor"/><path d="M11 16h2"/>',
 shield:'<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',swords:'<path d="M4 4l9 9M20 4l-9 9M6 16l-2 2 2 2 2-2M18 16l2 2-2 2-2-2M8 14l2 2M16 14l-2 2"/>'});
const CEM_I=['glove','crown','bolt','trophy','belt','skull','star','fire','wolf','shield'];
const CEM_C=[['#ff5a6e','#7d0d1b'],['#5aa0ff','#13306e'],['#ffd23a','#7a5200'],['#36d27e','#0b4a2a'],['#b36bff','#3a1470'],['#ff8a2a','#6b2a00'],['#e8edf5','#3c4556'],['#22d3ee','#0a4250']];
/* ===== rangs de club (trophées de guerre) : bannières ===== */
const CLRK=[[0,'Recrues',['#c9ced8','#5b6270','#1d2129']],[100,'Bagarreurs',['#ffcf9e','#b8652a','#3a1a06']],[250,'Guerriers',['#ffffff','#a9b6c8','#2a3240']],[500,'Vétérans',['#fff3b0','#e8b22a','#5a3c00']],
  [800,'Conquérants',['#c8ffe0','#22b86a','#053a20']],[1200,'Seigneurs de guerre',['#ffc4cf','#c8102e','#2a0008']],[1700,'Empire',['#e9d6ff','#8a4dff','#1e0a45']],[2400,'Dynastie',['#fff','#ffd86b','#7a2bd8']]];
const clRk=t=>{let i=0;for(let j=0;j<CLRK.length;j++)if(t>=CLRK[j][0])i=j;const n=CLRK[i+1];return{i,n:CLRK[i][1],nx:n?n[1]:null,need:n?n[0]-t:0,pct:n?Math.round((t-CLRK[i][0])/(n[0]-CLRK[i][0])*100):100}};
function clRkSVG(i,px){i=Math.max(0,Math.min(7,i|0));const[l,m,d]=CLRK[i][2],id='crk'+i;px=px||28;
  const sw=`<g stroke="${l}" stroke-width="3.2" stroke-linecap="round"><path d="M36 30 L64 62"/><path d="M64 30 L36 62"/></g><g stroke="${d}" stroke-width="5" stroke-linecap="round"><path d="M38 58 L32 64"/><path d="M62 58 L68 64"/></g><path d="M33 33 h6 M61 33 h6" stroke="${m}" stroke-width="3"/>`;
  const crown=`<path d="M36 38 L34 24 L42 30 L50 20 L58 30 L66 24 L64 38 Z" fill="${l}" stroke="${d}" stroke-width="1.4"/>`;
  const laurel=i>=4?`<path d="M28 70 C20 58 22 40 30 32 M72 70 C80 58 78 40 70 32" fill="none" stroke="${l}" stroke-width="2.4" stroke-linecap="round"/>${[0,1,2].map(k=>`<ellipse cx="${26-k}" cy="${62-k*10}" rx="4" ry="2" fill="${l}" transform="rotate(-50 ${26-k} ${62-k*10})"/><ellipse cx="${74+k}" cy="${62-k*10}" rx="4" ry="2" fill="${l}" transform="rotate(50 ${74+k} ${62-k*10})"/>`).join('')}`:'';
  const chev=Array.from({length:Math.min(3,i%4+1)},(_,k)=>`<path d="M38 ${72+k*5} L50 ${78+k*5} L62 ${72+k*5}" fill="none" stroke="${l}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  const glow=i>=5?`<circle cx="50" cy="50" r="46" fill="url(#${id}g)"/>`:'';
  const flames=i>=6?`<path d="M20 20 C14 10 22 4 26 12 C28 2 36 4 34 14 M80 20 C86 10 78 4 74 12 C72 2 64 4 66 14" fill="none" stroke="${i===7?'#7ff3ff':'#ff7ad9'}" stroke-width="2.4" stroke-linecap="round"/>`:'';
  return`<svg class="crk" viewBox="0 0 100 100" width="${px}" height="${px}" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".5" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></linearGradient>
    ${i===7?`<linearGradient id="${id}p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ff3ff"/><stop offset=".35" stop-color="#ffd86b"/><stop offset=".7" stop-color="#ff7ad9"/><stop offset="1" stop-color="#8a6bff"/></linearGradient>`:''}
    <radialGradient id="${id}g"><stop offset="0" stop-color="${m}" stop-opacity=".6"/><stop offset="1" stop-color="${m}" stop-opacity="0"/></radialGradient></defs>
    ${glow}${flames}<rect x="14" y="10" width="72" height="6" rx="3" fill="${l}" stroke="${d}" stroke-width="1.2"/><circle cx="14" cy="13" r="4.5" fill="${l}" stroke="${d}"/><circle cx="86" cy="13" r="4.5" fill="${l}" stroke="${d}"/>
    <path d="M22 16 H78 V82 L50 96 L22 82 Z" fill="url(#${i===7?id+'p':id})" stroke="${d}" stroke-width="2.2"/><path d="M28 22 H72 V78 L50 89 L28 78 Z" fill="#0b0d14" opacity=".55"/>
    ${laurel}${sw}${i>=3?crown:''}${chev}</svg>`}

let cemN=0;
function clubEm(em,tag,px){em=em||{};const c=CEM_C[em.c|0]||CEM_C[0],i=CEM_I.includes(em.i)?em.i:'glove',n=++cemN;px=px||48;
  return`<svg class="cem" viewBox="0 0 60 70" width="${px}" height="${Math.round(px*70/60)}" aria-hidden="true"><defs><linearGradient id="cg${n}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs>
    <path d="M30 2 56 11v22c0 17-11 28-26 35C15 61 4 50 4 33V11z" fill="url(#cg${n})" stroke="#ffe27a" stroke-width="2"/>
    <path d="M30 8 50 15v18c0 13-8.5 22-20 28C18.5 55 10 46 10 33V15z" fill="#0b0d14" opacity=".55"/>
    <g transform="translate(15 13) scale(1.25)" color="#fff" style="color:#fff">${ic(i).replace('class="ico ','class="').replace('<svg','<g').replace('</svg>','</g>').replace(/viewBox="[^"]*"/,'')}</g>
    ${tag?`<rect x="12" y="48" width="36" height="12" rx="3" fill="#0b0d14" stroke="#ffe27a" stroke-width="1"/><text x="30" y="57" text-anchor="middle" font-size="8.5" font-weight="900" fill="#ffe27a" font-family="system-ui" letter-spacing=".5">${esc(String(tag).slice(0,4))}</text>`:''}</svg>`}
const clubP=c=>c&&({id:String(c.id||'').replace(/[^0-9a-f-]/g,''),name:onT(c.name,24),tag:onT(c.tag,4),code:onT(c.code,8),owner:c.owner,emblem:{c:onI(c.emblem&&c.emblem.c,0,7,0),i:CEM_I.includes(c.emblem&&c.emblem.i)?c.emblem.i:'glove'},
  descr:onT(c.descr,80),open:c.open!==false,crating:onI(c.crating,0,9999,1000),trophies:onI(c.trophies,0,99999,0),elo:onI(c.elo,0,9999,0),ww:onI(c.ww,0,9999,0),wl:onI(c.wl,0,9999,0),n:onI(c.n,0,99,0),wins:onI(c.wins,0,999999,0),wk:onI(c.wk,0,99999,0),goal:onI(c.goal,1,999,30),
  pending:c.pending===true,war:c.war===true,members:(c.members||[]).map(m=>Object.assign(onP(m),{role:CLR[m.role]?m.role:'membre'}))});
async function clubLoad(act,a,b){const u=onUi();try{const r=await rpc('cr_club',{p_token:ON.token,p_act:act||'get',p_a:a||null,p_b:b||null});const c=r.club;
  u.club=c?clubP(c):false;
  const W=r.war;u.cwar=W?{id:onT(W.id,40),status:W.status==='on'?'on':'done',left:onI(W.left,0,9e6,0),until:Date.now()+onI(W.left,0,9e6,0)*1000,me:onI(W.me,0,99999,0),them:onI(W.them,0,99999,0),won:W.won===true,draw:W.draw===true,d:onI(W.d,-99,99,0),claimed:W.claimed===true,vs:W.vs?clubP(W.vs):null}:null;
  u.clubx={role:CLR[r.myrole]?r.myrole:null,claimed:r.claimed===true,req:(r.requests||[]).map(onP),pend:r.pending?{name:onT(r.pending.name,24),tag:onT(r.pending.tag,4)}:null};
  try{chatReset(!!c)}catch(e){}
  if(u.home&&r.coins!=null)u.home.me.coins=onI(r.coins,0,9e9,u.home.me.coins);
  const T={create:'🏟️ Club créé !',leave:'Tu as quitté le club',cancelreq:'Demande annulée',accept:'✅ Nouveau membre accepté',refuse:'Demande refusée',kick:'Membre expulsé',claim:'🏟️ Objectif du club : +250 💰',edit:'✅ Club modifié',war:'⚔️ La guerre est lancée ! 24 h pour gagner le plus de combats.'};
  if(act==='join')toast(r.joined?'🤝 Bienvenue dans le club !':'📨 Demande envoyée. Un président ou un recruteur doit l’accepter.');else if(act==='role')toast(b==='recruteur'?'🎯 Promu recruteur':'Rôle retiré');
  else if(act==='warclaim')toast(`⚔️ Récompense de guerre : +${onI(r.gain,0,9999,0)} 💰`);else if(T[act])toast(T[act]);
  if(act==='join'||act==='leave'||act==='create'){u.clist=null;u.cview=null;u.clubBrowse=0;u.wall=null;onLoad(true)}}catch(e){toast(e.message);if(u.club===undefined)u.club=false}onR()}

/* ===== fiche d'un club (publique) ===== */
async function clubView(id){const u=onUi();u.cview={id,d:null};onR();window.scrollTo(0,0);
  try{const r=await rpc('cr_club_view',{p_token:ON.token,p_club:id});const c=clubP(r.club);c.mine=r.club.mine===true;const W=r.war;
    u.cview.d={c,war:W?{status:W.status==='on'?'on':'done',left:onI(W.left,0,9e6,0),until:Date.now()+onI(W.left,0,9e6,0)*1000,me:onI(W.me,0,99999,0),them:onI(W.them,0,99999,0),won:W.won===true,draw:W.draw===true,vs:W.vs?clubP(W.vs):null}:null,
      wars:(r.wars||[]).map(x=>({vs:onT(x.vs,24),tag:onT(x.tag,4),me:onI(x.me,0,99999,0),them:onI(x.them,0,99999,0),won:x.won===true,draw:x.draw===true,at:x.at}))}}catch(e){u.cview=null;toast(e.message)}onR()}
function vOnClubView(){const u=onUi(),V=u.cview,d=V.d;if(!d)return'<div class="panel"><p class="small">Chargement du club…</p></div>';
  const c=d.c,k=clRk(c.trophies),W=d.war,inClub=!!u.club,full=c.n>=30;
  const mem=c.members.map((m,i)=>`<a href="#" class="clm clm-l" data-a="onprof" data-id="${esc(m.id)}"><span class="clm-r">${i+1}</span><span style="min-width:0;flex:1">${onBadge(m)}<b>${esc(m.name)}</b>${m.role!=='membre'?`<span class="rlb ${CLR[m.role][1]}">${CLR[m.role][0]}</span>`:''}${m.bot?' <span class="chip" style="font-size:10px">IA</span>':''}<br><span class="small" style="opacity:.75">${onRk(m.elo).ic} ${rpOf(m.elo)} · ${onRec(m)}</span></span><span class="small" style="opacity:.6">›</span></a>`).join('');
  return`<button class="btn ghost sm" style="margin-bottom:8px" data-a="cviewx">← Retour</button>
    <div class="panel club-head"><div class="clh-top">${clubEm(c.emblem,c.tag,78)}<div style="min-width:0;flex:1"><b class="nm" style="font-size:21px;display:block">${esc(c.name)}</b><span class="small">[${esc(c.tag)}] · 👥 ${c.n}/30 · ${c.open?'🔓 Ouvert':'📨 Sur demande'}</span>${c.descr?`<span class="small" style="display:block;opacity:.8;margin-top:2px">${esc(c.descr)}</span>`:''}</div></div>
      <div class="clh-st"><a href="#" data-a="clrkv">${clRkSVG(k.i,34)}<b>${k.n}</b><span>Rang ›</span></a><div><b class="num">🏆 ${c.trophies}</b><span>Trophées</span></div><div><b>⚔️ ${c.ww}-${c.wl}</b><span>Guerres</span></div><div><b class="num">${c.crating}</b><span>Cote</span></div></div>${onBar(k.pct,100)}<span class="small">${k.nx?`${k.need} trophées pour ${k.nx}`:'Rang maximum'}</span>
      ${c.mine?'<p class="small" style="margin:10px 0 0;color:var(--gold)">C’est ton club.</p>':inClub?'<p class="small" style="margin:10px 0 0;opacity:.75">Quitte ton club pour rejoindre celui-ci.</p>':`<button class="btn ${c.pending?'':'pri'}" style="width:100%;margin-top:10px" data-a="clubjoinid" data-k="${c.id}" ${full||c.pending?'disabled':''}>${full?'Club plein':c.pending?'Demande envoyée':c.open?'🤝 Rejoindre ce club':'📨 Demander à entrer'}</button>`}</div>
    ${W&&W.status==='on'?`<div class="war on"><div class="war-h">⚔️ EN GUERRE <span class="small">fin dans <b data-cd="${W.until}">${cdTxt(W.left)}</b></span></div><div class="war-vs"><div class="war-s">${clubEm(c.emblem,c.tag,46)}<b>${esc(c.name)}</b><span class="war-n">${W.me}</span></div><div class="war-x">VS</div><div class="war-s" ${W.vs?`data-a="clubview" data-k="${W.vs.id}"`:''}>${W.vs?clubEm(W.vs.emblem,W.vs.tag,46):''}<b>${W.vs?esc(W.vs.name):'?'}</b><span class="war-n">${W.them}</span></div></div></div>`:''}
    ${d.wars.length?`<span class="lab" style="display:block;margin:12px 0 6px">⚔️ Dernières guerres</span><div class="panel">${d.wars.map(x=>`<div class="small" style="padding:5px 0;border-bottom:1px solid var(--line)"><b style="color:${x.won?'#36d27e':x.draw?'var(--muted)':'#ff5a6e'}">${x.won?'Victoire':x.draw?'Égalité':'Défaite'}</b> ${x.me}-${x.them} contre [${esc(x.tag)}] ${esc(x.vs)}</div>`).join('')}</div>`:''}
    <span class="lab" style="display:block;margin:12px 0 6px">👔 Gérants (${c.n}) · touche pour voir le profil</span><div class="panel">${mem||'<p class="small" style="margin:0">Aucun membre.</p>'}</div>`}


const CSORT=[['trophies','🏆 Rang'],['crating','📈 Cote'],['ww','⚔️ Guerres'],['elo','👔 ELO'],['n','👥 Membres']];
function vClubBoard(L){const u=onUi(),k=u.csort||'trophies',S=[...L].sort((a,b)=>(b[k]-a[k])||(b.trophies-a.trophies));
  const val=c=>k==='trophies'?`🏆 ${c.trophies}`:k==='crating'?`${c.crating}`:k==='ww'?`${c.ww}-${c.wl}`:k==='elo'?`${c.elo}`:`${c.n}/30`;
  return`<div class="csort">${CSORT.map(([x,n])=>`<button data-a="csort" data-k="${x}" aria-pressed="${k===x}">${n}</button>`).join('')}</div>
    <button class="btn ghost sm" style="width:100%;margin-bottom:8px" data-a="clrkv">${clRkSVG(7,18)} Voir les 8 rangs de club</button>
    <div class="cllist">${S.map((c,i)=>`<div class="clrow"><span class="clm-r ${i<3?'top':''}">${i<3?['🥇','🥈','🥉'][i]:i+1}</span>${clubCard(c,0)}<span class="csv">${val(c)}</span></div>`).join('')||'<p class="small">Aucun club.</p>'}</div>`}
function vClRanks(){const u=onUi(),my=u.club?u.club.trophies:-1;
  return`<div class="abrv" data-a="clrkx" style="align-items:flex-start;overflow:auto;padding:20px 14px"><div class="panel" style="width:100%;max-width:420px;margin:auto"><div class="ph"><b class="nm" style="font-size:19px">Rangs de club</b><button class="btn sm" data-a="clrkx">✕</button></div>
    <p class="small" style="margin:0 0 8px">Les rangs de club se gagnent <b>seulement avec les guerres</b> : victoire +30 trophées (plus contre un club plus fort), égalité +10, défaite −15.</p>
    ${CLRK.map(([t,n],i)=>{const got=my>=t,cur=got&&!(CLRK[i+1]&&my>=CLRK[i+1][0]);return`<div class="clrk-row ${cur?'cur':''} ${got?'':'lock'}">${clRkSVG(i,46)}<span style="flex:1"><b>${n}</b><br><span class="small">${t?`${t} trophées`:'Départ'}</span></span>${cur?'<span class="chip gold">Ton club</span>':''}</div>`}).join('')}</div></div>`}

/* ===== combats de légende ===== */
const LEG=[
 {n:'Seamus O’Hara',k:'Le Bûcheron',nat:'IE',ovr:56,c:400,ab:'canon',p:[1.1,.9,.95,1,1.05],lk:{skin:0,hair:5,hc:5,beard:2,tr:3},st:'Bûcheron irlandais des années 60, il cognait comme une hache. Il commence fort : tiens le coup les premiers rounds.'},
 {n:'Rosario Vega',k:'El Tiburón',nat:'MX',ovr:60,c:500,ab:'requin',p:[1.05,1,.95,1.05,1],lk:{skin:3,hair:1,hc:0,beard:3,tr:0},st:'Le requin de Tijuana : dès que tu saignes, il attaque. Évite d’être ébranlé.'},
 {n:'Big Mike Duvall',k:'Le Volcan',nat:'US',ovr:64,c:650,ab:'volcan',p:[1.15,.9,.9,1,1.05],lk:{skin:5,hair:0,hc:0,beard:1,tr:1},st:'Un poids lourd du Bronx qui explose sans prévenir. Ses knockdowns arrivent de nulle part.'},
 {n:'Hans « Thor » Krüger',k:'Le Marteau de 1975',nat:'DE',ovr:68,c:800,ab:'marteau',p:[1.15,.95,.95,1,1],lk:{skin:0,hair:3,hc:4,beard:2,tr:2},st:'Champion d’Europe en 1975. Une droite comme un marteau de forge.'},
 {n:'Takeshi Mori',k:'L’Éclair d’Osaka',nat:'JP',ovr:72,c:1000,ab:'foudre',p:[.95,1.15,1.05,1,.9],lk:{skin:1,hair:1,hc:0,beard:0,tr:4},st:'Le plus rapide de sa génération. Il lance deux coups quand tu en lances un.'},
 {n:'Viktor Volkov',k:'Le Titan de Kyiv',nat:'UA',ovr:76,c:1250,ab:'titan',p:[1.05,.9,1.1,1.05,1.1],lk:{skin:0,hair:4,hc:3,beard:0,tr:5},st:'Une montagne de muscles qui n’est jamais tombée. Il faudra frapper longtemps.'},
 {n:'Marcus King',k:'Le Roi Lion',nat:'GB',ovr:80,c:1500,ab:'lion',p:[1.1,1,1,1,1],lk:{skin:4,hair:2,hc:0,beard:1,tr:3},st:'Roi de Londres pendant 10 ans. Il finit toujours ce qu’il commence.'},
 {n:'Ángel Ríos',k:'La Mariposa',nat:'PR',ovr:84,c:2000,ab:'papillon',p:[.95,1.15,1.1,1.05,.9],lk:{skin:2,hair:1,hc:1,beard:0,tr:0},st:'Il vole comme un papillon et pique comme une abeille. Presque impossible à toucher.'},
 {n:'Li Wei',k:'Le Dragon',nat:'PH',ovr:88,c:2500,ab:'dragonab',p:[1.15,1.05,1,1,.95],lk:{skin:2,hair:5,hc:0,beard:0,tr:6},st:'On dit qu’il n’a jamais perdu un round. Son souffle du dragon met tout le monde au tapis.'},
 {n:'Joe « The GOAT » Freeman',k:'Le plus grand de tous',nat:'US',ovr:94,c:4000,ab:'goat',p:[1.05,1.05,1.05,1.05,1.05],lk:{skin:5,hair:1,hc:0,beard:2,tr:7},st:'Le meilleur de l’histoire. Le battre fait de toi une légende vivante.'}];
const legId=i=>'00000000-0000-4000-8000-0000000000'+String(10+i);
function legBox(i,div){const L=LEG[i],[a,b,c,d,e]=L.p,o=L.ovr,f=x=>Math.max(40,Math.min(99,Math.round(o*x)));
  return onB({id:legId(i),pid:'00000000-0000-4000-8000-000000000000',div,name:L.n,nick:L.k,nat:L.nat,style:i%2?'eq':'agr',look:Object.assign({scar:i>4},L.lk),pow:f(a),spd:f(b),def:f(c),sta:f(d),chin:f(e),ovr:o,lvl:Math.min(40,10+i*3),xp:0,need:999,
    rating:1700+i*40,w:40+i*4,l:i%3,d:0,ko:30+i*3,streak:20,rank:1,mgr:'Panthéon',bot:true,abil:[L.ab,abLegOf(i)[0],...['bombe','titan','foudre','lion','immortel','marteau'].filter(x=>x!==L.ab)].slice(0,3),slots:3,fat:0,cos:{glove:i>=7?'G':i>=4?'2':null,ent:i>=8?'dragon':i>=5?'couronne':'feu'}})}
async function legLoad(){const u=onUi();try{const r=await rpc('cr_legends',{p_token:ON.token});const W={},C={};for(const[k,v]of Object.entries(r.wins||{})){const i=parseInt(k,10);if(i>=0&&i<=9)W[i]=Math.max(0,parseInt(v,10)||0)}for(const[k,v]of Object.entries(r.cd||{})){const i=parseInt(k,10);if(i>=0&&i<=9)C[i]=Math.max(0,parseInt(v,10)||0)}u.leg={beaten:(r.beaten||[]).map(x=>onI(x,0,9,0)),wins:W,x:(r.x||[]).map(x=>onI(x,0,9,0)),cd:C,cd0:Date.now(),today:(r.today||[]).map(x=>String(x))}}catch(e){u.leg={beaten:[],wins:{},x:[],cd:{},cd0:Date.now(),today:[]};toast(e.message)}onR()}
function vOnLegCard(){const u=onUi(),G=u.leg;const n=G?G.beaten.length:0;
  return`<a href="#" class="panel leg-card" data-a="onleg"><div class="row" style="flex-wrap:nowrap;gap:12px;align-items:center"><span class="leg-crown">👑</span><span style="flex:1;min-width:0"><span class="lab">Combats de légende</span><span class="small" style="display:block">${G?`${n}/10 légendes battues`:'10 boxeurs historiques à affronter'} · gros prix et pouvoirs rares</span></span><span class="small">›</span></div>${G?onBar(n,10,'gold'):''}</a>`}
function vOnLeg(){const u=onUi(),G=u.leg,H=u.home;if(!G){if(!u.legL){u.legL=1;setTimeout(()=>legLoad().then(()=>u.legL=0),0)}return'<div class="panel"><p class="small">Chargement…</p></div>'}
  const next=G.beaten.length?Math.max(...G.beaten)+1:0;
  return`<div class="panel leg-hero"><div class="ph"><div><b class="nm" style="font-size:22px">👑 Panthéon des légendes</b><span class="small" style="display:block">Bats-les dans l’ordre. Une tentative par jour, par légende et par boxeur. 12 rounds. Chaque victoire fait tourner la roue : 1 des 4 récompenses. Ensuite, 7 jours avant de pouvoir la réaffronter. La légende suivante se débloque dès ta 1re victoire.</span></div><button class="btn sm" data-a="onlegx">← Retour</button></div>${onBar(G.beaten.length,10,'gold')}<span class="small">${G.beaten.length}/10 battues</span></div>
    <div class="leg-list">${LEG.map((L,i)=>{const beat=G.beaten.includes(i),ex=(G.x||[]).includes(i),cdl=Math.max(0,((G.cd||{})[i]||0)-Math.floor((Date.now()-G.cd0)/1000)),open=i<=next,lb=legBox(i,'moyen');
      return`<div class="leg ${beat?'beat':open?'open':'lock'}"><div class="leg-top"><div class="av lg leg-av">${avatar(Object.assign({},lb,{glv:lb.cos.glove!=null?GLV[lb.cos.glove]:null}),'blue')}${open?'':'<i class="leg-lock">🔒</i>'}</div>
        <div style="min-width:0;flex:1"><span class="small" style="opacity:.7">Légende ${i+1}</span><b class="leg-n">${flag(L.nat)} ${esc(L.n)}</b><i class="leg-k">« ${esc(L.k)} »</i><span class="small">${L.ovr} global · ${abHex(L.ab,22)} ${esc(ONAB[L.ab][1])} <span class="abtag r${abR(L.ab)}">${RARN[abR(L.ab)]}</span></span></div></div>
        <div class="leg-ex">${abLegOf(i).map(q=>`<span class="leg-exi ${ex?'':'lk'}">${abHex(q,26)}<span><b>${esc(ONAB[q][1])}</b><br><span class="abtag r${abR(q)}">${RARN[abR(q)]}</span>${ex?' ✅':' 🔒'}</span></span>`).join('')}</div>${open?`<p class="small" style="margin:8px 0">${esc(L.st)}</p>`:'<p class="small" style="margin:8px 0;opacity:.6">Bats la légende précédente pour la débloquer.</p>'}
        <div class="lwh"><span class="lwh-t">🎡 Roue des récompenses${beat?` · ✅ battue ${(G.wins||{})[i]||1}×`:''}</span><div class="lwh-g">${legPrizes(i,ex).map(p=>`<span class="lwp ${p.done?'done':''}" style="--c:${p.c}"><b>${p.ic}</b><i>${p.n}</i></span>`).join('')}</div>${!beat&&open?`<span class="small">1re victoire : la légende suivante se débloque${i===0?' + titre':i===9?' + titre « Légende vivante »':''}</span>`:''}</div>
        ${open&&cdl>0?`<div class="leg-cd">⏳ Revanche possible dans <b>${cdl>=86400?Math.floor(cdl/86400)+' j '+Math.floor(cdl%86400/3600)+' h':onTime(cdl)}</b></div>`:''}${open&&!cdl?`<div class="leg-go">${H.boxers.map(b=>{const done=G.today.includes(i+':'+b.id),rd=onReady(b);return`<button class="btn ${done||!rd.ok?'':'gold'} sm" data-a="leggo" data-id="${b.id}" data-k="${i}" ${done||!rd.ok?'disabled':''}>${esc(b.name)} (${b.ovr})${done?' · demain':!rd.ok?' · pas prêt':''}</button>`}).join('')||'<span class="small">Crée un boxeur d’abord.</span>'}</div>`:''}</div>`}).join('')}</div>`}
function legGo(bid,i){const u=onUi(),b=u.home.boxers.find(x=>x.id===bid);if(!b)return;const o=legBox(i,b.div);u.legv=0;u.box=bid;u.foundB=o;u.found=o.id;u.legF=i;onStart(o.id)}

/* ===== carte de gérant partageable ===== */
function svgImg(svg){return new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);const s=svg.includes('xmlns=')?svg:svg.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)})}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
async function shareCard(){const u=onUi(),H=u.home;if(!H)return;toast('🎨 Création de ta carte…');
  if(u.club===undefined)try{await clubLoad()}catch(e){}
  const me=H.me,k=onRk(me.elo),c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');const F='"Big Shoulders Display",Impact,"Arial Black",sans-serif',B='system-ui,-apple-system,sans-serif';
  let g=x.createLinearGradient(0,0,0,1350);g.addColorStop(0,'#1a0d12');g.addColorStop(.5,'#0d1018');g.addColorStop(1,'#07080c');x.fillStyle=g;x.fillRect(0,0,1080,1350);
  for(const[cx,cy,r,col]of[[0,0,700,'rgba(255,61,82,.30)'],[1080,0,650,'rgba(255,200,60,.22)'],[540,1350,700,'rgba(80,120,255,.14)']]){const rg=x.createRadialGradient(cx,cy,0,cx,cy,r);rg.addColorStop(0,col);rg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=rg;x.fillRect(0,0,1080,1350)}
  x.strokeStyle='rgba(255,226,122,.55)';x.lineWidth=6;rr(x,24,24,1032,1302,48);x.stroke();
  bmLogo(x,110,110,62);x.textBaseline='middle';x.fillStyle='#ffe27a';x.font=`900 46px ${F}`;x.fillText('FIGHT DYNASTY',190,96);x.fillStyle='rgba(255,255,255,.55)';x.font=`600 26px ${B}`;x.fillText('Carte de gérant · en ligne',192,140);
  // avatar
  x.save();x.beginPath();x.arc(170,330,110,0,7);const ag=x.createRadialGradient(140,290,10,170,330,110);ag.addColorStop(0,'#ff5a6e');ag.addColorStop(1,'#7d0d1b');x.fillStyle=ag;x.fill();x.lineWidth=10;x.strokeStyle='#f4c542';x.stroke();x.restore();
  x.textAlign='center';x.fillStyle='#fff';x.font=`900 120px ${BADGES.includes(me.badge)?B:F}`;x.fillText(BADGES.includes(me.badge)?me.badge:(me.name||'?').charAt(0).toUpperCase(),170,338);x.textAlign='left';
  x.fillStyle='#fff';x.font=`900 92px ${F}`;let nm=(me.name||'').toUpperCase();while(x.measureText(nm).width>560&&nm.length>3)nm=nm.slice(0,-1);x.fillText(nm,320,290);
  if(me.title){x.fillStyle='#ffd23a';x.font=`800 36px ${B}`;x.fillText('« '+me.title+' »',322,365)}
  x.fillStyle='rgba(255,255,255,.7)';x.font=`600 30px ${B}`;x.fillText(`${me.cc?ccFlag(me.cc)+' ':''}${me.rn?me.rn+', ':''}${me.cc?ccName(me.cc):''}`,322,me.title?415:360);
  // rang + ELO
  rr(x,60,480,960,230,36);x.fillStyle='rgba(255,255,255,.05)';x.fill();x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=2;x.stroke();
  const ri=await new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);im.src=`ranks/${k.id}-badge.webp`});if(ri){const bh=200,bw=bh*ri.naturalWidth/(ri.naturalHeight||1);x.drawImage(ri,180-bw/2,495,bw,bh)}
  x.fillStyle='rgba(255,255,255,.6)';x.font=`700 28px ${B}`;x.fillText('RANG',300,545);x.fillStyle='#fff';x.font=`900 74px ${F}`;x.fillText(k.n.toUpperCase(),300,610);
  x.fillStyle='rgba(255,255,255,.6)';x.font=`700 28px ${B}`;x.textAlign='right';x.fillText('ELO',990,545);const eg=x.createLinearGradient(0,560,0,660);eg.addColorStop(0,'#fff6c8');eg.addColorStop(1,'#f4b52a');x.fillStyle=eg;x.font=`900 110px ${F}`;x.fillText(String(k.rp),990,618);x.textAlign='left';
  // stats
  const st=[['RECORD',onRec(me)],['KO',String(me.kos||0)],['SÉRIE',(onI(me.ostreak,0,999,0)>=3?'🔥':'')+onI(me.ostreak,0,999,0)],['VICTOIRES',String(me.w||0)]];
  st.forEach(([l,v],i)=>{const X0=60+i*245;rr(x,X0,740,225,140,28);x.fillStyle='rgba(255,255,255,.05)';x.fill();x.textAlign='center';x.fillStyle='#fff';x.font=`900 56px ${F}`;x.fillText(v,X0+112,800);x.fillStyle='rgba(255,255,255,.55)';x.font=`700 22px ${B}`;x.fillText(l,X0+112,852);x.textAlign='left'});
  // meilleur boxeur
  const bx=[...H.boxers].sort((a,b)=>b.ovr-a.ovr)[0];
  rr(x,60,910,600,280,36);x.fillStyle='rgba(255,61,82,.10)';x.fill();x.strokeStyle='rgba(255,61,82,.45)';x.stroke();
  x.fillStyle='rgba(255,255,255,.6)';x.font=`700 24px ${B}`;x.fillText('MEILLEUR BOXEUR',90,950);
  if(bx){const av=await svgImg(avatar(Object.assign({},bx,{glv:bx.cos&&bx.cos.glove!=null?GLV[bx.cos.glove]:null}),'red'));if(av){x.save();rr(x,85,975,190,190,28);x.clip();x.fillStyle='#1b1f29';x.fillRect(85,975,190,190);x.drawImage(av,85,975,190,190);x.restore()}
    x.fillStyle='#fff';x.font=`900 46px ${F}`;let bn=bx.name;while(x.measureText(bn).width>350&&bn.length>3)bn=bn.slice(0,-1);x.fillText(bn,295,1010);
    x.fillStyle='rgba(255,255,255,.7)';x.font=`600 26px ${B}`;x.fillText(`${onDiv(bx.div)} · Niv. ${bx.lvl}`,297,1055);x.fillText(`${onRec(bx)} · ${bx.ko||0} KO`,297,1095);
    x.fillStyle='#ffd23a';x.font=`900 64px ${F}`;x.fillText(String(bx.ovr),297,1160);x.fillStyle='rgba(255,255,255,.55)';x.font=`700 22px ${B}`;x.fillText('GLOBAL',395,1162)}
  else{x.fillStyle='rgba(255,255,255,.6)';x.font=`600 28px ${B}`;x.fillText('Aucun boxeur pour l’instant',90,1060)}
  // club
  rr(x,680,910,340,280,36);x.fillStyle='rgba(255,200,60,.08)';x.fill();x.strokeStyle='rgba(255,200,60,.4)';x.stroke();
  x.fillStyle='rgba(255,255,255,.6)';x.font=`700 24px ${B}`;x.textAlign='center';x.fillText('CLUB',850,950);
  const cl=u.club;if(cl){const ce=await svgImg(clubEm(cl.emblem,cl.tag,120));if(ce)x.drawImage(ce,790,965,120,140);const ck=clRk(cl.trophies),cr=await svgImg(clRkSVG(ck.i,64));if(cr)x.drawImage(cr,935,960,64,64);
    x.fillStyle='#fff';x.font=`900 32px ${F}`;let cn=cl.name;while(x.measureText(cn).width>300&&cn.length>3)cn=cn.slice(0,-1);x.fillText(cn,850,1135);x.fillStyle='#ffd23a';x.font=`700 24px ${B}`;x.fillText(`${ck.n} · 🏆 ${cl.trophies}`,850,1172)}
  else{x.fillStyle='rgba(255,255,255,.6)';x.font=`600 28px ${B}`;x.fillText('Sans club',850,1070)}
  x.textAlign='left';
  // pied
  x.fillStyle='rgba(255,255,255,.08)';x.fillRect(60,1220,960,2);x.fillStyle='#fff';x.font=`800 34px ${B}`;x.fillText(`Code ami : ${me.code||''}`,60,1272);
  x.textAlign='right';x.fillStyle='rgba(255,255,255,.6)';x.font=`600 26px ${B}`;x.fillText(location.host,1020,1272);x.textAlign='left';
  const blob=await new Promise(r=>{try{c.toBlob(b=>r(b),'image/png')}catch(e){r(null)}});
  const url=blob?URL.createObjectURL(blob):c.toDataURL('image/png');
  try{if(blob&&navigator.canShare){const f=new File([blob],'boxing-manager-carte.png',{type:'image/png'});if(navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Ma carte FIGHT DYNASTY',text:`Viens boxer contre moi sur FIGHT DYNASTY 🥊 Mon code ami : ${me.code}`});return}}}catch(e){if(e&&e.name==='AbortError')return}
  let el=document.getElementById('cardm');if(el)el.remove();el=Object.assign(document.createElement('div'),{id:'cardm',className:'abrv'});
  el.innerHTML=`<div style="position:relative;width:min(92vw,420px);display:flex;flex-direction:column;gap:10px;align-items:center"><img src="${url}" alt="Ma carte" style="width:100%;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.6)"><p class="small" style="margin:0;text-align:center">Appuie longtemps sur l’image pour l’enregistrer ou la partager.</p><a class="btn gold" href="${url}" download="boxing-manager-carte.png" style="width:100%;text-align:center">⬇️ Télécharger</a><button class="btn" style="width:100%" data-a="cardx">Fermer</button></div>`;
  document.body.appendChild(el)}

/* ===== notifications push ===== */
const VAPID_PUB='BMVk5EZfY3LVcv-rKmzLTMj7YgnaTY9mkHvBw-cMuJXF3PxR13k80Ck5gLB_boQ-33XCQI1qI_4-SLYRKLQMjmk';
const PUSHC=[['war','⚔️ Guerres de club'],['camp','🏋️ Camps terminés'],['daily','🧰 Coffre du jour'],['invite','📩 Défis en direct'],['chat','💬 Chat du club'],['gym','🏗️ Gym amélioré']];
const pushOk=()=>'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
const isStandalone=()=>!!(window.navigator.standalone||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches));
function b64u(s){const p='='.repeat((4-s.length%4)%4),b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...b].map(c=>c.charCodeAt(0)))}
async function pushLoad(){const u=onUi();try{const r=await rpc('cr_push_prefs',{p_token:ON.token,p_prefs:{}});u.push={on:r.on===true,prefs:r.prefs||{}}}catch(e){u.push={on:false,prefs:{}}}onR()}
async function pushEnable(on){const u=onUi();if(!pushOk()){toast(isStandalone()?'Ton appareil ne permet pas les notifications':'Installe d’abord le jeu sur l’écran d’accueil');return}
  try{const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();
    if(on){const perm=await Notification.requestPermission();if(perm!=='granted'){toast('Notifications refusées : autorise-les dans les réglages du téléphone');return}
      if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(VAPID_PUB)})}
    if(!sub){u.push=Object.assign(u.push||{},{on:false});onR();return}
    await rpc('cr_push_sub',{p_token:ON.token,p_sub:sub.toJSON(),p_on:!!on});if(!on){try{await sub.unsubscribe()}catch(e){}}
    toast(on?'🔔 Notifications activées !':'🔕 Notifications désactivées');await pushLoad()}catch(e){toast('Notifications : '+(e.message||e))}}
async function pushPref(k){const u=onUi(),P=(u.push&&u.push.prefs)||{};const v=!(P[k]!==false);try{const r=await rpc('cr_push_prefs',{p_token:ON.token,p_prefs:{[k]:v}});u.push={on:r.on===true,prefs:r.prefs||{}}}catch(e){toast(e.message)}onR()}
function vPush(){const u=onUi(),P=u.push;if(!P){if(!u.pushL){u.pushL=1;setTimeout(()=>pushLoad().then(()=>u.pushL=0),0)}return'<div class="panel"><p class="small" style="margin:0">Chargement…</p></div>'}
  if(!pushOk()||!isStandalone())return`<div class="panel"><p class="small" style="margin:0">Pour recevoir les notifications sur iPhone : <b>Partager → Sur l’écran d’accueil</b>, puis ouvre le jeu depuis l’icône (iOS 16.4 ou plus).</p></div>`;
  return`<div class="panel"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px"><span>${P.on?'🔔 <b>Activées</b>':'🔕 Désactivées'}</span><button class="btn ${P.on?'':'gold'} sm" data-a="pushon" data-k="${P.on?0:1}">${P.on?'Désactiver':'Activer'}</button></div>
    ${P.on?`<div class="pushp">${PUSHC.map(([k,n])=>`<button class="eq ${P.prefs[k]!==false?'on':''}" data-a="pushpref" data-k="${k}">${P.prefs[k]!==false?'✅':'⬜'} ${n}</button>`).join('')}</div>`:''}</div>`}

/* ===== tutoriel guidé (en ligne + carrière) ===== */
const TT=(fr,en)=>LANG==='en'?en:fr;
const tutF=()=>ui.fight;
const vis=sel=>{const e=typeof sel==='string'?document.querySelector(sel):sel;if(!e)return null;const r=e.getBoundingClientRect();return r.width&&r.height?e:null};
const tutMine=()=>(S&&S.boxers||[]).filter(b=>b.mine);
/* la carte d'adversaire avec les meilleures chances */
function tutBestScout(){let best=null,bv=-1;document.querySelectorAll('#view [data-a=scout]').forEach(c=>{const m=(c.textContent.match(/(\d+)\s?%/g)||[]).map(x=>parseInt(x));const v=m.length?Math.max(...m):0;if(v>bv){bv=v;best=c}});return best}
/* fenêtres qui interrompent : on explique quoi faire */
function tutModal(){
  if(vis('#warn:not([hidden])'))return{sel:'#warn [data-a=warngo]',t:TT('⚠️ Rappel','⚠️ Reminder'),d:TT('Le jeu te rappelle des choses à faire. Pour le tutoriel, touche « Continuer quand même ».','The game reminds you of things to do. For the tutorial, tap « Continue anyway ».')};
  if(vis('#ev:not([hidden])'))return{sel:'#ev:not([hidden]) .btn',t:TT('📰 Un événement !','📰 An event!'),d:TT('Il arrive des imprévus chaque semaine. Lis et choisis une réponse : n’importe laquelle convient pour le tutoriel.','Surprises happen every week. Read and pick an answer: any of them is fine for the tutorial.')};
  if(vis('#neg:not([hidden])'))return{sel:'#neg:not([hidden]) .btn',t:TT('📝 Négociation','📝 Negotiation'),d:TT('Un contrat à régler. Choisis une option pour continuer.','A contract to settle. Pick an option to continue.')};
  return null}
const TUT_FIGHT=[
 {sel:()=>vis('[data-a=entskip]')||vis('[data-a=fround]'),when:()=>tutF()&&tutF().stage==='intro',t:()=>TT('🥊 Avant le combat','🥊 Before the fight'),
  d:()=>vis('[data-a=entskip]')?TT('L’entrée des boxeurs ! Touche pour passer à la suite.','The ring walk! Tap to move on.')
   :TT('Le plan de match conseillé par ton coin est déjà choisi. Touche le gros bouton rouge pour lancer le 1er round. Pas de stress : pour ce premier combat, l’adversaire est à ta portée.','Your corner’s recommended game plan is already selected. Tap the big red button to start round 1. No stress: for this first fight, the opponent is within reach.'),
  done:()=>!tutF()||tutF().stage!=='intro'},
 {sel:()=>vis('.rxc .rxb')||(tutF()&&tutF().stage==='between'?vis('[data-a=fround]'):null),compact:1,t:()=>TT('📣 Tu es le coin !','📣 You are the corner!'),
  d:()=>vis('.rxc .rxb')?TT('MOMENT CLÉ ! Lis le conseil de ton coach juste au-dessus et touche la réaction qui correspond. Tu as plus de temps pendant le tutoriel.','KEY MOMENT! Read your coach’s advice just above and tap the matching reaction. You get extra time during the tutorial.')
   :tutF()&&tutF().stage==='between'?TT('Fin du round. Touche le bouton rouge pour lancer le round suivant.','End of the round. Tap the red button to start the next round.')
   :TT('Le combat se joue tout seul. Surveille les barres de vie. Quand un moment clé arrive, des boutons apparaissent : réagis !','The fight plays by itself. Watch the health bars. When a key moment comes, buttons pop up: react!'),
  done:()=>!tutF()||tutF().done},
 {sel:'[data-a=fdone]',t:()=>TT('🏁 Combat terminé','🏁 Fight over'),d:()=>TT('Bravo ! Touche « Continuer » pour recevoir tes gains.','Well done! Tap « Continue » to collect your rewards.'),done:()=>!tutF()}];
const TUT={
 on:[
  {intro:1,t:()=>TT('🎓 Tutoriel en ligne','🎓 Online tutorial'),d:()=>TT('Je peux te guider pas à pas jusqu’à la fin d’un combat : créer un boxeur, trouver un adversaire et le battre. Ça prend 2 minutes.','I can guide you step by step to the end of a fight: create a boxer, find an opponent and beat him. It takes 2 minutes.')},
  {sel:'[data-a=oncr]',skip:()=>onUi().home&&onUi().home.boxers.length,t:()=>TT('➕ Ton premier boxeur','➕ Your first boxer'),d:()=>TT('Touche ce bouton pour créer ton boxeur.','Tap this button to create your boxer.'),done:()=>onUi().cr||(onUi().home&&onUi().home.boxers.length)},
  {btn:1,sel:()=>vis('#on-bname')&&document.querySelector('#on-bname').closest('.row'),skip:()=>!onUi().cr||(onUi().home&&onUi().home.boxers.length),t:()=>TT('✏️ Son nom','✏️ His name'),d:()=>TT('Écris le nom de ton boxeur, ou touche 🎲 pour un nom au hasard. « 🎲 Nouveau visage » plus haut change son apparence.','Type your boxer’s name, or tap 🎲 for a random one. « 🎲 New face » above changes his look.'),ok:()=>TT('C’est bon ›','Done ›')},
  {btn:1,sel:()=>vis('[data-sa=oncdiv]'),skip:()=>!onUi().cr||(onUi().home&&onUi().home.boxers.length),t:()=>TT('⚖️ Sa catégorie de poids','⚖️ His weight class'),d:()=>TT('Choisis sa catégorie dans cette liste. Tu pourras avoir un boxeur dans chaque catégorie.','Pick his weight class in this list. You can have one boxer in each weight class.'),ok:()=>TT('C’est choisi ›','Done ›')},
  {sel:()=>vis('[data-sa=oncnat]'),skip:()=>!onUi().cr||(onUi().home&&onUi().home.boxers.length),t:()=>TT('🌍 Son pays','🌍 His country'),d:()=>TT('Touche la liste et choisis le pays de ton boxeur.','Tap the list and pick your boxer’s country.'),done:()=>onUi().cr&&onUi().cr.nat},
  {btn:1,sel:()=>{const e=document.querySelector('[data-a=oncsty]');return e?vis(e.parentElement):null},skip:()=>!onUi().cr||(onUi().home&&onUi().home.boxers.length),t:()=>TT('🥊 Son style','🥊 His style'),d:()=>TT('Agressif = il attaque beaucoup, Prudent = il défend, Au corps = il use l’adversaire. Équilibré est un bon début.','Aggressive = attacks a lot, Cautious = defends, To the body = wears the opponent down. Balanced is a good start.'),ok:()=>TT('C’est choisi ›','Done ›')},
  {sel:()=>vis('[data-a=oncauto]'),skip:()=>!onUi().cr||(onUi().home&&onUi().home.boxers.length),t:()=>TT('📊 Ses stats','📊 His stats'),d:()=>{const c=onUi().cr;return TT(`Il te reste ${c?onLeft(c):0} points. Place-les avec les « + » (puissance, vitesse, défense, cardio, menton), ou touche « ⚡ Répartir automatiquement ».`,`You have ${c?onLeft(c):0} points left. Place them with the « + » buttons (power, speed, defence, cardio, chin), or tap « ⚡ Auto-distribute ».`)},done:()=>onUi().cr&&!onLeft(onUi().cr)},
  {sel:()=>vis('[data-a=oncok]'),skip:()=>onUi().home&&onUi().home.boxers.length,t:()=>TT('✅ C’est prêt !','✅ All set!'),d:()=>TT('Touche « Créer mon boxeur ».','Tap « Create my boxer ».'),done:()=>onUi().home&&onUi().home.boxers.length},
  {sel:'.bxc',btn:1,t:()=>TT('🃏 Sa fiche','🃏 His card'),d:()=>TT('Son niveau, ses pouvoirs (les hexagones : plus ils sont rares, plus ils sont forts) et son énergie ⚡. Chaque combat utilise de l’énergie, qui remonte toute seule.','His level, his powers (the hexagons: the rarer, the stronger) and his energy ⚡. Each fight uses energy, which refills by itself.')},
  {sel:()=>vis('[data-a=onopp]:not([disabled])'),t:()=>TT('🥊 Trouve un combat','🥊 Find a fight'),d:()=>TT('Touche « Combattre » : le jeu te trouve un adversaire de ton niveau.','Tap « Fight »: the game finds you an opponent at your level.'),done:()=>onUi().box||tutF()},
  {sel:()=>vis('.btn.big[data-a=ongo]')||vis('[data-a=ongo]'),t:()=>TT('🎯 Ton adversaire','🎯 Your opponent'),d:()=>TT('Tu vois son niveau et tes chances de gagner. Touche « Combattre » pour monter sur le ring !','You can see his level and your win chances. Tap « Fight » to step into the ring!'),done:()=>tutF()},
  ...TUT_FIGHT,
  {btn:1,t:()=>TT('🏆 Bravo, champion !','🏆 Well done, champ!'),d:()=>TT('Tu sais tout ce qu’il faut. Ensuite : ☀️ Défis pour gagner des pièces, 🏋️ Camp pour monter tes stats, 🏟️ Club pour les guerres, 👑 Légendes pour des pouvoirs exclusifs.','You know the basics. Next: ☀️ Challenges for coins, 🏋️ Camp to boost stats, 🏟️ Club for wars, 👑 Legends for exclusive powers.')}],
 car:[
  {intro:1,t:()=>TT('🎓 Tutoriel carrière','🎓 Career tutorial'),d:()=>TT('Tu diriges un club de boxe : tu signes des boxeurs, tu réserves leurs combats et tu gères l’argent. Je peux te guider jusqu’à la fin de ton premier combat.','You run a boxing club: you sign boxers, book their fights and manage the money. I can guide you until the end of your first fight.')},
  {scr:1,btn:1,sel:()=>vis('#ng-club')&&document.querySelector('#ng-club').closest('.inrow'),t:()=>TT('🏗️ Nom de ton club','🏗️ Your club name'),d:()=>TT('Touche la case et écris le nom de ton club. Pas d’idée ? Touche 🎲 pour un nom au hasard. Ensuite, touche « C’est bon ».','Tap the box and type your club name. No idea? Tap 🎲 for a random name. Then tap « Done ».'),ok:()=>TT('C’est bon ›','Done ›')},
  {scr:1,btn:1,sel:()=>vis('#ng-mgr')&&document.querySelector('#ng-mgr').closest('.inrow'),t:()=>TT('👔 Ton nom de gérant','👔 Your manager name'),d:()=>TT('Écris ton nom de gérant (ou 🎲). Ensuite, touche « C’est bon ».','Type your manager name (or 🎲). Then tap « Done ».'),ok:()=>TT('C’est bon ›','Done ›')},
  {scr:1,sel:()=>vis('#menu:not([hidden]) .btn.pri.big'),t:()=>TT('➡️ Continuer','➡️ Continue'),d:()=>TT('Touche « Suivant » pour passer au choix du pays.','Tap « Next » to go to the country choice.')},
  {scr:2,btn:1,clickA:'m_nat',sel:()=>vis('.bflags'),t:()=>TT('🌍 Ton pays','🌍 Your country'),d:()=>TT('Touche le drapeau de ton pays. Tes premiers espoirs viendront de là. (Ton pays n’est pas là ? Utilise « Autres pays » juste en dessous.)','Tap your country’s flag. Your first prospects will come from there. (Not listed? Use « Other countries » just below.)'),ok:()=>TT('Garder ce pays ›','Keep this country ›')},
  {scr:2,sel:()=>vis('#menu:not([hidden]) .btn.pri.big'),t:()=>TT('➡️ Continuer','➡️ Continue'),d:()=>TT('Parfait ! Touche « Suivant ».','Perfect! Tap « Next ».')},
  {scr:3,btn:1,clickA:'m_diff',sel:()=>{const d=document.querySelector('.difc');return d?vis(d.parentElement):null},t:()=>TT('⚖️ La difficulté','⚖️ Difficulty'),d:()=>TT('Touche le niveau que tu veux. « Normal » est conseillé pour commencer.','Tap the level you want. « Normal » is recommended to start.'),ok:()=>TT('Garder ce niveau ›','Keep this level ›')},
  {scr:3,sel:()=>vis('#menu:not([hidden]) .btn.pri.big'),t:()=>TT('➡️ Continuer','➡️ Continue'),d:()=>TT('Touche « Choisir mes boxeurs ».','Tap « Choose my boxers ».')},
  {scr:4,sel:()=>ui.ng&&ui.ng.picks&&ui.ng.picks.length>=2?vis('[data-a=m_go]'):vis('[data-a=m_pick][aria-pressed=false]'),t:()=>TT('🥊 Tes 2 premiers boxeurs','🥊 Your first 2 boxers'),
   d:()=>{const k=(ui.ng&&ui.ng.picks||[]).length;return k>=2?TT('Tes 2 boxeurs sont choisis ! Touche « Commencer ».','Your 2 boxers are picked! Tap « Start ».'):TT(`Touche cette carte pour choisir ce boxeur (${k}/2). Tu peux aussi faire défiler pour en choisir un autre. Espoir = jeune qui progresse, Confirmé = solide tout de suite.`,`Tap this card to pick this boxer (${k}/2). You can also scroll to pick another one. Prospect = young and improving, Proven = solid right away.`)}},
  {btn:1,t:()=>TT('🧭 Ton club est prêt','🧭 Your club is ready'),d:()=>TT('Les onglets en bas mènent partout (écurie, combats, argent, staff). Le bouton blanc en haut à droite fait avancer le temps d’une semaine.','The tabs at the bottom go everywhere (stable, fights, money, staff). The white button at the top right moves time forward by one week.')},
  {sel:'[data-a=tab][data-k=combats]',t:()=>TT('📅 Réserver un combat','📅 Book a fight'),d:()=>TT('Touche l’onglet « Combats ».','Tap the « Fights » tab.'),done:()=>ui.tab==='combats'||tutMine().some(b=>b.booked)},
  {sel:()=>vis('#sheet:not([hidden]) [data-a=propose]')||(ui.csub==='book'?tutBestScout():vis('.btn[data-a=csub][data-k=book]')||vis('[data-a=csub][data-k=book]')),t:()=>TT('✍️ Choisis l’adversaire','✍️ Pick the opponent'),
   d:()=>vis('#sheet:not([hidden]) [data-a=propose]')?TT('Voici sa fiche. Touche « Signer » pour mettre le combat au calendrier.','Here’s his page. Tap « Sign » to put the fight on the calendar.')
    :ui.csub==='book'?TT('Je t’ai encadré l’adversaire où tes chances (le %) sont les meilleures. Touche-le.','I’ve framed the opponent with your best chances (the %). Tap him.')
    :TT('Touche « Réserver ».','Tap « Book ».'),done:()=>tutMine().some(b=>b.booked)||tutF()},
  {sel:'[data-a=next]',t:()=>TT('⏩ Avance jusqu’au combat','⏩ Advance to the fight'),d:()=>TT('Le combat est signé ! Touche ce bouton pour avancer les semaines (ton boxeur s’entraîne pendant ce temps). Continue jusqu’à ce qu’il affiche « Combat ! ».','The fight is signed! Tap this button to advance the weeks (your boxer trains meanwhile). Keep going until it says « Fight! ».'),done:()=>tutF()},
  ...TUT_FIGHT,
  {btn:1,t:()=>TT('🏆 Ton premier combat est fait !','🏆 Your first fight is done!'),d:()=>TT('Continue comme ça : réserve d’autres combats, améliore tes installations, engage du staff et vise les ceintures mondiales. Les ⚠️ en haut te disent ce qu’il reste à faire.','Keep going: book more fights, upgrade facilities, hire staff and aim for world belts. The ⚠️ at the top tell you what’s left to do.')}]};
let TUTS=null;
const tutScr=()=>({ng1:1,ngc:2,ngd:3,ng2:4}[ui.menu]||(!ui.menu&&tutMine().length?5:0));
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-a]');if(TUTS&&t)TUTS.c=t.dataset.a},true);
const tutSeen=k=>{try{return localStorage.getItem('bm_tut_'+k)==='done'}catch(e){return false}};
function tutStart(k){if(tutSeen(k))return;TUTS={k,i:0};tutTick()}
function tutEnd(){if(TUTS)try{localStorage.setItem('bm_tut_'+TUTS.k,'done')}catch(e){}TUTS=null;const el=document.getElementById('tut');if(el)el.remove()}
function tutTick(){if(!TUTS)return;const L=TUT[TUTS.k];let st=L[TUTS.i];
  if(TUTS.k==='car'){const cs=tutScr();
    if(st&&st.scr&&cs&&cs<st.scr){const j=L.findIndex(x=>x.scr===cs);if(j>=0){TUTS.i=j;st=L[j];TUTS.c=null}}
    while(st&&st.scr&&cs>st.scr){TUTS.i++;st=L[TUTS.i];TUTS.c=null}
    if(st&&!st.scr&&!st.intro&&cs>=1&&cs<=4){const j=L.findIndex(x=>x.scr===cs);if(j>=0){TUTS.i=j;st=L[j]}}}
  if(st&&st.clickA&&TUTS.c===st.clickA){TUTS.c=null;TUTS.i++;st=L[TUTS.i]}
  while(st&&((st.skip&&st.skip())||(!st.btn&&!st.intro&&st.done&&st.done()))){TUTS.i++;st=L[TUTS.i]}
  if(!st){tutEnd();return}
  const m=!st.intro&&!st.btn?tutModal():null;
  if(m){tutDraw(vis(m.sel),{t:()=>m.t,d:()=>m.d});return}
  if(st.when&&!st.when()&&!(st.done&&st.done())){tutDraw(null,st,1);return}
  const tg=typeof st.sel==='function'?st.sel():st.sel?vis(st.sel):null;tutDraw(tg,st)}
function tutDraw(target,st,hide){let el=document.getElementById('tut');
  if(!el){el=document.createElement('div');el.id='tut';el.setAttribute('data-noi18n','');el.innerHTML='<div class="tut-hole"></div><div class="tut-bub"></div>';document.body.appendChild(el);
    el.addEventListener('click',e=>{const b=e.target.closest('[data-tut]');if(!b||!TUTS)return;e.stopPropagation();const a=b.dataset.tut;if(a==='ok'){TUTS.i++;TUTS.c=null;tutTick()}else if(a==='skip')tutEnd()})}
  el.style.display=hide?'none':'';if(hide)return;
  const hole=el.querySelector('.tut-hole'),bub=el.querySelector('.tut-bub'),L=TUT[TUTS.k],n=L.length-1;
  const foot=st.intro?`<div class="tut-f"><button data-tut="skip">${TT('Non merci','No thanks')}</button><button data-tut="ok" class="ok">${TT('▶️ Suivre le tutoriel','▶️ Start the tutorial')}</button></div>`
    :`<div class="tut-f"><button data-tut="skip">${TT('✕ Quitter le tutoriel','✕ Quit tutorial')}</button>${st.btn?`<button data-tut="ok" class="ok">${st.ok?st.ok():TUTS.i===n?TT('Terminer 🎉','Finish 🎉'):TT('Compris ›','Got it ›')}</button>`:target?'<i>👆</i>':''}</div>`;
  const html=`<div class="tut-h"><b>${st.t()}</b>${st.intro?'':`<span>${TUTS.i}/${n}</span>`}</div><p>${st.d()}</p>${foot}`;
  if(bub.dataset.h!==html){bub.innerHTML=html;bub.dataset.h=html}
  bub.classList.toggle('compact',!!st.compact);
  const vh=innerHeight;el.classList.toggle('dim',!target&&!!(st.btn||st.intro));
  if(target&&st.top){const r=target.getBoundingClientRect(),p=6;hole.style.cssText=`display:block;left:${r.left-p}px;top:${r.top-p}px;width:${r.width+p*2}px;height:${r.height+p*2}px`;bub.style.cssText='top:10px;bottom:auto';return}
  if(target){const r=target.getBoundingClientRect(),p=6;
    if(r.bottom<60||r.top>vh-60){try{target.scrollIntoView({block:'center'})}catch(e){}}
    const r2=target.getBoundingClientRect();hole.style.cssText=`display:block;left:${r2.left-p}px;top:${r2.top-p}px;width:${r2.width+p*2}px;height:${r2.height+p*2}px`;
    const bh=bub.offsetHeight||150,spaceTop=r2.top-12,spaceBot=vh-r2.bottom-12;
    if(spaceBot>=bh+14&&(spaceBot>=spaceTop||spaceTop<bh+14))bub.style.cssText=`top:${r2.bottom+12}px;bottom:auto`;
    else if(spaceTop>=bh+14)bub.style.cssText=`top:auto;bottom:${vh-r2.top+12}px`;
    else bub.style.cssText=r2.top>vh/2?'top:12px;bottom:auto':'top:auto;bottom:12px'}
  else{hole.style.cssText='display:none';bub.style.cssText=st.btn||st.intro?'top:28%;bottom:auto':'top:auto;bottom:14px'}}
setInterval(()=>{try{if(!TUTS)return;if(ui.menu==='home'||(TUTS.k==='on'&&ui.tab!=='online'&&!ui.fight&&!ui.menu)){tutEnd();return}tutTick()}catch(e){}},300);
/* tutoriel : plus de temps pour réagir et premier combat à ta portée */
function tutFightAdj(F){if(!TUTS||!F||F.tut)return;F.tut=1;for(const k of['pow','spd','def','sta','chin'])if(typeof F.B[k]==='number')F.B[k]=Math.round(F.B[k]*.8)}


function legPrizes(i,ex){const L=LEG[i],m=abLegOf(i)[0];return[{k:'coins',ic:'💰',n:`${L.c.toLocaleString('fr-CA')} 💰`,c:'#c9a227'},{k:'big',ic:'💰💰',n:`${(L.c*2).toLocaleString('fr-CA')} 💰`,c:'#2f9e5b'},{k:'unlock',ic:'🔓',n:ex?'Pouvoirs aux tirages ✅':'Ses 2 pouvoirs exclusifs aux tirages',c:'#4f6bff',done:ex},{k:'myth',ic:'✨',n:`${ONAB[m][1]} garanti`,c:'#d43a6e'}]}
function legWheel(i,prize,gain,abil,first,title){const P=legPrizes(i,false),idx=Math.max(0,P.findIndex(p=>p.k===prize)),L=LEG[i];
  let el=document.getElementById('lwm');if(el)el.remove();el=Object.assign(document.createElement('div'),{id:'lwm',className:'abrv'});
  const seg=P.map((p,j)=>{const a0=(j*90-90)*Math.PI/180,a1=((j+1)*90-90)*Math.PI/180,x0=100+95*Math.cos(a0),y0=100+95*Math.sin(a0),x1=100+95*Math.cos(a1),y1=100+95*Math.sin(a1),am=(j*90+45-90)*Math.PI/180;
    return`<path d="M100 100 L${x0} ${y0} A95 95 0 0 1 ${x1} ${y1} Z" fill="${p.c}" stroke="#0b0d14" stroke-width="3"/><text x="${100+58*Math.cos(am)}" y="${100+58*Math.sin(am)}" text-anchor="middle" dominant-baseline="middle" font-size="26">${p.ic.slice(0,2)}</text>`}).join('');
  el.innerHTML=`<div class="lw-card"><b class="lw-h">👑 ${esc(L.n)} battu !</b><span class="small">${first?'Légende suivante débloquée'+(title?` · titre « ${esc(title)} »`:'')+' · ':''}La roue tourne…</span>
    <div class="lw-w"><i class="lw-ptr">▼</i><svg viewBox="0 0 200 200" class="lw-svg"><g class="lw-rot">${seg}</g><circle cx="100" cy="100" r="16" fill="#0b0d14" stroke="#ffd23a" stroke-width="3"/></svg></div>
    <div class="lw-res" hidden></div></div>`;
  document.body.appendChild(el);const g=el.querySelector('.lw-rot');try{sfx('cash')}catch(e){}
  requestAnimationFrame(()=>requestAnimationFrame(()=>{g.style.transform=`rotate(${360*6-(idx*90+45)}deg)`}));
  setTimeout(()=>{const r=el.querySelector('.lw-res'),p=P[idx];r.hidden=false;
    r.innerHTML=`<span class="lw-big">${p.ic}</span><b>${prize==='coins'||prize==='big'?`+${gain.toLocaleString('fr-CA')} 💰`:prize==='unlock'?`Ses 2 pouvoirs exclusifs peuvent maintenant sortir aux tirages ! (+${gain.toLocaleString('fr-CA')} 💰)`:`${ONAB[abil]?ONAB[abil][1]:'Pouvoir'} ajouté à ton boxeur !`}</b><span class="small">Prochain combat contre ${esc(L.n)} dans 7 jours.</span><button class="btn gold" style="width:100%;margin-top:10px" data-lwx="1">Super ! 🔥</button>`;
    r.querySelector('[data-lwx]').addEventListener('click',()=>{el.remove();if(prize==='myth'&&abil&&ONAB[abil])abReveal(abil)});try{sfx('win')}catch(e){}},4200)}


/* ===== glisser pour revenir en arrière ===== */
(()=>{let x0=null,y0=0,t0=0;
  const back=()=>{const layers=['#ev:not([hidden])','#neg:not([hidden])','#sheet:not([hidden])','#menu:not([hidden])','#view'];
    for(const L of layers){const root=document.querySelector(L);if(!root)continue;const r=root.getBoundingClientRect();if(!r.width)continue;
      const b=[...root.querySelectorAll('button,a')].find(e=>{const q=e.getBoundingClientRect();if(!q.width||q.bottom<0||q.top>innerHeight)return false;const t=(e.textContent||'').trim();return e.classList.contains('back')||/^(←|‹)/.test(t)||e.dataset.a==='close'});
      if(b){b.click();return true}if(L==='#sheet:not([hidden])'){ui.sheet=null;render();return true}if(L!=='#view')return false}return false};
  addEventListener('touchstart',e=>{const t=e.touches[0];if(ui.fight||t.clientX>28){x0=null;return}x0=t.clientX;y0=t.clientY;t0=Date.now()},{passive:true});
  addEventListener('touchend',e=>{if(x0==null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=Math.abs(t.clientY-y0);x0=null;if(dx>70&&dy<60&&Date.now()-t0<700)back()},{passive:true});
})();


/* ===== échelle du club : prochain palier toujours visible ===== */
const LADDER=[{r:49,n:'Un boxeur dans le top 50',c:4000,x:60},{r:29,n:'Un boxeur dans le top 30',c:8000,x:100},{r:14,n:'Un boxeur dans le top 15',c:15000,x:160},{r:9,n:'Un boxeur dans le top 10',c:25000,x:220},{r:4,n:'Un boxeur dans le top 5',c:40000,x:300},{r:-1,n:'Un champion du monde',c:80000,x:500},{r:-2,n:'Un champion unifié (2 ceintures)',c:120000,x:700},{r:-3,n:'Un champion undisputed',c:250000,x:1000}];
function ladBest(){let best=999,bl=0,und=0;for(const b of club()){const i=rankIdx(b);if(i<best)best=i;bl=Math.max(bl,beltsOf(b).length);if(isUndisp(b))und=1}return{best,bl,und}}
const ladOk=(L,s)=>L.r>=0?s.best<=L.r:L.r===-1?s.best<0:L.r===-2?s.bl>=2:s.und;
function ladCheck(){if(!S||!S.boxers)return;S.lad=S.lad||0;const st=ladBest();let n=0;while(S.lad<LADDER.length&&ladOk(LADDER[S.lad],st)&&n++<8){const L=LADDER[S.lad];S.money+=L.c;try{mgrXP(L.x)}catch(e){}log(`🎯 Palier atteint : ${L.n} ! +${$(L.c)}, +${L.x} XP gérant.`,'gold');toast(`🎯 Palier : ${L.n} ! +${$(L.c)}`);S.lad++}}
function vLadder(){const L=LADDER[S.lad||0];if(!L)return`<div class="lad done">🏆 Tous les paliers du club sont atteints. Légendaire !</div>`;const st=ladBest(),cur=st.best>=999?'aucun boxeur classé':st.best<0?'champion':'#'+(st.best+1);
  const pr=L.r>=0?(st.best>=999?0:Math.max(0,Math.min(100,Math.round((100-(st.best-L.r))/(100)*100)))):L.r===-1?(st.best>=0&&st.best<10?100-st.best*8:0):L.r===-2?Math.min(100,st.bl*50):Math.min(100,st.bl*25);
  return`<div class="lad"><div class="lad-h"><span>🎯 Prochain palier ${(S.lad||0)+1}/${LADDER.length}</span><b>+${$(L.c)} · +${L.x} XP</b></div><b class="lad-n">${L.n}</b><div class="trk gold" style="height:6px;margin:6px 0 4px"><i style="width:${pr}%"></i></div><span class="small">Ton meilleur boxeur : ${cur}</span></div>`}

async function clubList(q){const u=onUi();u.clq=q||'';try{u.clist=((await rpc('cr_club_list',{p_token:ON.token,p_q:q||''}))||[]).map(clubP)}catch(e){u.clist=[];toast(e.message)}onR()}
function clubCard(c,act){const k=clRk(c.trophies),full=c.n>=30;
  return`<div class="clc" data-a="clubview" data-k="${c.id}"><div class="clc-em">${clubEm(c.emblem,c.tag,46)}</div><div class="clc-m"><b>${esc(c.name)}</b><span class="small">${clRkSVG(k.i,18)} <b>${k.n}</b> · 🏆 ${c.trophies} · ⚔️ ${c.ww}-${c.wl}</span><span class="small">👥 ${c.n}/30 · ${c.open?'🔓 Ouvert':'📨 Sur demande'}${c.war?' · <b style="color:#ff7b8b">En guerre</b>':''}</span>${c.descr?`<span class="small" style="opacity:.75">${esc(c.descr)}</span>`:''}</div>
    ${act?`<button class="btn ${c.pending?'':'pri'} sm" data-a="clubjoinid" data-k="${c.id}" ${full||c.pending?'disabled':''}>${full?'Plein':c.pending?'Envoyée':c.open?'Rejoindre':'Demander'}</button>`:''}</div>`}
function vOnClubBrowse(){const u=onUi(),L=u.clist,X=u.clubx||{};if(!L){if(!u.clL){u.clL=1;setTimeout(()=>clubList(u.clq||'').then(()=>u.clL=0),0)}}
  return`<div class="panel club-hero"><div class="row" style="gap:12px;flex-wrap:nowrap;align-items:center">${clubEm({c:2,i:'trophy'},'',54)}<div><b class="nm" style="font-size:20px">🏟️ Clubs</b><span class="small" style="display:block">Rejoins un club : guerres de clubs, objectif de la semaine, chat et mur.</span></div></div>
    ${X.pend?`<div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px;padding:10px;border-radius:12px;background:rgba(255,200,60,.08);border:1px solid var(--gold);margin-top:10px"><span class="small">📨 Demande envoyée à <b>[${esc(X.pend.tag)}] ${esc(X.pend.name)}</b></span><button class="btn sm" data-a="clubcancel">Annuler</button></div>`:''}
    <div class="row" style="flex-wrap:nowrap;margin-top:10px"><input id="cl-q" maxlength="24" placeholder="Chercher un club…" value="${esc(u.clq||'')}" autocomplete="off" style="${ONIN};flex:1;min-width:0"><button class="btn" data-a="clubsearch">🔎</button></div></div>
    <div class="cllist">${!L?'<p class="small">Chargement…</p>':L.map(c=>clubCard(c,1)).join('')||'<p class="small">Aucun club trouvé.</p>'}</div>
    <div class="panel" style="margin-top:10px"><span class="lab">Avec un code</span><div class="row" style="flex-wrap:nowrap;margin-top:6px"><input id="cl-code" maxlength="8" placeholder="CODE DU CLUB" autocomplete="off" autocapitalize="characters" style="${ONIN};flex:1;min-width:0;text-transform:uppercase"><button class="btn" data-a="clubjoin">Rejoindre</button></div>
    <span class="lab" style="display:block;margin-top:12px">Fonder ton club</span><div class="row" style="flex-wrap:nowrap;margin-top:6px"><input id="cl-name" maxlength="24" placeholder="Nom du club" autocomplete="off" style="${ONIN};flex:2;min-width:0"><input id="cl-tag" maxlength="4" placeholder="TAG" autocomplete="off" autocapitalize="characters" style="${ONIN};flex:1;min-width:0;text-transform:uppercase"></div>
    <button class="btn gold" style="width:100%;margin-top:8px" data-a="clubnew">Fonder un club (500 💰)</button></div>`}
function vOnWar(c,X){const u=onUi(),W=u.cwar,staff=X.role==='president'||X.role==='recruteur';
  if(W&&W.status==='on'){const tot=Math.max(1,W.me+W.them),pm=Math.round(W.me/tot*100);
    return`<div class="war on"><div class="war-h">⚔️ GUERRE EN COURS <span class="small">fin dans <b data-cd="${W.until}">${cdTxt(W.left)}</b></span></div>
      <div class="war-vs"><div class="war-s">${clubEm(c.emblem,c.tag,52)}<b>${esc(c.name)}</b><span class="war-n">${W.me}</span></div><div class="war-x">VS</div><div class="war-s" ${W.vs&&W.vs.id?`data-a="clubview" data-k="${W.vs.id}"`:''}>${W.vs?clubEm(W.vs.emblem,W.vs.tag,52):''}<b>${W.vs?esc(W.vs.name):'?'} ›</b><span class="war-n">${W.them}</span></div></div>
      <div class="war-bar"><i style="width:${W.me+W.them?pm:50}%"></i></div><p class="small" style="margin:6px 0 0">Chaque victoire d’un membre = <b>1 pt</b>, par KO = <b>2 pts</b>. Gagne : +300 💰 chacun et <b>+30 trophées</b> (plus si l’adversaire est plus fort). Défaite : −15.</p></div>`}
  if(W&&W.status==='done'){const res=W.draw?'Égalité':W.won?'VICTOIRE':'Défaite';
    return`<div class="war ${W.won?'won':W.draw?'':'lost'}"><div class="war-h">⚔️ Dernière guerre : <b>${res}</b> ${W.me}-${W.them} vs ${W.vs?esc(W.vs.name):'?'} <span class="small">(${W.d>=0?'+':''}${W.d} cote)</span></div>
      ${W.claimed?'<span class="chip">✅ Récompense reçue</span>':`<button class="btn gold sm" data-a="clubwarclaim">Réclamer +${W.won?300:W.draw?150:100} 💰</button>`}
      ${staff?`<button class="btn pri" style="width:100%;margin-top:8px" data-a="clubwar">⚔️ Lancer une nouvelle guerre</button>`:''}</div>`}
  return`<div class="war"><div class="war-h">⚔️ Guerre de clubs</div><p class="small" style="margin:4px 0 8px">Affronte un club de force équivalente pendant 24 h : le club dont les membres gagnent le plus de combats l’emporte.</p>
    ${staff?`<button class="btn pri" style="width:100%" data-a="clubwar">⚔️ Lancer une guerre</button>`:'<p class="small" style="margin:0;opacity:.75">Le président ou un recruteur peut lancer une guerre.</p>'}</div>`}
function vOnClub(){const u=onUi(),c=u.club,X=u.clubx||{};if(c===undefined){if(!u.cL0){u.cL0=1;setTimeout(()=>clubLoad().then(()=>u.cL0=0),0)}return'<div class="panel"><p class="small" style="margin:0">Chargement du club…</p></div>'}
  if(!c||u.clubBrowse)return(c?`<button class="btn ghost sm" style="margin-bottom:8px" data-a="clubbrowsex">← Mon club</button>`:'')+vOnClubBrowse();
  const me=u.home&&u.home.me,my=X.role||'membre',boss=my==='president',staff=boss||my==='recruteur',ok=c.wk>=c.goal,k=clRk(c.trophies);
  const mem=c.members.map((m,i)=>{const self=me&&m.id===me.id,R=CLR[m.role];
    const acts=self?'':[boss&&m.role!=='president'?`<button class="btn sm" data-a="clubrole" data-id="${esc(m.id)}" data-k="${m.role==='recruteur'?'membre':'recruteur'}">${m.role==='recruteur'?'⬇️':'⬆️ 🎯'}</button>`:'',
      (boss&&m.role!=='president')||(my==='recruteur'&&m.role==='membre')?`<button class="btn sm danger" data-a="clubkick" data-id="${esc(m.id)}">${ui.confirm==='ck'+m.id?'Sûr ?':'✕'}</button>`:''].join('');
    return`<div class="clm"><span class="clm-r">${i+1}</span><span style="min-width:0;flex:1">${onBadge(m)}${onMgrLink(m.id,m.name)}${m.role!=='membre'?`<span class="rlb ${R[1]}">${R[0]}</span>`:''}${m.bot?' <span class="chip" style="font-size:10px">IA</span>':''}<br><span class="small" style="opacity:.75">${onRk(m.elo).ic} ${rpOf(m.elo)} · ${onRec(m)}</span></span><span class="row" style="gap:4px;flex-wrap:nowrap">${acts}</span></div>`}).join('');
  const reqs=staff&&X.req.length?`<span class="lab" style="display:block;margin:12px 0 6px">📨 Demandes (${X.req.length})</span><div class="panel">${X.req.map(p=>`<div class="clm"><span style="min-width:0;flex:1">${onMgrLink(p.id,p.name)}<br><span class="small" style="opacity:.75">${onRk(p.elo).ic} ${rpOf(p.elo)} · ${onRec(p)}</span></span><span class="row" style="gap:4px;flex-wrap:nowrap"><button class="btn pri sm" data-a="clubok" data-id="${esc(p.id)}">Accepter</button><button class="btn sm" data-a="clubno" data-id="${esc(p.id)}">Refuser</button></span></div>`).join('')}</div>`:'';
  const edit=boss&&u.clEdit?`<div class="panel" style="margin-top:8px"><span class="lab">🎨 Emblème</span><div class="cem-pick">${CEM_C.map((col,i)=>`<button class="swt2 ${(u.cemC??c.emblem.c)===i?'eq':''}" style="background:linear-gradient(135deg,${col[0]},${col[1]})" data-a="cemc" data-k="${i}"></button>`).join('')}</div>
      <div class="cem-pick">${CEM_I.map(i=>`<button class="cem-i ${(u.cemI||c.emblem.i)===i?'on':''}" data-a="cemi" data-k="${i}">${ic(i)}</button>`).join('')}</div>
      <div class="row" style="justify-content:center;margin:8px 0">${clubEm({c:u.cemC??c.emblem.c,i:u.cemI||c.emblem.i},c.tag,70)}</div>
      <span class="lab">Description</span><input id="cl-descr" maxlength="80" value="${esc(c.descr)}" placeholder="ex. Club international, on vise le top 10 !" autocomplete="off" style="${ONIN};margin-top:6px">
      <label class="row small" style="gap:8px;margin-top:8px"><input type="checkbox" id="cl-open" ${(u.cemO??c.open)?'checked':''}> Ouvert : tout le monde peut entrer sans demande</label>
      <button class="btn gold" style="width:100%;margin-top:10px" data-a="clubsave">Enregistrer</button></div>`:'';
  return`<div class="panel club-head"><div class="clh-top">${clubEm(c.emblem,c.tag,78)}<div style="min-width:0;flex:1"><b class="nm" style="font-size:21px;display:block">${esc(c.name)}</b><span class="small">[${esc(c.tag)}] · 👥 ${c.n}/30 · ${c.open?'🔓 Ouvert':'📨 Sur demande'}</span>${c.descr?`<span class="small" style="display:block;opacity:.8;margin-top:2px">${esc(c.descr)}</span>`:''}</div></div>
      <div class="clh-st"><a href="#" data-a="clrkv">${clRkSVG(k.i,34)}<b>${k.n}</b><span>Rang ›</span></a><div><b class="num">🏆 ${c.trophies}</b><span>Trophées</span></div><div><b>⚔️ ${c.ww}-${c.wl}</b><span>Guerres</span></div><div><b>${esc(c.code)}</b><span>Code</span></div></div>${onBar(k.pct,100)}<span class="small">${k.nx?`${k.need} trophées pour ${k.nx}`:'Rang maximum'} · cote ${c.crating}</span>
      <div class="row" style="gap:6px;margin-top:10px"><span class="small" style="flex:1">Ton rôle : <b>${CLR[my][0]}</b></span>${boss?`<button class="btn sm" data-a="clubedit">${u.clEdit?'✕ Fermer':'🎨 Modifier'}</button>`:''}<button class="btn sm" data-a="clubbrowse">🔎 Autres clubs</button></div></div>
    ${edit}
    ${vOnWar(c,X)}
    <div class="panel" style="margin-top:10px"><div class="row small" style="justify-content:space-between"><span>🎯 <b>Objectif de la semaine</b></span><span class="num">${Math.min(c.wk,c.goal)}/${c.goal} victoires</span></div>${onBar(Math.min(c.wk,c.goal),c.goal,ok?'green':'gold')}
      <div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px"><span class="small">250 💰 pour chaque membre</span>${X.claimed?'<span class="chip">✅ Réclamé</span>':`<button class="btn ${ok?'gold':''} sm" data-a="clubclaim" ${ok?'':'disabled'}>+250 💰</button>`}</div></div>
    ${reqs}
    <span class="lab" style="display:block;margin:12px 0 6px">👥 Membres (${c.n})</span><div class="panel">${mem}</div>
    <button class="btn ghost sm" style="margin-top:8px" data-a="clubleave">${ui.confirm==='clq'?'Confirmer : quitter le club ?':'Quitter le club'}</button>`}


/* ===== v55 : gym, passe de saison, titres, mur du club, chat, ceintures régionales ===== */
const agoT=t=>{const m=Math.round((Date.now()-new Date(t))/60000);return!(m>=0)?'':m<2?'à l’instant':m<60?`il y a ${m} min`:m<1440?`il y a ${Math.round(m/60)} h`:`il y a ${Math.round(m/1440)} j`};
const BADGES=['🥊','🔥','⚡','👑','🐺','💎','🎖️'];
const _onB55=onB;onB=o=>{const b=_onB55(o);if(b&&o){b.belts=(Array.isArray(o.belts)?o.belts:[]).slice(0,4).map(g=>({s:onT(g&&g.s,12),n:onT(g&&g.n,40),d:onI(g&&g.d,0,9999,0)}));b.mtitle=onT(o.mtitle,30);b.mbadge=BADGES.includes(o.mbadge)?o.mbadge:''}return b};
const onBadge=p=>p&&BADGES.includes(p.badge)?`<span class="mbdg">${p.badge}</span>`:'';
const onTitle=p=>p&&p.title?`<span class="mttl">${esc(onT(p.title,30))}</span>`:'';
const cdTxt=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${h} h ${String(m).padStart(2,'0')}`:`${m}:${String(x).padStart(2,'0')}`};
setInterval(()=>{document.querySelectorAll('[data-cd]').forEach(e=>{const t=(+e.dataset.cd-Date.now())/1000;e.textContent=t>0?cdTxt(t):'✅ Terminé';if(t<=0&&e.dataset.done&&!e.dataset.fired){e.dataset.fired=1;const f=window[e.dataset.done];if(typeof f==='function')f()}})},1000);

/* --- géo --- */
const GEO_R={CA:[['CA-QC','Québec'],['CA-ON','Ontario'],['CA-BC','Colombie-Britannique'],['CA-AB','Alberta'],['CA-MB','Manitoba'],['CA-SK','Saskatchewan'],['CA-NS','Nouvelle-Écosse'],['CA-NB','Nouveau-Brunswick'],['CA-NL','Terre-Neuve-et-Labrador'],['CA-PE','Île-du-Prince-Édouard'],['CA-YT','Yukon'],['CA-NT','Territoires du Nord-Ouest'],['CA-NU','Nunavut']],
  FR:[['FR-IDF','Île-de-France'],['FR-ARA','Auvergne-Rhône-Alpes'],['FR-BFC','Bourgogne-Franche-Comté'],['FR-BRE','Bretagne'],['FR-CVL','Centre-Val de Loire'],['FR-COR','Corse'],['FR-GES','Grand Est'],['FR-HDF','Hauts-de-France'],['FR-NOR','Normandie'],['FR-NAQ','Nouvelle-Aquitaine'],['FR-OCC','Occitanie'],['FR-PDL','Pays de la Loire'],['FR-PAC','Provence-Alpes-Côte d’Azur']],
  BE:[['BE-BRU','Bruxelles'],['BE-VLG','Flandre'],['BE-WAL','Wallonie']],
  GB:[['GB-ENG','England'],['GB-SCT','Scotland'],['GB-WLS','Wales'],['GB-NIR','Northern Ireland']],
  MX:'AGU Aguascalientes,BCN Baja California,BCS Baja California Sur,CAM Campeche,CHP Chiapas,CHH Chihuahua,CMX Ciudad de México,COA Coahuila,COL Colima,DUR Durango,GUA Guanajuato,GRO Guerrero,HID Hidalgo,JAL Jalisco,MEX Estado de México,MIC Michoacán,MOR Morelos,NAY Nayarit,NLE Nuevo León,OAX Oaxaca,PUE Puebla,QUE Querétaro,ROO Quintana Roo,SLP San Luis Potosí,SIN Sinaloa,SON Sonora,TAB Tabasco,TAM Tamaulipas,TLA Tlaxcala,VER Veracruz,YUC Yucatán,ZAC Zacatecas'.split(',').map(x=>['MX-'+x.slice(0,3),x.slice(4)]),
  DE:'BW Baden-Württemberg,BY Bayern,BE Berlin,BB Brandenburg,HB Bremen,HH Hamburg,HE Hessen,MV Mecklenburg-Vorpommern,NI Niedersachsen,NW Nordrhein-Westfalen,RP Rheinland-Pfalz,SL Saarland,SN Sachsen,ST Sachsen-Anhalt,SH Schleswig-Holstein,TH Thüringen'.split(',').map(x=>['DE-'+x.slice(0,2),x.slice(3)]),
  ES:[['ES-AN','Andalucía'],['ES-AR','Aragón'],['ES-AS','Asturias'],['ES-CN','Canarias'],['ES-CT','Catalunya'],['ES-GA','Galicia'],['ES-MD','Madrid'],['ES-MC','Murcia'],['ES-PV','País Vasco'],['ES-VC','Comunitat Valenciana'],['ES-CL','Castilla y León'],['ES-CM','Castilla-La Mancha']],
  AU:[['AU-NSW','New South Wales'],['AU-VIC','Victoria'],['AU-QLD','Queensland'],['AU-WA','Western Australia'],['AU-SA','South Australia'],['AU-TAS','Tasmania'],['AU-ACT','Australian Capital Territory'],['AU-NT','Northern Territory']],
  US:'AL Alabama,AK Alaska,AZ Arizona,AR Arkansas,CA Californie,CO Colorado,CT Connecticut,DE Delaware,FL Floride,GA Géorgie,HI Hawaï,ID Idaho,IL Illinois,IN Indiana,IA Iowa,KS Kansas,KY Kentucky,LA Louisiane,ME Maine,MD Maryland,MA Massachusetts,MI Michigan,MN Minnesota,MS Mississippi,MO Missouri,MT Montana,NE Nebraska,NV Nevada,NH New Hampshire,NJ New Jersey,NM Nouveau-Mexique,NY New York,NC Caroline du Nord,ND Dakota du Nord,OH Ohio,OK Oklahoma,OR Oregon,PA Pennsylvanie,RI Rhode Island,SC Caroline du Sud,SD Dakota du Sud,TN Tennessee,TX Texas,UT Utah,VT Vermont,VA Virginie,WA Washington,WV Virginie-Occidentale,WI Wisconsin,WY Wyoming'.split(',').map(x=>['US-'+x.slice(0,2),x.slice(3)])};
const geoGuessCc=()=>{try{const m=String(navigator.language||'').match(/-([A-Z]{2})$/i);const c=m?m[1].toUpperCase():'';return GEO_C.includes(c)?c:'US'}catch(e){return'US'}};
const GEO_C=['CA','US','FR','BE','CH','MX','GB','IE','DE','ES','IT','PT','NL','UA','PL','CU','PR','DO','HT','JP','PH','KR','AU','NZ','BR','AR','CO','VE','MA','DZ','TN','SN','CI','CM','NG','GH','ZA','KZ','UZ','RU','TR','IN'];
const ccName=cc=>{try{return new Intl.DisplayNames([LANG==='en'?'en':'fr'],{type:'region'}).of(cc)}catch(e){return cc}};
const ccFlag=cc=>/^[A-Z]{2}$/.test(cc||'')?String.fromCodePoint(...[...cc].map(c=>127397+c.charCodeAt(0))):'🏳️';
const geoScopeName=(s,n)=>String(s||'').startsWith('C:')?ccName(String(s).slice(2)):n||String(s||'').slice(5);
function geoMeTxt(me){if(!me||!me.cc)return'';return`${ccFlag(me.cc)} ${me.rn?esc(onT(me.rn,40))+', ':''}${esc(ccName(me.cc))}`}
async function geoLocate(){const u=onUi();if(!navigator.geolocation){toast('Ton appareil ne permet pas la localisation');return}
  u.geoBusy=1;onR();
  navigator.geolocation.getCurrentPosition(async pos=>{try{
      const la=Math.round(pos.coords.latitude*10)/10,lo=Math.round(pos.coords.longitude*10)/10;
      const r=await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${la}&longitude=${lo}&localityLanguage=${(navigator.language||'fr').slice(0,2)==='fr'?'fr':'en'}`).then(x=>x.json());
      const cc=String(r.countryCode||'').toUpperCase().slice(0,2),rc=String(r.principalSubdivisionCode||'').toUpperCase();
      if(!/^[A-Z]{2}$/.test(cc))throw new Error('pays');
      const ok=new RegExp('^'+cc+'-[A-Z0-9]{1,3}$').test(rc);const known=(GEO_R[cc]||[]).find(x=>x[0]===rc);
      u.geoDet={cc,rc:ok?rc:'',rn:known?known[1]:ok?onT(r.principalSubdivision,40):''}}
    catch(e){toast('Impossible de trouver ta région. Choisis-la à la main.');u.geoMan=1}
    u.geoBusy=0;onR()},
    ()=>{u.geoBusy=0;u.geoMan=1;toast('Localisation refusée : choisis ta région à la main.');onR()},{timeout:12000,maximumAge:3600000,enableHighAccuracy:false})}
async function geoSave(cc,rc,rn){const u=onUi();try{const r=await rpc('cr_geo_set',{p_token:ON.token,p_cc:cc,p_rc:rc||null,p_rn:rn||null});
    if(u.home)Object.assign(u.home.me,{cc:r.me.cc,rc:r.me.rc,rn:r.me.rn});u.geoDet=null;u.geoMan=0;u.geoEdit=0;u.gb={};toast(`📍 Région enregistrée : ${rn||ccName(cc)}`)}catch(e){toast(e.message)}onR()}
async function geoLoad(k){const u=onUi();u.gb=u.gb||{};try{const r=await rpc('cr_geo_belts',{p_token:ON.token,p_kind:k});
  u.gb[k]=r.need?{need:1}:r.noreg?{noreg:1}:{scope:onT(r.scope,12),name:onT(r.name,40),n:onI(r.n,0,99999,0),list:(r.list||[]).map(x=>({div:ON_DIV.includes(x.div)?x.div:'moyen',defs:onI(x.defs,0,9999,0),since:x.since,box:x.box?onB(x.box):null})),
    hist:(r.hist||[]).map(h=>({div:ON_DIV.includes(h.div)?h.div:'moyen',at:h.at,b:onT(h.b,40),m:onT(h.m,16)}))}}catch(e){toast(e.message);u.gb[k]={err:1,list:[],hist:[]}}onR()}
const hueOf=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%360;return h};
function beltTheme(scope){const s=String(scope||'');
  if(s==='R:CA-QC')return{a:'#0b3f9e',b:'#06235a',em:'⚜',ink:'#fff'};
  if(s==='R:CA-ON')return{a:'#b5121b',b:'#5c070c',em:'🍁',ink:'#fff'};
  if(s==='R:US-NV')return{a:'#1a1a1a',b:'#000',em:'🎰',ink:'#fff'};if(s==='R:US-NY')return{a:'#1d3b8a',b:'#0a1640',em:'🗽',ink:'#fff'};if(s==='R:US-CA')return{a:'#c88a10',b:'#5a3a00',em:'🌴',ink:'#fff'};if(s==='R:US-TX')return{a:'#9e1b22',b:'#3d0710',em:'★',ink:'#fff'};
  if(s==='R:GB-ENG')return{a:'#c8102e',b:'#4a0510',em:'🦁',ink:'#fff'};if(s==='R:GB-SCT')return{a:'#0065bd',b:'#002a55',em:'🏴',ink:'#fff'};if(s==='R:MX-CMX'||s==='R:MX-JAL')return{a:'#006847',b:'#00301f',em:'🦅',ink:'#fff'};if(s==='R:FR-IDF')return{a:'#0b2a7a',b:'#041238',em:'🗼',ink:'#fff'};if(s==='R:JP-13')return{a:'#bc002d',b:'#4a0012',em:'🗾',ink:'#fff'};
  if(s.startsWith('C:'))return{a:'#8d0f1c',b:'#3a050b',em:ccFlag(s.slice(2)),ink:'#fff'};
  const h=hueOf(s);return{a:`hsl(${h} 62% 32%)`,b:`hsl(${h} 70% 14%)`,em:s.slice(5,8),ink:'#fff'}}
let beltN=0;
function beltSVG(scope,label,sub,small){const t=beltTheme(scope),i=++beltN,W=small?150:320,H=small?46:96;
  return`<svg viewBox="0 0 320 96" width="${W}" height="${H}" class="beltsvg" aria-hidden="true"><defs>
  <linearGradient id="bs${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.a}"/><stop offset=".55" stop-color="${t.b}"/><stop offset="1" stop-color="${t.a}"/></linearGradient>
  <linearGradient id="bg${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset=".35" stop-color="#f4c542"/><stop offset=".6" stop-color="#b8860b"/><stop offset="1" stop-color="#ffe27a"/></linearGradient>
  <radialGradient id="bc${i}" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="${t.a}"/><stop offset="1" stop-color="${t.b}"/></radialGradient></defs>
  <rect x="2" y="30" width="316" height="36" rx="12" fill="url(#bs${i})" stroke="#000" stroke-opacity=".5"/>
  <rect x="2" y="33" width="316" height="3" fill="#fff" opacity=".12"/>
  ${[22,46,274,298].map(x=>`<circle cx="${x}" cy="48" r="4" fill="url(#bg${i})" stroke="#5a4200" stroke-width=".8"/>`).join('')}
  ${[70,250].map(x=>`<g transform="translate(${x} 48)"><rect x="-16" y="-20" width="32" height="40" rx="7" fill="url(#bg${i})" stroke="#5a4200" stroke-width="1.2"/><rect x="-11" y="-15" width="22" height="30" rx="5" fill="url(#bc${i})"/><text x="0" y="5" text-anchor="middle" font-size="13" font-weight="900" fill="${t.ink}" font-family="system-ui">${esc(sub||'')}</text></g>`).join('')}
  <g transform="translate(160 48)"><path d="M-62 -26 Q0 -54 62 -26 L54 30 Q0 50 -54 30 Z" fill="url(#bg${i})" stroke="#5a4200" stroke-width="1.6"/>
  <path d="M-52 -20 Q0 -44 52 -20 L46 24 Q0 40 -46 24 Z" fill="none" stroke="#7a5a00" stroke-width="1" opacity=".7"/>
  <circle cx="0" cy="-6" r="22" fill="url(#bc${i})" stroke="#fff3b0" stroke-width="2"/>
  <text x="0" y="3" text-anchor="middle" font-size="${t.em.length>2?14:24}" font-weight="900" fill="#fff" font-family="system-ui">${esc(t.em)}</text>
  <rect x="-44" y="18" width="88" height="15" rx="4" fill="#1a1205" opacity=".85"/>
  <text x="0" y="29" text-anchor="middle" font-size="${label.length>14?8:10}" font-weight="900" letter-spacing="1" fill="#ffd95a" font-family="system-ui">${esc(label.toUpperCase().slice(0,22))}</text></g></svg>`}
function vOnGeoSetup(){const u=onUi(),D=u.geoDet;
  const ccSel=u.geoCc||geoGuessCc(),regs=GEO_R[ccSel]||[];
  const man=`<div style="margin-top:10px"><label class="fld"><span>Pays</span>${selH('geocc',GEO_C.map(c=>[c,ccFlag(c)+' '+ccName(c)]).sort((a,b)=>a[1].slice(3).localeCompare(b[1].slice(3),'fr')),ccSel,'k')}</label>
    ${regs.length?`<label class="fld"><span>Province / région</span>${selH('georc',[['','— Choisir —'],...regs],u.geoRc||'','k')}</label>`:'<p class="small">Pour ce pays : ceinture nationale seulement.</p>'}
    <button class="btn pri" style="width:100%;margin-top:8px" data-a="geosave" ${regs.length&&!u.geoRc?'disabled':''}>Confirmer</button></div>`;
  return`<div class="panel geo-hero"><div class="geo-belt">${beltSVG('R:CA-QC','Ta région','QC')}</div>
    <b class="nm" style="font-size:20px;display:block;text-align:center">📍 Ceintures de ta région</b>
    <p class="small" style="text-align:center;margin:6px 0 10px">Chaque province et chaque pays a sa propre ceinture dans les 9 catégories. Bats le champion de ta région pour lui voler sa ceinture !</p>
    ${D?`<div class="geo-det"><span style="font-size:28px">${ccFlag(D.cc)}</span><span><b>${esc(D.rn||ccName(D.cc))}</b><br><span class="small">${esc(ccName(D.cc))}</span></span></div>
      <button class="btn gold big" style="width:100%" data-a="geook">✅ C’est bien moi</button><button class="btn ghost sm" style="width:100%;margin-top:6px" data-a="geoman">Choisir à la main</button>`
    :`<button class="btn gold big" style="width:100%" data-a="geoloc" ${u.geoBusy?'disabled':''}>${u.geoBusy?'📡 Localisation…':'📍 Trouver ma région'}</button>${u.geoMan?man:`<button class="btn ghost sm" style="width:100%;margin-top:6px" data-a="geoman">Choisir à la main</button>`}`}
    <p class="small" style="margin:10px 0 0;opacity:.7">🔒 Ta position exacte n’est jamais enregistrée : seuls ton pays et ta province le sont (arrondie à ~10 km pour la recherche). Changement possible une fois par 7 jours.</p></div>`}
function vOnGeo(k){const u=onUi(),H=u.home,me=H.me;u.gb=u.gb||{};
  if(!me.cc||u.geoEdit)return vOnGeoSetup();
  const G=u.gb[k];if(!G){if(!u['gbL'+k]){u['gbL'+k]=1;setTimeout(()=>{geoLoad(k).then(()=>{u['gbL'+k]=0})},0)}return'<p class="small">Chargement des ceintures…</p>'}
  if(G.need)return vOnGeoSetup();
  if(G.noreg)return`<div class="panel"><p class="small" style="margin:0">Pas de province pour ${esc(ccName(me.cc))} : regarde la ceinture <b>Pays</b>.</p></div>`;
  const nm=k==='C'?ccName(me.cc):G.name,code=k==='C'?me.cc:String(me.rc||'').slice(3);
  const rows=G.list.map(x=>{const b=x.box,mine=b&&b.pid===me.id,my=H.boxers.find(y=>y.div===x.div),days=x.since?Math.max(0,Math.floor((Date.now()-new Date(x.since))/864e5)):0;
    return`<div class="gbelt ${mine?'mine':''}"><div class="gb-h"><b>${onDiv(x.div)}</b>${mine?'<span class="chip gold">👑 À toi</span>':''}</div>
      <div class="gb-svg">${beltSVG(G.scope,nm,code)}</div>
      ${b?`<div class="row" style="flex-wrap:nowrap;gap:10px;align-items:center"><div class="av sm" style="width:44px;height:44px">${avatar(b,'red')}</div><span style="min-width:0;flex:1"><b>${bxL(b,flag(b.nat)+' '+esc(b.name))}</b><br><span class="small">${b.ovr} global · ${onRec(b)} · ${onMgrLink(b.pid,b.mgr)}${onTag(b)}</span><br><span class="small">🛡️ ${x.defs} défense${x.defs>1?'s':''} · depuis ${days?days+' j':'aujourd’hui'}</span></span></div>
        ${!mine&&my?`<button class="btn ${onReady(my).ok?'gold':''} sm" style="width:100%;margin-top:8px" data-a="geofight" data-id="${b.id}" data-k="${my.id}" ${onReady(my).ok?'':'disabled'}>🥊 Défier avec ${esc(my.name)}${onReady(my).ok?'':' · pas prêt'}</button>`:''}`
      :`<p class="small" style="margin:6px 0 0">Ceinture vacante : elle ira au meilleur boxeur d’ici qui a 3 combats.</p>`}</div>`}).join('');
  return`<div class="panel geo-top"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px"><span><b class="nm" style="font-size:20px">${k==='C'?ccFlag(me.cc):'📍'} ${esc(nm)}</b><br><span class="small">${G.n} gérant${G.n>1?'s':''} · bats le champion de ta région pour prendre sa ceinture</span></span><button class="btn ghost sm" data-a="geoedit">${geoMeTxt(me)} ✎</button></div></div>
    <div class="gbl">${rows}</div>
    ${G.hist.length?`<span class="lab" style="display:block;margin:12px 0 6px">📜 Changements de ceinture</span><div class="panel">${G.hist.map(h=>`<div class="small" style="padding:4px 0;border-bottom:1px solid var(--line)">🏅 <b>${esc(h.b)}</b> (${esc(h.m)}) prend la ceinture des ${onDiv(h.div).toLowerCase()} · ${agoT(h.at)}</div>`).join('')}</div>`:''}`}
async function geoFight(oid,bid){const u=onUi(),k=u.geo||'R',G=(u.gb||{})[k];
  try{const r=await rpc('cr_ob_target',{p_token:ON.token,p_box:bid,p_opp:oid});const o=onB(r.opp);const nm=k==='C'?ccName(u.home.me.cc):G&&G.name||'';
    u.box=bid;u.foundB=o;u.found=o.id;u.beltF=`${nm} · ${onDiv(o.div)}`;onStart(o.id)}catch(e){toast(e.message)}}

/* --- gym --- */
const GYM=[['sac','🥊','Sac de frappe','+6 % d’XP par combat',l=>`+${l*6} % XP`],['ring','🟥','Ring d’entraînement','Camps 8 % plus courts',l=>`camps −${l*8} %`],
  ['sauna','🧖','Sauna','Énergie 8 % plus rapide',l=>`énergie +${l*8} %`],['clinic','🩺','Clinique','Blessures plus rares et plus courtes',l=>`blessure −${l*3} pts · −${l*12} % durée`]];
async function gymLoad(act,k){const u=onUi();try{const r=await rpc('cr_gym',{p_token:ON.token,p_act:act||'get',p_k:k||null});
  u.gym={lv:{},costs:(r.costs||[]).map(x=>onI(x,0,99999,0)),mins:(r.mins||[]).map(x=>onI(x,0,9999,0)),build:r.build?{k:GYM.some(g=>g[0]===r.build.k)?r.build.k:'sac',dur:onI(r.build.dur,1,99999,600),until:Date.now()+onI(r.build.left,0,99999,0)*1000}:null};
  GYM.forEach(g=>u.gym.lv[g[0]]=onI(r.lv&&r.lv[g[0]],0,5,0));if(u.home)u.home.me.coins=onI(r.coins,0,9e7,u.home.me.coins);
  if(act==='up'){toast(`🏗️ Construction lancée : ${GYM.find(g=>g[0]===k)[2]}`);try{sfx('sign')}catch(e){}}}catch(e){toast(e.message);if(!u.gym)u.gym={lv:{},costs:[],mins:[],build:null,err:1}}onR()}
window.gymDone=()=>{toast('🏋️ Amélioration du gym terminée !');gymLoad();onLoad(true)};
function vOnGym(){const u=onUi(),G=u.gym;if(!G){if(!u.gymL){u.gymL=1;setTimeout(()=>gymLoad().then(()=>u.gymL=0),0)}return'<div class="panel"><p class="small">Chargement du gym…</p></div>'}
  const tot=GYM.reduce((s,g)=>s+(G.lv[g[0]]||0),0),B=G.build&&G.build.until>Date.now()-1500?G.build:null;
  return`<div class="panel gym-hero"><div class="ph"><div><b class="nm" style="font-size:22px">🏋️ Ton gym</b><span class="small" style="display:block">Niveau total ${tot}/20 · les bonus profitent à tous tes boxeurs</span></div><button class="btn sm" data-a="ongymx">← Retour</button></div>
    <div class="gym-scene">${GYM.map(g=>`<div class="gs ${G.lv[g[0]]?'on':''} ${B&&B.k===g[0]?'bld':''}" style="--l:${G.lv[g[0]]||0}"><span>${g[1]}</span><i>${'★'.repeat(G.lv[g[0]]||0)}</i></div>`).join('')}</div>
    ${onBar(tot,20)}
    ${B?`<div class="gym-b"><span>🏗️ <b>${GYM.find(g=>g[0]===B.k)[2]}</b> niv. ${(G.lv[B.k]||0)+1} en construction</span><b class="num" data-cd="${B.until}" data-done="gymDone">${cdTxt((B.until-Date.now())/1000)}</b></div>`:''}</div>
    <div class="list" style="grid-template-columns:1fr;margin-top:10px">${GYM.map(([k,ic,n,d,fx])=>{const l=G.lv[k]||0,c=G.costs[l],m=G.mins[l],max=l>=5;
      return`<div class="panel gym-it"><div class="row" style="flex-wrap:nowrap;gap:12px;align-items:center"><span class="gym-ic">${ic}</span><span style="min-width:0;flex:1"><b>${n}</b> <span class="gym-dots">${[0,1,2,3,4].map(i=>`<i class="${i<l?'on':''}"></i>`).join('')}</span><br><span class="small">${d}</span><br><span class="small" style="color:var(--green)">${l?'Actuel : '+fx(l):'Pas encore construit'}${max?'':` → ${fx(l+1)}`}</span></span></div>
        ${max?'<span class="chip gold" style="margin-top:8px;display:inline-block">⭐ Niveau max</span>':`<button class="btn ${B?'':'gold'}" style="width:100%;margin-top:8px" data-a="gymup" data-k="${k}" ${B?'disabled':''}>${B?'Une construction à la fois':`Améliorer · ${c.toLocaleString('fr-CA')} 💰 · ${m>=60?m/60+' h':m+' min'}`}</button>`}</div>`}).join('')}</div>`}

/* --- passe de saison --- */
async function passLoad(act,i,v){const u=onUi();try{const r=await rpc('cr_pass',{p_token:ON.token,p_act:act||'get',p_i:i==null?null:i,p_v:v==null?null:v});
  u.pass={s:onI(r.s,1,999,1),xp:onI(r.xp,0,9e6,0),tier:onI(r.tier,0,30,0),got:(r.got||[]).map(x=>onI(x,1,30,1)),left:onI(r.left,0,9e7,0),until:Date.now()+onI(r.left,0,9e7,0)*1000,
    defs:(r.defs||[]).map(d=>({c:onI(d.c,0,99999,0),t:onT(d.t,30),b:BADGES.includes(d.b)?d.b:''})),titles:(r.titles||[]).map(t=>onT(t,32)),title:onT(r.title,30),badge:BADGES.includes(r.badge)?r.badge:''};
  if(u.home){u.home.me.coins=onI(r.coins,0,9e7,u.home.me.coins);u.home.me.title=u.pass.title;u.home.me.badge=u.pass.badge}
  if(act==='claim'){const d=u.pass.defs[i-1]||{};toast(d.c?`🎟️ Palier ${i} : +${d.c} 💰`:d.t?`🎟️ Nouveau titre : « ${d.t} »`:`🎟️ Nouveau badge : ${d.b}`);try{sfx('sign')}catch(e){}}
  if(act==='title')toast(v?`🏷️ Titre affiché : « ${v} »`:'Titre retiré');if(act==='badge')toast(v?`Badge affiché : ${v}`:'Badge retiré')}catch(e){toast(e.message);if(!u.pass)u.pass={s:1,xp:0,tier:0,got:[],defs:[],titles:[],left:0,until:Date.now(),err:1}}onR()}
const passIc=d=>d.b?d.b:d.t?'🏷️':'💰';
function vOnPassCard(){const u=onUi(),P=u.pass;if(!P){if(!u.passL){u.passL=1;setTimeout(()=>passLoad().then(()=>u.passL=0),0)}return''}
  const ready=Array.from({length:P.tier},(_,i)=>i+1).filter(t=>!P.got.includes(t)).length,inT=P.tier>=30?250:P.xp%250;
  return`<a href="#" class="panel pass-card" data-a="onseason"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span><span class="lab">🎟️ Passe de saison ${P.s}</span><span class="small" style="display:block">Palier <b>${P.tier}</b>/30 · fin dans <span data-cd="${P.until}">${cdTxt(P.left)}</span></span></span>${ready?`<span class="chip gold">🎁 ${ready} à réclamer</span>`:'<span class="small">Voir ›</span>'}</div>${onBar(inT,250,'blue')}<span class="small">${P.tier>=30?'Passe complétée !':`${inT}/250 XP de saison · gagne des combats pour monter`}</span></a>`}
function vOnPass(){const u=onUi(),P=u.pass;if(!P){setTimeout(()=>passLoad(),0);return'<div class="panel"><p class="small">Chargement…</p></div>'}
  const tiles=P.defs.map((d,i)=>{const t=i+1,got=P.got.includes(t),can=t<=P.tier&&!got;return`<button class="ptile ${got?'got':can?'can':t<=P.tier?'':'lock'}" ${can?`data-a="passclaim" data-k="${t}"`:'disabled'}><i>${t}</i><span>${passIc(d)}</span><b>${d.c?d.c:d.t?'Titre':'Badge'}</b>${got?'<em>✓</em>':''}</button>`}).join('');
  const own=P.titles.filter(t=>!t.startsWith('b:')),bd=P.titles.filter(t=>t.startsWith('b:')).map(t=>t.slice(2)).filter(b=>BADGES.includes(b));
  return`<div class="panel pass-hero"><div class="ph"><div><b class="nm" style="font-size:22px">🎟️ Saison ${P.s}</b><span class="small" style="display:block">Se termine dans <b data-cd="${P.until}">${cdTxt(P.left)}</b> · 100 XP par victoire (+50 KO), 60 nul, 40 défaite</span></div><button class="btn sm" data-a="onpassx">← Retour</button></div>
    <div class="row" style="justify-content:space-between"><b>Palier ${P.tier}/30</b><span class="small num">${P.xp.toLocaleString('fr-CA')} XP</span></div>${onBar(P.tier>=30?1:P.xp%250,P.tier>=30?1:250,'blue')}</div>
    <div class="pgrid">${tiles}</div>
    <div class="panel" style="margin-top:10px;opacity:.75"><b>✨ Passe cosmétique</b> <span class="chip">Bientôt</span><p class="small" style="margin:4px 0 0">Une piste de style en plus (entrées, gants, rings). Seulement de l’apparence, aucun avantage.</p></div>
    <span class="lab" style="display:block;margin:12px 0 6px">🏷️ Titres & badges</span><div class="panel">
      ${own.length?`<div class="row" style="gap:6px">${own.map(t=>`<button class="btn sm" data-a="passtitle" data-k="${esc(t)}" aria-pressed="${P.title===t}">« ${esc(t)} »</button>`).join('')}${P.title?'<button class="btn ghost sm" data-a="passtitle" data-k="">Retirer</button>':''}</div>`:'<p class="small" style="margin:0">Débloque des titres aux paliers 3, 8, 13, 18, 23 et 28.</p>'}
      ${bd.length?`<div class="row" style="gap:6px;margin-top:8px">${bd.map(b=>`<button class="btn sm" style="font-size:20px" data-a="passbadge" data-k="${b}" aria-pressed="${P.badge===b}">${b}</button>`).join('')}${P.badge?'<button class="btn ghost sm" data-a="passbadge" data-k="">Retirer</button>':''}</div>`:''}</div>`}

/* --- mur du club --- */
const WALL_E=['👊','🔥','👏','😱'];
async function wallLoad(){const u=onUi();try{const r=await rpc('cr_club_wall',{p_token:ON.token});u.wall=(r.items||[]).slice(0,40).map(x=>({k:x.k==='b'?'b':'m',id:onI(x.id,0,9e15,0),at:x.at,wn:onT(x.wn,16),wp:String(x.wp||'').replace(/[^0-9a-f-]/g,''),ln:onT(x.ln,16),wb:onT(x.wb,40),lb:onT(x.lb,40),method:['KO','TKO','DEC'].includes(x.method)?x.method:'DEC',rnd:onI(x.rnd,0,12,0),
  rx:Object.fromEntries(WALL_E.map(e=>[e,onI(x.rx&&x.rx[e],0,999,0)])),mine:WALL_E.includes(x.mine)?x.mine:'',scope:onT(x.scope,12),name:onT(x.name,40),div:ON_DIV.includes(x.div)?x.div:'moyen'}))}catch(e){u.wall=[]}onR()}
async function wallReact(id,e){const u=onUi(),it=(u.wall||[]).find(x=>x.id===id&&x.k==='m');if(!it)return;const nx=it.mine===e?'':e;
  if(it.mine)it.rx[it.mine]=Math.max(0,it.rx[it.mine]-1);if(nx)it.rx[nx]++;it.mine=nx;onR();
  try{await rpc('cr_club_react',{p_token:ON.token,p_mid:id,p_emo:nx})}catch(er){toast(er.message)}}
function vOnWall(){const u=onUi();if(!u.club||u.clubBrowse)return'';if(!u.wall){if(!u.wallL){u.wallL=1;setTimeout(()=>wallLoad().then(()=>u.wallL=0),0)}return''}
  return`<span class="lab" style="display:block;margin:12px 0 6px">📣 Mur du club · 7 derniers jours</span><div class="panel cwall">${u.wall.map(x=>x.k==='b'?
    `<div class="cwi belt"><div>🏅 <b>${esc(x.wb)}</b> <span class="small">(${esc(x.wn)})</span> devient champion <b>${esc(geoScopeName(x.scope,x.name))}</b> chez les ${onDiv(x.div).toLowerCase()} !</div><span class="small">${agoT(x.at)}</span></div>`
    :`<div class="cwi"><div>${x.method==='DEC'?'🥊':'💥'} <b>${esc(x.wb)}</b> <span class="small">(${esc(x.wn)})</span> bat ${esc(x.lb)} ${x.method==='DEC'?'aux points':`par ${x.method} au ${x.rnd}<sup>e</sup>`}</div>
      <div class="row" style="justify-content:space-between;flex-wrap:nowrap;margin-top:4px"><span class="small">${agoT(x.at)}</span><span class="cwrx">${WALL_E.map(e=>`<button data-a="wallrx" data-id="${x.id}" data-k="${e}" aria-pressed="${x.mine===e}">${e}${x.rx[e]?` <b>${x.rx[e]}</b>`:''}</button>`).join('')}</span></div></div>`).join('')||'<p class="small" style="margin:0">Aucune victoire cette semaine. Allez, au travail !</p>'}</div>`}

/* --- chat de club (en direct, sans recharger) --- */
const CH={open:false,last:0,msgs:[],club:null,busy:false,t:0,me:null,seen:0};
try{CH.seen=+localStorage.getItem('cr_chat_seen')||0}catch(e){}
function chatReset(inClub){if(!inClub){CH.msgs=[];CH.last=0;CH.club=false;chatClose()}else if(CH.club===false){CH.club=null;CH.t=0}}
function chatEls(){let b=document.getElementById('chatb');if(!b){b=Object.assign(document.createElement('button'),{id:'chatb',className:'chatb'});b.dataset.a='chatopen';b.innerHTML='💬<i hidden></i>';document.body.appendChild(b)}
  let d=document.getElementById('chatd');if(!d){d=Object.assign(document.createElement('div'),{id:'chatd',className:'chatd'});d.hidden=true;
    d.innerHTML=`<div class="chh"><b>💬 Chat du club</b><button class="btn sm" data-a="chatx">✕</button></div><div class="chl" id="chatl"></div><form class="chf" id="chatf"><input id="chati" maxlength="200" placeholder="Écris à ton club…" autocomplete="off" enterkeyhint="send"><button class="btn pri" type="submit">➤</button></form>`;
    document.body.appendChild(d);d.querySelector('#chatf').addEventListener('submit',ev=>{ev.preventDefault();chatSend()})}
  return{b,d}}
const chatTime=t=>{try{return new Date(t).toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'})}catch(e){return''}};
function chatMsgHTML(m){const mine=m.pid===CH.me,R=m.r==='president'?'👑':m.r==='recruteur'?'🎯':'';
  return`<div class="chm2 ${mine?'me':''}">${mine?'':`<span class="chn">${R}${BADGES.includes(m.b)?m.b:''} ${esc(m.n)}</span>`}<div class="chbub">${esc(m.m)}</div><span class="cht">${chatTime(m.at)}</span></div>`}
function chatAppend(list){const L=document.getElementById('chatl');const fresh=list.filter(m=>m.id>CH.last);if(!fresh.length)return;
  const atBottom=L?L.scrollHeight-L.scrollTop-L.clientHeight<60:true;
  for(const m of fresh){CH.msgs.push(m);CH.last=Math.max(CH.last,m.id);if(L)L.insertAdjacentHTML('beforeend',chatMsgHTML(m))}
  if(CH.msgs.length>200){CH.msgs=CH.msgs.slice(-150);if(L&&L.children.length>200)while(L.children.length>150)L.firstChild.remove()}
  if(L&&(atBottom||fresh.some(m=>m.pid===CH.me)))L.scrollTop=L.scrollHeight;
  if(CH.open)chatSeen();chatBadge()}
const chatClean=r=>(r.msgs||[]).map(m=>({id:onI(m.id,0,9e15,0),pid:String(m.pid||'').replace(/[^0-9a-f-]/g,''),n:onT(m.n,16),m:String(m.m||'').slice(0,200),at:m.at,r:['president','recruteur'].includes(m.r)?m.r:'membre',b:m.b}));
async function chatPoll(){if(CH.busy||!ON)return;CH.busy=true;CH.t=Date.now();
  try{const r=await rpc('cr_chat',{p_token:ON.token,p_after:CH.last});CH.club=r.club===true;CH.me=String(r.me||'').replace(/[^0-9a-f-]/g,'')||CH.me;if(!CH.club){chatReset(false)}else chatAppend(chatClean(r))}catch(e){}
  CH.busy=false;chatVis()}
async function chatSend(){const i=document.getElementById('chati');if(!i)return;const v=i.value.trim();if(!v||CH.sending)return;CH.sending=true;
  try{const r=await rpc('cr_chat_send',{p_token:ON.token,p_msg:v,p_after:CH.last});i.value='';chatAppend(chatClean(r));try{sfx('tap')}catch(e){}}catch(e){toast(e.message)}CH.sending=false;i.focus()}
function chatSeen(){CH.seen=CH.last;try{localStorage.setItem('cr_chat_seen',String(CH.seen))}catch(e){}chatBadge()}
function chatBadge(){const b=document.getElementById('chatb');if(!b)return;const n=CH.msgs.filter(m=>m.id>CH.seen&&m.pid!==CH.me).length;const i=b.querySelector('i');i.textContent=n>9?'9+':n||'';i.hidden=!n}
function chatOpen(){const {d}=chatEls();CH.open=true;d.hidden=false;const L=document.getElementById('chatl');if(L&&!L.children.length)L.innerHTML=CH.msgs.map(chatMsgHTML).join('');if(L)L.scrollTop=L.scrollHeight;chatSeen();CH.t=0;chatPoll();chatVis()}
function chatClose(){CH.open=false;const d=document.getElementById('chatd');if(d)d.hidden=true;chatVis()}
function chatVis(){const on=!!(ON&&ui.tab==='online'&&!ui.fight&&!ui.menu&&CH.club);const {b,d}=chatEls();b.hidden=!on||CH.open;if(!on&&CH.open){CH.open=false;d.hidden=true}}
setInterval(()=>{const on=!!(ON&&ui.tab==='online'&&!ui.fight&&!ui.menu&&!document.hidden);chatVis();if(!on)return;const due=CH.open?2500:CH.club===false?60000:15000;if(Date.now()-CH.t>due)chatPoll()},1000);


/* ===== v56 : nouvel en-tête, profil, historique ELO ===== */
function eloSeries(me,feed){let e=me.elo;const pts=[e];for(const m of feed){const m1=m.p1===me.id,d=onI(m1?m.d1:m.d2,-99,99,0);e-=d;pts.unshift(e)}return pts}
function eloSpark(pts,w,h){w=w||320;h=h||70;if(pts.length<2)return'<p class="small" style="margin:0;opacity:.7">Joue quelques combats pour voir ta courbe.</p>';
  const mn=Math.min(...pts),mx=Math.max(...pts),r=Math.max(10,mx-mn),X=i=>4+i*(w-8)/(pts.length-1),Y=v=>h-6-(v-mn)/r*(h-14);
  const d=pts.map((v,i)=>`${i?'L':'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' '),up=pts[pts.length-1]>=pts[0],c=up?'#36d27e':'#ff5a6e';
  return`<svg viewBox="0 0 ${w} ${h}" class="espark" preserveAspectRatio="none"><defs><linearGradient id="egr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".35"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs>
    <path d="${d} L${X(pts.length-1)} ${h} L${X(0)} ${h} Z" fill="url(#egr)"/><path d="${d}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`}
function vOnHead(me,champs){const u=onUi(),k=onRk(me.elo),st=onI(me.ostreak,0,999,0),av=BADGES.includes(me.badge)?me.badge:esc((me.name||'?').charAt(0).toUpperCase());
  return`<div class="panel ohd"><div class="ohd-top">
    <a href="#" class="ohd-av" data-a="onme">${av}</a>
    <a href="#" class="ohd-id" data-a="onme"><b class="ohd-n">${esc(me.name)}</b>${me.title?`<span class="ohd-t">« ${esc(onT(me.title,30))} »</span>`:'<span class="ohd-t dim">🏷️ Équiper un titre ›</span>'}<span class="ohd-c">${me.cc?ccFlag(me.cc)+' ':''}Code <b>${esc(me.code||'')}</b>${champs?` · 👑×${champs}`:''}</span></a>
    <a href="#" class="ohd-elo" data-a="onrk">${badgeHTML(k.id,{size:64})}<b>${k.rp}</b><i>ELO</i></a></div>
    <a href="#" class="rklink" data-a="onrk"><div class="row small" style="justify-content:space-between;margin-top:10px"><span>${k.ic} <b>${k.n}</b> ›</span><span>${k.nx?`encore ${k.need} pour ${k.nx}`:'Rang max'}</span></div>${onBar(k.pct,100)}</a>
    <div class="ohd-st"><div><b>💰 ${(me.coins||0).toLocaleString('fr-CA')}</b><span>Pièces</span></div><div><b>${onRec(me)}</b><span>Record</span></div><div><b>${me.kos||0}</b><span>KO</span></div><div class="${st>=3?'hot':''}"><b>${st>=3?'🔥 ':''}${st}</b><span>Série</span></div></div>
    <div class="ohd-act"><button data-a="onme">${ic('tag')}Profil</button><button data-a="ongym">${ic('gym')}Gym</button><button class="gold" data-a="onshop">${ic('cart')}Boutique</button><button data-a="onshare">${ic('share')}Code</button><button data-a="onref" ${u.busy?'disabled':''}>${ic('refresh',u.busy?'spin':'')}Actualiser</button><button data-a="onacct">${ic('gear')}Compte</button></div>
    ${u.err?`<p class="small" style="color:#ff7b8b;margin:8px 0 0">${esc(u.err)}</p>`:''}</div>`}
function vOnMe(){const u=onUi(),H=u.home,me=H.me,P=u.pass,pts=eloSeries(me,H.feed||[]),net=pts[pts.length-1]-pts[0];
  const own=P?P.titles.filter(t=>!t.startsWith('b:')):[],bd=P?P.titles.filter(t=>t.startsWith('b:')).map(t=>t.slice(2)).filter(b=>BADGES.includes(b)):[];
  return`<div class="panel me-hero"><div class="ph"><b class="nm" style="font-size:20px">🏷️ Mon profil</b><button class="btn sm" data-a="onmex">← Retour</button></div>
    <div class="me-card"><div class="ohd-av big">${BADGES.includes(me.badge)?me.badge:esc((me.name||'?').charAt(0).toUpperCase())}</div>${(()=>{const k=onRk(me.elo),s=onI(me.season,1,999,seasonNow());return`<div class="me-rank">${badgeHTML(k.id,{size:120})}</div><b class="me-rkn">${k.n}${me.dpos?` · #${me.dpos}`:''}</b><span class="small">${k.rp} / 10 000 ELO</span><span class="small me-frm">Cadre S${s} : remis à la fin de la saison, selon ton rang final.</span>`})()}<b class="ohd-n" style="font-size:24px">${esc(me.name)}</b>${me.title?`<span class="ohd-t">« ${esc(me.title)} »</span>`:''}<span class="small">${geoMeTxt(me)||'Région non choisie'}</span></div>
    <button class="btn gold" style="width:100%" data-a="mecard">📤 Partager ma carte de gérant</button><button class="btn ghost sm" style="width:100%;margin-top:6px" data-a="mepub">👁️ Voir mon profil comme les autres</button></div>
    <span class="lab" style="display:block;margin:12px 0 6px">🏷️ Titre sous ton nom</span><div class="panel">${!P?'<p class="small" style="margin:0">Chargement…</p>':own.length?`<div class="eqgrid">${own.map(t=>`<button class="eq ${P.title===t?'on':''}" data-a="passtitle" data-k="${esc(t)}">${P.title===t?'✅ ':''}« ${esc(t)} »</button>`).join('')}<button class="eq ${!P.title?'on':''}" data-a="passtitle" data-k="">${!P.title?'✅ ':''}Aucun</button></div>`
      :`<p class="small" style="margin:0 0 8px">Tu n’as pas encore de titre. Ils se débloquent dans la passe de saison (paliers 3, 8, 13, 18, 23, 28).</p><button class="btn pri sm" data-a="mepass">🎟️ Voir la passe</button>`}</div>
    <span class="lab" style="display:block;margin:12px 0 6px">✨ Badge devant ton nom</span><div class="panel">${!P?'':bd.length?`<div class="eqgrid">${bd.map(b=>`<button class="eq big ${P.badge===b?'on':''}" data-a="passbadge" data-k="${b}">${b}</button>`).join('')}<button class="eq ${!P.badge?'on':''}" data-a="passbadge" data-k="">Aucun</button></div>`
      :`<p class="small" style="margin:0">Badges aux paliers 5, 10, 15, 20, 25 et 30 de la passe : ${BADGES.join(' ')}</p>`}</div>
    <span class="lab" style="display:block;margin:12px 0 6px">📈 Ton ELO · ${pts.length-1} derniers combats</span><div class="panel"><div class="row" style="justify-content:space-between"><b class="num" style="font-size:22px">${rpOf(me.elo)}</b><span class="echip ${net>=0?'up':'dn'}">${net>=0?'▲ +':'▼ '}${net}</span></div>${eloSpark(pts)}</div>
    <span class="lab" style="display:block;margin:12px 0 6px">🌍 Langue</span><div class="panel" data-noi18n><div class="row" style="gap:8px"><button class="btn ${LANG!=='en'?'gold':''} sm" data-gl="fr">🇫🇷 Français</button><button class="btn ${LANG==='en'?'gold':''} sm" data-gl="en">🇬🇧 English</button></div></div>
    <span class="lab" style="display:block;margin:12px 0 6px">🔔 Notifications</span>${vPush()}
    <span class="lab" style="display:block;margin:12px 0 6px">📍 Région (ceintures)</span><div class="panel"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px"><span>${geoMeTxt(me)||'<span class="small">Pas encore choisie</span>'}</span><button class="btn sm" data-a="merg">${me.cc?'Changer':'Choisir'}</button></div></div>`}
function vOnHist(){const u=onUi(),H=u.home,me=H.me,L=H.feed||[],RP=rpLoad(),pts=eloSeries(me,L),net=pts[pts.length-1]-pts[0];
  let w=0,l=0,dd=0;const rows=L.map(m=>{const m1=m.p1===me.id,res=m.res===0?'N':((m.res===1)===m1)?'V':'D',d=onI(m1?m.d1:m.d2,-99,99,0);if(res==='V')w++;else if(res==='D')l++;else dd++;
    return`<div class="ohrow ${res}"><div class="ohres">${res}</div><div class="ohmid"><span class="ohvs"><b>${esc(onT(m1?m.b1:m.b2,40))}</b> <i>vs</i> ${esc(onT(m1?m.b2:m.b1,40))}</span>
      <span class="small">${m.method==='DEC'?'Aux points':esc(m.method)+' · round '+onI(m.rnd,0,12,0)} · ${esc(onT(m1?m.n2:m.n1,16))}${m1?'':' t’a défié'} · ${agoT(m.at)}</span></div>
      <div class="ohrt"><span class="echip ${d>0?'up':d<0?'dn':''}">${d>0?'+':''}${d}</span><span class="small">${m1&&m.xp?`+${onI(m.xp,0,999,0)} XP`:'ELO'}</span></div></div>`}).join('');
  return`<div class="panel hsum"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span><span class="lab">📈 ${L.length} derniers combats</span><br><b class="num" style="font-size:20px">${w}V · ${l}D${dd?' · '+dd+'N':''}</b></span><span style="text-align:right"><span class="echip big ${net>=0?'up':'dn'}">${net>=0?'+':''}${net} ELO</span><br><span class="small">${rpOf(pts[0])} → ${rpOf(me.elo)}</span></span></div>${eloSpark(pts)}</div>
    ${L.length?`<div class="ohlist">${rows}</div>`:'<div class="panel"><p class="small" style="margin:0">Aucun combat en ligne pour l’instant.</p></div>'}
    ${RP.length?`<button class="btn ghost" style="width:100%;margin-top:12px" data-a="rptog">🎬 Reprises sur ce téléphone (${RP.length}) ${u.rpOpen?'▲':'▼'}</button>${u.rpOpen?`<div class="list" style="grid-template-columns:1fr;margin-top:8px">${RP.map((x,i)=>`<div class="panel" style="padding:10px"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px"><span class="small" style="min-width:0"><b>${esc(onT(x.A.name,40))} vs ${esc(onT(x.B.name,40))}</b><br>${esc(onT(x.txt,120))}</span><button class="btn sm" data-a="rpplay" data-k="${i}">▶️</button></div></div>`).join('')}</div>`:''}`:''}`}

const geoSeg=()=>`<div style="margin-bottom:8px">${segH('ongeo',[['W','🌍 Monde'],['C','🏳️ Pays'],['R','📍 Région']],onUi().geo||'W')}</div>`;
/* --- tournoi de la semaine --- */
async function tourLoad(act,bid){const u=onUi();try{const r=await rpc('cr_tour',{p_token:ON.token,p_act:act||'get',p_box:bid||null});
  u.tour={left:onI(r.left,0,9e6,0),list:(r.list||[]).map(t=>({id:onT(t.id,40),box:String(t.box).replace(/[^0-9a-f-]/g,''),round:onI(t.round,0,3,0),status:['on','won','out'].includes(t.status)?t.status:'out',prize:onI(t.prize,0,9999,0),opps:(t.opps||[]).map(onB)}))};
  if(act==='join'){toast('🏆 Inscrit au tournoi !');onLoad(true)}}catch(e){toast(e.message);if(!u.tour)u.tour={left:0,list:[],err:1}}onR()}
const TRN=['Quart de finale','Demi-finale','Finale'];
function vOnTour(){const u=onUi(),T=u.tour,H=u.home;if(!T){setTimeout(()=>tourLoad(),0);return'<p class="small">Chargement du tournoi…</p>'}
  return`<span class="lab" style="display:block;margin:14px 0 6px">🏆 Tournoi de la semaine · se termine dans ${onTime(T.left)}</span>
  <div class="panel"><p class="small" style="margin:0 0 8px">8 boxeurs de ta catégorie, à élimination : quart, demie, finale. Inscription 100 💰. Gagnant : <b>800 💰 + trophée</b> · finaliste 300 · demi-finaliste 100. Un tournoi par boxeur et par semaine.</p>
  ${H.boxers.map(b=>{const t=T.list.find(x=>x.box===b.id);
    if(!t)return`<div class="row" style="justify-content:space-between;padding:6px 0;border-top:1px solid var(--line);flex-wrap:nowrap"><span class="small" style="min-width:0">${esc(b.name)} · ${onDiv(b.div)}</span><button class="btn sm" data-a="tourjoin" data-id="${b.id}">S’inscrire · 100 💰</button></div>`;
    if(t.status!=='on')return`<div class="row" style="justify-content:space-between;padding:6px 0;border-top:1px solid var(--line)"><span class="small">${esc(b.name)}</span><b class="small">${t.status==='won'?'🏆 Vainqueur !':'Éliminé en '+TRN[t.round].toLowerCase()}${t.prize?` · +${t.prize} 💰`:''}</b></div>`;
    const o=t.opps[t.round];return`<div style="padding:6px 0;border-top:1px solid var(--line)"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="small" style="min-width:0"><b>${TRN[t.round]}</b> · ${esc(b.name)} vs ${o?esc(o.name)+' ('+o.ovr+')':'?'}</span><button class="btn pri sm" data-a="tourgo" data-id="${b.id}" data-k="${t.id}">🥊 Combattre</button></div>
      <div class="small" style="opacity:.7">${t.opps.map((x,i)=>`${i<t.round?'✅':i===t.round?'▶️':'⬜'} ${esc(x.name)}`).join(' · ')}</div></div>`}).join('')}</div>`}
function tourGo(bid,tid){const u=onUi(),t=u.tour&&u.tour.list.find(x=>x.id===tid),b=u.home.boxers.find(x=>x.id===bid);if(!t||!b)return;const o=t.opps[t.round];if(!o)return;
  u.box=bid;u.foundB=o;u.found=o.id;u.tourF=TRN[t.round];onStart(o.id)}
/* --- style --- */
const STYC={nick:100,tr:150,glove:200,ent:250},STYN={tr:'Culottes',glove:'Gants',ent:'Entrée'};
const PREMV={tr:['7','8'],glove:['G','N'],ent:['dragon']},PREMK={tr:'legend_tr',glove:'gold_glv',ent:'dragon'};
function styOwned(b,kind,v){v=String(v);const me=onUi().home&&onUi().home.me,own=me&&Array.isArray(me.owned)?me.owned:[];
  if(PREMV[kind].includes(v))return premHas(PREMK[kind]);if(kind==='tr'&&String(b.look.tr||0)===v)return true;return own.includes(kind+':'+v)}
async function styBuy(bid,kind,val){try{const r=await rpc('cr_ob_style',{p_token:ON.token,p_box:bid,p_kind:kind,p_val:String(val)});ui.confirm=null;
  const u=onUi();if(u.home&&r){if(Array.isArray(r.owned))u.home.me.owned=r.owned.filter(x=>typeof x==='string');u.home.me.coins=onI(r.coins,0,9e9,u.home.me.coins)}
  toast(r&&r.cost?`🔓 Débloqué pour ${r.cost} 💰 et équipé !`:'✅ Équipé !');try{sfx(r&&r.cost?'cash':'tap')}catch(e){}await onLoad(true)}catch(e){toast(e.message)}}
function styPick(bid,kind,v){const u=onUi(),b=u.home.boxers.find(x=>x.id===bid);if(!b)return;
  if(styOwned(b,kind,v)){styBuy(bid,kind,v);return}ui.confirm='sty|'+kind+'|'+v;onR()}
function vOnStyle(b){const c=b.cos||{},u=onUi(),me=u.home.me,cf=(ui.confirm||'').startsWith('sty|')?ui.confirm.split('|'):null;
  const eqTr=String(b.look.tr||0),eqGl=c.glove!=null?String(c.glove):null,eqEn=c.ent||null;
  const grad={G:'linear-gradient(135deg,#fff3b0,#f4c542 45%,#9c7006)',N:'linear-gradient(135deg,#2a2a2a,#050505 60%,#f4c542)',7:'linear-gradient(135deg,#fff3b0,#f4c542 45%,#9c7006)',8:'linear-gradient(135deg,#2a2a2a,#050505 60%,#f4c542)'};
  const sw=(kind,v,col,act)=>{const own=styOwned(b,kind,v),eq=(kind==='tr'?eqTr:eqGl)===String(v),prem=PREMV[kind].includes(String(v)),pend=cf&&cf[1]===kind&&cf[2]===String(v);
    return`<button class="swt2 ${eq?'eq':own?'own':'lock'} ${prem?'prem':''} ${pend?'pend':''}" style="background:${grad[v]||col}" data-a="${act}" data-id="${b.id}" data-k="${v}" aria-label="${eq?'Équipé':own?'Débloqué':'À débloquer'}">${eq?'<em>✓</em>':own?'':'<em>🔒</em>'}</button>`};
  const sec=(kind,items)=>`<div class="stysec"><div class="row" style="justify-content:space-between"><span class="lab">${STYN[kind]}</span><span class="small">🔒 ${STYC[kind]} 💰 une fois · ✓ = équipé</span></div><div class="row" style="margin:6px 0 4px;gap:8px">${items}</div>${conf(kind)}</div>`;
  const conf=kind=>{if(!cf||cf[1]!==kind)return'';const v=cf[2],ok=(me.coins||0)>=STYC[kind],lab=kind==='ent'?(ENT[v]?ENT[v][0]+' '+ENT[v][1]:''):'';
    return`<div class="stycf"><span style="flex:1;min-width:0">${kind==='ent'?`<b>${lab}</b>`:`<i class="swt2 mini" style="background:${grad[v]||(kind==='tr'?TRUNK[+v]:GLV[v])}"></i>`} Débloquer pour <b>${STYC[kind]} 💰</b> ?<br><span class="small">${ok?`Il te restera ${((me.coins||0)-STYC[kind]).toLocaleString('fr-CA')} 💰. Ensuite c’est à toi pour tous tes boxeurs.`:'<span style="color:#ff7b8b">Pas assez de 💰</span>'}</span></span>
      <button class="btn gold sm" data-a="styok" data-id="${b.id}" data-k="${kind}|${v}" ${ok?'':'disabled'}>Confirmer</button><button class="btn ghost sm" data-a="styno">✕</button></div>`};
  const tr=[...TRUNK.slice(0,7).map((col,i)=>sw('tr',i,col,'stytr')),...(premHas('legend_tr')?[7,8].map(i=>sw('tr',i,'','stytr')):[])].join('');
  const gl=[...GLV.map((col,i)=>sw('glove',i,col,'styglv')),...(premHas('gold_glv')?['G','N'].map(k=>sw('glove',k,'','styglv')):[])].join('');
  const en=Object.entries(ENT).filter(([k])=>k!=='dragon'||premHas('dragon')).map(([k,e])=>{const own=styOwned(b,'ent',k),eq=eqEn===k,pend=cf&&cf[1]==='ent'&&cf[2]===k;
    return`<button class="entb ${eq?'eq':own?'own':'lock'} ${k==='dragon'?'prem':''} ${pend?'pend':''}" data-a="styent" data-id="${b.id}" data-k="${k}"><span>${e[0]}</span><b>${e[1]}</b><i>${eq?'✓ Équipé':own?'Débloqué':'🔒 '+STYC.ent+' 💰'}</i></button>`}).join('');
  const nOwn=(me.owned||[]).length+(me.prem||[]).length;
  return`<div class="panel"><div class="ph"><b class="nm" style="font-size:20px">🎨 Style de ${esc(b.name)}</b><button class="btn sm" data-a="onstyx">← Retour</button></div>
    <p class="small" style="margin:0 0 10px">Seulement de l’apparence. Ce que tu débloques est à toi <b>pour de bon</b>, pour tous tes boxeurs : changer ensuite est gratuit.${nOwn?` · ${nOwn} objet${nOwn>1?'s':''} débloqué${nOwn>1?'s':''}`:''}</p>
    <div class="row" style="flex-wrap:nowrap;gap:12px;margin-bottom:10px"><div class="av lg">${avatar(Object.assign({},b,{glv:c.glove!=null?GLV[c.glove]:null}),'red')}</div><div class="small">${b.nick?`Surnom : <b>« ${esc(b.nick)} »</b><br>`:''}${eqEn&&ENT[eqEn]?`Entrée : ${ENT[eqEn][0]} ${ENT[eqEn][1]}`:'Pas d’entrée spéciale'}</div></div>
    <div class="stysec"><span class="lab">Surnom · 100 💰 par changement</span><div class="row" style="flex-wrap:nowrap;margin:6px 0 4px"><input id="sty-nick" maxlength="20" placeholder="ex. La Foudre" value="${esc(ui.confirm==='stynick'&&u.nickDraft!=null?u.nickDraft:(b.nick||''))}" autocomplete="off" style="${ONIN};flex:1;min-width:0"><button class="btn ${ui.confirm==='stynick'?'gold':''}" data-a="stynick" data-id="${b.id}">${ui.confirm==='stynick'?'Confirmer 100 💰':'OK'}</button></div></div>
    ${sec('tr',tr)}${sec('glove',gl)}
    <div class="stysec"><div class="row" style="justify-content:space-between"><span class="lab">Entrée sur le ring</span><span class="small">🔒 ${STYC.ent} 💰 une fois</span></div><div class="entg">${en}</div>${conf('ent')}</div></div>`}
/* --- camp --- */
async function campBuy(bid,k){try{await rpc('cr_ob_camp',{p_token:ON.token,p_box:bid,p_kind:k});toast(`🏋️ Camp ${ONCAMP[k][1].toLowerCase()} lancé`);onUi().camp=null;await onLoad(true)}catch(e){toast(e.message)}}
function vOnCamp(b){return`<div class="panel"><div class="ph"><b class="nm" style="font-size:20px">🏋️ Camp de ${esc(b.name)}</b><button class="btn sm" data-a="oncampx">← Retour</button></div>
  <p class="small" style="margin:0 0 10px">Niveau ${b.lvl} : <b>${campCost(b.lvl)} 💰</b> et <b>${campMin(b.lvl)} minutes</b> d’entraînement (plus le boxeur est haut niveau, plus le camp est long et cher). +4 dans une stat pour son <b>prochain combat seulement</b>. Pendant le camp, il ne peut pas se battre. Un seul camp toutes les <b>12 heures</b>.</p>
  <div class="cgrid">${Object.entries(ONCAMP).map(([k,c])=>`<button class="cbtn" data-a="oncampgo" data-id="${b.id}" data-k="${k}"><b>${c[0]} ${c[1]}</b><span>${b[k]} → ${b[k]+4}</span></button>`).join('')}</div></div>`}


/* ================= v45 : ENTRÉES SUR LE RING + ANNONCE DU VAINQUEUR ================= */
const ENTFX={feu:{p:'🔥',n:26,cls:'up',tint:'rgba(255,90,20,.35)',t:'ENTRÉE EN FEU'},couronne:{p:'✨',n:20,cls:'down',big:'👑',tint:'rgba(245,196,81,.32)',t:'ENTRÉE ROYALE'},
 eclair:{p:'⚡',n:14,cls:'flash',tint:'rgba(150,190,255,.35)',t:'ENTRÉE ÉLECTRIQUE'},loup:{p:'🌕',n:1,cls:'moon',big:'🐺',tint:'rgba(60,90,170,.38)',t:'AOUUUUU !'},
 artifice:{p:'🎆',n:16,cls:'burst',tint:'rgba(255,80,200,.25)',t:'FEUX D’ARTIFICE'},glace:{p:'❄️',n:24,cls:'down',tint:'rgba(120,220,255,.3)',t:'SANG-FROID'},dragon:{p:'🔥',n:34,cls:'up',big:'🐉',tint:'rgba(255,40,20,.45)',t:'ENTRÉE DU DRAGON'}};
function entHTML(F,side){const X=F[side],b=X.b,e=ENTFX[b.ent],red=side==='A';
  const parts=e?Array.from({length:e.n},(_,i)=>`<i class="ep ${e.cls}" style="left:${(i*37+13)%100}%;animation-delay:${(i*.13)%1.6}s;font-size:${18+(i*7)%22}px">${e.p}</i>`).join(''):'';
  return`<div class="ent ${red?'red':'blue'}" style="${e?`--tint:${e.tint}`:''}">${parts}${e&&e.big?`<b class="ebig">${e.big}</b>`:''}<div class="spot"></div>
    <div class="ecard"><span class="ecorner">${red?'🔴 COIN ROUGE':'🔵 COIN BLEU'}</span>${e?`<span class="etype">${e.t}</span>`:''}<b class="ename">${flag(b.nat)} ${esc(b.name)}</b>${b.nick?`<span class="enick">« ${esc(b.nick)} »</span>`:''}<span class="erec">${b.w}-${b.l}-${b.d} · ${b.ko} KO</span></div>
    <button class="btn sm eskip" data-a="entskip">Passer ▸▸</button></div>`}
function entPlay(F){if(!F.online||F.entDone)return;const seq=['B','A'];let i=0;F.ent=null;
  const step=()=>{if(ui.fight!==F||F.entDone)return;const st=document.querySelector('#fx .stage');if(!st)return;let el=document.getElementById('ent-w');if(el)el.remove();
    if(i>=seq.length){F.ent=null;F.entDone=1;return}const side=seq[i++];F.ent=side;
    el=document.createElement('div');el.id='ent-w';el.innerHTML=entHTML(F,side);st.appendChild(el);
    F.entT=setTimeout(step,F[side].b.ent?4200:2400)};
  setTimeout(step,250)}
function entSkip(){const F=ui.fight;if(!F)return;clearTimeout(F.entT);F.entDone=1;F.ent=null;const el=document.getElementById('ent-w');if(el)el.remove()}
const _entBegin=beginFight;
beginFight=function(F){_entBegin(F);entPlay(F)};
const _entGo=goRound;
goRound=function(){if(ui.fight&&ui.fight.ent)entSkip();_entGo()};
/* --- annonce du vainqueur --- */
function annPlay(F){if(F.annDone||!F.res)return;F.annDone=1;const st=document.querySelector('#fx .stage');if(!st)return;
  const r=F.res,w=r.w?F[r.w].b:null,how=r.m==='DEC'?`aux points après ${F.r} rounds`:r.type==='médical'?`par arrêt médical au ${ord(r.r)} round`:`par ${r.m==='KO'?'K.-O.':'K.-O. technique'} au ${ord(r.r)} round`;
  const sc=(F.cards||[]).map(c=>`${c[0]}-${c[1]}`).join(' · ');
  const champ=F.online&&F.online.title&&r.w==='A';
  const lines=w?[`🎤 Mesdames et messieurs…`,r.m==='DEC'?`Les juges ont rendu leur décision : <b class="num">${sc}</b>`:`Ce combat se termine ${how} !`,`${champ?'Et NOUVEAU champion du monde':'Et le vainqueur'}${r.m==='DEC'?' '+how:''}…`]
    :[`🎤 Mesdames et messieurs…`,`Les juges : <b class="num">${sc}</b>`,`C’est un MATCH NUL !`];
  const el=document.createElement('div');el.id='ann';el.className='ann';st.appendChild(el);const ov0=document.getElementById('ov');if(ov0)ov0.style.visibility='hidden';
  let i=0;const tick=()=>{if(ui.fight!==F||!document.getElementById('ann'))return;
    if(i<lines.length){el.innerHTML=`<div class="aline">${lines[i++]}</div>`;setTimeout(tick,1500);return}
    if(w){F.annWin=performance.now();el.innerHTML=`<div class="awin ${r.w==='A'?'red':'blue'}"><span>${r.w==='A'?'🔴 COIN ROUGE':'🔵 COIN BLEU'}</span><b>${flag(w.nat)} ${esc(w.name)}</b>${w.nick?`<i>« ${esc(w.nick)} »</i>`:''}${champ?'<em>👑</em>':''}</div>`;
      try{if(navigator.vibrate)navigator.vibrate([60,40,120])}catch(e){}}
    setTimeout(()=>{const a=document.getElementById('ann');if(a)a.classList.add('fade')},4200)};
  tick()}
const _annUpd=updateFight;
updateFight=function(){_annUpd();const F=ui.fight;if(F&&F.stage==='done'&&F.res&&!F.annDone&&S.set.anim)setTimeout(()=>annPlay(F),F.res.m==='DEC'?300:2300)};


/* ================= v46 : FICHE BOXEUR, RANGS + RÉCOMPENSES, ACTUALITÉ, REPRISES COMME EN DIRECT ================= */
const ONBX={};
const _onB0=onB;
onB=function(o){const b=_onB0(o);if(b){const t0=Date.now(),f0=b.fat||0;b.fatrate=onI(o.fatrate,60,600,300);const fr=b.fatrate;Object.defineProperty(b,'fat',{get:()=>Math.max(0,f0-Math.floor((Date.now()-t0)/(fr*1000))),set:()=>{},enumerable:true,configurable:true});for(const k of['campleft','inj','campcd']){const end=t0+(b[k]||0)*1000;Object.defineProperty(b,k,{get:()=>Math.max(0,Math.round((end-Date.now())/1000)),set:()=>{},enumerable:true,configurable:true})}b.campdur=onI(o.campdur,60,99999,1800);b.campcost=onI(o.campcost,0,99999,120);if(b.cos&&b.cos.glove!=null)b.glv=GLV[b.cos.glove]||null;if(b.id)ONBX[b.id]=b}return b};
const bxL=(b,inner)=>b&&b.id?`<a href="#" class="mgrl" data-a="onbx" data-id="${esc(b.id)}">${inner}</a>`:inner;
function vOnBx(b){const u=onUi(),k=onRk(b.rating),mine=u.home&&b.pid===u.home.me.id,c=b.cos||{},xg=Object.assign({},b,{glv:c.glove!=null?GLV[c.glove]:null});
  return`<div class="panel"><div class="ph"><span></span><button class="btn sm" data-a="onbxx">← Retour</button></div>
    <div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px"><div class="av lg">${avatar(xg,mine?'red':'blue')}</div>
      <b class="nm" style="font-size:24px">${flag(b.nat)} ${esc(b.name)}</b>${b.nick?`<i style="color:#f5c451">« ${esc(b.nick)} »</i>`:''}${c.ent&&ENT[c.ent]?`<span class="small">${ENT[c.ent][0]} ${ENT[c.ent][1]}</span>`:''}
      <span class="small">${onDiv(b.div)} · ${({agr:'Agressif',eq:'Équilibré',pru:'Prudent',corps:'Au corps'})[b.style]||''} · Gérant : ${onMgrLink(b.pid,b.mgr)}${b.bot?' (IA)':''}</span>
      <div class="row" style="justify-content:center;gap:6px;margin-top:4px"><span class="chip ${b.rank===1&&onFights(b)>=3?'gold':''}">${onRankTxt(b)}</span><span class="chip">Cote ${b.rating}</span><span class="chip">Niv. ${b.lvl}</span></div></div>
    <div class="row" style="justify-content:space-around;margin:12px 0 4px;text-align:center"><span><b class="num" style="font-size:22px">${b.ovr}</b><br><span class="small">global</span></span><span><b class="num" style="font-size:22px">${onRec(b)}</b><br><span class="small">${b.ko} KO</span></span><span><b class="num" style="font-size:22px">${b.streak>0?'🔥'+b.streak:b.streak<0?b.streak:'—'}</b><br><span class="small">série</span></span></div>
    ${ONSTAT.map(([q,n])=>`<div class="row" style="justify-content:space-between;flex-wrap:nowrap;margin:5px 0"><span style="width:90px">${n}</span><span style="flex:1;min-width:0">${onBar(b[q],99)}</span><b class="num" style="width:30px;text-align:right">${b[q]}</b></div>`).join('')}
    ${mine?vOnEnergy(b)+`<div class="small" style="margin-top:8px">${onReady(b).ok?'':onReady(b).t}${b.camp?` · 🏋️ Camp ${ONCAMP[b.camp][1]} actif (+4)`:''}</div>`:''}</div>
    <span class="lab" style="display:block;margin:12px 0 6px">✨ Pouvoirs</span>
    <div class="list" style="grid-template-columns:1fr">${b.abil.length?b.abil.map(q=>ONAB[q]?abCard(q):'').join(''):'<p class="small">Aucun pouvoir.</p>'}<button class="btn ghost sm" style="width:100%" data-a="abcat">📖 Tous les pouvoirs et leurs chances</button>${onUi().abcat?abCatalog():''}
    ${b.slots<3?`<p class="small" style="margin:0;opacity:.7">🔒 ${b.slots<2?'2e pouvoir au niveau 10 · ':''}3e pouvoir au niveau 20</p>`:''}</div>${vOnBxMine(b)}`}
/* --- rangs + récompenses --- */
async function rkLoad(){const u=onUi();try{const r=await rpc('cr_ranks',{p_token:ON.token});u.rk={best:onI(r.best,0,9999,1000),done:(Array.isArray(r.done)?r.done:[]).map(String),list:(r.list||[]).map(x=>({r:onI(x.r,0,9999,0),n:onT(x.n,20),c:onI(x.c,0,99999,0)}))}}catch(e){toast(e.message);u.rk={best:0,done:[],list:[]}}onR()}
async function rkClaim(r){try{const x=await rpc('cr_rank_claim',{p_token:ON.token,p_r:r});toast(`🏅 Récompense de rang : +${onI(x.gain,0,99999,0)} 💰`);await rkLoad();onLoad(true)}catch(e){toast(e.message)}}
function vOnRanks(){const u=onUi(),R=u.rk;if(!R||R.list===undefined){if(!u.rkBusy){u.rkBusy=1;setTimeout(async()=>{await rkLoad();u.rkBusy=0},0)}return`<div class="panel"><p class="small">Chargement…</p></div>`}
  const all=[{r:0,n:'Bronze III',c:0},...R.list];
  return`<div class="panel"><div class="ph"><b class="nm" style="font-size:20px">🏅 Rangs et récompenses</b><button class="btn sm" data-a="onrkx">← Retour</button></div>
    <p class="small" style="margin:0">Ton rang vient de ta meilleure cote : celle de ton gérant (ELO) ou de ton meilleur boxeur. Meilleurs points : <b>${rpOf(R.best)}</b> / 10 000. Chaque nouveau rang atteint donne une récompense à réclamer (une seule fois). À partir de Diamant, chaque rang ajoute aussi un trophée à ton profil.</p></div>
    <div class="list" style="grid-template-columns:1fr;margin-top:8px">${all.map(x=>{const k=onRk(x.r),got=R.best>=x.r,done=!x.c||R.done.includes(String(x.r));
      return`<div class="panel rkrow ${got?'got':''} ${got&&!(all.find(y=>y.r>x.r&&R.best>=y.r))?'cur':''}" style="padding:12px"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:10px"><span class="rkbig">${badgeHTML(k.id,{size:56})}</span><span style="flex:1;min-width:0"><b>${esc(x.n)}</b><br><span class="small">${x.r?`${rpOf(x.r)} pts`:'Départ'}${x.c?` · récompense ${x.c} 💰${rpOf(x.r)>=6000?' + 🏆':''}`:''}</span></span>
        ${!x.c?'<span class="chip">✅</span>':done?'<span class="chip">✅ Reçu</span>':got?`<button class="btn gold sm" data-a="onrkc" data-k="${x.r}">+${x.c} 💰</button>`:`<span class="chip" style="opacity:.6">🔒 ${rpOf(x.r)-rpOf(R.best)} pts</span>`}</div></div>`}).join('')}</div>`}
/* --- actualité (vrais joueurs et IA) --- */
async function newsLoad(){const u=onUi();try{u.news=((await rpc('cr_news',{}))||[]).slice(0,30).map(m=>({at:m.at,n1:onT(m.n1,16),n2:onT(m.n2,16),b1:onT(m.b1,40),b2:onT(m.b2,40),res:onI(m.res,0,2,0),method:['KO','TKO','DEC'].includes(m.method)?m.method:'DEC',rnd:onI(m.rnd,0,12,0),div:ON_DIV.includes(m.div)?m.div:null,bot1:m.bot1===true,bot2:m.bot2===true}))}catch(e){u.news=[]}onR()}
function vOnNews(){const u=onUi(),L=u.news;if(!L){setTimeout(newsLoad,0);return'<p class="small">Chargement…</p>'}
  return`<div class="panel">${L.map(m=>{const wb=m.res===1?m.b1:m.b2,lb=m.res===1?m.b2:m.b1,wm=m.res===1?m.n1:m.n2;return`<div class="small" style="padding:6px 0;border-bottom:1px solid var(--line)">${m.res===0?`🤝 <b>${esc(m.b1)}</b> et <b>${esc(m.b2)}</b> font match nul`:`🥊 <b>${esc(wb)}</b> (${esc(wm)}) bat ${esc(lb)} ${m.method==='DEC'?'aux points':`par ${m.method} au ${m.rnd}e`}`}${m.div?` · ${onDiv(m.div)}`:''}<span style="opacity:.6"> · ${onAgo(m.at).replace('vu ','')}</span></div>`}).join('')||'<p class="small">Rien pour l’instant.</p>'}</div>
    <p class="small" style="margin:8px 0 0">Les gérants IA se battent entre eux toutes les 2 minutes : les classements, les ceintures et les clubs bougent même sans toi.</p>`}
/* --- reprises : entrées, rounds et annonce comme en direct --- */
rpPlay=function(i){const R0=rpLoad()[i];if(!R0)return;const mk=(b,m)=>Object.assign(onFighter(Object.assign({},b,{abil:[]}),m),{glv:b.glv,ent:b.ent||null});
  const F=newFight(mk(R0.A,true),mk(R0.B,false),R0.rounds||10,false);F.online={n:R0.n,replay:1};F.replay={d:R0,i:0,lr:0};beginFight(F);F.odds=null;F.speed=2;updateFight();
  const wait=()=>{if(ui.fight!==F)return;if(!F.entDone){setTimeout(wait,300);return}F.stage='live';updateFight();rpNext(F)};setTimeout(wait,400)};
rpNext=function(F){if(ui.fight!==F)return;const fr=F.replay.d.f[F.replay.i];
  if(!fr){F.done=true;F.res={w:F.replay.d.w,m:F.replay.d.m,r:F.r,txt:F.replay.d.txt||'Fin de la reprise'};settle(F);F.stage='done';updateFight();return}
  if(fr.r!==F.replay.lr){F.replay.lr=fr.r;if(fr.r>1){F.stage='between';updateFight();showBub(`🔔 Fin du round ${fr.r-1}`)}setTimeout(()=>{if(ui.fight!==F)return;F.stage='live';showBub(`🔔 Round ${fr.r}`);updateFight();rpStep(F,fr)},fr.r>1?1800:300);return}
  rpStep(F,fr)};
function rpStep(F,fr){F.replay.i++;F.A.hp=fr.hp[0];F.B.hp=fr.hp[1];F.A.en=fr.en[0];F.B.en=fr.en[1];F.A.kd=fr.kd[0];F.B.kd=fr.kd[1];F.A.cut=fr.cut[0];F.B.cut=fr.cut[1];F.A.land=fr.land[0];F.B.land=fr.land[1];F.A.thr=fr.thr[0];F.B.thr=fr.thr[1];F.r=fr.r;F.ph=fr.ph;F.cards=fr.cards;
  _rpAnim(fr.ev,()=>{setDisp(F);updateFight();rpNext(F)});updateFight()}
const _rpCtl=ctlHTML;
ctlHTML=function(F){if(F.replay&&F.stage!=='done')return`<div class="rstat"><span>🎬 Reprise · ${F.stage==='between'?'Pause':'Round '+(F.r||1)}</span><span>${esc(F.replay.d.A.name)} vs ${esc(F.replay.d.B.name)}</span></div><button class="btn" style="width:100%" data-a="rpquit">Quitter la reprise</button>`;return _rpCtl(F)};


/* ================= v47 : CAMP (temps restant, annulation), TOUT RELANCER ================= */
async function campCancel(id){try{const r=await rpc('cr_ob_camp_cancel',{p_token:ON.token,p_box:id});ui.confirm=null;toast(`Camp annulé : ${onI(r.back,0,9999,0)} 💰 remboursés sur ${onI(r.paid,0,9999,0)}`);await onLoad(true);const b=onUi().home.boxers.find(x=>x.id===id);if(b)ONBX[id]=b}catch(e){toast(e.message)}}
async function rerollAll(id){try{const r=await rpc('cr_ob_reroll_all',{p_token:ON.token,p_box:id});ui.confirm=null;toast(`🎲 Tous les pouvoirs relancés (−${onI(r.cost,0,9999,0)} 💰)`);await onLoad(true);const b=onUi().home.boxers.find(x=>x.id===id);if(b)ONBX[id]=b}catch(e){toast(e.message)}}
function vOnBxMine(b){const H=onUi().home;if(!H||b.pid!==H.me.id)return'';const cf=ui.confirm;
  const camp=b.camp?`<div class="panel" style="margin-top:10px"><span class="lab">🏋️ Camp ${ONCAMP[b.camp][0]} ${ONCAMP[b.camp][1]}</span>
      ${b.campleft>0?`<div class="row" style="justify-content:space-between;margin-top:6px"><span>Entraînement en cours</span><b class="num">${onTime(b.campleft)}</b></div>${onBar(b.campdur-b.campleft,b.campdur,'gold')}<p class="small" style="margin:6px 0 0">Il ne peut pas se battre avant la fin du camp. Ensuite : +4 en ${ONCAMP[b.camp][1].toLowerCase()} pour son prochain combat.</p>`
        :`<p class="small" style="margin:6px 0 0">✅ Camp terminé : +4 en ${ONCAMP[b.camp][1].toLowerCase()} pour son <b>prochain combat</b>.</p>`}
      <button class="btn ${cf==='cc'+b.id?'gold':''}" style="width:100%;margin-top:8px" data-a="oncampcancel" data-id="${b.id}">${cf==='cc'+b.id?`Confirmer : tu perds ${b.campcost-Math.floor(b.campcost/2)} 💰 sur ${b.campcost}`:'Annuler le camp (50 % remboursé)'}</button></div>`
    :`<div class="panel" style="margin-top:10px"><span class="lab">🏋️ Camp</span><p class="small" style="margin:6px 0 8px">${b.campcd>0?`Prochain camp possible dans <b>${onTime(b.campcd)}</b>.`:'Aucun camp en cours.'}</p>${b.campcd>0?'':`<button class="btn" style="width:100%" data-a="oncamp" data-id="${b.id}">🏋️ Lancer un camp (${campCost(b.lvl)} 💰 · ${campMin(b.lvl)} min)</button>`}</div>`;
  const ab=`<div class="panel" style="margin-top:10px"><span class="lab">🎲 Relancer les pouvoirs</span><p class="small" style="margin:6px 0 8px">Un pouvoir : 400 💰 · Tous d’un coup : <b>${300*b.slots} 💰</b> (300 par pouvoir), tous différents des actuels.</p>
    <div class="row" style="gap:6px">${b.abil.map((q,i)=>`<button class="btn sm ${cf==='rr'+b.id+i?'gold':''}" data-a="onrr" data-id="${b.id}" data-k="${i}">${cf==='rr'+b.id+i?'400 💰 ?':`🎲 ${ONAB[q]?ONAB[q][1]:'Pouvoir '+(i+1)}`}</button>`).join('')}</div>
    <button class="btn ${cf==='rra'+b.id?'gold':'pri'}" style="width:100%;margin-top:8px" data-a="onrra" data-id="${b.id}">${cf==='rra'+b.id?`Confirmer : ${300*b.slots} 💰`:`🎲 Tout relancer (${300*b.slots} 💰)`}</button></div>
    <div class="panel" style="margin-top:10px"><span class="lab">⚠️ Retirer ce boxeur</span><p class="small" style="margin:6px 0 8px">Il quitte ton écurie pour de bon et libère sa catégorie.</p><button class="btn ${cf==='obr'+b.id?'gold':''}" style="width:100%" data-a="onret" data-id="${b.id}">${cf==='obr'+b.id?'Confirmer le retrait ?':'Retirer'}</button></div>`;
  return camp+ab}
let onTickT=setInterval(()=>{const u=ui.on;if(!u||!u.home||ui.tab!=='online')return;let ch=false;
  for(const b of u.home.boxers){for(const k of['campleft','inj','campcd','fat'])if(b[k]>0)ch=true}
  if(ch&&!ui.fight&&!(document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)))onR()},10000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ON&&ui.tab==='online'&&!ui.fight){onR();onLoad(true)}});



const enFull=b=>(b.fat||0)*(b.fatrate||300),enReady=b=>Math.max(0,((b.fat||0)-70)*(b.fatrate||300));
function vOnEnergy(b){const e=100-(b.fat||0);
  return`<div class="panel" style="margin-top:10px;padding:12px;background:rgba(0,0,0,.25)"><div class="row" style="justify-content:space-between"><span class="lab">⚡ Énergie</span><b class="num" style="font-size:20px;color:${e>=80?'var(--green)':e>=30?'#f5c451':'#ff7b8b'}">${e} %</b></div>
    ${onBar(e,100,e>=30?'green':'')}
    <div class="small" style="display:grid;gap:4px;margin-top:6px">
      <div class="row" style="justify-content:space-between"><span>🔋 Pleine énergie</span><b>${b.fat?'dans '+onTime(enFull(b)):'✅ maintenant'}</b></div>
      <div class="row" style="justify-content:space-between"><span>🥊 Peut combattre</span><b>${(()=>{const w=Math.max(enReady(b),b.campleft||0,b.inj||0);return w>0?'dans '+onTime(w):'✅ maintenant'})()}</b></div>
      ${b.inj>0?`<div class="row" style="justify-content:space-between"><span>🩹 Blessure</span><b style="color:#ff7b8b">encore ${onTime(b.inj)}</b></div>`:''}
      ${b.campleft>0?`<div class="row" style="justify-content:space-between"><span>🏋️ Camp</span><b>encore ${onTime(b.campleft)}</b></div>`:''}
    </div>
    <p class="small" style="margin:8px 0 0;opacity:.75">L’énergie remonte de ${b.fatrate===150?'<b>24 % par heure (boost ×2 actif)</b>':'12 % par heure'}. Un combat en coûte 22 % (40 % après une défaite par KO). Sous 30 %, le boxeur doit se reposer. Moins d’énergie = boxeur moins fort pendant le combat.</p></div>`}
const campMin=l=>Math.min(100,20+2*l),campCost=l=>80+10*l;

/* ================= v51 : BOUTIQUE, SONS ET MUSIQUE ================= */
const SHOP=[{id:'regen',ic:'⚡',n:'Récupération ×2',d:'L’énergie de tous tes boxeurs remonte 2 fois plus vite (24 % par heure).',c:400,t:'24 h'},
 {id:'campfast',ic:'🏋️',n:'Camps express',d:'Tes nouveaux camps durent 2 fois moins longtemps.',c:300,t:'24 h'},
 {id:'xp',ic:'📈',n:'XP ×1,5',d:'Tes boxeurs gagnent 50 % plus d’XP par combat.',c:500,t:'24 h'},
 
 {id:'heal',ic:'🩹',n:'Soin express',d:'Guérit tout de suite un boxeur blessé.',c:200,box:1}];
const PREM=[['🥇','Gants en or massif','Gants dorés brillants en 3D'],['🐉','Entrée « Dragon »','Entrée exclusive avec dragon et flammes'],['🏟️','Ring personnalisé','Ton logo et tes couleurs sur le ring'],['🎽','Culottes légendaires','Motifs exclusifs (flammes, drapeau, éclairs)'],['🎖️','Badge Supporter','Badge doré sur ton profil, merci de soutenir le jeu'],['🎟️','Passe de saison cosmétique','Une récompense de style à chaque niveau de saison']];
const bLeft=k=>{const B=onUi().home&&onUi().home.me.boost||{},t=B[k+'_to']?new Date(B[k+'_to']).getTime():0;return Math.max(0,Math.round((t-Date.now())/1000))};
async function shopBuy(id,box){const it=SHOP.find(x=>x.id===id);if(!it)return;if(it.box&&!box){toast('Choisis un boxeur');return}
  try{await rpc('cr_shop_buy',{p_token:ON.token,p_item:id,p_box:box||null});ui.confirm=null;sfx('cash');toast(`🛒 ${it.ic} ${it.n} activé !`);await onLoad(true)}catch(e){toast(e.message)}}

/* ===== boutique premium (paiement réel bientôt ; admin = gratuit) ===== */
const PREMI=[{id:'supporter',ic:'🎖️',n:'Badge Supporter',d:'Le badge 🎖️ devant ton nom, partout dans le jeu. Merci de soutenir le jeu !',p:'0,99 $'},
  {id:'gold_glv',ic:'🥇',n:'Gants en or massif',d:'Deux paires exclusives pour tous tes boxeurs : or massif et noir & or.',p:'2,99 $'},
  {id:'legend_tr',ic:'🎽',n:'Culottes légendaires',d:'Deux culottes exclusives : or et noir de nuit.',p:'2,99 $'},
  {id:'dragon',ic:'🐉',n:'Entrée « Dragon »',d:'Un dragon et une pluie de flammes quand ton boxeur monte sur le ring.',p:'3,99 $'},
  {id:'ring',ic:'🏟️',n:'Ring personnalisé',d:'Ton logo et tes couleurs sur le ring.',p:'4,99 $',soon:1},
  {id:'pass',ic:'🎟️',n:'Passe cosmétique',d:'Une récompense de style à chaque palier de la saison.',p:'4,99 $',soon:1}];
const premHas=id=>{const m=onUi().home&&onUi().home.me;return!!(m&&Array.isArray(m.prem)&&m.prem.includes(id))};
const PCOIN=[{id:'c1000',n:1000,p:'0,99 $'},{id:'c5500',n:5500,p:'4,99 $',tag:'+10 %'},{id:'c12000',n:12000,p:'9,99 $',tag:'+20 %'}];
async function premGet(id){try{const r=await rpc('cr_prem',{p_token:ON.token,p_item:id});if(id.startsWith('c')){const g=onI(r.gain,0,99999,0);if(onUi().home)onUi().home.me.coins=onI(r.coins,0,9e9,onUi().home.me.coins);toast(`💰 +${g.toLocaleString('fr-CA')} pièces !`);try{sfx('cash')}catch(e){}onR();return}const it=PREMI.find(x=>x.id===id);if(onUi().home)onUi().home.me.prem=(r.prem||[]).filter(x=>typeof x==='string');onUi().pass=null;toast(`💎 ${it?it.ic+' '+it.n:''} débloqué !`);try{sfx('cash')}catch(e){}onR()}catch(e){toast(e.message)}}
function vOnPrem(){const me=onUi().home.me,adm=me.admin===true;
  return`<span class="lab" style="display:block;margin:16px 0 6px">💎 Boutique premium</span>
  <div class="panel prem-box"><p class="small" style="margin:0 0 6px">Pour soutenir le jeu. Le style ne change rien en combat, et les pièces 💰 servent surtout à jouer plus (énergie, camps, rerolls).</p>${adm?'<p class="small" style="margin:0 0 6px;color:var(--gold)">👑 Compte administrateur : tout est gratuit pour toi.</p>':''}
  <div class="pcoins">${PCOIN.map(c=>`<div class="pcoin">${c.tag?`<i>${c.tag}</i>`:''}<span>💰</span><b>${c.n.toLocaleString('fr-CA')}</b>${adm?`<button class="btn gold sm" data-a="premget" data-k="${c.id}">🎁 Gratuit</button>`:`<button class="btn sm" disabled>${c.p}</button>`}</div>`).join('')}</div>
  ${PREMI.map(it=>{const own=premHas(it.id);return`<div class="prem-it ${own?'own':''}"><span class="pic">${it.ic}</span><span style="flex:1;min-width:0"><b>${it.n}</b><br><span class="small">${it.d}</span></span>
    ${own?'<span class="chip gold">✅ À toi</span>':it.soon?'<span class="chip">Bientôt</span>':adm?`<button class="btn gold sm" data-a="premget" data-k="${it.id}">🎁 Gratuit</button>`:`<button class="btn sm" disabled>${it.p}<br><span style="font-size:9px">bientôt</span></button>`}</div>`}).join('')}
  ${PREMI.some(x=>premHas(x.id))?'<p class="small" style="margin:8px 0 0;opacity:.75">Équipe tes gants, culottes et entrées dans la fiche de chaque boxeur → 🎨 Style. Le badge s’équipe dans 🏷️ Profil.</p>':''}</div>`}

function vOnShop(){const u=onUi(),H=u.home,cf=ui.confirm;
  return`<div class="panel"><div class="ph"><div><b class="nm" style="font-size:22px">🛒 Boutique</b><span class="small" style="display:block">Tu as <b>${(H.me.coins||0).toLocaleString('fr-CA')} 💰</b> gagnés en jouant</span></div><button class="btn sm" data-a="onshopx">← Retour</button></div></div>
  <span class="lab" style="display:block;margin:12px 0 6px">💰 Avec tes pièces</span>
  <div class="list" style="grid-template-columns:1fr">${SHOP.map(it=>{const left=it.t?bLeft(it.id):0;
    return`<div class="panel shopit"><div class="row" style="flex-wrap:nowrap;gap:12px;align-items:flex-start"><span class="shic">${it.ic}</span><span style="flex:1;min-width:0"><b>${it.n}</b>${it.t?` <span class="chip">${it.t}</span>`:''}<br><span class="small">${it.d}</span>${left?`<br><span class="small" style="color:var(--green)">✅ Actif encore ${onTime(left)} (racheter prolonge de 24 h)</span>`:''}</span></div>
      ${it.box?`<div class="row" style="flex-wrap:nowrap;margin-top:8px;gap:6px">${selH('shopbox_'+it.id,H.boxers.map(b=>[b.id,`${esc(b.name)} · ${it.id==='heal'?(b.inj>0?'blessé':'en santé'):'⚡ '+(100-b.fat)+' %'}`]),u['sb_'+it.id]||(H.boxers[0]&&H.boxers[0].id),'k')}<button class="btn ${cf==='buy'+it.id?'gold':'pri'}" data-a="shopbuy" data-k="${it.id}">${cf==='buy'+it.id?'Confirmer ?':it.c+' 💰'}</button></div>`
        :`<button class="btn ${cf==='buy'+it.id?'gold':'pri'}" style="width:100%;margin-top:8px" data-a="shopbuy" data-k="${it.id}">${cf==='buy'+it.id?`Confirmer : ${it.c} 💰`:`Acheter · ${it.c} 💰`}</button>`}</div>`}).join('')}</div>
  ${vOnPrem()}`}
/* ---------- sons et musique (synthétisés, aucun fichier) ---------- */
const AUK='cr_audio';let AU={music:true,sfx:true};try{Object.assign(AU,JSON.parse(localStorage.getItem(AUK)||'{}'))}catch(e){}
let AC=null,AM=null,AMT=0,AMstep=0,AMnext=0,AMmode='menu',CROWDN=null;
function acInit(){if(AC)return AC;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();
  AM=AC.createGain();AM.gain.value=.16;AM.connect(AC.destination);AC.sfxG=AC.createGain();AC.sfxG.gain.value=.5;AC.sfxG.connect(AC.destination);
  const len=AC.sampleRate*1.5,buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;AC.noise=buf}catch(e){AC=null}return AC}
function auSave(){try{localStorage.setItem(AUK,JSON.stringify(AU))}catch(e){}}
function nz(t,dur,f,q,type,g,dest){const s=AC.createBufferSource();s.buffer=AC.noise;const fl=AC.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.value=f;fl.Q.value=q||1;const G=AC.createGain();G.gain.setValueAtTime(g,t);G.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(fl);fl.connect(G);G.connect(dest||AC.sfxG);s.start(t);s.stop(t+dur+.05)}
function tn(t,f,dur,type,g,dest,f2){const o=AC.createOscillator(),G=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);G.gain.setValueAtTime(g,t);G.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(G);G.connect(dest||AC.sfxG);o.start(t);o.stop(t+dur+.05)}
function sfx(k){if(!AU.sfx||!acInit())return;const t=AC.currentTime;
  if(k==='punch'){nz(t,.09,900,.8,'lowpass',.9);tn(t,140,.12,'sine',.7,null,50)}
  else if(k==='big'){nz(t,.25,500,.6,'lowpass',1.2);tn(t,110,.35,'sine',1,null,35)}
  else if(k==='bell'){for(const[f,g]of[[880,.35],[1320,.18],[2210,.1]]){tn(t,f,1.6,'sine',g);tn(t+.35,f,1.4,'sine',g*.8)}}
  else if(k==='roar'){const s=AC.createBufferSource();s.buffer=AC.noise;s.loop=true;const fl=AC.createBiquadFilter();fl.type='bandpass';fl.frequency.value=1100;fl.Q.value=.5;const G=AC.createGain();G.gain.setValueAtTime(.001,t);G.gain.linearRampToValueAtTime(.5,t+.4);G.gain.linearRampToValueAtTime(.001,t+2.6);s.connect(fl);fl.connect(G);G.connect(AC.sfxG);s.start(t);s.stop(t+2.7)}
  else if(k==='fanfare'){[523,659,784,1047].forEach((f,i)=>tn(t+i*.14,f,.5,'square',.12));tn(t+.56,1047,1.2,'sawtooth',.08);sfx('roar')}
  else if(k==='cash'){tn(t,1318,.1,'square',.15);tn(t+.08,1760,.25,'square',.15)}
  else if(k==='tap'){tn(t,600,.05,'triangle',.08)}
  else if(k==='react'){tn(t,880,.08,'square',.12);tn(t+.07,1175,.12,'square',.12)}
  else if(k==='good'){tn(t,784,.1,'triangle',.25);tn(t+.08,1175,.2,'triangle',.25)}
  else if(k==='bad'){tn(t,220,.25,'sawtooth',.15,null,140)}}
/* musique : boucle hip-hop / trap légère */
const BASS=[55,55,65.4,49];
function musTick(){if(!AC||!AU.music)return;const bpm=AMmode==='fight'?118:92,sp=60/bpm/4;
  while(AMnext<AC.currentTime+.15){const t=AMnext,st=AMstep%16,bar=Math.floor(AMstep/16)%4;
    if(st===0||st===10||(AMmode==='fight'&&st===7))tn(t,120,.28,'sine',.9,AM,40);
    if(st===4||st===12){nz(t,.16,1800,.7,'bandpass',.55,AM)}
    if(st%2===0||AMmode==='fight')nz(t,.03,8000,.7,'highpass',st%4===2?.18:.08,AM);
    if(st===0||st===6||st===8||st===14)tn(t,BASS[bar],sp*(st===14?2:3),'sawtooth',.22,AM,BASS[bar]*.99);
    if(st===0&&bar%2===0)[0,3,7].forEach(n=>tn(t,BASS[bar]*4*Math.pow(2,n/12),sp*12,'triangle',.05,AM));
    AMnext+=sp;AMstep++}}
function musStart(mode){if(!acInit())return;AMmode=mode||AMmode;if(AC.state==='suspended')AC.resume();if(!AU.music){AM.gain.value=0;return}AM.gain.value=AMmode==='fight'?.11:.16;if(!AMT){AMnext=AC.currentTime+.1;AMT=setInterval(musTick,60)}
  if(AMmode==='fight'&&!CROWDN){const s=AC.createBufferSource();s.buffer=AC.noise;s.loop=true;const fl=AC.createBiquadFilter();fl.type='bandpass';fl.frequency.value=700;fl.Q.value=.4;const G=AC.createGain();G.gain.value=AU.sfx?.06:0;s.connect(fl);fl.connect(G);G.connect(AC.destination);s.start();CROWDN={s,G}}
  if(AMmode!=='fight'&&CROWDN){try{CROWDN.s.stop()}catch(e){}CROWDN=null}}
function musStop(){if(AMT){clearInterval(AMT);AMT=0}if(CROWDN){try{CROWDN.s.stop()}catch(e){}CROWDN=null}}
document.addEventListener('pointerdown',()=>{if(acInit()){if(AC.state==='suspended')AC.resume();if(AU.music&&!AMT)musStart(ui.fight?'fight':'menu')}},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden)AC.suspend();else AC.resume()});
function auToggle(k){AU[k]=!AU[k];auSave();if(k==='music'){if(AU.music)musStart(ui.fight?'fight':'menu');else{musStop();if(AM)AM.gain.value=0}}if(k==='sfx'&&CROWDN)CROWDN.G.gain.value=AU.sfx?.06:0;
  const b=document.getElementById('aubtn');if(b)b.textContent=AU.music||AU.sfx?'🔊':'🔇';toast(`${k==='music'?'🎵 Musique':'🔊 Sons'} : ${AU[k]?'activé':'coupé'}`);if(ui.menu)renderMenu();else if(S)render()}
/* hooks : coups, cloche, foule, annonce, réactions */
const _auFire=fire;fire=function(F,a,now){_auFire(F,a,now);if(!F||F.replay&&!AU.sfx)return;const dl=Math.max(0,(F.vis[a.who==='A'?'B':'A'].hit||now)-now);if(a.hit)setTimeout(()=>{sfx(a.kd||a.fin?'big':'punch');if(a.kd||a.fin)sfx('roar')},dl)};
const _auGo=goRound;goRound=function(){const F=ui.fight;if(F&&!F.done&&(F.stage==='intro'||F.stage==='between'))sfx('bell');_auGo()};
const _auBegin=beginFight;beginFight=function(F){_auBegin(F);musStart('fight');if(F.online)setTimeout(()=>sfx('roar'),400)};
const _auDone=fightDone;fightDone=function(){_auDone();if(!ui.fight)musStart('menu')};
const _auAnn=annPlay;annPlay=function(F){const was=F.annDone;_auAnn(F);if(!was&&F.annDone){sfx('bell');const w=setInterval(()=>{if(ui.fight!==F){clearInterval(w);return}if(F.annWin){clearInterval(w);sfx('fanfare')}},200)}};
const _auRx=rxOpen;rxOpen=function(F){sfx('react');_auRx(F)};
const _auRxC=rxClose;rxClose=function(F,k){const ok=F&&F.rx&&k===F.rx.s.ok;_auRxC(F,k);if(F&&k!==undefined)sfx(ok?'good':'bad')};


/* ================= v52 : COMBAT SANS DÉFILEMENT ================= */
const _ns_bf=buildFight;buildFight=function(){_ns_bf();const el=document.getElementById('fx');if(el)el.classList.toggle('onf',!!(ui.fight&&ui.fight.online))};
const _ns_ctl=ctlHTML;ctlHTML=function(F){let h=_ns_ctl(F);
  h=h.replace(/<div class="lab" style="margin-bottom:6px">Dans le coin \(1 minute\)<\/div>/,'');
  h=h.replace(/<div class="lab" style="margin-bottom:6px">Plan pour le [^<]*<\/div>/,'');
  h=h.replace(/<div class="lab" style="margin-bottom:6px">(Plan de départ|Consigne en direct)<\/div>/,'');
  return h};

/* --- événements aléatoires --- */
const EVENTS={
 ssinv:{b:1,need:()=>false,t:'📩 Invitation : Super Série',x:b=>{const o=getB(ssOpp(b.id)),st=o?ssStake(b,o):[];return`${b.name} est invité à la ${S.ss?S.ss.n:'Super Série'} ! Quart de finale contre ${o?o.name+' ('+ovr(o)+')':'?'}, ${S.ss?when(S.ss.wk[0]):''}${st.length?`, avec ${st.join(', ')} en jeu`:''}. Jusqu’à ${moneyS(SSP[3])} et le trophée au vainqueur. Il participe ?`},
  c:[['✅ Accepter',b=>{ssAccept(b.id);return`${b.name} participe à la Super Série !`}],['Refuser',b=>{ssRefuse(b.id);return`${b.name} décline l’invitation. Un autre boxeur prend sa place.`}]]},
 oldchamp:{b:1,need:()=>false,t:'Le vieux lion',x:b=>`${b.name} a ${b.age} ans et porte encore ${beltsOf(b).join(', ')}. Son corps ralentit. Il te demande ton avis : continuer ou partir en champion ?`,
  c:[['Prendre sa retraite en champion',b=>{retireB(b);return`${b.name} part en champion. Il entre au Temple de la renommée avec les honneurs.`}],['Encore un an !',b=>{b.morale=cl(b.morale+10,0,100);b.fame=cl(b.fame+3,1,100);b.oldPush=1;return`${b.name} continue. Le public l’adore… mais le déclin pourrait s’accélérer.`}]]},
 moveup:{b:1,need:()=>false,t:'Monter de catégorie ?',x:b=>`${b.name} a tout gagné en ${divN(b.div)}. Il veut monter d’une catégorie pour devenir champion dans plusieurs divisions et entrer dans l’histoire.`,
  c:[['Monter de catégorie',b=>{changeDiv(b,1);b.morale=cl(b.morale+8,0,100);return`${b.name} monte en ${divN(b.div)} ! Ses ceintures sont libérées. Objectif : un titre dans une 2e division (+150 points GOAT).`}],['Rester et défendre',b=>{b.loy=cl(b.loy-4,0,100);return`${b.name} reste, un peu déçu.`}]]},
 press:{b:1,need:()=>false,t:'Conférence de presse',x:b=>{const f=upF(b),o=f&&getB(f.b);return`Avant ${f&&f.title?'son combat de championnat':'son grand combat'} contre ${o?o.name:'son adversaire'}, ${b.name} fait face aux médias. Quel ton adopter ?`},
  c:[['Respectueux',b=>{b.loy=cl(b.loy+3,0,100);b.morale=cl(b.morale+6,0,100);const f=upF(b);if(f)f.press='resp';return`${b.name} reste classe : moral et loyauté en hausse.`}],['Provocateur',b=>{b.fame=cl(b.fame+4,1,100);const f=upF(b);if(f){f.press='prov';f.purse=Math.round(f.purse*1.1)}return`Le buzz explose : +4 popularité et bourse +10 %, mais l’adversaire est piqué au vif.`}],['Promettre un KO',b=>{b.fame=cl(b.fame+6,1,100);const f=upF(b);if(f)f.press='ko';return`${b.name} promet un KO ! S’il ne le fait pas, les médias vont s’en souvenir.`}]]},
 bid:{b:1,need:()=>false,t:'Offre de transfert',x:b=>`${rivN(S.event.r)} offre ${$(S.event.v)} pour racheter le contrat de ${b.name}.`,
  c:[['Accepter l’offre',b=>{const v=S.event.v,r=(S.rivals||[]).find(x=>x.id===S.event.r);const f=upF(b);if(f)cancelFight(f.id);for(const k of beltsOf(b))S.belts[b.div][k]=null;S.money+=v;b.mine=false;b.salary=0;if(r){r.signed++;r.rep=cl(r.rep+3,10,99)}ensureBelts(b.div);return`${b.name} part chez ${r?r.n:'un rival'}. +${$(v)}.`}],['Refuser',b=>{if(b.loy<50&&R()<.4){b.loy=cl(b.loy-8,0,100);return`${b.name} voulait partir… loyauté en baisse.`}b.loy=cl(b.loy+2,0,100);return`${b.name} apprécie ta confiance.`}]]},
 interview:{b:1,need:b=>true,t:'Interview',x:b=>`Un journaliste veut parler à ${b.name} avant la semaine d’entraînement.`,
  c:[['Rester humble',b=>{b.morale=cl(b.morale+5,0,100);b.loy=cl(b.loy+3,0,100);return`${b.name} reste classe : moral et loyauté en hausse.`}],
     ['Provoquer tout le monde',b=>{b.fame=cl(b.fame+5,1,100);if(R()<.3){S.money-=1500;return`Le buzz monte (+5 notoriété), mais la commission inflige 1 500 $ d’amende.`}return`Le buzz monte : +5 notoriété pour ${b.name}.`}]]},
 sponsor:{b:1,need:b=>!b.spDue,t:'Commanditaire',x:b=>`Une marque de boissons énergisantes offre 6 000 $ pour commanditer ${b.name}, s’il se bat dans les 8 prochaines semaines. Sinon : 8 000 $ de pénalité.`,
  c:[['Accepter (+6 000 $)',b=>{S.money+=6000;b.spDue=S.t+8;b.spFrom=S.t;return`Contrat signé. ${b.name} doit se battre d’ici ${when(S.t+8)}.`}],['Refuser',b=>'Tu refuses poliment l’offre.']]},
 prospect:{b:0,need:()=>mine().length<rosterCap(),t:'Un jeune à la porte',x:()=>'Un jeune de 18 ans se présente au gym. Pas d’agent, des gants usés et beaucoup de cœur.',
  c:[['Lui donner sa chance',()=>{const p=makeBoxer({div:pick(DIVS).id,nat:S.home,ovr:ri(36,44),age:18,pot:ri(30,45)});
      Object.assign(p,{mine:true,salary:120,fame:1,pts:0,w:0,l:0,d:0,ko:0,morale:85,loy:85,lastFight:S.t,hist:[],lvl:1,xp:0,sp:0,contract:52,plan:'normal'});
      p.traits=p.traits.filter(k=>k!=='diva');if(!p.traits.includes('fidele'))p.traits.push('fidele');S.boxers.push(p);return`${p.name} rejoint l’écurie pour 120 $/sem. Gros potentiel !`}],['Le renvoyer',()=>'Le jeune repart déçu.']]},
 party:{b:1,need:b=>true,t:'Écart de conduite',x:b=>`${b.name} a été vu en boîte de nuit à 3 h du matin, la veille d’un entraînement.`,
  c:[['Amende de 500 $',b=>{S.money+=500;b.loy=cl(b.loy-6,0,100);return`${b.name} paie l’amende, mais n’apprécie pas.`}],['Fermer les yeux',b=>{b.fatigue=cl(b.fatigue+15,0,100);b.morale=cl(b.morale+6,0,100);return`${b.name} est content, mais fatigué.`}]]},
 charity:{b:0,need:()=>S.money>=2000&&mine().length>0,t:'Gala de charité',x:()=>'Un gala pour un hôpital pour enfants invite ton club. Les frais sont de 2 000 $.',
  c:[['Y aller (−2 000 $)',()=>{S.money-=2000;for(const x of mine()){x.fame=cl(x.fame+3,1,100);x.loy=cl(x.loy+4,0,100)}return'Belle soirée : +3 notoriété et +4 loyauté pour toute l’écurie.'}],['Décliner',()=>'Tu déclines l’invitation.']]},
 hand:{b:1,need:b=>!b.inj,t:'Douleur à la main',x:b=>`${b.name} se plaint d’une douleur à la main droite après l’entraînement.`,
  c:[['Repos d’une semaine',b=>{b.inj=1;b.plan='repos';return`${b.name} se repose une semaine par précaution.`}],['Continuer',b=>{if(R()<.4*(has(b,'fragile')?1.5:1)){b.inj=ri(2,4);return`Mauvaise idée : ${b.name} est blessé ${b.inj} semaines.`}return`Fausse alerte, ${b.name} va bien.`}]]},
 rival:{b:1,need:b=>b.rival&&getB(b.rival)&&!b.booked&&!getB(b.rival).booked&&!canBook(b,getB(b.rival)),t:'Provocation',x:b=>`${getB(b.rival).name} se moque de ${b.name} sur les réseaux et réclame une revanche.`,
  c:[['Accepter la revanche',b=>{const o=getB(b.rival);propose(b.id,o.id);return`Revanche signée contre ${o.name} ! Bourse ×1,5.`}],['Ignorer',b=>{b.morale=cl(b.morale-4,0,100);return`${b.name} ronge son frein.`}]]}
};
function maybeEvent(){
  if(!S.set.events||S.event||R()>.22)return;
  const m=mine();
  for(const k of Object.keys(EVENTS).sort(()=>R()-.5)){const E=EVENTS[k],b=E.b?pick(m):null;if(E.b&&!b)continue;let ok=false;try{ok=E.need(b)}catch(e){}if(ok){S.event={k,b:b?b.id:null};return}}
}
function renderEvent(){
  const el=document.getElementById('ev');
  if(!S.event&&S.notice){el.innerHTML=`<div class="mcard nt" role="dialog"><span class="lab">${when(S.t)}</span><h3>${esc(S.notice.t)}</h3><div class="mbody">${S.notice.lines.map(l=>/^<b>[^<]*<\/b>$/.test(l)?`<p class="sec">${l}</p>`:`<p>${l}</p>`).join('')}</div><button class="btn pri big" data-a="noticeok">Super !</button></div>`;el.hidden=false;return}
  if(!S.event||!EVENTS[S.event.k]){S.event=null;el.hidden=true;return}
  const E=EVENTS[S.event.k],b=S.event.b?getB(S.event.b):null;if(E.b&&!b){S.event=null;el.hidden=true;return}
  el.innerHTML=`<div class="mcard" role="dialog" aria-label="${E.t}"><span class="lab">Événement · ${when(S.t)}</span>
    ${b?`<div class="row" style="margin:10px 0 4px"><div class="av sm">${avatar(b)}</div><b>${esc(b.name)}</b></div>`:''}<h3>${E.t}</h3><p>${E.x(b)}</p>
    <div class="stack" style="gap:8px">${E.c.map((c,i)=>`<button class="btn ${i?'':'pri'} big" data-a="evc" data-k="${i}">${c[0]}</button>`).join('')}</div></div>`;
  el.hidden=false;
}
function chooseEvent(i){
  const E=EVENTS[S.event.k],b=S.event.b?getB(S.event.b):null,r=E.c[i][1](b);
  log(`${E.t} : ${r}`);toast(r);S.event=null;document.getElementById('ev').hidden=true;save();render();
  if(ui.skipF&&!S.queue.length){skipTo(ui.skipF);return}
  if(S.queue.length&&!ui.fight)openFight(S.queue[0]);
}

/* --- combat 3D --- */
let G3=null,HAS3=null;
function has3D(){if(HAS3!==null)return HAS3;try{HAS3=!!THREE&&!!document.createElement('canvas').getContext('webgl')}catch(e){HAS3=false}return HAS3}
const M3=(c,r)=>new THREE.MeshStandardMaterial({color:c,roughness:r==null?.6:r,metalness:0});

/* ===== logo FIGHT DYNASTY ===== */
let _bmC=null,_bmU=null;
function bmCanvas(){if(_bmC)return _bmC;const c=document.createElement('canvas');c.width=c.height=512;bmLogo(c.getContext('2d'),256,256,244);_bmC=c;return c}
function bmImg(){if(!_bmU){try{_bmU=bmCanvas().toDataURL('image/png')}catch(e){_bmU=''}}return _bmU}
function ringMatTex(){const c=document.createElement('canvas');c.width=c.height=1024;const x=c.getContext('2d');
  const g=x.createRadialGradient(512,512,60,512,512,720);g.addColorStop(0,'#f1f4f9');g.addColorStop(1,'#b9c1cf');x.fillStyle=g;x.fillRect(0,0,1024,1024);
  x.globalAlpha=.05;for(let i=0;i<3000;i++){x.fillStyle=Math.random()<.5?'#000':'#fff';x.fillRect(Math.random()*1024,Math.random()*1024,2,2)}x.globalAlpha=1;
  x.lineWidth=10;x.strokeStyle='rgba(200,16,46,.35)';x.beginPath();x.arc(512,512,330,0,7);x.stroke();
  x.globalAlpha=.92;bmLogo(x,512,512,300,{flat:1});x.globalAlpha=1;
  const tx=new THREE.CanvasTexture(c);tx.encoding=THREE.sRGBEncoding;tx.anisotropy=4;return tx}
logoReady.then(()=>{_bmC=null;_bmU=null});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{_bmC=null;_bmU=null;if(typeof ui!=='undefined'&&ui.menu==='home'&&typeof renderMenu==='function')try{renderMenu()}catch(e){}});

function texTxt(t,bg,fg,w,h,sz){const c=document.createElement('canvas');c.width=w||512;c.height=h||512;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);x.fillStyle=fg;x.font=`900 ${sz||200}px "Big Shoulders Display",Impact,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(t,c.width/2,c.height/2+8);const tx=new THREE.CanvasTexture(c);tx.encoding=THREE.sRGBEncoding;return tx}

/* ===== effets premium (gants & culottes) ===== */
const isPremG=c=>c==='#ffd23a'||c==='#0d0d0d',isPremT=t=>t===7||t===8;let premN=0;
function premSpark(c,x,y,r,now,ph){const a=Math.max(0,Math.sin(now/260+ph));if(a<.05)return;c.save();c.globalAlpha=a;c.fillStyle='#fff';c.translate(x,y);c.rotate(now/900+ph);c.beginPath();for(let i=0;i<8;i++){const rr=i%2?r*.25:r,t=i*Math.PI/4;c.lineTo(Math.cos(t)*rr,Math.sin(t)*rr)}c.closePath();c.fill();c.restore()}
const PREMMATS=new Set();
function premMat(col){const gold=col!=='#0d0d0d'&&col!=='#0a0a0a';const m=new THREE.MeshStandardMaterial({color:gold?'#e8b82a':'#111',roughness:.22,metalness:.9,emissive:gold?'#7a5200':'#3a2a00',emissiveIntensity:.3});
  if(typeof WeakRef!=='undefined')PREMMATS.add(new WeakRef(m));return m}
setInterval(()=>{const t=performance.now();for(const w of PREMMATS){const m=w.deref();if(!m){PREMMATS.delete(w);continue}m.emissiveIntensity=.25+.35*(.5+.5*Math.sin(t/350))}},60);

function mkBoxer3(b,glove){
  const L=b.look||{},mS=M3(SKIN[L.skin??2],.55),mT=isPremT(L.tr)?premMat(TRUNK[L.tr]):M3(TRUNK[L.tr??0]||'#ff3d52',.45),mG=isPremG(glove)?premMat(glove):M3(glove,.28),mSh=M3('#15171c',.7),mH=M3(HAIRC[L.hc??0],.9),mW=M3('#f1f1f1',.8);
  const cap=(r,l,m)=>new THREE.Mesh(new THREE.CapsuleGeometry(r,l,4,10),m);
  const root=new THREE.Group(),hips=new THREE.Group();hips.position.y=.98;root.add(hips);
  const shorts=new THREE.Mesh(new THREE.CylinderGeometry(.2,.24,.3,16),mT);hips.add(shorts);
  const wb=new THREE.Mesh(new THREE.CylinderGeometry(.205,.205,.05,16),mW);wb.position.y=.14;hips.add(wb);
  const legs=[];for(const s of[1,-1]){const th=new THREE.Group();th.position.set(0,-.08,s*.11);hips.add(th);const t=cap(.075,.3,mS);t.position.y=-.2;th.add(t);
    const kn=new THREE.Group();kn.position.y=-.42;th.add(kn);const sh=cap(.06,.3,mS);sh.position.y=-.2;kn.add(sh);
    const so=new THREE.Mesh(new THREE.CylinderGeometry(.066,.066,.09,10),mW);so.position.y=-.36;kn.add(so);
    const shoe=new THREE.Mesh(new THREE.BoxGeometry(.25,.09,.11),mSh);shoe.position.set(.04,-.45,0);kn.add(shoe);legs.push({th,kn})}
  const torso=new THREE.Group();torso.position.y=.12;hips.add(torso);
  const chest=cap(.2,.32,mS);chest.scale.set(.82,1,1.08);chest.position.y=.3;torso.add(chest);
  const head=new THREE.Group();head.position.y=.66;torso.add(head);
  const neck=cap(.065,.06,mS);neck.position.y=-.06;head.add(neck);
  const hd=new THREE.Mesh(new THREE.SphereGeometry(.12,18,14),mS);hd.scale.set(1,1.12,.95);hd.position.y=.08;head.add(hd);
  if(L.hair&&L.hair!==2){const hr=new THREE.Mesh(new THREE.SphereGeometry(.126,16,10,0,Math.PI*2,0,Math.PI*.5),mH);hr.position.y=.1;hr.scale.set(1,L.hair===3?1.3:.9,1);head.add(hr)}
  if(L.beard){const bd=new THREE.Mesh(new THREE.SphereGeometry(.117,14,8,0,Math.PI*2,Math.PI*.58,Math.PI*.32),mH);bd.position.y=.07;head.add(bd)}
  const eyeM=M3('#111',.3);for(const s of[1,-1]){const e=new THREE.Mesh(new THREE.SphereGeometry(.014,6,6),eyeM);e.position.set(.108,.11,s*.045);head.add(e)}
  const mg=new THREE.Mesh(new THREE.BoxGeometry(.03,.024,.08),mG);mg.position.set(.105,.02,0);head.add(mg);
  const cut=new THREE.Mesh(new THREE.BoxGeometry(.012,.016,.06),M3('#d0102a',.4));cut.position.set(.112,.15,.05);cut.visible=false;head.add(cut);
  const arms=[];for(const s of[1,-1]){const shp=new THREE.Group();shp.position.set(0,.48,s*.25);torso.add(shp);const ua=cap(.056,.22,mS);ua.position.y=-.16;shp.add(ua);
    const el=new THREE.Group();el.position.y=-.33;shp.add(el);const fa=cap(.05,.2,mS);fa.position.y=-.14;el.add(fa);
    const gl=new THREE.Mesh(new THREE.SphereGeometry(.098,16,12),mG);gl.scale.set(1.12,1,1);gl.position.y=-.32;el.add(gl);arms.push({shp,el,gl})}
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(.42,22),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.38,depthWrite:false}));shadow.rotation.x=-Math.PI/2;
  return{root,hips,torso,head,arms,legs,cut,shadow};
}
function mkRef3(){
  const mS=M3(SKIN[1],.55),mSh=M3('#cfe0f5',.75),mP=M3('#15171d',.7),mB=M3('#0b0c10',.5);
  const cap=(r,l,m)=>new THREE.Mesh(new THREE.CapsuleGeometry(r,l,4,8),m);
  const root=new THREE.Group(),hips=new THREE.Group();hips.position.y=.98;root.add(hips);
  const legs=[];for(const s of[1,-1]){const th=new THREE.Group();th.position.set(0,-.06,s*.1);hips.add(th);const t=cap(.075,.36,mP);t.position.y=-.22;th.add(t);const kn=new THREE.Group();kn.position.y=-.45;th.add(kn);const sh=cap(.065,.32,mP);sh.position.y=-.2;kn.add(sh);const sho=new THREE.Mesh(new THREE.BoxGeometry(.24,.08,.1),mB);sho.position.set(.04,-.44,0);kn.add(sho);legs.push({th,kn})}
  const torso=new THREE.Group();torso.position.y=.08;hips.add(torso);const ch=cap(.18,.36,mSh);ch.position.y=.3;ch.scale.set(.85,1,1.05);torso.add(ch);
  const bow=new THREE.Mesh(new THREE.BoxGeometry(.03,.04,.1),mB);bow.position.set(.16,.6,0);torso.add(bow);
  const head=new THREE.Group();head.position.y=.68;torso.add(head);const hd=new THREE.Mesh(new THREE.SphereGeometry(.115,14,10),mS);hd.position.y=.08;head.add(hd);const hr=new THREE.Mesh(new THREE.SphereGeometry(.12,12,8,0,Math.PI*2,0,Math.PI*.45),M3('#555a63',.9));hr.position.y=.1;head.add(hr);
  const arms=[];for(const s of[1,-1]){const shp=new THREE.Group();shp.position.set(0,.5,s*.23);torso.add(shp);const ua=cap(.05,.24,mSh);ua.position.y=-.16;shp.add(ua);const el=new THREE.Group();el.position.y=-.33;shp.add(el);const fa=cap(.045,.2,mS);fa.position.y=-.14;el.add(fa);arms.push({shp,el})}
  return{root,hips,torso,head,arms,legs};
}
function poseRef(m,now,count,ph){const t=now/1000;m.hips.position.y=.98+Math.sin(t*2+ph)*.006;
  m.legs[0].th.rotation.z=.12;m.legs[1].th.rotation.z=-.12;m.legs[0].kn.rotation.z=m.legs[1].kn.rotation.z=-.05;
  m.torso.rotation.set(0,0,count?-.15:0);m.head.rotation.set(0,Math.sin(t*.7)*.3,0);
  if(count){const c=Math.abs(Math.sin(now/180));m.arms[0].shp.rotation.set(0,0,1.2+c*1.2);m.arms[0].el.rotation.set(0,0,.2);m.arms[1].shp.rotation.set(-.2,0,.2);m.arms[1].el.rotation.set(0,0,.3)}
  else{m.arms[0].shp.rotation.set(.15,0,.25);m.arms[0].el.rotation.set(0,0,.5);m.arms[1].shp.rotation.set(-.15,0,.25);m.arms[1].el.rotation.set(0,0,.5)}}
function updCrowd(g,now){const t=now/1000,d=g.d;
  g.seats.forEach((p,i)=>{const jump=g.ex*Math.max(0,Math.sin(t*9*p.k+p.ph))*.22,sw=Math.sin(t*1.3*p.k+p.ph)*.02;
    d.position.set(p.x,p.y+.3+jump,p.z);d.rotation.set(0,p.ry,sw);d.scale.setScalar(1);d.updateMatrix();g.bodyM.setMatrixAt(i,d.matrix);
    d.position.set(p.x,p.y+.62+jump,p.z);d.updateMatrix();g.headM.setMatrixAt(i,d.matrix)});
  g.bodyM.instanceMatrix.needsUpdate=true;g.headM.instanceMatrix.needsUpdate=true}
function pose3(m,v,now,ph,en,cele){
  const P=(t,d)=>{if(t<0)return 0;const k=(now-t)/d;return k>0&&k<1?Math.sin(k*Math.PI):0};
  const pk=P(v.pt,v.pd),rec=P(v.hit,320),dod=P(v.dodge,360),blk=P(v.block,380),t=now/1000,mv=RM?0:1,tired=1-cl((en==null?100:en)/100,0,1);
  let fall=0,buck=0;if(v.kdT>=0&&now>=v.kdT-120){const k=now-v.kdT;buck=k<0?(k+120)/120:1;fall=k<0?0:v.ko?Math.min(1,k/520):k<520?k/520:k<v.kdHold+520?1:k<v.kdHold+950?1-(k-v.kdHold-520)/430:0;if(!v.ko&&k>v.kdHold+950)buck=0}
  const bnc=fall?0:Math.abs(Math.sin(t*(4.4-tired*1.8)+ph))*(.04-tired*.025)*mv,sway=Math.sin(t*1.6+ph)*mv,weave=Math.sin(t*2.4+ph*1.3)*mv*(1-tired*.6);
  const side=v.arm===0?-1:1,ty=v.pty||'s';
  m.hips.position.y=.9+bnc-dod*.13-buck*.18-(ty==='u'?pk*.06:0)-tired*.03;
  m.hips.rotation.set(0,sway*.12+side*pk*.28,0);
  m.legs[0].th.rotation.set(.06,0,.4+bnc*2+buck*.4);m.legs[0].kn.rotation.z=-.45-bnc*3-buck*.9;
  m.legs[1].th.rotation.set(-.06,0,-.3+bnc*1.5+buck*.3);m.legs[1].kn.rotation.z=-.2-bnc*2-buck*.6;
  const bodyHit=rec&&v.hb;
  m.torso.rotation.set(weave*.07+dod*.38*(v.dh||1),side*pk*(ty==='h'?.6:.4)+sway*.05,-.16-pk*.24+(bodyHit?-.3:rec*.36)+dod*.22+tired*.1+buck*.25);
  m.head.rotation.set(weave*.05+rec*.25*(v.hd||1),rec*.3*(v.hd||1),bodyHit?-.1:rec*.6+tired*.05);
  m.arms.forEach((a,i)=>{const act=v.arm===i?pk:0,inw=i===0?1:-1;
    let sz=.95-tired*.4+blk*.32+Math.sin(t*3.1+i*2+ph)*.05*mv,ez=2.05+blk*.25-tired*.3,sx=inw*.3;
    if(act){let tz,te,tx;if(ty==='h'){tz=v.body?1.25:1.55;te=1.25;tx=inw*1.05}else if(ty==='u'){tz=v.body?1.0:1.32;te=1.55;tx=inw*.2}else{tz=v.body?1.32:1.72;te=.06;tx=0}
      sz+=(tz-sz)*act;ez+=(te-ez)*act;sx+=(tx-sx)*act}
    if(cele){sz=3.0+Math.sin(t*6+i)*.12;ez=.15;sx=inw*-.2}
    a.shp.rotation.set(sx,0,sz);a.el.rotation.set(0,0,ez)});
  m.cut.visible=!!v.cut;
  return fall;
}
function init3D(cv){
  const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});r.setPixelRatio(Math.min(2,window.devicePixelRatio||1));r.outputEncoding=THREE.sRGBEncoding;
  const sc=new THREE.Scene();sc.background=new THREE.Color('#04050a');sc.fog=new THREE.Fog('#04050a',12,30);
  const cam=new THREE.PerspectiveCamera(42,1,.1,80);
  sc.add(new THREE.HemisphereLight('#c0c8de','#140a0e',.55));
  const sp=new THREE.SpotLight('#fff1d8',2.6,22,.62,.55,1);sp.position.set(0,9,1);sp.target.position.set(0,.5,0);sc.add(sp,sp.target);
  const kr=new THREE.PointLight('#ff3b50',1.2,11);kr.position.set(-3.6,2.8,3.6);const kb=new THREE.PointLight('#4f80ff',1.2,11);kb.position.set(3.6,2.8,-3.6);sc.add(kr,kb);
  const fillC=new THREE.PointLight('#ffd9a0',.9,14);fillC.position.set(0,5,0);sc.add(fillC);
  const W=5.8,H=.5,club=S?S.club:'FIGHT DYNASTY';
  const apron=new THREE.MeshStandardMaterial({map:texTxt(club.toUpperCase(),'#7a0e1f','#f5c451',1024,128,80),roughness:.7});
  const matTop=new THREE.MeshStandardMaterial({map:ringMatTex(),roughness:.85});
  const ring=new THREE.Mesh(new THREE.BoxGeometry(W,H,W),[apron,apron,matTop,M3('#111'),apron,apron]);ring.position.y=H/2;sc.add(ring);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),M3('#0b0d14',.95));floor.rotation.x=-Math.PI/2;sc.add(floor);
  for(const[c,x,z]of[['#e0213a',-1,1],['#f2f2f2',1,1],['#3a63e0',1,-1],['#f2f2f2',-1,-1]]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,1.6,10),M3('#c9ced8',.3));p.position.set(x*W/2,H+.8,z*W/2);sc.add(p);const pad=new THREE.Mesh(new THREE.BoxGeometry(.2,1.1,.2),M3(c,.5));pad.position.set(x*W/2,H+.75,z*W/2);sc.add(pad)}
  ['#e0213a','#f5f6fa','#3a63e0'].forEach((c,i)=>{const y=H+.38+i*.34,m=M3(c,.4);for(const[x,z,ry]of[[0,W/2,0],[0,-W/2,0],[W/2,0,Math.PI/2],[-W/2,0,Math.PI/2]]){const rp=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,W,8),m);rp.rotation.z=Math.PI/2;rp.rotation.y=ry;rp.position.set(x,y,z);sc.add(rp)}});
  // gradins + foule
  const stM=M3('#1a1f2c',.95),seats=[];
  for(let row=0;row<8;row++){const d=4.4+row*.7,y=row*.4,L=2*d;
    for(let s=0;s<4;s++){const blk=new THREE.Mesh(new THREE.BoxGeometry(L+.7,.4,.7),stM),a=s*Math.PI/2;blk.position.set(Math.sin(a)*d,y+.2,Math.cos(a)*d);blk.rotation.y=a;sc.add(blk);
      const n=Math.floor(L/.56);for(let j=0;j<n;j++){if(Math.random()<.08)continue;const u=-L/2+.28+j*.56;seats.push({x:Math.sin(a)*d+Math.cos(a)*u,z:Math.cos(a)*d-Math.sin(a)*u,y:y+.4,ry:a+Math.PI,ph:Math.random()*6.3,k:.6+Math.random()*.8})}}}
  const N=seats.length,bodyM=new THREE.InstancedMesh(new THREE.CapsuleGeometry(.15,.28,3,8),new THREE.MeshStandardMaterial({roughness:.85}),N),headM=new THREE.InstancedMesh(new THREE.SphereGeometry(.11,10,8),new THREE.MeshStandardMaterial({roughness:.7}),N);
  const col=new THREE.Color();seats.forEach((p,i)=>{col.setHSL(Math.random(),.45+Math.random()*.3,.22+Math.random()*.2);bodyM.setColorAt(i,col);col.set(SKIN[Math.floor(Math.random()*SKIN.length)]);headM.setColorAt(i,col)});
  sc.add(bodyM,headM);
  const fl=[0,1].map(()=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),new THREE.MeshBasicMaterial({color:'#fff4c4',transparent:true,opacity:0,depthWrite:false}));sc.add(m);return m});
  const ph=Array.from({length:10},()=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.05,6,6),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0}));sc.add(m);return m});
  const ref=mkRef3();sc.add(ref.root);
  const g={r,sc,cam,cv,fl,ph,F:null,A:null,B:null,w:0,h:0,H,seats,bodyM,headM,ref,ex:0,nfx:0,fr:0,d:new THREE.Object3D(),rp:{x:0,z:-1.4}};
  updCrowd(g,0);return g;
}
function dispose3(){if(G3){try{G3.r.dispose();G3.r.forceContextLoss()}catch(e){}G3=null}}
function render3(F,now,cv){
  if(!G3||G3.cv!==cv){dispose3();G3=init3D(cv)}
  const g=G3;
  if(g.F!==F){if(g.A)g.sc.remove(g.A.root,g.B.root,g.A.shadow,g.B.shadow);g.A=mkBoxer3(F.A.b,F.A.b.glv||'#e0213a');g.B=mkBoxer3(F.B.b,F.B.b.glv||'#3a63e0');g.sc.add(g.A.root,g.B.root,g.A.shadow,g.B.shadow);g.F=F;g.ex=.3}
  const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;if(g.w!==w||g.h!==h){g.r.setSize(w,h,false);g.cam.aspect=w/h;g.cam.updateProjectionMatrix();g.w=w;g.h=h}
  const vA=F.vis.A,vB=F.vis.B;vA.cut=F.A.cut||0;vB.cut=F.B.cut||0;
  const t=now/1000,mv=RM?0:1,live=F.stage==='live',st=s=>s==='agr'?.12:s==='pru'?-.15:0;
  const ang=(Math.sin(t*.19)*.9+Math.sin(t*.43)*.25)*mv,cx=Math.sin(t*.16)*.55*mv,cz=Math.cos(t*.21)*.45*mv,dx=Math.cos(ang),dz=Math.sin(ang);
  const dn=F.stage==='done'&&F.res&&F.res.w,pre=dn&&!F.annWin;
  const dist=pre?1.0:1.02+Math.sin(t*.75)*.12*mv,sA=pre?0:shiftOf(vA,now)*1.7+(live?st(F.strat):0),sB=pre?0:shiftOf(vB,now)*1.7+(live&&F.rd?st(F.rd.sb):0);
  const ax=cx-dx*(dist/2-sA),az=cz-dz*(dist/2-sA),bx=cx+dx*(dist/2-sB),bz=cz+dz*(dist/2-sB);
  const done=F.stage==='done'&&F.res&&F.res.w,wA=done&&F.res.w==='A',wB=done&&F.res.w==='B';
  const fA=pose3(g.A,vA,now,0,F.disp.en[0],(wA&&!!F.annWin)||F.ent==='A'),fB=pose3(g.B,vB,now,1.9,F.disp.en[1],(wB&&!!F.annWin)||F.ent==='B');
  g.A.root.position.set(ax,g.H,az);g.B.root.position.set(bx,g.H,bz);
  g.A.root.rotation.set(0,-ang,fA*1.5);g.B.root.rotation.set(0,Math.PI-ang,fB*1.5);
  g.A.shadow.position.set(ax-dx*fA*.55,g.H+.005,az-dz*fA*.55);g.B.shadow.position.set(bx+dx*fB*.55,g.H+.005,bz+dz*fB*.55);
  const down=[vA,vB].find(v=>v.ko||(v.kdT>=0&&now>v.kdT&&now<v.kdT+v.kdHold+600)),px=-dz,pz=dx;
  const wn=done&&F.annWin?(wA?{x:ax,z:az}:{x:bx,z:bz}):null;
  const rt=pre&&!down?{x:cx-px*.42,z:cz-pz*.42}:pre?{x:cx-px*.55,z:cz-pz*.55}:wn?{x:wn.x-px*.2+(wA?-dx:dx)*.5,z:wn.z-pz*.2+(wA?-dz:dz)*.5}:down?{x:(down===vA?ax-dx*.9:bx+dx*.9)+px*-.6,z:(down===vA?az-dz*.9:bz+dz*.9)+pz*-.6}:{x:cx-px*1.45,z:cz-pz*1.45};
  g.rp.x+=(rt.x-g.rp.x)*.04;g.rp.z+=(rt.z-g.rp.z)*.04;g.ref.root.position.set(g.rp.x,g.H,g.rp.z);g.ref.root.rotation.y=Math.atan2(-(cx-g.rp.x),(cz-g.rp.z))+Math.PI/2*0-Math.PI/2+Math.atan2(0,1);
  if(pre||wn){g.ref.root.lookAt(g.cam.position.x,g.H,g.cam.position.z)}else g.ref.root.lookAt(cx,g.H,cz);g.ref.root.rotateY(-Math.PI/2);poseRef(g.ref,now,!pre&&!wn&&!!down&&!(down.ko&&now-down.kdT>3500),0);
  if(pre&&!down){g.ref.arms[0].shp.rotation.set(-.55,0,.35);g.ref.arms[0].el.rotation.set(0,0,.25);g.ref.arms[1].shp.rotation.set(.55,0,.35);g.ref.arms[1].el.rotation.set(0,0,.25)}
  if(wn){const k=Math.min(1,(now-F.annWin)/600),side=((wA?ax:bx)-g.rp.x)*Math.sin(g.ref.root.rotation.y)+((wA?az:bz)-g.rp.z)*Math.cos(g.ref.root.rotation.y)>0?0:1,arm=g.ref.arms[side];arm.shp.rotation.set((side?1:-1)*(.2+2.6*k),0,.25);arm.el.rotation.set(0,0,.1);g.ref.arms[1-side].shp.rotation.set(0,0,.2);g.ref.torso.rotation.set(0,0,-.05)}
  FX=FX.filter(f=>now-f.t<300);if(FX.length>g.nfx)g.ex=Math.min(1,g.ex+(FX[FX.length-1].big?.9:.12));g.nfx=FX.length;if(down)g.ex=Math.min(1,g.ex+.02);if(done)g.ex=Math.max(g.ex,.8);g.ex*=.985;
  g.fl.forEach(m=>m.material.opacity=0);
  FX.forEach((f,i)=>{if(now<f.t||i>1)return;const k=(now-f.t)/300,m=g.fl[i],tx=f.who==='A'?bx-dx*.12:ax+dx*.12,tz=f.who==='A'?bz-dz*.12:az+dz*.12;m.position.set(tx,g.H+(f.body?1.25:1.7),tz);m.scale.setScalar((f.big?2.4:1.2)*(.5+k));m.material.opacity=(1-k)*.9});
  if(!RM)g.ph.forEach(m=>{if(m.material.opacity>0)m.material.opacity-=.12;else if(Math.random()<.01+g.ex*.05){const p=g.seats[Math.floor(Math.random()*g.seats.length)];m.position.set(p.x,p.y+.75,p.z);m.material.opacity=1}});
  if(!RM&&(g.fr++%2===0))updCrowd(g,now);
  const port=w/h<1;let R0=port?5.6:4.7,ht=1.95,lx=cx,ly=g.H+1.2,lz=cz;
  if(pre){R0*=.78;ht=1.5;ly=g.H+1.25}else if(wn){R0*=.62;ht=1.45;lx=wn.x;lz=wn.z;ly=g.H+1.35}else if(F.ent){const E=F.ent==='A'?{x:ax,z:az}:{x:bx,z:bz};R0*=.8;ht=1.6;lx=E.x;lz=E.z;ly=g.H+1.3}else if(down){R0*=.75;ht=1.7;lx=down===vA?ax-dx*.5:bx+dx*.5;lz=down===vA?az-dz*.5:bz+dz*.5;ly=g.H+.65}
  const wob=Math.sin(t*.13)*.55*mv,ca=Math.atan2(pz,px)+wob,tgt=g.tc||(g.tc={x:lx,y:ly,z:lz,r:R0,h:ht,a:ca});
  tgt.x+=(lx-tgt.x)*.05;tgt.y+=(ly-tgt.y)*.05;tgt.z+=(lz-tgt.z)*.05;tgt.r+=(R0-tgt.r)*.05;tgt.h+=(ht-tgt.h)*.05;let da=ca-tgt.a;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;tgt.a+=da*.03;
  let sx=0,sy=0;if(!RM&&F.shake&&now-F.shake>0&&now-F.shake<260){sx=(Math.random()-.5)*.12;sy=(Math.random()-.5)*.08}
  g.cam.position.set(tgt.x+Math.cos(tgt.a)*tgt.r+sx,g.H+tgt.h+sy,tgt.z+Math.sin(tgt.a)*tgt.r);g.cam.lookAt(tgt.x,tgt.y,tgt.z);
  g.r.render(g.sc,g.cam);
  const ov=document.getElementById('ov');if(ov){let tx='';for(const v of[vA,vB]){if(v.kdT<0||now<v.kdT)continue;const el=now-v.kdT;if(v.ko){if(el>400)tx=F.koTxt==='TKO'?'T.K.O.':'K.O. !'}else if(el<v.kdHold+450)tx=String(Math.min(8,1+Math.floor(el/(v.kdHold/7+1))))}if(ov.dataset.t!==tx){ov.dataset.t=tx;ov.textContent=tx;ov.className='ov'+(tx?' on':'')+(tx.length>2?' ko':'')}}
}
/* --- animation du combat --- */
let AN=null,RAF=0,FX=[],FLASH=[],bubT=0;
const CROWD=Array.from({length:90},()=>[Math.random(),Math.random(),Math.random()]);
const RM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
function showBub(t){const el=document.getElementById('bub');if(!el||!S.set.anim)return;el.textContent=t;el.hidden=false;clearTimeout(bubT);bubT=setTimeout(()=>{el.hidden=true},2800)}
function animatePhase(ev,cb){
  const F=ui.fight,sp=F.speed||1,acts=[];let D=4600/sp;
  const mk=(who,e)=>{const n=cl(Math.round(e.thr*.42),e.land?1:0,9),hits=Math.min(n,e.land?Math.max(1,Math.round(n*e.land/Math.max(1,e.thr)*1.6)):0);
    for(let i=0;i<n;i++)acts.push({t:(.05+.85*R())*D,who,hit:i<hits,body:e.body&&R()<.6})};
  mk('A',ev.a);mk('B',ev.b);
  for(const who of['A','B']){let k=(who==='A'?ev.a:ev.b).kd;const hs=acts.filter(x=>x.who===who&&x.hit).sort((x,y)=>x.t-y.t);
    for(let i=hs.length-1;i>=0&&k>0;i--,k--)hs[i].kd=1;if(k>0)acts.push({t:D*.5,who,hit:true,body:false,kd:1})}
  if(ev.stop){const w=ev.stop.w;let last=acts.filter(x=>x.who===w&&x.hit).sort((x,y)=>x.t-y.t).pop();
    if(!last){last={t:D*.8,who:w,hit:true,body:false};acts.push(last)}last.fin=1;last.kd=0;
    for(let i=acts.length-1;i>=0;i--)if(acts[i].t>last.t)acts.splice(i,1);D=last.t+2000/Math.min(sp,2)}
  acts.sort((x,y)=>x.t-y.t);
  const onA=acts.filter(x=>x.who==='B'&&x.hit).length,onB=acts.filter(x=>x.who==='A'&&x.hit).length;
  for(const x of acts)if(x.hit)x.dmg=x.who==='A'?(ev.hp0[1]-ev.hp1[1])/Math.max(1,onB):(ev.hp0[0]-ev.hp1[0])/Math.max(1,onA);
  F.disp.hp=[ev.hp0[0],ev.hp0[1]];
  AN={acts,i:0,t0:performance.now(),D,cb,en0:[...F.disp.en],en1:[F.A.en,F.B.en],sec0:ev.p*60};
}
const isDown=(v,now)=>v.ko||(v.kdT>=0&&now>=v.kdT-60&&now<v.kdT+v.kdHold+850);
function fire(F,a,now){
  const sp=F.speed||1,at=F.vis[a.who],df=F.vis[a.who==='A'?'B':'A'],di=a.who==='A'?1:0;
  if(isDown(at,now)||(isDown(df,now)&&!a.fin))return;
  at.pt=now;at.pd=260/Math.min(sp,2);at.arm=R()<.55?0:1;at.body=a.body?1:0;at.pty=a.fin||a.kd?pick(['h','u','s']):pick(['s','s','s','h','u']);
  const imp=now+at.pd*.5;
  if(a.hit){df.hit=imp;df.hb=a.body?1:0;df.hd=R()<.5?1:-1;F.disp.hp[di]=Math.max(0,F.disp.hp[di]-a.dmg);FX.push({t:imp,who:a.who,body:a.body,big:a.kd||a.fin});
    if(a.kd||a.fin){df.kdT=imp+40;df.kdHold=a.fin?1e9:1700/Math.min(sp,2);if(a.fin){df.ko=true;F.koTxt=F.ev&&F.ev.stop?F.ev.stop.m:'KO'}F.shake=imp}}
  else if(R()<.5){df.dodge=imp-80;df.dh=R()<.5?1:-1}else df.block=imp-120;
}
function loop(now){
  RAF=requestAnimationFrame(loop);
  const F=ui.fight,cv=document.getElementById('cv');if(!F||!cv)return;
  if(AN){const el=now-AN.t0;
    while(AN.i<AN.acts.length&&AN.acts[AN.i].t<=el){fire(F,AN.acts[AN.i],now);AN.i++}
    const pr=Math.min(1,el/AN.D);
    F.disp.en=[0,1].map(i=>AN.en0[i]+(AN.en1[i]-AN.en0[i])*pr);
    F.clock=AN.sec0+Math.min(59,Math.floor(pr*60));
    hudBars(F);
    if(el>=AN.D){const cb=AN.cb;AN=null;cb()}
  }
  if(cv.offsetParent){if(S.set.td&&has3D())render3(F,now,cv);else drawFight(cv,F,now)}
}
function hudBars(F){for(const i of[0,1]){const h=document.getElementById('hp'+i),e=document.getElementById('en'+i);if(h)h.style.width=pct(F.disp.hp[i])+'%';if(e)e.style.width=pct(F.disp.en[i])+'%'}const c=document.getElementById('clk');if(c)c.textContent=clockTxt(F)}
function clockTxt(F){if(F.done&&F.stage==='done')return F.res.m==='DEC'?'Décision':F.res.m;if(F.stage==='live')return`${Math.floor(F.clock/60)}:${String(F.clock%60).padStart(2,'0')}`;if(F.stage==='between')return'Pause';return`${F.rounds} rounds`}
function drawRing(c,W,H,now){
  const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#04050a');bg.addColorStop(.55,'#0d1120');bg.addColorStop(1,'#05060a');c.fillStyle=bg;c.fillRect(0,0,W,H);
  for(const[x,y,s]of CROWD){const yy=H*.08+y*H*.3,r=2.5+s*3.5+y*3;c.fillStyle=`rgba(${34+y*34|0},${40+y*36|0},${62+y*44|0},${.5+s*.4})`;c.beginPath();c.arc(x*W,yy,r,0,7);c.fill();c.fillRect(x*W-r*1.3,yy+r*.7,r*2.6,r*1.8)}
  if(!RM&&Math.random()<.08)FLASH.push({x:Math.random()*W,y:H*.04+Math.random()*H*.32,t:now});
  FLASH=FLASH.filter(f=>now-f.t<220);for(const f of FLASH){const a=1-(now-f.t)/220,g=c.createRadialGradient(f.x,f.y,0,f.x,f.y,9);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(f.x-9,f.y-9,18,18)}
  for(const lx of[.28,.72]){const g=c.createLinearGradient(0,0,0,H*.85);g.addColorStop(0,'rgba(255,240,205,.22)');g.addColorStop(1,'rgba(255,240,205,0)');c.fillStyle=g;c.beginPath();c.moveTo(W*lx-6,0);c.lineTo(W*lx+6,0);c.lineTo(W*.5+W*.34,H*.85);c.lineTo(W*.5-W*.34,H*.85);c.closePath();c.fill()}
  const ty=H*.32,by=H*.62,l=W*.08,r=W*.92;
  const mg=c.createRadialGradient(W/2,H*.78,10,W/2,H*.78,W*.62);mg.addColorStop(0,'#eef2f8');mg.addColorStop(1,'#8e98ad');c.fillStyle=mg;c.beginPath();c.moveTo(-2,H*.92);c.lineTo(W+2,H*.92);c.lineTo(r,by);c.lineTo(l,by);c.closePath();c.fill();
  {const r=Math.min(W*.17,H*.2);c.save();c.translate(W/2,H*.785);c.scale(1,.36);c.globalAlpha=.85;c.drawImage(bmCanvas(),-r,-r,r*2,r*2);c.restore()}
  const ap=c.createLinearGradient(0,H*.92,0,H);ap.addColorStop(0,'#8a1022');ap.addColorStop(1,'#3a0610');c.fillStyle=ap;c.fillRect(0,H*.92,W,H*.08);
  c.save();c.font=`900 ${Math.round(H*.045)}px "Big Shoulders Display",Impact,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='rgba(245,196,81,.9)';c.fillText((S?S.club+' · Boxe':'FIGHT DYNASTY').toUpperCase(),W/2,H*.962);c.restore();
  const post=(x,col)=>{const g=c.createLinearGradient(x-4,0,x+4,0);g.addColorStop(0,'#2a2f3c');g.addColorStop(.5,'#d8dce4');g.addColorStop(1,'#2a2f3c');c.fillStyle=g;c.fillRect(x-3.5,ty-12,7,by-ty+12);const p=c.createLinearGradient(x-7,0,x+7,0);p.addColorStop(0,shade(col,-.4));p.addColorStop(.5,col);p.addColorStop(1,shade(col,-.4));c.fillStyle=p;c.fillRect(x-6,ty-4,12,by-ty-8)};
  post(l,'#e0213a');post(r,'#3a63e0');
  [['#e0213a',0],['#f5f6fa',.5],['#3a63e0',1]].forEach(([col,k])=>{const y=ty+(by-ty-16)*k;c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=4;c.beginPath();c.moveTo(l,y+2);c.quadraticCurveTo(W/2,y+8,r,y+2);c.stroke();c.strokeStyle=col;c.lineWidth=3;c.beginPath();c.moveTo(l,y);c.quadraticCurveTo(W/2,y+6,r,y);c.stroke();c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=1;c.beginPath();c.moveTo(l,y-1);c.quadraticCurveTo(W/2,y+5,r,y-1);c.stroke()});
}
function vignette(c,W,H){const vg=c.createRadialGradient(W/2,H*.55,H*.25,W/2,H*.55,W*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');c.fillStyle=vg;c.fillRect(0,0,W,H)}
function drawBoxer(c,x,y,h,face,b,glove,v,now){
  const L=b.look||{skin:2,hair:1,hc:0,beard:0,tr:0},sk=SKIN[L.skin],skd=shade(sk,-.26),skl=shade(sk,.16),tr=TRUNK[L.tr]||'#ff3d52',hc=HAIRC[L.hc],u=h;
  const P=(t,d)=>{if(t<0)return 0;const k=(now-t)/d;return k>0&&k<1?Math.sin(k*Math.PI):0};
  const pk=P(v.pt,v.pd),rec=P(v.hit,260),dod=P(v.dodge,300),blk=P(v.block,320);
  let fall=0;if(v.kdT>=0&&now>=v.kdT){const k=now-v.kdT;fall=v.ko?Math.min(1,k/450):k<450?k/450:k<v.kdHold+450?1:k<v.kdHold+850?1-(k-v.kdHold-450)/400:0}
  c.save();c.fillStyle=`rgba(0,0,0,${.42-fall*.12})`;c.beginPath();c.ellipse(x-face*fall*u*.38,y+2,u*(.2+fall*.26),u*.035,0,0,7);c.fill();c.restore();
  const lean=pk*.1-rec*.14-dod*.16;
  c.save();c.translate(x,y);c.scale(face,1);
  if(!fall&&!RM)c.translate(0,Math.sin(now/170+(face>0?0:1.9))*u*.012);
  if(fall)c.rotate(-fall*1.45);
  c.lineCap='round';c.lineJoin='round';
  const shx=.02+lean*.6,shy=-.77,hx=.05+lean*.9-rec*.05,hy=-.915;
  const line=(pts,w,col)=>{c.strokeStyle=col;c.lineWidth=w*u;c.beginPath();c.moveTo(pts[0][0]*u,pts[0][1]*u);for(const p of pts.slice(1))c.lineTo(p[0]*u,p[1]*u);c.stroke()};
  const gl=wh=>{const pp=v.arm===wh?pk:0,g=wh?[.1+lean*.6,-.86-blk*.05]:[.2+lean*.6,-.8-blk*.09],t=v.body?[.4,-.6]:[.47,-.86];return[g[0]+(t[0]-g[0])*pp,g[1]+(t[1]-g[1])*pp]};
  const glv=(p,s)=>{const cx=s[0]+(p[0]-s[0])*.8,cy=s[1]+(p[1]-s[1])*.8;c.fillStyle='#eef1f6';c.beginPath();c.arc(cx*u,cy*u,.04*u,0,7);c.fill();
    const gg=c.createRadialGradient((p[0]-.02)*u,(p[1]-.028)*u,1,p[0]*u,p[1]*u,.075*u);gg.addColorStop(0,shade(glove,.5));gg.addColorStop(.55,glove);gg.addColorStop(1,shade(glove,-.5));c.fillStyle=gg;c.beginPath();c.arc(p[0]*u,p[1]*u,.067*u,0,7);c.fill();if(isPremG(glove)){const T=now||performance.now();c.save();c.beginPath();c.arc(p[0]*u,p[1]*u,.067*u,0,7);c.clip();const sx=((T/6)%(.5*u))-.2*u;const sh=c.createLinearGradient(p[0]*u+sx-.04*u,0,p[0]*u+sx+.04*u,0);sh.addColorStop(0,'rgba(255,255,255,0)');sh.addColorStop(.5,'rgba(255,255,255,.75)');sh.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=sh;c.fillRect(p[0]*u-.1*u,p[1]*u-.1*u,.2*u,.2*u);c.restore();premSpark(c,(p[0]+.03)*u,(p[1]-.04)*u,.03*u,T,p[0]*9)}};
  line([[-.02,-.46],[-.1,-.24],[-.15,-.06]],.08,skd);
  c.fillStyle='#cfd4de';c.fillRect(-.19*u,-.085*u,.07*u,.05*u);c.fillStyle='#14171f';c.fillRect(-.21*u,-.04*u,.1*u,.04*u);
  const s1=[shx-.03,shy+.01],g1=gl(1);line([s1,g1],.06,skd);glv(g1,s1);
  const tg=c.createLinearGradient(-.1*u,0,.13*u,0);tg.addColorStop(0,skd);tg.addColorStop(.55,sk);tg.addColorStop(1,skl);
  c.fillStyle=tg;c.beginPath();c.moveTo(-.085*u,-.47*u);c.quadraticCurveTo(-.115*u,-.62*u,(shx-.1)*u,(shy+.01)*u);c.lineTo((shx+.1)*u,shy*u);c.quadraticCurveTo(.105*u,-.6*u,.08*u,-.47*u);c.closePath();c.fill();
  c.save();c.globalAlpha=.4;c.strokeStyle=shade(sk,-.35);c.lineWidth=.007*u;c.beginPath();c.moveTo((shx-.02)*u,(shy+.09)*u);c.quadraticCurveTo((shx+.03)*u,(shy+.12)*u,(shx+.08)*u,(shy+.09)*u);for(const yy of[-.62,-.565,-.51]){c.moveTo(.005*u,yy*u);c.lineTo(.055*u,(yy+.004)*u)}c.stroke();c.restore();
  const tgr=c.createLinearGradient(0,-.53*u,0,-.36*u);tgr.addColorStop(0,shade(tr,.18));tgr.addColorStop(1,shade(tr,-.35));c.fillStyle=tgr;c.beginPath();c.moveTo(-.105*u,-.53*u);c.lineTo(.095*u,-.53*u);c.lineTo(.115*u,-.36*u);c.lineTo(-.12*u,-.36*u);c.closePath();c.fill();if(isPremT(L.tr)){const T=now||performance.now();c.save();c.clip();const sx=((T/5)%(.5*u))-.25*u;const sh=c.createLinearGradient(sx-.05*u,0,sx+.05*u,0);sh.addColorStop(0,'rgba(255,255,255,0)');sh.addColorStop(.5,'rgba(255,240,180,.7)');sh.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=sh;c.fillRect(-.15*u,-.55*u,.3*u,.2*u);c.fillStyle='#ffd23a';c.fillRect(-.105*u,-.53*u,.2*u,.018*u);c.restore();premSpark(c,.06*u,-.47*u,.025*u,T,1.7)}
  c.fillStyle='rgba(255,255,255,.92)';c.fillRect(-.105*u,-.535*u,.2*u,.026*u);c.fillStyle='#f5c451';c.fillRect(.072*u,-.505*u,.013*u,.145*u);
  line([[.03,-.44],[.1,-.23],[.15,-.06]],.08,sk);
  c.fillStyle='#eef1f6';c.fillRect(.12*u,-.085*u,.07*u,.05*u);c.fillStyle='#14171f';c.fillRect(.11*u,-.04*u,.11*u,.04*u);c.fillStyle='rgba(255,255,255,.3)';c.fillRect(.11*u,-.008*u,.11*u,.008*u);
  line([[shx,shy],[hx-.01,hy+.05]],.066,skd);
  if(L.hair===3){c.fillStyle=hc;c.beginPath();c.arc(hx*u,(hy-.02)*u,.11*u,0,7);c.fill()}
  const hg=c.createRadialGradient((hx+.03)*u,(hy-.035)*u,1,hx*u,hy*u,.095*u);hg.addColorStop(0,skl);hg.addColorStop(1,skd);c.fillStyle=hg;c.beginPath();c.arc(hx*u,hy*u,.086*u,0,7);c.fill();
  if(L.hair&&L.hair!==3){c.save();c.globalAlpha=L.hair===2?.5:L.hair===4?.35:1;c.fillStyle=hc;c.beginPath();c.arc(hx*u,hy*u,.089*u,Math.PI*1.05,Math.PI*1.95);c.fill();c.restore();if(L.hair===4){c.fillStyle=hc;c.fillRect((hx-.02)*u,(hy-.122)*u,.04*u,.06*u)}}
  if(L.beard){c.save();c.globalAlpha=L.beard===1?.4:1;c.fillStyle=hc;c.beginPath();c.arc(hx*u,hy*u,.089*u,Math.PI*.05,Math.PI*.75);c.fill();c.restore()}
  c.strokeStyle=shade(hc,-.2);c.lineWidth=.013*u;c.beginPath();c.moveTo((hx+.028)*u,(hy-.034)*u);c.lineTo((hx+.07)*u,(hy-.03)*u);c.stroke();
  c.fillStyle='#120e0b';c.beginPath();c.arc((hx+.052)*u,(hy-.012)*u,.011*u,0,7);c.fill();
  if(v.cut){c.strokeStyle='#e0142c';c.lineWidth=(.008+.004*v.cut)*u;c.beginPath();c.moveTo((hx+.035)*u,(hy-.05)*u);c.lineTo((hx+.068)*u,(hy-.034)*u);c.stroke();if(v.cut>1){c.fillStyle='rgba(200,10,30,.85)';c.fillRect((hx+.05)*u,(hy-.03)*u,.009*u,(.02+.02*v.cut)*u)}}
  c.fillStyle=glove;c.fillRect((hx+.05)*u,(hy+.032)*u,.03*u,.012*u);
  c.fillStyle=skd;c.beginPath();c.arc((hx-.025)*u,(hy+.005)*u,.018*u,0,7);c.fill();
  const s0=[shx+.03,shy+.02],g0=gl(0);line([s0,g0],.06,sk);glv(g0,s0);
  c.restore();
}
function burst(c,x,y,r,a){c.save();c.globalAlpha=Math.max(0,a);c.strokeStyle='#fff6c8';c.lineWidth=2.2;c.beginPath();for(let i=0;i<8;i++){const t=i*Math.PI/4;c.moveTo(x+Math.cos(t)*r*.35,y+Math.sin(t)*r*.35);c.lineTo(x+Math.cos(t)*r,y+Math.sin(t)*r)}c.stroke();c.fillStyle='#f4c34f';c.beginPath();c.arc(x,y,r*.28,0,7);c.fill();c.restore()}
function txt(c,s,x,y,sz,col){c.save();c.font=`900 ${Math.round(sz)}px "Big Shoulders Display",Impact,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineWidth=Math.max(3,sz*.08);c.strokeStyle='rgba(0,0,0,.75)';c.strokeText(s,x,y);c.fillStyle=col;c.fillText(s,x,y);c.restore()}
const shiftOf=(v,now)=>{const p=(t,d)=>{if(t<0)return 0;const k=(now-t)/d;return k>0&&k<1?Math.sin(k*Math.PI):0};return p(v.pt,v.pd)*.07-p(v.hit,260)*.05-p(v.dodge,300)*.06};
function drawFight(cv,F,now){
  const dpr=Math.min(2,window.devicePixelRatio||1),W=cv.clientWidth,H=cv.clientHeight;if(!W||!H)return;
  if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
  const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);
  c.save();if(!RM&&F.shake&&now-F.shake>0&&now-F.shake<280)c.translate((Math.random()-.5)*8,(Math.random()-.5)*5);
  drawRing(c,W,H,now);
  const h=H*.56,fy=H*.87,cx=W/2,gap=Math.min(W*.3,h*.7),st=s=>s==='agr'?.04:s==='pru'?-.05:0,vA=F.vis.A,vB=F.vis.B,live=F.stage==='live';
  vA.cut=F.A.cut||0;vB.cut=F.B.cut||0;
  const xA=cx-gap/2+(shiftOf(vA,now)+(live?st(F.strat):0))*h,xB=cx+gap/2-(shiftOf(vB,now)+(live&&F.rd?st(F.rd.sb):0))*h;
  const order=vA.pt>vB.pt?[[xB,-1,F.B.b,'#4f80ff',vB],[xA,1,F.A.b,'#ff3d52',vA]]:[[xA,1,F.A.b,'#ff3d52',vA],[xB,-1,F.B.b,'#4f80ff',vB]];
  for(const[x,f,b,g,v]of order)drawBoxer(c,x,fy,h,f,b,g,v,now);
  FX=FX.filter(f=>now-f.t<340);
  for(const f of FX){if(now<f.t)continue;const k=(now-f.t)/340,x=f.who==='A'?xB-.05*h:xA+.05*h,y=fy-(f.body?.6:.88)*h;burst(c,x,y,(f.big?.22:.1)*h*(.6+k*.6),1-k)}
  c.restore();vignette(c,W,H);
  for(const[v,x]of[[vA,xA],[vB,xB]]){if(v.kdT<0||now<v.kdT)continue;const el=now-v.kdT;
    if(v.ko){if(el>400)txt(c,F.koTxt==='TKO'?'T.K.O.':'K.O. !',W/2,H*.24,h*.28,'#ff3d52')}
    else if(el<v.kdHold+450)txt(c,String(Math.min(8,1+Math.floor(el/(v.kdHold/7+1)))),x,fy-h*.5,h*.2,'#ffffff')}
}

/* ================= RENDU ================= */

function premGloves(col){const n=++premN,gold=col==='#ffd23a';
  const g=gold?'<stop offset="0" stop-color="#fff6c8"/><stop offset=".35" stop-color="#f4c542"/><stop offset=".7" stop-color="#a87a08"/><stop offset="1" stop-color="#ffe27a"/>':'<stop offset="0" stop-color="#3a3a3a"/><stop offset=".5" stop-color="#050505"/><stop offset="1" stop-color="#1a1a1a"/>';
  const star=(x,y,d)=>`<path d="M${x} ${y-4}L${x+1} ${y-1}L${x+4} ${y}L${x+1} ${y+1}L${x} ${y+4}L${x-1} ${y+1}L${x-4} ${y}L${x-1} ${y-1}Z" fill="#fff"><animate attributeName="opacity" values="0;1;0" dur="1.6s" begin="${d}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="0 ${x} ${y}" to="90 ${x} ${y}" dur="1.6s" begin="${d}s" repeatCount="indefinite"/></path>`;
  return`<defs><linearGradient id="pgl${n}" x1="0" y1="0" x2="1" y2="1">${g}</linearGradient><linearGradient id="pgs${n}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="pgc${n}"><rect x="5" y="75" width="25" height="27" rx="11"/><rect x="70" y="75" width="25" height="27" rx="11"/></clipPath></defs>
    <rect x="5" y="75" width="25" height="27" rx="11" fill="url(#pgl${n})" stroke="${gold?'#7a5200':'#f4c542'}" stroke-width="1.2"/><rect x="70" y="75" width="25" height="27" rx="11" fill="url(#pgl${n})" stroke="${gold?'#7a5200':'#f4c542'}" stroke-width="1.2"/>
    <g clip-path="url(#pgc${n})"><rect x="-30" y="70" width="18" height="40" fill="url(#pgs${n})" transform="skewX(-20)"><animate attributeName="x" values="-30;120" dur="2.2s" repeatCount="indefinite"/></rect></g>
    ${star(26,78,0)}${star(91,80,.8)}`}

function avatar(b,corner){
  const L=b.look||{skin:2,hair:1,hc:0,beard:0,tr:0},sk=SKIN[L.skin],skd=shade(sk,-.2),hc=HAIRC[L.hc],hcd=shade(hc,-.35);
  const glove=b.glv||(corner==='blue'?'#4f80ff':(S&&S.theme?myCol():'#ff3d52')),cap='M33 41C32 20 68 20 67 41C63 30 37 30 33 41Z';
  let back='',front='',beard='';
  if(L.hair===1)front=`<path d="${cap}" fill="${hc}"/>`;
  else if(L.hair===2)front=`<path d="${cap}" fill="${hc}" opacity=".45"/>`;
  else if(L.hair===3){back=`<circle cx="50" cy="32" r="23" fill="${hc}"/>`;front=`<path d="M33 40C33 23 67 23 67 40C62 31 38 31 33 40Z" fill="${hc}"/>`}
  else if(L.hair===4)front=`<path d="${cap}" fill="${hc}" opacity=".3"/><rect x="45" y="16" width="10" height="18" rx="5" fill="${hc}"/>`;
  else if(L.hair===5)front=`<path d="${cap}" fill="${hc}"/><path d="M40 26v11M46 24v11M52 24v11M58 26v11" stroke="${hcd}" stroke-width="1.6"/>`;
  if(L.beard===1)beard=`<path d="M34 48C36 67 64 67 66 48C62 60 38 60 34 48Z" fill="${hc}" opacity=".35"/>`;
  else if(L.beard===2)beard=`<path d="M34 46C35 70 65 70 66 46C63 58 58 55 50 55C42 55 37 58 34 46Z" fill="${hc}"/>`;
  else if(L.beard===3)beard=`<path d="M44 54Q50 52 56 54L55 58Q50 56 45 58Z" fill="${hc}"/><path d="M46 59C46 66 54 66 54 59Z" fill="${hc}"/>`;
  return`<svg viewBox="0 0 100 100" aria-hidden="true">${back}
  <path d="M10 104C12 80 30 72 50 72C70 72 88 80 90 104Z" fill="${sk}"/>
  <path d="M28 88C40 94 60 94 72 88" stroke="${skd}" stroke-width="1.5" fill="none" opacity=".7"/>
  <rect x="42" y="56" width="16" height="19" rx="5" fill="${skd}"/>
  <ellipse cx="33.5" cy="44" rx="3.6" ry="5.2" fill="${skd}"/><ellipse cx="66.5" cy="44" rx="3.6" ry="5.2" fill="${skd}"/>
  <ellipse cx="50" cy="43" rx="17" ry="20" fill="${sk}"/>${front}
  <path d="M39.5 38.6L46 37.4M54 37.4L60.5 38.6" stroke="${hcd}" stroke-width="2.3" stroke-linecap="round"/>
  <ellipse cx="43.5" cy="43" rx="1.9" ry="1.6" fill="#120e0b"/><ellipse cx="56.5" cy="43" rx="1.9" ry="1.6" fill="#120e0b"/>
  <path d="M50 45L47.4 51.6L51.6 51.6" stroke="${skd}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  ${beard}<path d="M45 57Q50 59 55 57" stroke="${shade(sk,-.45)}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  ${L.scar?'<path d="M58.5 34.5L62.5 41" stroke="#b25858" stroke-width="1.3" stroke-linecap="round"/>':''}
  ${isPremG(glove)?premGloves(glove):`<rect x="5" y="75" width="25" height="27" rx="11" fill="${glove}"/><rect x="70" y="75" width="25" height="27" rx="11" fill="${glove}"/>`}
  <path d="M10 81Q13 78 18 79M75 81Q78 78 83 79" stroke="#fff" stroke-width="1.6" opacity=".35" fill="none" stroke-linecap="round"/>
  <rect x="7" y="95" width="21" height="7" rx="2" fill="#efefef"/><rect x="72" y="95" width="21" height="7" rx="2" fill="#efefef"/></svg>`;
}
const pct=v=>cl(v,0,100);
const tone=v=>v>=80?'hi':v>=65?'mid':'';
const stars=n=>`<span class="stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(5-n)}</span></span>`;
const rec=b=>`${b.w}-${b.l}-${b.d} · ${b.ko} KO`;
function potTxt(b){const c=S.staff.coach;if(!c)return'Pot. ?';const w=Math.max(2,Math.round(15-c.stars*2.5)),h=(parseInt(b.id.slice(1))*7919%100)/100,lo=Math.round(cl(b.pot-w*h,ovr(b),99));return`Pot. ${lo}–${Math.min(99,lo+w)}`}
function traitChips(b,max){return b.traits.slice(0,max||9).map(k=>`<span class="chip ${TRAITS[k].g?'good':'bad'}">${TRAITS[k].n}</span>`).join('')}

function alerts(){
  const out=[];
  for(const b of club()){
    if(b.mine&&!b.booked&&!b.retired&&inactiveWeeks(b)>=INACTIVE_MAX-2)out.push({bad:1,t:`<b>${esc(b.name)}</b> : ${inactiveWeeks(b)} sem. sans combat (max ${INACTIVE_MAX}).`,btn:`<button class="btn sm gold" data-a="book" data-id="${b.id}">Réserver</button>`});
    if(b.inj&&b.booked){const f=upF(b);if(f)out.push({bad:1,t:`<b>${esc(b.name)}</b> est blessé pendant son camp (${b.inj} sem.).`,btn:`<button class="btn sm gold" data-a="opencamp" data-id="${f.id}">Gérer</button>`})}
    if(b.raiseAsk)out.push({bad:1,t:`<b>${esc(b.name)}</b> réclame une augmentation : ${$(b.salary)} → ${$(b.raiseAsk)}/sem.`,btn:`<button class="btn sm gold" data-a="raiseok" data-id="${b.id}">Accepter</button><button class="btn sm" data-a="raiseno" data-id="${b.id}">Refuser</button>`});
    if(b.contract<=8)out.push({bad:1,t:`Contrat de <b>${esc(b.name)}</b> : ${b.contract} sem. restantes.`,btn:`<button class="btn sm gold" data-a="neg" data-id="${b.id}">Négocier</button>`});
    if(b.gate)out.push({t:`<b>${esc(b.name)}</b> doit réussir l’épreuve du niveau ${b.lvl} pour continuer à progresser.`,btn:`<button class="btn sm gold" data-a="open" data-id="${b.id}" data-k="defis">Voir</button>`});
    if(b.trOpt)out.push({t:`<b>${esc(b.name)}</b> peut apprendre un nouveau trait !`,btn:`<button class="btn sm gold" data-a="open" data-id="${b.id}" data-k="defis">Choisir</button>`});
    if(canSpend(b))out.push({t:`<b>${esc(b.name)}</b> a ${b.sp} point${b.sp>1?'s':''} de stats à dépenser.`,btn:`<button class="btn sm gold" data-a="open" data-id="${b.id}" data-k="stats">Améliorer</button>`});
    if(b.champ&&!b.booked&&S.t-b.lastFight>18)out.push({bad:1,t:`Défense de titre obligatoire pour <b>${esc(b.name)}</b> d’ici ${26-(S.t-b.lastFight)} sem.`,btn:`<button class="btn sm" data-a="book" data-id="${b.id}">Réserver</button>`});
  }
  for(const[key,m]of Object.entries(S.mand||{})){const b=getB(m.ch),o=getB(m.op);if(b&&o)out.unshift({bad:1,t:`📜 Combat obligatoire <b>${m.k}</b> : ${esc(sur(b))} doit affronter ${esc(o.name)} d’ici ${Math.max(0,m.until-S.t)} sem., sinon il perd la ceinture.`,btn:`<button class="btn sm gold" data-a="mand" data-k="${key}">Signer</button>`})}
  for(const o of S.sOff||[]){const b=getB(o.b);if(b)out.push({t:`🤝 <b>${esc(o.brand)}</b> (${esc(o.cat)}) veut commanditer ${esc(sur(b))} : ${moneyS(o.pay)}/sem. pendant ${o.weeks} sem. · objectif : ${SGOAL[o.gk].n(o.g)} · bonus ${moneyS(o.bonus)}`,btn:`<button class="btn sm gold" data-a="sok" data-id="${o.id}">Signer</button><button class="btn sm" data-a="sno" data-id="${o.id}">Non</button>`})}
  if(S.ss&&(S.ss.inv||[]).length)out.unshift({bad:1,t:`📩 Invitation à la <b>${esc(S.ss.n)}</b> pour ${S.ss.inv.map(id=>esc(sur(getB(id)||{name:'?'}))).join(', ')}. Accepte ou refuse.`,btn:`<button class="btn sm gold" data-a="tab" data-k="defis">Voir</button>`});
  if(S.cvc&&!S.cvc.acc){const p=(S.promos||[]).find(x=>x.id===S.cvc.pid);out.unshift({bad:1,t:`⚔️ <b>${esc(p?p.n:'Un rival')}</b> te défie : Club contre Club, 3 combats, ${$(S.cvc.pot)} au gagnant (le perdant paie la moitié).`,btn:`<button class="btn sm gold" data-a="cvcok">Accepter</button><button class="btn sm" data-a="cvcno">Refuser</button>`})}
  if(myPromos().length<PRMAX-1)for(const p of promoAlive())if(p.sale)out.unshift({bad:1,t:`💥 <b>${esc(p.n)}</b> a fait faillite ! ${prBoxers(p).length} boxeurs à racheter pour ${$(p.sale.price)} (encore ${p.sale.until-S.t} sem.).`,btn:`<button class="btn sm gold" data-a="openpromo" data-id="${p.id}">Voir</button>`});
  if(S.offers&&S.offers.length)out.push({t:`${S.offers.length} offre${S.offers.length>1?'s':''} de combat en attente.`,btn:`<button class="btn sm gold" data-a="gooff">Voir</button>`});
  if(false)out.push({t:`Tu as ${S.mgr.pts} point${S.mgr.pts>1?'s':''} d’atout de gérant.`,btn:`<button class="btn sm gold" data-a="tab" data-k="club">Utiliser</button>`});
  return out;
}
const ICONS={
 ecurie:'<path d="M7 11V7.5a4 4 0 0 1 8 0V8h1.5A2.5 2.5 0 0 1 19 10.5V13a5 5 0 0 1-5 5H9.5A2.5 2.5 0 0 1 7 15.5z"/><path d="M9 21h7"/>',
 combats:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9.5h18M3 14h18"/>',
 defis:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>',
 staff:'<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 20a5 5 0 0 1 5.5-4.6"/>',
 club:'<path d="M4 20V9l8-5 8 5v11"/><path d="M9.5 20v-6h5v6"/>',
 rank:'<path d="M5 20V12M12 20V5M19 20v-9"/><path d="M3 20h18"/>'};
function renderChrome(){
  const q=S.queue.length;
  document.getElementById('hdr').innerHTML=`<div class="hrow"><span class="mark">${esc(initials(S.club))}</span>
    <div class="club"><b>${esc(S.club)}</b><span>${flag(S.home)} An ${Math.floor((S.t-1)/52)+1} · S${((S.t-1)%52)+1} · Niv ${S.mgr.lvl}</span></div>
    <div class="cash"><small>Caisse</small><b class="${S.money<0?'neg':''}">${moneyS(S.money)}</b></div>
    <button class="gear" data-a="settings" aria-label="Réglages"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg></button>
    <button class="next ${q||S.event?'fight':''}" data-a="next">${S.event?'Événement':q?'Combat !':'Semaine ▸'}</button></div>`;
  const nA=alerts().length;
  document.getElementById('tabs').innerHTML=`<div class="in">${[['ecurie','Écurie'],['combats','Combats'],['rank','Rangs'],['defis','Tournois'],['staff','Staff'],['club','Club']].map(([k,n])=>
    `<button data-a="tab" data-k="${k}" aria-current="${ui.tab===k}"><svg viewBox="0 0 24 24">${ICONS[k]}</svg>${n}${k==='ecurie'&&nA?`<span class="badge">${nA}</span>`:''}${k==='combats'&&S.offers&&S.offers.length?`<span class="badge">${S.offers.length}</span>`:''}</button>`).join('')}</div>`;
}
const FOLCAP=5e8;
function fol(b){if(b.fol==null){const h=((parseInt(String(b.id).replace(/\D/g,''))||1)*2654435761%1000)/1000;b.fol=Math.round(150*Math.pow(1.09,b.fame||1)*(.75+h*.5))}return b.fol}
function addFol(b,n){const v=fol(b);b.fol=Math.round(cl(v+n,0,FOLCAP));return b.fol-v}
const folEco=f=>f<=2e6?f:2e6+Math.sqrt(f-2e6)*1414;
function folWeek(b){const v=fol(b);if(S.t-b.lastFight<=8)addFol(b,v*.003+20);else if(S.t-b.lastFight>12)addFol(b,-v*.002);const tg=cl(Math.log10(Math.max(10,fol(b)))*14-30,1,100);b.fame=cl(b.fame+(tg-b.fame)*.05,1,100)}
const fmtK=n=>n>=1e6?(n/1e6).toFixed(1).replace('.',',')+' M':n>=1e3?(n/1e3).toFixed(n>=1e4?0:1).replace('.',',')+' k':String(n);
const POSTS={train:{ic:'🎥',n:'Vidéo d’entraînement',d:'Des abonnés, sans risque.'},trash:{ic:'🔥',n:'Provocation',d:'Beaucoup d’abonnés, risque d’amende.'},vlog:{ic:'🤝',n:'Coulisses du club',d:'Des abonnés et + loyauté.'}};
function doPost(b,k){if(!b||b.post===S.t)return;const sm=has(b,'showman')?1.5:1,v=fol(b);b.post=S.t;let x='',g=0;
  if(k==='train')g=addFol(b,(v*.015+300)*sm);else if(k==='vlog'){g=addFol(b,(v*.01+200)*sm);b.loy=cl(b.loy+3,0,100)}else{g=addFol(b,(v*.03+600)*sm);b.morale=cl(b.morale+3,0,100);if(R()<.25){S.money-=1500;x=' La commission inflige 1 500 $ d’amende.'}}
  b.fame=cl(b.fame+.5,1,100);log(`${b.name} publie : +${fmtK(g)} abonnés.${x}`,x?'bad':'good');toast(`👥 +${fmtK(g)} abonnés`)}
function rkCmp(me,o){const lb=x=>x.champ?'Champion':'#'+(rankIdx(x)+1),a=me.champ?-1:rankIdx(me),b=o.champ?-1:rankIdx(o),better=b<a;
  return`<span class="chip ${better?'good':'bad'}">${better?'▲':'▼'} Lui ${lb(o)} · Toi ${lb(me)}</span>`}
function rankTable(me,o){const rows=[['Mondial',x=>x.champ?0:rankIdx(x)+1]];if(me.nat===o.nat)rows.push([flag(me.nat)+' '+NAT[me.nat].n,x=>x.nchamp?0:natIdx(x)+1]);for(const k of BELTS)rows.push([k,x=>beltsOf(x).includes(k)?0:bodyIdx(x,k)+1]);
  return`<div class="panel"><span class="lab">Classements</span><p class="small" style="margin:4px 0 6px"><b style="color:var(--green)">Vert</b> : il est mieux classé que toi (le battre te fait monter). <b style="color:#ff7b8b">Rouge</b> : tu es mieux classé.</p>
  <table class="cmp rk"><thead><tr><th></th><th style="color:var(--red)">${esc(sur(me))}</th><th style="color:var(--blue)">${esc(sur(o))}</th></tr></thead><tbody>${rows.map(([n,f])=>{const a=f(me),b=f(o),bt=b<a;return`<tr><td>${n}</td><td class="num">${a?'#'+a:'👑'}</td><td class="num ${bt?'up':'dn'}">${b?'#'+b:'👑'} ${bt?'▲':'▼'}</td></tr>`}).join('')}</tbody></table></div>`}
function myRanks(me){return`<div class="panel" style="margin-bottom:10px"><span class="lab">Classements de ${esc(sur(me))}</span><div class="chips" style="margin-top:8px"><span class="chip">Monde ${me.champ?'Champion':'#'+(rankIdx(me)+1)}</span><span class="chip">${flag(me.nat)} ${natLabel(me)}</span>${BELTS.map(k=>`<span class="chip">${k} ${beltsOf(me).includes(k)?'👑':'#'+(bodyIdx(me,k)+1)}</span>`).join('')}</div></div>`}
const segG=n=>`class="seg segg" style="--c:${n<=5?n:Math.ceil(n/2)}"`;
const segH=(act,items,cur)=>`<div ${segG(items.length)}>${items.map(([k,n])=>`<button data-a="${act}" data-k="${k}" aria-pressed="${cur===k}">${n}</button>`).join('')}</div>`;
const upF=b=>S.fights.find(x=>x.a===b.id);
const ftag=(f,a)=>`${f.title?titleTxt(f.title):f.ntitle?'Titre national '+flag(a.nat):'Combat'} · ${divN(a.div)} · ${f.rounds} rounds`;
const natChip=b=>{const i=natIdx(b);return`<span class="chip ${b.nchamp?'gold':''}">${flag(b.nat)} ${b.nchamp?'Champion national':i>=0?'#'+(i+1)+' '+NAT[b.nat].n:NAT[b.nat].n}</span>`};
const champRank=b=>(isUndisp(b)?100:0)+beltsOf(b).length*10;
const sortB=l=>[...l].sort((a,b)=>(champRank(b)-champRank(a))||(ovr(b)-ovr(a)));
const moneyS=n=>{const a=Math.abs(n),sg=n<0?'−':'';return a>=1e9?sg+(a/1e9).toFixed(1).replace('.',',')+' G$':a>=1e6?sg+(a/1e6).toFixed(1).replace('.',',')+' M$':$(n)}; // B19 : montant exact sous le million
const worldChip=b=>b.champ?beltChips(b,38):`<span class="chip">Monde ${rankLabel(b)}</span>`;
function statusChips(b){const f=upF(b);return`${b.inj?`<span class="chip red">Blessé ${b.inj} sem.</span>`:''}${f?`<span class="chip blue">Combat ${f.week-S.t?`dans ${f.week-S.t} sem.`:'ce soir'}</span>`:''}${b.gate?'<span class="chip gold">Épreuve</span>':''}${b.sp?`<span class="chip gold">+${b.sp} pts</span>`:''}${b.trOpt?'<span class="chip gold">Trait</span>':''}`}
const condList=b=>[['Forme',100-b.fatigue,b.fatigue>65?'warn':'green'],['Moral',b.morale,b.morale<40?'red':'green'],['Loyauté',b.loy,b.loy<30?'red':'gold']];
const condBars=b=>condList(b).map(([l,v,c])=>`<div><small><span>${l}</span><span class="num">${Math.round(v)}</span></small><div class="trk ${c}"><i style="width:${pct(v)}%"></i></div></div>`).join('');
const AGEPH=[[21,'Espoir','age1','Progresse très vite : XP d’entraînement ×1,3 et il mûrit chaque année.'],[26,'En montée','age2','Encore en progression : XP ×1,1. Il approche de son meilleur niveau.'],[31,'Prime','age3','Au sommet de sa carrière. Il gagne en expérience (défense) chaque année.'],[34,'Vétéran','age4','Le corps ralentit : vitesse, cardio et menton baissent chaque année. XP ×0,6.'],[99,'Déclin','age5','Fin de carrière : grosse perte annuelle, récupération plus lente, blessures plus fréquentes.']];
const agePh=b=>AGEPH.find(p=>b.age<=p[0]);
const ageChip=b=>{const p=agePh(b);return`<span class="chip ${p[2]}">⏳ ${b.age} ans · ${p[1]}</span>`};
const ageXp=b=>b.age<23?1.3:b.age<27?1.1:b.age<30?.85:b.age<33?.6:.35;
const RET_AGE=37;
function agePanel(b){const p=agePh(b),x=cl((b.age-17)/20*100,0,100),prime=Math.max(0,31-Math.max(b.age,27)+(b.age<27?0:1)),la=b.agel;
  const fmtd=d=>Object.entries(d).filter(([,v])=>Math.abs(v)>=.5).map(([k,v])=>`${(STATS.find(s=>s[0]===k)||[,k])[1]} ${v>0?'+':'−'}${Math.abs(v).toFixed(0)}`).join(' · ');
  return`<div class="panel"><div class="ph"><span class="lab">Âge & vieillissement</span>${ageChip(b)}</div>
  <div class="agebar"><i style="left:${x}%"></i></div><div class="agelab"><span>17</span><span>Espoir</span><span>Montée</span><span>Prime</span><span>Vétéran</span><span>${RET_AGE}</span></div>
  <p class="small" style="margin:8px 0 6px">${p[3]}</p>
  <div class="s4" style="margin-top:6px">${[[`×${ageXp(b).toString().replace('.',',')}`,'XP entraînement'],[b.age<27?`${27-b.age} an${27-b.age>1?'s':''}`:b.age<=31?`${31-b.age+1} an${31-b.age+1>1?'s':''}`:'Passé',b.age<27?'avant la prime':'de prime restant'],[b.age>=31?`−${Math.round((b.age-30)*1.1)}`:'0','perte/an estimée'],[b.mine?`${Math.max(0,RET_AGE-b.age)} an${RET_AGE-b.age>1?'s':''}`:'–','avant retraite']].map(([v,l])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')}</div>
  ${la&&la.d&&fmtd(la.d)?`<p class="small" style="margin:8px 0 0">Dernier anniversaire (${la.a} ans) : ${fmtd(la.d)}</p>`:''}</div>`}
function boxRow(b,act){
  return`<button class="rowc ${tcls(b)}" data-a="${act||'open'}" data-id="${b.id}"><div class="av">${avatar(b,b.mine?'red':'blue')}</div>
    <div class="rc-m"><div class="nm">${b.mine?'':flag(b.nat)+' '}${esc(b.name)}</div>
      <div class="meta">${b.mine?flag(b.nat)+' ':''}${divN(b.div)} · <span class="${agePh(b)[2]}" style="font-weight:800">${b.age} ans</span> · ${b.w}-${b.l}-${b.d}${b.mine?` · Niv ${b.lvl}`:` · ${STYLES[b.style]}`}</div>
      <div class="chips s">${worldChip(b)}<span class="chip pop">👥 ${fmtK(fol(b))}</span>${b.mine&&b.brand&&ui.tab!=='ecurie'?prChip(b):''}${b.mine?natChip(b)+statusChips(b):b.fa?`<span class="chip">${$(b.salary)}/sem.</span>${b.age<22?'<span class="chip gold">Espoir</span>':''}`:''}</div>
      ${b.mine?`<div class="mini3">${condList(b).map(([,v,c])=>`<div class="trk ${c}"><i style="width:${pct(v)}%"></i></div>`).join('')}</div>`:''}</div>
    <div class="ovr"><b>${ovr(b)}</b><small>NOTE</small></div></button>`;
}
function heroC(b,corner){return`<div class="hero c ${tcls(b)}"><div class="av md">${avatar(b,corner)}</div><div style="min-width:0;flex:1"><span class="tier-tag">${tierOf(b)[2]} · ${STYLES[b.style]}${b.mine?' · Niv '+b.lvl:''}</span><div class="nm">${esc(b.name)}</div>${b.nick?`<div class="nick">« ${b.nick} »</div>`:''}
  <div class="sub">${flag(b.nat)} ${esc(b.city)} · ${divN(b.div)} · ${b.age} ans · ${b.w}-${b.l}-${b.d} (${b.ko} KO)</div><div class="chips s">${b.champ?'':worldChip(b)}${natChip(b)}${ageChip(b)}${prChip(b)}${S.boxers.includes(b)?mdChip(b):''}${b.longI&&b.inj?`<span class="chip red">🚑 ${b.longI}</span>`:''}${b.comeback&&!b.inj?'<span class="chip gold">🔥 Retour</span>':''}<span class="chip pop">👥 ${fmtK(fol(b))} abonnés</span></div>${b.champ?`<div class="blts lg">${beltsOf(b).map(k=>beltSvg(k,44)).join('')}${isUndisp(b)?undBadge:''}</div>`:''}</div><div class="ovr"><b>${ovr(b)}</b><small>NOTE</small></div></div>`}
function statsPanel(b,sp){const capv=capOf(b);return`<div class="panel"><div class="ph"><span class="lab">Statistiques</span>${sp&&b.sp?`<span class="row" style="gap:6px"><b class="num" style="color:var(--gold)">${b.sp} pts</b><button class="btn sm gold" data-a="auto" data-id="${b.id}">Auto</button></span>`:''}</div>
  ${STATS.map(([k,n])=>{const v=Math.floor(b[k]),c=statCost(b,k),can=sp&&b.sp>=c&&v+1<=capv;return`<div class="sr ${sp?'':'ns'}"><span>${n}</span><div class="trk ${k==='chin'?'gold':''}"><i style="width:${v}%"></i>${sp?`<span class="cap" style="left:${capv}%"></span>`:''}</div><b class="${tone(v)}">${v}</b>${sp?`<button class="btn sm ${can?'gold':''}" data-a="spend" data-id="${b.id}" data-k="${k}" ${can?'':'disabled'}>+1 · ${c}</button>`:''}</div>`}).join('')}
  ${sp?`<p class="small" style="margin:6px 0 0">Limite ${capv} par stat (selon le potentiel). Au-delà de 70, puis 85, chaque point coûte plus cher.</p>`:''}</div>`}
const traitList=b=>b.traits.map(k=>`<div class="trait ${TRAITS[k].g?'pos':'neg'}"><b>${TRAITS[k].n}</b><span>${TRAITS[k].d}</span></div>`).join('')||'<p class="small" style="margin:0">Aucun trait. Un nouveau trait se débloque tous les 5 niveaux.</p>';
const histList=b=>(b.hist||[]).length?`<ul class="log">${b.hist.slice(0,8).map(h=>`<li>${h.cb?`<span class="small" style="float:right">📊 ${h.cb[0]}/${h.cb[1]}</span>`:''}<span class="chip ${h.res==='V'?'good':h.res==='D'?'bad':''}">${h.res}</span> ${h.m}${h.m!=='DEC'?' R'+h.r:''} contre ${esc(h.opp)}${h.title?' · titre':''} <span class="small">${when(h.t)}</span></li>`).join('')}</ul>`:'<p class="small" style="margin:0">Aucun combat connu.</p>';
function fightMini(f){const a=getB(f.a),b=getB(f.b);if(!a||!b)return'';const prep=f.prep??10;
  return`<button class="panel fm" data-a="opencamp" data-id="${f.id}">
    <div class="row" style="justify-content:space-between"><span class="chip ${f.title||f.ntitle?'gold':''}">${ftag(f,a)}</span><span class="small">${f.week===S.t?'Ce soir':`Dans ${f.week-S.t} sem.`}</span></div>
    <div class="fmr"><div class="av sm ${tcls(a)}">${avatar(a,'red')}</div><div class="fmn"><b>${flag(a.nat)} ${esc(sur(a))}</b><span class="vs">VS</span><b>${flag(b.nat)} ${esc(sur(b))}</b></div><div class="av sm ${tcls(b)}">${avatar(b,'blue')}</div></div>
    <div class="row" style="gap:10px;flex-wrap:nowrap"><span class="small">Prépa</span><div class="trk gold" style="flex:1;height:6px"><i style="width:${prep}%"></i></div><b class="num">${prep} %</b>${S.set.odds?`<span class="small" style="flex:none">Jour J</span>`+pill(matchOdds(a,b,f.rounds,projF(f)).w):''}</div>
    ${a.inj?`<div class="small" style="color:#ff7b8b;font-weight:700">⚠ ${esc(sur(a))} est blessé : reporte ou annule le combat.</div>`:!f.gp?'<div class="small" style="color:var(--gold);font-weight:700">Aucun plan de match choisi</div>':''}
    <span class="small" style="color:var(--gold);font-weight:800">Gérer le camp ›</span></button>`}
function scoutNote(o){const c=S.staff.coach;if(!c)return'<p class="small" style="margin:0">Sans entraîneur-chef, pas de vrai rapport. Engage-en un dans l’onglet Staff.</p>';
  const st=STATS.map(([k,n])=>[n,Math.floor(o[k])]).sort((x,y)=>y[1]-x[1]),g=bestGP(o.style);
  return`<div class="tgrid"><div class="trait pos"><b>Point fort : ${st[0][0]} (${st[0][1]})</b><span>${c.stars>=3?`Aussi : ${st[1][0]} (${st[1][1]})`:'À surveiller.'}</span></div>
    ${c.stars>=2?`<div class="trait neg"><b>Point faible : ${st[4][0]} (${st[4][1]})</b><span>À exploiter pendant le combat.</span></div>`:''}
    <div class="trait"><b>Style : ${STYLES[o.style]}</b><span>${STYD[o.style]}</span></div>
    ${g?`<div class="trait pos"><b>Plan conseillé : ${GP[g].n}</b><span>${GP[g].d}</span></div>`:''}</div>`}
const tapeRow=(n,x,y)=>`<div class="tr"><b class="${x>y?'hi':''}">${x}</b><div class="tb l"><i style="width:${pct(x)}%"></i></div><span>${n}</span><div class="tb r"><i style="width:${pct(y)}%"></i></div><b class="${y>x?'hi':''}">${y}</b></div>`;
const tapeBox=(a,b)=>`<div class="panel tape">${tapeRow('Note',ovr(a),ovr(b))}${STATS.map(([k,n])=>tapeRow(n,Math.floor(a[k]),Math.floor(b[k]))).join('')}${tapeRow('Forme',Math.round(100-a.fatigue),Math.round(100-b.fatigue))}</div>`;

function vMyClub(){const L=sortB(club()),R=prRec(L),bl=L.reduce((a,b)=>a+beltsOf(b).length,0),sc=prScore(null,L),rk=promoAlive().map(x=>prScore(x)).filter(v=>v>sc).length+1,MP=myPromos();
  const val=Math.round(L.reduce((s,b)=>s+buyPrice(b),0)*.3/1000)*1000;
  return`<div class="in"><button class="back" data-a="close">← Retour</button>
  <div class="panel" style="border-color:rgba(255,59,80,.5)"><span class="lab">Ton club · #${rk} des promotions</span><h2 style="margin:4px 0 2px;overflow-wrap:anywhere">${esc(S.club)}</h2><div class="small">${flag(S.home)} ${NAT[S.home].n} · ${L.length} boxeurs · ${bl} ceinture${bl>1?'s':''} mondiale${bl>1?'s':''} · fondé ${when(1)}</div><div class="vsme"><span>🥊 Fiche du club depuis la fondation</span><b>${recTxt()}</b></div>
    <div class="s4" style="margin-top:12px">${[[sc,'Points'],[moneyS(val),'Valeur'],[moneyS(S.money),'Caisse'],[L.filter(b=>b.champ).length,'Champions']].map(([v,l])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')}</div></div>
  <div class="panel"><span class="lab">Promoteur</span><div class="row" style="gap:12px;margin-top:8px;flex-wrap:nowrap;align-items:center"><div class="crest" style="width:54px;height:60px;font-size:18px">${esc(initials(S.mgrName))}</div><div style="min-width:0"><b>${flag(S.home)} ${esc(S.mgrName)}</b><div class="small">C’est toi ! Gérant niveau ${S.mgr.lvl}</div><div class="small">${Object.entries(S.mgr.perks).filter(([,v])=>v).map(([k,v])=>`${PERKS[k].n} ${v}`).join(' · ')||'Aucun atout encore'}</div></div></div>
    <div class="s4" style="margin-top:12px">${[[`${R.w}-${R.l}-${R.d}`,'Fiche de l’écurie'],[R.ko,'KO'],[L.filter(b=>b.nchamp).length,'Champ. nationaux'],[L.length?Math.round(L.reduce((s,b)=>s+ovr(b),0)/L.length):0,'Note moyenne']].map(([v,l])=>`<div><b style="font-size:15px">${v}</b><small>${l}</small></div>`).join('')}</div></div>
  ${MP.length?`<div class="panel"><span class="lab">Tes autres promotions</span><div class="list" style="margin-top:8px">${MP.map(p=>`<button class="rowc" data-a="openpromo" data-id="${p.id}"><div class="av" style="display:grid;place-items:center;font-size:24px">🏢</div><div class="rc-m"><div class="nm">${esc(p.n)}</div><div class="meta">${prBoxers(p).length} boxeurs · profit ${(()=>{const v=p.lastNet!=null?p.lastNet:prNet(p);return(v>=0?'+':'−')+moneyS(Math.abs(v))})()}/sem.</div></div><div class="ovr"><b style="font-size:18px">${prScore(p)}</b><small>POINTS</small></div></button>`).join('')}</div></div>`:''}
  <span class="lab">Boxeurs de ${esc(S.club)} · champions puis note</span><div class="list">${L.map(b=>boxRow(b)).join('')}</div></div>`}
function vPromo(p){const L=sortB(prBoxers(p)),sc=prScore(p,L),rk=promoAlive().map(x=>prScore(x)).filter(v=>v>sc).length+1,bl=L.reduce((a,b)=>a+beltsOf(b).length,0),full=club().length>=rosterCap(),n=myPromos().length;
  const hp=p.own?null:Math.max(0,Math.min(100,Math.round(p.cash/1e4)));
  const head=`<div class="panel" style="border-color:${p.c}"><div class="row" style="justify-content:space-between;align-items:flex-start;gap:10px"><div style="min-width:0"><span class="lab">Promotion · #${rk}</span><h2 style="margin:4px 0 2px;overflow-wrap:anywhere">${esc(p.n)}</h2><div class="small">${flag(p.nat)} ${NAT[p.nat].n} · ${L.length} boxeurs · ${bl} ceinture${bl>1?'s':''} mondiale${bl>1?'s':''}</div></div>${p.own?'<span class="chip gold">👑 À toi</span>':p.sale?'<span class="chip bad">💥 Faillite</span>':''}</div>
    <div class="s4" style="margin-top:12px">${[[sc,'Points'],[moneyS(prValue(p,L)),'Valeur'],[p.own?(()=>{const v=p.lastNet!=null?p.lastNet:prNet(p,L);return(v>=0?'+':'−')+(Math.abs(v)>=1e5?moneyS(Math.abs(v)):Math.round(Math.abs(v)/1000)+' k$')})():moneyS(Math.max(0,p.cash)),p.own?'Profit / sem.':'Caisse'],[L.filter(b=>b.champ).length,'Champions']].map(([v,l])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')}</div>
    ${hp!=null&&!p.sale?`<div style="margin-top:10px"><small class="small">Santé financière${p.neg?` · <b style="color:#ff7b8b">dans le rouge depuis ${p.neg} sem.</b>`:''}</small><div class="trk ${hp<20?'red':hp<45?'warn':'green'}" style="margin-top:4px"><i style="width:${Math.max(3,hp)}%"></i></div></div>`:''}</div>`;
  const goBtn=p.own?`<button class="btn pri big" data-a="gobrand" data-id="${p.id}">🥊 Gérer ses boxeurs</button>`:'';
  const act=p.sale?`<div class="panel" style="border-color:rgba(255,123,139,.5)"><span class="lab">💥 À vendre · encore ${p.sale.until-S.t} sem.</span><p class="small" style="margin:6px 0 10px">Rachète ${esc(p.n)} et ses ${L.length} boxeurs. Ils restent dans leur promotion, mais tu touches les profits chaque semaine et une part de chacun de leurs combats. Tu peux aussi faire passer n’importe lequel dans ton écurie, gratuitement.</p>
      ${n>=PRMAX-1?`<p class="small" style="color:var(--warn);margin:0 0 8px">Tu as déjà ${PRMAX} promotions (ton club + ${PRMAX-1}). Revends-en une pour racheter celle-ci.</p>`:''}<button class="btn gold big" data-a="buypromo" data-id="${p.id}" ${S.money<p.sale.price||n>=PRMAX-1?'disabled':''}>🏢 Racheter pour ${$(p.sale.price)}</button><p class="small" style="margin:6px 0 0">Profit estimé : ${(prNet(p,L)>=0?'+':'')+$(prNet(p,L))}/sem. + 15 % des bourses de ses victoires.</p></div>`
    :p.own?`<div class="panel"><span class="lab">👑 Ta promotion</span><p class="small" style="margin:6px 0 10px">Ses boxeurs sont à toi : dans l’<b>Écurie</b>, choisis « 🏢 ${esc(p.n)} » en haut pour les gérer, les entraîner et leur réserver des combats, comme ton club. Tu touches ses profits (${(prNet(p,L)>=0?'+':'')+$(prNet(p,L))}/sem.) et 15 % des bourses de ses victoires. « Faire passer dans mon écurie » amène un boxeur dans ton club principal${full?' (écurie pleine pour l’instant)':''}.</p><button class="btn danger" data-a="sellpromo" data-id="${p.id}">${ui.confirm==='sp'+p.id?'Confirmer la vente':'Revendre · '+$(Math.round(prValue(p,L)*.45/1000)*1000)}</button></div>`:'';
  const rows=L.map(b=>p.own?`<div class="pkw prw">${boxRow(b,'open')}<button class="pki" data-a="prmove" data-id="${b.id}" ${full?'disabled':''}>➜ Faire passer dans mon écurie</button></div>`:boxRow(b,'scout')).join('');
  const B=prBoss(p),R=prRec(L),boss=`<div class="panel"><span class="lab">Promoteur</span><div class="row" style="gap:12px;margin-top:8px;flex-wrap:nowrap;align-items:center"><div class="crest" style="width:54px;height:60px;font-size:18px;background:linear-gradient(180deg,#fff,${p.c})">${esc(initials(B.name))}</div><div style="min-width:0"><b>${flag(B.nat)} ${esc(p.own?S.mgrName:B.name)}</b><div class="small">${p.own?'C’est toi !':`${B.age} ans · promoteur depuis ${B.since}`}</div><div class="small">${p.own?'':`<b>${PRSTY[B.sty][0]}</b> · ${PRSTY[B.sty][1]}`}</div></div><span class="chip gold" style="margin-left:auto;flex:none">${'★'.repeat(B.rep)}</span></div>
    <div class="s4" style="margin-top:12px">${[[`${R.w}-${R.l}-${R.d}`,'Fiche de l’écurie'],[R.ko,'KO'],[L.filter(b=>b.nchamp).length,'Champ. nationaux'],[L.length?Math.round(L.reduce((s,b)=>s+ovr(b),0)/L.length):0,'Note moyenne']].map(([v,l])=>`<div><b style="font-size:15px">${v}</b><small>${l}</small></div>`).join('')}</div>
    ${p.own?'':`<div class="vsme"><span>⚔️ Toi contre ${esc(p.n)}</span><b>${(()=>{const v=p.vsMe||{w:0,l:0,d:0};return`<i class="g">${v.w}V</i> <i class="r">${v.l}D</i> <i>${v.d}N</i>`})()}</b></div>`}</div>`;
  return`<div class="in"><button class="back" data-a="close">← Retour</button>${head}${boss}${goBtn}${act}<span class="lab">Boxeurs de ${esc(p.n)} · champions puis note</span><div class="list">${rows||'<div class="panel small">Aucun boxeur.</div>'}</div></div>`}
/* --- écurie --- */
const ALK=[[/commanditer/,'🤝','Commanditaires'],[/obligatoire/,'📜','Combats obligatoires'],[/Club contre Club/,'⚔️','Défis de rivaux'],[/Super Série/,'📩','Invitations'],[/points de stats/,'⬆️','Points de stats'],[/trait/,'✨','Nouveaux traits'],[/épreuve/,'🏅','Épreuves'],[/Contrat de/,'📝','Contrats'],[/augmentation/,'💰','Augmentations'],[/blessé/,'🩹','Blessures'],[/Défense de titre/,'🏆','Défenses obligatoires'],[/faillite/,'💥','Faillites'],[/offre/,'📨','Offres']];
const alKind=a=>ALK.find(k=>k[0].test(a.t.replace(/<[^>]+>/g,'')))||[null,'•','Autres'];
function todoBar(al){if(!al.length)return'';const g={};for(const a of al){const k=alKind(a);g[k[1]]=(g[k[1]]||0)+1}const urg=al.filter(a=>a.bad).length,sp=club().filter(canSpend).length;
  return`<div class="tbar"><button class="tmain ${urg?'urg':''}" data-a="todolist"><span class="tn">${al.length}</span><span class="tl">${urg?'urgent'+(urg>1?'s':'')+' · ':''}à faire</span><span class="tic">${Object.entries(g).map(([ic,n])=>`${ic}${n>1?n:''}`).join(' ')}</span><span class="tgo">›</span></button>${sp?`<button class="btn gold tqa" data-a="spall">⚡ Points auto</button>`:''}</div>`}
function vTodo(){const al=alerts();const by={};for(const a of al){const k=alKind(a);(by[k[2]]=by[k[2]]||{ic:k[1],L:[]}).L.push(a)}
  return`<div class="in"><button class="back" data-a="close">← Retour</button><h2>À faire</h2>${al.length?'':'<div class="panel">Rien à faire. Bravo, gérant ! 👊</div>'}
  ${club().some(canSpend)?`<button class="btn gold big" data-a="spall">⚡ Dépenser tous les points de stats automatiquement</button>`:''}
  ${Object.entries(by).map(([n,G])=>`<div class="panel"><span class="lab">${G.ic} ${n} · ${G.L.length}</span><div style="display:grid;gap:2px;margin-top:6px">${G.L.map(a=>`<div class="tli ${a.bad?'bad':''}"><p>${a.t}</p><div class="row" style="gap:6px;flex-wrap:nowrap">${a.btn.replace(/btn sm( gold)?/g,'btn sm$1')}</div></div>`).join('')}</div></div>`).join('')}</div>`}
function vEcurie(){
  const MP=myPromos(),bp=MP.find(p=>p.id===ui.ebrand)||null;if(!bp)ui.ebrand=null;
  const m=bp?mine().filter(b=>b.brand===bp.id):club(),al=bp?[]:alerts(),full=club().length>=rosterCap();
  const bsw=MP.length?`<div style="margin:6px 0 2px">${selH('ebrand',[['',`🥊 ${esc(S.club)} · ${club().length}/${rosterCap()}`],...MP.map(p=>[p.id,`🏢 ${esc(p.n)} · ${mine().filter(b=>b.brand===p.id).length} boxeurs`])],ui.ebrand||'')}</div>`:'';
  const head=`<h2>Écurie</h2>${bp?'':`<button class="recl" data-a="openclub">🥊 Fiche du club <b>${recTxt()}</b> ›</button>`}${bsw}${bp?'':vLadder()}<div style="margin:8px 0 12px">${segH('esub',[['mine',bp?`Boxeurs ${m.length}`:`Mes boxeurs ${m.length}/${rosterCap()}`],['fa',`Agents libres ${S.fa.length}`],['am','🥇 Amateurs']],ui.esub)}</div>`
    +(bp&&ui.esub!=='fa'?`<div class="panel" style="border-color:${bp.c};margin-bottom:10px"><div class="row" style="justify-content:space-between;gap:8px"><div style="min-width:0"><b>🏢 ${esc(bp.n)}</b><div class="small">Profit ${(()=>{const v=prNet(bp);return(v>=0?'+':'−')+$(Math.abs(v))})()}/sem. · salaires réduits (contrats de promotion)</div></div><button class="btn sm" data-a="openpromo" data-id="${bp.id}">Fiche</button></div>
      <div class="perk" style="margin-top:10px"><div><b>Gestion automatique</b><div class="small">${bp.auto?'La promotion réserve elle-même des combats pour ses boxeurs libres. Tu peux quand même réserver ceux que tu veux.':'Tu réserves toi-même tous les combats de cette promotion.'}</div></div><button class="sw" data-a="prauto" data-id="${bp.id}" aria-pressed="${!!bp.auto}" aria-label="Gestion automatique"><i></i></button></div></div>`:'');
  if(ui.esub==='am')return head+vAm();
  if(ui.esub==='fa')return head+`<p class="lede">Nouvelle liste toutes les 4 semaines. Prime de signature : 10 semaines de salaire.${full?' <b style="color:var(--warn)">Écurie pleine.</b>':''}</p><div class="list">${S.fa.map(b=>boxRow(b,'fa')).join('')}</div>`;
  return head+todoBar(al)+
    `<div class="list">${sortB(m).map(b=>boxRow(b)).join('')||'<div class="panel">Ton écurie est vide. Va dans Agents libres pour signer un boxeur.</div>'}</div><p class="small" style="margin-top:10px">Barres : forme · moral · loyauté.</p>`;
}
function vFaSheet(b){const c=b.salary*10,full=club().length>=rosterCap(),ok=!full&&S.money>=c;
  return`<div class="in"><button class="back" data-a="close">← Retour</button>${heroC(b,'blue')}${statsPanel(b,false)}
    <div class="panel"><span class="lab">Traits</span><div class="tgrid" style="margin-top:8px">${traitList(b)}</div></div>
    <div class="mbar"><div style="flex:1;min-width:0"><b>${$(b.salary)}</b><span class="small">/sem. · ${potTxt(b)}</span></div><button class="btn pri" data-a="neg" data-id="${b.id}" ${full?'disabled':''}>${full?'Écurie pleine':'Négocier'}</button></div></div>`}
function vSheet(b){
  initMs(b);const tab=ui.stab||'apercu',f=upF(b),P=Object.entries(PLANS).filter(([k])=>k!=='sparring'||S.staff.spar.length),{ns,bonus}=renewCost(b);
  const tabs=segH('stab',[['apercu','Aperçu'],['stats',`Stats${b.sp?' •':''}`],['defis',`Défis${b.gate||b.trOpt?' •':''}`],['contrat','Contrat'],['carriere','🏆 Succès']],tab);
  let body='';
  if(tab==='apercu')body=`
    <div class="panel"><div class="ph"><span class="lab">Niveau ${b.lvl}</span><span class="num small">${b.gate?'<b style="color:var(--gold)">Épreuve requise</b>':`${b.xp} / ${need(b.lvl)} XP`}</span></div><div class="trk gold" style="height:9px"><i style="width:${pct(b.xp/need(b.lvl)*100)}%"></i></div>
      <div class="s5" style="margin-top:12px">${STATS.map(([k,,a])=>`<div><small>${a}</small><b class="${tone(b[k])}">${Math.floor(b[k])}</b></div>`).join('')}</div><div class="cond">${condBars(b)}</div></div>
    ${b.inj||b.fatigue>=5?`<div class="panel"><span class="lab">Soins</span><div class="row" style="margin-top:8px">${b.inj?`<button class="btn gold" data-a="heal" data-id="${b.id}" ${S.money>=15000*b.inj?'':'disabled'}>🩺 Soins d’élite · ${$(15000*b.inj)}</button>`:''}${b.fatigue>=5?`<button class="btn" data-a="cryo" data-id="${b.id}" ${S.money>=8000?'':'disabled'}>❄️ Cryothérapie · 8 000 $</button>`:''}</div><p class="small" style="margin:6px 0 0">Soins d’élite : guérison immédiate. Cryothérapie : forme remise à 100.</p></div>`:''}
    <div class="panel"><div class="ph"><span class="lab">Réseaux sociaux</span><b>👥 ${fmtK(fol(b))} abonnés</b></div><p class="small" style="margin:0 0 8px">Les abonnés suivent la popularité : victoires, KO, titres, galas et publications. Plus d’abonnés = plus de commandites et de billets vendus.</p>${b.post===S.t?'<p class="small" style="margin:0">Déjà publié cette semaine.</p>':`<div class="og3">${Object.entries(POSTS).map(([k,p])=>`<button class="opt" data-a="post" data-id="${b.id}" data-k="${k}"><b>${p.ic} ${p.n}</b><span>${p.d}</span></button>`).join('')}</div>`}</div>
    ${f?fightMini(f):''}
    ${sponsPanel(b)}${agePanel(b)}
    <div class="panel"><span class="lab">Entraînement</span>${f?'<p class="small" style="margin:6px 0 0">Il est en camp : l’intensité se règle dans l’écran du camp.</p>':`<div class="seg" style="margin-top:8px">${P.map(([k,p])=>`<button data-a="plan" data-id="${b.id}" data-k="${k}" aria-pressed="${b.plan===k}">${p.n}</button>`).join('')}</div><p class="small" style="margin:6px 0 0">${PLANS[b.plan].d}</p>`}</div>
    ${b.booked?'':`<button class="btn pri big" data-a="book" data-id="${b.id}" ${b.inj?'disabled':''}>${b.inj?`Blessé (${b.inj} sem.) : pas de combat`:'Réserver un combat'}</button>`}`;
  else if(tab==='stats')body=statsPanel(b,true)+`<p class="small">L’XP se mérite : beaucoup contre un adversaire plus fort, presque rien contre un plus faible. Chaque niveau donne 5 points.</p>`;
  else if(tab==='defis')body=`${b.gate?`<div class="panel trial"><div class="ph"><span class="lab" style="color:var(--gold)">Épreuve · niveau ${b.lvl}</span><span class="chip gold">Requis</span></div><p style="margin:0 0 10px">Pour continuer à gagner de l’XP, il doit battre un mentor de son niveau en 6 rounds. Récompense : +3 points.</p>${trialReady(b)?'':`<p class="small" style="color:var(--warn)">${b.inj?'Blessé.':b.lastTrial===S.t?'Déjà tenté cette semaine.':b.fatigue>60?'Trop fatigué (forme sous 40).':'Un combat officiel t’attend d’abord.'}</p>`}<button class="btn gold big" data-a="trial" data-id="${b.id}" ${trialReady(b)?'':'disabled'}>Passer l’épreuve</button></div>`:''}
    <div class="panel"><div class="ph"><span class="lab">Défis personnels</span><span class="small">${b.msDone.length}/${Object.keys(MISS).length}</span></div>
      ${b.ms.map(m=>{const M=MISS[m.id],p=msProg(b,m);return`<div class="ms"><div class="ic">${ROM[M.t]}</div><div style="min-width:0"><b>${M.n}</b><div class="small">${M.d}</div><div class="trk gold"><i style="width:${p/M.g*100}%"></i></div></div><div class="rw">+${M.xp} XP${M.sp?`<br>+${M.sp} pt${M.sp>1?'s':''}`:''}<br><span class="small">${p}/${M.g}</span></div></div>`}).join('')||'<p class="small" style="margin:0">Tous les défis sont réussis !</p>'}</div>
    <div class="panel"><span class="lab">Traits</span>${b.trOpt?`<p class="small">Nouveau trait à choisir :</p><div class="tgrid" style="margin-bottom:10px">${b.trOpt.map(k=>`<button class="trait pos pick" data-a="trait" data-id="${b.id}" data-k="${k}"><b>${TRAITS[k].n}</b><span>${TRAITS[k].d}</span></button>`).join('')}</div>`:''}<div class="tgrid" style="margin-top:8px">${traitList(b)}</div></div>`;
  else if(tab==='contrat')body=`${!b.brand?`<div class="panel"><span class="lab">Gym</span>${selH('setgym',allGyms().map(g=>[g.id,`${g.hq?'🏠':flag(g.nat)} ${g.name} · ${gymBoxers(g.id).length}/${g.cap}`]),b.gym||'hq')}<p class="small" style="margin:0">Entraîneur ${esc((gymOf(b.gym||'hq')||{}).coach?.name||'')} : +${Math.round((gymXP(b)-1)*100)} % d’XP · ${chemTxt(b)}</p></div>`:''}<div class="panel"><div class="cond" style="margin:0 0 8px">${condBars(b)}</div><p class="small" style="margin:0">Loyauté sous 25 : il réclame une augmentation. À 5 : il part. Au-dessus de 80 : +10 % d’XP.</p></div>
    <div class="panel"><div class="ph"><span class="lab">Contrat</span><b>${b.contract} sem.</b></div><div class="row" style="justify-content:space-between"><span>Salaire actuel</span><b>${$(b.salary)}/sem.</b></div><div class="row" style="justify-content:space-between;margin-top:4px"><span>Il demande environ</span><b>${$(ns)}/sem.</b></div>
      <p class="small">${b.loy>70?'Rabais de loyauté appliqué.':b.loy<40?'Il est méfiant et demande plus.':'Prix du marché.'}</p><button class="btn gold big" data-a="neg" data-id="${b.id}">Négocier une prolongation</button></div>
    <div class="panel"><span class="lab">Catégorie de poids · ${divN(b.div)}</span><p class="small" style="margin:6px 0 8px">Monter : +puissance, −vitesse. Descendre : +vitesse, −cardio et menton. Il perd ses ceintures et 40 % de ses points de classement.</p><div class="row">${(()=>{const i=DIVS.findIndex(d=>d.id===b.div);return`${i>0?`<button class="btn" data-a="cdiv" data-id="${b.id}" data-k="-1" ${b.booked?'disabled':''}>${ui.confirm==='cd-1'+b.id?'Confirmer':'⬇ '+DIVS[i-1].n}</button>`:''}${i<DIVS.length-1?`<button class="btn" data-a="cdiv" data-id="${b.id}" data-k="1" ${b.booked?'disabled':''}>${ui.confirm==='cd1'+b.id?'Confirmer':'⬆ '+DIVS[i+1].n}</button>`:''}`})()}</div></div>
    ${b.age>=30&&!b.booked?`<button class="btn gold" data-a="retire" data-id="${b.id}">${ui.confirm==='ret'+b.id?'Confirmer la retraite':'🏛️ Prendre sa retraite (Temple de la renommée)'}</button>`:''}
    ${b.booked?'':`<button class="btn danger" data-a="release" data-id="${b.id}">${ui.confirm==='rel'+b.id?'Confirmer : libérer ce boxeur':'Libérer ce boxeur'}</button>`}`;
  else body=wallPanel(b)+agePanel(b)+`<div class="panel"><div class="s4">${[[`${b.w}-${b.l}-${b.d}`,'Fiche'],[b.ko,'KO'],[Math.round(b.fame),'Notoriété'],[b.pts,'Points']].map(([v,l])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')}</div></div><div class="panel"><span class="lab">Derniers combats</span><div style="margin-top:6px">${histList(b)}</div></div>`;
  return`<div class="in"><button class="back" data-a="close">← Retour</button>${heroC(b,'red')}<div class="stk">${tabs}</div>${body}</div>`;
}

/* --- combats --- */
function vCombats(){
  const off=S.offers?S.offers.length:0;
  const seg=`<h2>Combats</h2><div style="margin:8px 0 12px">${segH('csub',[['cal',`Calendrier${S.fights.length?' '+S.fights.length:''}`],['off',`Offres${off?' '+off:''}`],['galas','Galas'],['book','Réserver']],ui.csub)}</div>`;
  if(ui.csub==='rank')ui.csub='cal';
  if(ui.csub==='off')return seg+vOffers();
  if(ui.csub==='book')return seg+vBook();
  if(ui.csub==='galas')return seg+vGalas();
  const up=S.fights.slice().sort((a,b)=>a.week-b.week);
  const ngp=up.filter(f=>{const a=getB(f.a);return a&&a.mine&&!f.gp}).length;
  const gpb=ngp?`<div class="al" style="margin-bottom:10px"><p>🤖 <b>${ngp} combat${ngp>1?'s':''}</b> sans plan de match. Ton entraîneur peut choisir le plan conseillé pour chacun, et les camps se gèrent en auto.</p><button class="btn sm gold" data-a="gpall">Plan conseillé pour tous</button></div>`:'';
  return seg+gpb+(up.length?`${up[0].week>S.t?`<button class="btn gold big" style="margin-bottom:10px" data-a="skipf" data-id="${up[0].id}">⏩ Jusqu’au prochain combat · ${when(up[0].week)}</button>`:''}<div class="list">${up.map(fightMini).join('')}</div>`:`<div class="panel"><p style="margin:0 0 10px">Aucun combat prévu.</p><button class="btn pri" data-a="csub" data-k="book">Réserver un combat</button></div>`);
}
function afterBook(f){const me=getB(f.a),op=getB(f.b);ui.sheet=null;ui.backSheet=null;ui.tab='combats';ui.csub='book';
  const m=sortB(orgB().filter(b=>!b.booked&&!b.inj));const nx=m[0];if(nx)ui.bookFor=nx.id;ui.justBooked=f.id;
  toast(`✓ Signé : ${sur(me)} vs ${sur(op)} · ${when(f.week)}${nx?` · au tour de ${sur(nx)}`:''}`);window.scrollTo(0,0)}
function bookList(me){const wl=rankList(me.div),mi=wl.indexOf(me),c=champOf(me.div),nc=natList(me.nat,me.div).find(x=>x.nchamp);
  if(!ui.bsc||ui.bsc==='niv'){const o=ovr(me);return S.boxers.filter(b=>b.div===me.div&&!b.mine&&!b.retired&&!b.booked&&!b.inj&&(!b.champ||titleOpts(me,b).length)&&(!canBook(me,b)||canNat(me,b)))
    .map(b=>[b,Math.abs(ovr(b)-o)+(ovr(b)>o?1:0)]).sort((x,y)=>x[1]-y[1]).slice(0,16).map(x=>x[0]).sort((a,b)=>ovr(b)-ovr(a))}
  let list=ui.bsc==='pays'?natList(me.nat,me.div):[...champsOf(me.div),...wl.slice(Math.max(0,mi-10),mi+14)];if(nc&&!list.includes(nc))list.unshift(nc);return list.filter(b=>!b.mine)}
function oppRow(me,o){const t=o.champ?titleOpts(me,o):null,err=canBook(me,o),nat=canNat(me,o);
  return`<button class="rowc ${tcls(o)}" data-a="scout" data-id="${o.id}"><div class="av">${avatar(o,'blue')}</div>
    <div class="rc-m"><div class="nm">${flag(o.nat)} ${esc(o.name)}</div><div class="meta">${STYLES[o.style]} · ${o.w}-${o.l}-${o.d} · ${o.age} ans</div>
      <div class="chips s">${worldChip(o)}${rkCmp(me,o)}<span class="chip pop">👥 ${fmtK(fol(o))}</span>${o.nchamp?'<span class="chip gold">Champ. national</span>':''}${me.rival===o.id?'<span class="chip red">Rival ×1,5</span>':''}${err&&!nat?`<span class="chip bad">${err}</span>`:`<span class="chip">${$(myShare(purse(me,o,t)))}</span>${S.set.odds&&!me.inj?pill(matchOdds(me,o,roundsFor(me,o,t)).w):''}`}</div></div>
    <div class="ovr"><b>${ovr(o)}</b><small>NOTE</small></div></button>`}
function vBook(){
  const m=sortB(orgB().filter(b=>!b.booked&&!b.inj));
  if(!ui.bookFor||!m.find(b=>b.id===ui.bookFor))ui.bookFor=(m.find(b=>!b.inj)||m[0])?.id||null;
  const me=getB(ui.bookFor);
  const np=S.fights.filter(f=>{const a=getB(f.a);return a&&a.mine&&!f.gp}).length;
  const plan=np?`<div class="al" style="margin-bottom:10px"><p>📋 <b>${np} combat${np>1?'s':''} signé${np>1?'s':''}</b> sans plan de match. Signe tous tes combats d’abord, puis planifie les camps d’un coup.</p><button class="btn sm gold" data-a="csub" data-k="cal">Planifier</button></div>`:'';
  if(!me)return orgSel()+plan+'<div class="panel">Tous les boxeurs de cette organisation ont déjà un combat prévu. 👊</div>';
  return orgSel()+plan+`<div class="pickb"><button class="btn" data-a="pickstep" data-k="-1" aria-label="Boxeur précédent">‹</button><select id="pickb" aria-label="Choisir le boxeur">${m.map(b=>`<option value="${b.id}" ${b.id===ui.bookFor?'selected':''}>${b.brand?'🏢 ':''}${b.inj?'🩹 ':''}${ovr(b)} · ${esc(b.name)}${b.champ?' 👑':''} · ${divN(b.div)}</option>`).join('')}</select><button class="btn" data-a="pickstep" data-k="1" aria-label="Boxeur suivant">›</button></div>
    ${(()=>{const g=(S.galas||[]).find(x=>x.id===ui.bev&&!x.done);return g?`<div class="al" style="margin-bottom:10px"><p>🎪 Ajout au gala <b>${esc(g.name)}</b> (${when(g.week)}). Choisis ton boxeur puis un adversaire.</p><button class="btn sm" data-a="bevx">Annuler</button></div>`:''})()}
    ${me.inj?`<div class="al bad" style="margin-bottom:10px"><p><b>${esc(me.name)}</b> est blessé (${me.inj} sem.). Il ne peut pas signer de combat avant d’être guéri.</p></div>`:''}
    ${myRanks(me)}<div class="row" style="justify-content:space-between;margin-bottom:10px"><span class="small"><b style="color:var(--green)">▲ vert</b> = adversaire mieux classé · <b style="color:#ff7b8b">▼ rouge</b> = moins bien classé</span>${segH('bsc',[['niv','🎯 À sa portée'],['proche','Classement'],['pays',flag(me.nat)+' National']],ui.bsc||'niv')}</div>${!ui.bsc||ui.bsc==='niv'?`<p class="small" style="margin:-4px 0 10px">Les adversaires les plus proches de sa note (${ovr(me)}), seulement ceux qu’il peut affronter maintenant. Les champions apparaissent quand il est dans le top 10.</p>`:''}
    <div class="list">${bookList(me).map(o=>oppRow(me,o)).join('')}</div><p class="small" style="margin-top:10px">Touche un adversaire pour son rapport complet. Les % tiennent compte du camp que ton boxeur aura le temps de faire (plus de semaines = meilleure préparation).</p>`;
}
function vScout(o){
  const me=getB(ui.bookFor),can=me&&me.mine&&!me.booked&&me.div===o.div,tab=ui.sctab||'rap';
  const tOpt=can?titleOpts(me,o):[],tDef=can?titleDef(me,o):[],nat=can&&canNat(me,o);
  const err=!can?'Choisis un de tes boxeurs de cette division dans « Réserver »':o.champ?(tOpt.length?null:`Pour défier ce champion, il faut être top 10 ${beltsOf(o).join(' / ')}`):canBook(me,o);
  let body='';
  if(tab==='rap')body=(me&&me.mine?rankTable(me,o):'')+`<div class="panel"><span class="lab">Rapport de ${esc(coachName())}</span><div style="margin-top:8px">${scoutNote(o)}</div></div><div class="panel"><span class="lab">Traits</span><div class="tgrid" style="margin-top:8px">${traitList(o)}</div></div>`;
  else if(tab==='cmp')body=me?`<div class="lab" style="margin:2px 0 6px;text-align:center"><span style="color:var(--red)">${esc(sur(me))}</span> vs <span style="color:var(--blue)">${esc(sur(o))}</span></div>${tapeBox(me,o)}`:'<p class="small">Choisis d’abord un boxeur dans « Réserver ».</p>';
  else if(tab==='mur')body=wallPanel(o)+agePanel(o);
  else body=statsPanel(o,false)+`<div class="panel"><span class="lab">Classements</span><div class="chips" style="margin-top:8px">${BELTS.map(k=>`<span class="chip">${k} ${beltsOf(o).includes(k)?'Champion':bodyIdx(o,k)<15?'#'+(bodyIdx(o,k)+1):'–'}</span>`).join('')}</div></div><div class="panel"><span class="lab">Derniers combats</span><div style="margin-top:6px">${histList(o)}</div></div>`;
  const galas=(S.galas||[]).filter(g=>!g.done&&g.week>=S.t+2),bev=galas.find(g=>g.id===ui.bev)?ui.bev:null,bw=Math.max(ui.bw||4,me&&me.lastFight!=null?me.lastFight+6-S.t:0),wk=bev?galas.find(g=>g.id===bev).week:S.t+bw;
  const t0=tOpt.length?tOpt:null,rounds=t0?12:can?roundsFor(me,o,false):0,pp=can?Math.round(purse(me,o,t0)*(wk-S.t<=2?1.1:1)):0,od=can&&!err?matchOdds(me,o,rounds):null;
  const book=can&&(!err||nat||tDef.length)?`<div class="mbar col">
    <div class="wkpick"><span>Dans</span><div class="seg">${[2,3,4,6,8,10].map(w=>`<button data-a="bw" data-k="${w}" aria-pressed="${!bev&&bw===w}" ${me&&S.t+w<(me.lastFight||-99)+6?'disabled':''}>${w}</button>`).join('')}</div><span>sem. · camp ${$(campTotal(ui.bw||4))}</span></div>${me&&S.t+2<(me.lastFight||-99)+6?`<p class="small" style="margin:0">💤 Récupération : pas de combat avant ${when(me.lastFight+6)}.</p>`:''}${galas.length?`<div class="seg">${galas.map(g=>`<button data-a="bev" data-k="${g.id}" aria-pressed="${bev===g.id}">🎪 ${esc(g.name.slice(0,18))}</button>`).join('')}</div>`:''}
    <div class="row" style="justify-content:space-between;gap:8px"><div style="min-width:0"><b>${bev?'Ton gala':$(myShare(pp))}</b> <span class="small">· ${when(wk)}${bev?` · tu paies ${$(Math.round(pp*.6))}`:''}</span></div>${od?`<div class="small">Victoire ${pill(od.w)}</div>`:''}</div>
      <div class="bkbtns">${!err?`<button class="btn ${t0?'gold':'pri'}" data-a="propose" data-id="${o.id}">${t0?'Défier · '+t0.join(' '):'Signer'}</button>`:''}${tDef.length?`<button class="btn gold" data-a="proposeD" data-id="${o.id}">Défendre ${tDef.join(' ')}</button>`:''}${nat?`<button class="btn gold" data-a="proposeN" data-id="${o.id}">Titre ${flag(o.nat)}</button>`:''}</div></div></div>`
    :`<div class="mbar"><span class="small">${err||''}</span></div>`;
  return`<div class="in"><button class="back" data-a="close">← Retour</button>${heroC(o,'blue')}${o.vsMe?`<div class="vsme"><span>⚔️ Contre ton club</span><b><i class="g">${o.vsMe.w}V</i> <i class="r">${o.vsMe.l}D</i> <i>${o.vsMe.d}N</i></b></div>`:''}<div class="stk">${segH('sctab',[['rap','Rapport'],['cmp','Duel'],['fiche','Fiche'],['mur','🏆 Succès']],tab)}</div>${body}${!o.mine&&!o.fa&&me&&me.mine?`<div class="panel"><div class="ph"><span class="lab">Racheter son contrat</span><b>${$(buyPrice(o))}</b></div><p class="small" style="margin:0 0 8px">Tu paies son club, puis tu négocies son salaire. Le prix suit sa note, ses abonnés et ses ceintures.</p>${buyNeed(o)>S.mgr.lvl?`<p class="small" style="margin:0 0 8px;color:var(--gold)">🔒 Un boxeur de ce calibre ne signe qu’avec un gérant reconnu : <b>gérant niveau ${buyNeed(o)}</b> requis (tu es niveau ${S.mgr.lvl}). L’argent ne suffit pas.</p>`:''}<button class="btn gold" data-a="neg" data-id="${o.id}" ${o.booked||o.inj||S.money<buyPrice(o)||buyNeed(o)>S.mgr.lvl?'disabled':''}>💰 Négocier le rachat</button></div>`:''}${book}</div>`;
}
function vCamp(f){
  const a=getB(f.a),b=getB(f.b);if(!a||!b)return'';
  const tab=ui.ctab||'camp',prep=f.prep??10,wl=Math.max(0,f.week-S.t),tot=Math.max(1,f.week-(f.start??f.week-4)),done=f.wk||0,coach=S.staff.coach,rec=bestGP(b.style),bo=f.bon||{};
  const lvl=prep<30?'Rouillé':prep<55?'En rodage':prep<80?'Prêt':'Au sommet',g=f.ev&&(S.galas||[]).find(x=>x.id===f.ev);
  let body='';
  if(tab==='camp'){const od=S.set.odds?matchOdds(a,b,f.rounds,f):null,odp=S.set.odds&&f.week>S.t?matchOdds(a,b,f.rounds,projF(f)):null,od100=S.set.odds?matchOdds(a,b,f.rounds,{...f,prep:100}):null,auto=f.auto!==false,sel=ui.cw??done;
    const chip=i=>{const isDone=i<done,lg=(f.log||[])[i],pl=(f.plan||[])[i],k=isDone?lg:(auto?null:pl),Fo=k&&FOC[k];
      return`<button class="wkc ${isDone?'done':''} ${!isDone&&!auto&&sel===i?'sel':''}" data-a="cwk" data-k="${i}" ${isDone||auto?'disabled':''}><small>S${i+1}${i===tot-1?' · combat':''}</small><b>${k==='inj'?'🩹':Fo?Fo.ic:auto?'🤖':'＋'}</b><span>${k==='inj'?'Blessé':Fo?Fo.n:auto?'Auto':'Choisir'}</span></button>`};
    body=`${a.inj?`<div class="al bad"><p><b>${esc(sur(a))}</b> est blessé (${a.inj} sem.). Chaque semaine blessé fait perdre de la préparation.${wl<=a.inj?' <b>Il ne sera pas guéri à temps.</b>':''}</p><div class="row">${(f.post||0)<2&&!f.ev?`<button class="btn sm gold" data-a="postpone" data-id="${f.id}">Reporter de 3 sem.</button>`:''}<button class="btn sm danger" data-a="cancelf" data-id="${f.id}">${ui.confirm==='cf'+f.id?'Confirmer':'Annuler'}</button></div></div>`:''}
    <div class="panel"><div class="ph"><span class="lab">Préparation</span><span class="chip ${prep>=80?'gold':prep<30?'bad':''}">${lvl}</span></div>
      <div class="row" style="align-items:flex-end;gap:12px;flex-wrap:nowrap"><span class="pbig">${prep}<small>%</small></span><div style="flex:1;display:grid;gap:6px;min-width:0"><div class="trk gold" style="height:10px"><i style="width:${prep}%"></i></div>
        <div class="bon">${Object.entries(BONN).map(([k,n])=>`<span>${n}<i>${[0,1,2].map(j=>`<em class="${j<Math.min(3,bo[k]||0)?'on':''}"></em>`).join('')}</i></span>`).join('')}</div></div></div>
      ${od?`<div class="row" style="justify-content:space-between;margin-top:10px"><span class="small">Victoire si le combat était ce soir (forme et prépa actuelles)</span>${pill(od.w)}</div>${odp?`<div class="row" style="justify-content:space-between;margin-top:4px"><span class="small"><b>Prévu le jour J</b> (camp normal, reposé)</span>${pill(odp.w)}</div>`:''}<div class="row" style="justify-content:space-between;margin-top:4px"><span class="small">Avec 100 % de préparation</span>${pill(od100.w)}</div>`:''}
      <p class="small" style="margin:8px 0 0">Forme actuelle ${Math.round(100-a.fatigue)}. Chaque bonus (jusqu’à 3) renforce ce domaine le soir du combat.</p></div>
    <div class="panel"><div class="ph"><span class="lab">Programme · ${wl?`combat dans ${wl} sem.`:'combat cette semaine'}</span>${segH('cauto',[['auto','🤖 Auto'],['man','✋ Manuel']],auto?'auto':'man')}</div>
      <p class="small" style="margin:0 0 8px">${auto?`${esc(coachName())} choisit chaque semaine selon la forme et l’adversaire.`:'Touche une semaine à venir, puis choisis la séance.'}</p>
      <div class="wkr">${Array.from({length:tot},(_,i)=>chip(i)).join('')}</div>
      ${!auto&&sel>=done&&sel<tot?`<div class="og3" style="margin-top:10px">${Object.entries(FOC).map(([k,Fo])=>`<button class="opt" data-a="cfoc" data-id="${f.id}" data-k="${k}" aria-pressed="${(f.plan||[])[sel]===k}"><b>${Fo.ic} ${Fo.n}</b><span>${Fo.d} ${Fo.fat>0?'+':''}${Fo.fat} fatigue</span></button>`).join('')}</div>`:''}
      ${wl?`<button class="btn gold big" style="margin-top:10px" data-a="skipf" data-id="${f.id}">⏩ Avancer jusqu’au combat</button>`:''}</div>
    <div class="panel"><span class="lab">Plan de match</span>${!f.gp?'<p class="small" style="margin:4px 0 0;color:var(--gold)">Choisis un plan : le bon plan donne un gros avantage.</p>':''}<div class="og" style="margin-top:8px">${Object.entries(GP).map(([k,gp])=>`<button class="opt" data-a="cgp" data-id="${f.id}" data-k="${k}" aria-pressed="${f.gp===k}"><b>${gp.n}</b><span>${gp.d}</span>${(coach||(S.fac&&S.fac.video))&&k===rec?'<span class="ok">✓ Conseillé contre son style</span>':''}</button>`).join('')}</div>
      <p class="small" style="margin:8px 0 0">${b.name} : ${STYLES[b.style]}. ${STYD[b.style]}</p></div>
    <div class="panel"><span class="lab">Type de camp</span><div class="og3" style="margin-top:8px">${Object.entries(CAMPS).map(([k,c])=>`<button class="opt" data-a="ctype" data-id="${f.id}" data-k="${k}" aria-pressed="${(f.camp||'std')===k}" ${wl?'':'disabled'}><b>${c.n}${c.c?' · '+$(c.c):''}</b><span>${c.d}</span></button>`).join('')}</div></div>
    <div class="panel"><span class="lab">Pesée</span><p class="small" style="margin:6px 0 0">${String((DIVS.find(d=>d.id===a.div)||{}).kg).startsWith('+')?'Poids lourd : pas de limite.':`Limite ${(DIVS.find(d=>d.id===a.div)||{}).kg}. Sous 40 % de préparation, il risque de rater le poids (amende de 20 %).`}</p></div>
    ${a.inj?'':`<button class="btn danger" data-a="cancelf" data-id="${f.id}">${ui.confirm==='cf'+f.id?'Confirmer l’annulation (popularité −3)':'Annuler ce combat'}</button>`}`}
  else body=`<div class="panel"><span class="lab">Rapport de ${esc(coachName())}</span><div style="margin-top:8px">${scoutNote(b)}</div></div>${tapeBox(a,b)}<div class="panel"><span class="lab">Traits de ${esc(sur(b))}</span><div class="tgrid" style="margin-top:8px">${traitList(b)}</div></div><div class="panel"><span class="lab">Ses derniers combats</span><div style="margin-top:6px">${histList(b)}</div></div>`;
  return`<div class="in"><button class="back" data-a="close">← Retour</button>
    <div class="panel"><div class="row" style="justify-content:space-between"><span class="chip ${f.title||f.ntitle?'gold':''}">${ftag(f,a)}</span><span class="small">${when(f.week)}</span></div>
      <div class="fmr" style="margin-top:10px"><div class="av md ${tcls(a)}">${avatar(a,'red')}</div><div class="fmn"><b>${flag(a.nat)} ${esc(sur(a))}</b><span class="vs">VS</span><b>${flag(b.nat)} ${esc(sur(b))}</b></div><div class="av md ${tcls(b)}">${avatar(b,'blue')}</div></div>
      <div class="row small" style="justify-content:space-between;margin-top:8px"><span>${ovr(a)} · ${rankLabel(a)}</span><span>${g?'🎪 '+esc(g.name):'Ta part '+$(myShare(f.purse))+'+'}</span><span>${ovr(b)} · ${rankLabel(b)}</span></div></div>
    ${f.week-S.t<=1?faceOff(a,b,f):''}
    ${betPanel(f)}
    <div class="stk">${segH('ctab',[['camp','Camp'],['scout','Repérage']],tab)}</div>${body}</div>`;
}
function betPanel(f){if(f.own&&false)return'';const o=betOdds(f);if(f.bet)return`<div class="panel"><span class="lab">💰 Ton pari</span><p class="small" style="margin:6px 0 0">${$(f.bet.amt)} sur ${f.bet.side==='w'?'la victoire':'la défaite'} de ton boxeur · gain possible ${$(Math.round(f.bet.amt*f.bet.mult))}</p></div>`;
  if(!o)return'';const amts=[10000,100000,1000000].filter(x=>x<=Math.max(10000,S.money*.5));const mw=Math.min(25,Math.max(1.05,95/Math.max(3,o.w))),ml=Math.min(25,Math.max(1.05,95/Math.max(3,o.l)));
  return`<div class="panel"><div class="ph"><span class="lab">💰 Parier sur le combat</span><span class="small">${o.w} % de chances</span></div><div style="display:grid;gap:6px;margin-top:6px">${[['w','Il gagne',mw],['l','Il perd',ml]].map(([sd,n,m])=>`<div class="row" style="gap:6px;flex-wrap:nowrap;align-items:center"><span class="small" style="flex:1;min-width:0"><b>${n}</b> · ${m.toFixed(2).replace('.',',')} contre 1</span>${amts.map(x=>`<button class="btn sm" data-a="bet" data-id="${f.id}" data-k="${sd}:${x}" ${S.money>=x?'':'disabled'}>${moneyS(x)}</button>`).join('')}</div>`).join('')}</div></div>`}
/* --- défis, staff, club --- */
function ssCard(){const ss=S.ss;if(!ss)return`<div class="panel"><span class="lab">🏆 Super Série</span><p class="small" style="margin:6px 0 0">Chaque saison, les 8 meilleurs boxeurs d’une division s’affrontent sur 3 tours. ${moneyS(SSP[3])} et le trophée au vainqueur. La prochaine commence à la semaine 3 de l’an ${amWeek()<3?amYear():amYear()+1}.</p></div>`;
  const row=(id,win,lose)=>{const b=getB(id);if(!b)return`<div class="bk-p">${id?'?':'<span class="small">À déterminer</span>'}</div>`;return`<button class="bk-p ${win?'w':''} ${lose?'l':''} ${b.mine?'me':''}" data-a="${b.mine?'open':'scout'}" data-id="${b.id}"><span>${flag(b.nat)} ${esc(sur(b))} ${beltsOf(b).map(k=>beltSvg(k,22)).join('')}</span><b>${ovr(b)}</b></button>`};
  const rounds=[0,1,2].map(k=>{const P=k<=ss.cur||ss.done?ssPairs(k):Array.from({length:4>>k},()=>[null,null]);return`<div class="bk-r"><span class="lab">${SSRN[k]} · ${ss.done||k<ss.cur?'terminé':k===ss.cur?when(ss.wk[k]):when(ss.wk[k])}</span>${P.map(([a,b],i)=>{const w=ss.r[k]&&ss.r[k][i];return`<div class="bk-m">${row(a,w&&w===a,w&&w!==a)}${row(b,w&&w===b,w&&w!==b)}</div>`}).join('')}</div>`}).join('');
  const W=ss.done&&getB(ss.r[2][0]);
  return`<div class="panel bk"><div class="ph"><span class="lab">🏆 ${esc(ss.n)} · an ${ss.y}</span><span class="chip gold">${moneyS(SSP[3])}</span></div>
    ${(ss.inv||[]).map(id=>{const b=getB(id),o=getB(ssOpp(id));return b?`<div class="al bad" style="margin:6px 0 10px;flex-direction:column;align-items:stretch"><p>📩 <b>Invitation pour ${esc(b.name)}</b> (${ovr(b)}) · quart de finale contre <b>${o?flag(o.nat)+' '+esc(o.name)+' ('+ovr(o)+')':'?'}</b>, ${when(ss.wk[0])}. ${o&&S.set.odds?'Chances '+pill(matchOdds(b,o,12).w):''}<br><span class="small">S’il accepte, son combat contre cet adversaire est placé tout de suite au calendrier.</span></p><div class="row" style="gap:6px"><button class="btn sm gold" data-a="ssok" data-id="${b.id}">✅ Accepter</button><button class="btn sm" data-a="ssno" data-id="${b.id}">Refuser</button></div></div>`:''}).join('')}
    ${W?`<div class="al" style="margin:6px 0 10px"><p>👑 <b>${esc(W.name)}</b> remporte la Super Série !</p></div>`:ssMine().length&&!(ss.inv||[]).length?`<div class="al" style="margin:6px 0 10px"><p>🥊 ${ssMine().map(b=>`<b>${esc(sur(b))}</b>`).join(', ')} ${ssMine().length>1?'sont':'est'} dans la course ! Son combat se place tout seul dans ton calendrier.</p></div>`:''}
    ${rounds}<p class="small" style="margin:8px 0 0">🏆 Les ceintures des champions sont en jeu dans chacun de leurs combats : bats un champion et tu repars avec sa ceinture. Le vainqueur peut finir unifié !<br>Bourses : quarts ${moneyS(SSP[0])} · demies ${moneyS(SSP[1])} · finaliste ${moneyS(SSP[2])} · vainqueur ${moneyS(SSP[3])} + trophée (points GOAT).</p></div>
    ${(S.ssHist||[]).length?`<div class="panel"><span class="lab">Palmarès de la Super Série</span><ul class="log">${S.ssHist.slice(0,8).map(h=>`<li>🏆 <b>${flag(h.nat)} ${esc(h.w)}</b>${h.mine?' <span class="chip red">Ton club</span>':''} <span class="small">${esc(h.n)} · an ${h.y}</span></li>`).join('')}</ul></div>`:''}`}
function vDefis(){
  if(ui.dsub!=='ctr')ui.dsub='ss';const sub=ui.dsub||'ss',head=`<h2>Tournois</h2><div style="margin:8px 0 12px">${segH('dsub',[['ss','🏆 Super Série'],['ctr',`Missions ${S.ctr?S.ctr.done.length+'/3':''}`]],sub)}</div>`;
  if(sub!=='ctr')return head+ssCard();
  const m=sortB(mine());if(!ui.gymBoxer||!m.find(b=>b.id===ui.gymBoxer))ui.gymBoxer=m[0]?.id;const me=getB(ui.gymBoxer);
  const pickB=`<div style="margin:8px 0 0">${selH('gymboxer',sortB(m).map(b=>[b.id,`${b.inj?'🩹 ':''}${ovr(b)} · ${esc(b.name)} · ${divN(b.div)}`]),ui.gymBoxer,'id')}</div>`;
  if(sub==='tour'){S.tcd=S.tcd||{};
    return head+`<p class="lede">Tournois à élimination d’un soir : 8 boxeurs de la division de ton boxeur, 3 combats de 4 rounds d’affilée. La fatigue et les blessures s’accumulent.</p>
    ${S.tour?`<div class="panel trial"><b>Tournoi en cours : ${TOURS.find(t=>t.id===S.tour.tid).n}</b><p class="small">${RNDN[S.tour.round]} à disputer.</p><button class="btn gold big" data-a="tourgo">Continuer le tournoi</button></div>`:''}
    <div class="panel"><span class="lab">Ton boxeur</span>${pickB}${me&&!tourReady(me)?`<p class="small" style="color:var(--warn);margin:0">${me.inj?'Blessé.':me.booked?'Il est en camp pour un combat officiel.':me.fatigue>60?'Trop fatigué.':'Un combat t’attend d’abord.'}</p>`:''}</div>
    <div class="list">${TOURS.map(T=>{const lock=S.mgr.lvl<T.lvl,cd=(S.tcd[T.id]||0)>S.t,ok=!lock&&!cd&&!S.tour&&me&&tourReady(me)&&S.money>=T.fee;
      return`<div class="panel"><div class="ph"><b class="nm" style="font-size:20px">${T.n}</b><span class="chip ${lock?'':'gold'}">${$(T.prize)}</span></div>
        <p class="small" style="margin:0 0 8px">Inscription ${$(T.fee)} · adversaires ${T.dif>0?'plus forts':'de ton niveau'} · finaliste ${$(Math.round(T.prize*.35))}</p>
        ${lock?`<span class="small">Gérant niveau ${T.lvl} requis</span>`:cd?`<span class="small">Prochaine édition dans ${(S.tcd[T.id]||0)-S.t} sem.</span>`:`<button class="btn pri" data-a="tourin" data-k="${T.id}" ${ok?'':'disabled'}>Inscrire ${me?esc(sur(me)):''}</button>`}</div>`}).join('')}</div>
    ${S.stats.trophies?`<p class="small">Trophées remportés : ${S.stats.trophies}</p>`:''}`}
  if(sub==='ctr'){if(!S.ctr)newContracts();
    return head+`<p class="lede">3 missions par mois, avec de l’argent et de l’XP de gérant. Nouvelles missions ${S.ctr.until>S.t?`dans ${S.ctr.until-S.t+1} sem.`:'la semaine prochaine'}.</p><div class="stack" style="gap:8px">${S.ctr.list.map(id=>{const c=CTR.find(x=>x.id===id),d=S.ctr.done.includes(id),p=Math.min(c.g,(S.mc||{})[c.k]||0);
      return`<div class="panel mis ${d?'done':''}"><div class="ic">${d?'✓':'🎯'}</div><div style="min-width:0;flex:1"><b>${c.n}</b><div class="trk gold" style="margin-top:6px"><i style="width:${p/c.g*100}%"></i></div><span class="small">${d?'Mission réussie !':`${p}/${c.g}`}</span></div><div class="rw"><b>+${moneyS(Math.round(c.cash*ctrMul()))}</b><br><span class="small">${c.xp} XP</span></div></div>`}).join('')}</div>`}
  const unlocked=i=>i===0||S.gyms[i-1].beaten>=3,g=S.gyms[ui.gym],op=g&&g.beaten<3?g.m[g.beaten]:null,tier=ui.gym+1,rounds=g&&g.beaten===2?8:6,od=S.set.odds&&me&&op?matchOdds(me,op,rounds):null;
  return head+`<p class="lede">Bats les 3 boxeurs d’un gym pour son badge. ${S.stats.badges}/8 badges.</p>
    <div class="seg" style="margin-bottom:12px">${S.gyms.map((x,i)=>`<button data-a="gym" data-k="${i}" aria-pressed="${ui.gym===i}" ${unlocked(i)?'':'disabled'}>${x.beaten>=3?'★':unlocked(i)?i+1:'🔒'} ${x.city}</button>`).join('')}</div>
    ${g&&unlocked(ui.gym)?`<div class="panel"><div class="ph"><div><div class="nm">${g.name}</div><span class="small">${g.city} · Niveau ≈ ${g.o}</span></div><div class="dots">${[0,1,2].map(j=>`<i class="${j<g.beaten?'on':''}"></i>`).join('')}</div></div>
      <div class="list">${g.m.map((x,i)=>`<div class="opp" style="opacity:${i<g.beaten?.5:1}"><div class="av sm ${tcls(x)}">${avatar(x,'blue')}</div><div style="flex:1;min-width:0"><b>${flag(x.nat)} ${esc(x.name)}</b> ${i===2?'<span class="chip gold">Chef</span>':''}<div class="small">Note ${ovr(x)} · ${STYLES[x.style]}</div></div>${i<g.beaten?'<span class="chip good">Battu</span>':i===g.beaten?'<span class="chip blue">Suivant</span>':''}</div>`).join('')}</div></div>
      ${op?`<div class="panel"><span class="lab">Ton boxeur</span>${pickB}<div class="row" style="justify-content:space-between"><span class="small">${rounds} rounds · ${$(tier*1500)} · badge ${$(tier*4000)}</span>${od?pill(od.w):''}</div>
        ${me&&!canChallenge(me)?`<p class="small" style="color:var(--warn);margin:8px 0 0">${me.inj?'Blessé.':me.lastCh===S.t?'Déjà un défi cette semaine.':me.fatigue>60?'Trop fatigué (forme sous 40).':'Un combat officiel t’attend d’abord.'}</p>`:''}
        <button class="btn pri big" style="margin-top:10px" data-a="challenge" ${me&&canChallenge(me)?'':'disabled'}>Défier ${esc(sur(op))}</button></div>`:'<div class="panel"><span class="chip gold">Badge obtenu</span></div>'}`:''}`;
}
function vStaff(){
  const s=S.staff,sub=ui.ssub||'eq';
  const slot=(role,x)=>`<div class="panel"><div class="ph"><span class="lab">${ROLES[role].n}</span>${x?stars(x.stars):''}</div>${x?`<div class="row" style="justify-content:space-between"><div><b>${esc(x.name)}</b><div class="small">${$(x.salary)}/sem.</div></div><button class="btn sm danger" data-a="fire" data-id="${x.id}">${ui.confirm==='fire'+x.id?'Confirmer':'Renvoyer'}</button></div>`:'<p class="small" style="margin:0">Poste vacant.</p>'}<p class="small" style="margin:6px 0 0">${ROLES[role].d}</p></div>`;
  const head=`<h2>Staff</h2><div style="margin:8px 0 12px">${segH('ssub',[['eq','Mon équipe'],['cand',`Candidats ${S.market.length}`]],sub)}</div>`;
  if(sub==='cand')return head+`<p class="lede">Nouveaux candidats toutes les 4 semaines. Frais : 6 semaines de salaire.</p><div class="list">${S.market.map(c=>{const fee=c.salary*6,full=c.role==='spar'&&s.spar.length>=2,cur=c.role!=='spar'&&s[c.role];
    return`<div class="panel"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><div style="min-width:0"><span class="lab">${ROLES[c.role].n}</span><div><b>${esc(c.name)}</b> ${stars(c.stars)}</div><div class="small">${$(c.salary)}/sem.${cur?` · remplace ${cur.stars}★`:''}</div></div><button class="btn sm pri" data-a="hire" data-id="${c.id}" ${S.money>=fee&&!full?'':'disabled'}>${full?'Complet':$(fee)}</button></div></div>`}).join('')||'<div class="panel">Aucun candidat.</div>'}</div>`;
  return head+`<div class="list">${slot('coach',s.coach)}${slot('phys',s.phys)}${slot('cut',s.cut)}${slot('spar',s.spar[0])}${s.spar.length?slot('spar',s.spar[1]):''}</div>`;
}
function vClub(){
  const M=S.mgr,f=S.fin,sub=ui.clsub||'ger';
  const GRP={ger:'moi',obj:'moi',inst:'bat',invest:'bat',fin:'fin',rivaux:'his',hof:'his',jr:'his'},grp=GRP[sub]||'moi';
  const MAIN=[['moi','👔 Moi','ger','Ton niveau de gérant, tes atouts et tes objectifs.'],['bat','🏗️ Bâtir','inst','Améliore tes installations et investis ton argent.'],['fin','💰 Argent','fin','Ce qui entre et ce qui sort chaque semaine.'],['his','📜 Histoire','rivaux','Tes rivaux, les légendes du club et le journal.']];
  const SUB={moi:[['ger','Gérant'],['obj','Objectifs']],bat:[['inst','Installations'],['invest','Investir']],his:[['rivaux','Rivaux'],['hof','Légendes'],['jr','Journal']]};
  const head=`<div class="row" style="justify-content:space-between;align-items:center"><h2>Club</h2><button class="btn sm" data-a="openclub">🏢 Fiche du club</button></div>
    <div class="clmain">${MAIN.map(([k,n,d0])=>`<button data-a="clsub" data-k="${d0}" aria-pressed="${grp===k}">${n}</button>`).join('')}</div>
    <p class="small" style="margin:4px 0 8px">${MAIN.find(x=>x[0]===grp)[3]}</p>${SUB[grp]?`<div style="margin:0 0 12px">${segH('clsub',SUB[grp],sub)}</div>`:''}`;
  if(sub==='invest')return head+vInvest();
  if(sub==='rivaux')return head+vRivals();
  if(sub==='hof')return head+vHof();
  if(sub==='inst'){const used=new Set((S.branches||[]).map(b=>b.city));const cities=[...NAT[S.home].c,...Object.entries(NAT).filter(([k])=>k!==S.home).map(([,v])=>v.c[0])].filter(c=>!used.has(c)).slice(0,8);
    return head+`<p class="lede">Places de boxeurs : <b>${rosterCap()}</b> (2 de base + vestiaires + 2 par gym ouvert).</p>
    <div class="list"><div class="panel"><div class="ph"><span class="lab">Salle d’entraînement</span><span class="chip">${S.gym}/5</span></div><p class="small" style="margin:0 0 8px">+8 % d’XP par niveau.</p>${S.gym<5?`<button class="btn pri" data-a="up" ${S.money>=COST[S.gym]?'':'disabled'}>Améliorer · ${$(COST[S.gym])}</button>`:'<span class="chip gold">Niveau max</span>'}</div>
    ${Object.entries(FAC).map(([k,F])=>{const l=S.fac[k]||0,c=facCost(k,l);return`<div class="panel"><div class="ph"><span class="lab">${F.n}</span><div class="pips">${Array.from({length:F.max},(_,i)=>`<i class="${i<l?'on':''}"></i>`).join('')}</div></div><p class="small" style="margin:0 0 8px">${F.d}</p>${l<F.max?`<button class="btn pri" data-a="fac" data-k="${k}" ${S.money>=c?'':'disabled'}>${l?'Améliorer':'Construire'} · ${$(c)}</button>`:'<span class="chip gold">Niveau max</span>'}</div>`}).join('')}</div>
    <h2 style="font-size:24px;margin:18px 0 8px">Mes gyms</h2><div class="panel"><div class="list">${allGyms().map(g=>{const r=gymRec(g.id),n=gymBoxers(g.id).length;return`<button class="rowc" data-a="opengym" data-id="${g.id}"><div class="av" style="display:grid;place-items:center;font-size:26px">${g.hq?'🏠':flag(g.nat)}</div><div class="rc-m"><div class="nm">${esc(g.name)}</div><div class="meta">${esc((g.coach||{}).name||'')} ${'★'.repeat((g.coach||{}).stars||1)} · ${r.w}-${r.l}-${r.d} (${r.ko})</div></div><div class="ovr"><b style="font-size:18px">${n}/${g.cap}</b><small>PLACES</small></div></button>`}).join('')}</div>
      <p class="small">Ouvrir un nouveau gym : ${$(brCost())}. +2 places de boxeur et des revenus d’abonnements chaque semaine.</p><div class="chips">${cities.map(c=>`<button class="btn sm" data-a="branch" data-k="${esc(c)}" ${S.money>=brCost()?'':'disabled'}>${flag(CITYNAT[c])} ${esc(c)}</button>`).join('')}</div></div>`}
  if(sub==='fin'){const g=1-.07*S.mgr.perks.ges,spo=mine().reduce((s,b)=>s+Math.round(b.fame*8),0),br=brIncome(),mi=merchInc(),ai=S.arena?ARENA_LV[S.arena].inc:0,sal=Math.round(mine().reduce((s,b)=>s+b.salary,0)*g),stf=Math.round(staffSalary()*g),upk=Math.round((150*S.gym+facLv()*90+(S.branches||[]).length*300)*g),net=spo+br+mi+ai-sal-stf-upk;
    const purses=S.fights.filter(x=>!x.own&&x.week<=S.t+4).reduce((s,x)=>s+myShare(x.purse),0),gp=(S.galas||[]).filter(x=>!x.done&&x.week<=S.t+4).reduce((s,x)=>s+galaEst(x).profit,0);
    const line=(l,v)=>`<div class="row" style="justify-content:space-between"><span>${l}</span><b class="num ${v<0?'neg':''}" style="${v>0?'color:var(--green)':''}">${v>=0?'+':'−'}${$(Math.abs(v))}</b></div>`;
    return head+`<div class="list"><div class="panel"><span class="lab">Chaque semaine</span><div style="display:grid;gap:6px;margin-top:10px;font-size:14px">${line('Commandites',spo)}${br?line('Abonnements des gyms',br):''}${mi?line('Produits dérivés',mi):''}${ai?line('Aréna du club (événements)',ai):''}${line('Salaires des boxeurs',-sal)}${line('Staff',-stf)}${line('Entretien',-upk)}
      <div class="row" style="justify-content:space-between;border-top:1px solid var(--line);padding-top:6px"><b>Net par semaine</b><b class="num" style="color:${net>=0?'var(--green)':'#ff7b8b'}">${net>=0?'+':'−'}${$(Math.abs(net))}</b></div></div></div>
      <div class="panel"><span class="lab">Projection sur 4 semaines</span><div style="display:grid;gap:6px;margin-top:10px;font-size:14px">${line('Semaines normales',net*4)}${purses?line('Bourses prévues (minimum)',purses):''}${gp?line('Galas prévus (estimation)',gp):''}
        <div class="row" style="justify-content:space-between;border-top:1px solid var(--line);padding-top:6px"><b>Caisse estimée</b><b class="num">${$(S.money+net*4+purses+gp)}</b></div></div></div></div>`}
  if(sub==='obj')return head+`<div class="panel">${ACH.map(([id,n,,cash,xp])=>`<div class="ach ${S.ach[id]?'done':''}"><div class="ck">${S.ach[id]?'✓':''}</div><span style="flex:1">${n}</span><span class="small">${cash?$(cash)+' · ':''}${xp} XP</span></div>`).join('')}</div>`;
  if(sub==='jr')return head+`<div class="panel"><ul class="log">${S.log.slice(0,40).map(e=>`<li style="${e.kind==='good'?'color:var(--green)':e.kind==='bad'?'color:#ff7b8b':e.kind==='gold'?'color:var(--gold);font-weight:700':''}"><span class="small">${when(e.t)}</span><br>${esc(e.txt)}</li>`).join('')}</ul></div>`;
  return head+`<div class="panel"><div class="ph"><div><span class="lab">${esc(S.mgrName)}</span><div class="nm">Gérant niveau ${M.lvl}</div></div></div>
    <div class="trk gold" style="height:8px"><i style="width:${pct(M.xp/mneed(M.lvl)*100)}%"></i></div><div class="small" style="margin:5px 0 4px">${M.xp} / ${mneed(M.lvl)} XP · Le niveau débloque les arènes, les villes de gala et les tournois.</div><p class="small" style="margin:8px 0 2px">Tes atouts montent tout seuls en jouant : signe des boxeurs, gagne des combats, organise des galas.</p>
    ${Object.entries(PERKS).map(([k,p])=>`<div class="perk"><div><b>${p.n}</b><div class="small">${p.d}</div></div><div style="display:grid;justify-items:end;gap:4px;text-align:right"><div class="pips">${[0,1,2].map(i=>`<i class="${i<M.perks[k]?'on':''}"></i>`).join('')}</div><span class="small">${(()=>{const q=PERKQ[k],v=perkVal(k),nx=q.t.find(t=>v<t);return nx?`${Math.min(v,nx)}/${nx} ${q.q}`:'Niveau max'})()}</span></div></div>`).join('')}</div>
    <button class="btn" style="margin-top:12px;width:100%" data-a="menu">Menu principal</button>`;
}
function render(){
  if(ui.tab==='online'){document.body.classList.add('onmode');const vw=document.getElementById('view');vw.innerHTML=vOnline();document.getElementById('sheet').hidden=true;ui.sheet=null;return}
  document.body.classList.remove('onmode');
  checkAch();try{ladCheck()}catch(e){}
  renderChrome();
  const v={ecurie:vEcurie,combats:vCombats,rank:()=>`<h2>Classements</h2><div style="height:8px"></div>${vRank()}`,defis:vDefis,staff:vStaff,club:vClub,online:vOnline}[ui.tab]();document.body.classList.toggle('onmode',ui.tab==='online');
  const vw=document.getElementById('view'),tk=ui.tab+(ui.csub||'')+(ui.esub||'');if(ui._pt!==tk&&!RM){vw.classList.remove('anim');void vw.offsetWidth;vw.classList.add('anim')}ui._pt=tk;
  document.getElementById('view').innerHTML=(S.money<-15000?'<div class="al bad" style="margin-bottom:12px"><p><b>Le club est lourdement endetté.</b> Libère des salaires ou décroche une grosse bourse.</p></div>':'')+v;
  const sh=document.getElementById('sheet'),sid=ui.sheet||'';let sv='';
  if(sid==='settings')sv=vSettings();
  else if(sid.startsWith('fa:')){const b=S.fa.find(x=>x.id===sid.slice(3));if(b)sv=vFaSheet(b)}
  else if(sid.startsWith('op:')){const b=getB(sid.slice(3));if(b)sv=vScout(b)}
  else if(sid.startsWith('camp:')){const f=S.fights.find(x=>x.id===sid.slice(5));if(f)sv=vCamp(f)}
  else if(sid==='galanew')sv=vGalaNew();
  else if(sid==='todo')sv=vTodo();
  else if(sid==='myclub')sv=vMyClub();
  else if(sid.startsWith('gym:')){const g=gymOf(sid.slice(4));if(g)sv=vGym(g)}
  else if(sid.startsWith('am:')){const b=(S.am||[]).find(x=>x.id===sid.slice(3));if(b)sv=vAmSheet(b)}
  else if(sid.startsWith('promo:')){const p=(S.promos||[]).find(x=>x.id===sid.slice(6));if(p)sv=vPromo(p)}
  else if(sid.startsWith('gala:')){const g=(S.galas||[]).find(x=>x.id===sid.slice(5));if(g)sv=vGala(g)}
  else if(sid){const b=getB(sid);if(b&&b.mine)sv=vSheet(b)}
  if(sv){const op=sh.hidden||ui._ps!==sid;sh.innerHTML=sv;sh.hidden=false;if(op&&!RM){sh.classList.remove('anim');void sh.offsetWidth;sh.classList.add('anim')}}else{ui.sheet=null;sh.hidden=true}ui._ps=sid;
  renderEvent();renderNeg();
}

/* --- écran de combat --- */
const pill=w=>w==null?'<span class="pill">…</span>':`<span class="pill ${w>=60?'g':w>=40?'y':'r'}">${w} %</span>`;
function buildFight(){
  const F=ui.fight,el=document.getElementById('fx');ui.flog=false;
  const tag=F.online?`🌐 ${F.online.legend!=null?'👑 Légende · ':''}${F.online.belt?'🏅 '+esc(F.online.belt)+' · ':''}${F.online.title?'👑 Championnat · ':''}En ligne · ${divN(F.A.b.div)}`:F.tour?`${(TOURS.find(t=>S.tour&&t.id===S.tour.tid)||{n:'Tournoi'}).n} · ${RNDN[F.tour-1]}`:F.trial?`Épreuve · niveau ${F.trial.lvl}`:F.ex?`Défi · ${S.gyms[F.ex.g].name}`:`${F.title?titleTxt(F.title):F.ntitle?'Titre national '+flag(F.A.b.nat):'Combat'} · ${divN(F.A.b.div)}`;
  el.innerHTML=`<div class="fxw"><div class="fxtop"><span class="chip ${F.title||F.ntitle?'gold':F.ex||F.trial||F.online?'blue':''}">${tag}${F.rival?' · Revanche':''}</span><span class="chip refc" title="${esc(refOf(F).d)}">${refOf(F).ic} Arbitre : ${refOf(F).t}</span>
      <div class="seg spd">${[1,2,4].map(s=>`<button data-a="fspeed" data-k="${s}" aria-pressed="${F.speed===s}">×${s}</button>`).join('')}</div><button class="btn sm" data-a="flog">Déroulé</button></div>
    <div id="fxhud"></div><div class="stage"><canvas id="cv" aria-label="Le ring"></canvas><div id="bub" class="bub" hidden></div><div id="ov" class="ov"></div></div><div id="fxctl" class="fxctl"></div></div>
    <div id="fxlog" class="drawer" hidden></div>`;
  el.hidden=false;updateFight();
  if(!RAF)RAF=requestAnimationFrame(loop);
}
function hudHTML(F){
  const o=F.odds,lab=i=>F.online?(i?esc(F.online.n):'Toi')+(F.online.title&&i?' · 👑':''):F.tour?(i?'Tournoi':'Ton club'):F.trial?(i?'Mentor':'Ton club'):F.ex?(i?(S.gyms[F.ex.g].m.indexOf(F.B.b)===2?'Chef':'Gym'):'Ton club'):rankLabel(i?F.B.b:F.A.b);
  const side=(X,i,cls)=>`<div class="hs ${cls}"><div class="hn"><div class="av sm">${avatar(X.b,cls)}</div><div style="min-width:0"><b>${flag(X.b.nat)} ${esc(sur(X.b))}</b><span class="small">${lab(i)} · ${ovr(X.b)}</span></div></div>
    <div class="trk ${cls} hp"><i id="hp${i}" style="width:${pct(F.disp.hp[i])}%"></i></div><div class="trk green en"><i id="en${i}" style="width:${pct(F.disp.en[i])}%"></i></div>
    <span class="small"><span class="num">${X.land}/${X.thr}</span>${(X===F.A?F.B:F.A).kd?` · <b style="color:#ff7b8b">${(X===F.A?F.B:F.A).kd} KD</b>`:''}${X.cut?` · <b style="color:#ff7b8b">Coupure ${X.cut}/3</b>`:''}</span></div>`;
  const rn=F.stage==='done'?'FIN':'R'+(F.stage==='live'?F.r:F.r+1);
  return`<div class="hud">${side(F.A,0,'red')}<div class="clk"><b>${rn}</b><span id="clk" class="num">${clockTxt(F)}</span></div>${side(F.B,1,'blue')}
    ${o?`<div class="odds"><div class="ob"><i style="width:${o.w}%"></i></div><div class="row small" style="justify-content:space-between"><span>Gagne le ${rn==='FIN'?'round':rn.replace('R','round ')} <b style="color:var(--green)">${o.w} %</b></span><span>Perd <b style="color:#ff7b8b">${o.l} %</b></span></div></div>`:''}</div>`;
}
const formChip=X=>!X||!X.df?'':X.df>=1.08?'<span class="chip gold">🔥 En feu ce soir</span>':X.df<=.92?'<span class="chip red">😓 Soir difficile</span>':'<span class="chip">Forme normale</span>';
function faceOff(a,b,f,F){const kg=(DIVS.find(d=>d.id===a.div)||{}).kg||'';return`<div class="fo"><div class="fo-s"><div class="av lg">${avatar(a,'red')}</div><b>${flag(a.nat)} ${esc(sur(a))}</b><span>${a.w}-${a.l}-${a.d} · ${a.age} ans</span>${F?formChip(F.A):''}</div><div class="fo-v"><span>VS</span><small>${kg}</small></div><div class="fo-s r"><div class="av lg">${avatar(b,'blue')}</div><b>${flag(b.nat)} ${esc(sur(b))}</b><span>${b.w}-${b.l}-${b.d} · ${b.age} ans</span>${F?formChip(F.B):''}</div></div>`}
function segStrat(F){const pl=F.stage==='live'?F.bs:(F.bsNext||F.bs),ct=pl?CNT[pl]:null;return`${pl?`<div class="oppl">🔎 Son plan : <b>${STRAT[pl].n}</b><span>🎯 Le contrer : <b>${STRAT[ct].n}</b> (+précision)</span></div>`:''}<div class="seg">${Object.entries(STRAT).map(([k,s])=>`<button data-a="fstrat" data-k="${k}" aria-pressed="${F.ustr&&F.strat===k}">${k===ct?'🎯 ':''}${s.n}${F.adv&&F.adv.s===k?'<span class="dot" title="Conseillé"></span>':''}</button>`).join('')}</div>${F.ustr?'':`<p class="small" style="margin:4px 0 0;opacity:.75">🤖 Ton boxeur suit son instinct. Choisis une consigne pour prendre le contrôle.</p>`}`}
function statsHTML(F){
  const A=F.A,B=F.B,pc=(l,t)=>t?Math.round(l/t*100)+' %':'–';
  const mx=Math.max(1,...F.rst.map(s=>Math.max(s.al,s.bl)));
  return`<div class="panel"><span class="lab">📊 CompuBox</span><table class="cmp" style="margin-top:6px"><thead><tr><th style="color:var(--red)">${esc(sur(A.b))}</th><th></th><th style="color:var(--blue)">${esc(sur(B.b))}</th></tr></thead><tbody>
    ${[['Coups portés',`${A.land}/${A.thr}`,`${B.land}/${B.thr}`],['Précision',pc(A.land,A.thr),pc(B.land,B.thr)],['Jabs',`${A.jL||0}/${A.jT||0}`,`${B.jL||0}/${B.jT||0}`],['Puissance',`${A.pL||0}/${A.pT||0}`,`${B.pL||0}/${B.pT||0}`],['Knockdowns',...kdScored({A,B})],['Coupures',A.cut||0,B.cut||0]].map(([n,x,y])=>`<tr><td class="num">${x}</td><td>${n}</td><td class="num">${y}</td></tr>`).join('')}</tbody></table>
    ${F.res.m==='DEC'?`<p class="small" style="margin:10px 0 0">Juges : <span class="num">${F.cards.map(c=>c.join('-')).join(' · ')}</span></p>`:''}
    ${F.rst.length?`<div class="cbx">${F.rst.map((s,i)=>`<div><i style="height:${Math.round(s.al/mx*44)}px;background:var(--red)"></i><i style="height:${Math.round(s.bl/mx*44)}px;background:var(--blue)"></i><small>R${i+1}</small></div>`).join('')}</div><p class="small" style="margin:4px 0 0">Coups touchés par round${F.rs.length?' · cartes : '+F.rs.map(r=>r[0]+'-'+r[1]).join(' '):''}</p>`:''}</div>`;
}
function ctlHTML(F){
  const coach=`<div class="adv"><b>${esc(coachName())} :</b> ${F.adv?F.adv.why:''}</div>`,A=F.A;
  if(F.stage==='intro')return`${faceOff(F.A.b,F.B.b,F.f,F)}<p class="small" style="margin:-4px 0 8px;text-align:center">Le % tient compte de la forme du soir de chacun : un boxeur en feu peut créer la surprise.</p>${F.wi?`<div class="rstat ${F.wi.ok?'':'bad'}"><span>⚖ Pesée</span><span>${F.wi.ok?'✓':'✗'} ${F.wi.txt}</span></div>`:''}
    ${A.prep!=null&&!F.ex&&!F.trial&&!F.tour?`<div class="rstat"><span>Préparation ${A.prep} %${A.gpb?' · plan de match efficace':''}</span><span>${A.camp&&A.camp!=='std'?CAMPS[A.camp].n:''}</span></div>`:''}
    ${onIntro(F)}${coach}<div><div class="lab" style="margin-bottom:6px">Plan de départ</div>${segStrat(F)}</div>
    <div class="row" style="flex-wrap:nowrap"><button class="btn pri big" style="flex:2" data-a="fround">Combattre !</button><button class="btn" style="flex:1" data-a="fsim">Simuler</button></div>${tapeBox(F.A.b,F.B.b)}`;
  if(F.stage==='live')return coach+`<div><div class="lab" style="margin-bottom:6px">Consigne en direct</div>${segStrat(F)}</div><div class="row" style="flex-wrap:nowrap"><button class="btn" style="flex:1" data-a="fskip">Finir le round ▸▸</button><button class="btn ghost" style="flex:1" data-a="fsim">Simuler la fin</button></div>`;
  if(F.stage==='between'){const s=F.rs[F.rs.length-1]||[0,0],j=F.cards[0],st=F.rst[F.rst.length-1]||{},sel=F.cs||autoCorner(A),c2=S.staff.coach&&S.staff.coach.stars>=2;
    return`<div class="rstat"><span><b>Round ${F.r}</b> · Toi ${st.al||0}/${st.at||0} (${st.ap||0} puissance) · Lui ${st.bl||0}/${st.bt||0}</span><span>Juge ${s[0]}-${s[1]} · Total ${j[0]}-${j[1]}</span></div>
    <div><div class="lab" style="margin-bottom:6px">Dans le coin (1 minute)</div><div class="cgrid">${Object.entries(CORNER).map(([k,c])=>{const dis=(k==='coupure'&&!A.cut)||(k==='plan'&&!c2);return`<button class="cbtn" data-a="fcs" data-k="${k}" aria-pressed="${sel===k}" ${dis?'disabled':''}><b>${c.n}</b><span>${k==='coupure'?(A.cut?`Coupure ${A.cut}/3`:'Aucune coupure'):k==='plan'&&!c2?'Entraîneur 2★ requis':c.d}</span></button>`}).join('')}</div></div>
    ${coach}<div><div class="lab" style="margin-bottom:6px">Plan pour le ${ord(F.r+1)} round</div>${segStrat(F)}</div>
    <div class="row" style="flex-wrap:nowrap"><button class="btn pri big" style="flex:2" data-a="fround">Round ${F.r+1}</button><button class="btn" style="flex:1" data-a="fskip">Passer</button><button class="btn ghost" data-a="fsim">Fin</button></div>`}
  const won=F.res.w?F.res.w==='A':null;
  return`<div class="result ${won?'win':''}"><h3>${won===null?'Match nul':won?'Victoire !':'Défaite'}</h3><p style="margin:6px 0 0">${esc(F.res.txt)}.</p></div><button class="btn pri big" data-a="fdone">Continuer</button>${statsHTML(F)}`;
}
function updateFight(){
  const F=ui.fight,hud=document.getElementById('fxhud');if(!F||!hud)return;
  document.querySelector('#fx .stage').hidden=!S.set.anim;
  hud.innerHTML=hudHTML(F);
  document.getElementById('fxctl').innerHTML=ctlHTML(F);
  const lg=document.getElementById('fxlog');lg.hidden=!ui.flog;
  if(ui.flog)lg.innerHTML=`<div class="ph"><span class="lab">Déroulé du combat</span><button class="btn sm" data-a="flog">Fermer</button></div><ol class="pbp">${F.log.map(e=>`<li><b>Round ${e.r}</b>${e.s?` <span class="small">Juge 1 : ${e.s[0]}-${e.s[1]}</span>`:''}${e.L.map(l=>`<p class="${l.k?'kd':''}">${esc(l.t)}</p>`).join('')}</li>`).join('')||'<li class="small">Le combat n’a pas commencé.</li>'}</ol>`;
}
function vSettings(){
  const s=S.set,tg=(k,n,d)=>`<div class="perk"><div><b>${n}</b><div class="small">${d}</div></div><button class="sw" data-a="set" data-k="${k}" aria-pressed="${!!s[k]}" aria-label="${n}"><i></i></button></div>`;
  return`<div class="in"><button class="back" data-a="close">← Retour</button><h2>Réglages</h2><div class="panel" data-noi18n><span class="lab">🌍 ${LANG==='en'?'Language':'Langue'}</span><div class="row" style="gap:8px;margin-top:8px"><button class="btn ${LANG!=='en'?'gold':''} sm" data-gl="fr">🇫🇷 Français</button><button class="btn ${LANG==='en'?'gold':''} sm" data-gl="en">🇬🇧 English</button></div></div><button class="btn gold big" data-gfb>💬 Donner mon avis sur le jeu</button>
  <div class="panel"><span class="lab">🎨 Couleur de ton club</span><div class="thm">${Object.entries(THEMES).map(([k,t])=>`<button data-a="theme" data-k="${k}" aria-pressed="${(S.theme||'rouge')===k}" style="background:linear-gradient(180deg,${t.c},${t.c2})">${t.n}</button>`).join('')}</div><p class="small" style="margin:6px 0 0">Change les couleurs du jeu et les gants de tes boxeurs.</p></div>
  <div class="panel">${tg('warn','Avertir avant d’avancer','Avant de passer une semaine ou d’aller au combat, te prévenir s’il reste des choses importantes à faire.')}${tg('anim','Combats animés','Voir les deux boxeurs s’affronter sur le ring, coup par coup.')}
    ${tg('td','Combats en 3D','Ring et boxeurs en 3D. Désactive si ton téléphone ralentit.')}
    ${tg('odds','Chances de victoire','Afficher le % de victoire à la réservation, dans le camp et pendant les combats.')}
    ${tg('autoAdv','Suivre les conseils du coin','Ton boxeur applique automatiquement la consigne conseillée.')}
    ${tg('events','Événements aléatoires','Interviews, commanditaires, jeunes espoirs, provocations et imprévus.')}
    <div class="perk"><div><b>Vitesse des combats</b><div class="small">Vitesse par défaut de l’animation.</div></div><div class="seg">${[1,2,4].map(v=>`<button data-a="set" data-k="speed" data-v="${v}" aria-pressed="${s.speed===v}">×${v}</button>`).join('')}</div></div></div>
  <div class="panel"><span class="lab">Sauvegarde · emplacement ${S.slot}</span><p class="small">${ON?`☁️ Sauvegarde automatique, reliée à ton compte <b>${esc(ON.name||'')}</b> : tu la retrouves sur n’importe quel appareil.`:'⚠️ Sauvegardée seulement sur ce téléphone. Connecte-toi au mode En ligne pour la relier à ton compte.'}</p>
    <div class="row"><button class="btn" data-a="menu">Menu principal</button></div>
    </div></div>`;
}

/* ================= ÉVÉNEMENTS ================= */
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-a]');if(!t)return;if(t.dataset.wfix){const w=document.getElementById('warn');if(w)w.hidden=true}
  const a=t.dataset.a,id=t.dataset.id,k=t.dataset.k;
  if(a.startsWith('m_')){menuAct(a,t);return}
  if(!S)return;
  if(!['release','new','fire','cancelf','negno','cdiv','retire','sellpromo','onret','onrr','lvq','clubleave','oncampcancel','onrra','shopbuy','clubkick','spquit','stynick','clubwar'].includes(a))ui.confirm=null;
  if(ui.on&&ui.on.cr){const e=document.getElementById('on-bname');if(e&&e.value.trim())ui.on.cr.name=e.value.slice(0,28)}
  const b=id&&!a.startsWith('on')?getB(id):null;
  switch(a){
    case'onsignup':onAuth('signup');return;case'onlogin':onAuth('login');return;case'onauth':onUi().auth=k;onUi().err='';break;case'onlogout':onLogout();return;case'onacct':onUi().acct=!onUi().acct;break;case'onpass':onPass();return;case'onexit':save();openMenu('home');return;case'onadd':onAddFriend();return;case'onshare':onShareCode();return;case'onref':onLoad(true);return;case'onsub':onUi().sub=k;if(k==='cls'){onUi().rank={};onUi().top=null}window.scrollTo(0,0);break;case'onrdiv':onUi().rdiv=k;onUi().rank={};onUi().top=null;break;case'onopp':onSearch(id);window.scrollTo(0,0);return;case'onlist':onUi().list=true;break;case'onlistx':onUi().list=false;break;case'onskip':onSearch(id,true);return;case'onoppx':Object.assign(onUi(),{box:null,opps:null,found:null,srch:null,list:false});break;case'rxp':rxClose(ui.fight,k);return;case'lvff':lvForfeit(ui.fight);return;case'onclaim':onClaim(k);return;case'onshop':onUi().shop=1;window.scrollTo(0,0);break;case'onshopx':onUi().shop=0;break;case'autog':auToggle(k);return;case'shopbuy':{const it=SHOP.find(x=>x.id===k);if(!it)break;const box=it.box?(onUi()['sb_'+k]||(onUi().home.boxers[0]&&onUi().home.boxers[0].id)):null;if(ui.confirm==='buy'+k){shopBuy(k,box);return}ui.confirm='buy'+k;break}case'shopbox_refill':onUi().sb_refill=k;break;case'shopbox_heal':onUi().sb_heal=k;break;case'onbx':e.preventDefault&&e.preventDefault();if(ONBX[id]){onUi().bx=id;window.scrollTo(0,0)}break;case'onbxx':onUi().bx=null;break;case'oncampcancel':if(ui.confirm==='cc'+id){campCancel(id);return}ui.confirm='cc'+id;break;case'onrra':if(ui.confirm==='rra'+id){rerollAll(id);return}ui.confirm='rra'+id;break;case'onrk':e.preventDefault&&e.preventDefault();onUi().rkv=1;onUi().rk=null;window.scrollTo(0,0);break;case'onrkx':onUi().rkv=0;break;case'onrkc':rkClaim(+k);return;case'onprof':e.preventDefault&&e.preventDefault();onProfile(id);return;case'onprofx':onUi().prof=null;break;case'oninvfr':{const u=onUi(),f=u.home.friends.find(x=>x.id===id),com=f?u.home.boxers.filter(b=>f.divs.includes(b.div)):[];if(!f){u.prof=null;u.sub='amis';break}if(com.length===1){invSend(id,com[0].id);return}u.prof=null;u.sub='amis';u.invPick=id;break}case'oninvgo':invSend(id,k);return;case'oninvx':onUi().inv=null;break;case'oninvok':invAnswer(id,true);return;case'oninvno':invAnswer(id,false);return;case'oncamp':onUi().camp=id;window.scrollTo(0,0);break;case'oncampx':onUi().camp=null;break;case'oncampgo':campBuy(id,k);return;case'onsty':onUi().sty=id;window.scrollTo(0,0);break;case'onstyx':onUi().sty=null;break;case'stynick':{const v=(document.getElementById('sty-nick')||{}).value||'';if(ui.confirm!=='stynick'){if(v.trim().length<2){toast('Surnom trop court');return}ui.confirm='stynick';onUi().nickDraft=v;break}styBuy(id,'nick',v);return}case'styok':{const [kd,v]=String(k).split('|');styBuy(id,kd,v);return}case'styno':ui.confirm=null;break;case'stytr':styPick(id,'tr',k);return;return;case'styglv':styPick(id,'glove',k);return;case'styent':styPick(id,'ent',k);return;return;case'clubjoin':clubLoad('join',(document.getElementById('cl-code')||{}).value||'');return;case'clubnew':clubLoad('create',(document.getElementById('cl-name')||{}).value||'',(document.getElementById('cl-tag')||{}).value||'');return;case'clubleave':if(ui.confirm==='clq'){ui.confirm=null;clubLoad('leave');return}ui.confirm='clq';break;case'clubcancel':clubLoad('cancelreq');return;case'clubok':clubLoad('accept',id);return;case'clubno':clubLoad('refuse',id);return;case'clubrole':clubLoad('role',id,k);return;case'clubkick':if(ui.confirm==='ck'+id){ui.confirm=null;clubLoad('kick',id);return}ui.confirm='ck'+id;break;case'clubclaim':clubLoad('claim');return;case'pushon':pushEnable(k==='1');return;case'pushpref':pushPref(k);return;case'mecard':shareCard();return;case'cardx':{const el=document.getElementById('cardm');if(el)el.remove();return}case'onleg':e.preventDefault&&e.preventDefault();onUi().legv=1;if(!onUi().leg)legLoad();window.scrollTo(0,0);break;case'onlegx':onUi().legv=0;break;case'ondsub':onUi().dsub=k;onUi().legv=0;window.scrollTo(0,0);break;case'leggo':legGo(id,+k);return;case'csort':onUi().csort=k;break;case'clrkv':{e.preventDefault&&e.preventDefault();let el=document.getElementById('clrkm');if(el)el.remove();el=document.createElement('div');el.id='clrkm';el.innerHTML=vClRanks();document.body.appendChild(el);return}case'clrkx':{const el=document.getElementById('clrkm');if(el)el.remove();return}case'clubview':e.preventDefault&&e.preventDefault();clubView(k);return;case'cviewx':onUi().cview=null;break;case'clubjoinid':clubLoad('join',k);return;case'clubsearch':clubList((document.getElementById('cl-q')||{}).value||'');return;case'clubbrowse':Object.assign(onUi(),{clubBrowse:1,clist:null});window.scrollTo(0,0);break;case'clubbrowsex':onUi().clubBrowse=0;break;case'clubedit':Object.assign(onUi(),{clEdit:!onUi().clEdit,cemC:null,cemI:null});break;case'cemc':onUi().cemC=+k;break;case'cemi':onUi().cemI=k;break;case'clubsave':{const u=onUi(),c=u.club;if(!c)break;const em={c:u.cemC??c.emblem.c,i:u.cemI||c.emblem.i,open:!!(document.getElementById('cl-open')||{}).checked};u.clEdit=0;clubLoad('edit',JSON.stringify(em),(document.getElementById('cl-descr')||{}).value||'');return}case'clubwar':if(ui.confirm==='cwar'){ui.confirm=null;clubLoad('war');return}ui.confirm='cwar';toast('⚔️ Touche encore pour lancer la guerre (24 h)');break;case'clubwarclaim':clubLoad('warclaim');return;case'abcat':onUi().abcat=!onUi().abcat;break;case'premget':premGet(k);return;case'onme':e.preventDefault&&e.preventDefault();onUi().mev=1;if(!onUi().pass)passLoad();window.scrollTo(0,0);break;case'onmex':onUi().mev=0;break;case'merg':Object.assign(onUi(),{mev:0,sub:'cls',geo:'R',geoEdit:1,geoDet:null,geoMan:0});window.scrollTo(0,0);break;case'mepub':onUi().mev=0;onProfile(onUi().home.me.id);return;case'mepass':Object.assign(onUi(),{mev:0,passv:1});window.scrollTo(0,0);break;case'rptog':onUi().rpOpen=!onUi().rpOpen;break;case'ongym':onUi().gymv=1;onUi().gym=null;window.scrollTo(0,0);break;case'ongymx':onUi().gymv=0;break;case'gymup':gymLoad('up',k);return;case'onseason':e.preventDefault&&e.preventDefault();onUi().passv=1;window.scrollTo(0,0);break;case'onpassx':onUi().passv=0;break;case'passclaim':passLoad('claim',+k);return;case'passtitle':passLoad('title',null,k);return;case'passbadge':passLoad('badge',null,k);return;case'wallrx':wallReact(+id,k);return;case'chatopen':chatOpen();return;case'chatx':chatClose();return;case'ongeo':onUi().geo=k;break;case'geoloc':geoLocate();return;case'geoman':onUi().geoMan=1;onUi().geoDet=null;break;case'geook':{const D=onUi().geoDet;if(D)geoSave(D.cc,D.rc,D.rn);return}case'geocc':onUi().geoCc=k;onUi().geoRc='';break;case'georc':onUi().geoRc=k;break;case'geosave':{const u=onUi(),cc=u.geoCc||geoGuessCc(),rc=u.geoRc||'',f=(GEO_R[cc]||[]).find(x=>x[0]===rc);geoSave(cc,f?rc:'',f?f[1]:'');return}case'geoedit':Object.assign(onUi(),{geoEdit:1,geoDet:null,geoMan:0});break;case'geofight':geoFight(id,k);return;case'dlyopen':dlyClaim();return;case'dlyx':chestHide();return;case'spsign':spLoad('sign',+k);return;case'spclaim':spLoad('claim');return;case'spquit':if(ui.confirm==='spq'){ui.confirm=null;spLoad('quit');return}ui.confirm='spq';break;case'tourjoin':tourLoad('join',id);return;case'tourgo':tourGo(id,k);return;case'rpplay':rpPlay(+k);return;case'lvq':lvQuit(ui.fight);return;case'onrr':{const u=onUi(),bx=u.home&&u.home.boxers.find(x=>x.id===id);if(!bx)break;if(!bx.abil[+k]){onReroll(id,+k);return}if(ui.confirm==='rr'+id+k){onReroll(id,+k);return}ui.confirm='rr'+id+k;break}case'ongo':onStart(id);return;case'onup':onUi().up={id,add:{}};window.scrollTo(0,0);break;case'onupx':onUi().up=null;break;case'onupp':{const u=onUi(),bx=u.home&&u.home.boxers.find(x=>x.id===u.up.id);if(bx){const used=ONSTAT.reduce((s2,[q])=>s2+(u.up.add[q]||0),0);if(used<bx.pts&&bx[k]+(u.up.add[k]||0)<95)u.up.add[k]=(u.up.add[k]||0)+1}break}case'onupm':{const u=onUi();if(u.up.add[k])u.up.add[k]--;break}case'onupok':onSpend();return;case'onret':if(ui.confirm==='obr'+id){onUi().bx=null;onRetire(id);return}ui.confirm='obr'+id;break;case'oncr':{const u=onUi(),mine=u.home?u.home.boxers.map(x=>x.div):[],fr=ON_DIV.filter(d=>!mine.includes(d));if(fr.length)u.cr=onNewCr(fr[0]);window.scrollTo(0,0);break}case'oncrx':onUi().cr=null;break;case'onlook':onUi().cr.look=onRandLook();break;case'onrname':onUi().cr.name=natName(onUi().cr.nat);break;case'oncdiv':onUi().cr.div=k;break;case'oncnat':if(NAT[k]){onUi().cr.nat=k;onUi().cr.name=natName(k)}break;case'oncsty':onUi().cr.style=k;break;case'oncm':{const c=onUi().cr;if(c.st[k]>40)c.st[k]--;break}case'oncp':{const c=onUi().cr;if(c.st[k]<60&&onLeft(c)>0)c.st[k]++;break}case'oncok':onCreate();return;case'oncauto':{const c=onUi().cr;if(c){let L=onLeft(c),g=0;while(L>0&&g<500){for(const[q]of ONSTAT){if(L>0&&c.st[q]<60){c.st[q]++;L--}}g++}}break}
    case'tab':ui.tab=k;ui.sheet=null;window.scrollTo(0,0);break;
    case'esub':ui.esub=k;break;
    case'csub':ui.csub=k;break;
    case'next':if(!guardAdvance({a:'next'}))return;nextWeek();return;case'warnx':document.getElementById('warn').hidden=true;return;case'warngo':{document.getElementById('warn').hidden=true;const w=ui.warnFor||{a:'next'};ui.warnOk=S.t+':'+w.a;if(w.a==='skipf'){if(guardAdvance(w))skipTo(w.id)}else{if(guardAdvance(w))nextWeek()}return}case'sok':sponsAccept(id);break;case'sno':S.sOff=(S.sOff||[]).filter(x=>x.id!==id);break;
    case'open':ui.backSheet=ui.sheet==='todo'||ui.sheet==='myclub'||(ui.sheet||'').startsWith('promo:')||(ui.sheet||'').startsWith('gym:')?ui.sheet:null;ui.stab=k||'apercu';ui.sheet=id;document.getElementById('sheet').scrollTop=0;break;
    case'close':if(ui.backSheet&&ui.sheet&&ui.sheet!==ui.backSheet){ui.sheet=ui.backSheet;ui.backSheet=null}else{ui.sheet=null;ui.backSheet=null}break;
    case'plan':if(k!=='sparring'||S.staff.spar.length)b.plan=k;break;
    case'spend':spend(b,k);break;
    case'auto':autoSpend(b);break;
    case'trait':if(b.trOpt&&b.trOpt.includes(k)){b.traits.push(k);b.trOpt=null;log(`${b.name} apprend « ${TRAITS[k].n} ».`,'good')}break;
    case'renew':renew(id);break;
    case'raiseok':b.salary=b.raiseAsk;b.raiseAsk=0;b.loy=cl(b.loy+25,0,100);log(`Augmentation accordée à ${b.name} (${$(b.salary)}/sem.).`);break;
    case'raiseno':b.raiseAsk=0;b.raiseCd=S.t+8;b.loy=cl(b.loy-10,0,100);log(`Tu refuses l’augmentation de ${b.name}. Il n’est pas content.`,'bad');break;
    case'release':if(ui.confirm==='rel'+id){release(id);ui.confirm=null;ui.sheet=null}else ui.confirm='rel'+id;break;
    case'book':ui.bookFor=id;ui.tab='combats';ui.csub='book';ui.sheet=null;window.scrollTo(0,0);break;
    case'pickbook':ui.bookFor=id;break;case'poster':sharePoster(id);return;case'officesel':ui.offSel=k;break;case'ssok':ssAccept(id);break;case'ssno':ssRefuse(id);break;case'bet':{const[sd,amt]=(k||'').split(':');placeBet(id,sd,+amt);break}case'mand':mandSign(k);return render();case'cvcok':cvcAccept();break;case'cvcno':if(S.cvc){S.cvc.until=S.t-1}break;case'theme':S.theme=k;applyTheme();break;case'acadin':acadRecruit();break;case'tvbuy':if(!S.tv&&S.money>=TV_COST){S.money-=TV_COST;S.tv={subs:0,since:S.t};log(`📺 ${S.club} TV est lancée !`,'gold');toast('📺 Ta chaîne est lancée')}break;case'office':{if(S.offices&&S.offices.includes(k))break;S.offices=S.offices||[];if(S.offices.length>=OFF_MAX){toast('Maximum '+OFF_MAX+' bureaux');break}if(S.money<OFF_COST){toast('Pas assez d’argent');break}S.money-=OFF_COST;S.offices.push(k);log(`🏢 Bureau ouvert : ${flag(k)} ${NAT[k].n}.`,'good');toast(`Bureau ouvert : ${NAT[k].n}`)}break;case'openclub':ui.sheet='myclub';document.getElementById('sheet').scrollTop=0;break;case'todolist':ui.sheet='todo';document.getElementById('sheet').scrollTop=0;break;case'spall':{let n=0;for(const b of club())if(canSpend(b)){autoSpend(b);n++}toast(`⚡ Points dépensés pour ${n} boxeur${n>1?'s':''}`);break}case'opengym':ui.sheet='gym:'+id;document.getElementById('sheet').scrollTop=0;break;case'gymup':{const g=(S.branches||[]).find(x=>x.id===id);if(g&&S.money>=gymUpCost(g)){S.money-=gymUpCost(g);g.cap=(g.cap||2)+2;toast('Gym agrandi : +2 places')}break}case'gymcoach':{const g=gymOf(id),c=g&&coachCost(g);if(g&&S.money>=c&&(g.coach.stars||1)<4){S.money-=c;const nc={name:natName(g.nat),nat:g.nat,stars:(g.coach.stars||1)+1};if(g.hq)S.hq.coach=nc;else{const r=S.branches.find(x=>x.id===id);r.coach=nc}toast(`Nouvel entraîneur : ${nc.name}`)}break}case'setgym':{const b=getB(ui.sheet),g=gymOf(k);if(b&&g){if(gymBoxers(k).filter(x=>x!==b).length>=g.cap){toast('Ce gym est plein.');break}b.gym=k;toast(`${sur(b)} s’entraîne maintenant à ${g.hq?'ton gym principal':g.city}`)}break}case'amf':ui.amf=k;break;case'amopen':ui.sheet='am:'+id;document.getElementById('sheet').scrollTop=0;break;case'amscout':scoutAm(id);break;case'amsign':signAm(id);if(!(S.am||[]).some(x=>x.id===id)){ui.sheet=null;ui.esub='mine'}break;case'amtrip':if(S.money>=40000){S.money-=40000;S.amScout=k;toast('✈️ Recruteurs réservés')}break;case'gpall':{let n=0;for(const f of S.fights){const a=getB(f.a),o=getB(f.b);if(a&&a.mine&&!f.gp&&o){f.gp=bestGP(o.style)||'distance';if(f.auto===undefined)f.auto=true;n++}}ui.oc={};toast(`🤖 ${n} plan${n>1?'s':''} de match choisi${n>1?'s':''} · camps en auto`);break}case'todoall':ui.todoAll=!ui.todoAll;break;case'ebrand':ui.ebrand=k||null;ui.esub='mine';break;case'borg':ui.ebrand=k||null;ui.bookFor=null;break;case'gobrand':ui.sheet=null;ui.tab='ecurie';ui.esub='mine';ui.ebrand=id;break;case'prauto':{const p=(S.promos||[]).find(x=>x.id===id);if(p)p.auto=!p.auto;break}case'openpromo':ui.sheet='promo:'+id;document.getElementById('sheet').scrollTop=0;break;case'buypromo':buyPromo(id);break;case'sellpromo':if(ui.confirm==='sp'+id){sellPromo(id);ui.confirm=null}else{ui.confirm='sp'+id;render();return}break;case'prmove':prMove(id);break;case'pickstep':{const m=sortB(orgB().filter(b=>!b.booked&&!b.inj)),i=m.findIndex(b=>b.id===ui.bookFor);if(m.length)ui.bookFor=m[(i+(+k)+m.length)%m.length].id;break}
    case'propose':{const f=propose(ui.bookFor,id,bookOpt());if(f)afterBook(f);break}
    case'div':ui.div=k;break;
    case'sign':sign(id);ui.sheet=null;break;
    case'hire':hire(id);break;
    case'fire':if(ui.confirm==='fire'+id){fireStaff(id);ui.confirm=null}else ui.confirm='fire'+id;break;
    case'up':upgrade();break;
    case'perk':perk(k);break;
    case'gym':ui.gym=+k;break;
    case'gymboxer':ui.gymBoxer=id;break;
    case'challenge':startChallenge();return;
    case'new':case'menu':save();openMenu('home');return;
    case'fstrat':ui.fight.strat=k;ui.fight.ustr=1;if(ui.fight.stage==='live')showBub(`Tu cries : « ${STRAT[k].n} ! »`);updateFight();return;
    case'fround':goRound();return;case'rpquit':{const F=ui.fight;if(F){F.done=true;F.res=F.res||{w:null,m:'DEC',r:F.r,txt:'Reprise arrêtée'};fightDone()}return}case'entskip':entSkip();return;
    case'noticeok':S.notice=null;break;
    case'arena':buildArena();break;case'merch':buildMerch();break;
    case'mkt':doMkt(b,+k);break;case'heal':doHeal(b);break;case'cryo':doCryo(b);break;
    case'exnat':ui.exNat=k;break;case'expe':doExpe(k,ui.exNat||S.home);break;
    case'cdiv':if(ui.confirm==='cd'+k+id){changeDiv(b,+k);ui.confirm=null}else ui.confirm='cd'+k+id;break;
    case'retire':if(ui.confirm==='ret'+id){retireB(b);ui.confirm=null}else ui.confirm='ret'+id;break;
    case'neg':openNeg(id,false);return;
    case'negs':{const n=S.neg;if(n){const st=k==='sal'?Math.max(10,Math.round(n.ask.sal*.05/10)*10):Math.max(100,Math.round(n.ask.bonus*.1/100)*100);n.offer[k]=Math.max(0,n.offer[k]+(+t.dataset.v)*st)}renderNeg();return}
    case'negy':if(S.neg)S.neg.offer.yrs=+k;renderNeg();return;
    case'negp':negPropose();return;
    case'negok':negClose(true);return;
    case'negno':if(S.neg&&S.neg.forced&&ui.confirm!=='negno'){ui.confirm='negno';renderNeg();return}negClose(false);return;
    case'post':doPost(b,k);break;
    case'proposeD':{const me=getB(ui.bookFor),f=propose(ui.bookFor,id,{belts:titleDef(me,getB(id)),...bookOpt()});if(f)afterBook(f);break}
    case'bw':ui.bw=+k;ui.bev=null;break;case'bev':ui.bev=k;break;case'bevx':ui.bev=null;break;
    case'galanew':ui.gn=null;ui.sheet='galanew';break;
    case'gala':ui.sheet='gala:'+id;break;
    case'galacreate':{const g=createGala();if(g)ui.sheet='gala:'+g.id;break}
    case'gnar':ui.gn.arena=k;break;case'gnwk':ui.gn.wk=+k;break;case'gnpr':ui.gn.price=+k;break;case'gnpm':ui.gn.promo=+k;break;case'gnppv':ui.gn.ppv=!ui.gn.ppv;break;case'gncity':ui.gn.city=k;break;case'gntv':ui.gn.tv=k;ui.gn.ppv=k==='ppv';break;case'gnppvp':ui.gn.ppvp=+k;break;case'gnx':ui.gn.x=ui.gn.x||{};ui.gn.x[k]=!ui.gn.x[k];break;
    case'ggcity':case'ggtv':case'ggppvp':case'ggx':{const g=(S.galas||[]).find(x=>'gala:'+x.id===ui.sheet);if(g&&g.locked){toast('🔒 Budget verrouillé : le gala est déjà payé');break}if(g){if(a==='ggcity'){const C=GCITY.find(c=>c.id===k);if(C&&S.mgr.lvl>=C.lvl)g.city=k;else toast('Gérant niveau '+(C?C.lvl:'?')+' requis')}else if(a==='ggtv'){g.tv=k;g.ppv=k==='ppv'}else if(a==='ggppvp')g.ppvp=+k;else{g.x=g.x||{};g.x[k]=!g.x[k]}}break}
    case'gpr':case'gpm':case'gppv':{const g=(S.galas||[]).find(x=>'gala:'+x.id===ui.sheet);if(g&&g.locked){toast('🔒 Budget verrouillé : le gala est déjà payé');break}if(g){if(a==='gpr')g.price=+k;else if(a==='gpm')g.promo=+k;else g.ppv=!g.ppv}break}
    case'galaadd':ui.bev=id;ui.tab='combats';ui.csub='book';ui.sheet=null;window.scrollTo(0,0);break;
    case'skipf':if(!guardAdvance({a:'skipf',id}))return;skipTo(id);return;
    case'cauto':{const f=S.fights.find(x=>'camp:'+x.id===ui.sheet);if(f){f.auto=k==='auto';ui.cw=f.wk||0}break}
    case'cwk':ui.cw=+k;break;
    case'cfoc':{const f=S.fights.find(x=>x.id===id);if(f){f.plan=f.plan||[];const i=ui.cw??(f.wk||0);f.plan[i]=k;const tot=f.week-(f.start??f.week-4);if(i+1<tot)ui.cw=i+1}break}
    case'fac':buildFac(k);break;case'branch':openBranch(k);break;
    case'dsub':ui.dsub=k;break;case'rbody':ui.rbody=k;break;
    case'tourin':enterTour(k,ui.gymBoxer);if(ui.fight)return;break;
    case'tourgo':startTourFight();return;
    case'trial':ui.sheet=null;startTrial(id);return;
    case'fskip':skipRound();return;
    case'fsim':simAll();return;
    case'fdone':fightDone();return;
    case'fspeed':ui.fight.speed=+k;S.set.speed=+k;document.querySelectorAll('[data-a=fspeed]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.k===k));save();return;
    case'settings':ui.sheet='settings';document.getElementById('sheet').scrollTop=0;break;
    case'set':if(k==='speed')S.set.speed=+t.dataset.v;else S.set[k]=!S.set[k];ui.oc={};break;
    case'evc':chooseEvent(+k);return;
    case'camp':case'ctype':setCamp(id,k);break;
    case'fa':ui.sheet='fa:'+id;document.getElementById('sheet').scrollTop=0;break;
    case'scout':ui.backSheet=ui.sheet&&(ui.sheet.startsWith('promo:')||ui.sheet==='todo')?ui.sheet:null;ui.sheet='op:'+id;ui.sctab='rap';document.getElementById('sheet').scrollTop=0;break;
    case'opencamp':ui.sheet='camp:'+id;ui.ctab='camp';document.getElementById('sheet').scrollTop=0;break;
    case'stab':ui.stab=k;break;case'sctab':ui.sctab=k;break;case'ctab':ui.ctab=k;break;case'ssub':ui.ssub=k;break;case'clsub':ui.clsub=k;break;
    case'cint':{const f=S.fights.find(x=>x.id===id);if(f)f.int=k;break}
    case'cgp':{const f=S.fights.find(x=>x.id===id);if(f)f.gp=k;ui.oc={};break}
    case'postpone':postpone(id);break;
    case'cancelf':if(ui.confirm==='cf'+id){cancelFight(id);ui.confirm=null}else ui.confirm='cf'+id;break;
    case'flog':ui.flog=!ui.flog;updateFight();return;
    case'fcs':ui.fight.cs=k;updateFight();return;
    case'gooff':ui.tab='combats';ui.csub='off';ui.sheet=null;window.scrollTo(0,0);break;
    case'offok':{const f=acceptOffer(id);if(f){ui.sheet='camp:'+f.id;ui.ctab='camp'}break}
    case'offno':S.offers=S.offers.filter(o=>o.id!==id);break;
    case'proposeN':{const f=propose(ui.bookFor,id,{n:1,...bookOpt()});if(f)afterBook(f);break}
    case'bsc':ui.bsc=k;break;
    case'rsub':ui.rsub=k;break;
    case'rnat':ui.rnat=k;break;
    case'exp':packSave(S).then(c=>{ui.expCode=c;render()});return;
    case'copyexp':{const ta=document.getElementById('exp-code');try{navigator.clipboard.writeText(ui.expCode).then(()=>toast('Code copié !'),()=>{if(ta){ta.focus();ta.select()}toast('Sélectionne le code et copie-le')})}catch(e){if(ta){ta.focus();ta.select()}}return}
  }
  save();render();
});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.bx[role=button]')){e.preventDefault();e.target.click()}});
/* ================= SAUVEGARDES ================= */
const SK=n=>'coin-rouge-s'+n, MK=n=>'coin-rouge-m'+n;
function metaOf(s){return{club:s.club,mgr:s.mgrName,home:s.home,t:s.t,money:Math.round(s.money),lvl:s.mgr.lvl,n:s.boxers.filter(b=>b.mine).length,at:Date.now()}}
let _saveFn=0;
function save(){if(!S||!S.slot||ui.menu)return;try{localStorage.setItem(SK(S.slot),JSON.stringify(S));localStorage.setItem(MK(S.slot),JSON.stringify(metaOf(S)))}catch(e){}}
function slotMeta(n){try{return JSON.parse(localStorage.getItem(MK(n)))}catch(e){return null}}
function loadSlot(n){try{const s=JSON.parse(localStorage.getItem(SK(n)));return s&&s.v===2?s:null}catch(e){return null}}
function lastSlot(){let best=0,at=-1;for(const n of[1,2,3]){const m=slotMeta(n);if(m&&m.at>at){at=m.at;best=n}}return best}
function fixup(s){
  s.club=s.club||'Coin Rouge';s.mgrName=s.mgrName||'Gérant';s.home=s.home||'CA';s.diff=s.diff||'normal';s.offers=s.offers||[];s.champHist=s.champHist||[];
  const fx=b=>{if(b&&!b.nat)b.nat=CITYNAT[b.city]||'CA'};(s.boxers||[]).forEach(fx);(s.fa||[]).forEach(fx);(s.gyms||[]).forEach(g=>(g.m||[]).forEach(fx));
}
function migrate(){try{if(!localStorage.getItem(SK(1))){const o=localStorage.getItem(KEY);if(o){const s=JSON.parse(o);if(s&&s.v===2){s.slot=1;fixup(s);localStorage.setItem(SK(1),JSON.stringify(s));localStorage.setItem(MK(1),JSON.stringify(metaOf(s)))}}}}catch(e){}}
async function packSave(s){const j=JSON.stringify(s);
  try{if(window.CompressionStream){const st=new Blob([j]).stream().pipeThrough(new CompressionStream('gzip'));const u=new Uint8Array(await new Response(st).arrayBuffer());let bin='';for(let i=0;i<u.length;i+=8192)bin+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return'CRZ1:'+btoa(bin)}}catch(e){}
  return'CRJ1:'+btoa(unescape(encodeURIComponent(j)))}
async function unpackSave(code){code=(code||'').replace(/\s+/g,'');
  if(code.startsWith('CRZ1:')){const bin=atob(code.slice(5)),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);const st=new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(await new Response(st).text())}
  if(code.startsWith('CRJ1:'))return JSON.parse(decodeURIComponent(escape(atob(code.slice(5)))));throw new Error('format')}
function enterGame(s){
  S=s;fixup(S);S.set=Object.assign({...DEFSET},S.set||{});if(S.event===undefined)S.event=null;applyTheme();recInit();migr7();if(S.ctr&&S.ctr.list.some(id=>CTRX.includes(id)))newContracts();if(!S.rec25){S.rec25=1;for(const b of S.boxers)if(!b.mine&&!b.retired&&b.l>0&&R()<unbeatP(b)*.8){b.w+=b.l;b.l=0}}ensurePromos();h2hInit();ensureAm();syncPerks();gymInit();
  ensureAllNat();
  Object.assign(ui,{tab:'ecurie',esub:'mine',csub:'cal',sheet:null,fight:null,confirm:null,bookFor:null,div:null,oc:{},expCode:null,rsub:'monde',rnat:S.home,bsc:'niv'});
  closeMenu();render();save();
  if(S.queue.length&&!S.event)openFight(S.queue[0]);
}

function migr10(){for(const d of DIVS){if(S.boxers.filter(b=>b.div===d.id).length>=20)continue;
  for(let i=0;i<52;i++){const b=makeBoxer({div:d.id,ovr:44+i*.78+ri(-2,2),age:ri(21,33),pot:ri(0,6)});seedRecord(b);S.boxers.push(b)}
  for(let i=0;i<16;i++){const b=makeBoxer({div:d.id,nat:S.home,ovr:ri(38,56),age:ri(19,30),pot:ri(0,10)});seedRecord(b);b.pts=Math.round(b.pts*.6);S.boxers.push(b)}}}
function migr7(){migr10();S.fac=S.fac||{vest:Math.max(0,(S.gym||1)-1+((S.mgr&&S.mgr.perks.rec)||0))};for(const k in FAC)if(S.fac[k]==null)S.fac[k]=0;S.branches=S.branches||[];S.galas=S.galas||[];S.tcd=S.tcd||{};if(S.tour===undefined)S.tour=null;
  if(!S.belts){const old={};for(const b of S.boxers)if(b.champ)old[b.div]=b.id;S.belts={};for(const d of DIVS){S.belts[d.id]={};if(old[d.id])S.belts[d.id].WBC=old[d.id]}}
  for(const d of DIVS)ensureBelts(d.id);
  for(const f of S.fights){if(f.title===true){const o=getB(f.b);f.title=o&&beltsOf(o).length?beltsOf(o):['WBC']}if(f.auto==null)f.auto=true;f.plan=f.plan||[];f.bon=f.bon||{}}}
const bookOpt=()=>{const g=(S.galas||[]).find(x=>x.id===ui.bev&&!x.done&&x.week>=S.t+2);return g?{ev:g.id}:{week:S.t+(ui.bw||4)}};
/* ================= MONDE : PAYS & OFFRES ================= */
function aiNational(){
  for(const b of S.boxers){if(!b.nchamp||b.mine||b.booked||b.inj||b.retired||S.t-b.lastFight<8||R()>.06)continue;
    const c=natList(b.nat,b.div).filter(x=>x!==b&&!x.mine&&!x.booked&&!x.inj&&!x.nchamp).slice(0,3);if(!c.length)continue;
    quickFight(b,pick(c),false,true);
    const now=S.boxers.find(x=>x.nchamp&&x.nat===b.nat&&x.div===b.div);if(now&&now!==b&&b.nat===S.home)log(`${flag(b.nat)} Nouveau champion national ${divN(b.div)} : ${now.name} bat ${b.name}.`)}
}
function offersWeek(){
  S.offers=(S.offers||[]).filter(o=>{const a=getB(o.a),b=getB(o.b);return o.exp>=S.t&&a&&a.mine&&!a.booked&&b&&!b.booked});
  if(S.offers.length>=3)return;
  for(const me of club()){
    if(S.offers.length>=3)break;
    if(me.booked||me.inj||S.offers.some(o=>o.a===me.id)||R()>.06+me.fame/900)continue;
    const wl=rankList(me.div),mi=wl.indexOf(me),bl=beltsOf(me);let pool,belts=null;
    if(bl.length){pool=wl.filter(o=>bl.some(k=>bodyIdx(o,k)<10));belts=bl}
    else if(me.nchamp)pool=wl.slice(Math.max(0,mi-8),mi+4);
    else pool=mi<0||mi>60?natList(me.nat,me.div).filter(o=>natIdx(o)>=0&&natIdx(o)<natIdx(me)+3):wl.slice(Math.max(0,mi-6),mi+3);
    pool=pool.filter(o=>!o.mine&&!o.booked&&!o.inj&&!o.champ&&o!==me&&ovr(o)>=ovr(me)-6);
    if(!pool.length)continue;
    const op=pool.sort((a,b)=>ovr(b)-ovr(a))[ri(0,Math.min(2,pool.length-1))],short=!belts&&R()<.3,p=Math.round(purse(me,op,belts)*(short?1.35:1)*(.95+R()*.25)/100)*100;
    S.offers.push({id:'o'+(S.uid++),a:me.id,b:op.id,purse:p,week:S.t+(short?2:belts?8:4),exp:S.t+2,short,belts,promo:(prOf(op)||{n:pick(PROMOS)}).n});
    log(`Offre de combat pour ${me.name} contre ${flag(op.nat)} ${op.name} : ${$(myShare(p))} pour le club.`);
  }
}
function acceptOffer(id){const o=S.offers.find(x=>x.id===id);if(!o)return;S.offers=S.offers.filter(x=>x!==o);return propose(o.a,o.b,{week:Math.max(o.week,S.t+2),purse:o.purse,force:1,belts:o.belts&&o.belts.filter(k=>beltsOf(getB(o.a)).includes(k))})}

/* ================= MENU ================= */
let MF=null,MRAF=0;
function menuFight(){MF={A:{b:{look:{skin:1,hair:1,hc:0,beard:0,tr:0}}},B:{b:{look:{skin:4,hair:5,hc:0,beard:2,tr:1}}},vis:{A:mkVis(),B:mkVis()},disp:{hp:[100,100],en:[100,100]},stage:'intro',strat:'eq',rd:null,speed:1,next:0}}
function menuLoop(now){MRAF=requestAnimationFrame(menuLoop);const cv=document.getElementById('mcv');if(!cv||!MF||!cv.offsetParent)return;
  if(now>MF.next){fire(MF,{who:R()<.5?'A':'B',hit:R()<.55,body:R()<.3,dmg:0},now);MF.next=now+380+R()*720}drawFight(cv,MF,now)}
const newNG=slot=>({slot,club:'',mgr:'',home:'CA',diff:'normal',pool:[],picks:[],rr:3});
function openMenu(st){ui.menu=st||'home';ui.fight=null;AN=null;if(RAF){cancelAnimationFrame(RAF);RAF=0}['fx','sheet','ev'].forEach(i=>document.getElementById(i).hidden=true);
  renderMenu();if(!MRAF){menuFight();MRAF=requestAnimationFrame(menuLoop)}}
function closeMenu(){ui.menu=null;document.getElementById('menu').hidden=true;if(MRAF){cancelAnimationFrame(MRAF);MRAF=0}}
function slotRow(n,mode){const m=slotMeta(n),act=mode==='load'?'m_ld':'m_slot';
  return`<div class="slot ${m?'':'empty'}"><button class="slotb" data-a="${act}" data-k="${n}" ${mode==='load'&&!m?'disabled':''}><span class="sn">${n}</span><div><b>${m?flag(m.home)+' '+esc(m.club):'Emplacement vide'}</b>
    <span class="small">${m?`${esc(m.mgr)} · ${when(m.t)} · ${$(m.money)} · ${m.n} boxeur${m.n>1?'s':''}`:'Commence une nouvelle carrière ici'}</span>
    ${mode==='slot'&&m&&ui.mconf==='ow'+n?'<span class="err">Touche encore pour écraser cette partie</span>':''}</div></button>
    ${m&&mode==='load'?`<button class="btn sm danger" data-a="m_del" data-k="${n}">${ui.mconf==='del'+n?'Confirmer':'Effacer'}</button>`:''}</div>`}
function pickCard(b,i){const sel=ui.ng.picks.includes(i);
  return`<button class="bx ${tcls(b)} pk" data-a="m_pick" data-k="${i}" aria-pressed="${sel}">
    <div class="row" style="justify-content:space-between;margin-bottom:10px"><span class="tier-tag">${b.grp} · ${tierOf(b)[2]}</span>${sel?'<span class="chip gold">✓ Choisi</span>':`<span class="chip">Potentiel ${potG(b)}</span>`}</div>
    <div class="bx-h"><div class="av">${avatar(b)}</div><div class="bx-id"><div class="nm">${esc(b.name)}</div><div class="sub">${flag(b.nat)} ${esc(b.city)} · ${b.age} ans</div>
      <div class="chips"><span class="chip">${divN(b.div)}</span><span class="chip">${STYLES[b.style]}</span></div></div><div class="ovr"><b>${ovr(b)}</b><small>NOTE</small></div></div>
    <div class="s5" style="margin-top:11px">${STATS.map(([k,,a])=>`<div><small>${a}</small><b class="${tone(b[k])}">${Math.floor(b[k])}</b></div>`).join('')}</div>
    ${b.traits.length?`<div class="chips" style="margin-top:9px">${traitChips(b)}</div>`:''}
    <div class="row small" style="justify-content:space-between;margin-top:10px"><span>Fiche ${rec(b)}</span><span>${$(b.salary)}/sem.</span></div></button>`}
const CLUB_A=['Gym','Club de boxe','Académie','Écurie','Boxing Club','Fight Club'],CLUB_B=['Coin Rouge','Saint-Henri','Les Faucons','Titan','La Forge','Main de Fer','Hochelaga','Ring d’Or','Les Cogneurs','Phénix','Lionheart','Le Bastion','Gants d’Acier','Nord-Est','Le Dernier Round'];
const TOPNAT=['CA','US','MX','GB','FR','JP'];
function ngSteps(i){return`<div class="ngp">${['Club','Pays','Niveau','Boxeurs'].map((n,j)=>`<div class="${j<=i?'on':''} ${j===i?'cur':''}"><i></i>${n}</div>`).join('')}</div>`}
function ngCard(g){const nm=(g.club||'').trim()||'Coin Rouge';return`<div class="ngcard"><div class="crest" id="ng-ci">${esc(initials(nm))}</div><div style="min-width:0"><b id="ng-cn">${esc(nm)}</b><span>${flag(g.home)} ${NAT[g.home].n} · Gérant : <span id="ng-cm">${esc((g.mgr||'').trim()||'toi')}</span>${g.diff?` · ${DIFF[g.diff].n}`:''}</span></div></div>`}
const ngBar=(back,next,label,dis)=>`<div class="mbar ngbar"><div class="row">${back?`<button class="btn" data-a="${back}" style="flex:none">←</button>`:''}<button class="btn pri big" style="flex:1" data-a="${next}" ${dis?'disabled':''}>${label}</button></div></div>`;
function pickCard2(b,i){const sel=ui.ng.picks.includes(i),gc=b.grp==='Espoir'?'e':b.grp==='Confirmé'?'c':'v';
  return`<div class="pkw"><button class="pkc" data-a="m_pick" data-k="${i}" aria-pressed="${sel}"><div class="av ${tcls(b)}">${avatar(b)}</div>
    <div style="min-width:0"><div class="nm">${sel?'✓ ':''}${esc(b.name)}</div><div class="meta"><span class="grp ${gc}">${b.grp}</span>${flag(b.nat)} ${b.age} ans · ${divN(b.div)}</div>
    <div class="st">${STATS.map(([k,,a])=>`<span>${a} <b class="${tone(b[k])}">${Math.floor(b[k])}</b></span>`).join('')}</div>
    <div class="st"><span>Pot. <b>${potG(b)}</b></span><span>${STYLES[b.style]}</span><span>${$(b.salary)}/s</span></div></div>
    <div class="ovr"><b>${ovr(b)}</b><small>NOTE</small></div></button><button class="pki" data-a="m_info" data-k="${i}">📋 Voir la fiche</button></div>`}
function ngInfo(g){const i=g.info,b=g.pool[i];if(!b)return'';const sel=g.picks.includes(i),p=b.pot,cap=Math.min(99,b.pot+6);
  return`<div class="ngsheet gut" role="dialog" aria-label="Fiche de ${esc(b.name)}"><div class="mwrap" style="padding-top:16px"><button class="back" data-a="m_infox">← Retour aux boxeurs</button>${heroC(b,'red')}
    <div class="panel"><span class="lab">Potentiel ${potG(b)}</span><p class="small" style="margin:6px 0 0">${b.grp==='Espoir'?`Jeune et brut : il peut monter jusqu’à <b>${cap}</b> par stat avec l’entraînement. C’est un pari sur l’avenir.`:b.grp==='Confirmé'?`Déjà solide, il peut encore monter jusqu’à <b>${cap}</b> par stat.`:`Prêt à gagner tout de suite, mais il progressera peu (limite <b>${cap}</b> par stat) et vieillit bientôt.`}</p></div>
    ${statsPanel(b,false)}${agePanel(b)}
    <div class="panel"><span class="lab">Traits</span><div class="tgrid" style="margin-top:8px">${traitList(b)}</div></div>
    <div class="panel"><div class="s4">${[[rec(b).split(' · ')[0],'Fiche'],[b.ko,'KO'],[STYLES[b.style],'Style'],[$(b.salary),'Salaire / sem.']].map(([v,l])=>`<div><b style="font-size:15px">${v}</b><small>${l}</small></div>`).join('')}</div></div>
    <div class="mbar ngbar"><div class="row"><button class="btn" data-a="m_infox" style="flex:none">←</button><button class="btn ${sel?'':'pri'} big" style="flex:1" data-a="m_pickx" data-k="${i}">${sel?'Retirer de mon choix':'✓ Choisir ce boxeur'}</button></div></div></div></div>`}

/* ===== sauvegardes reliées au compte (nuage) ===== */
const CS={busy:false,q:{},tm:0,last:0,err:''};
const giftKey=n=>'cr_gift_'+n;
async function cloudPush(n){if(!ON)return;const s=loadSlot(n),m=slotMeta(n);if(!s||!m)return;
  try{const data=await packSave(s);await rpc('cr_save_put',{p_token:ON.token,p_slot:n,p_data:data,p_meta:m});CS.last=Date.now();CS.err=''}catch(e){CS.err=e.message;CS.q[n]=1}}
async function cloudFlush(){clearTimeout(CS.tm);CS.tm=0;const ns=Object.keys(CS.q).map(Number);CS.q={};for(const n of ns)await cloudPush(n)}
function cloudQueue(n){if(!ON||!n)return;CS.q[n]=1;if(!CS.tm)CS.tm=setTimeout(cloudFlush,15000)}
async function cloudGift(n0,c){const prev=S;let n=n0;if(slotMeta(n0)){const e=[1,2,3].find(x=>!slotMeta(x));if(e)n=e}try{const g=c.meta||{};
    localStorage.setItem(giftKey(n0),String(g.gid||1));
    maxGame(n);S.money=onI(g.money,0,9e9,700000000);S.club=onT(g.club,24)||S.club;S.mgrName=onT(g.mgr,20)||S.mgrName;S.slot=n;
    localStorage.setItem(SK(n),JSON.stringify(S));localStorage.setItem(MK(n),JSON.stringify(metaOf(S)));localStorage.setItem(giftKey(n),String(g.gid||1))}
  catch(e){CS.err='gift'}finally{S=prev}await cloudPush(n);if(n!==n0){if(slotMeta(n0))await cloudPush(n0);else await rpc('cr_save_put',{p_token:ON.token,p_slot:n0,p_data:null,p_meta:null}).catch(()=>{})}toast('🎁 Ta nouvelle carrière est prête dans l’emplacement '+n+' !')}
async function cloudSync(){if(!ON||CS.busy)return;CS.busy=true;if(ui.menu==='home')renderMenu();
  try{const r=await rpc('cr_save_list',{p_token:ON.token});const cl=Array.isArray(r.slots)?r.slots:[];let got=0;
    for(const n of[1,2,3]){const c=cl.find(x=>x&&x.slot===n),lm=slotMeta(n);
      if(c){const cm=c.meta||{},ca=+cm.at||0;
        if(cm.gift){if(localStorage.getItem(giftKey(n))!==String(cm.gid||1))await cloudGift(n,c);continue}
        if(!lm||ca>(+lm.at||0)+2000){const g=await rpc('cr_save_get',{p_token:ON.token,p_slot:n});
          if(g&&g.data){const sv=await unpackSave(g.data);if(sv&&sv.v===2){sv.slot=n;localStorage.setItem(SK(n),JSON.stringify(sv));localStorage.setItem(MK(n),JSON.stringify(Object.assign(metaOf(sv),{at:ca||Date.now()})));got++}}}
        else if((+lm.at||0)>ca+2000)CS.q[n]=1}
      else if(lm)CS.q[n]=1}
    await cloudFlush();CS.last=Date.now();CS.err='';if(got)toast(`☁️ ${got} sauvegarde${got>1?'s':''} récupérée${got>1?'s':''} de ton compte`)}
  catch(e){CS.err=e.message}
  CS.busy=false;if(ui.menu==='home')renderMenu()}
const _save58=save;save=function(){_save58();if(S&&S.slot&&!S.onStub&&!ui.menu)cloudQueue(S.slot)};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&Object.keys(CS.q).length)cloudFlush()});
setTimeout(()=>{if(ON)cloudSync()},1800);
function vCloudCard(){if(ON)return`<div class="cloudc ok"><span class="ci">☁️</span><span><b>Sauvegardes reliées à ${esc(ON.name||'ton compte')}</b><i>${CS.busy?'Synchronisation…':CS.err?'Pas de connexion : on réessaie plus tard':'À jour · même si tu changes de téléphone'}</i></span></div>`;
  return`<button class="cloudc warn" data-a="m_online"><span class="ci">⚠️</span><span><b>Tes carrières sont seulement sur ce téléphone</b><i>Connecte-toi pour les relier à ton compte et ne plus jamais les perdre ›</i></span></button>`}

function renderMenu(){
  const el=document.getElementById('menu'),st=ui.menu,back='<button class="back" data-a="m_home">← Menu</button>';let h='';
  if(st==='home'){const n=lastSlot(),m=n&&slotMeta(n),cnt=[1,2,3].filter(x=>slotMeta(x)).length;
    h=`<div class="mstage"><canvas id="mcv" aria-hidden="true"></canvas></div><div class="mwrap gut">
      <div class="logo"><img class="mlogo" src="${bmImg()}" alt=""><h1>Fight<br>Dynasty</h1><span class="tag">Gestion de boxe</span></div>
      ${vCloudCard()}
      ${m?`<button class="mbtn pri" data-a="m_cont"><b>Continuer</b><span>${flag(m.home)} ${esc(m.club)} · ${when(m.t)} · ${$(m.money)}</span></button>`:''}
      <button class="mbtn mon" data-a="m_online"><b>🌐 En ligne</b><span>Bâtis ton écurie en ligne : un boxeur par catégorie, monte au classement mondial</span></button>
      <button class="mbtn ${m?'':'pri'}" data-a="m_new"><b>Nouvelle carrière</b><span>Crée ton club, choisis ton pays et tes deux premiers boxeurs</span></button>
      <button class="mbtn" data-a="m_load" ${cnt?'':'disabled'}><b>Charger une partie</b><span>${cnt?`${cnt} sauvegarde${cnt>1?'s':''} sur 3`:'Aucune sauvegarde'}</span></button>
      <button class="mbtn" data-a="m_lang" data-noi18n><b>🌍 ${LANG==='en'?'Language':'Langue'}</b><span>${LANG==='en'?'English · tap for Français':'Français · touche pour English'}</span></button>
      <button class="mbtn" data-gfb><b>💬 Donner mon avis</b><span>Dis-nous ce qui marche et ce qu’il faut améliorer</span></button>
      <div class="row" style="justify-content:center;gap:8px;margin-top:6px"><button class="btn sm" data-a="m_au" data-k="music">${AU.music?'🎵 Musique':'🎵 Musique (coupée)'}</button><button class="btn sm" data-a="m_au" data-k="sfx">${AU.sfx?'🔊 Sons':'🔇 Sons (coupés)'}</button></div>
      <p class="mfoot">Aucun avantage à acheter · Aucune pub<br><span class="vtag">VERSION TEST ${GAME_V}</span></p></div>`}
  else if(st==='onslot'){h=`<div class="mwrap gut" style="padding-top:16px">${back}<h2>🌐 En ligne</h2><p class="lede">Choisis une partie pour entrer en ligne (ton écurie en ligne est séparée de ta carrière, elle ne change rien).</p>
      <div class="stack">${[1,2,3].filter(n=>slotMeta(n)).map(n=>{const m=slotMeta(n);return`<button class="mbtn" data-a="m_onld" data-k="${n}"><b>${flag(m.home)} ${esc(m.club)}</b><span>${when(m.t)} · ${$(m.money)}</span></button>`}).join('')}</div></div>`}
  else if(st==='load'||st==='slot'){h=`<div class="mwrap gut" style="padding-top:16px">${back}<h2>${st==='load'?'Charger une partie':'Choisis un emplacement'}</h2>
      ${st==='slot'?'<p class="lede">Les 3 emplacements sont pris. Choisis celui à remplacer.</p>':''}<div class="stack">${[1,2,3].map(n=>slotRow(n,st)).join('')}</div></div>`}
  else if(st==='ng1'){const g=ui.ng;h=`<div class="mwrap gut" style="padding-top:16px">${back}${ngSteps(0)}<span class="lab">Nouvelle carrière · emplacement ${g.slot}</span><h2>Fonde ton club</h2>
      ${ngCard(g)}
      <div class="panel stack"><label class="fld"><span>Nom du club</span><div class="inrow"><input id="ng-club" maxlength="24" placeholder="Coin Rouge" value="${esc(g.club)}" autocomplete="off"><button class="btn" data-a="m_rclub" aria-label="Nom au hasard">🎲</button></div></label>
        <label class="fld"><span>Ton nom de gérant</span><div class="inrow"><input id="ng-mgr" maxlength="24" placeholder="Ton nom" value="${esc(g.mgr)}" autocomplete="off"><button class="btn" data-a="m_rmgr" aria-label="Nom au hasard">🎲</button></div></label></div>
      <p class="small" style="margin:0">Pas d’idée ? Touche 🎲 pour un nom au hasard. Tu pourras jouer avec n’importe quel nom.</p>
      ${ngBar('','m_ngc','Suivant →')}</div>`}
  else if(st==='ngc'){const g=ui.ng,oth=Object.keys(NAT).filter(c=>!TOPNAT.includes(c));h=`<div class="mwrap gut" style="padding-top:16px">${back}${ngSteps(1)}<h2>Ton pays</h2>
      ${ngCard(g)}
      <p class="small" style="margin:0">Tes premiers espoirs viennent d’ici, et tu montes d’abord le classement national de ce pays avant de viser les ceintures mondiales.</p>
      <div class="bflags">${TOPNAT.map(c=>`<button class="bfl" data-a="m_nat" data-k="${c}" aria-pressed="${g.home===c}"><span>${flag(c)}</span>${NAT[c].n}</button>`).join('')}</div>
      <label class="fld"><span>Autres pays</span><select class="selx" data-sa="m_nat" style="margin:0">${!TOPNAT.includes(g.home)?'':'<option value="" selected>Choisir un autre pays…</option>'}${oth.map(c=>`<option value="${c}" ${g.home===c?'selected':''}>${flag(c)} ${NAT[c].n}</option>`).join('')}</select></label>
      ${ngBar('m_ng1','m_ngd','Suivant →')}</div>`}
  else if(st==='ngd'){const g=ui.ng,IC={facile:'🟢',normal:'🟡',difficile:'🔴'},BL={facile:['50 000 $ pour commencer','Entraîneur-chef 2 étoiles','Pour découvrir le jeu tranquille'],normal:['25 000 $ pour commencer','Un vieil entraîneur bénévole (1 étoile)','L’expérience prévue : chaque choix compte'],difficile:['10 000 $ seulement','Aucun staff au départ','Pour les vrais gérants : chaque dollar compte']};
    h=`<div class="mwrap gut" style="padding-top:16px">${back}${ngSteps(2)}<h2>Ton niveau</h2>
      ${ngCard(g)}
      <div class="stack" style="gap:8px">${Object.entries(DIFF).map(([k,d])=>`<button class="difc" data-a="m_diff" data-k="${k}" aria-pressed="${g.diff===k}"><i>${IC[k]||'⚪'}</i><b>${d.n}${k==='normal'?' <span class="chip gold" style="font-size:10px">Conseillé</span>':''}</b><ul>${(BL[k]||[d.d]).map(x=>`<li>${x}</li>`).join('')}</ul></button>`).join('')}</div>
      ${ngBar('m_ngc','m_ng2','Choisir mes boxeurs →')}</div>`}
  else if(st==='ng2'){const g=ui.ng,flt=g.flt||'all',idx=g.pool.map((b,i)=>i).filter(i=>flt==='all'||g.pool[i].grp===flt),pk=g.picks.map(i=>g.pool[i]);
    h=`<div class="mwrap gut" style="padding-top:16px"><button class="back" data-a="m_ngd2">← Ton niveau</button>${ngSteps(3)}<h2>Tes 2 premiers boxeurs</h2>
      <p class="small" style="margin:0"><span class="grp e">Espoir</span> faible mais peut devenir une légende · <span class="grp c">Confirmé</span> solide tout de suite · <span class="grp v">Vétéran</span> gagne maintenant, ne progresse plus.</p>
      ${segH('m_flt',[['all','Tous'],['Espoir','Espoirs'],['Confirmé','Confirmés'],['Vétéran','Vétérans']],flt)}
      <div class="stack" style="gap:8px">${idx.map(i=>pickCard2(g.pool[i],i)).join('')}</div>${g.info!=null?ngInfo(g):''}
      <div class="mbar ngbar"><div class="tray">${[0,1].map(j=>pk[j]?`<div class="ts on"><div class="av">${avatar(pk[j])}</div><b>${esc(sur(pk[j]))} · ${ovr(pk[j])}</b></div>`:`<div class="ts">Boxeur ${j+1} : touche une carte</div>`).join('')}</div>
        <div class="row"><button class="btn" data-a="m_rr" ${g.rr?'':'disabled'} style="flex:none">🎲 ${g.rr}</button><button class="btn pri big" style="flex:1" data-a="m_go" ${pk.length===2?'':'disabled'}>${pk.length===2?'🥊 Commencer':'Choisis encore '+(2-pk.length)}</button></div></div></div>`}
  else if(st==='imp'){h=`<div class="mwrap gut" style="padding-top:16px">${back}<h2>Importer</h2>
      <div class="panel"><p class="small" style="margin:0">Sur ton autre appareil : Réglages (l’engrenage) → Exporter ma sauvegarde → Copier le code. Colle-le ici.</p>
        <textarea id="imp-code" rows="6" placeholder="CRZ1:…" aria-label="Code de sauvegarde">${esc(ui.imp||'')}</textarea>
        <span class="lab">Emplacement</span><div class="seg" style="margin-top:6px">${[1,2,3].map(n=>`<button data-a="m_impslot" data-k="${n}" aria-pressed="${ui.impSlot===n}">${n}${slotMeta(n)?' · occupé':''}</button>`).join('')}</div>
        ${ui.impErr?`<p class="err">${ui.impErr}</p>`:''}<button class="btn pri big" style="margin-top:12px" data-a="m_impgo">Importer et jouer</button></div>
      
      </div>`}
  el.innerHTML=h;el.hidden=false;
}
function sandboxGame(slot){
  worldGen({club:'Coin Rouge Test',mgr:'Testeur',home:'CA',diff:'facile',slot:slot||1});
  Object.assign(S,{money:2000000,gym:5});Object.assign(S.mgr,{lvl:12,pts:6,xp:0});
  S.staff={coach:{id:'s1',role:'coach',name:'Réjean Tremblay',stars:5,salary:1500},phys:{id:'s2',role:'phys',name:'Marc Gagnon',stars:4,salary:1000},cut:{id:'s3',role:'cut',name:'Luc Roy',stars:4,salary:1000},spar:[{id:'s4',role:'spar',name:'Kevin Côté',stars:4,salary:1000},{id:'s5',role:'spar',name:'Hugo Morin',stars:3,salary:600}]};
  for(const k in FAC)S.fac[k]=Math.min(FAC[k].max,3);S.branches=[{city:'Québec',nat:'CA',t:1},{city:'Laval',nat:'CA',t:1}];
  const spec=[['welter',86,27,4,'agr'],['moyen',80,25,6,'eq'],['leger',76,23,12,'pru'],['lourd',74,28,3,'agr'],['plume',66,20,24,'corps'],['welter',58,18,32,'eq']];
  spec.forEach(([div,o,age,pot,st],i)=>{const b=makeBoxer({div,nat:'CA',ovr:o,age,pot});seedRecord(b);
    Object.assign(b,{mine:true,style:st,morale:85,loy:80,plan:'normal',lastFight:-2,hist:[],lvl:Math.max(1,Math.round((o-40)/3)),xp:0,sp:10,contract:52,fame:cl(Math.round((o-40)*1.6),5,95),inj:0,fatigue:5,booked:false,pal:{5:1,10:1,15:1}});
    b.salary=marketSal(b);b.pts=Math.max(b.pts,(o-40)*10);if(i===0){b.nick='Le Marteau';b.traits=['bombe','finisseur','fer']}S.boxers.push(b)});
  const ch=mine()[0];S.belts.welter.WBC=ch.id;S.belts.welter.IBO=ch.id;syncChamp();
  for(const d of DIVS)ensureBelts(d.id);ensureAllNat();newContracts();
  log('Partie de test : 2 000 000 $, 6 boxeurs, staff et installations au maximum de test. Amuse-toi !','gold');
}
function maxGame(slot){
  worldGen({club:'Coin Rouge Empire',mgr:'Le Boss',home:'CA',diff:'facile',slot:slot||1});
  Object.assign(S,{money:50000000,gym:5});Object.assign(S.mgr,{lvl:30,pts:0,xp:0,perks:{neg:3,mot:3,rec:3,res:3,ges:3}});
  S.staff={coach:{id:'s1',role:'coach',name:'Réjean Tremblay',stars:5,salary:1500},phys:{id:'s2',role:'phys',name:'Marc Gagnon',stars:5,salary:1500},cut:{id:'s3',role:'cut',name:'Luc Roy',stars:5,salary:1500},spar:[{id:'s4',role:'spar',name:'Kevin Côté',stars:5,salary:1500},{id:'s5',role:'spar',name:'Hugo Morin',stars:5,salary:1500}]};
  for(const k in FAC)S.fac[k]=FAC[k].max;
  S.branches=['Québec','Laval','Gatineau','Sherbrooke','Trois-Rivières','Toronto'].map(c=>({city:c,nat:'CA',t:1}));
  for(const g of S.gyms)g.beaten=3;S.stats.badges=8;S.stats.trophies=12;
  const goodT=['fer','finisseur','bombe','moteur','eclair','roc','contre','showman','bosseur','fidele'];
  DIVS.forEach((d,di)=>{[[99,28,'champ'],[60,18,'kid']].forEach(([o,age,kind],j)=>{
    const b=makeBoxer({div:d.id,nat:'CA',ovr:o,age,pot:kind==='kid'?39:0});seedRecord(b);
    if(kind==='champ'){for(const k of['pow','spd','def','sta','chin'])b[k]=99;b.w=40+ri(0,8);b.l=0;b.d=0;b.ko=Math.round(b.w*.8);b.fame=100;b.nick=pick(NICKS)}
    else if(kind==='elite'){for(const k of['pow','spd','def','sta','chin'])b[k]=ri(88,95);b.w=28+ri(0,6);b.l=ri(0,2);b.ko=Math.round(b.w*.6);b.fame=85}
    else{b.pot=99;b.w=8;b.l=0;b.d=0;b.ko=6;b.fame=40}
    b.traits=kind==='kid'?['bosseur','fidele','eclair']:[...goodT].sort(()=>R()-.5).slice(0,4);
    Object.assign(b,{mine:true,style:pick(['agr','eq','pru','corps']),morale:100,loy:100,plan:'normal',lastFight:-2,hist:[],lvl:kind==='kid'?8:30,xp:0,sp:kind==='kid'?30:0,contract:156,inj:0,fatigue:0,booked:false,pal:{5:1,10:1,15:1,20:1,25:1,30:1},msDone:[]});
    b.salary=Math.round(demandSal(b)*.6/10)*10;b.pts=Math.max(b.pts,(ovr(b)-40)*12);S.boxers.push(b);
    if(kind==='champ'){for(const k of BELTS)S.belts[d.id][k]=b.id;b.nchamp=true}})});
  syncChamp();for(const b of S.boxers)if(!b.mine&&b.nchamp&&mine().some(m=>m.nchamp&&m.div===b.div&&m.nat===b.nat))b.nchamp=false;
  for(const d of DIVS)ensureBelts(d.id);ensureAllNat();newContracts();
  log('Partie maximale : 50 M$, gérant niveau 30, 18 boxeurs dont 9 champions undisputed. Tout est au maximum.','gold');
}
const MYSAVE='';
async function loadMine(){let s;try{s=await unpackSave(MYSAVE)}catch(e){ui.impErr='Impossible de lire la sauvegarde intégrée.';renderMenu();return}s.slot=ui.impSlot||1;fixup(s);ui.menu=null;enterGame(s);toast('Ta sauvegarde est chargée !')}
async function doImport(){
  const ta=document.getElementById('imp-code');ui.imp=ta?ta.value:ui.imp;let s;
  try{s=await unpackSave(ui.imp);if(!s||s.v!==2||!Array.isArray(s.boxers))throw 0}catch(e){ui.impErr='Ce code ne fonctionne pas. Vérifie qu’il est complet : il commence par CRZ1: ou CRJ1:.';renderMenu();return}
  s.slot=ui.impSlot||1;fixup(s);ui.imp='';ui.menu=null;enterGame(s);toast('Sauvegarde importée !');
}
function menuAct(a,t){
  const k=t.dataset.k;if(a!=='m_del'&&a!=='m_slot')ui.mconf=null;
  switch(a){
    case'm_home':ui.menu='home';break;
    case'm_cont':{const n=lastSlot(),s=n&&loadSlot(n);if(s){s.slot=n;ui.menu=null;enterGame(s);return}break}
    case'm_online':onEnter();setTimeout(()=>tutStart('on'),900);return;case'm_lang':setLang(LANG==='en'?'fr':'en');return;
    case'm_au':auToggle(t.dataset.k);return;
    case'm_onld':{const s=loadSlot(+k);if(s){s.slot=+k;ui.menu=null;enterGame(s);ui.tab='online';render();return}break}
    case'm_load':ui.menu='load';break;
    case'm_ld':{const s=loadSlot(+k);if(s){s.slot=+k;ui.menu=null;enterGame(s);return}break}
    case'm_del':if(ui.mconf==='del'+k){try{localStorage.removeItem(SK(k));localStorage.removeItem(MK(k))}catch(e){}if(ON)rpc('cr_save_put',{p_token:ON.token,p_slot:+k,p_data:null,p_meta:null}).catch(()=>{});ui.mconf=null}else ui.mconf='del'+k;break;
    case'm_new':{setTimeout(()=>tutStart('car'),300);const e=[1,2,3].find(n=>!slotMeta(n));if(e){ui.ng=newNG(e);ui.menu='ng1'}else ui.menu='slot';break}
    case'm_slot':{const n=+k;if(slotMeta(n)&&ui.mconf!=='ow'+n){ui.mconf='ow'+n;break}ui.mconf=null;ui.ng=newNG(n);ui.menu='ng1';break}
    case'm_nat':if(k)ui.ng.home=k;break;
    case'm_ngc':{const g=ui.ng;g.club=(g.club||'').trim();g.mgr=(g.mgr||'').trim();ui.menu='ngc';document.getElementById('menu').scrollTop=0;break}
    case'm_ngd':ui.menu='ngd';document.getElementById('menu').scrollTop=0;break;
    case'm_ngd2':ui.menu='ngd';break;
    case'm_rclub':ui.ng.club=pick(CLUB_A)+' '+pick(CLUB_B);break;
    case'm_rmgr':ui.ng.mgr=natName(ui.ng.home);break;
    case'm_flt':ui.ng.flt=k;break;
    case'm_info':ui.ng.info=+k;break;
    case'm_infox':ui.ng.info=null;break;
    case'm_pickx':{const i=+k,p=ui.ng.picks;if(p.includes(i))ui.ng.picks=p.filter(x=>x!==i);else{if(p.length>=2)p.shift();p.push(i)}ui.ng.info=null;break}
    case'm_diff':ui.ng.diff=k;break;
    case'm_ng2':{const g=ui.ng;g.club=(g.club||'').trim()||'Coin Rouge';g.mgr=(g.mgr||'').trim()||'Gérant';worldGen(g);genPool();ui.menu='ng2';document.getElementById('menu').scrollTop=0;break}
    case'm_pick':{const i=+k,p=ui.ng.picks;if(p.includes(i))ui.ng.picks=p.filter(x=>x!==i);else{if(p.length>=2)p.shift();p.push(i)}break}
    case'm_rr':if(ui.ng.rr>0){ui.ng.rr--;genPool()}break;
    case'm_back1':case'm_ng1':ui.menu='ng1';break;
    case'm_go':ui.menu=null;finishNew();return;
    case'm_imp':ui.menu='imp';ui.impErr='';ui.impSlot=ui.impSlot||([1,2,3].find(n=>!slotMeta(n))||1);break;
    case'm_impslot':ui.impSlot=+k;break;
    case'm_impgo':doImport();return;
    case'm_mine':loadMine();return;
    case'm_max':{maxGame(ui.impSlot||1);const s=S;ui.menu=null;enterGame(s);toast('Partie maximale chargée !');return}
    case'm_sand':{sandboxGame(ui.impSlot||1);const s=S;ui.menu=null;enterGame(s);toast('Partie de test chargée !');return}
  }
  renderMenu();
}

/* ================= VUES : CLASSEMENTS & OFFRES ================= */
function vGalas(){
  const up=(S.galas||[]).filter(g=>!g.done).sort((a,b)=>a.week-b.week),past=(S.galas||[]).filter(g=>g.done).slice(-4).reverse();
  return`<p class="lede">Organise tes propres soirées : tu choisis l’arène, la date et le prix des billets, tu paies les adversaires et tu gardes les revenus.</p>
    <button class="btn pri big" data-a="galanew">🎪 Organiser un gala</button>
    <div class="list" style="margin-top:10px">${up.map(g=>{const e=galaEst(g);return`<button class="panel fm" data-a="gala" data-id="${g.id}"><div class="row" style="justify-content:space-between"><b class="nm" style="font-size:20px">${esc(g.name)}</b><span class="small">${g.week===S.t?'Ce soir':`Dans ${g.week-S.t} sem.`}</span></div>
      <div class="row small" style="justify-content:space-between"><span>${e.ar.n} · ${e.n} combat${e.n>1?'s':''}</span><span>${e.att.toLocaleString('fr-CA')}/${e.cap.toLocaleString('fr-CA')} places</span></div>
      <div class="row" style="justify-content:space-between"><span class="small">Profit estimé</span><b class="num" style="color:${e.profit>=0?'var(--green)':'#ff7b8b'}">${e.profit>=0?'+':''}${$(e.profit)}</b></div><span class="small" style="color:var(--gold);font-weight:800">Gérer le gala ›</span></button>`}).join('')}</div>
    ${past.length?`<div class="panel" style="margin-top:10px"><span class="lab">Galas passés</span><ul class="log">${past.map(g=>`<li><b>${esc(g.name)}</b> · ${when(g.week)}<br><span class="small">${g.res.cancel?'Annulé':`${g.res.att.toLocaleString('fr-CA')} spectateurs${g.res.ppvBuys?' · '+g.res.ppvBuys.toLocaleString('fr-CA')+' PPV':''}`} · ${g.res.cancel?'−'+$(g.res.loss):(g.res.profit>=0?'+':'')+$(g.res.profit)}</span></li>`).join('')}</ul></div>`:''}`;
}
function galaOpts(g,pf){const C=GCITY.find(c=>c.id===(g.city||'home'))||GCITY[0],tv=g.tv||(g.ppv?'ppv':'loc'),X=g.x||{};
  return`<div class="panel"><span class="lab">Ville hôte</span>${selH(pf+'city',GCITY.map(c=>[c.id,`${c.nat?flag(c.nat)+' ':'🏠 '}${c.n}${c.fee?' · frais '+moneyS(c.fee):''}${S.mgr.lvl<c.lvl?' · 🔒 niv. '+c.lvl:''}`]),g.city||'home')}<p class="small" style="margin:0">${C.d}</p></div>
  <div class="panel"><span class="lab">Diffusion</span><div style="margin-top:8px">${segH(pf+'tv',GTV.filter(t=>t.id!=='own'||S.tv).map(t=>[t.id,t.n]),tv)}</div>
    <p class="small" style="margin:6px 0 0">${tv==='none'?'Aucun revenu télé.':tv==='loc'?'Petits droits télé, dès que la carte est un peu connue.':tv==='str'?'Une plateforme paie des droits fixes si la carte a 70+ de popularité.':tv==='big'?'Gros chèque d’une grande chaîne, seulement pour une carte de 110+ de popularité.':tv==='own'?'Diffusé sur ta chaîne : pas de droits à payer, et ça fait grimper tes abonnés.':'Tu vends le combat principal toi-même (25 000 $ de production). Payant seulement si le combat principal est très populaire (90+).'}</p>
    ${tv==='ppv'?`<div style="margin-top:8px"><span class="small">Prix du PPV</span>${segH(pf+'ppvp',PPVP.map(p=>[p,p+' $']),g.ppvp||60)}</div>`:''}</div>
  <div class="panel"><span class="lab">Extras</span>${Object.entries(GX).map(([k,x])=>`<div class="perk"><div><b>${x.n} · ${$(x.c)}</b><div class="small">${x.d}</div></div><button class="sw" data-a="${pf}x" data-k="${k}" aria-pressed="${!!X[k]}" aria-label="${x.n}"><i></i></button></div>`).join('')}</div>`}
function vGalaNew(){
  const n=ui.gn=ui.gn||{name:'',arena:'salle',wk:6,price:35,promo:3000,ppv:false,city:'home',tv:'loc',ppvp:60,x:{}};n.x=n.x||{};
  return`<div class="in"><button class="back" data-a="close">← Retour</button><h2>Nouveau gala</h2>
    <div class="panel"><label class="fld"><span>Nom de la soirée</span><input id="gn-name" maxlength="28" placeholder="${esc(S.club)} Fight Night ${(S.galas||[]).length+1}" value="${esc(n.name)}" autocomplete="off"></label></div>
    <div class="panel"><span class="lab">Arène</span><div class="list" style="margin-top:8px">${arenaList().map(a=>{const lock=S.mgr.lvl<a.lvl;return`<button class="opt" data-a="gnar" data-k="${a.id}" aria-pressed="${n.arena===a.id}" ${lock?'disabled':''}><b>${a.n}</b><span>${a.cap.toLocaleString('fr-CA')} places · location ${$(a.rent)}${lock?` · gérant niveau ${a.lvl} requis`:''}</span></button>`}).join('')}</div></div>
    <div class="panel"><span class="lab">Date</span><div style="margin-top:8px">${segH('gnwk',[3,4,6,8,10].map(w=>[w,`${w} sem.`]),n.wk)}</div></div>
    <div class="panel"><span class="lab">Prix du billet</span><div style="margin-top:8px">${segH('gnpr',PRICES.map(p=>[p,p+' $']),n.price)}</div><p class="small" style="margin:6px 0 0">Plus cher = moins de spectateurs, mais plus de revenus par place.</p></div>
    <div class="panel"><span class="lab">Budget promo</span><div style="margin-top:8px">${segH('gnpm',PROMOB.map(p=>[p,p?$(p):'Aucun']),n.promo)}</div></div>
    ${galaOpts(n,'gn')}
    <div class="mbar"><span class="small" style="flex:1">Tu ajoutes les combats après.</span><button class="btn pri" data-a="galacreate">Créer le gala</button></div></div>`;
}
/* #17 affiche de gala */
function galaMain(g){const fs=galaFights(g);let best=null,bp=-1;for(const f of fs){const a=getB(f.a),b=getB(f.b);if(!a||!b)continue;const p=fol(a)+fol(b)+(f.title?1e8:0);if(p>bp){bp=p;best=f}}return best}
function posterSVG(g){const f=galaMain(g),a=f&&getB(f.a),b=f&&getB(f.b),C=GCITY.find(c=>c.id===(g.city||'home'))||GCITY[0],ar=arenaList().find(x=>x.id===g.arena)||ARENAS[0],col=myCol();
  const X=t=>String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));const av=(x,c)=>avatar(x,c).replace('<svg viewBox="0 0 100 100" aria-hidden="true">','').replace(/<\/svg>\s*$/,'');
  const ttl=f&&f.title?titleTxt(f.title):f&&f.ntitle?'Titre national':'Combat principal';const und=galaFights(g).length-1;
  return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800"><defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0408"/><stop offset=".55" stop-color="#07080c"/><stop offset="1" stop-color="#000"/></linearGradient><radialGradient id="pl" cx=".5" cy=".42" r=".55"><stop offset="0" stop-color="${col}" stop-opacity=".55"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient><linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1b8"/><stop offset=".5" stop-color="#f5c451"/><stop offset="1" stop-color="#b8860b"/></linearGradient></defs>
  <rect width="600" height="800" fill="url(#pg)"/><rect width="600" height="800" fill="url(#pl)"/>
  <text x="300" y="70" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="22" letter-spacing="6" fill="#ffffffaa">${X(S.club.toUpperCase())} PRÉSENTE</text>
  <text x="300" y="130" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="${Math.max(30,Math.min(56,1100/Math.max(8,g.name.length)))}" fill="url(#gd)">${X(g.name.toUpperCase())}</text>
  ${a&&b?`<svg x="18" y="170" width="290" height="290" viewBox="0 0 100 100">${av(a,'red')}</svg><svg x="292" y="170" width="290" height="290" viewBox="0 0 100 100"><g transform="translate(100 0) scale(-1 1)">${av(b,'blue')}</g></svg>
  <text x="300" y="350" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="64" fill="url(#gd)" stroke="#000" stroke-width="2">VS</text>
  <text x="155" y="500" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="34" fill="#fff">${X(sur(a).toUpperCase())}</text><text x="155" y="528" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" fill="#ffffffbb">${a.w}-${a.l}-${a.d} · ${X(NAT[a.nat].n)}</text>
  <text x="445" y="500" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="34" fill="#fff">${X(sur(b).toUpperCase())}</text><text x="445" y="528" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" fill="#ffffffbb">${b.w}-${b.l}-${b.d} · ${X(NAT[b.nat].n)}</text>
  <rect x="150" y="555" width="300" height="40" rx="20" fill="${col}"/><text x="300" y="582" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="17" fill="#fff">${X(ttl.toUpperCase())} · ${f.rounds} ROUNDS</text>`:`<text x="300" y="400" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="#fff">Carte à venir</text>`}
  ${und>0?`<text x="300" y="635" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#ffffffcc">+ ${und} autre${und>1?'s':''} combat${und>1?'s':''} en sous-carte</text>`:''}
  <line x1="80" x2="520" y1="665" y2="665" stroke="#ffffff33"/>
  <text x="300" y="705" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="28" fill="#fff">${X(ar.n.toUpperCase())} · ${X((C.nat?C.n:'').toUpperCase()||NAT[S.home].n.toUpperCase())}</text>
  <text x="300" y="742" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" fill="url(#gd)">${X(when(g.week))}${g.tv==='ppv'||g.ppv?' · EN PAY-PER-VIEW':g.tv==='own'?' · SUR '+X(S.club.toUpperCase())+' TV':''}</text></svg>`}
async function sharePoster(id){const g=(S.galas||[]).find(x=>x.id===id);if(!g)return;const svg=posterSVG(g),img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  try{await img.decode()}catch(e){toast('Impossible de créer l’image');return}const c=document.createElement('canvas');c.width=1200;c.height=1600;c.getContext('2d').drawImage(img,0,0,1200,1600);
  c.toBlob(async bl=>{if(!bl)return;const file=new File([bl],(g.name||'gala').replace(/[^\w-]+/g,'-')+'.png',{type:'image/png'});
    try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:g.name});return}}catch(e){if(e&&e.name==='AbortError')return}
    try{const d=window.claude&&window.claude.use?await window.claude.use('downloads'):null;if(d){await d.save({filename:file.name,data:bl});return}}catch(e){if(e&&e.code&&e.code!=='unavailable'){return}}
    const u=URL.createObjectURL(bl),a=document.createElement('a');a.href=u;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('Affiche enregistrée')},'image/png')}
function vGala(g){
  const e=galaEst(g),fs=galaFights(g),line=(l,v,neg)=>`<div class="row" style="justify-content:space-between"><span>${l}</span><b class="num ${neg?'neg':''}">${neg?'−':'+'}${$(v)}</b></div>`;
  return`<div class="in"><button class="back" data-a="close">← Retour</button>
    <div class="poster">${posterSVG(g)}</div><button class="btn gold" data-a="poster" data-id="${g.id}">📸 Partager l’affiche</button>
    <div class="panel"><span class="lab">${e.ar.n} · ${when(g.week)}</span><div class="nm" style="font-size:26px;margin-top:4px">${esc(g.name)}</div>
      <div class="row" style="justify-content:space-between;margin-top:10px"><span class="small">Spectateurs estimés</span><b>${e.att.toLocaleString('fr-CA')} / ${e.cap.toLocaleString('fr-CA')}</b></div><div class="trk gold" style="height:8px;margin-top:4px"><i style="width:${pct(e.att/e.cap*100)}%"></i></div>
      <p class="small" style="margin:6px 0 0">${e.city.nat?flag(e.city.nat)+' '+e.city.n+' · ':''}${e.loc?`${e.loc} boxeur${e.loc>1?'s':''} du pays sur la carte (+${Math.min(45,e.loc*12)} % de public) · `:''}Popularité de la carte : ${e.pop}. Les combats de titre, les rivalités et les boxeurs populaires remplissent la salle.</p></div>
    <div class="panel"><span class="lab">Estimation financière</span><div style="display:grid;gap:5px;margin-top:8px;font-size:14px">
      ${line('Billets',e.tickets)}${line('Commanditaires',e.spons)}${e.tv?line('Droits télé',e.tv):''}${e.ppvOn?(e.ppvOk?line(`PPV (${e.ppvBuys.toLocaleString('fr-CA')} achats à ${g.ppvp||60} $, ta part 50 %)`,e.ppvRev):'<div class="small" style="color:var(--warn)">PPV : combat principal pas assez populaire, pas d’achats.</div>'):''}
      ${line('Location',e.rent,1)}${e.promo?line('Promotion',e.promo,1):''}${line('Production',e.prod,1)}${e.pay?line('Bourses des adversaires',e.pay,1):''}${e.ppvCost?line('Production PPV',e.ppvCost,1):''}${e.fee?line('Frais de ville hôte ('+e.city.n+')',e.fee,1):''}${e.xc?line('Extras',e.xc,1):''}
      <div class="row" style="justify-content:space-between;border-top:1px solid var(--line);padding-top:6px"><b>Profit estimé</b><b class="num" style="color:${e.profit>=0?'var(--green)':'#ff7b8b'};font-size:18px">${e.profit>=0?'+':''}${$(e.profit)}</b></div></div>
      <p class="small" style="margin:6px 0 0">Le résultat réel varie de ±12 %.</p></div>
    <div class="panel"><span class="lab">Réglages</span><div style="margin-top:8px">${segH('gpr',PRICES.map(p=>[p,p+' $']),g.price)}</div><div style="margin-top:6px">${segH('gpm',PROMOB.map(p=>[p,p?$(p):'Aucune promo']),g.promo)}</div>
</div>${galaOpts(g,'gg')}
    <div class="panel"><div class="ph"><span class="lab">Carte · ${fs.length} combat${fs.length>1?'s':''}</span></div><div class="list">${fs.map(fightMini).join('')||'<p class="small" style="margin:0">Aucun combat. Ajoute au moins un combat, sinon le gala est annulé (50 % de la location perdue).</p>'}</div>
      ${g.week>=S.t+2?`<button class="btn pri big" style="margin-top:10px" data-a="galaadd" data-id="${g.id}">＋ Ajouter un combat</button>`:''}</div></div>`;
}
function vInvest(){const a=S.arena||0,nx=ARENA_LV[a+1],ex=ui.exNat||S.home;
  const offN=Object.keys(NAT).filter(n=>n!==S.home&&!(S.offices||[]).includes(n));
  return`<p class="lede">Fais travailler ton argent : chaque investissement rapporte chaque semaine ou rend ton club plus fort.</p><div class="list">
  <div class="panel"><div class="ph"><span class="lab">📺 ${esc(S.club)} TV</span><span class="chip ${S.tv?'gold':''}">${S.tv?(S.tv.subs||0).toLocaleString('fr-CA')+' abonnés':'Pas lancée'}</span></div>
    <p class="small" style="margin:0 0 8px">Ta propre chaîne de streaming. Les abonnés suivent les abonnés de tes boxeurs et tes galas. ${S.tv?`Revenus : +${$(S.tv.last||0)}/sem. Dans tes galas, choisis la diffusion « Ta chaîne ».`:''}</p>${S.tv?'':`<button class="btn pri" data-a="tvbuy" ${S.money>=TV_COST?'':'disabled'}>Lancer la chaîne · ${$(TV_COST)}</button>`}</div>
  <div class="panel"><div class="ph"><span class="lab">🌍 Bureaux à l’étranger</span><span class="chip">${(S.offices||[]).length}/${OFF_MAX}</span></div>
    <p class="small" style="margin:0 0 8px">Un bureau attire les talents de ce pays (agents libres, amateurs) et remplit plus tes galas dans ce pays (+10 % de public).${(S.offices||[]).length?' Bureaux : '+S.offices.map(n=>flag(n)+' '+NAT[n].n).join(', ')+'.':''}</p>
    ${(S.offices||[]).length<OFF_MAX?`${selH('officesel',offN.map(n=>[n,`${flag(n)} ${NAT[n].n}`]),ui.offSel||offN[0])}<button class="btn pri" data-a="office" data-k="${ui.offSel||offN[0]}" ${S.money>=OFF_COST?'':'disabled'}>Ouvrir un bureau · ${$(OFF_COST)}</button>`:''}</div>
  <div class="panel"><div class="ph"><span class="lab">🏟️ Aréna du club</span><span class="chip ${a?'gold':''}">${a?ARENA_LV[a].n:'Aucune'}</span></div>
    <p class="small" style="margin:0 0 8px">Organise tes galas chez toi, sans location. Elle rapporte aussi chaque semaine (concerts, événements).${a?` Actuellement : ${ARENA_LV[a].cap.toLocaleString('fr-CA')} places, +${$(ARENA_LV[a].inc)}/sem.`:''}</p>
    ${nx?`<button class="btn pri" data-a="arena" ${S.money>=nx.cost?'':'disabled'}>Construire : ${nx.n} · ${$(nx.cost)}</button><p class="small" style="margin:6px 0 0">${nx.cap.toLocaleString('fr-CA')} places · +${$(nx.inc)}/sem.</p>`:'<span class="chip gold">Niveau max</span>'}</div>
  <div class="panel"><div class="ph"><span class="lab">🛍️ Produits dérivés</span><div class="pips">${[0,1,2,3,4].map(i=>`<i class="${i<(S.merch||0)?'on':''}"></i>`).join('')}</div></div>
    <p class="small" style="margin:0 0 8px">T-shirts, gants, casquettes : les revenus suivent les abonnés de tes boxeurs. Maintenant : +${$(merchInc())}/sem.</p>
    ${(S.merch||0)<5?`<button class="btn pri" data-a="merch" ${S.money>=merchCost()?'':'disabled'}>${S.merch?'Agrandir':'Ouvrir la boutique'} · ${$(merchCost())}</button>`:'<span class="chip gold">Niveau max</span>'}</div>
  <div class="panel"><span class="lab">🔎 Expéditions de recrutement</span><p class="small" style="margin:6px 0 8px">Envoie tes recruteurs dans un pays : les boxeurs trouvés arrivent chez les agents libres.</p>
    ${selH('exnat',Object.keys(NAT).map(n=>[n,`${flag(n)} ${NAT[n].n}`]),ex)}
    <div class="list">${EXPE.map(E=>`<button class="opt" data-a="expe" data-k="${E.id}" ${S.money>=E.c?'':'disabled'}><b>${E.n} · ${$(E.c)}</b><span>${E.d}</span></button>`).join('')}</div></div>
  <div class="panel"><span class="lab">Aussi</span><p class="small" style="margin:6px 0 0">📣 Campagnes marketing et 🩺 soins : dans la fiche de chaque boxeur. 💰 Racheter le contrat d’un boxeur d’un autre club : dans sa fiche de repérage. 🎪 Galas et 🏢 installations : dans leurs onglets.</p></div></div>`}
function vRivals(){S.rivals=S.rivals||genRivals();return`<p class="lede">Les autres clubs signent des agents libres et peuvent faire des offres sur tes boxeurs.</p><div class="list">${[...S.rivals].sort((a,b)=>b.rep-a.rep).map(r=>`<div class="panel"><div class="ph"><b class="nm" style="font-size:20px">${flag(r.nat)} ${esc(r.n)}</b><span class="chip">${$(r.money)}</span></div><div class="row small" style="justify-content:space-between"><span>Réputation</span><b>${Math.round(r.rep)}</b></div><div class="trk gold" style="height:6px;margin:4px 0 6px"><i style="width:${r.rep}%"></i></div><span class="small">${r.signed} boxeur${r.signed>1?'s':''} signé${r.signed>1?'s':''} depuis le début</span></div>`).join('')}</div>`}
function vHof(){const H=S.hof||[];return`<p class="lede">Tes boxeurs retraités. Un ancien champion peut revenir comme entraîneur (onglet Staff, candidats).</p>${H.length?`<div class="list">${H.map(h=>`<div class="panel"><div class="bx-h"><div class="av md">${avatar({look:h.look},'red')}</div><div class="bx-id"><span class="chip gold">🏛️ Légende</span><div class="nm" style="margin-top:6px">${flag(h.nat)} ${esc(h.nm)}</div><div class="sub">${divN(h.div)} · ${h.rec} (${h.ko} KO) · ${h.tw} ceinture${h.tw>1?'s':''} gagnée${h.tw>1?'s':''}${h.tro?` · ${h.tro} trophée${h.tro>1?'s':''}`:''}</div><span class="small">👥 ${fmtK(h.fol)} abonnés · retraite ${when(h.t)}</span></div><div class="ovr"><b>${h.best}</b><small>MAX</small></div></div></div>`).join('')}</div>`:'<div class="panel"><p class="small" style="margin:0">Personne pour l’instant. Dans la fiche d’un boxeur de 30 ans ou plus : Contrat → Prendre sa retraite.</p></div>'}`}
function vRank(){
  if(!ui.div)ui.div=mine()[0]?.div||'welter';ui.rsub=ui.rsub||'belts';ui.rnat=ui.rnat||S.home;ui.rbody=ui.rbody||'WBC';
  const sub=`<div ${segG(8)} style="margin-bottom:10px">${[['belts','Ceintures'],['monde','Mondial'],['pays','Pays'],['p4p','P4P'],['goat','🐐 GOAT'],['promo','🏢 Promos'],['rec','📈 Records'],['palm','Palmarès']].map(([k,n])=>`<button data-a="rsub" data-k="${k}" aria-pressed="${ui.rsub===k}">${n}</button>`).join('')}</div>`;
  if(ui.rsub==='p4p'){const L=p4pList();return sub+`<p class="small" style="margin:0 0 10px">Livre pour livre : les meilleurs boxeurs du monde, toutes catégories confondues (note, ceintures, invaincu, victoires contre des champions, titres dans plusieurs divisions).</p><div class="panel tw"><table><thead><tr><th>#</th><th>Boxeur</th><th>P4P</th></tr></thead><tbody>${L.map((x,i)=>{const b=x.b;return`<tr class="${b.mine?'me':''} tap" data-a="${b.mine?'open':'scout'}" data-id="${b.id}"><td class="rk">${i+1}</td><td><div class="opp"><div class="av sm ${tcls(b)}">${avatar(b,b.mine?'red':'blue')}</div><div><b>${flag(b.nat)} ${esc(b.name)}</b>${b.mine?' <span class="chip red">Ton club</span>':''}<div class="small">${divN(b.div)} · ${b.w}-${b.l}-${b.d}${b.champ?' · '+beltsOf(b).join(' '):''}</div></div></div></td><td class="num"><b>${p4pShown(x)}</b></td></tr>`}).join('')}</tbody></table></div>`}
  if(ui.rsub==='rec'){const L=recordsList();return sub+`<p class="small" style="margin:0 0 10px">Les records de tous les temps de ton univers, Temple de la renommée compris.</p><div class="stack" style="gap:8px">${L.map(r=>`<div class="panel recr ${r.b&&r.b.mine?'me':''}"><span class="lab">${r.lab}</span><div class="row" style="justify-content:space-between;gap:8px;margin-top:4px"><b>${r.b?`${r.b.hof?'🏛️ ':''}${flag(r.b.nat)} ${esc(r.b.name)}${r.b.mine?' <span class="chip red">Ton club</span>':''}`:'—'}</b><b class="num" style="color:var(--gold)">${r.v>=0?r.fmt(r.v):'—'}</b></div></div>`).join('')}</div>`}
  if(ui.rsub==='promo'){const M=club(),me={me:1,n:S.club,nat:S.home,sc:prScore(null,M),cnt:M.length,bl:M.reduce((a,b)=>a+beltsOf(b).length,0)};
    const L=promoAlive().map(p=>{const B=prBoxers(p);return{p,sc:prScore(p,B),cnt:B.length,bl:B.reduce((a,b)=>a+beltsOf(b).length,0)}});L.push(me);L.sort((a,b)=>b.sc-a.sc);
    return sub+`<p class="small" style="margin:0 0 10px">Les promotions rivales et leurs écuries. Touche une promotion pour voir ses boxeurs. Si une promotion fait faillite, tu peux la racheter (maximum ${PRMAX} promotions : ton club + ${PRMAX-1}).</p>
    <div class="panel tw"><table><thead><tr><th>#</th><th>Promotion</th><th>Points</th></tr></thead><tbody>${L.map((x,i)=>x.me?`<tr class="me tap" data-a="openclub"><td class="rk">${i+1}</td><td><b>${flag(S.home)} ${esc(S.club)}</b> <span class="chip red">Ton club</span><div class="small">${recTxt()} · ${x.cnt} boxeurs · ${x.bl} ceinture${x.bl>1?'s':''}</div></td><td class="num"><b>${x.sc}</b></td></tr>`
      :`<tr class="tap ${x.p.own?'me':''}" data-a="openpromo" data-id="${x.p.id}"><td class="rk">${i+1}</td><td><b><span class="bdot" style="--bc:${x.p.c}"></span>${flag(x.p.nat)} ${esc(x.p.n)}</b>${x.p.own?' <span class="chip gold">👑 À toi</span>':''}${x.p.sale?' <span class="chip bad">💥 Faillite · à vendre</span>':''}${x.p.fresh&&S.t-x.p.fresh<12?' <span class="chip">Nouvelle</span>':''}<div class="small">${x.p.own?'Toi':esc(prBoss(x.p).name)}${x.p.vsMe&&!x.p.own?` · ⚔️ ${h2hTxt(x.p.vsMe)}`:''} · ${x.cnt} boxeurs · ${x.bl} ceinture${x.bl>1?'s':''}</div></td><td class="num"><b>${x.sc}</b></td></tr>`).join('')}</tbody></table></div>`}
  if(ui.rsub==='goat'){const G=goatBoard().slice(0,40);
    return sub+`<div class="panel tw"><table><thead><tr><th>#</th><th>Boxeur</th><th>GOAT</th></tr></thead><tbody>${G.map((x,i)=>{const b=x.b,h=x.h;return b?`<tr class="${b.mine?'me':''} tap" data-a="${b.mine?'open':'scout'}" data-id="${b.id}"><td class="rk">${i+1}</td><td><div class="opp"><div class="av sm ${tcls(b)}">${avatar(b,b.mine?'red':'blue')}</div><div><b>${flag(b.nat)} ${esc(b.name)}</b>${b.mine?' <span class="chip red">Ton club</span>':''}<div class="small">${divN(b.div)} · ${b.w}-${b.l}-${b.d} · ${crOf(b).tw} titre${crOf(b).tw>1?'s':''}${crOf(b).und?' · 👑 undisputed':''}</div>${b.champ?`<div style="margin-top:3px">${beltChips(b,26)}</div>`:''}</div></div></td><td class="num"><b>${x.g}</b><div class="small">${gTier(x.g)}</div></td></tr>`
      :`<tr><td class="rk">${i+1}</td><td><b>🏛️ ${flag(h.nat)} ${esc(h.nm)}</b><div class="small">Temple de la renommée · ${h.rec} · ${h.tw||0} titre${(h.tw||0)>1?'s':''}</div></td><td class="num"><b>${x.g}</b><div class="small">${gTier(x.g)}</div></td></tr>`}).join('')}</tbody></table></div><p class="small">Classement de tous les temps, toutes divisions. Touche un boxeur pour voir son mur des succès.</p>`}
  if(ui.rsub==='palm'){const H=S.champHist||[];
    return sub+`<div class="panel"><span class="lab">Changements de champions</span><ul class="log">${H.slice(0,80).map(h=>`<li>${h.belt?beltSvg(h.belt,34)+' ':''}<span class="chip ${h.mine?'red':''}">${divN(h.div)}</span> <b>${flag(h.nat)} ${esc(h.nm)}</b><br><span class="small">${esc(palmHow(h))} · ${when(h.t)}</span></li>`).join('')||'<li class="small">Aucun changement pour l’instant.</li>'}</ul></div>`}
  const dseg=selH('div',DIVS.map(d=>[d.id,`${d.n} · ${d.kg}${mine().some(b=>b.div===d.id)?' · 🥊 '+mine().filter(b=>b.div===d.id).length:''}`]),ui.div);
  const row=(b,i,extra)=>`<tr class="${b.mine?'me':''} tap" data-a="${b.mine?'open':'scout'}" data-id="${b.id}"><td class="rk">${i}</td><td><div class="opp"><div class="av sm ${tcls(b)}">${avatar(b,b.mine?'red':'blue')}</div><div><b>${flag(b.nat)} ${esc(b.name)}</b>${b.mine?' <span class="chip red">Ton club</span>':''}<div class="small">${extra}</div></div></div></td><td class="num">${ovr(b)}</td><td class="small">${b.w}-${b.l}-${b.d}</td></tr>`;
  const tbl=rows=>`<div class="panel tw"><table><thead><tr><th>#</th><th>Boxeur</th><th>Note</th><th>Fiche</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  const champCard=(c,lab)=>c?`<button class="panel fm" data-a="${c.mine?'open':'scout'}" data-id="${c.id}" style="border-color:rgba(245,196,81,.5)"><div class="bx-h"><div class="av md ${tcls(c)}">${avatar(c,c.mine?'red':'blue')}</div><div class="bx-id"><span class="chip gold">${lab}</span><div class="nm" style="margin-top:6px">${flag(c.nat)} ${esc(c.name)}</div><div class="chips s" style="margin-top:4px">${beltChips(c)}</div><div class="sub">${rec(c)} · ${c.age} ans</div></div><div class="ovr"><b>${ovr(c)}</b><small>NOTE</small></div></div></button>`:'';
  if(ui.rsub==='belts'){const B=(S.belts||{})[ui.div]||{},h=getB(B[ui.rbody]),l=bodyList(ui.div,ui.rbody).slice(0,15),ul=champsOf(ui.div).find(isUndisp);
    return sub+dseg+`${ul?`<div class="al" style="margin-bottom:10px"><p>👑 <b>${esc(ul.name)}</b> est champion undisputed (WBC, WBA, WBO, IBF).</p></div>`:''}
      <div class="seg" style="margin-bottom:10px">${BELTS.map(k=>`<button data-a="rbody" data-k="${k}" aria-pressed="${ui.rbody===k}">${beltSvg(k,40)}</button>`).join('')}</div>
      <div class="stack">${(()=>{const ln=linealOf(ui.div),it=interimOf(ui.div,ui.rbody);return(ln?`<div class="al" style="margin:0"><p>💎 Champion linéal ${divN(ui.div)} : <b>${flag(ln.nat)} ${esc(ln.name)}</b>. Le titre ne change de main que si on le bat.</p></div>`:'')+(it?`<div class="al" style="margin:0"><p>🟡 Champion intérimaire ${ui.rbody} : <b>${flag(it.nat)} ${esc(it.name)}</b></p></div>`:'')})()}${champCard(h,'Champion '+ui.rbody+' · '+divN(ui.div))}${tbl(l.map((b,i)=>row(b,i+1,(b.champ?beltsOf(b).join(' · ')+' · ':'')+NAT[b.nat].n)).join(''))}</div><p class="small">Chaque fédération a son propre classement. Top 10 pour défier son champion. Les 4 grandes ceintures réunies font un champion undisputed.</p>`}
  if(ui.rsub==='pays'){
    const nats=Object.keys(NAT).filter(n=>S.boxers.some(b=>b.nat===n)).sort((a,b)=>(a===S.home?-1:b===S.home?1:NAT[a].n.localeCompare(NAT[b].n)));
    const nl=natList(ui.rnat,ui.div),c=nl.find(b=>b.nchamp),rest=nl.filter(b=>!b.nchamp);
    return sub+`${selH('rnat',nats.map(n=>[n,`${flag(n)} ${NAT[n].n}`]),ui.rnat)}${dseg}
      <div class="stack">${champCard(c,'Champion national · '+NAT[ui.rnat].n)}${rest.length?tbl(rest.map((b,i)=>row(b,i+1,'Mondial : '+rankLabel(b))).join('')):`<div class="panel small">Aucun boxeur de ce pays dans cette division.</div>`}</div>`;
  }
  const list=rankList(ui.div),top=list.slice(0,15),mu=list.slice(15).filter(b=>b.mine);
  return sub+dseg+`<div class="stack">${tbl(top.map((b,i)=>row(b,i+1,NAT[b.nat].n+' · '+b.age+' ans')).join('')+mu.map(b=>row(b,'–',NAT[b.nat].n)).join(''))}</div><p class="small">Classement mondial par points (hors champions).</p>`;
}
function vOffers(){
  const of=(S.offers||[]).filter(o=>getB(o.a)&&getB(o.b));
  if(!of.length)return`<div class="panel"><p style="margin:0">Aucune offre pour l’instant. Les promoteurs contactent ton club chaque semaine, plus souvent quand tes boxeurs sont connus.</p></div>`;
  return`<p class="lede">Des promoteurs proposent des combats clés en main. Un court préavis paie plus, mais laisse moins de temps pour se préparer. Les offres expirent après 2 semaines.</p><div class="stack two">${of.map(o=>{const a=getB(o.a),b=getB(o.b),rounds=roundsFor(a,b,false);return`<div class="panel">
    <div class="row" style="justify-content:space-between;margin-bottom:12px"><span class="chip ${o.short||o.belts?'gold':''}">${o.belts&&o.belts.length?'🏆 Défense '+o.belts.join(' '):o.short?'Court préavis':'Offre'} · ${esc(o.promo)}</span><span class="small">${o.exp<=S.t?'Expire cette semaine':`Expire dans ${o.exp-S.t} sem.`}</span></div>
    <div class="bout"><div class="side"><div class="av md ${tcls(a)}">${avatar(a,'red')}</div><div class="nm">${flag(a.nat)} ${esc(sur(a))}</div><span class="small">${rankLabel(a)} · ${ovr(a)}</span></div><div class="vs">VS</div><div class="side"><div class="av md ${tcls(b)}">${avatar(b,'blue')}</div><div class="nm">${flag(b.nat)} ${esc(sur(b))}</div><span class="small">${rankLabel(b)} · ${ovr(b)}</span></div></div>
    <div class="row" style="justify-content:space-between;margin-top:12px"><span class="small">${rounds} rounds · ${when(Math.max(o.week,S.t+2))}</span><b class="num" style="color:#ffe08a">${$(myShare(o.purse))}</b></div>
    ${S.set.odds?`<div class="row" style="justify-content:space-between;margin-top:6px"><span class="small">Chances de victoire</span>${pill(matchOdds(a,b,rounds).w)}</div>`:''}
    <div class="row" style="margin-top:12px"><button class="btn pri" style="flex:1" data-a="offok" data-id="${o.id}">Accepter</button><button class="btn" data-a="offno" data-id="${o.id}">Refuser</button></div></div>`}).join('')}</div>`;
}
function start(data){
  migrate();
  if(data&&data.S&&!data.menu){enterGame(data.S);return}
  openMenu('home');
}
document.addEventListener('change',e=>{if(e.target.id==='pickb'){ui.bookFor=e.target.value;render()}});
document.addEventListener('input',e=>{const id=e.target.id;if(id==='ng-club'){const v=e.target.value.trim()||'Coin Rouge',n=document.getElementById('ng-cn'),c=document.getElementById('ng-ci');if(n)n.textContent=v;if(c)c.textContent=initials(v)}if(id==='ng-mgr'){const m=document.getElementById('ng-cm');if(m)m.textContent=e.target.value.trim()||'toi'}if(id==='gn-name'&&ui.gn)ui.gn.name=e.target.value;if(id==='ng-club'&&ui.ng)ui.ng.club=e.target.value;else if(id==='ng-mgr'&&ui.ng)ui.ng.mgr=e.target.value;else if(id==='imp-code')ui.imp=e.target.value});
try{window.claude?.hot?.snapshot?.(()=>({S,menu:!!ui.menu}))}catch(e){}
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});

try{langPick();i18nStart()}catch(e){}

document.addEventListener('DOMContentLoaded',()=>{const C=window.Capacitor;if(!C||!C.isNativePlatform||!C.isNativePlatform())return;const P=C.Plugins||{};
  try{P.StatusBar&&(P.StatusBar.setStyle({style:'DARK'}),C.getPlatform()==='android'&&P.StatusBar.setOverlaysWebView({overlay:true}))}catch(e){}
  setTimeout(()=>{try{P.SplashScreen&&P.SplashScreen.hide()}catch(e){}},300);
  P.App&&P.App.addListener('backButton',()=>{const vis=id=>{const e=document.getElementById(id);return e&&!e.hidden};
    const close=document.querySelector('#ev:not([hidden]) [data-a=noticeok],#sheet:not([hidden]) [data-a=close]');if(!close&&(vis('neg')||vis('ev')))return;
    if(close){close.click();return}if(vis('fx'))return;if(vis('menu')){P.App.minimizeApp();return}if(typeof openMenu==='function')openMenu('home')});
});

window.BUILD=__BUILD__;window.BUILD_MSG=__BUILD_MSG__;if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(r=>r.update()).catch(()=>{}));
function updEsc(t){return String(t||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c])}
async function checkUpd(manual){try{const r=await fetch('version.json?_='+Date.now(),{cache:'no-store'});const j=await r.json();if(j.v&&j.v!==window.BUILD){const b=document.getElementById('updbar');if(b){const t=document.getElementById('updtxt');if(t)t.innerHTML='✨ <b>Nouvelle version !</b>'+(j.m?'<br><span style=\'font-weight:600;font-size:12px\'>'+updEsc(j.m)+'</span>':'');b.hidden=false}return true}if(manual&&typeof toast==='function')toast('Tu as déjà la dernière version 👍')}catch(e){if(manual&&typeof toast==='function')toast('Pas de connexion')}return false}
async function doUpd(){try{if(window.caches){for(const k of await caches.keys())await caches.delete(k)}const rs=navigator.serviceWorker?await navigator.serviceWorker.getRegistrations():[];for(const r of rs)await r.update()}catch(e){}location.replace(location.pathname+'?v='+Date.now())}
addEventListener('load',()=>{setTimeout(()=>checkUpd(false),1500);setInterval(()=>checkUpd(false),60000);try{const pv=localStorage.getItem('cr_build');localStorage.setItem('cr_build',window.BUILD);if(pv&&pv!==window.BUILD){const n=document.getElementById('updok');if(n){n.innerHTML='✅ <b>Jeu mis à jour !</b>'+(window.BUILD_MSG?'<br><span style=\'font-weight:600;font-size:12px\'>'+updEsc(window.BUILD_MSG)+'</span>':'');n.hidden=false;setTimeout(()=>{n.hidden=true},7000)}}}catch(e){}});document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpd(false)});addEventListener('pageshow',()=>checkUpd(false));addEventListener('focus',()=>checkUpd(false));

// Points d'entrée du moteur, utilisés par les tests unitaires.
export { worldGen, newFight, stepRound, aiStrat, quickFight, makeBoxer, has3D, kdScored, propose, sponsorTerms, p4pList, p4pShown, rankLabel, rankIdx, palmHow, ui, createGala, galaUpfront, galaNight, arenaList, train, campWeekCost, campTotal, inactivityTick, inactiveWeeks, INACTIVE_MAX, purse, moneyS };
export { rpOf, onRk, seasonNow, vOnHead };
export const getState = () => S;
