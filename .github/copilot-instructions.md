# Copilot Instructions - HabitFlow

## ⚠️ Règles ESLint Strictes

### Caractères Spéciaux en JSX

**TOUJOURS échapper les apostrophes et guillemets dans le contenu JSX** :

```tsx
// ❌ INCORRECT
<p>L'événement commence aujourd'hui</p>
<span>Créer un "nouveau" projet</span>

// ✅ CORRECT
<p>L&apos;événement commence aujourd&apos;hui</p>
<span>Créer un &quot;nouveau&quot; projet</span>
```

**Codes d'échappement HTML** :
- `'` (apostrophe) → `&apos;`
- `"` (guillemets doubles) → `&quot;`

### Variables Non Utilisées

**Supprimer ou commenter les variables non utilisées** :

```tsx
// ❌ INCORRECT
const userInfo = await fetchUserLevelInfo(email); // jamais utilisé

// ✅ CORRECT - Option 1 : Supprimer
// Ligne supprimée

// ✅ CORRECT - Option 2 : Utiliser _ pour ignorer
// const _userInfo = await fetchUserLevelInfo(email);
```

### Type `any`

**Éviter `any`, typer explicitement** :

```tsx
// ❌ INCORRECT
const events: any = await prisma.$queryRaw`...`;

// ✅ CORRECT
const events: Array<{ id: number }> = await prisma.$queryRaw`...`;
```

### Vérification avant Commit

**Toujours lancer le build pour vérifier les erreurs** :

```bash
pnpm run build
# ou
npm run build
```

---

## Système de Thèmes avec Tailwind v4 @theme

### Variables de Thème Disponibles

Les thèmes sont définis dans `app/ui/global.css` avec `@theme` et des classes `.theme-{name}`.

**Variables CSS disponibles** (définies dans `@theme`) :
- `--color-theme-bg` - Couleur de fond principale
- `--color-theme-surface` - Couleur des surfaces (cartes, panels)
- `--color-theme-text` - Couleur du texte principal
- `--color-theme-text-muted` - Couleur du texte secondaire
- `--color-theme-border` - Couleur des bordures
- `--color-theme-accent` - Couleur d'accent (boutons, liens)

### Classes Tailwind Générées Automatiquement

Tailwind v4 génère automatiquement des classes à partir des variables `@theme` :

```tsx
// Backgrounds
<div className="bg-theme-bg">
<div className="bg-theme-surface">
<div className="bg-theme-accent">

// Text
<p className="text-theme-text">
<span className="text-theme-text-muted">

// Borders
<div className="border-theme-border">
```

### Thèmes Disponibles

5 thèmes avec déblocage par niveau :
- `light` (niveau 1) - Rose clair par défaut
- `dark` (niveau 3+) - Sombre bleu-gris
- `sunset` (niveau 3+) - Orange chaud
- `ocean` (niveau 3+) - Bleu frais
- `forest` (niveau 3+) - Vert nature

### Application du Thème

Le thème est appliqué via une classe sur `<html>` dans `app/layout.tsx` :

```tsx
<html lang="en" className={`theme-${userTheme}`}>
```

### Changement de Thème

1. L'utilisateur sélectionne un thème dans `/dashboard/settings`
2. Action serveur `updateUserTheme()` sauvegarde en BDD
3. Page recharge
4. Layout récupère le thème et l'applique sur `<html>`
5. CSS applique les variables via la classe `.theme-{name}`
6. Toutes les classes Tailwind `bg-theme-*`, `text-theme-*`, etc. s'adaptent automatiquement

### Base de Données

**Table `users`** :
- `theme` (VARCHAR) - Valeur : 'light', 'dark', 'sunset', 'ocean', 'forest'
- `timezone` (VARCHAR) - Fuseau horaire de l'utilisateur
- `name` (VARCHAR) - Nom modifiable
- `email` (VARCHAR) - Non modifiable

### Actions Serveur

**`app/lib/actions.ts`** :
- `updateUserTheme(theme: string)` - Change le thème
- `updateUserName(name: string)` - Change le nom (validation 2-50 char)
- `updateUserTimezone(timezone: string)` - Change le fuseau horaire

### Paramètres Utilisateur

