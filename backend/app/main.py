"""
EduPulse Nexus Backend

This FastAPI application exposes a minimal set of APIs for the EduPulse Nexus
platform.  It demonstrates how to upload a dataset, train a simple machine
learning model, perform predictions and serve basic analytics to a front‑end.

The code is intentionally simplified to remain robust when run inside
ChatGPT's agent mode.  It avoids complex integrations and heavy external
dependencies while still showing how you could build out the full system.

Endpoints:
    POST /upload_dataset  – Accept a CSV file and train the model.
    GET  /students        – List all student records currently loaded.
    POST /predict         – Predict risk for a single student record.
    GET  /statistics      – Provide basic aggregate statistics over the dataset.
    GET  /model_insights  – Return simple model performance metrics.

To run this server locally:

    uvicorn app.main:app --reload

This will start the API on http://localhost:8000.  See README.md in the
repository root for more details on how to integrate with the frontend.
"""

from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import io


app = FastAPI(title="EduPulse Nexus API", description="Backend for the EduPulse Nexus platform")

# Allow requests from any origin for development; adjust in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global variables to store loaded dataset and trained model.
DATASET: Optional[pd.DataFrame] = None
MODEL: Optional[LogisticRegression] = None
FEATURE_COLUMNS: List[str] = []


class StudentFeatures(BaseModel):
    """Pydantic model representing student input features for prediction."""

    attendancePercentage: float
    studyHoursPerWeek: float
    previousGrade: float
    assignmentCompletionRate: float
    quizAverage: float
    labPerformance: float
    internalAssessmentScore: float
    participationScore: float
    sleepHours: float
    stressLevel: float
    extracurricularLoad: float
    internetAccessQuality: Optional[float] = None  # optional

    def to_dataframe(self) -> pd.DataFrame:
        """Convert the features into a single‑row DataFrame in the order of FEATURE_COLUMNS."""
        data = self.dict()
        # Some features might be optional (None). Replace None with NaN which model can handle
        for key, value in data.items():
            if value is None:
                data[key] = np.nan
        return pd.DataFrame([data])


def train_model(df: pd.DataFrame) -> None:
    """Train a logistic regression model on the provided dataset.

    The target column should be named 'riskLevel' and contain labels such as
    'Low', 'Medium' and 'High'.  All other numeric columns are used as
    features.  The trained model and feature columns are stored in the module
    globals for later predictions.
    """
    global MODEL, FEATURE_COLUMNS, DATASET

    # Drop rows with missing target
    df = df.dropna(subset=["riskLevel"])

    # Identify feature columns (all except target and non-numeric)
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if "riskLevel" in numeric_cols:
        numeric_cols.remove("riskLevel")

    FEATURE_COLUMNS = numeric_cols

    if not FEATURE_COLUMNS:
        raise ValueError("No numeric feature columns found in the dataset.")

    # Create X and y
    X = df[FEATURE_COLUMNS]
    y = df["riskLevel"]

    # Split dataset for evaluation
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Encode target labels into integers
    y_train_encoded = y_train.map({"Low": 0, "Medium": 1, "High": 2}).values
    y_test_encoded = y_test.map({"Low": 0, "Medium": 1, "High": 2}).values

    # Train logistic regression
    # In some versions of scikit‑learn the multi_class parameter may not be accepted.
    # The default solver can handle multinomial classification for more than two classes.
    model = LogisticRegression(max_iter=200)
    model.fit(X_train, y_train_encoded)

    # Evaluate model
    y_pred = model.predict(X_test)
    app.state.model_metrics = {
        "accuracy": float(accuracy_score(y_test_encoded, y_pred)),
        "precision": float(precision_score(y_test_encoded, y_pred, average="weighted", zero_division=0)),
        "recall": float(recall_score(y_test_encoded, y_pred, average="weighted", zero_division=0)),
        "f1": float(f1_score(y_test_encoded, y_pred, average="weighted", zero_division=0)),
    }

    # Store global state
    MODEL = model
    DATASET = df

    # Save the model to disk for persistence
    joblib.dump({"model": MODEL, "feature_columns": FEATURE_COLUMNS}, "/home/oai/share/edupulse_model.joblib")


