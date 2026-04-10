import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import StudentRecordsPage from './pages/StudentRecordsPage.jsx';
import StudentProfilePage from './pages/StudentProfilePage.jsx';
import DatasetPage from './pages/DatasetPage.jsx';
import PredictionPage from './pages/PredictionPage.jsx';
import SimulatorPage from './pages/SimulatorPage.jsx';
import ModelInsightsPage from './pages/ModelInsightsPage.jsx';

// Simple layout with a header and sidebar navigation
function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 hidden sm:block">
        <h2 className="text-2xl font-bold mb-6">EduPulse Nexus</h2>
        <nav className="space-y-2">
          <Link className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700" to="/dashboard">Dashboard</Link>
          <Link className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700" to="/students">Students</Link>
          <Link className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700" to="/dataset">Dataset</Link>
          <Link className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700" to="/predict">Predict</Link>
          <Link className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700" to="/simulate">Simulate</Link>
          <Link className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700" to="/insights">Model Insights</Link>
        </nav>
      </aside>
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/students" element={<Layout><StudentRecordsPage /></Layout>} />
      <Route path="/student/:id" element={<Layout><StudentProfilePage /></Layout>} />
      <Route path="/dataset" element={<Layout><DatasetPage /></Layout>} />
      <Route path="/predict" element={<Layout><PredictionPage /></Layout>} />
      <Route path="/simulate" element={<Layout><SimulatorPage /></Layout>} />
      <Route path="/insights" element={<Layout><ModelInsightsPage /></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
