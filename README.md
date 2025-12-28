---
title: XAI Credit Risk Assessor
emoji: 🏦
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
app_port: 7860
---

# Explainable AI (XAI) Credit Risk Assessor

A full-stack web application that predicts loan default risk using XGBoost and explains the decision using SHAP (SHapley Additive exPlanations).

[![Hugging Face Spaces](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Live%20Demo-blue)](https://huggingface.co/spaces/analyticsbyted/credit-risk-assessor)
![Status](https://img.shields.io/badge/Status-Complete-green)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_FastAPI_XGBoost-blue)

## Project Overview

This project demonstrates the integration of advanced machine learning interpretability into a modern web application. It addresses the "Black Box" problem in AI by telling the user not just *what* the decision is, but *why* it was made.

### Key Features
*   **Risk Prediction:** Uses a Gradient Boosting model (XGBoost) trained on scientifically grounded synthetic data (Logistic Regression logic).
*   **Explainability:** Provides real-time explanations for every prediction using SHAP (SHapley Additive exPlanations) values.
*   **"What-If" Analysis:** Interactive Simulation Mode allowing users to adjust key financial metrics (Income, DTI, Credit Score) and see the impact on their risk in real-time.
*   **Visualizations:** Interactive bar charts showing positive/negative feature contributions.
*   **Premium UI/UX:** A state-of-the-art interface featuring **Glassmorphism**, smooth entrance animations, and a fully adaptive **Premium Dark Theme** for optimal visual comfort.
*   **Modern Stack:** React (Next.js 15+) frontend and Python (FastAPI) backend.

## Repository Structure

```
.
├── api/                # Backend (FastAPI)
│   ├── main.py         # API Application & Endpoint
│   ├── model_artifacts/# Serialized ML models (generated via script)
│   ├── tests/          # Pytest tests
│   └── requirements.txt
├── client/             # Frontend (Next.js)
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components (Form, Chart, Simulation)
│   ├── utils/          # Helper functions (Model Mapper)
│   └── ...
├── data/               # Data directory
│   └── raw/            # Dataset (CSV)
├── docs/               # Documentation (PRD, Specs)
├── notebooks/          # Jupyter Notebooks for training
├── scripts/            # Helper scripts (Data Gen, Training)
├── architecture.md     # System Architecture Diagram
└── Dockerfile          # Multi-stage build for Full-Stack Deployment
```

## Getting Started (Local Development)

### Prerequisites
*   Node.js (v20+)
*   Python (3.10+)
*   Docker (Optional)

### 1. Data & Model Setup
Before running the API, you must generate the model artifacts.

```bash
# 1. Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r api/requirements.txt

# 3. Run data generation and training
python scripts/generate_synthetic_data.py
python scripts/train_model.py
```
*Output: Artifacts will be saved to `api/model_artifacts/`.*

### 2. Backend (API) Setup

```bash
# From root (with venv active)
uvicorn api.main:app --reload
```
*   API running at: `http://127.0.0.1:8000`
*   Swagger Docs: `http://127.0.0.1:8000/docs`

### 3. Frontend (Client) Setup

Open a new terminal.

```bash
cd client
npm install
npm run dev
```
*   Frontend running at: `http://localhost:3000`
*   *Note: In local dev, the frontend points to localhost:8000 via CORS.*

## Deployment (Hugging Face Spaces)

This project is configured for a single-click deployment to Hugging Face Spaces using Docker.

1.  **Build Process:** The `Dockerfile` uses a multi-stage build:
    *   **Stage 1:** Builds the Next.js frontend as a static site (`output: 'export'`).
    *   **Stage 2:** Sets up the Python backend, installs dependencies, and **trains the model** (ensuring full compatibility).
    *   **Final:** Copies the static frontend assets to `api/static` and serves them via FastAPI.

2.  **Push to Deploy:**
    ```bash
    git remote add hf https://huggingface.co/spaces/<USERNAME>/<SPACE_NAME>
    git push hf main
    ```

## Testing (TDD)

This project strictly follows Test-Driven Development.

**Backend Tests:**
```bash
# From root (with venv active)
export PYTHONPATH=$PYTHONPATH:.
pytest api/tests/
```

**Frontend Tests:**
```bash
cd client
npm test
```

## License
MIT
