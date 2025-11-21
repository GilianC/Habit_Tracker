import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // Exécuter la migration
    await sql`
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
    `;

    // Mettre à jour les activités existantes
    await sql`
      UPDATE activities 
      SET start_date = DATE(created_at) 
      WHERE start_date IS NULL
    `;

    return NextResponse.json({ 
      message: 'Migration réussie : colonne start_date ajoutée',
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
