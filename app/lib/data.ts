import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
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

// ==================== FONCTIONS POUR HABIT TRACKER ====================

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
export async function fetchUserActivitiesWithTodayStatus(userEmail: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const activities = await sql`
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

    return activities;
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
