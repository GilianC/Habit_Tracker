# 🌟 HabitFlow - Application de Suivi d'Habitudes

## 📋 Aperçu du Projet
**HabitFlow** est une application web moderne de suivi d'habitudes développée avec Next.js 15, offrant une expérience utilisateur fluide et motivante pour créer et maintenir des routines positives.

## 🛠️ Stack Technique
- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Styling** : TailwindCSS + Glassmorphism
- **Base de données** : PostgreSQL avec Vercel Postgres
- **Authentification** : NextAuth.js v5
- **Déploiement** : Vercel
- **ORM** : Prisma
- **Validation** : Zod

## 📅 Méthodologie
**Agile / Scrum** avec livraisons itératives

---

## 🥇 Version 1.0 - MVP (Minimum Viable Product)

### 🎯 Objectif V1
Délivrer une application fonctionnelle permettant le suivi quotidien d'habitudes avec authentification sécurisée et tableau de bord personnel.

---

### 📝 US1 — Système d'authentification complet

**En tant qu'utilisateur, je veux pouvoir créer un compte et me connecter de manière sécurisée pour sauvegarder mes données personnelles.**

#### Sous-tâches techniques Next.js

- **Pages & Composants UI** :
  - `/app/login/page.tsx` - Page de connexion avec design moderne
  - `/app/signup/page.tsx` - Page d'inscription 
  - `/app/ui/login-form.tsx` - Formulaire de connexion réutilisable
  - `/app/ui/signup-form.tsx` - Formulaire d'inscription avec validation
  - `/app/ui/logout-button.tsx` - Bouton de déconnexion

- **Authentification & API** :
  - `/app/lib/auth.ts` - Configuration NextAuth.js v5
  - `/app/api/auth/[...nextauth]/route.ts` - Endpoints d'authentification
  - `/app/lib/actions.ts` - Server Actions pour login/signup
  - `/middleware.ts` - Protection des routes privées

- **Base de données** :
  - `schema.prisma` - Modèle User avec sessions
  - Migration : table `users(id, email, password_hash, name, created_at, updated_at)`
  - Migration : table `sessions` pour NextAuth

- **Validation & Sécurité** :
  - Validation Zod pour formulaires
  - Hashage bcrypt des mots de passe
  - Protection CSRF et rate limiting

#### Critères d'acceptation
- ✅ Inscription avec validation email/password
- ✅ Connexion persistante avec sessions sécurisées  
- ✅ Redirection automatique vers dashboard après login
- ✅ Déconnexion propre avec invalidation session
- ✅ Protection des routes privées via middleware

---

### 📝 US2 — Gestion des habitudes (CRUD complet)

**En tant qu'utilisateur, je veux pouvoir créer, modifier et supprimer mes habitudes pour personnaliser ma routine quotidienne.**

#### Sous-tâches techniques Next.js

- **Pages & Composants UI** :
  - `/app/dashboard/habits/page.tsx` - Liste des habitudes utilisateur
  - `/app/dashboard/habits/create/page.tsx` - Création nouvelle habitude
  - `/app/dashboard/habits/[id]/edit/page.tsx` - Modification habitude
  - `/app/ui/habits/habit-card.tsx` - Carte d'affichage habitude
  - `/app/ui/habits/create-form.tsx` - Formulaire création/édition
  - `/app/ui/habits/delete-button.tsx` - Bouton suppression avec confirmation

- **API Routes & Server Actions** :
  - `/app/api/habits/route.ts` - CRUD API pour habitudes (GET, POST)
  - `/app/api/habits/[id]/route.ts` - Actions spécifiques (PUT, DELETE)
  - `/app/lib/habits-actions.ts` - Server Actions pour mutations côté serveur
  - `/app/lib/habits-data.ts` - Fonctions de récupération données

- **Base de données** :
  - Migration : table `habits(id, user_id, name, description, frequency, category, color, icon, created_at, updated_at, is_active)`
  - Index sur `user_id` pour performance
  - Contrainte foreign key vers users

