'use client';
import {
  HomeIcon,
  CheckCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  SparklesIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  SparklesIcon as SparklesIconSolid,
  CalendarIcon as CalendarIconSolid,
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
    color: 'pink',
    description: 'Vue d\'ensemble'
  },
  {
    name: 'Mes habitudes',
    href: '/dashboard/activities',
    icon: CheckCircleIcon,
    iconSolid: CheckCircleIconSolid,
    color: 'rose',
    description: 'Gérer mes routines'
  },
  {
    name: 'Calendrier',
    href: '/dashboard/calendar',
    icon: CalendarIcon,
    iconSolid: CalendarIconSolid,
    color: 'pink',
    description: 'Vue calendrier'
  },
  { 
    name: 'Analytics', 
    href: '/dashboard/profile', 
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid,
    color: 'fuchsia',
    description: 'Progrès et stats'
  },
  { 
    name: 'Communauté', 
    href: '/dashboard/challenges', 
    icon: UserGroupIcon,
    iconSolid: UserGroupIconSolid,
    color: 'pink',
    description: 'Défis et amis'
  },
  { 
    name: 'Badges', 
    href: '/dashboard/badges', 
    icon: SparklesIcon,
    iconSolid: SparklesIconSolid,
    color: 'rose',
    description: 'Mes achievements'
  },
  { 
    name: 'Paramètres', 
    href: '/dashboard/settings', 
    icon: Cog6ToothIcon,
    iconSolid: Cog6ToothIconSolid,
    color: 'gray',
    description: 'Configuration'
  },
];

const colorClasses = {
  pink: 'from-pink-500 to-rose-500',
  rose: 'from-rose-500 to-pink-600', 
  fuchsia: 'from-fuchsia-500 to-pink-500',
  gray: 'from-gray-400 to-gray-500'
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
                'bg-pink-100 text-gray-800 shadow-md': isActive,
                'text-gray-600 hover:text-gray-800 hover:bg-pink-50': !isActive,
              }
            )}
          >
            <div className={clsx(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
              {
                [`bg-linear-to-br ${colorClasses[link.color as keyof typeof colorClasses]} shadow-md`]: isActive,
                'bg-gray-200 group-hover:bg-gray-300': !isActive,
              }
            )}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            
            <div className="hidden md:block flex-1">
              <p className={clsx(
                'transition-colors',
                {
                  'text-gray-800 font-semibold': isActive,
                  'text-gray-600 group-hover:text-gray-800': !isActive,
                }
              )}>
                {link.name}
              </p>
              <p className="text-xs text-gray-500 group-hover:text-gray-600">
                {link.description}
              </p>
            </div>
            
            {isActive && (
              <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
