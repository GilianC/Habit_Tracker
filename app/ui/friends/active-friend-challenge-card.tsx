'use client';

interface ActiveFriendChallenge {
  id: number;
  challengerId: number;
  challengedId: number;
  title: string;
  description: string | null;
  targetValue: number;
  unit: string;
  starReward: number;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  challengerProgress: number;
  challengedProgress: number;
  challenger: {
    id: number;
    name: string;
    level: number;
  };
  challenged: {
    id: number;
    name: string;
    level: number;
  };
  activity: {
    id: number;
    name: string;
    icon: string;
    color: string;
  } | null;
}

interface Props {
  challenge: ActiveFriendChallenge;
  currentUserId: number;
}

export default function ActiveFriendChallengeCard({ challenge, currentUserId }: Props) {
  const isChallenger = challenge.challengerId === currentUserId;
  const opponent = isChallenger ? challenge.challenged : challenge.challenger;
  const myProgress = isChallenger ? challenge.challengerProgress : challenge.challengedProgress;
  const opponentProgress = isChallenger ? challenge.challengedProgress : challenge.challengerProgress;

  // Calculer les jours restants
  const daysRemaining = challenge.endDate
    ? Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Calculer les pourcentages
  const myPercentage = Math.min(100, Math.round((myProgress / challenge.targetValue) * 100));
  const opponentPercentage = Math.min(100, Math.round((opponentProgress / challenge.targetValue) * 100));

  // Déterminer qui est en tête
  const isLeading = myProgress > opponentProgress;
  const isTied = myProgress === opponentProgress;

  return (
    <div className="bg-white border-2 border-pink-200 rounded-2xl p-5 hover:shadow-lg transition-all">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚔️</span>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{challenge.title}</h3>
            <p className="text-sm text-gray-600">
              Contre <span className="font-medium text-pink-600">{opponent.name}</span>
            </p>
          </div>
        </div>
        
        {/* Badge de statut */}
        {isLeading && !isTied && (
          <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
            🏆 En tête !
          </div>
        )}
        {isTied && myProgress > 0 && (
          <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
            ⚖️ Égalité
          </div>
        )}
        {!isLeading && !isTied && (
          <div className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
            💪 À rattraper
          </div>
        )}
      </div>

      {/* Détails */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {challenge.activity && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
            <span>{challenge.activity.icon}</span>
            <span className="text-xs font-medium text-gray-700">{challenge.activity.name}</span>
          </div>
        )}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
          <span className="text-xs font-medium text-gray-700">
            🎯 {challenge.targetValue} {challenge.unit}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-lg">
          <span className="text-xs font-bold text-yellow-700">⭐ +{challenge.starReward}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded-lg">
          <span className="text-xs font-bold text-red-700">
            ⏱️ {daysRemaining > 0 ? `${daysRemaining}j` : 'Terminé'}
          </span>
        </div>
      </div>

      {/* Progression */}
      <div className="space-y-3">
        {/* Ma progression */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Vous</span>
            <span className="text-sm font-bold text-pink-600">
              {myProgress} / {challenge.targetValue} ({myPercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-pink-500 to-rose-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${myPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Progression de l'adversaire */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{opponent.name}</span>
            <span className="text-sm font-bold text-purple-600">
              {opponentProgress} / {challenge.targetValue} ({opponentPercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${opponentPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Message de motivation */}
      {daysRemaining > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 italic">
            {isLeading && !isTied
              ? "Continuez comme ça !"
              : isTied
              ? "C'est serré ! Donnez tout !"
              : "Il est temps de rattraper votre retard !"}
          </p>
        </div>
      )}
    </div>
  );
}
