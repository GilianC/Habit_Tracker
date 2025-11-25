-- ============================================
-- MIGRATION: Ajout colonne category aux activités
-- Description: Ajoute la colonne category pour classifier les activités
-- Date: 2025-11-25
-- ============================================

-- Ajouter la colonne category si elle n'existe pas
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'other';

-- Mettre à jour les activités existantes avec des catégories par défaut
-- (Optionnel: basé sur le nom ou l'icône)
UPDATE activities
SET category = 'sport'
WHERE icon IN ('🏃‍♂️', '⚽', '🏋️‍♂️', '🏊‍♂️', '🚴‍♂️', '🤸‍♀️', '⛹️‍♂️', '🧗‍♀️', '🏃‍♀️', '🥊');

UPDATE activities
SET category = 'health'
WHERE icon IN ('💊', '❤️', '🩺', '💉', '🧬', '🦷', '👁️', '🧪', '⚕️', '🏥');

UPDATE activities
SET category = 'nutrition'
WHERE icon IN ('🥗', '🍎', '🥑', '🥦', '🍊', '🥕', '🍇', '🥤', '💧', '🍽️');

UPDATE activities
SET category = 'learning'
WHERE icon IN ('📚', '📖', '✍️', '🎓', '🧠', '📝', '💡', '🔬', '🎯', '📊');

UPDATE activities
SET category = 'mindfulness'
WHERE icon IN ('🧘‍♀️', '🕉️', '☮️', '🌸', '🌺', '🍃', '🌿', '✨', '🙏', '💆‍♀️');

UPDATE activities
SET category = 'productivity'
WHERE icon IN ('🎯', '✅', '📋', '💼', '⏰', '📅', '🔔', '💪', '🚀', '⭐');

UPDATE activities
SET category = 'social'
WHERE icon IN ('👥', '💬', '👫', '🤝', '👪', '💕', '🎉', '📱', '☕', '🎊');

-- Vérification
SELECT 
  category, 
  COUNT(*) as count,
  STRING_AGG(DISTINCT icon, ', ') as icons_used
FROM activities
GROUP BY category
ORDER BY count DESC;
