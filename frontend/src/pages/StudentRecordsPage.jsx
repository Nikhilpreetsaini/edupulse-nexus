import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export default function StudentRecordsPage() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState(() => new Set());

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await api.get('/students');
        setStudents(response.data);
      } catch (err) {
        setError('Failed to load students');
      }
    }
    fetchStudents();
  }, []);

  const toggleWatch = (index) => {
    const newSet = new Set(watchlist);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setWatchlist(newSet);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Students</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Attendance %</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Study Hours</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Prev Grade</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Quiz Avg</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {students.map((stu, idx) => (
              <tr key={idx} className={watchlist.has(idx) ? 'bg-yellow-50 dark:bg-yellow-900' : ''}>
                <td className="px-4 py-2 text-sm">{idx + 1}</td>
                <td className="px-4 py-2 text-sm">{stu.attendancePercentage?.toFixed?.(2) ?? '-'}</td>
                <td className="px-4 py-2 text-sm">{stu.studyHoursPerWeek?.toFixed?.(2) ?? '-'}</td>
                <td className="px-4 py-2 text-sm">{stu.previousGrade?.toFixed?.(2) ?? '-'}</td>
                <td className="px-4 py-2 text-sm">{stu.quizAverage?.toFixed?.(2) ?? '-'}</td>
                <td className="px-4 py-2 text-sm flex space-x-2">
                  <Link
                    to={`/student/${idx}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => toggleWatch(idx)}
                    className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                  >
                    {watchlist.has(idx) ? 'Unwatch' : 'Watch'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
