import { PlusIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Link
        href="/dashboard/activities/create"
        className="flex items-center gap-3 rounded-lg bg-green-500 px-4 py-3 text-white transition-colors hover:bg-green-400"
      >
        <PlusIcon className="h-5 w-5" />
        <span className="font-medium">Nouvelle habitude</span>
      </Link>
      
      <Link
        href="/dashboard/profile"
        className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
      >
        <ChartBarIcon className="h-5 w-5" />
        <span className="font-medium">Voir mes stats</span>
      </Link>
      
      <Link
        href="/dashboard/challenges"
        className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
      >
        <UserGroupIcon className="h-5 w-5" />
        <span className="font-medium">Défis</span>
      </Link>
    </div>
  );
}