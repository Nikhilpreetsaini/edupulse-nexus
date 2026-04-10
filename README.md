# EduPulse Nexus

EduPulse Nexus is an AI‑powered academic intelligence platform designed as a minor project.  It combines a FastAPI backend written in Python with a modern React + Vite frontend.  The goal of the project is to illustrate how machine learning can be applied to educational data to identify academically at‑risk students, understand why risk is high or low, and plan interventions.

This repository contains a complete scaffold ready for further development.  The backend exposes REST endpoints to upload a CSV dataset, train a logistic regression model, make risk predictions for individual students and retrieve basic analytics.  The frontend provides a polished single‑page application with multiple pages including a landing page, dashboard, student record list, detailed student profiles, dataset upload, risk prediction form, what‑if simulator and model insights.  Charts and modern UI components are used throughout to convey information clearly.

## Features

- **Dataset upload and training** – Upload a CSV file with a `riskLevel` column to train a multi‑class logistic regression model.  Summary statistics and model metrics are returned.
- **Dashboard** – Visual overview of the dataset including summary cards, feature means chart and risk distribution.
- **Student management** – View and watch individual student records, with a dedicated profile page including automatically generated risk predictions.
- **Prediction form** – Input or adjust academic factors to predict a student's risk level on the fly.
- **Scenario simulator** – Adjust key factors using sliders and compare baseline vs improved predictions.
- **Model insights** – View accuracy, precision, recall and F1 score for the current model.
- **Clean, responsive UI** – Built with Tailwind CSS, React Router and Framer Motion for smooth navigation.

## Getting started

### Prerequisites

To run the project locally you will need Python 3.9+ and Node.js 18+ installed.  The backend uses `FastAPI` and related packages, while the frontend uses `Vite`.

### Installing backend

1. Navigate to the backend folder:

   ```bash
   cd edupulse_nexus/backend
   ```

2. Create a virtual environment and install dependencies:

   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:

   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`.

### Installing frontend

1. Navigate to the frontend folder:

   ```bash
   cd edupulse_nexus/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be served at `http://localhost:3000`.  It assumes the API is running on `http://localhost:8000`.

## Usage

1. Navigate to the landing page and click “Enter Dashboard” to get started.
2. Upload a dataset under the “Dataset” page.  The dataset must include a column named `riskLevel` with categorical labels (`Low`, `Medium`, `High`) and numeric feature columns such as `attendancePercentage`, `studyHoursPerWeek`, etc.
3. Once uploaded, the dashboard and other pages will populate with analytics.  Use the Students page to browse records and the Predict page to test new inputs.
4. The What‑If Simulator page lets you adjust key factors and compare baseline vs improved risk outcomes.

## Limitations & future work

This scaffold demonstrates the core ideas behind EduPulse Nexus but does not yet implement all advanced features described in the high‑level specification.  Future improvements might include:

- Storing datasets and predictions in a real database (e.g., MongoDB) instead of in‑memory variables.
- Additional machine learning models and a full model comparison view.
- More robust data quality checks and derived feature computations.
- A watchlist and intervention queue across sessions.
- Richer cohort analytics, heatmaps and derived scores such as momentum, stability, recovery potential, etc.
- User authentication and session persistence across the frontend and backend.

## License

This project is provided for educational purposes only and carries no warranty.  Feel free to modify and extend it to meet your needs.
