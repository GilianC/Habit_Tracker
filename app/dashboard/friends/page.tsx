import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getPendingFriendRequests, getPendingFriendChallenges } from '@/app/lib/friend-actions';
import FriendRequestCard from '@/app/ui/friends/friend-request-card';
import FriendChallengeCard from '@/app/ui/friends/friend-challenge-card';
import Link from 'next/link';

export default async function FriendsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const [requestsResult, challengesResult] = await Promise.all([
    getPendingFriendRequests(),
    getPendingFriendChallenges(),
  ]);

  const requests = requestsResult.success ? requestsResult.requests || [] : [];
  const challenges = challengesResult.success ? challengesResult.challenges || [] : [];

  return (
    <div className="min-h-screen bg-theme-bg p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-theme-text mb-2">👥 Amis</h1>
            <p className="text-theme-text-muted">
              Gérez vos demandes d&apos;amis et défis
            </p>
          </div>
          <Link
            href="/dashboard/home"
            className="px-4 py-2 bg-theme-accent text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            ← Retour
          </Link>
        </div>

        {/* Demandes d'amis en attente */}
        {requests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-theme-text mb-4">
              🔔 Demandes d&apos;ami ({requests.length})
            </h2>
            <div className="space-y-3">
              {requests.map((request) => (
                <FriendRequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        )}

        {/* Défis en attente */}
        {challenges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-theme-text mb-4">
              ⚔️ Défis reçus ({challenges.length})
            </h2>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <FriendChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </div>
        )}

        {/* Aucune demande */}
        {requests.length === 0 && challenges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😊</div>
            <h3 className="text-xl font-bold text-theme-text mb-2">
              Aucune demande en attente
            </h3>
            <p className="text-theme-text-muted mb-6">
              Vous êtes à jour avec vos amis !
            </p>
            <Link
              href="/dashboard/home"
              className="inline-block px-6 py-3 bg-theme-accent text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
