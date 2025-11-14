import HabitLogo from '@/app/ui/habit-logo';
import { ArrowRightIcon, CheckCircleIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        {/* Effets de fond */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 to-rose-200/30"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(233,30,99,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="relative flex min-h-screen flex-col p-6">
          {/* Header avec logo moderne */}
          <div className="flex h-20 shrink-0 items-center rounded-2xl bg-white/90 backdrop-blur-lg border border-pink-200/50 p-4 md:h-52 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-xl shadow-lg">
                <HabitLogo />
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-bold text-gray-800">HabitFlow</h1>
                <p className="text-pink-600">Transformez votre vie, une habitude à la fois</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex grow flex-col gap-6 lg:flex-row">
            {/* Section principale */}
            <div className="flex flex-col justify-center gap-8 rounded-2xl bg-white/90 backdrop-blur-lg border border-pink-200/50 px-8 py-12 lg:w-2/5 lg:px-12 shadow-xl">
              <div className="space-y-6">
                <h1 className={`text-4xl font-bold text-gray-800 lg:text-5xl lg:leading-tight ${lusitana.className} antialiased`}>
                  <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                    HabitFlow
                  </span>
                </h1>
                <p className="text-xl text-gray-700 lg:text-2xl leading-relaxed">
                  Transformez votre quotidien avec des habitudes positives. 
                  Suivez vos progrès, restez motivé et atteignez vos objectifs.
                </p>
              </div>
              
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <span>Se connecter</span> 
                  <ArrowRightIcon className="w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/signup"
                  className="group flex items-center justify-center gap-3 rounded-xl border-2 border-pink-300 bg-white/80 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-pink-700 transition-all duration-300 hover:bg-white hover:scale-105"
                >
                  <span>S&apos;inscrire</span>
                </Link>
              </div>
            </div>
            
            {/* Section fonctionnalités */}
            <div className="flex flex-col justify-center gap-8 p-8 lg:w-3/5 lg:px-12">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Fonctionnalités principales</h2>
                <p className="text-gray-600 text-lg">Découvrez tous les outils pour réussir vos habitudes</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="group p-6 rounded-2xl bg-white/90 backdrop-blur-lg border border-pink-200/50 hover:bg-white transition-all duration-300 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
                      <CheckCircleIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-2">Suivi quotidien</h3>
                      <p className="text-gray-600">Validez vos habitudes chaque jour et suivez votre progression en temps réel.</p>
                    </div>
                  </div>
                </div>
                
                <div className="group p-6 rounded-2xl bg-white/90 backdrop-blur-lg border border-pink-200/50 hover:bg-white transition-all duration-300 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                      <ChartBarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-2">Statistiques détaillées</h3>
                      <p className="text-gray-600">Visualisez vos progrès avec des graphiques interactifs et des métriques avancées.</p>
                    </div>
                  </div>
                </div>
                
                <div className="group p-6 rounded-2xl bg-white/90 backdrop-blur-lg border border-pink-200/50 hover:bg-white transition-all duration-300 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                      <UserGroupIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-2">Défis entre amis</h3>
                      <p className="text-gray-600">Motivez-vous mutuellement avec des défis personnalisés et des classements.</p>
                    </div>
                  </div>
                </div>
                
                <div className="group p-6 rounded-2xl bg-white/90 backdrop-blur-lg border border-pink-200/50 hover:bg-white transition-all duration-300 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xl">🏆</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-2">Badges et récompenses</h3>
                      <p className="text-gray-600">Débloquez des achievements et célébrez vos victoires quotidiennes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
