'use client';

import { useEffect, useState } from 'react';
import { getActiveEventsForUser } from '@/app/lib/event-actions';

interface Event {
  id: number;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  eventChallenges: EventChallenge[];
}

interface EventChallenge {
  id: number;
  title: string;
  description: string | null;
  targetValue: number;
  unit: string;
  starReward: number;
  icon: string;
  color: string;
}

export default function ActiveEventsBanner() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const result = await getActiveEventsForUser();
    if (result.success && result.events) {
      setEvents(result.events as unknown as Event[]);
    }
    setLoading(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
    });
  };

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="bg-theme-surface p-6 rounded-xl border border-theme-border animate-pulse">
        <div className="h-8 bg-theme-bg rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-theme-bg rounded w-2/3"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const daysRemaining = getDaysRemaining(event.endDate);
        
        return (
          <div
            key={event.id}
            className="bg-linear-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎉</span>
                  <h3 className="text-2xl font-bold">{event.name}</h3>
                </div>
                
                {event.description && (
                  <p className="text-white/90 mb-3">{event.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span>📅 {formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                  {daysRemaining > 0 && (
                    <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                      {daysRemaining === 1 ? 'Dernier jour !' : `${daysRemaining} jours restants`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Défis de l'événement */}
            {event.eventChallenges.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-white/90">
                  🎯 Défis disponibles ({event.eventChallenges.length})
                </h4>
                
                <div className="grid gap-3 md:grid-cols-2">
                  {event.eventChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{challenge.icon}</span>
                        <div className="flex-1">
                          <h5 className="font-semibold text-white">
                            {challenge.title}
                          </h5>
                          <p className="text-sm text-white/80">
                            {challenge.targetValue} {challenge.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-yellow-300 font-bold">
                            <span className="text-lg">{challenge.starReward}</span>
                            <span>⭐</span>
                          </div>
                        </div>
                      </div>
                      
                      {challenge.description && (
                        <p className="text-sm text-white/70 mt-2">
                          {challenge.description}
                        </p>
                      )}
                      
                      <button
                        className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Participer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
