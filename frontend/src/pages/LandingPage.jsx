import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 text-center">
      <h1 className="text-4xl sm:text-6xl font-bold mb-4">Welcome to EduPulse Nexus</h1>
      <p className="max-w-2xl text-lg sm:text-xl mb-8 text-gray-700 dark:text-gray-300">
        An AI‑powered academic intelligence platform to detect at‑risk students, analyze performance factors, explain risk drivers and plan effective interventions.  Crafted as a polished minor project using FastAPI and React.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Enter Dashboard
      </Link>
    </div>
  );
}
