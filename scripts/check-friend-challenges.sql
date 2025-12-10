-- Script de vérification des défis avec amis
-- À exécuter dans Prisma Studio ou directement dans PostgreSQL

-- 1. Voir tous les défis avec amis
SELECT 
  fc.id,
  fc.status,
  fc."targetValue",
  fc.unit,
  fc."durationDays",
  challenger.email as challenger_email,
  challenged.email as challenged_email,
  COALESCE(a.name, 'Événement') as challenge_name
FROM "FriendChallenge" fc
LEFT JOIN "User" challenger ON fc."challengerId" = challenger.id
LEFT JOIN "User" challenged ON fc."challengedId" = challenged.id
LEFT JOIN "Activity" a ON fc."activityId" = a.id
ORDER BY fc."createdAt" DESC;

-- 2. Compter les défis par statut
SELECT 
  status,
  COUNT(*) as count
FROM "FriendChallenge"
GROUP BY status;

-- 3. Voir les défis ACTIFS seulement
SELECT 
  fc.id,
  challenger.email as challenger_email,
  challenged.email as challenged_email,
  fc."targetValue",
  fc.unit,
  fc."challengerProgress",
  fc."challengedProgress"
FROM "FriendChallenge" fc
LEFT JOIN "User" challenger ON fc."challengerId" = challenger.id
LEFT JOIN "User" challenged ON fc."challengedId" = challenged.id
WHERE fc.status = 'active';

-- 4. Vérifier les amitiés
SELECT 
  f.id,
  f.status,
  requester.email as requester_email,
  addressee.email as addressee_email
FROM "Friendship" f
LEFT JOIN "User" requester ON f."requesterId" = requester.id
LEFT JOIN "User" addressee ON f."addresseeId" = addressee.id
ORDER BY f."createdAt" DESC;
