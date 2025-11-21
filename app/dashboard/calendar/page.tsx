import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { fetchUserActivitiesForCalendar } from '@/app/lib/data';
import Calendar from '@/app/ui/calendar/calendar';

export default async function CalendarPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const activities = await fetchUserActivitiesForCalendar(session.user.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 pb-20">
      <div className="max-w-7xl mx-auto p-4 pt-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendrier</h1>
          <p className="text-gray-600">Visualisez toutes vos activités et leur progression</p>
        </div>

        <Calendar activities={activities} />
      </div>
    </div>
  );
}
