'use client';

import Link from 'next/link';
import { TrophyIcon, FireIcon, StarIcon, HomeIcon, ChartBarIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function ChallengesPage() {
  const challenges = [
    {
      id: 1,
      title: '7 jours de suite',
      description: 'Complete tes activites 7 jours consecutifs',
      icon: '🔥',
      progress: 3,
      total: 7,
      points: 50,
      color: 'from-orange-400 to-red-500',
      completed: false
    },
    {
      id: 2,
      title: '30 jours de meditation',
      description: 'Medite pendant 30 jours ce mois-ci',
      icon: '🧘',
      progress: 12,
      total: 30,
      points: 100,
      color: 'from-purple-400 to-pink-500',
      completed: false
    },
    {
      id: 3,
      title: 'Premiere semaine',
      description: 'Termine ta premiere semaine complete',
      icon: '⭐',
      progress: 7,
      total: 7,
      points: 25,
      color: 'from-yellow-400 to-amber-500',
      completed: true
    }
  ];

  const totalPoints = 280;
  const completedChallenges = challenges.filter(c => c.completed).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-rose-100 to-pink-200 pb-24">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* En-tete */}
        <div className="bg-linear-to-br from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-6 shadow-2xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrophyIcon className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Defis</h1>
          </div>
          <p className="text-pink-100 text-sm mb-4">Releve des defis pour gagner des points</p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-pink-100">Points totaux</p>
              <p className="text-2xl font-bold">{totalPoints}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-pink-100">Defis reussis</p>
              <p className="text-2xl font-bold">{completedChallenges}/{challenges.length}</p>
            </div>
          </div>
        </div>

        {/* Liste des defis */}
        <div className="space-y-3">
          {challenges.map((challenge) => {
            const percentage = Math.round((challenge.progress / challenge.total) * 100);
            
            return (
              <div
                key={challenge.id}
                className={`bg-white/80 backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-white/20 transition-all duration-300 ${
                  challenge.completed ? 'border-green-300 bg-green-50/80' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icone */}
                  <div className={`w-14 h-14 bg-linear-to-br ${challenge.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg shrink-0`}>
                    {challenge.icon}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{challenge.title}</h3>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                      {challenge.completed && (
                        <div className="text-2xl">✅</div>
                      )}
                    </div>

                    {/* Barre de progression */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>{challenge.progress} / {challenge.total} jours</span>
                        <span className="font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`bg-linear-to-r ${challenge.color} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Points */}
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        +{challenge.points} points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message de motivation */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shrink-0">
              <FireIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Continue comme ca !</p>
              <p className="text-xs text-gray-600">Tu es sur la bonne voie pour atteindre tes objectifs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation mobile en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-around">
            <Link href="/dashboard/home" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600 transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors">
                <HomeIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Accueil</span>
            </Link>

            <Link href="/dashboard/activities" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600 transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors">
                <ChartBarIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Activites</span>
            </Link>

            <Link href="/dashboard/challenges" className="flex flex-col items-center gap-1 text-pink-600">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium">Defis</span>
            </Link>

            <Link href="/dashboard/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600 transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors">
                <UserCircleIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Profil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
