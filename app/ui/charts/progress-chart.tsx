'use client';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateLevel, getXpForNextLevel } from '@/app/lib/level-system';

interface XpProgressData {
  date: string;
  xp: number;
  level: number;
}

interface ProgressChartProps {
  data?: XpProgressData[];
  currentXp: number;
  currentLevel: number;
}

export default function ProgressChart({ data = [], currentXp, currentLevel }: ProgressChartProps) {
  // Si pas de données historiques, créer un point de données actuel
  const chartData = data.length > 0 ? data : [
    {
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      xp: currentXp,
      level: currentLevel,
    }
  ];

  // Ajouter des informations de niveau pour chaque point
  const enrichedData = chartData.map(point => ({
    ...point,
    xpForNextLevel: getXpForNextLevel(point.level),
    calculatedLevel: calculateLevel(point.xp),
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.date}</p>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            <span className="font-medium">XP:</span> {data.xp}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            <span className="font-medium">Niveau:</span> {data.level}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Prochain niveau:</span> {data.xpForNextLevel} XP
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={enrichedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '14px' }}
            iconType="circle"
          />
          <Area 
            type="monotone" 
            dataKey="xp" 
            stroke="#8b5cf6" 
            fillOpacity={1} 
            fill="url(#colorXp)" 
            name="Points XP"
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="level" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorLevel)" 
            name="Niveau"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