- **Types & Validation** :
  - `/app/lib/definitions.ts` - Types TypeScript pour Habit
  - Schemas Zod pour validation côté client et serveur
  - Gestion erreurs avec try/catch patterns

#### Critères d'acceptation
- ✅ Création habitude avec nom, description, fréquence, catégorie
- ✅ Liste paginée des habitudes de l'utilisateur connecté
- ✅ Modification en place avec sauvegarde automatique
- ✅ Suppression avec confirmation modale
- ✅ Validation temps réel côté client et serveur
- ✅ Gestion erreurs avec messages utilisateur

---

### 📝 US3 — Tracking quotidien des habitudes

**En tant qu'utilisateur, je veux pouvoir marquer mes habitudes comme accomplies chaque jour pour suivre ma progression.**

#### Sous-tâches techniques Next.js

- **Pages & Composants UI** :
  - `/app/dashboard/page.tsx` - Dashboard principal avec habitudes du jour
  - `/app/ui/dashboard/daily-habits.tsx` - Liste habitudes avec checkboxes
  - `/app/ui/dashboard/habit-checkbox.tsx` - Composant interactif de validation
  - `/app/ui/dashboard/progress-bar.tsx` - Barre de progression journalière
  - `/app/ui/dashboard/streak-display.tsx` - Affichage des séries en cours

- **API & Server Actions** :
  - `/app/api/habits/[id]/track/route.ts` - Endpoint validation habitude
  - `/app/lib/tracking-actions.ts` - Server Actions pour le tracking
  - `/app/lib/stats-data.ts` - Calculs de statistiques et séries
  - Optimistic updates avec `useOptimistic` hook

- **Base de données** :
  - Migration : table `habit_logs(id, habit_id, user_id, date, completed, created_at)`
  - Index composé sur `(user_id, date)` pour performance
  - Contraintes unicité `(habit_id, date)`

- **Logique métier** :
  - Calcul automatique des streaks (séries consécutives)
  - Reset journalier à minuit (timezone utilisateur)
  - Agrégation temps réel du pourcentage de completion

#### Critères d'acceptation
- ✅ Validation/dévalidation habitude en 1 clic
- ✅ Mise à jour instantanée interface (optimistic updates)
- ✅ Persistence données avec synchronisation serveur
- ✅ Calcul automatique streaks et pourcentages
- ✅ Reset quotidien des habitudes non validées
- ✅ Historique complet des validations

---

### 📝 US4 — Tableau de bord avec statistiques

**En tant qu'utilisateur, je veux visualiser mes performances via un dashboard avec graphiques et métriques pour rester motivé.**

#### Sous-tâches techniques Next.js

- **Pages & Composants UI** :
  - `/app/dashboard/stats/page.tsx` - Page dédiée statistiques avancées
  - `/app/ui/dashboard/stats-overview.tsx` - Vue d'ensemble avec KPIs
  - `/app/ui/dashboard/weekly-chart.tsx` - Graphique progression hebdomadaire
  - `/app/ui/dashboard/category-breakdown.tsx` - Répartition par catégories
  - `/app/ui/dashboard/achievement-badges.tsx` - Badges et accomplissements

- **API & Data Fetching** :
  - `/app/api/stats/overview/route.ts` - Métriques principales utilisateur
  - `/app/api/stats/trends/route.ts` - Données tendances et évolution
  - `/app/lib/stats-calculations.ts` - Fonctions calculs statistiques
  - Cache avec `unstable_cache` pour performance

- **Visualisation données** :
  - Intégration Chart.js ou Recharts pour graphiques
  - Composants réutilisables pour différents types de charts
  - Animations CSS pour transitions fluides
  - Responsive design pour mobile/desktop

- **Métriques calculées** :
  - Taux de réussite global et par période
  - Séries actuelles et records personnels
  - Évolution tendances (amélioration/régression)
  - Comparaisons période précédente

#### Critères d'acceptation
- ✅ Affichage temps réel des statistiques personnelles
- ✅ Graphiques interactifs de progression
- ✅ Métriques de motivation (streaks, records)
- ✅ Comparaisons temporelles (semaine vs précédente)
- ✅ Interface responsive et animations fluides
- ✅ Performance optimisée avec cache et pagination

