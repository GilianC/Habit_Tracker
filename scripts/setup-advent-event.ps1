# Script PowerShell pour créer l'événement "Calendrier de l'Avent"
# Utilise l'API admin pour créer l'événement et le défi

Write-Host "🎄 Configuration de l'événement Calendrier de l'Avent..." -ForegroundColor Green
Write-Host ""

# Demander l'email de l'utilisateur
$email = Read-Host "Entrez votre email (celui utilisé pour vous connecter)"

# Connexion à la base de données via Prisma
Write-Host "📊 Connexion à la base de données..." -ForegroundColor Yellow

# Script SQL pour créer l'admin et l'événement
$sqlScript = @"
-- 1. Définir l'utilisateur comme admin
UPDATE users SET role = 'admin' WHERE email = '$email';

-- 2. Récupérer l'ID de l'utilisateur
DO `$`$
DECLARE
  v_user_id INT;
  v_event_id INT;
BEGIN
  -- Obtenir l'ID utilisateur
  SELECT id INTO v_user_id FROM users WHERE email = '$email';
  
  -- Créer l'événement
  INSERT INTO "Event" (
    name,
    description,
    "startDate",
    "endDate",
    "isActive",
    "createdAt",
    "userId"
  ) VALUES (
    '🎄 Calendrier de l''Avent Sportif',
    'Relevez le défi de décembre ! Faites du sport chaque jour jusqu''à Noël et gagnez des étoiles. Un défi quotidien pour rester actif pendant les fêtes ! 💪',
    '2025-12-01',
    '2025-12-25',
    true,
    NOW(),
    v_user_id
  ) RETURNING id INTO v_event_id;
  
  -- Créer le défi
  INSERT INTO "EventChallenge" (
    "eventId",
    title,
    description,
    "targetValue",
    unit,
    "starReward",
    icon,
    color,
    "createdAt"
  ) VALUES (
    v_event_id,
    '💪 Activité sportive quotidienne',
    'Faites du sport au moins 1 fois par jour jusqu''au 25 décembre',
    1,
    'fois',
    50,
    '🏃',
    '#FF1493',
    NOW()
  );
  
  RAISE NOTICE 'Événement créé avec succès ! ID: %', v_event_id;
END `$`$;
"@

# Sauvegarder le script SQL temporaire
$sqlScript | Out-File -FilePath "temp_advent_setup.sql" -Encoding UTF8

Write-Host "✅ Script SQL généré" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Étapes suivantes :" -ForegroundColor Cyan
Write-Host "1. Ouvrez Prisma Studio (si pas déjà ouvert) : npx prisma studio" -ForegroundColor White
Write-Host "2. Ou exécutez ce script SQL dans votre base de données PostgreSQL" -ForegroundColor White
Write-Host "3. Le fichier 'temp_advent_setup.sql' contient les commandes SQL" -ForegroundColor White
Write-Host ""
Write-Host "📍 Après l'exécution, vous pourrez :" -ForegroundColor Yellow
Write-Host "   - Accéder à /dashboard/admin/events pour gérer l'événement" -ForegroundColor White
Write-Host "   - Tous les utilisateurs recevront une notification" -ForegroundColor White
Write-Host "   - Le défi sera visible sur la page des défis" -ForegroundColor White
Write-Host ""
Write-Host "🎁 Détails de l'événement :" -ForegroundColor Magenta
Write-Host "   Nom: 🎄 Calendrier de l'Avent Sportif" -ForegroundColor White
Write-Host "   Période: 1er décembre - 25 décembre 2025" -ForegroundColor White
Write-Host "   Défi: Faire du sport 1 fois par jour" -ForegroundColor White
Write-Host "   Récompense: 50 étoiles ⭐" -ForegroundColor White
Write-Host ""

# Proposer d'ouvrir Prisma Studio
$openStudio = Read-Host "Voulez-vous ouvrir Prisma Studio maintenant ? (o/n)"
if ($openStudio -eq "o" -or $openStudio -eq "O") {
    Write-Host "🚀 Ouverture de Prisma Studio..." -ForegroundColor Green
    Start-Process "npx" -ArgumentList "prisma studio"
}
