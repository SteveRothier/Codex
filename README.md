# Codex

Grimoire interactif en **React** : pages qui se tournent, couvertures illustrées, index des sorts par arme et ambiance visuelle soignée. Ce dépôt sert de **vitrine technique** sur mon portfolio : démo en ligne, code lisible, stack moderne.

## Démo en ligne

**[codex-iota-wheat.vercel.app](https://codex-iota-wheat.vercel.app)**

## Ce que le projet montre

- Interface type **livre** (`react-pageflip` / StPageFlip), navigation clavier et contrôles accessibles.
- **Données structurées** (JSON + typage TypeScript) pour les sorts et catégories d’armes.
- **Animations** (GSAP sur les couvertures, particules en arrière-plan).
- **UI** cohérente (typographie Cinzel, thème sombre, favicon dérivé de la rune de couverture).
- Déploiement **Vercel** (build statique Vite).

## Stack


| Domaine    | Choix                 |
| ---------- | --------------------- |
| Framework  | React 19 + TypeScript |
| Build      | Vite 8                |
| Livre      | react-pageflip        |
| Animations | GSAP                  |
| Icônes     | Lucide React          |


## Installation et scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # sortie dans dist/
npm run preview  # prévisualiser la build
npm run lint
```

## Données

Les entrées sorts / armes s’appuient sur des données de type **OpenAlbion API** relatives à **Albion Online**. Ce dépôt est une **démo front-end** à but non commercial pour portfolio ; droits sur les noms et visuels du jeu : leurs détenteurs respectifs.