def categorize_prediction(prob: float) -> str:
    """Convert a probability to risk category.

    Uses simple thresholds: <0.33 → Low, <0.66 → Medium, otherwise High.
    """
    if prob < 0.33:
        return "Low"
    if prob < 0.66:
        return "Medium"
    return "High"


@app.post("/upload_dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload a CSV dataset and train the model.

    The CSV must contain a column named 'riskLevel' with categorical labels.
    Returns summary statistics and model performance.
    """
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to read CSV file")

    if "riskLevel" not in df.columns:
        raise HTTPException(status_code=400, detail="Dataset must contain a 'riskLevel' column")

    # Train model and store dataset
    try:
        train_model(df)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Compute simple stats for summary (e.g., number of records)
    stats = {
        "records": int(len(df)),
        "columns": list(df.columns),
        "feature_columns": FEATURE_COLUMNS,
        "target_distribution": df["riskLevel"].value_counts().to_dict(),
        "model_metrics": app.state.model_metrics,
    }
    return stats


@app.get("/students")
async def get_students():
    """Return all student records currently in memory.

    The dataset is loaded from the last uploaded file.  This endpoint returns
    the records as a list of dicts, excluding the 'riskLevel' target column.
    """
    if DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset loaded")
    # Remove target column to avoid leaking original risk
    df_no_target = DATASET.drop(columns=["riskLevel"], errors="ignore")
    return df_no_target.to_dict(orient="records")


@app.post("/predict")
async def predict_risk(features: StudentFeatures):
    """Predict risk for a single student feature set.

    Returns the probability for the high-risk class and the categorical risk level.
    """
    if MODEL is None or not FEATURE_COLUMNS:
        raise HTTPException(status_code=400, detail="Model has not been trained yet. Please upload a dataset first.")

    # Convert input features to DataFrame
    df_in = features.to_dataframe()

    # Reorder columns to match training features; fill missing columns with NaN
    for col in FEATURE_COLUMNS:
        if col not in df_in.columns:
            df_in[col] = np.nan
    df_in = df_in[FEATURE_COLUMNS]

    # Simple imputation: replace NaN with column means from dataset
    imputed = df_in.copy()
    for col in FEATURE_COLUMNS:
        if imputed[col].isna().any():
            col_mean = DATASET[col].mean() if DATASET is not None else 0.0
            imputed[col].fillna(col_mean, inplace=True)

    # Predict probabilities for each class and take the highest probability class (High risk is class 2)
    probs = MODEL.predict_proba(imputed)[0]
    # Probability for 'High' is index 2 (Low=0, Medium=1, High=2)
    prob_high = float(probs[2])
    risk_level = categorize_prediction(prob_high)
    return {"probability_high": prob_high, "riskLevel": risk_level}


@app.get("/statistics")
async def get_statistics():
    """Return basic aggregate statistics about the dataset.

    Includes the number of records, numeric column means and standard deviations.
    """
    if DATASET is None:
        raise HTTPException(status_code=404, detail="No dataset loaded")
    summary = {
        "records": int(len(DATASET)),
        "numeric_means": DATASET[FEATURE_COLUMNS].mean().to_dict(),
        "numeric_stddev": DATASET[FEATURE_COLUMNS].std().to_dict(),
        "target_distribution": DATASET["riskLevel"].value_counts().to_dict(),
    }
    return summary


@app.get("/model_insights")
async def model_insights():
    """Return simple model performance metrics recorded during the last training."""
    if not hasattr(app.state, "model_metrics"):
        raise HTTPException(status_code=404, detail="Model metrics not available")
    return app.state.model_metrics
