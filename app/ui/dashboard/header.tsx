'use client';

import NotificationBell from '@/app/ui/common/notification-bell';
import Link from 'next/link';

interface DashboardHeaderProps {
  userName?: string;
  isAdmin?: boolean;
}

export default function DashboardHeader({ userName, isAdmin }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-theme-surface border-b border-theme-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Titre/Salutation */}
        <div>
          <h1 className="text-xl font-semibold text-theme-text">
            {userName ? `Bonjour, ${userName} !` : 'Tableau de bord'}
          </h1>
          <p className="text-sm text-theme-text-muted">
            Continuez vos progrès aujourd&apos;hui
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Lien admin si nécessaire */}
          {isAdmin && (
            <Link
              href="/dashboard/admin/events"
              className="flex items-center gap-2 px-3 py-2 text-sm text-theme-text hover:bg-theme-bg rounded-lg transition-colors"
              title="Administration"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden md:inline">Admin</span>
            </Link>
          )}

          {/* Notifications */}
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
