'use client';

import { useState } from 'react';
import { AnimatedXpBar, XpDisplay } from '@/app/ui/common/xp-bar';
import { LevelUpModal, useLevelUp } from '@/app/ui/modals/level-up-modal';
import { ChallengeValidation } from '@/app/ui/animations/challenge-animations';
import { StarCounter, StarCollection } from '@/app/ui/animations/star-animations';
import { AnimatedNotification } from '@/app/ui/animations/animated-notification';

export default function AnimationDemo() {
  const [xp, setXp] = useState(750);
  const [level, setLevel] = useState(5);
  const [stars, setStars] = useState(100);
  const { levelUpData, triggerLevelUp, closeLevelUp } = useLevelUp();
  const [showValidation, setShowValidation] = useState(false);
  const [showStarAnimation, setShowStarAnimation] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'levelup' | 'star' | 'challenge'>('success');

  const handleAddXp = () => {
    const newXp = xp + 100;
    setXp(newXp);
    
    if (newXp >= 1000) {
      triggerLevelUp(level, level + 1);
      setLevel(level + 1);
      setXp(newXp - 1000);
    }
  };

  const handleCompleteChallenge = () => {
    setShowValidation(true);
    setStars(stars + 5);
  };

  const handleShowNotification = (type: typeof notificationType) => {
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎬 Démo des Animations
          </h1>
          <p className="text-xl text-gray-600">
            Testez toutes les animations de l&apos;application
          </p>
        </div>

        {/* Section XP et Niveau */}
        <section className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📊 Système d&apos;XP et de Niveau
          </h2>
          
          <div className="space-y-6">
            {/* Stats XP */}
            <XpDisplay currentXp={xp} totalXp={5230} level={level} />

            {/* Barre d'XP */}
            <AnimatedXpBar
              currentXp={xp}
              xpForNextLevel={1000}
              level={level}
              onLevelUp={() => {
                handleShowNotification('levelup');
              }}
            />

            {/* Bouton d'ajout d'XP */}
            <button
              onClick={handleAddXp}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover-lift shadow-lg"
            >
              Ajouter 100 XP
            </button>
          </div>
        </section>

        {/* Section Étoiles */}
        <section className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up delay-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ⭐ Système d&apos;Étoiles
          </h2>
          
          <div className="space-y-6">
            {/* Compteur d'étoiles */}
            <div className="flex justify-center">
              <StarCounter current={stars} previous={stars - 5} />
            </div>

            {/* Bouton de test */}
            <button
              onClick={() => {
                setShowStarAnimation(true);
                setStars(stars + 3);
                setTimeout(() => setShowStarAnimation(false), 2000);
                handleShowNotification('star');
              }}
              className="w-full px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover-grow shadow-lg"
            >
              Collecter 3 étoiles
            </button>
          </div>
        </section>

        {/* Section Validation de Défi */}
        <section className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up delay-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🎯 Validation de Défi
          </h2>
          
          <button
            onClick={handleCompleteChallenge}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover-lift shadow-lg"
          >
            Compléter un défi
          </button>
        </section>

        {/* Section Notifications */}
        <section className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up delay-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🔔 Notifications
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleShowNotification('success')}
              className="px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover-grow"
            >
              Succès
            </button>
            <button
              onClick={() => handleShowNotification('levelup')}
              className="px-4 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover-grow"
            >
              Niveau +
            </button>
            <button
              onClick={() => handleShowNotification('star')}
              className="px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover-grow"
            >
              Étoile
            </button>
            <button
              onClick={() => handleShowNotification('challenge')}
              className="px-4 py-3 bg-purple-500 text-white font-semibold rounded-lg hover-grow"
            >
              Défi
            </button>
          </div>
        </section>

        {/* Section Classes CSS */}
        <section className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up delay-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🎨 Classes CSS Animées
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-pink-100 rounded-lg animate-bounce text-center">
              Bounce
            </div>
            <div className="p-4 bg-blue-100 rounded-lg animate-fade-in text-center">
              Fade In
            </div>
            <div className="p-4 bg-green-100 rounded-lg animate-slide-up text-center">
              Slide Up
            </div>
            <div className="p-4 bg-yellow-100 rounded-lg animate-scale-in text-center">
              Scale In
            </div>
            <div className="p-4 bg-purple-100 rounded-lg hover-lift text-center cursor-pointer">
              Hover Lift
            </div>
            <div className="p-4 bg-orange-100 rounded-lg hover-grow text-center cursor-pointer">
              Hover Grow
            </div>
          </div>
        </section>

        {/* Section Liste avec stagger */}
        <section className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up delay-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📋 Animation de Liste (Stagger)
          </h2>
          
          <div className="stagger-children space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg shadow hover-lift"
              >
                Élément {item} - Apparaît avec un délai
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modals et animations */}
      {levelUpData && (
        <LevelUpModal
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          onClose={closeLevelUp}
        />
      )}

      {showValidation && (
        <ChallengeValidation
          challengeName="Course matinale de 5km"
          points={150}
          onClose={() => setShowValidation(false)}
        />
      )}

      {showStarAnimation && (
        <StarCollection
          count={3}
          position={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
          onComplete={() => {}}
        />
      )}

      {showNotification && (
        <AnimatedNotification
          type={notificationType}
          title={
            notificationType === 'success' ? 'Succès !' :
            notificationType === 'levelup' ? 'Niveau supérieur !' :
            notificationType === 'star' ? 'Étoile gagnée !' :
            'Défi complété !'
          }
          message={
            notificationType === 'success' ? 'L\'action a été complétée avec succès' :
            notificationType === 'levelup' ? 'Vous avez atteint un nouveau niveau' :
            notificationType === 'star' ? 'Vous avez gagné une étoile' :
            'Le défi a été validé'
          }
          duration={3000}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
}
