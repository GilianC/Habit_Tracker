import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import EventsManagement from '@/app/ui/admin/events-management';

export default async function AdminEventsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-theme-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-theme-text mb-2">
            🎉 Gestion des Événements
          </h1>
          <p className="text-theme-text-muted">
            Créez et gérez des événements spéciaux avec des défis pour tous les utilisateurs
          </p>
        </div>

        <EventsManagement />
      </div>
    </div>
  );
}
