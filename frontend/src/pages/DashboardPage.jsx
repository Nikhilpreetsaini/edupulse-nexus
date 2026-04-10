import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
      const response = await api.get('/statistics');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load statistics');
      }
    }
    fetchStats();
  }, []);

  const renderCards = () => {
    if (!stats) return null;
    const cards = [
      { title: 'Total Students', value: stats.records },
      { title: 'Low Risk', value: stats.target_distribution?.Low ?? 0 },
      { title: 'Medium Risk', value: stats.target_distribution?.Medium ?? 0 },
      { title: 'High Risk', value: stats.target_distribution?.High ?? 0 },
    ];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    if (!stats) return null;
    // Convert numeric means into chart data
    const data = Object.keys(stats.numeric_means || {}).map((key) => ({
      name: key,
      mean: stats.numeric_means[key],
    }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
          <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
          <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '0.5rem' }} />
          <Bar dataKey="mean" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {renderCards()}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow">
        <h3 className="text-lg font-semibold mb-2">Feature Means</h3>
        {renderChart()}
      </div>
    </div>
  );
}
