'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ActivityLog {
  date: string;
  is_done: boolean;
}

interface Activity {
  id: string;
  name: string;
  color: string;
  icon: string;
  frequency: string;
  start_date: string;
  logs: ActivityLog[];
}

interface CalendarProps {
  activities: Activity[];
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function Calendar({ activities }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Premier jour du mois (0 = dimanche, 1 = lundi, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Ajuster pour que lundi soit 0 (au lieu de dimanche)
  const firstDayAdjusted = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  // Nombre de jours dans le mois
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Générer un tableau de dates pour le calendrier
  const calendarDays: (number | null)[] = [];
  
  // Ajouter des cases vides au début
  for (let i = 0; i < firstDayAdjusted; i++) {
    calendarDays.push(null);
  }
  
  // Ajouter les jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  // Fonction pour obtenir les activités d'un jour donné
  const getActivitiesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return activities
      .filter(activity => {
        // Vérifier si l'activité a commencé à cette date
        if (activity.start_date && activity.start_date > dateStr) {
          return false;
        }
        return true;
      })
      .map(activity => {
        // Vérifier si l'activité a été complétée ce jour-là
        const log = activity.logs.find(l => l.date === dateStr);
        return {
          ...activity,
          completed: log?.is_done || false,
          hasLog: !!log
        };
      });
  };
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {MONTHS[month]} {year}
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
          >
            Aujourd&apos;hui
          </button>
          
          <div className="flex gap-1">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* En-têtes des jours de la semaine */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }
          
          const dayActivities = getActivitiesForDay(day);
          const today = isToday(day);
          
          return (
            <div
              key={day}
              className={`
                aspect-square border rounded-lg p-2 overflow-hidden
                ${today ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white'}
                hover:border-pink-300 transition-colors
              `}
            >
              <div className={`text-sm font-semibold mb-1 ${today ? 'text-pink-600' : 'text-gray-700'}`}>
                {day}
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[calc(100%-1.5rem)]">
                {dayActivities.map(activity => (
                  <Link
                    key={activity.id}
                    href={`/dashboard/activities/${activity.id}`}
                    className={`
                      block text-xs px-2 py-1 rounded truncate
                      ${activity.completed 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : activity.hasLog 
                        ? 'bg-gray-100 text-gray-600 border border-gray-300'
                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                      }
                      hover:opacity-80 transition-opacity
                    `}
                    style={{ borderLeftWidth: '3px', borderLeftColor: activity.color }}
                    title={`${activity.icon} ${activity.name}${activity.completed ? ' ✓' : ''}`}
                  >
                    <span className="mr-1">{activity.icon}</span>
                    <span className="truncate">{activity.name}</span>
                    {activity.completed && <span className="ml-1">✓</span>}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Légende */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Légende</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-600">Complétée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-sm text-gray-600">Non complétée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span className="text-sm text-gray-600">Pas encore créée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-50 border-2 border-pink-500 rounded"></div>
            <span className="text-sm text-gray-600">Aujourd&apos;hui</span>
          </div>
        </div>
      </div>
    </div>
  );
}
