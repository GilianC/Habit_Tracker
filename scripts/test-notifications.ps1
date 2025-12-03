# Script PowerShell pour tester le système de notifications
# Usage: .\scripts\test-notifications.ps1

$API_URL = if ($env:API_URL) { $env:API_URL } else { "http://localhost:3000" }

Write-Host "=== Test Système de Notifications ===" -ForegroundColor Yellow
Write-Host "API URL: $API_URL`n"

function Test-Notification {
    param (
        [string]$Action
    )
    
    Write-Host "Testing $Action..." -ForegroundColor Blue
    
    try {
        $body = @{
            action = $Action
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "$API_URL/api/cron/notifications" `
            -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body $body `
            -UseBasicParsing
        
        Write-Host "✓ Success" -ForegroundColor Green
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    }
    catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $reader.ReadToEnd()
        }
    }
    
    Write-Host ""
}

# Vérifier si on est en développement
if ($env:NODE_ENV -eq "production") {
    Write-Host "⚠ Ce script ne peut être exécuté qu'en développement" -ForegroundColor Red
    exit 1
}

# Exécuter les tests
Test-Notification -Action "check-late"
Test-Notification -Action "notify-start"
Test-Notification -Action "notify-ending"
Test-Notification -Action "all"

Write-Host "=== Tests terminés ===" -ForegroundColor Yellow
