import React, { useState } from 'react';
import api from '../services/api.js';

const INITIAL_VALUES = {
  attendancePercentage: 70,
  studyHoursPerWeek: 10,
  previousGrade: 70,
  assignmentCompletionRate: 70,
  quizAverage: 70,
  labPerformance: 70,
  internalAssessmentScore: 70,
  participationScore: 70,
  sleepHours: 7,
  stressLevel: 5,
  extracurricularLoad: 3,
  internetAccessQuality: 8,
};

export default function SimulatorPage() {
  const [baseline, setBaseline] = useState(INITIAL_VALUES);
  const [scenario, setScenario] = useState(INITIAL_VALUES);
  const [baselineRisk, setBaselineRisk] = useState(null);
  const [scenarioRisk, setScenarioRisk] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSlider = (e) => {
    const { name, value } = e.target;
    setScenario((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const computeRisks = async () => {
    setLoading(true);
    try {
      const [baseRes, scenRes] = await Promise.all([
        api.post('/predict', baseline),
        api.post('/predict', scenario),
      ]);
      setBaselineRisk(baseRes.data);
      setScenarioRisk(scenRes.data);
    } catch {
      // ignore errors for now
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">What‑If Simulator</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Adjust key factors to see how the risk level changes.</p>
      <div className="space-y-4 mb-6">
        {['attendancePercentage','studyHoursPerWeek','assignmentCompletionRate','quizAverage','internalAssessmentScore'].map((name) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor={name}>{name}</label>
            <input
              id={name}
              name={name}
              type="range"
              min="0"
              max="100"
              step="1"
              value={scenario[name]}
              onChange={handleSlider}
              className="w-full"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">{scenario[name]}</p>
          </div>
        ))}
      </div>
      <button
        onClick={computeRisks}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
        disabled={loading}
      >
        {loading ? 'Calculating...' : 'Compute'}
      </button>
      {baselineRisk && scenarioRisk && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
            <h4 className="font-semibold mb-2">Baseline Scenario</h4>
            <p>Risk Level: <strong>{baselineRisk.riskLevel}</strong></p>
            <p className="text-sm">High Risk Probability: {(baselineRisk.probability_high * 100).toFixed(2)}%</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
            <h4 className="font-semibold mb-2">Improved Scenario</h4>
            <p>Risk Level: <strong>{scenarioRisk.riskLevel}</strong></p>
            <p className="text-sm">High Risk Probability: {(scenarioRisk.probability_high * 100).toFixed(2)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
