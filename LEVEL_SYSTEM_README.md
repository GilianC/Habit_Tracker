# 🎮 Système de Levels et XP - HabitFlow

## 📊 Vue d'ensemble

Système de progression basé sur les étoiles gagnées dans les défis :
- **1 étoile = 1 XP**
- **Level monte automatiquement** selon paliers progressifs
- **Badge automatique** à chaque nouveau level atteint

---

## 🏆 Paliers de Levels

| Level | XP Requis | Badge | Rareté |
|-------|-----------|-------|---------|
| 1 | 0 | - | - |
| 2 | 10 | Débutant 🌱 | Common |
| 3 | 25 | Apprenti 🌿 | Common |
| 4 | 50 | Habitué 🌳 | Common |
| 5 | 100 | Expert ⭐ | Rare |
| 6 | 125 | Maître 💎 | Rare |
| 7 | 175 | Légende 👑 | Epic |
| 8 | 250 | Champion 🏆 | Epic |
| 9 | 350 | Titan 🔥 | Legendary |
| 10 | 500 | Dieu Vivant ⚡ | Legendary |
| 11+ | 750+ | Immortel 🌟 | Legendary |

---

## 🚀 Migration

### Étape 1: Exécuter le Script SQL

**Via Neon Console (Recommandé):**
1. Allez sur [Neon Console](https://console.neon.tech)
2. Sélectionnez votre projet
3. Ouvrez l'éditeur SQL
4. Copiez tout le contenu de `migrations/001_add_level_system.sql`
5. Exécutez le SQL

**Via PowerShell (Alternative):**
```powershell
.\run-migration.ps1 -MigrationFile migrations\001_add_level_system.sql
```

### Étape 2: Vérifier la Migration

Exécutez cette requête SQL pour voir les résultats :
```sql
SELECT 
  email, 
  stars, 
  xp, 
  level,
  (SELECT COUNT(*) FROM user_badges WHERE user_id = users.id) as badges_total
FROM users
ORDER BY level DESC, xp DESC;
```

---

## 💻 Utilisation dans le Code

### Ajouter de l'XP quand un défi est complété

```typescript
import { addUserXp } from '@/app/lib/level-actions';

// Ajouter 5 XP (= 5 étoiles)
await addUserXp(userEmail, 5);

// Résultat retourné :
// {
//   success: true,
//   oldXp: 15,
//   newXp: 20,
//   oldLevel: 2,
//   newLevel: 3,
//   leveledUp: true // Si level up
// }
```

### Afficher le Level de l'utilisateur

```typescript
import { fetchUserLevelInfo } from '@/app/lib/data';
import { 
  getXpForNextLevel, 
  getXpToNextLevel,
  getLevelProgress 
} from '@/app/lib/level-system';

const userInfo = await fetchUserLevelInfo(session.user.email);
// {
//   id: "1",
//   name: "John Doe",
//   email: "john@example.com",
//   stars: 50,
//   xp: 50,
//   level: 4,
//   totalBadges: 3
// }

const xpForNext = getXpForNextLevel(userInfo.level); // 100
const xpNeeded = getXpToNextLevel(userInfo.xp, userInfo.level); // 50
const progress = getLevelProgress(userInfo.xp, userInfo.level); // 0%
```

---

## 🎨 Fonctions Utilitaires

### `level-system.ts`

```typescript
// Calculer le level depuis les XP
calculateLevel(xp: number): number

// XP nécessaire pour le prochain level
getXpForNextLevel(currentLevel: number): number

// XP manquants pour level up
getXpToNextLevel(xp: number, currentLevel: number): number

// Pourcentage de progression (0-100)
getLevelProgress(xp: number, currentLevel: number): number

// Vérifier si level up
hasLeveledUp(oldXp: number, newXp: number): { leveledUp, oldLevel, newLevel }

// Badge du level
getLevelBadge(level: number): { title, icon, rarity } | null

// Formater affichage
formatLevel(level: number): string // "🌱 Niveau 2 - Débutant"

// Couleurs selon rareté
getLevelColor(level: number): string // Classe Tailwind
getLevelGradient(level: number): string // Gradient Tailwind
```

---

## 📦 Fichiers Modifiés

### Créés
- ✅ `migrations/001_add_level_system.sql` - Script SQL de migration
- ✅ `app/lib/level-system.ts` - Fonctions utilitaires level
- ✅ `app/lib/level-actions.ts` - Server Action pour ajouter XP
- ✅ `run-migration.ps1` - Script PowerShell pour migrations

### Modifiés
- ✅ `app/lib/data.ts` - Ajout `fetchUserLevelInfo()`
- ✅ `app/lib/actions.ts` - `completeChallenge()` utilise `addUserXp()`

### Supprimés
- ✅ `app/migrate*/` - Toutes les routes de migration (nettoyage)

---

## 🧪 Tester le Système

### 1. Compléter un Défi

```typescript
// Dans une page/composant
import { completeChallenge } from '@/app/lib/actions';

await completeChallenge(userChallengeId);
// ✨ Ajoute automatiquement les étoiles/XP
// 🎉 Level up si palier atteint
// 🏆 Badge débloqué automatiquement
```

### 2. Vérifier la Page Profile

```typescript
// app/dashboard/profile/page.tsx
const levelInfo = await fetchUserLevelInfo(session.user.email);

<div>
  <p>Niveau {levelInfo.level}</p>
  <p>{levelInfo.xp} XP</p>
  <progress value={getLevelProgress(levelInfo.xp, levelInfo.level)} max="100" />
</div>
```

---

## 🐛 Debug

### Logs à surveiller

Quand un défi est complété, vous devriez voir :
```
✨ [ADD XP] +5 XP pour user@example.com
📊 XP: 15 -> 20 | Level: 2 -> 2
```

Si level up :
```
🎉 [LEVEL UP] Niveau 2 -> 3!
🏆 Badge débloqué: Apprenti
```

### Vérifier la DB

```sql
-- XP et Level corrects ?
SELECT email, stars, xp, level FROM users;

-- Badges débloqués ?
SELECT 
  u.email,
  b.title,
  b.category
FROM user_badges ub
JOIN users u ON ub.user_id = u.id
JOIN badges b ON ub.badge_id = b.id
WHERE b.category = 'level'
ORDER BY u.email, b.star_cost;
```

---

## ✅ Checklist de Déploiement

- [ ] Migration SQL exécutée sur la DB de production
- [ ] Variables level/xp ajoutées à la table users
- [ ] Badges de level créés
- [ ] Utilisateurs existants synchronisés
- [ ] Code déployé (level-system.ts, level-actions.ts)
- [ ] Page Profile mise à jour avec vraies données
- [ ] Tests : compléter un défi → level up → badge automatique

---

## 🎯 Prochaines Étapes

1. **Afficher le level dans la nav** - Badge à côté du nom d'utilisateur
2. **Leaderboard** - Classement par level/XP
3. **Effets visuels** - Animation quand level up
4. **Rewards** - Débloquer features selon level
5. **Daily XP Bonus** - +1 XP par activité complétée

---

Créé le 25/11/2025 🚀
