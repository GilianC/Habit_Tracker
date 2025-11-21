-- Migration complète pour le système de défis journaliers
-- Exécuter ce script dans votre base de données PostgreSQL

-- ============================================
-- ÉTAPE 1 : Ajouter start_date aux activités
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'activities' 
        AND column_name = 'start_date'
    ) THEN
        ALTER TABLE activities 
        ADD COLUMN start_date DATE DEFAULT CURRENT_DATE;
    END IF;
END $$;

UPDATE activities 
SET start_date = DATE(created_at) 
WHERE start_date IS NULL;

-- ============================================
-- ÉTAPE 2 : Ajouter stars aux users
-- ============================================
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

-- ============================================
-- ÉTAPE 3 : Ajouter category aux activités
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'activities' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE activities 
        ADD COLUMN category VARCHAR(50) DEFAULT 'other';
    END IF;
END $$;

UPDATE activities 
SET category = 'other' 
WHERE category IS NULL;

-- ============================================
-- ÉTAPE 4 : Créer les tables de badges
-- ============================================
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

-- Insérer les badges prédéfinis
INSERT INTO badges (title, description, icon, star_cost, rarity, category) VALUES
('Première Étoile', 'Gagne ta première étoile', '⭐', 1, 'common', 'starter'),
('Collectionneur', 'Accumule 10 étoiles', '✨', 5, 'common', 'milestone'),
('Étoile Filante', 'Atteins 25 étoiles', '💫', 10, 'rare', 'milestone'),
('Constellation', 'Collectionne 50 étoiles', '🌟', 20, 'rare', 'milestone'),
('Galaxie', 'Accumule 100 étoiles', '🌌', 30, 'epic', 'milestone'),

('Habitué', 'Complète 7 jours consécutifs', '🔥', 3, 'common', 'streak'),
('Déterminé', 'Complète 14 jours consécutifs', '💪', 7, 'rare', 'streak'),
('Invincible', 'Complète 30 jours consécutifs', '🦸', 15, 'epic', 'streak'),
('Légende', 'Complète 100 jours consécutifs', '👑', 40, 'legendary', 'streak'),

('Premiers Pas', 'Crée ta première activité', '👣', 1, 'common', 'achievement'),
('Organisé', 'Crée 5 activités', '📋', 5, 'rare', 'achievement'),
('Multitâche', 'Crée 10 activités', '🎯', 12, 'epic', 'achievement'),

('Guerrier du Week-end', 'Complète tes habitudes samedi et dimanche', '⚡', 8, 'rare', 'special'),
('Matinal', 'Complète une habitude avant 8h', '🌅', 5, 'rare', 'special'),
('Noctambule', 'Complète une habitude après 22h', '🌙', 5, 'rare', 'special'),

('Champion', 'Complète tous les défis faciles', '🥇', 25, 'epic', 'challenge'),
('Master', 'Complète tous les défis moyens', '🥈', 35, 'epic', 'challenge'),
('Grand Master', 'Complète tous les défis difficiles', '🥉', 50, 'legendary', 'challenge');

-- ============================================
-- ÉTAPE 5 : Créer la table des défis journaliers
-- ============================================
DROP TABLE IF EXISTS daily_challenges CASCADE;

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
);

-- ============================================
-- ÉTAPE 6 : Créer les tables de challenges (anciens défis)
-- ============================================
DROP TABLE IF EXISTS user_challenges CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;

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
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

-- Insérer les défis prédéfinis (désactivés)
INSERT INTO challenges (name, description, goal_type, goal_value, star_reward, difficulty, icon, category, is_active) VALUES
('Première Semaine', 'Complète une activité pendant 7 jours consécutifs', 'consecutive_days', 7, 2, 'easy', '🌟', 'starter', false),
('Bon Début', 'Complète 5 activités au total', 'total_completions', 5, 1, 'easy', '✨', 'starter', false),
('Week-end Warrior', 'Complète tes activités samedi et dimanche', 'consecutive_days', 2, 1, 'easy', '⚡', 'motivation', false),

('Deux Semaines de Feu', 'Maintiens une série de 14 jours', 'consecutive_days', 14, 4, 'medium', '🔥', 'streak', false),
('Marathon Hebdo', 'Complète 7 activités en une semaine', 'total_completions', 7, 3, 'medium', '🏃', 'completion', false),
('30 Complétions', 'Atteins 30 activités complétées', 'total_completions', 30, 3, 'medium', '📈', 'completion', false),
('Régularité', 'Complète au moins une activité par jour pendant 21 jours', 'consecutive_days', 21, 6, 'medium', '📅', 'streak', false),

('Mois Parfait', 'Série de 30 jours sans interruption', 'consecutive_days', 30, 8, 'hard', '💎', 'streak', false),
('Demi-Centenaire', 'Complète 50 activités au total', 'total_completions', 50, 5, 'hard', '🎖️', 'completion', false),
('Centenaire', 'Atteins 100 activités complétées', 'total_completions', 100, 10, 'hard', '💯', 'completion', false),

('Triple Mois', 'Série légendaire de 90 jours', 'consecutive_days', 90, 15, 'hard', '👑', 'legendary', false);

-- ============================================
-- RÉSULTAT
-- ============================================
SELECT 'Migration complète réussie!' as status;
SELECT 'Colonnes ajoutées: stars, category, start_date' as info;
SELECT 'Tables créées: badges, user_badges, daily_challenges, challenges, user_challenges' as info;
SELECT COUNT(*) || ' badges créés' as badges FROM badges;
SELECT COUNT(*) || ' défis créés (désactivés)' as challenges FROM challenges;
