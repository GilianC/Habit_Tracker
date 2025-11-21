import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    console.log('📦 Ajout de la colonne category aux activités...');

    // Ajouter la colonne category si elle n'existe pas
    await sql`
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
    `;

    // Mettre à jour les activités existantes
    await sql`
      UPDATE activities 
      SET category = 'other' 
      WHERE category IS NULL
    `;

    console.log('✅ Colonne category ajoutée');

    return NextResponse.json({ 
      message: '✅ Migration réussie : colonne category ajoutée',
      success: true 
    });
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    return NextResponse.json({ 
      error: '❌ Échec de la migration',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      success: false 
    }, { status: 500 });
  }
}
