'use client';

import { useState } from 'react';
import { THEMES, type Theme, isThemeUnlocked } from '@/app/lib/themes';
import { updateUserTheme } from '@/app/lib/actions';
import { LockClosedIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ThemeSelectorProps {
  currentTheme: Theme;
  userLevel: number;
}

export default function ThemeSelector({ currentTheme, userLevel }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleThemeChange = async (theme: Theme) => {
    if (!isThemeUnlocked(theme, userLevel)) {
      alert(`🔒 Niveau ${THEMES[theme].requiredLevel} requis pour débloquer ce thème`);
      return;
    }

    setIsUpdating(true);
    try {
      await updateUserTheme(theme);
      setSelectedTheme(theme);
      
      // Recharger la page pour appliquer le nouveau thème
      window.location.reload();
    } catch (error) {
      console.error('Erreur changement thème:', error);
      alert('Erreur lors du changement de thème');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Thème de l&apos;application</h3>
        {isUpdating && (
          <div className="flex items-center gap-2 text-pink-600">
            <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Application...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.values(THEMES).map((theme) => {
          const unlocked = isThemeUnlocked(theme.id, userLevel);
          const isSelected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              disabled={!unlocked || isUpdating}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-pink-500 bg-pink-50 shadow-lg'
                  : unlocked
                  ? 'border-gray-200 bg-white hover:border-pink-300 hover:shadow-md'
                  : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Badge sélectionné */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckIcon className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Badge verrouillé */}
              {!unlocked && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                  <LockClosedIcon className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Preview couleurs */}
                <div className="flex flex-col gap-1">
                  <div
                    className="w-12 h-12 rounded-lg shadow-sm"
                    style={{ backgroundColor: theme.colors.background }}
                  />
                  <div className="flex gap-1">
                    <div
                      className="w-5 h-5 rounded"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-5 h-5 rounded"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-left">
                  <h4 className={`font-semibold ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                    {theme.name}
                  </h4>
                  <p className={`text-xs ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {theme.description}
                  </p>
                  {!unlocked && (
                    <p className="text-xs font-medium text-amber-600 mt-1">
                      🔒 Niveau {theme.requiredLevel} requis
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
