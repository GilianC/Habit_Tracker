'use client';

import { lusitana } from '@/app/ui/fonts';
import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { createActivity } from '@/app/lib/actions';
import { useActionState } from 'react';
import { Button } from '@/app/ui/common/button';
import PhotoUpload from '@/app/ui/activities/photo-upload';

export default function CreateActivityForm() {
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily',
    weeklyDay: '1', // Lundi par défaut
    color: '#10B981',
    icon: '✅',
    startDate: new Date().toISOString().split('T')[0],
    category: 'other',
    imageUrl: ''
  });

  const [errorMessage, formAction, isPending] = useActionState(
    createActivity,
    undefined,
  );

  const frequencyOptions = [
    { value: 'daily', label: 'Quotidien' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuel' }
  ];

  const categoryOptions = [
    { value: 'sport', label: '🏃‍♂️ Sport', defaultIcon: '🏃‍♂️' },
    { value: 'health', label: '💊 Santé', defaultIcon: '💊' },
    { value: 'nutrition', label: '🥗 Nutrition', defaultIcon: '🥗' },
    { value: 'learning', label: '📚 Apprentissage', defaultIcon: '📚' },
    { value: 'mindfulness', label: '🧘‍♀️ Bien-être', defaultIcon: '🧘‍♀️' },
    { value: 'productivity', label: '🎯 Productivité', defaultIcon: '🎯' },
    { value: 'social', label: '👥 Social', defaultIcon: '👥' },
    { value: 'other', label: '✨ Autre', defaultIcon: '✨' }
  ];

  const colorOptions = [
    '#EC4899', // Pink 500
    '#F472B6', // Pink 400
    '#E91E63', // Pink 600
    '#DB2777', // Pink 700
    '#D946EF', // Fuchsia 500
    '#F0ABFC', // Fuchsia 300
    '#8B5CF6', // Violet 500
    '#6366F1'  // Indigo 500
  ];

  // Émojis par catégorie
  const iconsByCategory: Record<string, string[]> = {
    sport: ['🏃‍♂️', '⚽', '�️‍♂️', '🏊‍♂️', '🚴‍♂️', '🤸‍♀️', '⛹️‍♂️', '🧗‍♀️', '�🏃‍♀️', '🥊'],
    health: ['💊', '❤️', '🩺', '💉', '🧬', '🦷', '👁️', '🧪', '⚕️', '🏥'],
    nutrition: ['🥗', '🍎', '🥑', '🥦', '🍊', '🥕', '🍇', '🥤', '💧', '🍽️'],
    learning: ['📚', '�', '✍️', '🎓', '�', '📝', '💡', '🔬', '🎯', '📊'],
    mindfulness: ['🧘‍♀️', '🕉️', '☮️', '🌸', '🌺', '🍃', '🌿', '✨', '🙏', '�‍♀️'],
    productivity: ['🎯', '✅', '📋', '💼', '⏰', '📅', '🔔', '💪', '🚀', '⭐'],
    social: ['👥', '💬', '👫', '🤝', '👪', '💕', '🎉', '📱', '☕', '🎊'],
    other: ['✨', '⭐', '🌟', '💫', '🔥', '💎', '🎨', '🎵', '🌈', '�']
  };

  // Émojis disponibles selon la catégorie sélectionnée
  const iconOptions = iconsByCategory[formData.category] || iconsByCategory.other;

  // Fonction pour gérer le changement de catégorie
  const handleCategoryChange = (newCategory: string) => {
    const selectedCategory = categoryOptions.find(cat => cat.value === newCategory);
    const newIcon = selectedCategory?.defaultIcon || '✨';
    
    setFormData({
      ...formData,
      category: newCategory,
      icon: newIcon
    });
  };

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm border">
        <h2 className={`${lusitana.className} mb-4 text-lg font-semibold`}>
          Détails de l&apos;activité
        </h2>

        {/* Nom de l'activité */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom de l&apos;activité
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            placeholder="Ex: Boire 2L d'eau"
            required
          />
        </div>

        {/* Fréquence */}
        <div className="mb-4">
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
            Fréquence
          </label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            {frequencyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Jour de la semaine (seulement si hebdomadaire) */}
        {formData.frequency === 'weekly' && (
          <div className="mb-4">
            <label htmlFor="weeklyDay" className="block text-sm font-medium text-gray-700 mb-2">
              Jour de la semaine
            </label>
            <select
              id="weeklyDay"
              name="weeklyDay"
              value={formData.weeklyDay}
              onChange={(e) => setFormData({...formData, weeklyDay: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="1">Lundi</option>
              <option value="2">Mardi</option>
              <option value="3">Mercredi</option>
              <option value="4">Jeudi</option>
              <option value="5">Vendredi</option>
              <option value="6">Samedi</option>
              <option value="0">Dimanche</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Cette activité sera à faire chaque {
                ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][parseInt(formData.weeklyDay)]
              }
            </p>
          </div>
        )}

        {/* Catégorie */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Les émojis disponibles changent selon la catégorie choisie
          </p>
        </div>

        {/* Date de début (seulement si quotidien) */}
        {formData.frequency === 'daily' && (
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Date de début
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
        )}

        {/* Couleur */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Couleur
          </label>
          <div className="flex gap-2 flex-wrap">
            {colorOptions.map((color, index) => (
              <button
                key={`${color}-${index}`}
                type="button"
                onClick={() => setFormData({...formData, color})}
                className={`w-8 h-8 rounded-full border-2 ${
                  formData.color === color ? 'border-gray-900' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Sélectionner la couleur ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Icône */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icône ({categoryOptions.find(c => c.value === formData.category)?.label.split(' ')[1]})
          </label>
          <div className="grid grid-cols-5 gap-2">
            {iconOptions.map((icon, index) => (
              <button
                key={`${icon}-${index}`}
                type="button"
                onClick={() => setFormData({...formData, icon})}
                className={`p-3 text-2xl border rounded-md transition-colors flex items-center justify-center aspect-square ${
                  formData.icon === icon 
                    ? 'border-pink-500 bg-pink-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-label={`Sélectionner l'icône ${icon}`}
              >
                <span className="leading-none">{icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Photo de l'activité (Niveau 5) */}
        <div className="mb-4">
          <PhotoUpload
            onUploadSuccess={(url) => setFormData({...formData, imageUrl: url})}
            currentImageUrl={formData.imageUrl}
            onRemove={() => setFormData({...formData, imageUrl: ''})}
          />
        </div>

        {/* Aperçu */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
          <div className="flex items-center gap-3">
            <span 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: `${formData.color}20` }}
            >
              {formData.icon}
            </span>
            <div>
              <p className="font-medium text-gray-900">
                {formData.name || 'Nom de l\'activité'}
              </p>
              <p className="text-sm text-gray-600">
                {frequencyOptions.find(opt => opt.value === formData.frequency)?.label} • {categoryOptions.find(c => c.value === formData.category)?.label.split(' ')[1]}
              </p>
            </div>
          </div>
        </div>

        {/* Champs cachés pour envoyer les valeurs */}
        <input type="hidden" name="color" value={formData.color} />
        <input type="hidden" name="icon" value={formData.icon} />
        <input type="hidden" name="imageUrl" value={formData.imageUrl} />

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">
              <strong>Erreur :</strong> {errorMessage}
            </p>
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex items-center gap-2"
            aria-disabled={isPending}
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>{isPending ? 'Création...' : 'Créer l\'activité'}</span>
          </Button>
          
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isPending}
          >
            Annuler
          </button>
        </div>
      </div>
    </form>
  );
}