---

### 📝 US5 — Profil utilisateur et paramètres

**En tant qu'utilisateur, je veux pouvoir gérer mon profil et personnaliser mes préférences pour une expérience optimale.**

#### Sous-tâches techniques Next.js

- **Pages & Composants UI** :
  - `/app/dashboard/profile/page.tsx` - Page profil avec informations utilisateur
  - `/app/dashboard/settings/page.tsx` - Paramètres et préférences
  - `/app/ui/profile/profile-form.tsx` - Formulaire édition profil
  - `/app/ui/settings/notification-settings.tsx` - Gestion notifications
  - `/app/ui/settings/privacy-settings.tsx` - Paramètres confidentialité

- **API & Server Actions** :
  - `/app/api/user/profile/route.ts` - CRUD informations profil
  - `/app/api/user/settings/route.ts` - Sauvegarde préférences
  - `/app/lib/profile-actions.ts` - Server Actions profil
  - Upload avatar avec gestion fichiers

- **Base de données** :
  - Ajout colonnes `users(avatar_url, timezone, theme_preference, notification_settings)`
  - Migration pour nouveaux champs
  - Validation contraintes données

- **Fonctionnalités** :
  - Upload et gestion avatar utilisateur
  - Gestion timezone pour calculs date
  - Préférences thème (clair/sombre)
  - Paramètres notifications push/email

#### Critères d'acceptation
- ✅ Modification informations profil en temps réel
- ✅ Upload avatar avec preview instantané
- ✅ Sauvegarde automatique préférences
- ✅ Gestion timezone pour dates correctes
- ✅ Interface paramètres intuitive et accessible

---

## 🥈 Version 2.0 - Fonctionnalités Avancées

### 🎯 Objectif V2
Enrichir l'expérience utilisateur avec des fonctionnalités sociales, de gamification et d'analyse avancée.

---

### 📝 US6 — Système de défis et challenges

**En tant qu'utilisateur, je veux pouvoir participer à des défis communautaires et créer des challenges avec mes amis.**

#### Sous-tâches techniques Next.js

- **Pages & Composants UI** :
  - `/app/dashboard/challenges/page.tsx` - Marketplace des défis
  - `/app/dashboard/challenges/[id]/page.tsx` - Détail défi avec leaderboard
  - `/app/dashboard/challenges/create/page.tsx` - Création défi personnalisé
  - `/app/ui/challenges/challenge-card.tsx` - Carte défi avec progression
  - `/app/ui/challenges/leaderboard.tsx` - Classement participants

- **Real-time & Collaboration** :
  - WebSocket ou Server-Sent Events pour updates temps réel
  - `/app/api/challenges/[id]/join/route.ts` - Rejoindre défi
  - Notifications système pour nouveaux défis
  - Chat basique pour motivation mutuelle

- **Base de données** :
  - Migration : table `challenges(id, creator_id, name, description, start_date, end_date, habit_type, is_public)`
  - Migration : table `challenge_participants(id, challenge_id, user_id, joined_at, score)`
  - Migration : table `challenge_logs(id, challenge_id, user_id, date, completed)`

- **Gamification** :
  - Système points et niveaux utilisateur
  - Badges automatiques selon accomplissements
  - Récompenses virtuelles et célébrations
  - Algorithme matching défis selon profil

#### Critères d'acceptation
- ✅ Catalogue défis publics et privés
- ✅ Participation avec tracking automatique
- ✅ Leaderboard temps réel avec animations
- ✅ Notifications accomplissements
- ✅ Interface sociale motivante

---

### 📝 US7 — Analytics avancées et insights

**En tant qu'utilisateur, je veux des analyses approfondies de mes habitudes pour optimiser ma routine.**

#### Sous-tâches techniques Next.js

- **Pages & Composants UI** :
  - `/app/dashboard/insights/page.tsx` - Page insights personnalisés
  - `/app/ui/insights/pattern-analysis.tsx` - Analyse patterns comportementaux
  - `/app/ui/insights/correlation-chart.tsx` - Corrélations entre habitudes
  - `/app/ui/insights/recommendations.tsx` - Suggestions d'optimisation
  - `/app/ui/insights/prediction-chart.tsx` - Prédictions tendances

