// Système de thèmes pour l'application

export type Theme = 'light' | 'dark' | 'sunset' | 'ocean' | 'forest';

export interface ThemeConfig {
  id: Theme;
  name: string;
  description: string;
  requiredLevel: number;
  colors: {
    // Backgrounds
    background: string;
    surface: string;
    surfaceHover: string;
    
    // Text
    text: string;
    textSecondary: string;
    
    // Primary colors
    primary: string;
    primaryHover: string;
    
    // Accents
    accent: string;
    accentSecondary: string;
    
    // Status
    success: string;
    error: string;
    warning: string;
    info: string;
  };
}

export const THEMES: Record<Theme, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'Clair',
    description: 'Thème par défaut lumineux',
    requiredLevel: 1,
    colors: {
      background: '#FDF2F8', // pink-50
      surface: '#FFFFFF',
      surfaceHover: '#FCE7F3',
      text: '#1F2937', // gray-800
      textSecondary: '#6B7280', // gray-500
      primary: '#EC4899', // pink-500
      primaryHover: '#DB2777', // pink-600
      accent: '#F472B6', // pink-400
      accentSecondary: '#FBCFE8', // pink-200
      success: '#10B981', // green-500
      error: '#EF4444', // red-500
      warning: '#F59E0B', // amber-500
      info: '#3B82F6', // blue-500
    },
  },
  
  dark: {
    id: 'dark',
    name: 'Sombre',
    description: 'Repose tes yeux la nuit',
    requiredLevel: 3,
    colors: {
      background: '#0F172A', // slate-900
      surface: '#1E293B', // slate-800
      surfaceHover: '#334155', // slate-700
      text: '#F1F5F9', // slate-100
      textSecondary: '#94A3B8', // slate-400
      primary: '#F472B6', // pink-400
      primaryHover: '#EC4899', // pink-500
      accent: '#FBCFE8', // pink-200
      accentSecondary: '#DB2777', // pink-600
      success: '#34D399', // green-400
      error: '#F87171', // red-400
      warning: '#FBBF24', // amber-400
      info: '#60A5FA', // blue-400
    },
  },
  
  sunset: {
    id: 'sunset',
    name: 'Coucher de soleil',
    description: 'Ambiance chaleureuse orange-rose',
    requiredLevel: 3,
    colors: {
      background: '#FFF7ED', // orange-50
      surface: '#FFFFFF',
      surfaceHover: '#FFEDD5', // orange-100
      text: '#7C2D12', // orange-900
      textSecondary: '#9A3412', // orange-800
      primary: '#F97316', // orange-500
      primaryHover: '#EA580C', // orange-600
      accent: '#FB923C', // orange-400
      accentSecondary: '#FDBA74', // orange-300
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
  },
  
  ocean: {
    id: 'ocean',
    name: 'Océan',
    description: 'Fraîcheur bleu-turquoise',
    requiredLevel: 3,
    colors: {
      background: '#ECFEFF', // cyan-50
      surface: '#FFFFFF',
      surfaceHover: '#CFFAFE', // cyan-100
      text: '#164E63', // cyan-900
      textSecondary: '#0E7490', // cyan-800
      primary: '#06B6D4', // cyan-500
      primaryHover: '#0891B2', // cyan-600
      accent: '#22D3EE', // cyan-400
      accentSecondary: '#67E8F9', // cyan-300
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
  },
  
  forest: {
    id: 'forest',
    name: 'Forêt',
    description: 'Calme vert naturel',
    requiredLevel: 3,
    colors: {
      background: '#F0FDF4', // green-50
      surface: '#FFFFFF',
      surfaceHover: '#DCFCE7', // green-100
      text: '#14532D', // green-900
      textSecondary: '#166534', // green-800
      primary: '#22C55E', // green-500
      primaryHover: '#16A34A', // green-600
      accent: '#4ADE80', // green-400
      accentSecondary: '#86EFAC', // green-300
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
  },
};

// Récupérer le thème actuel depuis localStorage ou par défaut
export function getCurrentTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  const saved = localStorage.getItem('habit-tracker-theme');
  return (saved as Theme) || 'light';
}

// Sauvegarder le thème
export function saveTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('habit-tracker-theme', theme);
}

// Vérifier si un thème est débloqué
export function isThemeUnlocked(theme: Theme, userLevel: number): boolean {
  return userLevel >= THEMES[theme].requiredLevel;
}

// Récupérer les thèmes disponibles pour un niveau
export function getAvailableThemes(userLevel: number): ThemeConfig[] {
  return Object.values(THEMES).filter(theme => theme.requiredLevel <= userLevel);
}
