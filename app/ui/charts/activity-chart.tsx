'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface ActivityData {
  date: string;
  count: number;
  day: string;
}

interface ActivityChartProps {
  data: ActivityData[];
  period?: 'week' | 'month';
}

const COLORS = {
  primary: '#10b981',
  secondary: '#14b8a6',
  accent: '#06b6d4',
  highlight: '#f97316',
};

export default function ActivityChart({ data, period = 'week' }: ActivityChartProps) {
  // Si pas de données, créer des données vides pour les 7 derniers jours
  const defaultData = period === 'week' ? [
    { date: 'Lun', count: 0, day: 'Lundi' },
    { date: 'Mar', count: 0, day: 'Mardi' },
    { date: 'Mer', count: 0, day: 'Mercredi' },
    { date: 'Jeu', count: 0, day: 'Jeudi' },
    { date: 'Ven', count: 0, day: 'Vendredi' },
    { date: 'Sam', count: 0, day: 'Samedi' },
    { date: 'Dim', count: 0, day: 'Dimanche' },
  ] : [];

  const chartData = data.length > 0 ? data : defaultData;

  // Trouver la valeur maximale pour colorer les barres
  const maxValue = Math.max(...chartData.map(d => d.count), 1);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{data.day || data.date}</p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            <span className="font-medium">{data.count}</span> {data.count > 1 ? 'activités' : 'activité'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Fonction pour déterminer la couleur selon la valeur
  const getBarColor = (count: number) => {
    const ratio = count / maxValue;
    if (ratio >= 0.8) return COLORS.highlight; // Top 20%
    if (ratio >= 0.5) return COLORS.primary;   // 50-80%
    if (ratio >= 0.2) return COLORS.secondary; // 20-50%
    return COLORS.accent;                      // < 20%
  };

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '14px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="count" 
            name="Activités complétées"
            radius={[8, 8, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.count)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
