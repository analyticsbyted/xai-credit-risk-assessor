# Project Context: Explainable AI (XAI) Credit Risk Assessor

## Project Overview

The "Explainable AI (XAI) Credit Risk Assessor" is a full-stack web application designed to predict loan default risk and provide interpretable explanations for those predictions. The system uses an XGBoost model for prediction and SHAP (SHapley Additive exPlanations) to explain individual decisions, helping users understand *why* a loan was approved or denied.

**Key Technologies:**
*   **Frontend:** React (Next.js or Vite) with Tailwind CSS.
*   **Backend:** Python (FastAPI).
*   **Machine Learning:** XGBoost, SHAP, Scikit-learn, Pandas.
*   **Deployment:** AWS S3/CloudFront (Frontend), Docker/AWS App Runner (Backend).

## Architecture

The application follows a standard client-server architecture:
1.  **Frontend:** A static React application that captures user input and displays results/visualizations.
2.  **Backend:** A FastAPI service that exposes a `/predict` endpoint. It loads a pre-trained XGBoost model and SHAP explainer to process requests.
3.  **Data Science Pipeline:** Jupyter notebooks are used for data cleaning, feature engineering, model training, and artifact serialization (saving the model and explainer).

## Intended Development Workflow & Commands

**Note:** The core product and infrastructure setup are complete. The project is now in the **refinement and enhancement phase**, focusing on UI/UX polish, theme consistency, and advanced interactive features.

### Prerequisites
*   Node.js & npm
*   Python 3.10+
*   Virtual Environment (Critical)

### Backend (`api/` directory)
*   **Setup:**
    ```bash
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```
*   **Run Development Server:**
    ```bash
    uvicorn main:app --reload
    ```
*   **Test (TDD - Mandatory):**
    ```bash
    pytest
    ```

### Frontend (`app/` or `client/` directory)
*   **Setup:**
    ```bash
    npm install
    ```
*   **Run Development Server:**
    ```bash
    npm run dev
    ```
*   **Test (TDD - Mandatory):**
    ```bash
    npm test
    ```

## Development Conventions

*   **Test-Driven Development (TDD):** TDD is **mandatory**. Write failing tests (using `pytest` for backend, `vitest`/`jest` for frontend) before implementing features.
*   **Virtual Environment:** All Python work must be performed inside a virtual environment (`.venv`) to isolate dependencies.
*   **Documentation:**
    *   Keep `README.md` updated with setup and deployment instructions.
    *   Ensure FastAPI auto-generated docs (Swagger UI) are functional.
    *   Comment complex logic, especially in data science notebooks.
*   **Code Style:**
    *   Follow PEP 8 for Python.
    *   Use modern JavaScript/TypeScript practices (ES6+).

## Key Files & Directories (Planned/Existing)

*   `XAI_CREDIT_RISK_LLM_PROMPT.md`: Main instruction file for the project build.
*   `docs/prd-xai-credit-risk.md`: Product Requirements Document.
*   `docs/specs-xai-credit-risk.md`: Technical Specifications.
*   `data/raw/loan_default_prediction.csv`: Raw dataset (Synthetic).
*   `api/`: (Implemented) Backend source code (FastAPI).
*   `client/`: (Implemented) Frontend source code (Next.js).
*   `notebooks/`: (Implemented) Data science notebooks.
*   `scripts/`: (Implemented) Helper scripts for data generation and training.
