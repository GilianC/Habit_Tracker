import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { fetchActivitiesWithImages } from '@/app/lib/data';
import ImageGallery from '@/app/ui/gallery/image-gallery';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function GalleryPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const activities = await fetchActivitiesWithImages(session.user.email);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <PhotoIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">🖼️ Galerie</h1>
                <p className="text-white/90">Toutes vos photos d'activités</p>
              </div>
            </div>
            <Link
              href="/dashboard/activities/create"
              className="hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl font-semibold transition-colors"
            >
              <PhotoIcon className="w-5 h-5" />
              Ajouter une photo
            </Link>
          </div>
        </div>

        {/* Info Card - Niveau 5 Feature */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shrink-0">
              <PhotoIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-purple-800 mb-1">🎉 Fonctionnalité Niveau 5 débloquée !</h3>
              <p className="text-sm text-purple-700">
                La galerie d'images vous permet de voir toutes vos photos d'activités en un coup d'œil. 
                Cliquez sur une image pour la voir en plein écran !
              </p>
            </div>
          </div>
        </div>

        {/* Galerie */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <ImageGallery activities={activities} />
        </div>
      </div>
    </main>
  );
}
