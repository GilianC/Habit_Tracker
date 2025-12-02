'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Theme } from '@/app/lib/themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, initialTheme = 'light' }: { children: ReactNode; initialTheme?: Theme }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [isLoading, setIsLoading] = useState(false);

  // Appliquer le thème au body et html
  useEffect(() => {
    // Retirer toutes les classes de thème du body et html
    const allThemes = ['theme-light', 'theme-dark', 'theme-sunset', 'theme-ocean', 'theme-forest'];
    
    allThemes.forEach(t => {
      document.documentElement.classList.remove(t);
      document.body.classList.remove(t);
    });
    
    // Ajouter la nouvelle classe
    document.documentElement.classList.add(`theme-${theme}`);
    document.body.classList.add(`theme-${theme}`);
    
    console.log(`🎨 Thème appliqué: theme-${theme}`);
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    if (newTheme === theme) return; // Éviter les changements inutiles
    
    setIsLoading(true);
    try {
      // Appliquer le thème immédiatement côté client
      setThemeState(newTheme);
      
      // Appeler l'action serveur pour sauvegarder
      const { updateUserTheme } = await import('@/app/lib/actions');
      await updateUserTheme(newTheme);
      
      console.log(`✅ Thème "${newTheme}" sauvegardé avec succès`);
    } catch (error) {
      console.error('❌ Erreur changement thème:', error);
      // En cas d'erreur, revenir au thème précédent
      setThemeState(theme);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
