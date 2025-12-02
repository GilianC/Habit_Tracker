import HabitLogo from '@/app/ui/icons/habit-logo';
import SignupForm from '@/app/ui/forms/signup-form';
import { Suspense } from 'react';
import Link from 'next/link';
 
export default function SignupPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
      {/* Effets de fond */}
      <div className="absolute inset-0 bg-linear-to-br from-pink-200/30 to-rose-200/30"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(233,30,99,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Header avec logo moderne */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/90 backdrop-blur-lg border border-pink-200/50 shadow-xl">
            <div className="bg-linear-to-br from-pink-500 to-rose-600 p-3 rounded-xl shadow-lg">
              <HabitLogo />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">HabitFlow</h1>
              <p className="text-pink-600 text-sm">Rejoignez-nous !</p>
            </div>
          </div>
        </div>
        
        {/* Formulaire d'inscription */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-pink-200/50 p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Créer un compte</h2>
            <p className="text-gray-600 text-center">Commencez votre transformation dès aujourd&apos;hui</p>
          </div>
          
          <Suspense>
            <SignupForm />
          </Suspense>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-pink-600 hover:text-pink-700 font-semibold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}