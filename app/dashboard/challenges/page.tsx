import { lusitana } from '@/app/ui/fonts';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export default function ChallengesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className={`${lusitana.className} text-3xl font-bold text-gray-900 mb-2`}>
            Défis entre amis
          </h1>
          <p className="text-gray-600 text-lg">Motivez-vous mutuellement et atteignez vos objectifs ensemble</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-white/20 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <UserGroupIcon className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Fonctionnalité bientôt disponible
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Les défis entre amis seront disponibles dans la prochaine version de HabitFlow. 
            Préparez-vous à une expérience collaborative révolutionnaire !
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-6 rounded-xl max-w-2xl mx-auto">
            <h3 className="font-bold text-purple-800 mb-3 text-lg">🚀 Aperçu des fonctionnalités à venir :</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-purple-700">Créez des défis personnalisés avec vos amis</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-purple-700">Classements en temps réel</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-purple-700">Notifications de motivation</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-purple-700">Récompenses collaboratives</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Être notifié du lancement
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}