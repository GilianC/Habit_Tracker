// Script de test pour le système de notifications
// Utilisation : node scripts/test-notifications.js

const API_URL = process.env.API_URL || 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

async function testNotification(action) {
  console.log(`${colors.blue}Testing ${action}...${colors.reset}`);
  
  try {
    const response = await fetch(`${API_URL}/api/cron/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`${colors.green}✓ Success${colors.reset}`);
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(`${colors.red}✗ Error: ${response.status}${colors.reset}`);
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log(`${colors.red}✗ Network error${colors.reset}`);
    console.error(error.message);
  }
  
  console.log('');
}

async function runTests() {
  console.log(`${colors.yellow}=== Test Système de Notifications ===${colors.reset}\n`);
  console.log(`API URL: ${API_URL}\n`);

  // Test 1: Vérifier les activités en retard
  await testNotification('check-late');

  // Test 2: Notifier le début d'événements
  await testNotification('notify-start');

  // Test 3: Notifier la fin proche d'événements
  await testNotification('notify-ending');

  // Test 4: Tout exécuter
  await testNotification('all');

  console.log(`${colors.yellow}=== Tests terminés ===${colors.reset}`);
}

// Vérifier si on est en développement
if (process.env.NODE_ENV === 'production') {
  console.log(`${colors.red}⚠ Ce script ne peut être exécuté qu'en développement${colors.reset}`);
  process.exit(1);
}

runTests().catch(console.error);
