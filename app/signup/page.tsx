import HabitLogo from '@/app/ui/habit-logo';
import SignupForm from '@/app/ui/signup-form';
import { Suspense } from 'react';
import Link from 'next/link';
 
export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Effets de fond */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-blue-900/20"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Header avec logo moderne */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-3 rounded-xl shadow-lg">
              <HabitLogo />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">HabitFlow</h1>
              <p className="text-emerald-200 text-sm">Rejoignez-nous !</p>
            </div>
          </div>
        </div>
        
        {/* Formulaire d'inscription */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white text-center mb-2">Créer un compte</h2>
            <p className="text-gray-300 text-center">Commencez votre transformation dès aujourd'hui</p>
          </div>
          
          <Suspense>
            <SignupForm />
          </Suspense>
          
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}