-- Migration v2: Refonte des défis (prédéfinis par admin)

-- 1. Supprimer les anciennes tables
DROP TABLE IF EXISTS user_challenges CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;

-- 2. Créer la table des défis prédéfinis
CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  goal_type VARCHAR(50) NOT NULL, -- 'consecutive_days', 'total_completions', 'activity_specific'
  goal_value INTEGER NOT NULL, -- Nombre requis (ex: 7 jours, 30 complétions)
  star_reward INTEGER DEFAULT 1,
  difficulty VARCHAR(50) DEFAULT 'easy',
  icon VARCHAR(10) DEFAULT '🎯',
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Créer la table de participation utilisateur
CREATE TABLE user_challenges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
  progress INTEGER DEFAULT 0,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, challenge_id)
);

-- 4. Insérer des défis prédéfinis
INSERT INTO challenges (name, description, goal_type, goal_value, star_reward, difficulty, icon, category) VALUES
-- Défis faciles (1-2 étoiles)
('Première Semaine', 'Complète une activité pendant 7 jours consécutifs', 'consecutive_days', 7, 2, 'easy', '🌟', 'starter'),
('Bon Début', 'Complète 5 activités au total', 'total_completions', 5, 1, 'easy', '✨', 'starter'),
('Week-end Warrior', 'Complète tes activités samedi et dimanche', 'consecutive_days', 2, 1, 'easy', '⚡', 'motivation'),

-- Défis moyens (3-5 étoiles)
('Deux Semaines de Feu', 'Complète une activité pendant 14 jours consécutifs', 'consecutive_days', 14, 4, 'medium', '🔥', 'consistency'),
('30 Complétions', 'Complète 30 activités au total', 'total_completions', 30, 3, 'medium', '💪', 'dedication'),
('Marathon Hebdo', 'Complète 7 activités en une semaine', 'total_completions', 7, 3, 'medium', '🏃', 'intensity'),

-- Défis difficiles (6-10 étoiles)
('Mois Parfait', 'Complète une activité pendant 30 jours consécutifs', 'consecutive_days', 30, 8, 'hard', '👑', 'mastery'),
('Centenaire', 'Complète 100 activités au total', 'total_completions', 100, 10, 'hard', '💎', 'mastery'),
('Triple Mois', 'Complète une activité pendant 90 jours consécutifs', 'consecutive_days', 90, 15, 'hard', '🏆', 'legendary'),

-- Défis spéciaux
('Régularité Extrême', 'Ne rate aucun jour pendant 14 jours', 'consecutive_days', 14, 5, 'medium', '⚡', 'discipline'),
('Super Semaine', 'Complète au moins 3 activités différentes par jour pendant 7 jours', 'total_completions', 21, 6, 'hard', '🌈', 'diversity');

RAISE NOTICE 'Migration v2 terminée avec succès !';
