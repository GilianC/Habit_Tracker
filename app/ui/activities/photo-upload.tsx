'use client';

import { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface PhotoUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  onRemove?: () => void;
}

export default function PhotoUpload({ onUploadSuccess, currentImageUrl, onRemove }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifications côté client - Limite raisonnable pour éviter dépassement 1MB en base64
    if (file.size > 2 * 1024 * 1024) {
      setError('Fichier trop volumineux (max 2MB). Utilisez un outil de compression d\'image.');
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Utilisez PNG, JPG ou WebP');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Créer une image compressée
      const compressedDataUrl = await compressImage(file);
      
      // Vérifier la taille finale (700KB max pour être sous la limite de 1MB des Server Actions)
      const base64Size = compressedDataUrl.length;
      if (base64Size > 700 * 1024) {
        setError('Image trop volumineuse même après compression. Utilisez une image plus petite ou de meilleure qualité.');
        setIsUploading(false);
        return;
      }

      setPreview(compressedDataUrl);
      onUploadSuccess(compressedDataUrl);
      setError('');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du traitement de l\'image.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Fonction de compression d'image
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas non supporté'));
            return;
          }

          // Limiter la taille à 1200x900 pour plus de qualité
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;
          const maxHeight = 900;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;

          // Dessiner l'image redimensionnée
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir en JPEG avec bonne qualité (0.8 au lieu de 0.7)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = currentImageUrl || preview;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Photo de l&apos;activité <span className="text-gray-400 font-normal">(Niveau 5 requis)</span>
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {displayImage ? (
        // Preview de l'image uploadée
        <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 group">
          {displayImage.startsWith('data:') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayImage}
              alt="Activity"
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={displayImage}
              alt="Activity"
              fill
              className="object-cover"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3">
            <p className="text-white text-xs font-medium">Photo uploadée ✓</p>
          </div>
        </div>
      ) : (
        // Zone d'upload
        <button
          type="button"
          onClick={handleClick}
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
              <div className="w-16 h-16 bg-linear-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhotoIcon className="w-8 h-8 text-pink-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">
                  Ajouter une photo
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WebP (max 2MB)
                </p>
              </div>
            </>
          )}
        </button>
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
