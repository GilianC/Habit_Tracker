-- Migration: Système de défis et badges avec étoiles

-- 1. Ajouter la colonne stars aux utilisateurs
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
        RAISE NOTICE 'Colonne stars ajoutée aux utilisateurs';
    END IF;
END $$;

-- 2. Mettre à jour la table challenges (drop et recréer)
DROP TABLE IF EXISTS challenges CASCADE;

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
);

-- 3. Mettre à jour la table badges (drop et recréer)
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;

CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '🏆',
  star_cost INTEGER NOT NULL,
  rarity VARCHAR(50) DEFAULT 'common',
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id)
);

-- 4. Insérer des badges prédéfinis
INSERT INTO badges (title, description, icon, star_cost, rarity, category) VALUES
-- Badges communs (1-5 étoiles)
('Débutant Motivé', 'Tu as commencé ton aventure !', '🌟', 1, 'common', 'starter'),
('Première Étoile', 'Ta première étoile brillante', '⭐', 2, 'common', 'achievement'),
('Persévérant', 'Continue comme ça !', '💪', 3, 'common', 'motivation'),
('En Forme', 'La santé avant tout', '🏃', 4, 'common', 'health'),
('Organisé', 'Maître de la planification', '📋', 5, 'common', 'organization'),

-- Badges rares (6-10 étoiles)
('Série Gagnante', 'Une semaine complète !', '🔥', 6, 'rare', 'streak'),
('Champion Régulier', 'La régularité paie', '🏅', 7, 'rare', 'consistency'),
('Touche-à-tout', 'Multiple activités maîtrisées', '🎯', 8, 'rare', 'diversity'),
('Marathonien', 'Un mois complet !', '🏃‍♂️', 9, 'rare', 'endurance'),
('Productif', 'Efficacité maximale', '⚡', 10, 'rare', 'productivity'),

-- Badges épiques (11-20 étoiles)
('Légende Locale', 'Tout le monde te connaît', '🌟', 12, 'epic', 'social'),
('Maître des Défis', '10 défis complétés', '🎖️', 15, 'epic', 'challenge'),
('Infatigable', '100 jours d''activité', '💎', 18, 'epic', 'dedication'),
('Inspiration', 'Tu inspires les autres', '✨', 20, 'epic', 'leadership'),

-- Badges légendaires (21-50 étoiles)
('Icône', 'Statut légendaire atteint', '👑', 25, 'legendary', 'prestige'),
('Perfectionniste', 'Zéro jour manqué', '💯', 30, 'legendary', 'perfection'),
('Visionnaire', '1 an d''habitudes', '🔮', 40, 'legendary', 'vision'),
('Légende Vivante', 'Le summum de l''excellence', '🏆', 50, 'legendary', 'ultimate');

RAISE NOTICE 'Migration terminée avec succès !';
