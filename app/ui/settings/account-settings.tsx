'use client';

import { useState } from 'react';
import { updateUserName, updateUserTimezone } from '@/app/lib/actions';

interface AccountSettingsProps {
  userName: string;
  userEmail: string;
  userTimezone: string;
}

// Liste des fuseaux horaires principaux
const TIMEZONES = [
  { value: 'Europe/Paris', label: 'Europe/Paris (UTC+1)' },
  { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
  { value: 'America/New_York', label: 'America/New York (UTC-5)' },
  { value: 'America/Los_Angeles', label: 'America/Los Angeles (UTC-8)' },
  { value: 'America/Chicago', label: 'America/Chicago (UTC-6)' },
  { value: 'America/Denver', label: 'America/Denver (UTC-7)' },
  { value: 'America/Toronto', label: 'America/Toronto (UTC-5)' },
  { value: 'America/Montreal', label: 'America/Montreal (UTC-5)' },
  { value: 'America/Vancouver', label: 'America/Vancouver (UTC-8)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (UTC+8)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (UTC+4)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (UTC+11)' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland (UTC+13)' },
];

export default function AccountSettings({ userName, userEmail, userTimezone }: AccountSettingsProps) {
  const [name, setName] = useState(userName);
  const [timezone, setTimezone] = useState(userTimezone);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      // Mettre à jour le nom si changé
      if (name !== userName) {
        await updateUserName(name);
      }

      // Mettre à jour le fuseau horaire si changé
      if (timezone !== userTimezone) {
        await updateUserTimezone(timezone);
      }

      setMessage({ type: 'success', text: '✅ Paramètres mis à jour avec succès !' });
      
      // Recharger après 1 seconde
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      setMessage({ type: 'error', text: '❌ Erreur lors de la mise à jour' });
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = name !== userName || timezone !== userTimezone;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nom d&apos;affichage
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          placeholder="Votre nom"
          required
          minLength={2}
          maxLength={50}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Adresse email
        </label>
        <input
          type="email"
          value={userEmail}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
          disabled
        />
        <p className="text-xs text-gray-500 mt-1">
          L&apos;adresse email ne peut pas être modifiée
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Fuseau horaire
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={!hasChanges || isUpdating}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
          hasChanges && !isUpdating
            ? 'bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]'
            : 'bg-linear-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
        }`}
      >
        {isUpdating ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Enregistrement...
          </span>
        ) : hasChanges ? (
          'Sauvegarder les modifications'
        ) : (
          'Aucune modification'
        )}
      </button>
    </form>
  );
}
