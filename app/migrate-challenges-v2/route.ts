import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // 1. Supprimer les anciennes tables
    await sql`DROP TABLE IF EXISTS user_challenges CASCADE`;
    await sql`DROP TABLE IF EXISTS challenges CASCADE`;

    // 2. Créer la table des défis prédéfinis
    await sql`
      CREATE TABLE challenges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        goal_type VARCHAR(50) NOT NULL,
        goal_value INTEGER NOT NULL,
        star_reward INTEGER DEFAULT 1,
        difficulty VARCHAR(50) DEFAULT 'easy',
        icon VARCHAR(10) DEFAULT '🎯',
        category VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Créer la table de participation utilisateur
    await sql`
      CREATE TABLE user_challenges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'in_progress',
        progress INTEGER DEFAULT 0,
        start_date DATE DEFAULT CURRENT_DATE,
        end_date DATE,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, challenge_id)
      )
    `;

    // 4. Insérer les défis prédéfinis
    await sql`
      INSERT INTO challenges (name, description, goal_type, goal_value, star_reward, difficulty, icon, category) VALUES
      ('Première Semaine', 'Complète une activité pendant 7 jours consécutifs', 'consecutive_days', 7, 2, 'easy', '🌟', 'starter'),
      ('Bon Début', 'Complète 5 activités au total', 'total_completions', 5, 1, 'easy', '✨', 'starter'),
      ('Week-end Warrior', 'Complète tes activités samedi et dimanche', 'consecutive_days', 2, 1, 'easy', '⚡', 'motivation'),
      ('Deux Semaines de Feu', 'Complète une activité pendant 14 jours consécutifs', 'consecutive_days', 14, 4, 'medium', '🔥', 'consistency'),
      ('30 Complétions', 'Complète 30 activités au total', 'total_completions', 30, 3, 'medium', '💪', 'dedication'),
      ('Marathon Hebdo', 'Complète 7 activités en une semaine', 'total_completions', 7, 3, 'medium', '🏃', 'intensity'),
      ('Mois Parfait', 'Complète une activité pendant 30 jours consécutifs', 'consecutive_days', 30, 8, 'hard', '👑', 'mastery'),
      ('Centenaire', 'Complète 100 activités au total', 'total_completions', 100, 10, 'hard', '💎', 'mastery'),
      ('Triple Mois', 'Complète une activité pendant 90 jours consécutifs', 'consecutive_days', 90, 15, 'hard', '🏆', 'legendary'),
      ('Régularité Extrême', 'Ne rate aucun jour pendant 14 jours', 'consecutive_days', 14, 5, 'medium', '⚡', 'discipline'),
      ('Super Semaine', 'Complète au moins 3 activités différentes par jour pendant 7 jours', 'total_completions', 21, 6, 'hard', '🌈', 'diversity')
    `;

    return NextResponse.json({ 
      message: 'Migration v2 réussie : défis prédéfinis créés',
      success: true,
      challenges_count: 11
    });
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    return NextResponse.json({ 
      error: 'Échec de la migration v2',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      success: false 
    }, { status: 500 });
  }
}
