import React, { useState } from 'react';
import api from '../services/api.js';

export default function DatasetPage() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload_dataset', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSummary(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload dataset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Dataset Upload</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block mb-2"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={!file || loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {summary && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Dataset Summary</h3>
          <p className="mb-1"><strong>Records:</strong> {summary.records}</p>
          <p className="mb-1"><strong>Columns:</strong> {summary.columns.join(', ')}</p>
          <p className="mb-1"><strong>Feature Columns:</strong> {summary.feature_columns.join(', ')}</p>
          <p className="mb-1"><strong>Risk Distribution:</strong> {Object.entries(summary.target_distribution).map(([k,v]) => `${k}: ${v}`).join(', ')}</p>
          <p className="mb-1"><strong>Model Metrics:</strong> {Object.entries(summary.model_metrics).map(([k,v]) => `${k}: ${v.toFixed(2)}`).join(', ')}</p>
        </div>
      )}
    </div>
  );
}
