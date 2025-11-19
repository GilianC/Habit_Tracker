-- Vérifier les utilisateurs existants
SELECT 
  id,
  name,
  email,
  LENGTH(password_hash) as hash_length,
  created_at,
  last_login
FROM users
ORDER BY created_at DESC;

-- Test users credentials:
-- Email: user@test.com | Password: password123
-- Email: admin@habittracker.com | Password: admin123
-- Email: gilian.cannier1@gmail.com | Password: (votre mot de passe d'inscription)
