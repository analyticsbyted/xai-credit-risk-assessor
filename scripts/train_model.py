import pandas as pd
import xgboost as xgb
import shap
import joblib
import os

# Paths
DATA_PATH = 'data/raw/loan_default_prediction.csv'
ARTIFACTS_DIR = 'api/model_artifacts'

def train():
    print("Loading data...")
    df = pd.read_csv(DATA_PATH)

    # Rename columns to snake_case to match API schema
    df.columns = [
        'age', 'income', 'loan_amount', 'credit_score', 'months_employed',
        'num_credit_lines', 'interest_rate', 'loan_term', 'dti_ratio',
        'education', 'employment_type', 'marital_status', 'default'
    ]

    # Feature Engineering / Preprocessing
    # One-Hot Encoding for categorical variables
    # We use pd.get_dummies. In production, we'd need to align columns exactly.
    # For this simplified workflow, we'll save the feature names.
    
    categorical_cols = ['education', 'employment_type', 'marital_status']
    df_encoded = pd.get_dummies(df, columns=categorical_cols)

    # Separate X and y
    X = df_encoded.drop('default', axis=1)
    y = df_encoded['default']

    print(f"Training XGBoost model on {X.shape[0]} samples with {X.shape[1]} features...")
    model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    model.fit(X, y)

    print("Generating SHAP explainer...")
    # Using TreeExplainer for XGBoost
    explainer = shap.TreeExplainer(model)

    # Ensure artifacts directory exists
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    print("Saving artifacts...")
    # Save Model (using joblib for the sklearn wrapper)
    joblib.dump(model, os.path.join(ARTIFACTS_DIR, 'model.pkl'))
    
    # Save Explainer
    joblib.dump(explainer, os.path.join(ARTIFACTS_DIR, 'explainer.pkl'))
    
    # Save Feature Names (crucial for API to align input data)
    joblib.dump(X.columns.tolist(), os.path.join(ARTIFACTS_DIR, 'feature_names.pkl'))

    print(f"Artifacts saved to {ARTIFACTS_DIR}")
    print(f"- model.pkl")
    print(f"- explainer.pkl")
    print(f"- feature_names.pkl")

if __name__ == "__main__":
    train()
