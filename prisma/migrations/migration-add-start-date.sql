-- Migration: Ajouter la colonne start_date à la table activities
-- Cette migration peut être exécutée en toute sécurité même si la colonne existe déjà

-- Vérifier et ajouter la colonne start_date si elle n'existe pas
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
        
        RAISE NOTICE 'Colonne start_date ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne start_date existe déjà';
    END IF;
END $$;

-- Mettre à jour les activités existantes pour avoir la date de création comme date de début
UPDATE activities 
SET start_date = DATE(created_at) 
WHERE start_date IS NULL;