- **Machine Learning & Analytics** :
  - `/app/lib/ml/pattern-detection.ts` - Algorithmes détection patterns
  - `/app/lib/analytics/correlation-analysis.ts` - Calculs corrélations
  - `/app/lib/analytics/trend-prediction.ts` - Prédictions basées données
  - `/app/api/insights/patterns/route.ts` - API patterns utilisateur

- **Dashboard Analytics** :
  - Détection automatique patterns comportementaux
  - Suggestions automatiques d'optimisation routine
  - Prédictions tendances futures basées historique
  - Corrélations entre habitudes différentes

- **Rapports & Export** :
  - `/app/api/reports/generate/route.ts` - Génération rapports PDF
  - Export CSV données personnelles RGPD
  - Partage accomplissements réseaux sociaux
  - Intégration calendrier externe (Google Calendar)

#### Critères d'acceptation
- ✅ Insights personnalisés basés sur données utilisateur
- ✅ Recommandations intelligentes d'optimisation
- ✅ Rapports mensuels exportables PDF
- ✅ Visualisations avancées interactives
- ✅ Prédictions précises basées ML

---

## � Version 3.0 - Écosystème Complet

### 🎯 Objectif V3
Transformer HabitFlow en plateforme complète avec marketplace, coaching et intégrations tierces.

---

### 📝 US8 — Marketplace de routines et coaching

**En tant qu'utilisateur, je veux accéder à des routines d'experts et bénéficier de coaching personnalisé.**

#### Sous-tâches techniques Next.js

- **Marketplace & E-commerce** :
  - `/app/marketplace/page.tsx` - Catalogue routines payantes
  - `/app/marketplace/[id]/page.tsx` - Détail routine avec preview
  - Intégration Stripe pour paiements
  - Système abonnement premium tiers

- **IA & Coaching** :
  - Intégration OpenAI pour conseils personnalisés
  - Chatbot coach disponible 24/7
  - Analyse sentiment pour adaptation coaching
  - Recommandations routines basées profil

- **Contenu Expert** :
  - CMS pour créateurs de contenu
  - Système commission créateurs
  - Reviews et ratings routines
  - Certification experts partenaires

#### Critères d'acceptation
- ✅ Marketplace fonctionnelle avec paiements
- ✅ IA coach responsive et utile
- ✅ Écosystème créateurs viable
- ✅ Conversion freemium >5%

---

### 📝 US9 — Intégrations écosystème & API publique

**En tant qu'utilisateur, je veux connecter HabitFlow avec mes autres apps santé et productivité.**

#### Sous-tâches techniques Next.js

- **API & Intégrations** :
  - `/app/api/integrations/fitbit/route.ts` - Sync données Fitbit
  - `/app/api/integrations/apple-health/route.ts` - HealthKit iOS
  - `/app/api/integrations/google-fit/route.ts` - Google Fit Android
  - OAuth flows pour services tiers

- **Wearables & IoT** :
  - Sync automatique Apple Watch, Fitbit
  - Détection activité automatique (steps, sleep)
  - Triggers smart home (Philips Hue pour célébrations)
  - Intégration calendrier pour planification

- **API Publique** :
  - Documentation développeurs OpenAPI
  - SDK JavaScript pour partenaires
  - Webhooks pour notifications tierces
  - Rate limiting et authentification API

#### Critères d'acceptation
- ✅ Sync bidirectionnel données santé
- ✅ API publique documentée et stable
- ✅ Écosystème partenaires actif
- ✅ Adoption API >100 développeurs

---

### 📝 US10 — Solution Entreprise B2B

**En tant qu'organisation, je veux déployer HabitFlow pour le bien-être de mes équipes.**

#### Sous-tâches techniques Next.js

- **Admin Dashboard** :
  - `/app/admin/dashboard/page.tsx` - Vue d'ensemble organisation
  - `/app/admin/teams/page.tsx` - Gestion équipes et départements
  - `/app/admin/analytics/page.tsx` - Analytics équipe anonymisées
  - Système rôles et permissions granulaires

