# Architecture: XAI Credit Risk Assessor

This document outlines the high-level architecture of the application.

## System Overview

The application follows a **Self-Contained Full-Stack Architecture** optimized for containerized deployment (e.g., Hugging Face Spaces, AWS App Runner).

1.  **Frontend (Client):**
    *   **Technology:** Next.js 16 (React), Tailwind CSS.
    *   **Build Mode:** Static Export (`output: 'export'`).
    *   **Serving:** Served as static HTML/JS/CSS files directly from the FastAPI backend.
    *   **Responsibilities:** 
        *   Renders the user interface.
        *   Collects applicant data.
        *   Interactive "What-If" Simulation (Client-side state + API polling).

2.  **Backend (API):**
    *   **Technology:** Python 3.10 (FastAPI), Uvicorn.
    *   **Responsibilities:**
        *   **Static File Serving:** Serves the built frontend assets at `/`.
        *   **Model Inference:** `/predict` endpoint.
        *   **Lifespan Management:** Loads XGBoost model and SHAP explainer into memory on startup.

3.  **Data & Model Pipeline:**
    *   **Technology:** XGBoost, SHAP, Pandas.
    *   **Workflow:**
        *   **Synthetic Data Generation:** Uses a Logistic Function (Sigmoid) with calibrated weights to simulate realistic credit risk (market base rate ~1%).
        *   **Training:** Model is trained *during the container build process* to ensure binary compatibility between the training environment and inference environment.

## Deployment Diagram (Hugging Face / Docker)

```mermaid
graph TD
    User[User Browser] -- HTTPS --> HF[Hugging Face Space / Docker Container]
    
    subgraph "Docker Container (Single Process)"
        FastAPI[FastAPI Server]
        Static[Static Frontend Assets (Next.js Build)]
        Model[XGBoost Model (In-Memory)]
        Explainer[SHAP Explainer (In-Memory)]
        
        FastAPI -- Serves --> Static
        FastAPI -- Uses --> Model
        FastAPI -- Uses --> Explainer
    end
    
    User -- GET / --> FastAPI
    User -- POST /predict --> FastAPI
```

## Data Flow (Prediction)

1.  User submits form data.
2.  Frontend maps categorical strings (e.g., "Married") to One-Hot Integers (e.g., `marital_status_married: 1`).
3.  Frontend POSTs JSON to `/predict`.
4.  Backend aligns features with training schema.
5.  XGBoost predicts probability.
6.  SHAP calculates feature contributions.
7.  Backend returns JSON response.

## Data Flow (Simulation)

1.  User drags a slider (e.g., Income).
2.  Frontend updates local state.
3.  Debounced API call to `/predict?include_explanation=false`.
4.  Backend skips SHAP calculation (for speed) and returns only the new probability.
5.  Frontend updates the "Simulated Risk" gauge.