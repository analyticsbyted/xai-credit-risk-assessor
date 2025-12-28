# Technical Specifications: Explainable AI (XAI) Credit Risk Assessor

**Version:** 1.2 (Final Release)
**Date:** 2025-12-27
**Related PRD:** [PRD: XAI Credit Risk Assessor](./prd-xai-credit-risk.md)

---

## 1. Architecture Overview

The system will be composed of three main parts:
1.  **Frontend:** A statically generated web application built with **Next.js** or **Vite + React**.
2.  **Backend:** A Python-based API built with **FastAPI** to serve the ML model.
3.  **Model & Data:** A pre-trained **XGBoost** model and a **SHAP Explainer** saved as artifacts, trained on the Coursera Loan Default dataset.

![Architecture Diagram](https://i.imgur.com/example.png)  
*(Placeholder for a simple diagram: [User] -> [React Frontend on S3] -> [FastAPI on AWS] -> [XGBoost/SHAP Model])*

## 2. Recommended Tech Stack

*   **Frontend:**
    *   **Framework:** Next.js (preferred for static export and API routes) or Vite + React
    *   **UI Library:** Tailwind CSS (Mobile-First Configuration)
    *   **Data Fetching:** `fetch` API or `SWR`
    *   **Charts:** `recharts` (Responsive Container)
    *   **Testing:** `vitest` or `jest` with `react-testing-library`
*   **Backend:**
    *   **Python Environment:** Use a Python virtual environment (e.g., `venv`) for dependency management.
    *   **Framework:** Python 3.10+ with FastAPI
    *   **ML Libraries:** `scikit-learn`, `xgboost`, `shap`
    *   **Data Handling:** `pandas`, `numpy`
    *   **Testing:** `pytest`
*   **Deployment:**
    *   **Hugging Face Spaces:** Docker SDK (Single container serving both Frontend & Backend).
    *   **Alternative:** AWS S3 + CloudFront (Frontend) and AWS App Runner (Backend).

## 3. Data Model & Preprocessing

*   **Dataset:** `data/raw/loan_default_prediction.csv`
*   **Preprocessing Steps (to be documented in notebook):**
    1.  **Load Data:** Read the CSV into a pandas DataFrame.
    2.  **Feature Engineering:**
        *   Convert `Education` and `EmploymentType` to numerical representations (e.g., One-Hot Encoding).
        *   Handle `LoanPurpose` similarly.
        *   Create new features if deemed necessary (e.g., credit utilization ratio).
    3.  **Handle Missing Values:** Use simple imputation (mean, median, or a constant like 0) for numerical columns if any are missing.
    4.  **Split Data:** Create training and testing sets using `train_test_split`.
*   **Model Training:**
    1.  Train an `xgboost.XGBClassifier` model on the training data.
    2.  Evaluate model performance (Accuracy, Precision, Recall, F1-Score, AUC) on the test set.
    3.  **Serialize Model:** Save the trained model to a file (e.g., `model.pkl` or `model.json`).
*   **SHAP Explainer:**
    1.  Create a `shap.TreeExplainer` using the trained model.
    2.  **Serialize Explainer:** Save the SHAP explainer object to a file. This is crucial as it contains the necessary baseline data for explanations.

## 4. API Specification

### Endpoint: `/predict`
*   **Method:** `POST`
*   **Description:** Accepts financial data for a single applicant and returns a prediction and SHAP explanation.
*   **Parameters:**
    *   `include_explanation` (bool, default=True): If `False`, skips the expensive SHAP calculation and returns only the probability. (Used for "What-If" simulations).

#### Request Body:
A JSON object matching the preprocessed features of the model.

```json
{
  "age": 30,
  "income": 55000,
  "loan_amount": 10000,
  "credit_score": 650,
  "months_employed": 24,
  "num_credit_lines": 5,
  "interest_rate": 12.5,
  "loan_term": 36,
  "dti_ratio": 0.4,
  "education_phd": 0,
  "education_master": 1,
  "education_bachelor": 0,
  "education_highschool": 0,
  "employment_type_fulltime": 1,
  "employment_type_parttime": 0,
  "employment_type_selfemployed": 0,
  "employment_type_unemployed": 0,
  "marital_status_married": 1,
  "marital_status_single": 0
}
```

#### Success Response (200):

```json
{
  "prediction": "Denied", // "Approved" or "Denied"
  "probability": 0.82,     // The raw model probability for the predicted class
  "explanation": {         // Null if include_explanation=False
    "summary": "The decision was primarily influenced by a high Debt-to-Income Ratio and a low Credit Score.",
    "feature_importance": [
      { "feature": "DTI Ratio", "value": 0.4, "impact": 0.25 },
      { "feature": "Credit Score", "value": 650, "impact": 0.18 },
      { "feature": "Interest Rate", "value": 12.5, "impact": 0.05 },
      { "feature": "Income", "value": 55000, "impact": -0.02 }
    ]
  }
}
```
*   `feature_importance`: An array of objects. `impact` is the SHAP value. Positive values push the prediction towards "Denied" (default), negative values push it towards "Approved".

## 5. Frontend Implementation Details

*   **State Management:** Use `useState` for form inputs and API response.
*   **Form:** A controlled component that builds the JSON payload for the API.
*   **API Call:** On form submission, a `POST` request is sent to the backend API.
*   **Results Display:**
    *   The prediction ("Approved"/"Denied") is displayed prominently.
    *   The `explanation.summary` is shown as a text block.
    *   The `explanation.feature_importance` array is used to render a horizontal bar chart using Recharts:
        *   Bars for positive impact features are red.
        *   Bars for negative impact features are green.
        *   The length of the bar corresponds to the absolute `impact` value.
*   **[NEW] Simulation Mode:**
    *   Displayed below the main results.
    *   Renders sliders for the Top 3 continuous features (e.g., Income, Credit Score, DTI).
    *   Debounced API calls to `/predict?include_explanation=false` as sliders move.
    *   Updates a "Simulated Probability" gauge/text.
*   **[NEW] Mobile-First UI:**
    *   **Inputs:** `inputMode="numeric"` for mobile keyboards.
    *   **Charts:** Dynamic height (500px on mobile vs 384px on desktop) to accommodate vertical Bar Charts without label clipping.
    *   **Layout:** Flex-col (stacked) by default, Grid on `md` breakpoints.

## 6. Deployment Workflow (per NFR3)

1.  **Backend (FastAPI):**
    *   Create a `Dockerfile`.
    *   Push the image to a container registry (e.g., Docker Hub, AWS ECR).
    *   Deploy to AWS App Runner, pointing to the container image.
2.  **Frontend (Next.js/React):**
    *   Run `npm run build` to generate the static site in the `out/` or `dist/` directory.
    *   Configure an S3 bucket for static website hosting.
    *   Sync the contents of the build directory to the S3 bucket.
    *   Set up a CloudFront distribution pointing to the S3 bucket, configuring it for SPA routing (serving `index.html` on all sub-paths).

## 7. Future Roadmap (Planned)

*   **Persistence:** Integrate PostgreSQL to log every `LoanApplication` request for auditing.
*   **Security:** Implement API Key authentication for the `/predict` endpoint.
*   **Model Governance:** Add a `model_version` field to the API response to track which trained artifact was used.
