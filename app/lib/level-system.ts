// Système de progression de levels pour HabitFlow
// 1 étoile = 1 XP

/**
 * Paliers de XP pour chaque level
 * Progression exponentielle pour garder le défi intéressant
 */
export const LEVEL_THRESHOLDS = [
  0,    // Level 1 (départ)
  10,   // Level 2 - Débutant 🌱
  25,   // Level 3 - Apprenti 🌿
  50,   // Level 4 - Habitué 🌳
  100,  // Level 5 - Expert ⭐
  125,  // Level 6 - Maître 💎
  175,  // Level 7 - Légende 👑
  250,  // Level 8 - Champion 🏆
  350,  // Level 9 - Titan 🔥
  500,  // Level 10 - Dieu Vivant ⚡
  750,  // Level 11 - Immortel 🌟
  1000, // Level 12
  1500, // Level 13
  2000, // Level 14
  3000, // Level 15
];

/**
 * Badges associés à chaque level
 */
export const LEVEL_BADGES = {
  2: { title: 'Débutant', icon: '🌱', rarity: 'common' },
  3: { title: 'Apprenti', icon: '🌿', rarity: 'common' },
  4: { title: 'Habitué', icon: '🌳', rarity: 'common' },
  5: { title: 'Expert', icon: '⭐', rarity: 'rare' },
  6: { title: 'Maître', icon: '💎', rarity: 'rare' },
  7: { title: 'Légende', icon: '👑', rarity: 'epic' },
  8: { title: 'Champion', icon: '🏆', rarity: 'epic' },
  9: { title: 'Titan', icon: '🔥', rarity: 'legendary' },
  10: { title: 'Dieu Vivant', icon: '⚡', rarity: 'legendary' },
  11: { title: 'Immortel', icon: '🌟', rarity: 'legendary' },
};

/**
 * Calcule le level actuel basé sur le total d'XP
 */
export function calculateLevel(xp: number): number {
  let level = 1;
  
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  
  return level;
}

/**
 * Calcule l'XP nécessaire pour le prochain level
 */
export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    // Au-delà du dernier palier, progression linéaire
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 
           (currentLevel - LEVEL_THRESHOLDS.length + 1) * 1000;
  }
  return LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

/**
 * Calcule l'XP nécessaire pour le level actuel (minimum)
 */
export function getXpForCurrentLevel(currentLevel: number): number {
  const index = currentLevel - 1;
  if (index < 0) return 0;
  if (index >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  }
  return LEVEL_THRESHOLDS[index] || 0;
}

/**
 * Calcule le pourcentage de progression vers le prochain level
 */
export function getLevelProgress(xp: number, currentLevel: number): number {
  const currentLevelXp = getXpForCurrentLevel(currentLevel);
  const nextLevelXp = getXpForNextLevel(currentLevel);
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  
  if (xpNeededForNextLevel === 0) return 100;
  
  const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Calcule combien d'XP manquent pour le prochain level
 */
export function getXpToNextLevel(xp: number, currentLevel: number): number {
  const nextLevelXp = getXpForNextLevel(currentLevel);
  return Math.max(nextLevelXp - xp, 0);
}

/**
 * Vérifie si l'utilisateur vient de passer un nouveau level
 */
export function hasLeveledUp(oldXp: number, newXp: number): { leveledUp: boolean, oldLevel: number, newLevel: number } {
  const oldLevel = calculateLevel(oldXp);
  const newLevel = calculateLevel(newXp);
  
  return {
    leveledUp: newLevel > oldLevel,
    oldLevel,
    newLevel
  };
}

/**
 * Retourne le badge à débloquer pour un level donné
 */
export function getLevelBadge(level: number): typeof LEVEL_BADGES[keyof typeof LEVEL_BADGES] | null {
  return LEVEL_BADGES[level as keyof typeof LEVEL_BADGES] || null;
}

/**
 * Formatte l'affichage du level avec son icône
 */
export function formatLevel(level: number): string {
  const badge = getLevelBadge(level);
  if (badge) {
    return `${badge.icon} Niveau ${level} - ${badge.title}`;
  }
  return `⭐ Niveau ${level}`;
}

/**
 * Retourne la couleur associée à la rareté du level
 */
export function getLevelColor(level: number): string {
  const badge = getLevelBadge(level);
  if (!badge) return 'text-gray-600';
  
  switch (badge.rarity) {
    case 'common': return 'text-green-600';
    case 'rare': return 'text-blue-600';
    case 'epic': return 'text-purple-600';
    case 'legendary': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
}

/**
 * Retourne le gradient de fond pour la rareté
 */
export function getLevelGradient(level: number): string {
  const badge = getLevelBadge(level);
  if (!badge) return 'from-gray-500 to-gray-700';
  
  switch (badge.rarity) {
    case 'common': return 'from-green-500 to-green-700';
    case 'rare': return 'from-blue-500 to-blue-700';
    case 'epic': return 'from-purple-500 to-purple-700';
    case 'legendary': return 'from-yellow-500 via-orange-500 to-red-500';
    default: return 'from-gray-500 to-gray-700';
  }
}
