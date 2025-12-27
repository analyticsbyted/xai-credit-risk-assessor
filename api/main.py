from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from contextlib import asynccontextmanager
import joblib
import pandas as pd
import numpy as np
import os

# Define Paths
BASE_DIR = os.path.dirname(__file__)
ARTIFACTS_DIR = os.path.join(BASE_DIR, "model_artifacts")
STATIC_DIR = os.path.join(BASE_DIR, "static") # New static directory

MODEL_PATH = os.path.join(ARTIFACTS_DIR, "model.pkl")
EXPLAINER_PATH = os.path.join(ARTIFACTS_DIR, "explainer.pkl")
FEATURE_NAMES_PATH = os.path.join(ARTIFACTS_DIR, "feature_names.pkl")

# Global variables for artifacts
ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load models
    try:
        print("Loading model artifacts...")
        ml_models["model"] = joblib.load(MODEL_PATH)
        ml_models["explainer"] = joblib.load(EXPLAINER_PATH)
        ml_models["feature_names"] = joblib.load(FEATURE_NAMES_PATH)
        print("Model artifacts loaded successfully.")
    except Exception as e:
        print(f"Error loading models: {e}")
    yield
    ml_models.clear()

app = FastAPI(lifespan=lifespan)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoanApplication(BaseModel):
    age: int
    income: int
    loan_amount: int
    credit_score: int
    months_employed: int
    num_credit_lines: int
    interest_rate: float
    loan_term: int
    dti_ratio: float
    education_phd: int = 0
    education_master: int = 0
    education_bachelor: int = 0
    education_highschool: int = 0
    employment_type_fulltime: int = 0
    employment_type_parttime: int = 0
    employment_type_selfemployed: int = 0
    employment_type_unemployed: int = 0
    marital_status_married: int = 0
    marital_status_single: int = 0
    marital_status_divorced: int = 0

@app.post("/predict")
def predict_credit_risk(application: LoanApplication, include_explanation: bool = True):
    if "model" not in ml_models:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Convert input to DataFrame
    input_data = application.model_dump()
    df = pd.DataFrame([input_data])
    
    feature_names = ml_models["feature_names"]
    
    # 1. Add missing columns with 0
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0
            
    # 2. Reorder columns to match training order
    df = df[feature_names]
    
    # Predict
    model = ml_models["model"]
    prediction_cls = model.predict(df)[0]
    probabilities = model.predict_proba(df)[0]
    
    prediction_label = "Denied" if prediction_cls == 1 else "Approved"
    probability_value = float(probabilities[1])
    
    explanation_data = None
    if include_explanation:
        explainer = ml_models["explainer"]
        shap_values = explainer(df)
        
        impacts = []
        for name, val, impact in zip(feature_names, df.iloc[0], shap_values.values[0]):
            impacts.append({
                "feature": name,
                "value": float(val),
                "impact": float(impact)
            })
            
        impacts.sort(key=lambda x: abs(x["impact"]), reverse=True)
        top_feature = impacts[0]["feature"]
        summary = f"The decision was primarily influenced by {top_feature}."
        
        explanation_data = {
            "summary": summary,
            "feature_importance": impacts[:5]
        }
    
    return {
        "prediction": prediction_label,
        "probability": probability_value,
        "explanation": explanation_data
    }

# Serve Static Files (Frontend)
# We mount / to static, but we need to handle the index.html fallback for SPA
if os.path.exists(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")

# If we were using client-side routing that didn't map to files, we'd need a catch-all
# But since Next.js 'export' generates .html files for routes, StaticFiles(html=True) handles most.