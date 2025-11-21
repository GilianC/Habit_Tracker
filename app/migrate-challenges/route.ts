import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // 1. Ajouter stars aux users
    await sql`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM information_schema.columns 
              WHERE table_name = 'users' 
              AND column_name = 'stars'
          ) THEN
              ALTER TABLE users 
              ADD COLUMN stars INTEGER DEFAULT 0;
          END IF;
      END $$;
    `;

    // 2. Recréer la table challenges
    await sql`DROP TABLE IF EXISTS challenges CASCADE`;
    
    await sql`
      CREATE TABLE challenges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
        goal_days INTEGER NOT NULL,
        star_reward INTEGER DEFAULT 1,
        difficulty VARCHAR(50) DEFAULT 'easy',
        status VARCHAR(50) DEFAULT 'active',
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        start_date DATE DEFAULT CURRENT_DATE,
        end_date DATE,
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Recréer les tables badges
    await sql`DROP TABLE IF EXISTS user_badges CASCADE`;
    await sql`DROP TABLE IF EXISTS badges CASCADE`;

    await sql`
      CREATE TABLE badges (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(10) DEFAULT '🏆',
        star_cost INTEGER NOT NULL,
        rarity VARCHAR(50) DEFAULT 'common',
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
        unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, badge_id)
      )
    `;

    // 4. Insérer les badges prédéfinis
    await sql`
      INSERT INTO badges (title, description, icon, star_cost, rarity, category) VALUES
      ('Débutant Motivé', 'Tu as commencé ton aventure !', '🌟', 1, 'common', 'starter'),
      ('Première Étoile', 'Ta première étoile brillante', '⭐', 2, 'common', 'achievement'),
      ('Persévérant', 'Continue comme ça !', '💪', 3, 'common', 'motivation'),
      ('En Forme', 'La santé avant tout', '🏃', 4, 'common', 'health'),
      ('Organisé', 'Maître de la planification', '📋', 5, 'common', 'organization'),
      ('Série Gagnante', 'Une semaine complète !', '🔥', 6, 'rare', 'streak'),
      ('Champion Régulier', 'La régularité paie', '🏅', 7, 'rare', 'consistency'),
      ('Touche-à-tout', 'Multiple activités maîtrisées', '🎯', 8, 'rare', 'diversity'),
      ('Marathonien', 'Un mois complet !', '🏃‍♂️', 9, 'rare', 'endurance'),
      ('Productif', 'Efficacité maximale', '⚡', 10, 'rare', 'productivity'),
      ('Légende Locale', 'Tout le monde te connaît', '🌟', 12, 'epic', 'social'),
      ('Maître des Défis', '10 défis complétés', '🎖️', 15, 'epic', 'challenge'),
      ('Infatigable', '100 jours d''activité', '💎', 18, 'epic', 'dedication'),
      ('Inspiration', 'Tu inspires les autres', '✨', 20, 'epic', 'leadership'),
      ('Icône', 'Statut légendaire atteint', '👑', 25, 'legendary', 'prestige'),
      ('Perfectionniste', 'Zéro jour manqué', '💯', 30, 'legendary', 'perfection'),
      ('Visionnaire', '1 an d''habitudes', '🔮', 40, 'legendary', 'vision'),
      ('Légende Vivante', 'Le summum de l''excellence', '🏆', 50, 'legendary', 'ultimate')
    `;

    return NextResponse.json({ 
      message: 'Migration réussie : système de défis et badges avec étoiles créé',
      success: true 
    });
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    return NextResponse.json({ 
      error: 'Échec de la migration',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      success: false 
    }, { status: 500 });
  }
}
