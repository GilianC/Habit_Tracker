'use client';

import { useState } from 'react';
import { searchUserByEmail, sendFriendRequest } from '@/app/lib/friend-actions';

interface AddFriendModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface SearchResult {
  id: number;
  name: string;
  email: string;
  level: number;
}

export default function AddFriendModal({ onClose, onSuccess }: AddFriendModalProps) {
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setSearchResult(null);

    const result = await searchUserByEmail(email.trim());

    if (result.success && result.user) {
      setSearchResult(result.user);
    } else {
      setError(result.error || 'Utilisateur non trouvé');
    }
    setLoading(false);
  };

  const handleSendRequest = async () => {
    if (!searchResult) return;

    setSending(true);
    setError('');

    const result = await sendFriendRequest(searchResult.id);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setError(result.error || 'Erreur lors de l&apos;envoi');
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* En-tête */}
        <div className="bg-linear-to-r from-pink-500 to-rose-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">👋 Ajouter un ami</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-pink-100 text-sm mt-2">
            Recherchez un ami par son adresse email
          </p>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Demande envoyée !</h3>
              <p className="text-gray-600">
                {searchResult?.name} recevra votre demande d&apos;ami
              </p>
            </div>
          ) : (
            <>
              {/* Formulaire de recherche */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemple.com"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="px-4 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>

              {/* Message d'erreur */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Résultat de recherche */}
              {searchResult && (
                <div className="border-2 border-pink-200 rounded-xl p-4 bg-pink-50">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-linear-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {searchResult.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-lg">{searchResult.name}</p>
                      <p className="text-gray-500 text-sm">{searchResult.email}</p>
                      <p className="text-pink-600 text-sm font-medium">Niveau {searchResult.level}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSendRequest}
                    disabled={sending}
                    className="w-full mt-4 py-3 bg-linear-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Envoi...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Envoyer une demande d&apos;ami
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Aide */}
              {!searchResult && !error && (
                <div className="text-center text-gray-500 text-sm mt-4">
                  <p>💡 Entrez l&apos;email exact de votre ami pour le trouver</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
