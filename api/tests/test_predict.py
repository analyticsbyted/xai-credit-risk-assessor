from fastapi.testclient import TestClient
from api.main import app

def test_predict_endpoint_exists_and_returns_valid_response():
    # Define a sample payload based on the technical specs
    payload = {
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

    with TestClient(app) as client:
        response = client.post("/predict", json=payload)

        # This assertion is expected to fail initially as the endpoint is not implemented
        assert response.status_code == 200
        
        # Optional: Check structure of response if it were to succeed
        data = response.json()
        assert "prediction" in data
        assert "probability" in data
        assert "explanation" in data
