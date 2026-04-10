import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';

export default function StudentProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [risk, setRisk] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await api.get('/students');
        const idx = parseInt(id, 10);
        if (!Number.isNaN(idx) && res.data[idx]) {
          setStudent(res.data[idx]);
          // Make prediction for this student
          const predRes = await api.post('/predict', res.data[idx]);
          setRisk(predRes.data);
        } else {
          setError('Student not found');
        }
      } catch (err) {
        setError('Failed to load student');
      }
    }
    fetchStudent();
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!student) {
    return <p>Loading...</p>;
  }

  const keys = Object.keys(student);
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Student Profile</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {keys.map((key) => (
          <div key={key} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{key}</h4>
            <p className="text-lg font-semibold">{student[key] ?? '-'}</p>
          </div>
        ))}
      </div>
      {risk && (
        <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900 rounded border border-blue-300 dark:border-blue-700">
          <p className="text-lg font-medium">Predicted Risk Level: <span className="font-bold">{risk.riskLevel}</span></p>
          <p className="mt-2 text-sm">Probability of High Risk: {(risk.probability_high * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}
