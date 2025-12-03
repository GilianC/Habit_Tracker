import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import NotificationsList from '@/app/ui/notifications/notifications-list';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default async function NotificationsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect('/login');
  }

  // Récupérer toutes les notifications
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-rose-100 to-pink-200 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Bouton retour */}
        <Link 
          href="/dashboard/home"
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white rounded-xl shadow-md border border-pink-200 text-gray-700 hover:bg-pink-50 hover:border-pink-300 transition-all group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Retour</span>
        </Link>

        {/* En-tête */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-200 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              🔔 Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1.5 bg-linear-to-r from-pink-500 to-rose-600 text-white text-sm font-bold rounded-full shadow-md">
                {unreadCount} non {unreadCount > 1 ? 'lues' : 'lue'}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm">
            Gérez toutes vos notifications en un seul endroit
          </p>
        </div>

        {/* Liste des notifications */}
        <NotificationsList 
          initialNotifications={notifications.map(n => ({
            ...n,
            createdAt: n.createdAt.toISOString(),
          }))} 
        />
      </div>
    </div>
  );
}