**Page `/dashboard/settings`** :
- **Thèmes** : Sélection visuelle avec preview couleurs
- **Nom** : Modifiable avec validation
- **Email** : Bloqué (disabled, bg-gray-50)
- **Timezone** : 14 fuseaux horaires disponibles

### Composants

**`app/ui/settings/theme-selector.tsx`** :
- Affiche les 5 thèmes avec preview
- Gestion déblocage par niveau
- Changement avec rechargement

**`app/ui/settings/account-settings.tsx`** :
- Formulaire nom + timezone
- Validation temps réel
- Email en lecture seule

### Règles de Style

**TOUJOURS utiliser les classes Tailwind générées** :
```tsx
// ✅ CORRECT
<div className="bg-theme-bg text-theme-text">
<div className="bg-theme-surface border border-theme-border">
<button className="bg-theme-accent hover:bg-theme-accent/90">

// ❌ INCORRECT
<div className="bg-white text-gray-900"> // Couleurs hardcodées
<div style={{ backgroundColor: 'var(--color-theme-bg)' }}> // Pas de style inline
```

**Gradients** : Utiliser `bg-linear-to-*` (Tailwind v4) au lieu de `bg-gradient-to-*`

### Technologies

- **Next.js 15** avec App Router
- **Tailwind CSS v4** avec directive `@theme`
- **Prisma** pour la BDD (PostgreSQL/Neon)
- **Server Actions** pour les mutations
- **TypeScript** strict mode

### Migration Prisma

```bash
# Synchroniser le schéma
npx prisma db push

# Générer le client
npx prisma generate

# Voir la structure
npx prisma studio
```

### Structure des Thèmes

```
app/
  ui/
    global.css           ← Définition @theme + classes .theme-*
  context/
    ThemeContext.tsx     ← SUPPRIMÉ (pas utilisé)
  layout.tsx             ← Application classe theme-{name} sur <html>
  dashboard/
    settings/
      page.tsx           ← Page paramètres
  lib/
    themes.ts            ← Config thèmes (niveaux, couleurs)
    actions.ts           ← Actions serveur
```

### Debug

Si les thèmes ne fonctionnent pas :
1. Vérifier que la classe `theme-{name}` est sur `<html>` (DevTools)
2. Vérifier les variables CSS dans DevTools (Computed styles)
3. S'assurer d'utiliser `bg-theme-*` et pas `bg-white`
4. Vérifier que le thème est bien sauvegardé en BDD

### Notes Importantes

- **Pas de classes CSS manuelles** - Tout via Tailwind
- **Pas de style inline** - Utiliser les classes Tailwind
- **Email non modifiable** - Sécurité et contrainte métier
- **Rechargement nécessaire** - Pour appliquer le nouveau thème (SSR)

---

## 🔔 Système de Notifications

### Architecture

**Base de données** :
- Table `notifications` - Stockage des notifications utilisateurs
- Table `event_challenges` - Défis liés aux événements admin
- Table `events` - Événements avec champ `isActive`

**Types de notifications** :
```typescript
type NotificationType = 
  | 'activity_late'      // Activité en retard
  | 'event_started'      // Événement commencé  
  | 'event_ending'       // Événement bientôt terminé
  | 'challenge_completed'// Défi complété
  | 'badge_earned'       // Badge obtenu
  | 'level_up';          // Montée de niveau
```

### Composants

**`app/ui/common/notification-bell.tsx`** :
- Badge cloche avec compteur notifications non lues
- Dropdown avec liste des 20 dernières notifications
- Actions : marquer comme lu, supprimer, voir
- Rechargement automatique toutes les 2 minutes
- Lien vers page complète des notifications

**`app/ui/notifications/notifications-box.tsx`** :
- Box élégante pour afficher 3 dernières notifications
- Design rose/blanc adapté au home
- Indicateur visuel pour notifications non lues
- Actions rapides : marquer comme lu, voir
- S'affiche uniquement s'il y a des notifications

**`app/ui/notifications/notifications-list.tsx`** :
- Liste complète avec filtres (toutes/non lues/lues)
- Actions : marquer toutes comme lues, supprimer les lues
- Design avec thèmes (`bg-theme-*`, `text-theme-*`)
- Suppression individuelle de notifications

### Pages

**`/dashboard/notifications`** :
- Page complète des notifications
- Filtrage et tri
- Actions groupées (marquer tout comme lu, supprimer lues)
- Affichage statistiques (non lues/lues)

