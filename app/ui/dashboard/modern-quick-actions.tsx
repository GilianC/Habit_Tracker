import { PlusIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ModernQuickActions() {
  const actions = [
    {
      title: 'Nouvelle habitude',
      description: 'Créer une routine',
      href: '/dashboard/activities/create',
      icon: PlusIcon,
      gradient: 'from-pink-500 to-rose-600',
      hoverGradient: 'hover:from-pink-600 hover:to-rose-700',
    },
    {
      title: 'Mes analytics',
      description: 'Voir mes progrès',
      href: '/dashboard/profile',
      icon: ChartBarIcon,
      gradient: 'from-fuchsia-500 to-pink-600',
      hoverGradient: 'hover:from-fuchsia-600 hover:to-pink-700',
    },
    {
      title: 'Badges',
      description: 'Mes achievements',
      href: '/dashboard/badges',
      icon: SparklesIcon,
      gradient: 'from-rose-500 to-pink-600',
      hoverGradient: 'hover:from-rose-600 hover:to-pink-700',
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`group flex items-center gap-4 p-4 bg-gradient-to-r ${action.gradient} ${action.hoverGradient} rounded-xl text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
          >
            <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
              <action.icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{action.title}</h3>
              <p className="text-white/80 text-xs">{action.description}</p>
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}