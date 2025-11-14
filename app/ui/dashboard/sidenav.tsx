import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import HabitLogo from '@/app/ui/habit-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-slate-900 text-white shadow-2xl">
      {/* Header avec logo */}
      <div className="px-6 py-8">
        <Link
          className="flex items-center gap-3 group"
          href="/"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-white">HabitFlow</h1>
            <p className="text-slate-400 text-sm">Suivi d'habitudes</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4">
        <NavLinks />
      </div>

      {/* User section et logout */}
      <div className="px-4 py-6 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">U</span>
          </div>
          <div className="hidden md:block">
            <p className="text-white font-medium text-sm">Utilisateur</p>
            <p className="text-slate-400 text-xs">Mode démo</p>
          </div>
        </div>
        
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 group">
            <PowerIcon className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            <span className="hidden md:block text-sm">Se déconnecter</span>
          </button>
        </form>
      </div>
    </div>
  );
}
