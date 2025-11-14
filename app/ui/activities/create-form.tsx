'use client';

import { lusitana } from '@/app/ui/fonts';
import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CreateActivityForm() {
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily',
    color: '#10B981',
    icon: '✅'
  });

  const frequencyOptions = [
    { value: 'daily', label: 'Quotidien' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuel' }
  ];

  const colorOptions = [
    '#EC4899', '#F472B6', '#E91E63', '#DB2777', 
    '#EC4899', '#F472B6', '#D946EF', '#F0ABFC'
  ];

  const iconOptions = ['✅', '🏃‍♂️', '📚', '💧', '🥗', '🧘‍♀️', '💊', '🎯', '🎵', '🏠'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pour l'instant, juste un message
    alert('Fonctionnalité bientôt disponible ! L\'activité sera créée une fois la base de données connectée.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Couleur */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Couleur
          </label>
          <div className="flex gap-2 flex-wrap">
            {colorOptions.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({...formData, color})}
                className={`w-8 h-8 rounded-full border-2 ${
                  formData.color === color ? 'border-gray-900' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Icône */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icône
          </label>
          <div className="grid grid-cols-5 gap-2">
            {iconOptions.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({...formData, icon})}
                className={`p-2 text-2xl border rounded-md ${
                  formData.icon === icon 
                    ? 'border-pink-500 bg-pink-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
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
                {frequencyOptions.find(opt => opt.value === formData.frequency)?.label}
              </p>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-md hover:shadow-lg hover:scale-105 transition-all"
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>Créer l&apos;activité</span>
          </button>
          
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>

      {/* Message informatif */}
      <div className="rounded-lg bg-pink-50 p-4 border border-pink-200">
        <p className="text-sm text-pink-800">
          <strong>Information :</strong> Cette fonctionnalité sera pleinement opérationnelle une fois la base de données configurée.
        </p>
      </div>
    </form>
  );
}