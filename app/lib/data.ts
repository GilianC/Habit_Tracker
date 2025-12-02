import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  Activity,
  Challenge,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
const data = await sql<LatestInvoiceRaw[]>`
  SELECT invoices.id, invoices.amount, customers.name, customers.image_url, customers.email
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
  ORDER BY invoices.date DESC
  LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);
    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  if (!id) {
    throw new Error('Invoice ID is required');
  }

  try {
    const data = await sql<InvoiceForm[]>`
    SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: Number(invoice.amount) / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
      SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

// ==================== FONCTIONS POUR HABITFLOW ====================

// Récupérer toutes les activités d'un utilisateur
export async function fetchUserActivities(userEmail: string) {
  try {
    const activities = await sql`
      SELECT 
        a.id,
        a.name,
        a.frequency,
        a.color,
        a.icon,
        a.created_at,
        COUNT(DISTINCT al.id) FILTER (WHERE al.is_done = true) as completed_count,
        COUNT(DISTINCT al.id) as total_logs
      FROM activities a
      INNER JOIN users u ON a.user_id = u.id
      LEFT JOIN activity_logs al ON a.id = al.activity_id
      WHERE u.email = ${userEmail}
      GROUP BY a.id, a.name, a.frequency, a.color, a.icon, a.created_at
      ORDER BY a.created_at DESC
    `;

    return activities;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des activités:', error);
    throw new Error('Impossible de récupérer les activités');
  }
}

// Récupérer les activités avec leur statut du jour
export async function fetchUserActivitiesWithTodayStatus(userEmail: string): Promise<Activity[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await sql`
      SELECT 
        a.id,
        a.name,
        a.frequency,
        a.color,
        a.icon,
        a.created_at,
        al.is_done as completed_today,
        (
          SELECT COUNT(DISTINCT date) 
          FROM activity_logs 
          WHERE activity_id = a.id AND is_done = true
          AND date >= (CURRENT_DATE - INTERVAL '7 days')
        ) as streak
      FROM activities a
      INNER JOIN users u ON a.user_id = u.id
      LEFT JOIN activity_logs al ON a.id = al.activity_id AND al.date = ${today}
      WHERE u.email = ${userEmail}
      ORDER BY a.created_at DESC
    `;

    return result as unknown as Activity[];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des activités:', error);
    throw new Error('Impossible de récupérer les activités');
  }
}

// Récupérer les statistiques du dashboard
export async function fetchDashboardStats(userEmail: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const stats = await sql`
      SELECT 
        COUNT(DISTINCT a.id) as total_activities,
        COUNT(DISTINCT al.id) FILTER (WHERE al.date = ${today} AND al.is_done = true) as completed_today,
        COUNT(DISTINCT al.id) FILTER (WHERE al.date >= ${weekStartStr} AND al.is_done = true) as completed_this_week,
        COUNT(DISTINCT a.id) FILTER (WHERE a.frequency = 'daily') as daily_activities
      FROM activities a
      INNER JOIN users u ON a.user_id = u.id
      LEFT JOIN activity_logs al ON a.id = al.activity_id
      WHERE u.email = ${userEmail}
    `;

    return stats[0] || {
      total_activities: 0,
      completed_today: 0,
      completed_this_week: 0,
      daily_activities: 0
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats:', error);
    throw new Error('Impossible de récupérer les statistiques');
  }
}

// Récupérer les détails d'une activité avec ses statistiques
export async function fetchActivityDetails(activityId: string, userEmail: string) {
  try {
    const activity = await sql`
      SELECT 
        a.*,
        (
          SELECT COUNT(*)
          FROM activity_logs
          WHERE activity_id = a.id AND is_done = true
        ) as total_completions,
        (
          SELECT MAX(date)
          FROM activity_logs
          WHERE activity_id = a.id AND is_done = true
        ) as last_completed,
        (
          SELECT is_done
          FROM activity_logs
          WHERE activity_id = a.id 
          AND date = CURRENT_DATE
        ) as completed_today
      FROM activities a
      INNER JOIN users u ON a.user_id = u.id
      WHERE a.id = ${activityId}
      AND u.email = ${userEmail}
    `;

    return activity[0] || null;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'activité:', error);
    throw new Error('Impossible de récupérer l\'activité');
  }
}