- **Bien-être Corporatif** :
  - Programmes bien-être pré-configurés
  - Challenges équipe avec classements
  - Rapports bien-être anonymisés RH
  - Intégration HRIS et SSO entreprise

- **Compliance & Sécurité** :
  - Conformité RGPD complète
  - Audit logs toutes actions
  - Hébergement région spécifique
  - Certification SOC 2 Type II

#### Critères d'acceptation
- ✅ Solution B2B complète déployable
- ✅ ROI mesurable bien-être employés
- ✅ Conformité réglementaire complète
- ✅ Pricing viable segments entreprise

---

## 🚀 Roadmap de Développement

### Phase 1 (MVP) - 8 semaines ✅
- **Semaines 1-2** : Setup projet, authentification NextAuth, base PostgreSQL
- **Semaines 3-4** : CRUD habitudes, tracking quotidien avec Server Actions
- **Semaines 5-6** : Dashboard moderne, statistiques, design glassmorphism
- **Semaines 7-8** : Tests E2E, optimisations performance, déploiement Vercel

### Phase 2 (Avancé) - 6 semaines
- **Semaines 9-11** : Système défis, gamification, notifications push
- **Semaines 12-14** : Analytics avancées, ML patterns, exports

### Phase 3 (Écosystème) - 8 semaines
- **Semaines 15-18** : Marketplace, coaching IA, intégrations tierces
- **Semaines 19-22** : Fonctionnalités B2B, API publique, compliance

---

## 📊 Métriques de Succès

### Engagement Utilisateur
- **Retention D7** : >40% (benchmark apps habitudes)
- **Retention D30** : >20% (objectif premium)
- **Session moyenne** : >3 minutes (engagement qualité)
- **Habitudes trackées/jour** : >2.5 (utilisation intensive)
- **Streak moyen** : >7 jours (formation habitude)

### Performance Technique Next.js
- **Core Web Vitals** : 
  - FCP < 1.5s, LCP < 2.5s, CLS < 0.1
- **Uptime** : >99.9% (Vercel SLA)
- **Temps réponse API** : <200ms P95
- **Bundle size** : <500KB initial load
- **Lighthouse Score** : >90 toutes métriques

### Business KPIs
- **Croissance utilisateurs** : +15% MoM
- **Taux conversion premium** : >3%
- **ARPU** : >€8/mois (freemium model)
- **Score satisfaction** : >4.5/5 (App Store)
- **Support tickets** : <2% utilisateurs actifs
- **Churn mensuel** : <10%

### Métriques Produit
- **Time to first habit** : <2 minutes
- **Habitudes par utilisateur** : >5 moyenne
- **Engagement streak** : >80% utilisateurs 7+ jours
- **Feature adoption** : >60% nouvelles fonctionnalités
- **Feedback score** : >4.0/5 nouvelles features

---

## 🔧 Architecture Technique Next.js

### Structure du Projet
```
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── habits/
│   │   ├── stats/
│   │   ├── challenges/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/
│   │   ├── habits/
│   │   ├── stats/
│   │   └── challenges/
│   ├── ui/
│   │   ├── components/
│   │   └── dashboard/
│   └── lib/
│       ├── actions.ts
│       ├── data.ts
│       └── utils.ts
├── prisma/
│   └── schema.prisma
└── middleware.ts
```

### Technologies Clés
- **Next.js 15** : App Router, Server Components, Server Actions
- **TypeScript** : Type safety complète
- **Prisma** : ORM type-safe avec PostgreSQL
- **NextAuth.js v5** : Authentification moderne
- **TailwindCSS** : Styling utilitaire avec design system
- **Zod** : Validation schémas runtime
- **Vercel** : Déploiement et hébergement optimisé

## 📅 Méthodologie
**Agile / Scrum**

## ⚙️ Stack cible
- React Native
- Node.js
- PostgreSQL
- Firebase Notifications

---

## 🥇 V1 – Version de base (MVP fonctionnelle)

