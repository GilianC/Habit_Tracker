// Système de récompenses par niveau
// Chaque niveau débloque des fonctionnalités exclusives

export interface LevelReward {
  level: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  unlocked: boolean;
}

export const LEVEL_REWARDS: LevelReward[] = [
  {
    level: 1,
    title: 'Bienvenue !',
    description: 'Fonctionnalités de base',
    icon: '🌱',
    features: [
      'Créer des activités avec émojis',
      'Suivre tes habitudes quotidiennes',
      'Voir tes statistiques de base',
    ],
    unlocked: true, // Toujours débloqué
  },
  {
    level: 2,
    title: 'Apprenti motivé',
    description: 'Premières personnalisations',
    icon: '🌿',
    features: [
      '🎨 Personnalisation des couleurs d\'activités',
      '📅 Activités hebdomadaires et mensuelles',
      '🏆 Accès aux défis quotidiens',
    ],
    unlocked: false,
  },
  {
    level: 3,
    title: 'Habitué',
    description: 'Thèmes et apparence',
    icon: '🌳',
    features: [
      '🌙 Mode sombre',
      '🎭 3 thèmes de couleurs exclusifs',
      '📊 Graphiques de progression avancés',
    ],
    unlocked: false,
  },
  {
    level: 5,
    title: 'Expert',
    description: 'Fonctionnalités visuelles avancées',
    icon: '⭐',
    features: [
      '📸 Télécharger des photos pour les activités',
      '🖼️ Galerie d\'images personnalisées',
      '✨ Animations et effets visuels premium',
      '🎯 Créer des défis personnalisés',
    ],
    unlocked: false,
  },
  {
    level: 7,
    title: 'Maître',
    description: 'Collaboration et partage',
    icon: '💎',
    features: [
      '👥 Inviter des amis',
      '🤝 Défis d\'équipe',
      '📤 Partager tes statistiques',
      '🏅 Classements entre amis',
    ],
    unlocked: false,
  },
  {
    level: 10,
    title: 'Légende',
    description: 'Automatisation intelligente',
    icon: '👑',
    features: [
      '🤖 Suggestions d\'activités par IA',
      '📈 Analyses prédictives',
      '⏰ Rappels intelligents adaptatifs',
      '🔮 Coach virtuel personnalisé',
    ],
    unlocked: false,
  },
  {
    level: 15,
    title: 'Champion',
    description: 'Créativité maximale',
    icon: '🔥',
    features: [
      '🎨 Créer tes propres badges',
      '🏆 Badges animés',
      '🌟 Effets de particules personnalisés',
      '📝 Templates d\'activités partageables',
    ],
    unlocked: false,
  },
  {
    level: 20,
    title: 'Titan',
    description: 'Contrôle total',
    icon: '⚡',
    features: [
      '⚙️ API personnelle pour exporter tes données',
      '📊 Dashboard personnalisable',
      '🔌 Intégrations avec autres apps (Apple Health, Google Fit)',
      '💾 Backup automatique cloud',
    ],
    unlocked: false,
  },
  {
    level: 25,
    title: 'Dieu Vivant',
    description: 'Pouvoir ultime',
    icon: '✨',
    features: [
      '🎬 Création de vidéos de progression',
      '🎭 Avatar 3D personnalisé',
      '🌍 Communauté mondiale exclusive',
      '🏛️ Nom dans le Hall of Fame',
    ],
    unlocked: false,
  },
  {
    level: 30,
    title: 'Immortel',
    description: 'Au-delà des limites',
    icon: '🌟',
    features: [
      '♾️ Accès à vie à toutes les fonctionnalités futures',
      '👤 Badge "Fondateur" unique',
      '🎁 Récompenses mensuelles exclusives',
      '🤝 Conseiller de la communauté',
      '💫 Ton propre badge personnalisé dans l\'app',
    ],
    unlocked: false,
  },
];

// Récupérer les récompenses débloquées pour un niveau donné
export function getUnlockedRewards(currentLevel: number): LevelReward[] {
  return LEVEL_REWARDS.map(reward => ({
    ...reward,
    unlocked: currentLevel >= reward.level,
  }));
}

// Récupérer la prochaine récompense à débloquer
export function getNextReward(currentLevel: number): LevelReward | null {
  const nextReward = LEVEL_REWARDS.find(reward => reward.level > currentLevel);
  return nextReward || null;
}

// Vérifier si une fonctionnalité est débloquée
export function isFeatureUnlocked(currentLevel: number, requiredLevel: number): boolean {
  return currentLevel >= requiredLevel;
}

// Récupérer toutes les fonctionnalités débloquées
export function getUnlockedFeatures(currentLevel: number): string[] {
  return LEVEL_REWARDS
    .filter(reward => reward.level <= currentLevel)
    .flatMap(reward => reward.features);
}
