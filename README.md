# 📋 Todo App - Application de Gestion de Tâches Professionnelle

Une application web moderne et professionnelle de gestion de tâches construite avec React et FullCalendar, conçue pour une utilisation en entreprise avec une interface utilisateur élégante et intuitive.

## ✨ Fonctionnalités

### 🎯 Gestion des Tâches
- ✅ **Ajout de tâches** avec titre (obligatoire), description, dates de début/fin, et priorité
- ✏️ **Modification** de tâches existantes
- 🗑️ **Suppression** de tâches
- ✅ **Marquage** des tâches comme terminées
- 🏷️ **Système de priorités** : Basse, Moyenne, Haute

### 📅 Calendrier FullCalendar
- 📆 **Vues multiples** : Mois, Semaine, Jour
- 🎨 **Affichage visuel** des tâches comme événements colorés selon la priorité
- 🖱️ **Clic sur date** → Ouverture automatique du formulaire d'ajout
- 🖱️ **Clic sur événement** → Édition/Suppression de la tâche
- 🔄 **Drag & Drop** : Déplacer les tâches directement dans le calendrier

### 🎨 Interface Utilisateur
- 🎨 **Design moderne et minimaliste** avec Tailwind CSS
- 🌓 **Mode clair/sombre** avec persistance
- 📱 **Interface responsive** (desktop, tablette, mobile)
- ✨ **Animations fluides** et transitions élégantes
- 🎯 **Layout professionnel** : Sidebar (liste) + Zone principale (calendrier)

### 💾 Fonctionnalités Bonus
- 💾 **Sauvegarde automatique** dans localStorage
- 🌓 **Mode sombre** avec toggle
- 🔄 **Drag & Drop** des tâches dans le calendrier
- 🔍 **Filtrage** par statut (Toutes, Actives, Terminées) et par priorité

## 🚀 Installation et Lancement

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

3. **Ouvrir dans le navigateur**
   L'application sera accessible à l'adresse : `http://localhost:5173`

### Commandes disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la version de production

## 📁 Structure du Projet

```
TodoApp/
├── src/
│   ├── components/          # Composants React
│   │   ├── Calendar.jsx     # Composant calendrier FullCalendar
│   │   ├── TaskForm.jsx     # Formulaire d'ajout/édition
│   │   └── TaskList.jsx     # Liste des tâches avec filtres
│   ├── context/             # Context API pour state management
│   │   └── TaskContext.jsx  # Contexte global des tâches
│   ├── utils/               # Utilitaires
│   │   └── dateHelpers.js   # Fonctions de manipulation de dates
│   ├── App.jsx              # Composant principal
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Styles globaux avec Tailwind
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🛠️ Stack Technique

- **React 18** - Bibliothèque UI
- **Vite** - Build tool et serveur de développement
- **FullCalendar** - Bibliothèque de calendrier
  - `@fullcalendar/react`
  - `@fullcalendar/daygrid`
  - `@fullcalendar/timegrid`
  - `@fullcalendar/interaction`
- **Tailwind CSS** - Framework CSS utilitaire
- **Context API** - State management (useState + useContext)

## 📖 Utilisation

### Créer une nouvelle tâche
1. Cliquez sur le bouton **"Nouvelle tâche"** dans le header
2. Ou cliquez directement sur une date dans le calendrier
3. Remplissez le formulaire (titre obligatoire)
4. Cliquez sur **"Ajouter"**

### Modifier une tâche
- Cliquez sur une tâche dans la liste (sidebar)
- Ou cliquez sur un événement dans le calendrier
- Modifiez les informations souhaitées
- Cliquez sur **"Modifier"**

### Déplacer une tâche (Drag & Drop)
- Dans le calendrier, cliquez et maintenez sur un événement
- Glissez-le vers une nouvelle date
- Relâchez pour mettre à jour automatiquement les dates

### Filtrer les tâches
- Utilisez les boutons de filtre dans la sidebar : **Toutes**, **Actives**, **Terminées**
- Sélectionnez une priorité dans le menu déroulant pour filtrer par priorité

### Mode sombre
- Cliquez sur l'icône soleil/lune dans le header pour basculer entre les modes clair et sombre
- La préférence est sauvegardée automatiquement

## 🎨 Personnalisation

### Couleurs des priorités
Les couleurs peuvent être modifiées dans `src/components/Calendar.jsx` :
- **Haute** : Rouge (`#ef4444`)
- **Moyenne** : Bleu (`#3b82f6`)
- **Basse** : Vert (`#10b981`)

### Thème Tailwind
Le fichier `tailwind.config.js` contient la configuration du thème, incluant les couleurs personnalisées.

## 🔒 Données

Les tâches sont sauvegardées automatiquement dans le **localStorage** du navigateur. Les données persistent entre les sessions mais sont spécifiques à chaque navigateur/appareil.

### Structure des données
```javascript
{
  id: "unique-id",
  title: "Titre de la tâche",
  description: "Description optionnelle",
  startDate: "2024-01-15",
  endDate: "2024-01-20",
  priority: "high" | "medium" | "low",
  completed: false,
  createdAt: "2024-01-10T10:00:00.000Z"
}
```

## 🚀 Déploiement

Pour déployer l'application en production :

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`, prêts à être déployés sur n'importe quel serveur web statique (Netlify, Vercel, GitHub Pages, etc.).

## 📝 Notes de Développement

- Le code est entièrement commenté pour faciliter la maintenance
- L'architecture est modulaire et extensible
- Les composants sont réutilisables et bien séparés
- Le state management utilise Context API pour une solution légère et native

## 🎯 Évolutions Futures Possibles

- 🔐 Authentification utilisateur
- ☁️ Synchronisation cloud (backend API)
- 👥 Collaboration multi-utilisateurs
- 📧 Notifications par email
- 📱 Application mobile (React Native)
- 🔔 Rappels et alertes
- 📊 Statistiques et rapports
- 🏷️ Catégories et tags
- 📎 Pièces jointes

## 📄 Licence

Ce projet est fourni à des fins éducatives et professionnelles.

---

**Développé avec ❤️ en React**

