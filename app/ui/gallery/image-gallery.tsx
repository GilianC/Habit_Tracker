'use client';

import { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  name: string;
  imageUrl: string;
  icon: string;
  color: string;
  category: string;
  createdAt: Date;
}

interface ImageGalleryProps {
  activities: Activity[];
}

export default function ImageGallery({ activities }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<Activity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les activités selon le terme de recherche
  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une activité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
          <p className="text-sm text-gray-600 mb-1">Total Photos</p>
          <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
          <p className="text-sm text-gray-600 mb-1">Cette semaine</p>
          <p className="text-2xl font-bold text-gray-900">
            {activities.filter(a => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(a.createdAt) >= weekAgo;
            }).length}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
          <p className="text-sm text-gray-600 mb-1">Catégories</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(activities.map(a => a.category)).size}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
          <p className="text-sm text-gray-600 mb-1">Filtrées</p>
          <p className="text-2xl font-bold text-gray-900">{filteredActivities.length}</p>
        </div>
      </div>

      {/* Grille d'images */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-12 shadow-lg border border-white/20 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📷</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'Aucun résultat' : 'Aucune photo'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Essayez un autre terme de recherche'
              : 'Ajoutez des photos à vos activités pour les voir apparaître ici !'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredActivities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => setSelectedImage(activity)}
              className="group relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Image
                src={activity.imageUrl}
                alt={activity.name}
                fill
                className="object-cover"
              />
              {/* Overlay au hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{activity.icon}</span>
                    <span className="text-white font-semibold text-sm line-clamp-1">
                      {activity.name}
                    </span>
                  </div>
                  <p className="text-xs text-white/80">
                    {new Date(activity.createdAt).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal plein écran */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-10"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-5xl w-full space-y-4">
            {/* Image */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.name}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Infos */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-2">
                <span 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${selectedImage.color}40` }}
                >
                  {selectedImage.icon}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedImage.name}</h3>
                  <p className="text-sm text-white/70">
                    {new Date(selectedImage.createdAt).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