**`/dashboard/admin/events`** (Admin uniquement) :
- Création/modification/suppression d'événements
- Ajout de défis avec récompenses
- Activation/désactivation événements
- Notifications automatiques lors ajout défis

### Actions Serveur

**`app/lib/notification-actions.ts`** :
```typescript
// CRUD
createNotification({ userId, type, title, message, link })
getUserNotifications(limit = 20)
markNotificationAsRead(notificationId)
markAllNotificationsAsRead()
deleteNotification(notificationId)

// Automatisations
checkLateActivities()      // Vérifie activités non complétées
notifyEventStart()         // Notifie début événements
notifyEventEnding()        // Notifie fin proche événements (J-2)
```

**`app/lib/event-actions.ts`** (Admin) :
```typescript
// Événements
createEvent(formData)
updateEvent(eventId, formData)
deleteEvent(eventId)
toggleEventStatus(eventId)  // Activer/désactiver
getEvents(activeOnly = false)

// Défis
addEventChallenge(eventId, formData)
deleteEventChallenge(challengeId)
getActiveEventsForUser()
```

### Automatisation - Cron

**Route** : `/api/cron/notifications`  
**Schedule** : Quotidien à 20h (configuré dans `vercel.json`)

**Actions exécutées** :
1. Vérifier activités quotidiennes non complétées
2. Créer notifications pour activités en retard
3. Notifier événements commençant aujourd'hui
4. Notifier événements se terminant dans 2 jours

**Sécurité** : Authentification par Bearer token (`CRON_SECRET`)

**Test manuel** (dev uniquement) :
```bash
# PowerShell
.\scripts\test-notifications.ps1

# Node.js
node scripts/test-notifications.js
```

### Utilisation

**Afficher NotificationBell** :
```tsx
import NotificationBell from '@/app/ui/common/notification-bell';

<NotificationBell />
```

**Afficher NotificationsBox sur home** :
```tsx
import NotificationsBox from '@/app/ui/notifications/notifications-box';

<NotificationsBox />
```

**Créer une notification** :
```typescript
await createNotification({
  userId: user.id,
  type: 'badge_earned',
  title: '🏅 Nouveau badge !',
  message: 'Vous avez gagné le badge "Persévérant"',
  link: '/dashboard/badges',
});
```

### Admin - Gestion Événements

**Accès** : `role = 'admin'` requis dans table users

**Fonctionnalités** :
- ✅ Créer événements (nom, description, dates)
- ✅ Ajouter défis (titre, objectif, récompense en ⭐)
- ✅ Activer/désactiver événements
- ✅ Voir statistiques participants
- ✅ Notifications automatiques à tous les users

**Création défi** :
- Titre, description (optionnelle)
- Objectif : nombre + unité (fois, jours, minutes...)
- Récompense : 1-100 étoiles
- Icône (emoji) + couleur
- → Tous les utilisateurs sont notifiés automatiquement

### Configuration

**Variables d'environnement** (.env) :
```bash
CRON_SECRET=votre-secret-securise-ici
```

**Créer un admin** :
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'votre.email@example.com';
```

### Règles de Style

**Composants notifications** :
```tsx
// ✅ CORRECT - Utiliser les classes de thème
<div className="bg-theme-surface text-theme-text border-theme-border">
<span className="text-theme-accent">

// ✅ NotificationsBox - Design rose/blanc pour home
<div className="bg-white border-pink-200">
<span className="text-pink-600">

// ❌ INCORRECT - Pas de couleurs hardcodées dans composants thème
<div className="bg-white text-gray-900">
```

### Documentation

- `NOTIFICATIONS_SYSTEM.md` - Doc technique complète
- `NOTIFICATIONS_QUICKSTART.md` - Guide démarrage rapide  
- `NOTIFICATIONS_SUCCESS.md` - Résumé implémentation
- `NOTIFICATIONS_FILES.md` - Liste des fichiers
- `setup-admin-and-test.sql` - Script SQL setup admin

### Notes Importantes

- **Pas de classes CSS manuelles** - Tout via Tailwind
- **Pas de style inline** - Utiliser les classes Tailwind
- **Email non modifiable** - Sécurité et contrainte métier
- **Rechargement nécessaire** - Pour appliquer le nouveau thème (SSR)
