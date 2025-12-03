'use client';

import { useState, useEffect } from 'react';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
  addEventChallenge,
  deleteEventChallenge,
} from '@/app/lib/event-actions';

interface Event {
  id: number;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  creator: {
    name: string;
    email: string;
  } | null;
  eventChallenges: EventChallenge[];
  _count: {
    userEvents: number;
  };
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

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showChallengeForm, setShowChallengeForm] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const result = await getEvents(false);
    if (result.success && result.events) {
      setEvents(result.events as unknown as Event[]);
    }
    setLoading(false);
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createEvent(formData);
    
    if (result.success) {
      await loadEvents();
      setShowCreateForm(false);
      e.currentTarget.reset();
    } else {
      alert(result.error);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    const formData = new FormData(e.currentTarget);
    const result = await updateEvent(editingEvent.id, formData);
    
    if (result.success) {
      await loadEvents();
      setEditingEvent(null);
    } else {
      alert(result.error);
    }
  };

  const handleToggleStatus = async (eventId: number) => {
    const result = await toggleEventStatus(eventId);
    if (result.success) {
      await loadEvents();
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    
    const result = await deleteEvent(eventId);
    if (result.success) {
      await loadEvents();
      setSelectedEvent(null);
    }
  };

  const handleAddChallenge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent) return;
    
    const formData = new FormData(e.currentTarget);
    const result = await addEventChallenge(selectedEvent.id, formData);
    
    if (result.success) {
      await loadEvents();
      setShowChallengeForm(false);
      e.currentTarget.reset();
      // Mettre à jour l'événement sélectionné
      const updatedEvent = events.find(e => e.id === selectedEvent.id);
      if (updatedEvent) setSelectedEvent(updatedEvent);
    } else {
      alert(result.error);
    }
  };

  const handleDeleteChallenge = async (challengeId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce défi ?')) return;
    
    const result = await deleteEventChallenge(challengeId);
    if (result.success) {
      await loadEvents();
      const updatedEvent = events.find(e => e.id === selectedEvent?.id);
      if (updatedEvent) setSelectedEvent(updatedEvent);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bouton créer événement */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-theme-accent text-white rounded-lg hover:bg-theme-accent/90 transition-colors"
        >
          {showCreateForm ? 'Annuler' : '+ Créer un événement'}
        </button>
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="bg-theme-surface p-6 rounded-xl border border-theme-border">
          <h2 className="text-xl font-semibold text-theme-text mb-4">
            Nouvel Événement
          </h2>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Nom de l&apos;événement *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                placeholder="Ex: Défi Janvier 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                placeholder="Description de l&apos;événement..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  Date de début *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">
                  Date de fin *
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-theme-text-muted hover:text-theme-text transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-theme-accent text-white rounded-lg hover:bg-theme-accent/90 transition-colors"
              >
                Créer l&apos;événement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des événements */}
      <div className="grid gap-4">
        {events.length === 0 ? (
          <div className="bg-theme-surface p-12 rounded-xl border border-theme-border text-center">
            <p className="text-theme-text-muted">Aucun événement créé</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-theme-surface p-6 rounded-xl border border-theme-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-theme-text">
                      {event.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {event.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-theme-text-muted mb-3">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-theme-text-muted">
                    <span>📅 {formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                    <span>🎯 {event.eventChallenges.length} défi(s)</span>
                    <span>👥 {event._count.userEvents} participant(s)</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(event.id)}
                    className="p-2 text-theme-text hover:bg-theme-bg rounded-lg transition-colors"
                    title={event.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {event.isActive ? '🔴' : '🟢'}
                  </button>
                  
                  <button
                    onClick={() => setEditingEvent(event)}
                    className="p-2 text-theme-text hover:bg-theme-bg rounded-lg transition-colors"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="p-2 text-theme-text hover:bg-theme-bg rounded-lg transition-colors"
                    title="Gérer les défis"
                  >
                    🎯
                  </button>
                  
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Formulaire d'édition */}
              {editingEvent?.id === event.id && (
                <form onSubmit={handleUpdateEvent} className="mt-4 space-y-4 pt-4 border-t border-theme-border">
                  <div>
                    <label className="block text-sm font-medium text-theme-text mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={event.name}
                      required
                      className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-theme-text mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={event.description || ''}
                      rows={2}
                      className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-theme-text mb-1">
                        Date de début
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        defaultValue={new Date(event.startDate).toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-text mb-1">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        defaultValue={new Date(event.endDate).toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingEvent(null)}
                      className="px-4 py-2 text-theme-text-muted hover:text-theme-text transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-theme-accent text-white rounded-lg hover:bg-theme-accent/90 transition-colors"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {/* Gestion des défis */}
              {selectedEvent?.id === event.id && (
                <div className="mt-4 pt-4 border-t border-theme-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-theme-text">
                      Défis de l&apos;événement
                    </h4>
                    <button
                      onClick={() => setShowChallengeForm(!showChallengeForm)}
                      className="px-3 py-1 bg-theme-accent text-white text-sm rounded-lg hover:bg-theme-accent/90 transition-colors"
                    >
                      {showChallengeForm ? 'Annuler' : '+ Ajouter un défi'}
                    </button>
                  </div>

                  {/* Formulaire d'ajout de défi */}
                  {showChallengeForm && (
                    <form onSubmit={handleAddChallenge} className="bg-theme-bg p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-theme-text mb-1">
                            Titre du défi *
                          </label>
                          <input
                            type="text"
                            name="title"
                            required
                            className="w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                            placeholder="Ex: Méditation quotidienne"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-theme-text mb-1">
                            Objectif *
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              name="targetValue"
                              required
                              min="1"
                              defaultValue="7"
                              className="w-20 px-3 py-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                            />
                            <input
                              type="text"
                              name="unit"
                              defaultValue="fois"
                              className="flex-1 px-3 py-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                              placeholder="fois, jours..."
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-theme-text mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          rows={2}
                          className="w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                          placeholder="Description du défi..."
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-theme-text mb-1">
                            Icône
                          </label>
                          <input
                            type="text"
                            name="icon"
                            defaultValue="🎯"
                            className="w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent text-center text-2xl"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-theme-text mb-1">
                            Couleur
                          </label>
                          <input
                            type="color"
                            name="color"
                            defaultValue="#EC4899"
                            className="w-full h-10 bg-theme-surface border border-theme-border rounded-lg cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-theme-text mb-1">
                            Récompense (⭐)
                          </label>
                          <input
                            type="number"
                            name="starReward"
                            required
                            min="1"
                            max="100"
                            defaultValue="15"
                            className="w-full px-3 py-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-theme-accent text-white rounded-lg hover:bg-theme-accent/90 transition-colors"
                        >
                          Ajouter le défi
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Liste des défis */}
                  {event.eventChallenges.length === 0 ? (
                    <p className="text-theme-text-muted text-sm text-center py-4">
                      Aucun défi pour cet événement
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {event.eventChallenges.map((challenge) => (
                        <div
                          key={challenge.id}
                          className="flex items-center justify-between p-3 bg-theme-bg rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{challenge.icon}</span>
                            <div>
                              <h5 className="font-medium text-theme-text">
                                {challenge.title}
                              </h5>
                              <p className="text-sm text-theme-text-muted">
                                {challenge.targetValue} {challenge.unit} • {challenge.starReward}⭐
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteChallenge(challenge.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
