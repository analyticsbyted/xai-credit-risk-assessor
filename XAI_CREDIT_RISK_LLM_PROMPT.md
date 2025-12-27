# LLM Prompt: Build the "Explainable AI (XAI) Credit Risk Assessor" Project

You are an expert full-stack developer with deep expertise in data science, machine learning, and modern web development practices. Your task is to build a complete, production-ready web application based on the provided requirements and specifications.

Your goal is to create a portfolio-worthy project that showcases not just technical skill, but also product thinking, attention to detail, and adherence to modern development methodologies.

---

## 1. Core Mission

Build the "Explainable AI (XAI) Credit Risk Assessor," a full-stack application that predicts loan default risk and provides clear, visual explanations for its decisions.

## 2. Key Documents (Your Source of Truth)

Before you begin, you **must** read and fully understand the following two documents that are included in the project directory:

1.  **Product Requirements Document (PRD):** `docs/prd-xai-credit-risk.md`
2.  **Technical Specifications (SPECS):** `docs/specs-xai-credit-risk.md`

These documents define the "What, Why, and How" of the project. Adherence to them is critical.

## 3. High-Level Project Workflow

You are to build this project from scratch within the current directory. Follow this general workflow:

1.  **Project Scaffolding:** Create a new directory for the backend (e.g., `api/`) and a new Next.js or Vite project for the frontend (e.g., `app/` or `client/`).
2.  **Data & Model (Backend):**
    *   Load the dataset from `data/raw/loan_default_prediction.csv`.
    *   Create a Jupyter Notebook (`notebooks/01-data-preprocessing-and-model-training.ipynb`) to handle all data cleaning, preprocessing, model training (XGBoost), and SHAP explainer generation.
    *   Serialize (save to file) the trained model, the pre-processing pipeline/encoder, and the SHAP explainer.
3.  **Backend API (FastAPI):**
    *   Create a FastAPI application that loads the serialized model and explainer.
    *   Implement the `/predict` endpoint as defined in the SPECS document.
    *   **Crucially, implement this using a Test-Driven Development (TDD) approach.** Write `pytest` tests for your API endpoint *before* writing the implementation.
4.  **Frontend (React/Next.js):**
    *   Build the UI as described in the PRD, including the input form, results display, and SHAP visualization chart.
    *   **Again, use TDD.** Write unit/integration tests for your React components (especially the form and chart) *before* implementing them fully.
5.  **Deployment:**
    *   Containerize the backend with a `Dockerfile`.
    *   Ensure the frontend can be built into a static site (`npm run build`).
    *   Provide simple deployment instructions in the main `README.md`.

## 4. Critical Non-Functional Requirements

Pay special attention to these requirements outlined in the PRD:

*   **Virtual Environment (Python):** All Python work must be done within a dedicated virtual environment (`venv`) to manage project dependencies in isolation.
*   **Test-Driven Development (TDD) is mandatory.** I expect to see a logical progression of failing tests followed by code that makes them pass.
*   **Documentation is paramount.** Your `README.md` must be comprehensive. Your code must be clean and well-commented. The FastAPI backend must have auto-generated OpenAPI docs. An `architecture.md` must be created.
*   **Deployment-Ready:** The project must be structured for deployment on AWS as specified (S3 for frontend, container for backend).

## 5. Your First Step

Your first step should be to set up the project structure. I recommend starting with the backend:
1.  Create the `api/` directory.
2.  Create and activate a Python virtual environment (`python -m venv .venv && source .venv/bin/activate`).
3.  Install `fastapi`, `uvicorn`, `scikit-learn`, `xgboost`, `shap`, `pandas`, and `pytest`.
4.  Begin by writing your first failing test for the `/predict` endpoint.

Proceed step-by-step, explaining your actions as you go. I will be here to assist and review your progress.
