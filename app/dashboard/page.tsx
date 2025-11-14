import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import ModernDailyHabits from '@/app/ui/dashboard/modern-daily-habits';
import ModernStatsOverview from '@/app/ui/dashboard/modern-stats-overview';
import ModernQuickActions from '@/app/ui/dashboard/modern-quick-actions';
import WelcomeHeader from '@/app/ui/dashboard/welcome-header';

export default async function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-6 md:p-8">
        {/* Header de bienvenue moderne */}
        <WelcomeHeader />

        {/* Grille principale */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Colonne principale - Habitudes */}
          <div className="lg:col-span-8 space-y-6">
            <Suspense fallback={<div className="animate-pulse bg-white/50 backdrop-blur rounded-2xl h-96"></div>}>
              <ModernDailyHabits />
            </Suspense>
          </div>

          {/* Sidebar droite - Stats et actions */}
          <div className="lg:col-span-4 space-y-6">
            <Suspense fallback={<div className="animate-pulse bg-white/50 backdrop-blur rounded-2xl h-48"></div>}>
              <ModernQuickActions />
            </Suspense>
            
            <Suspense fallback={<div className="animate-pulse bg-white/50 backdrop-blur rounded-2xl h-96"></div>}>
              <ModernStatsOverview />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}