### 🎯 Objectif
Mettre en place les fonctionnalités essentielles pour le suivi d’habitudes avec authentification et statistiques simples.

---

### US1 — Création et gestion de compte utilisateur

**En tant qu’utilisateur, je veux pouvoir avoir accès à mon compte dans le but de sauvegarder mes données.**

#### Sous-tâches dev

- **Front :**
	- Page d’inscription (email + mot de passe)
	- Page de connexion
	- Page de profil simple (affichage infos user)
- **Back :**
	- Endpoint inscription
	- Endpoint connexion
	- Endpoint profil
	- Gestion JWT pour la session
- **DB :**
	- Table `users(id, email, password_hash, created_at, last_login)`

#### Critères d’acceptation

- L’utilisateur peut se connecter/déconnecter
- Les données sont sauvegardées et sécurisées
- Le token expire correctement

---

### US2 — Ajouter des activités (habitudes)

**En tant qu’utilisateur, je veux pouvoir ajouter des activités avec un nom et une fréquence de réalisation dans le but d’avoir un suivi de routine quotidienne.**

#### Sous-tâches dev

- **Front :**
	- Formulaire d’ajout d’activité (nom, fréquence)
	- Validation du formulaire
- **Back :**
	- Endpoint ajout activité
	- Endpoint liste activités
- **DB :**
	- Table `activities(id, user_id, name, frequency, created_at)`

#### Critères d’acceptation

- L’activité apparaît dans la liste immédiatement après ajout
- La fréquence est enregistrée correctement
- Les données persistent en DB

---

### US3 — Archiver une activité

**En tant qu’utilisateur, je veux pouvoir archiver des activités dans le but de ranger et changer ma routine.**

#### Sous-tâches dev

- **Front :**
	- Bouton “🗑️ Archiver” sur chaque activité
	- Popup de confirmation
- **Back :**
	- Endpoint suppression activité
- **DB :**
	- Suppression en cascade des logs liés à l’activité

#### Critères d’acceptation

- L’activité disparaît instantanément de la liste
- Les données liées sont nettoyées proprement

---

### US4 — Valider la réalisation des activités

**En tant qu’utilisateur, je veux pouvoir valider la réalisation ou non d’une activité dans le but de savoir si mes objectifs sont réussis.**

#### Sous-tâches dev

- **Front :**
	- Checkbox ou toggle de validation
	- Animation de réussite (genre check vert)
- **Back :**
	- Endpoint validation activité
	- Endpoint logs activité
- **DB :**
	- Table `activity_logs(id, activity_id, date, is_done)`

#### Critères d’acceptation

- Un clic suffit à valider une activité
- Les logs sont enregistrés côté serveur
- Le statut reste visible après refresh

---

### US5 — Voir ses statistiques

**En tant qu’utilisateur, je veux pouvoir voir mes stats du jour/mois/semaine dans le but de visualiser mon évolution.**

#### Sous-tâches dev

- **Front :**
	- Page “Profil” avec graphiques (barres ou camemberts)
	- Filtres (jour / semaine / mois)
- **Back :**
	- Endpoint stats
	- Agrégation des activity_logs
- **DB :**
	- Requêtes groupées par période

#### Critères d’acceptation

- Les stats s’affichent avec les bons filtres
- Données actualisées instantanément
- Résumé global visible (pourcentage de réussite)

---

### US6 — Backoffice admin (stats globales)

**En tant qu’administrateur, je veux pouvoir avoir un backoffice avec les statistiques du nombre d’utilisateurs connectés et d’activités créées.**

#### Sous-tâches dev

- **Front (admin panel) :**
	- Dashboard simple (utilisateurs / activités)
- **Back :**
	- Endpoint stats globales
- **DB :**
	- Compte des utilisateurs + activités via requêtes

#### Critères d’acceptation

- Dashboard lisible avec les chiffres clés
- Accès restreint (rôle admin)
- Données en temps réel (ou rafraîchies auto)

---

## 🥈 V2 – Version Modérée (Progression & Social)

### 🎯 Objectif
Rendre l’expérience plus motivante avec des outils de comparaison et d’interaction entre utilisateurs.

