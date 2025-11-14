'use client';
import {
  HomeIcon,
  CheckCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  SparklesIcon as SparklesIconSolid,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Navigation moderne pour HabitFlow
const links = [
  { 
    name: 'Tableau de bord', 
    href: '/dashboard', 
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
    color: 'blue',
    description: 'Vue d\'ensemble'
  },
  {
    name: 'Mes habitudes',
    href: '/dashboard/activities',
    icon: CheckCircleIcon,
    iconSolid: CheckCircleIconSolid,
    color: 'emerald',
    description: 'Gérer mes routines'
  },
  { 
    name: 'Analytics', 
    href: '/dashboard/profile', 
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid,
    color: 'violet',
    description: 'Progrès et stats'
  },
  { 
    name: 'Communauté', 
    href: '/dashboard/challenges', 
    icon: UserGroupIcon,
    iconSolid: UserGroupIconSolid,
    color: 'orange',
    description: 'Défis et amis'
  },
  { 
    name: 'Badges', 
    href: '/dashboard/badges', 
    icon: SparklesIcon,
    iconSolid: SparklesIconSolid,
    color: 'yellow',
    description: 'Mes achievements'
  },
  { 
    name: 'Paramètres', 
    href: '/dashboard/settings', 
    icon: Cog6ToothIcon,
    iconSolid: Cog6ToothIconSolid,
    color: 'slate',
    description: 'Configuration'
  },
];

const colorClasses = {
  blue: 'from-blue-500 to-cyan-500',
  emerald: 'from-emerald-500 to-teal-500', 
  violet: 'from-violet-500 to-purple-500',
  orange: 'from-orange-500 to-pink-500',
  yellow: 'from-yellow-500 to-orange-500',
  slate: 'from-slate-500 to-gray-500'
};

export default function NavLinks() {
  const pathname = usePathname();
  
  return (
    <nav className="space-y-2">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = isActive ? link.iconSolid : link.icon;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
              {
                'bg-white/10 text-white shadow-lg': isActive,
                'text-slate-300 hover:text-white hover:bg-white/5': !isActive,
              }
            )}
          >
            <div className={clsx(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
              {
                [`bg-gradient-to-br ${colorClasses[link.color as keyof typeof colorClasses]} shadow-lg`]: isActive,
                'bg-slate-700 group-hover:bg-slate-600': !isActive,
              }
            )}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            
            <div className="hidden md:block flex-1">
              <p className={clsx(
                'transition-colors',
                {
                  'text-white font-semibold': isActive,
                  'text-slate-300 group-hover:text-white': !isActive,
                }
              )}>
                {link.name}
              </p>
              <p className="text-xs text-slate-400 group-hover:text-slate-300">
                {link.description}
              </p>
            </div>
            
            {isActive && (
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
