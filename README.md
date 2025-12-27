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

![Status](https://img.shields.io/badge/Status-Complete-green)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_FastAPI_XGBoost-blue)

## Project Overview

This project demonstrates the integration of advanced machine learning interpretability into a modern web application. It addresses the "Black Box" problem in AI by telling the user not just *what* the decision is, but *why* it was made.

### Key Features
*   **Risk Prediction:** Uses a Gradient Boosting model (XGBoost) to assess loan default probability.
*   **Explainability:** Provides real-time explanations for every prediction using SHAP values.
*   **Visualizations:** Interactive bar charts showing positive/negative feature contributions.
*   **Modern Stack:** React (Next.js) frontend and Python (FastAPI) backend.

## Repository Structure

```
.
├── api/                # Backend (FastAPI)
│   ├── main.py         # API Application & Endpoint
│   ├── model_artifacts/# Serialized ML models (generated via script)
│   ├── tests/          # Pytest tests
│   └── Dockerfile      # Backend container definition
├── client/             # Frontend (Next.js)
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components (Form, Chart)
│   └── ...
├── data/               # Data directory
│   └── raw/            # Dataset (CSV)
├── docs/               # Documentation (PRD, Specs)
├── notebooks/          # Jupyter Notebooks for training
├── scripts/            # Helper scripts (Data Gen, Training)
└── architecture.md     # System Architecture Diagram
```

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)
*   Docker (Optional, for containerization)

### 1. Data & Model Setup
Before running the API, you must generate the model artifacts.

```bash
# 1. Create and activate virtual environment
cd api
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Go back to root and run training script
cd ..
python scripts/train_model.py
```
*Output: Artifacts will be saved to `api/model_artifacts/`.*

### 2. Backend (API) Setup

```bash
# Ensure you are in the project root and venv is active
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

## Deployment

### Backend (Docker)
```bash
cd api
docker build -t xai-credit-risk-api .
docker run -p 8000:8000 xai-credit-risk-api
```

### Frontend (Static Export)
```bash
cd client
npm run build
# The 'out' directory can be deployed to AWS S3, Vercel, or Netlify.
```

## License
MIT