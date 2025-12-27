# Architecture: XAI Credit Risk Assessor

This document outlines the high-level architecture of the application.

## System Overview

The application follows a decoupled client-server architecture:

1.  **Frontend (Client):**
    *   **Technology:** Next.js (React), Tailwind CSS.
    *   **Hosting:** AWS S3 + CloudFront (Static Website Hosting).
    *   **Responsibilities:** 
        *   Renders the user interface.
        *   Collects applicant data via a form.
        *   Sends requests to the Backend API.
        *   Visualizes the response (Prediction & SHAP values) using Recharts.

2.  **Backend (API):**
    *   **Technology:** Python (FastAPI), Uvicorn.
    *   **Hosting:** Docker Container (AWS App Runner / ECS).
    *   **Responsibilities:**
        *   Loads pre-trained Machine Learning models (XGBoost, SHAP Explainer) into memory at startup.
        *   Validates incoming request data using Pydantic.
        *   Performs data preprocessing (alignment with model features).
        *   Executes model inference (Prediction) and explanation (SHAP).
        *   Returns JSON response.

3.  **Data & Model Pipeline:**
    *   **Technology:** Jupyter Notebooks, Pandas, Scikit-Learn, XGBoost, SHAP.
    *   **Workflow:**
        *   Data Ingestion (CSV).
        *   Preprocessing (One-Hot Encoding, Handling Missing Values).
        *   Model Training (XGBoost).
        *   Explainer Generation (TreeExplainer).
        *   Artifact Serialization (`.pkl` files) to be consumed by the API.

## Diagram

```mermaid
graph LR
    User[User Browser] -- HTTPS --> CloudFront[AWS CloudFront]
    CloudFront -- Serves Static Assets --> S3[AWS S3 Bucket (Frontend)]
    User -- JSON/API Calls --> API[FastAPI Backend (AWS App Runner)]
    
    subgraph Backend Container
        API -- Load --> Model[XGBoost Model]
        API -- Load --> Explainer[SHAP Explainer]
    end
    
    subgraph Offline Training
        RawData[(CSV Data)] --> Notebook[Jupyter Notebook]
        Notebook --> Model
        Notebook --> Explainer
    end
```

## Data Flow

1.  User submits form data (Age, Income, etc.).
2.  Frontend constructs JSON payload and POSTs to `/predict`.
3.  Backend receives payload, converts to DataFrame.
4.  Backend ensures columns match training features (filling missing, reordering).
5.  Model predicts default probability.
6.  Explainer calculates feature contributions (SHAP values).
7.  Backend responds with Prediction ("Approved"/"Denied") and Explanation.
8.  Frontend renders "Approved" (Green) or "Denied" (Red) and displays Bar Chart of top contributing features.
