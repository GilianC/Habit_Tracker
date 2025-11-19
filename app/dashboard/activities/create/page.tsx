import { lusitana } from '@/app/ui/fonts';
import CreateActivityForm from '@/app/ui/activities/create-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CreateActivityPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-pink-50 to-rose-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Navigation de retour */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur-lg rounded-xl border border-pink-200/50 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:shadow-lg"
          >
            <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Retour au tableau de bord</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-linear-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">✨</span>
            </div>
          </div>
          <h1 className={`${lusitana.className} text-3xl font-bold text-gray-900 mb-2`}>
            Créer une nouvelle habitude
          </h1>
          <p className="text-gray-600 text-lg">
            Définissez une nouvelle habitude positive pour votre routine quotidienne
          </p>
        </div>

        {/* Formulaire dans un conteneur moderne */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-pink-200/50">
          <CreateActivityForm />
        </div>

        {/* Conseils */}
        <div className="mt-8 bg-linear-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <span className="text-white text-lg">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-pink-800 mb-2">Conseils pour créer une habitude durable</h3>
              <ul className="text-pink-700 space-y-1 text-sm">
                <li>• Commencez petit : 5-10 minutes par jour suffisent</li>
                <li>• Choisissez un moment fixe dans votre journée</li>
                <li>• Liez votre nouvelle habitude à une habitude existante</li>
                <li>• Célébrez chaque petite victoire</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}