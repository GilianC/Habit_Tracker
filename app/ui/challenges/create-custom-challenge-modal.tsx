'use client';

import { useState } from 'react';
import { createCustomChallenge } from '@/app/lib/actions';
import { useActionState } from 'react';
import { Button } from '@/app/ui/common/button';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CreateCustomChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCustomChallengeModal({ isOpen, onClose }: CreateCustomChallengeModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: 10,
    unit: 'fois',
    starReward: 10,
    icon: '🎯',
    color: '#EC4899',
    difficulty: 'medium',
    durationDays: 7,
  });

  const [errorMessage, formAction, isPending] = useActionState(
    createCustomChallenge,
    undefined,
  );

  const icons = ['🎯', '🏆', '⭐', '🔥', '💪', '🚀', '💎', '👑', '⚡', '🌟', '🎪', '🎨'];
  const colors = [
    '#EC4899', // Pink
    '#F472B6', // Pink 400
    '#8B5CF6', // Violet
    '#6366F1', // Indigo
    '#3B82F6', // Blue
    '#14B8A6', // Teal
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#F97316', // Orange
    '#EF4444', // Red
  ];

  const units = ['fois', 'heures', 'minutes', 'km', 'pages', 'jours'];
  const difficulties = [
    { value: 'easy', label: 'Facile', color: 'green', stars: 5 },
    { value: 'medium', label: 'Moyen', color: 'yellow', stars: 10 },
    { value: 'hard', label: 'Difficile', color: 'orange', stars: 15 },
    { value: 'expert', label: 'Expert', color: 'red', stars: 25 },
  ];

  const handleDifficultyChange = (difficulty: string) => {
    const diff = difficulties.find(d => d.value === difficulty);
    setFormData({
      ...formData,
      difficulty,
      starReward: diff?.stars || 10,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold">🎯 Créer un Défi Personnalisé</h2>
              <p className="text-white/90 text-sm">Fonctionnalité Niveau 5+ débloquée !</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form action={formAction} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Titre du défi *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Ex: Lire 10 livres"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Décrivez votre défi..."
            />
          </div>

          {/* Objectif */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetValue" className="block text-sm font-semibold text-gray-700 mb-2">
                Objectif *
              </label>
              <input
                type="number"
                id="targetValue"
                name="targetValue"
                value={formData.targetValue}
                onChange={(e) => setFormData({...formData, targetValue: parseInt(e.target.value) || 1})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="1"
                required
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-semibold text-gray-700 mb-2">
                Unité
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulté */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Difficulté
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {difficulties.map(diff => (
                <button
                  key={diff.value}
                  type="button"
                  onClick={() => handleDifficultyChange(diff.value)}
                  className={`p-3 border-2 rounded-xl transition-all ${
                    formData.difficulty === diff.value
                      ? `border-${diff.color}-500 bg-${diff.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-sm">{diff.label}</p>
                  <p className="text-xs text-gray-600">{diff.stars} ⭐</p>
                </button>
              ))}
            </div>
            <input type="hidden" name="difficulty" value={formData.difficulty} />
            <input type="hidden" name="starReward" value={formData.starReward} />
          </div>

          {/* Durée */}
          <div>
            <label htmlFor="durationDays" className="block text-sm font-semibold text-gray-700 mb-2">
              Durée (jours)
            </label>
            <input
              type="number"
              id="durationDays"
              name="durationDays"
              value={formData.durationDays}
              onChange={(e) => setFormData({...formData, durationDays: parseInt(e.target.value) || 7})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              min="1"
              max="365"
            />
            <p className="text-xs text-gray-500 mt-1">
              Expire le {new Date(Date.now() + formData.durationDays * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Icône */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Icône
            </label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({...formData, icon})}
                  className={`p-3 text-2xl border-2 rounded-xl transition-all ${
                    formData.icon === icon
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input type="hidden" name="icon" value={formData.icon} />
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Couleur
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`h-12 rounded-xl border-2 transition-all ${
                    formData.color === color
                      ? 'border-gray-900 scale-110'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input type="hidden" name="color" value={formData.color} />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Aperçu</p>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200">
              <span 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                {formData.icon}
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{formData.title || 'Titre du défi'}</h3>
                <p className="text-sm text-gray-600">
                  Objectif: {formData.targetValue} {formData.unit} • {formData.starReward} ⭐
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2"
              aria-disabled={isPending}
            >
              <PlusIcon className="w-5 h-5" />
              <span>{isPending ? 'Création...' : 'Créer le défi'}</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