// Récupérer l'historique des 7 derniers jours d'une activité
export async function fetchActivityHistory(activityId: string, userEmail: string) {
  try {
    const history = await sql`
      WITH RECURSIVE dates AS (
        SELECT CURRENT_DATE - INTERVAL '6 days' as date
        UNION ALL
        SELECT date + INTERVAL '1 day'
        FROM dates
        WHERE date < CURRENT_DATE
      )
      SELECT 
        dates.date::date,
        COALESCE(al.is_done, false) as completed
      FROM dates
      LEFT JOIN activity_logs al ON 
        al.date = dates.date::date
        AND al.activity_id = ${activityId}
        AND EXISTS (
          SELECT 1 FROM activities a
          INNER JOIN users u ON a.user_id = u.id
          WHERE a.id = ${activityId}
          AND u.email = ${userEmail}
        )
      ORDER BY dates.date DESC
    `;
    
    return history;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'historique:', error);
    throw new Error('Impossible de récupérer l\'historique');
  }
}

// Récupérer toutes les activités de l'utilisateur avec leurs logs pour le calendrier
export async function fetchUserActivitiesForCalendar(userEmail: string) {
  try {
    const result = await sql`
      SELECT 
        a.id,
        a.name,
        a.color,
        a.icon,
        a.frequency,
        a.start_date,
        COALESCE(
          json_agg(
            json_build_object(
              'date', al.date,
              'is_done', al.is_done
            )
            ORDER BY al.date DESC
          ) FILTER (WHERE al.date IS NOT NULL),
          '[]'::json
        ) as logs
      FROM activities a
      INNER JOIN users u ON a.user_id = u.id
      LEFT JOIN activity_logs al ON a.id = al.activity_id
      WHERE u.email = ${userEmail}
      GROUP BY a.id, a.name, a.color, a.icon, a.frequency, a.start_date
      ORDER BY a.created_at DESC
    `;

    // Transformer le résultat pour correspondre au type attendu
    return result.map(row => ({
      id: String(row.id),
      name: row.name as string,
      color: row.color as string,
      icon: row.icon as string,
      frequency: row.frequency as string,
      start_date: row.start_date as string,
      logs: (row.logs as Array<{ date: string; is_done: boolean }>) || []
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des activités pour le calendrier:', error);
    throw new Error('Impossible de récupérer les activités pour le calendrier');
  }
}

// Récupérer le nombre d'étoiles de l'utilisateur
export async function fetchUserStars(userEmail: string) {
  try {
    const result = await sql`
      SELECT stars
      FROM users
      WHERE email = ${userEmail}
    `;

    return result[0]?.stars || 0;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des étoiles:', error);
    return 0;
  }
}

// Récupérer tous les défis disponibles (prédéfinis)
export async function fetchAllChallenges() {
  try {
    const result = await sql`
      SELECT 
        id, name, description, goal_type, goal_value, 
        star_reward, difficulty, icon, category, is_active
      FROM challenges
      WHERE is_active = true
      ORDER BY 
        CASE difficulty
          WHEN 'easy' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'hard' THEN 3
        END,
        star_reward ASC
    `;

    return result.map(row => ({
      id: String(row.id),
      name: row.name as string,
      description: row.description as string,
      goal_type: row.goal_type as string,
      goal_value: Number(row.goal_value),
      star_reward: Number(row.star_reward),
      difficulty: row.difficulty as string,
      icon: row.icon as string,
      category: row.category as string,
      is_active: row.is_active as boolean
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des défis:', error);
    throw new Error('Impossible de récupérer les défis');
  }
}

// Récupérer les défis de l'utilisateur (acceptés/complétés)
export async function fetchUserChallenges(userEmail: string): Promise<Challenge[]> {
  try {
    const result = await sql`
      SELECT 
        uc.id as user_challenge_id,
        uc.status,
        uc.progress,
        uc.start_date,
        uc.end_date,
        uc.completed_at,
        c.id as challenge_id,
        c.name,
        c.description,
        c.goal_type,
        c.goal_value,
        c.star_reward,
        c.difficulty,
        c.icon,
        c.category
      FROM user_challenges uc
      INNER JOIN users u ON uc.user_id = u.id
      INNER JOIN challenges c ON uc.challenge_id = c.id
      WHERE u.email = ${userEmail}
      ORDER BY 
        CASE uc.status
          WHEN 'in_progress' THEN 1
          WHEN 'completed' THEN 2
          WHEN 'failed' THEN 3
        END,
        uc.created_at DESC
    `;

    return result.map(row => ({
      id: String(row.user_challenge_id),
      user_challenge_id: String(row.user_challenge_id),
      challenge_id: String(row.challenge_id),
      name: row.name as string,
      description: row.description as string,
      goal_type: row.goal_type as string,
      goal_value: Number(row.goal_value),
      goal_days: undefined,
      star_reward: Number(row.star_reward),
      difficulty: row.difficulty as string,
      icon: row.icon as string,
      category: row.category as string,
      status: row.status as string,
      progress: Number(row.progress),
      start_date: row.start_date as string,
      end_date: row.end_date as string,
      completed_at: row.completed_at as string,
      activity_name: undefined,
      activity_icon: undefined,
      activity_color: undefined,
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des défis utilisateur:', error);
    throw new Error('Impossible de récupérer les défis utilisateur');
  }
}

// Récupérer tous les badges disponibles
export async function fetchAllBadges() {
  try {
    const result = await sql`
      SELECT 
        id, title, description, icon, star_cost, rarity, category, created_at
      FROM badges
      ORDER BY star_cost ASC, created_at ASC
    `;

    return result.map(row => ({
      id: String(row.id),
      title: row.title as string,
      description: row.description as string,
      icon: row.icon as string,
      star_cost: Number(row.star_cost),
      rarity: row.rarity as string,
      category: row.category as string,
      created_at: row.created_at as string
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des badges:', error);
    throw new Error('Impossible de récupérer les badges');
  }
}

// Récupérer les badges débloqués par l'utilisateur
export async function fetchUserBadges(userEmail: string) {
  try {
    const result = await sql`
      SELECT 
        ub.badge_id,
        ub.unlocked_at,
        b.title,
        b.icon,
        b.star_cost,
        b.rarity
      FROM user_badges ub
      INNER JOIN users u ON ub.user_id = u.id
      INNER JOIN badges b ON ub.badge_id = b.id
      WHERE u.email = ${userEmail}
      ORDER BY ub.unlocked_at DESC
    `;

    return result.map(row => ({
      badge_id: String(row.badge_id),
      unlocked_at: row.unlocked_at as string,
      title: row.title as string,
      icon: row.icon as string,
      star_cost: Number(row.star_cost),
      rarity: row.rarity as string
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des badges utilisateur:', error);
    throw new Error('Impossible de récupérer les badges utilisateur');
  }
}

// ============================================
// DÉFIS JOURNALIERS
// ============================================

// Récupérer ou créer les défis journaliers pour aujourd'hui
export async function fetchTodayDailyChallenges(userEmail: string) {
  try {
    // Récupérer l'ID de l'utilisateur
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `;
    
    if (userResult.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const userId = userResult[0].id;
    const today = new Date().toISOString().split('T')[0];

    // Vérifier si les défis existent pour aujourd'hui
    let challenges = await sql`
      SELECT * FROM daily_challenges
      WHERE user_id = ${userId} AND challenge_date = ${today}
    `;

    // Si pas de défis pour aujourd'hui, les créer
    if (challenges.length === 0) {
      await sql`
        INSERT INTO daily_challenges (user_id, challenge_date)
        VALUES (${userId}, ${today})
      `;

      challenges = await sql`
        SELECT * FROM daily_challenges
        WHERE user_id = ${userId} AND challenge_date = ${today}
      `;
    }

    const challenge = challenges[0];

    return {
      id: String(challenge.id),
      date: challenge.challenge_date,
      challenges: [
        {
          id: 'activities',
          title: 'Complète 3 activités',
          description: 'Complète 3 activités aujourd\'hui',
          icon: '🎯',
          progress: Number(challenge.activities_completed),
          target: Number(challenge.activities_target),
          reward: Number(challenge.activities_reward),
          claimed: Boolean(challenge.activities_claimed),
          category: 'any'
        },
        {
          id: 'sport',
          title: 'Fais du sport',
          description: 'Complète 1 activité de sport',
          icon: '🏃‍♂️',
          progress: Number(challenge.sport_completed),
          target: Number(challenge.sport_target),
          reward: Number(challenge.sport_reward),
          claimed: Boolean(challenge.sport_claimed),
          category: 'sport'
        },
        {
          id: 'health',
          title: 'Prends soin de ta santé',
          description: 'Complète 1 activité de santé',
          icon: '💊',
          progress: Number(challenge.health_completed),
          target: Number(challenge.health_target),
          reward: Number(challenge.health_reward),
          claimed: Boolean(challenge.health_claimed),
          category: 'health'
        }
      ]
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des défis journaliers:', error);
    throw new Error('Impossible de récupérer les défis journaliers');
  }
}

// Récupérer les informations de level et XP de l'utilisateur
export async function fetchUserLevelInfo(userEmail: string) {
  try {
    const result = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.stars,
        u.xp,
        u.level,
        (SELECT COUNT(*) FROM user_badges WHERE user_id = u.id) as total_badges
      FROM users u
      WHERE u.email = ${userEmail}
    `;

    if (result.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const user = result[0];
    
    return {
      id: String(user.id),
      name: user.name,
      email: user.email,
      stars: Number(user.stars) || 0,
      xp: Number(user.xp) || 0,
      level: Number(user.level) || 1,
      totalBadges: Number(user.total_badges) || 0
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des infos de level:', error);
    throw new Error('Impossible de récupérer les informations de level');
  }
}

// Récupérer les données de progression XP/niveau pour les graphiques
export async function fetchXpProgressData(userEmail: string, days: number = 30) {
  try {
    // Pour l'instant, on retourne juste le point actuel
    // Plus tard, on pourra ajouter une table xp_history pour tracker l'historique
    const userInfo = await fetchUserLevelInfo(userEmail);
    
    // Simuler quelques points pour démonstration
    // TODO: Créer une table xp_history pour stocker l'historique réel
    const today = new Date();
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simuler une progression (à remplacer par vraies données)
      const progress = (days - i) / days;
      data.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        xp: Math.floor(userInfo.xp * progress),
        level: Math.max(1, Math.floor(userInfo.level * progress)),
      });
    }
    
    return data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données XP:', error);
    return [];
  }
}

// Récupérer le nombre d'activités complétées par jour
export async function fetchActivityCompletionData(userEmail: string, days: number = 7) {
  try {
    const user = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `;
    
    if (user.length === 0) {
      return [];
    }
    
    const userId = user[0].id;
    
    // Récupérer les logs des X derniers jours
    const result = await sql`
      SELECT 
        DATE(completed_at) as date,
        COUNT(*) as count
      FROM activity_logs
      WHERE user_id = ${userId}
        AND completed_at >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(completed_at)
      ORDER BY date ASC
    `;
    
    // Créer un tableau de tous les jours avec 0 par défaut
    const today = new Date();
    const dataMap = new Map();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
      const fullDayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      
      dataMap.set(dateStr, {
        date: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        day: fullDayName.charAt(0).toUpperCase() + fullDayName.slice(1),
        count: 0,
      });
    }
    
    // Remplir avec les vraies données
    result.forEach((row: Record<string, unknown>) => {
      const dateStr = new Date(row.date as Date).toISOString().split('T')[0];
      if (dataMap.has(dateStr)) {
        dataMap.get(dateStr)!.count = Number(row.count);
      }
    });
    
    return Array.from(dataMap.values());
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données d\'activités:', error);
    return [];
  }
}

// Récupérer toutes les activités avec des images pour la galerie
export async function fetchActivitiesWithImages(userEmail: string) {
  try {
    const user = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `;
    
    if (user.length === 0) {
      return [];
    }
    
    const userId = user[0].id;
    
    const result = await sql`
      SELECT 
        id,
        name,
        image_url,
        icon,
        color,
        category,
        created_at
      FROM activities
      WHERE user_id = ${userId}
        AND image_url IS NOT NULL
        AND image_url != ''
      ORDER BY created_at DESC
    `;
    
    return result.map((activity: Record<string, unknown>) => ({
      id: String(activity.id),
      name: activity.name as string,
      imageUrl: activity.image_url as string,
      icon: activity.icon as string,
      color: activity.color as string,
      category: activity.category as string,
      createdAt: activity.created_at as Date,
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des activités avec images:', error);
    return [];
  }
}

// Récupérer les défis personnalisés de l'utilisateur
export async function fetchCustomChallenges(userEmail: string) {
  try {
    const user = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `;
    
    if (user.length === 0) {
      return [];
    }
    
    const userId = user[0].id;
    
    const result = await sql`
      SELECT 
        id,
        title,
        description,
        target_value,
        current_value,
        unit,
        star_reward,
        icon,
        color,
        difficulty,
        is_completed,
        completed_at,
        expires_at,
        created_at
      FROM custom_challenges
      WHERE user_id = ${userId}
      ORDER BY is_completed ASC, created_at DESC
    `;
    
    return result.map((challenge: Record<string, unknown>) => ({
      id: Number(challenge.id),
      title: challenge.title as string,
      description: (challenge.description as string) || '',
      targetValue: Number(challenge.target_value),
      currentValue: Number(challenge.current_value),
      unit: challenge.unit as string,
      starReward: Number(challenge.star_reward),
      icon: challenge.icon as string,
      color: challenge.color as string,
      difficulty: challenge.difficulty,
      isCompleted: challenge.is_completed,
      completedAt: challenge.completed_at,
      expiresAt: challenge.expires_at,
      createdAt: challenge.created_at,
      progressPercent: Math.round((Number(challenge.current_value) / Number(challenge.target_value)) * 100),
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des défis personnalisés:', error);
    return [];
  }
}
