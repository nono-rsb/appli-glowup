# ✨ GlowUp — Physique · Mental · Lookmaxing

Application web (PWA) pour t'accompagner dans ton **glow-up global** : corps, esprit et look.
100 % locale, aucune inscription, tes données restent **sur ton appareil** (localStorage).

## Fonctionnalités

| Onglet | Contenu |
|--------|---------|
| 🏠 **Accueil** | Score du jour (anneau de progression), série 🔥, focus quotidiens, défi de la semaine, citation motivante |
| 📋 **Routine** | Checklists matin ☀️ et soir 🌙 (soin peau, sommeil, hydratation…) |
| ✅ **Habitudes** | Suivi d'habitudes personnalisables avec séries et vue hebdo. Ajout/suppression libre |
| 🏋️ **Sport** | 5 programmes prêts à l'emploi (full body, haut, bas, HIIT, mobilité) + historique 7 jours |
| 🧠 **Mental** | Suivi d'humeur, respiration guidée **4·7·8** animée, journal de gratitude & victoires |
| ✨ **Look** | Guide lookmaxing **naturel** : peau, cheveux, posture, style, détails, fondations |
| 📈 **Progrès** | Statistiques, graphique de score sur 14 jours, courbe d'humeur, réinitialisation |

## Lancer l'app

Aucune installation ni build. Deux options :

**Ouvrir directement**
```
Ouvre index.html dans ton navigateur.
```

**Serveur local (recommandé pour la PWA / service worker)**
```bash
# Python
python3 -m http.server 8000
# puis ouvre http://localhost:8000

# ou Node
npx serve .
```

Sur mobile : ouvre l'URL puis **« Ajouter à l'écran d'accueil »** pour l'installer comme une vraie app (fonctionne hors-ligne).

## Stack

- HTML / CSS / JavaScript **vanilla** — zéro dépendance
- Données persistées en **localStorage**
- **PWA** : manifest + service worker (installable + offline)
- Interface mobile-first, thème sombre

## Confidentialité

Tout est stocké localement dans ton navigateur. Rien n'est envoyé sur un serveur.
Le bouton « Réinitialiser » (onglet Progrès) efface toutes tes données.

## Note

Le contenu (routines, conseils lookmaxing, programmes sportifs) est **informatif et bienveillant** :
il vise l'amélioration naturelle et progressive. Ce n'est pas un avis médical.
Pour tout problème de santé, de peau ou de nutrition, consulte un·e professionnel·le.
