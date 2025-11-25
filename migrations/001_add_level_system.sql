-- ============================================
-- MIGRATION: Système de Levels et XP
-- Description: Ajoute le système de progression par level basé sur les étoiles
-- Date: 2025-11-25
-- ============================================

-- 1. Ajouter les colonnes level et xp à la table users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;

-- 2. Synchroniser les XP avec les étoiles existantes (1 star = 1 XP)
UPDATE users
SET xp = COALESCE(stars, 0)
WHERE xp = 0;

-- 3. Calculer le level initial basé sur les XP
-- Paliers: 10, 25, 50, 100, 125, 175, 250, 350, 500...
UPDATE users
SET level = CASE 
  WHEN xp >= 500 THEN 10
  WHEN xp >= 350 THEN 9
  WHEN xp >= 250 THEN 8
  WHEN xp >= 175 THEN 7
  WHEN xp >= 125 THEN 6
  WHEN xp >= 100 THEN 5
  WHEN xp >= 50 THEN 4
  WHEN xp >= 25 THEN 3
  WHEN xp >= 10 THEN 2
  ELSE 1
END;

-- 4. Créer des badges de level (un par niveau atteint)
-- Ces badges se débloquent automatiquement quand on atteint le level
INSERT INTO badges (title, description, icon, star_cost, rarity, category)
VALUES 
  ('Débutant', 'Atteindre le niveau 2', '🌱', 0, 'common', 'level'),
  ('Apprenti', 'Atteindre le niveau 3', '🌿', 0, 'common', 'level'),
  ('Habitué', 'Atteindre le niveau 4', '🌳', 0, 'common', 'level'),
  ('Expert', 'Atteindre le niveau 5', '⭐', 0, 'rare', 'level'),
  ('Maître', 'Atteindre le niveau 6', '💎', 0, 'rare', 'level'),
  ('Légende', 'Atteindre le niveau 7', '👑', 0, 'epic', 'level'),
  ('Champion', 'Atteindre le niveau 8', '🏆', 0, 'epic', 'level'),
  ('Titan', 'Atteindre le niveau 9', '🔥', 0, 'legendary', 'level'),
  ('Dieu Vivant', 'Atteindre le niveau 10', '⚡', 0, 'legendary', 'level'),
  ('Immortel', 'Atteindre le niveau 11+', '🌟', 0, 'legendary', 'level')
ON CONFLICT DO NOTHING;

-- 5. Débloquer automatiquement les badges pour les levels actuels
INSERT INTO user_badges (user_id, badge_id)
SELECT 
  u.id,
  b.id
FROM users u
CROSS JOIN badges b
WHERE b.category = 'level'
AND (
  (b.title = 'Débutant' AND u.level >= 2) OR
  (b.title = 'Apprenti' AND u.level >= 3) OR
  (b.title = 'Habitué' AND u.level >= 4) OR
  (b.title = 'Expert' AND u.level >= 5) OR
  (b.title = 'Maître' AND u.level >= 6) OR
  (b.title = 'Légende' AND u.level >= 7) OR
  (b.title = 'Champion' AND u.level >= 8) OR
  (b.title = 'Titan' AND u.level >= 9) OR
  (b.title = 'Dieu Vivant' AND u.level >= 10) OR
  (b.title = 'Immortel' AND u.level >= 11)
)
ON CONFLICT (user_id, badge_id) DO NOTHING;

-- 6. Vérification: Afficher les résultats de la migration
SELECT 
  email, 
  stars, 
  xp, 
  level,
  (SELECT COUNT(*) FROM user_badges WHERE user_id = users.id) as badges_total
FROM users
ORDER BY level DESC, xp DESC;
