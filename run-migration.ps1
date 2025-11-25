# Script de migration SQL pour HabitFlow
# Exécute les migrations dans le bon ordre

param(
    [string]$MigrationFile = ""
)

Write-Host "🚀 HabitFlow - Script de Migration SQL" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Charger les variables d'environnement
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "✓ Variable chargée: $key" -ForegroundColor Green
        }
    }
} else {
    Write-Host "❌ Fichier .env non trouvé!" -ForegroundColor Red
    exit 1
}

$POSTGRES_URL = $env:POSTGRES_URL
if (-not $POSTGRES_URL) {
    Write-Host "❌ POSTGRES_URL non définie dans .env" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📊 Connexion à la base de données..." -ForegroundColor Yellow

# Si un fichier spécifique est fourni
if ($MigrationFile) {
    if (Test-Path $MigrationFile) {
        Write-Host "📝 Exécution de: $MigrationFile" -ForegroundColor Cyan
        $sql = Get-Content $MigrationFile -Raw
        
        # Utiliser psql ou node avec postgres pour exécuter le SQL
        # Pour l'instant, afficher le SQL à exécuter manuellement
        Write-Host ""
        Write-Host "📋 Contenu du fichier SQL:" -ForegroundColor Yellow
        Write-Host $sql
        Write-Host ""
        Write-Host "💡 Pour exécuter cette migration:" -ForegroundColor Cyan
        Write-Host "   1. Copiez le SQL ci-dessus" -ForegroundColor White
        Write-Host "   2. Allez sur Neon Console: https://console.neon.tech" -ForegroundColor White
        Write-Host "   3. Exécutez le SQL dans l'éditeur SQL" -ForegroundColor White
    } else {
        Write-Host "❌ Fichier non trouvé: $MigrationFile" -ForegroundColor Red
        exit 1
    }
} else {
    # Lister toutes les migrations disponibles
    Write-Host "📂 Migrations disponibles:" -ForegroundColor Cyan
    Write-Host ""
    
    $migrations = Get-ChildItem "migrations\*.sql" | Sort-Object Name
    
    if ($migrations.Count -eq 0) {
        Write-Host "❌ Aucune migration trouvée dans le dossier migrations/" -ForegroundColor Red
        exit 1
    }
    
    $i = 1
    foreach ($migration in $migrations) {
        Write-Host "$i. $($migration.Name)" -ForegroundColor White
        $i++
    }
    
    Write-Host ""
    Write-Host "💡 Pour exécuter une migration:" -ForegroundColor Cyan
    Write-Host "   .\run-migration.ps1 -MigrationFile migrations\nom_du_fichier.sql" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Script terminé!" -ForegroundColor Green
