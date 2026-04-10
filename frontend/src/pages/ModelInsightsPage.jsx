import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function ModelInsightsPage() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await api.get('/model_insights');
        setMetrics(res.data);
      } catch (err) {
        setError('Failed to load model insights');
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Model Insights</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {metrics ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
          <ul className="list-disc pl-5">
            <li>Accuracy: {metrics.accuracy.toFixed(2)}</li>
            <li>Precision: {metrics.precision.toFixed(2)}</li>
            <li>Recall: {metrics.recall.toFixed(2)}</li>
            <li>F1 Score: {metrics.f1.toFixed(2)}</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">The model currently uses a multi‑class logistic regression trained on your uploaded dataset.  In a more advanced version of EduPulse Nexus you could compare multiple models and examine their confusion matrices and feature importances.</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
