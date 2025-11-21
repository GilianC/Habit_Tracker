-- Database setup for Habit Tracker App

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user', -- 'user' ou 'admin'
  stars INTEGER DEFAULT 0, -- Étoiles gagnées via les défis
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des activités (habitudes)
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  frequency VARCHAR(50) NOT NULL DEFAULT 'daily', -- 'daily', 'weekly', 'monthly'
  color VARCHAR(7) DEFAULT '#3B82F6', -- Couleur hexadécimale
  icon VARCHAR(10) DEFAULT '✅', -- Emoji
  start_date DATE DEFAULT CURRENT_DATE, -- Date de début de l'activité
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des logs d'activités (validation quotidienne)
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(activity_id, date) -- Une seule entrée par activité par jour
);

-- Table des défis (V2)
CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL, -- Nom du défi
  description TEXT, -- Description du défi
  activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  goal_days INTEGER NOT NULL, -- Nombre de jours à compléter
  star_reward INTEGER DEFAULT 1, -- Étoiles gagnées à la complétion
  difficulty VARCHAR(50) DEFAULT 'easy', -- 'easy', 'medium', 'hard'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'failed'
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Propriétaire du défi
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0, -- Jours complétés
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des badges (V3)
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '🏆',
  star_cost INTEGER NOT NULL, -- Coût en étoiles pour débloquer
  rarity VARCHAR(50) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  category VARCHAR(100), -- 'streak', 'completion', 'challenge', 'special'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des badges utilisateurs
CREATE TABLE IF NOT EXISTS user_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id)
);

-- Table des événements (V3)
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de participation aux événements
CREATE TABLE IF NOT EXISTS user_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);

-- Table des motivations entre amis (V3)
CREATE TABLE IF NOT EXISTS motivations (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL,
  comment TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des connexions utilisateurs (pour le backoffice)
CREATE TABLE IF NOT EXISTS user_connections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  streak_connexions INTEGER DEFAULT 1,
  UNIQUE(user_id, last_login::date)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_activity_id ON activity_logs(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_date ON activity_logs(date);
CREATE INDEX IF NOT EXISTS idx_challenges_challenger_id ON challenges(challenger_id);
CREATE INDEX IF NOT EXISTS idx_challenges_friend_id ON challenges(friend_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_motivations_receiver_id ON motivations(receiver_id);

-- Insertion de badges par défaut
INSERT INTO badges (title, description, condition_type, condition_value, icon) VALUES
('Premier pas', 'Première habitude créée', 'activities_created', 1, '🌟'),
('Régularité', '7 jours consécutifs', 'streak', 7, '🔥'),
('Persévérance', '30 jours consécutifs', 'streak', 30, '💪'),
('Champion', '100 habitudes complétées', 'total_completed', 100, '🏆'),
('Marathonien', '365 jours d\'activité', 'days_active', 365, '🎯')
ON CONFLICT DO NOTHING;

-- Insertion d'un utilisateur admin par défaut (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@habittracker.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;