---

### US7 — Barre de progression quotidienne

**En tant qu’utilisateur, je veux voir une barre de progression indiquant l’avancée de la journée.**

#### Sous-tâches dev

- Calcul dynamique
- UI : barre animée (progress bar)
- Reset automatique à minuit

---
### US7 — Supprimer une activité

**En tant qu’utilisateur, je veux pouvoir supprimer des activités dans le but de ranger et changer ma routine.**

#### Sous-tâches dev

- **Front :**
	- Bouton “🗑️ Supprimer” sur chaque activité
	- Popup de confirmation
- **Back :**
	- Endpoint suppression activité
- **DB :**
	- Suppression en cascade des logs liés à l’activité

#### Critères d’acceptation

- L’activité disparaît instantanément de la liste
- Les données liées sont nettoyées proprement

---
### US8 — Comparer les statistiques

**En tant qu’utilisateur, je veux pouvoir comparer les stats sur 2 mois, semaines ou jours différents.**

#### Sous-tâches dev

- **Front :**
	- Sélecteurs de période (dropdown)
	- Graphiques comparatifs
- **Back :**
	- Endpoint comparaison stats
- **DB :**
	- Requêtes groupées multi-périodes

#### Critères

- Comparaison claire (couleurs différentes)
- Données précises et cohérentes

---

### US9 — Défis entre amis

**En tant qu’utilisateur, je veux pouvoir défier d’autres personnes dans le but de me booster à base de compétition.**

#### Sous-tâches dev

- **Front :**
	- Liste d’amis (via pseudo ou ID)
	- Système d’invitation / notification
- **Back :**
	- Table `challenges(id, challenger_id, friend_id, activity_id, status, score)`
	- Endpoints défis
- **DB :**
	- Logs reliés aux défis

#### Critères d’acceptation

- Notification de défi reçue
- Score affiché en temps réel
- Fin du défi = notification + badge

---

### US10 — Backoffice avancé

**En tant qu’administrateur, je veux pouvoir voir les utilisateurs, leurs affiliations et leur rythme de connexion.**

#### Sous-tâches dev

- Tableau admin : liste users + connexions
- Endpoint connexions
- Table `user_connections(user_id, last_login, streak_connexions)`

#### Critères

- Données actualisées automatiquement
- Vue claire et filtrable

---

## 🥉 V3 – Version Social & Gamifiée

### 🎯 Objectif
Créer une expérience communautaire motivante et esthétique.

---

### US11 — Ajout d’événements (par admin)

**En tant qu’administrateur, je veux pouvoir ajouter des événements (Dry January, Octobre Rose) pour motiver les utilisateurs.**

#### Sous-tâches dev

- Formulaire d’événement (nom, date, description)
- Table `events(id, name, start_date, end_date, description)`
- Liaison `user_events(user_id, event_id)`
- UI : page “Événements” + bouton “Participer”

---

### US12 — Personnaliser ses activités

**En tant qu’utilisateur, je veux pouvoir personnaliser mes activités (emoji, couleur).**

#### Sous-tâches dev

- Formulaire d’édition d’activité
- Champs color, icon dans la DB
- UI : color picker + emoji picker

---

### US13 — Gagner des badges

**En tant qu’utilisateur, je veux voir mes badges pour gratifier mes réussites.**

#### Sous-tâches dev

- Table `badges(id, title, condition)`
- Table `user_badges(user_id, badge_id)`
- Endpoint badges
- UI : affichage sur profil

---

### US14 — Noter / motiver ses amis

**En tant qu’utilisateur, je veux pouvoir remettre une note, un emoji à mes amis pour les encourager.**

#### Sous-tâches dev

- Table `motivations(id, sender_id, receiver_id, emoji, comment, date)`
- Endpoint motivations
- UI : liste des motivations reçues

---

### US15 — Modération des notes

**En tant qu’administrateur, je veux pouvoir modérer les notes entre utilisateurs pour éviter les abus.**

#### Sous-tâches dev

- Backoffice “modération”
- Endpoint modération
- Bouton supprimer / bannir utilisateur
- Logs d’action admin
