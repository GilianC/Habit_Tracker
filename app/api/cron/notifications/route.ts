import { NextResponse } from 'next/server';
import {
  checkLateActivities,
  notifyEventStart,
  notifyEventEnding,
} from '@/app/lib/notification-actions';

// Cette route peut être appelée par un service de cron (comme Vercel Cron)
// Pour la configurer sur Vercel, ajouter dans vercel.json :
// {
//   "crons": [
//     {
//       "path": "/api/cron/notifications",
//       "schedule": "0 20 * * *"
//     }
//   ]
// }

export async function GET(request: Request) {
  try {
    // Vérifier l'authentification (token secret pour sécuriser le cron)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Exécuter les vérifications de notifications
    const results = await Promise.allSettled([
      checkLateActivities(),
      notifyEventStart(),
      notifyEventEnding(),
    ]);

    // Compiler les résultats
    const summary = {
      lateActivities: results[0].status === 'fulfilled' ? results[0].value : { error: 'Erreur' },
      eventStart: results[1].status === 'fulfilled' ? results[1].value : { error: 'Erreur' },
      eventEnding: results[2].status === 'fulfilled' ? results[2].value : { error: 'Erreur' },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Vérifications des notifications terminées',
      summary,
    });
  } catch (error) {
    console.error('Erreur dans le cron de notifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de l\'exécution du cron',
      },
      { status: 500 }
    );
  }
}

// Route POST pour tester manuellement (en développement)
export async function POST(request: Request) {
  // Vérifier qu'on est en développement
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Cette route n\'est disponible qu\'en développement' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { action } = body;

    let result;
    
    switch (action) {
      case 'check-late':
        result = await checkLateActivities();
        break;
      case 'notify-start':
        result = await notifyEventStart();
        break;
      case 'notify-ending':
        result = await notifyEventEnding();
        break;
      case 'all':
        const results = await Promise.all([
          checkLateActivities(),
          notifyEventStart(),
          notifyEventEnding(),
        ]);
        result = {
          lateActivities: results[0],
          eventStart: results[1],
          eventEnding: results[2],
        };
        break;
      default:
        return NextResponse.json(
          { error: 'Action invalide' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Erreur lors du test manuel:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de l\'exécution',
      },
      { status: 500 }
    );
  }
}
