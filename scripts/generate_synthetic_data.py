import pandas as pd
import numpy as np
import os

# Define the columns based on the specs
columns = [
    'Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed',
    'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio',
    'Education', 'EmploymentType', 'MaritalStatus', 'Default'
]

# Generate synthetic data
np.random.seed(42)
n_samples = 2000 # Increased sample size for better distribution

data = {
    'Age': np.random.randint(18, 70, n_samples),
    'Income': np.random.normal(65000, 25000, n_samples).astype(int), # Slightly higher mean
    'LoanAmount': np.random.randint(2000, 60000, n_samples),
    'CreditScore': np.random.normal(700, 100, n_samples).astype(int), # Normal dist for scores
    'MonthsEmployed': np.random.randint(0, 120, n_samples),
    'NumCreditLines': np.random.randint(0, 20, n_samples),
    'InterestRate': np.random.uniform(3.0, 25.0, n_samples).round(2),
    'LoanTerm': np.random.choice([12, 24, 36, 48, 60], n_samples),
    'DTIRatio': np.random.uniform(0.1, 0.6, n_samples).round(2), # More realistic DTI range
    'Education': np.random.choice(['HighSchool', 'Bachelor', 'Master', 'PhD'], n_samples, p=[0.3, 0.4, 0.2, 0.1]),
    'EmploymentType': np.random.choice(['FullTime', 'PartTime', 'SelfEmployed', 'Unemployed'], n_samples, p=[0.7, 0.15, 0.1, 0.05]),
    'MaritalStatus': np.random.choice(['Single', 'Married', 'Divorced'], n_samples),
}

df = pd.DataFrame(data)

# Clip Credit Score to realistic bounds
df['CreditScore'] = df['CreditScore'].clip(300, 850)
df['Income'] = df['Income'].clip(10000, 200000)

# --- Scientific Logic: Logistic Function ---

def calculate_logit(row):
    # Intercept: -4.6 corresponds to ~1% probability for the "baseline" (perfect) profile
    # This represents the "Market Risk" or "Prime Rate"
    logit = -4.6
    
    # --- Penalties (Adding to Log-Odds) ---
    
    # Credit Score Impact (Strongest Driver)
    # 750+ is baseline. Below that, risk increases.
    # Every 50 points below 750 adds ~0.5 to log-odds
    if row['CreditScore'] < 750:
        logit += (750 - row['CreditScore']) / 50 * 0.5
        
    # DTI Ratio Impact
    # > 0.3 starts getting risky.
    if row['DTIRatio'] > 0.3:
        logit += (row['DTIRatio'] - 0.3) * 3.0 # Strong penalty for high DTI
        
    # Income Impact (Logarithmic - diminishing returns)
    if row['Income'] < 40000:
        logit += 1.5
    elif row['Income'] < 60000:
        logit += 0.5
        
    # Loan Amount (Higher amount = slightly higher risk all else equal)
    if row['LoanAmount'] > 30000:
        logit += 0.5
        
    # Employment Status
    if row['EmploymentType'] == 'Unemployed':
        logit += 2.0
    elif row['EmploymentType'] == 'PartTime':
        logit += 0.5
        
    # Interest Rate (often correlated with risk, serving as a proxy here)
    if row['InterestRate'] > 15.0:
        logit += 0.5
        
    return logit

# Calculate Log-Odds
logits = df.apply(calculate_logit, axis=1)

# Apply Sigmoid Function to get Probability: P = 1 / (1 + e^-logit)
probabilities = 1 / (1 + np.exp(-logits))

# Generate Target Variable based on Probability (Bernoulli Trial)
# This adds natural "aleatoric uncertainty" - even high risk people pay, low risk default.
df['Default'] = np.random.binomial(1, probabilities)

# Save
os.makedirs('data/raw', exist_ok=True)
df.to_csv('data/raw/loan_default_prediction.csv', index=False)
print("Synthetic data generated with Logistic Regression logic.")
print(f"Average Default Rate: {df['Default'].mean():.2%}")