import React, { useState } from 'react';
import api from '../services/api.js';

const defaultValues = {
  attendancePercentage: '',
  studyHoursPerWeek: '',
  previousGrade: '',
  assignmentCompletionRate: '',
  quizAverage: '',
  labPerformance: '',
  internalAssessmentScore: '',
  participationScore: '',
  sleepHours: '',
  stressLevel: '',
  extracurricularLoad: '',
  internetAccessQuality: '',
};

export default function PredictionPage() {
  const [values, setValues] = useState(defaultValues);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Convert empty strings to null for optional fields
      const payload = {};
      Object.keys(values).forEach((key) => {
        const val = values[key];
        payload[key] = val === '' ? null : parseFloat(val);
      });
      const res = await api.post('/predict', payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Predict Risk</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {Object.keys(defaultValues).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor={key}>{key}</label>
            <input
              id={key}
              name={key}
              type="number"
              step="any"
              value={values[key]}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800"
            />
          </div>
        ))}
        <div className="sm:col-span-2 flex justify-start items-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Predicting...' : 'Predict'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {result && (
        <div className="p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded">
          <p className="text-lg">Predicted Risk Level: <span className="font-bold">{result.riskLevel}</span></p>
          <p className="text-sm mt-1">Probability of High Risk: {(result.probability_high * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}
