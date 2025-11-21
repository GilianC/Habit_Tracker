'use client';

import { useState } from 'react';
import { StarIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { unlockBadge } from '@/app/lib/actions';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  star_cost: number;
  rarity: string;
  category: string;
}

interface BadgesGalleryProps {
  allBadges: Badge[];
  unlockedBadgeIds: string[];
  userStars: number;
}

export default function BadgesGallery({ allBadges, unlockedBadgeIds, userStars }: BadgesGalleryProps) {
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Commun';
      case 'rare': return 'Rare';
      case 'epic': return 'Épique';
      case 'legendary': return 'Légendaire';
      default: return rarity;
    }
  };

  const handleUnlock = async (badgeId: string) => {
    setUnlockingId(badgeId);
    try {
      await unlockBadge(badgeId);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du déblocage du badge');
    } finally {
      setUnlockingId(null);
    }
  };

  const filteredBadges = selectedRarity === 'all'
    ? allBadges
    : allBadges.filter(b => b.rarity === selectedRarity);

  const rarityOptions = [
    { value: 'all', label: 'Tous', count: allBadges.length },
    { value: 'common', label: 'Communs', count: allBadges.filter(b => b.rarity === 'common').length },
    { value: 'rare', label: 'Rares', count: allBadges.filter(b => b.rarity === 'rare').length },
    { value: 'epic', label: 'Épiques', count: allBadges.filter(b => b.rarity === 'epic').length },
    { value: 'legendary', label: 'Légendaires', count: allBadges.filter(b => b.rarity === 'legendary').length },
  ];

  return (
    <div>
      {/* Filtres par rareté */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-2 flex-wrap">
          {rarityOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedRarity(option.value)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${selectedRarity === option.value
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {/* Grille de badges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map(badge => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);
          const canAfford = userStars >= badge.star_cost;

          return (
            <div
              key={badge.id}
              className={`
                relative rounded-xl p-5 border-2 shadow-sm transition-all
                ${isUnlocked
                  ? `${getRarityColor(badge.rarity)} border-2`
                  : 'bg-gray-100 border-gray-300 opacity-60'
                }
                hover:shadow-md
              `}
            >
              {/* Badge verrouillé overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                  <LockClosedIcon className="w-12 h-12 text-gray-600" />
                </div>
              )}

              {/* Contenu du badge */}
              <div className="text-center">
                <div className="text-5xl mb-3 filter" style={{ filter: isUnlocked ? 'none' : 'grayscale(100%)' }}>
                  {badge.icon}
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2">{badge.title}</h3>
                
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {badge.description}
                </p>

                <div className="flex items-center justify-center gap-1 mb-3">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-yellow-700">{badge.star_cost}</span>
                </div>

                <span className={`
                  inline-block text-xs px-3 py-1 rounded-full font-semibold
                  ${badge.rarity === 'common' ? 'bg-gray-200 text-gray-700' : ''}
                  ${badge.rarity === 'rare' ? 'bg-blue-200 text-blue-700' : ''}
                  ${badge.rarity === 'epic' ? 'bg-purple-200 text-purple-700' : ''}
                  ${badge.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-700' : ''}
                `}>
                  {getRarityLabel(badge.rarity)}
                </span>

                {/* Bouton débloquer */}
                {!isUnlocked && (
                  <button
                    onClick={() => handleUnlock(badge.id)}
                    disabled={!canAfford || unlockingId === badge.id}
                    className={`
                      w-full mt-3 px-4 py-2 rounded-lg font-semibold transition-all
                      ${canAfford
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                      disabled:opacity-50
                    `}
                  >
                    {unlockingId === badge.id ? 'Déblocage...' : canAfford ? 'Débloquer' : 'Pas assez d\'étoiles'}
                  </button>
                )}

                {isUnlocked && (
                  <div className="mt-3 text-green-600 font-semibold text-sm flex items-center justify-center gap-1">
                    ✓ Débloqué
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">Aucun badge dans cette catégorie</p>
        </div>
      )}
    </div>
  );
}
