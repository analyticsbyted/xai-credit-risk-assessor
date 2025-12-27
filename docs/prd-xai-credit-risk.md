# Product Requirements Document (PRD): Explainable AI (XAI) Credit Risk Assessor

**Version:** 1.1 (Refined)
**Date:** 2025-12-26
**Author:** Ted Dickey II

---

## 1. Objective

To build a full-stack, interactive web application that demonstrates the principles of Explainable AI (XAI) in a real-world business context. The application will predict credit risk based on user-provided data and, more importantly, provide a clear, visual explanation of *why* the decision was made.

This project serves as a portfolio piece to showcase expertise in end-to-end product engineering, from data science modeling to a polished, production-ready frontend deployment.

## 2. User Persona

*   **Primary Persona:** A **Technical Recruiter or Hiring Manager** evaluating a candidate for a "Product Engineer" or "Full-Stack Data Scientist" role. They are looking for evidence of technical depth, product thinking, and modern development practices.
*   **Secondary Persona:** A **Data Science Student or Junior Professional** interested in learning about model interpretability.

## 3. User Stories

*   **As a user, I want to...** input a set of financial metrics into a clean web form **so that I can...** receive a credit risk prediction.
*   **As a user, I want to...** see a clear, high-level prediction (e.g., "Approved," "Denied") **so that I can...** immediately understand the outcome.
*   **As a user, I want to...** view a simple, plain-language summary explaining the most important factors that led to the decision **so that I can...** trust the model's reasoning.
*   **As a user, I want to...** see a visual chart (e.g., a bar chart) that ranks the features by their impact on the prediction **so that I can...** perform a deeper analysis of the model's behavior.
*   **[NEW] As a user, I want to...** adjust key financial inputs (e.g., Income, DTI) via interactive sliders ("What-If" Analysis) **so that I can...** see in real-time how improving my financial health affects my approval odds.
*   **[NEW] As a Risk Officer, I want to...** have all assessments logged to a database **so that I can...** audit historical model performance (Roadmap Item).

## 4. Functional Requirements

### 4.1. Core Application
*   **FR1: Input Form:** The application must present a web form with fields for all required input features from the chosen dataset (e.g., income, loan amount, credit history).
*   **FR2: Prediction Engine:** The backend must process the form data, run it through a pre-trained machine learning model, and return a prediction.
*   **FR3: Prediction Display:** The frontend must clearly display the binary prediction result (e.g., "Loan Approved" or "Loan Denied").
*   **FR4: XAI Explanation:**
    *   **FR4.1: Natural Language Summary:** The frontend must display a dynamically generated sentence summarizing the top 1-2 reasons for the decision. (e.g., "The decision was primarily influenced by a low debt-to-income ratio.").
    *   **FR4.2: SHAP Visualization:** The frontend must render a chart (e.g., a horizontal bar chart) showing the SHAP values for the top features, indicating which pushed the prediction towards "Approved" vs. "Denied".
*   **FR7: [NEW] What-If Analysis (Simulation):**
    *   The frontend must provide a "Simulation Mode" where users can modify the top 3-5 influential features using sliders.
    *   The application must display the *change* in default probability in real-time (or near real-time) as sliders are moved.

### 4.2. Model & Data
*   **FR5: Dataset:** The model must be trained on a publicly available, open-source credit risk dataset. The chosen dataset is **Coursera's Loan Default Prediction Challenge Dataset**.
*   **FR6: Model Retraining:** While not a live feature, the repository must include the Python scripts and notebooks used for data preprocessing, model training, and SHAP explainer generation.

## 5. Non-Functional Requirements (NFRs)

*   **NFR1: Development Methodology (TDD):**
    *   This project **must** follow a Test-Driven Development (TDD) approach.
    *   **Backend:** API endpoints and data processing logic must have corresponding unit tests (e.g., using `pytest`).
    *   **Frontend:** Critical UI components (e.g., the input form, the SHAP chart wrapper) must have unit and integration tests (e.g., using `vitest` and `react-testing-library`).
*   **NFR2: Documentation:**
    *   **Comprehensive `README.md`:** The project root must contain a detailed `README.md` explaining the project, local setup, testing, and deployment.
    *   **API Documentation:** The FastAPI backend must auto-generate OpenAPI (Swagger) documentation for its endpoints.
    *   **Code Comments:** Code must be well-commented, especially the data preprocessing and model training notebooks, explaining the rationale behind key decisions.
    *   **Architecture Document:** A simple `architecture.md` file should be created outlining the frontend-backend interaction.
*   **NFR3: Deployment:**
    *   **Frontend:** The Next.js/React frontend must be built as a **static site** (`npm run build`). The resulting static assets must be deployed to **AWS S3** and served via **CloudFront**.
    *   **Backend:** The FastAPI backend can be containerized (Docker) and deployed to a service like AWS App Runner, ECS, or a similar platform.
*   **NFR4: Performance:** The web application must have a Google Lighthouse performance score of 90+ on desktop.
*   **NFR5: Responsiveness:** The UI must be fully responsive and functional on mobile, tablet, and desktop screens.
*   **NFR6: Virtual Environment:** For all Python development (backend, model training), a Python virtual environment (e.g., `venv`) must be created and utilized to manage project dependencies in isolation. This ensures reproducibility and avoids conflicts with system-wide Python installations.

## 6. Success Metrics

*   **Completion:** The application is successfully deployed and publicly accessible.
*   **Functionality:** All user stories and functional requirements are implemented and working.
*   **Portfolio Impact:** The project is added to the main portfolio website and clearly demonstrates the targeted skills (XAI, Full-Stack Development, Product Thinking).
*   **Code Quality:** The codebase is clean, well-documented, and has a test coverage of at least 80% for critical logic.