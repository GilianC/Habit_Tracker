import { lusitana } from '@/app/ui/fonts';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AccountSettings from '@/app/ui/settings/account-settings';
import postgres from 'postgres';
import Link from 'next/link';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Récupérer les infos utilisateur
  const userResult = await sql`
    SELECT theme, name, timezone 
    FROM users 
    WHERE email = ${session.user.email}
  `;
  const userData = userResult[0];
  const userName = (userData?.name as string) || session.user.name || '';
  const userTimezone = (userData?.timezone as string) || 'Europe/Paris';

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Bouton retour */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium transition-colors shadow-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Retour au tableau de bord
        </Link>

        <div className="mb-8">
          <h1 className={`${lusitana.className} text-3xl font-bold text-gray-900 mb-2`}>
            Paramètres
          </h1>
          <p className="text-gray-600 text-lg">Personnalisez votre expérience HabitFlow</p>
        </div>

        <div className="max-w-2xl">
          {/* Paramètres du compte */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Paramètres du compte
              </h2>
            </div>
            
            <AccountSettings 
              userName={userName}
              userEmail={session.user.email}
              userTimezone={userTimezone}
            />
          </div>
        </div>
      </div>
    </main>
  );
}