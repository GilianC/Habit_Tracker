'use client';

import { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { CldUploadWidget } from 'next-cloudinary';

interface PhotoUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  onRemove?: () => void;
}

// Vérifier si Cloudinary est configuré
const isCloudinaryConfigured = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export default function PhotoUpload({ onUploadSuccess, currentImageUrl, onRemove }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Si Cloudinary n'est pas configuré, afficher un message
  if (!isCloudinaryConfigured) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Photo de l&apos;activité <span className="text-gray-400 font-normal">(Fonctionnalité désactivée)</span>
        </label>
        <div className="w-full p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Upload de photos désactivé</p>
          <p className="text-xs text-gray-500">
            Configurez Cloudinary pour activer cette fonctionnalité
          </p>
        </div>
      </div>
    );
  }

  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    setIsUploading(false);
    if (typeof result.info === 'object' && result.info?.secure_url) {
      onUploadSuccess(result.info.secure_url);
      setError('');
    }
  };

  const handleError = (error: unknown) => {
    setIsUploading(false);
    setError('Erreur lors de l\'upload. Réessayez.');
    console.error('Upload error:', error);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Photo de l&apos;activité <span className="text-gray-400 font-normal">(Niveau 5 requis)</span>
      </label>

      {currentImageUrl ? (
        // Preview de l'image uploadée
        <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 group">
          <Image
            src={currentImageUrl}
            alt="Activity"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-white text-xs font-medium">Photo uploadée ✓</p>
          </div>
        </div>
      ) : (
        // Zone d'upload
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'habit_tracker_preset'}
          onSuccess={handleSuccess}
          onError={handleError}
          options={{
            maxFiles: 1,
            maxFileSize: 5000000, // 5MB
            clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
            folder: 'habit-tracker/activities',
            cropping: true,
            croppingAspectRatio: 16 / 9,
            croppingShowDimensions: true,
            sources: ['local', 'camera'],
            multiple: false,
          }}
        >
          {({ open }: { open: () => void }) => (
            <button
              type="button"
              onClick={() => {
                setIsUploading(true);
                open();
              }}
              disabled={isUploading}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 flex flex-col items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-gray-600">Upload en cours...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PhotoIcon className="w-8 h-8 text-pink-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">
                      Ajouter une photo
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WebP (max 5MB)
                    </p>
                  </div>
                </>
              )}
            </button>
          )}
        </CldUploadWidget>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-xs text-purple-700">
          💡 <span className="font-semibold">Astuce :</span> Ajoutez une photo pour rendre votre activité plus visuelle et motivante !
        </p>
      </div>
    </div>
  );
}
