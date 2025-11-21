import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    console.log('🎯 Création de la table des défis journaliers...');

    // Créer la table des défis journaliers
    await sql`DROP TABLE IF EXISTS daily_challenges CASCADE`;
    
    await sql`
      CREATE TABLE daily_challenges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        challenge_date DATE NOT NULL,
        
        -- Défi 1: Compléter 3 activités
        activities_completed INTEGER DEFAULT 0,
        activities_target INTEGER DEFAULT 3,
        activities_reward INTEGER DEFAULT 2,
        activities_claimed BOOLEAN DEFAULT FALSE,
        
        -- Défi 2: Compléter 1 activité Sport
        sport_completed INTEGER DEFAULT 0,
        sport_target INTEGER DEFAULT 1,
        sport_reward INTEGER DEFAULT 2,
        sport_claimed BOOLEAN DEFAULT FALSE,
        
        -- Défi 3: Compléter 1 activité Santé
        health_completed INTEGER DEFAULT 0,
        health_target INTEGER DEFAULT 1,
        health_reward INTEGER DEFAULT 2,
        health_claimed BOOLEAN DEFAULT FALSE,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE(user_id, challenge_date)
      )
    `;

    console.log('✅ Table daily_challenges créée');

    return NextResponse.json({ 
      message: '✅ Migration réussie : table daily_challenges créée',
      success: true 
    });
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    return NextResponse.json({ 
      error: '❌ Échec de la migration',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      success: false 
    }, { status: 500 });
  }
}
