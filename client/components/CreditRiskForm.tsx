import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  age: number;
  income: number;
  loan_amount: number;
  credit_score: number;
  months_employed: number;
  num_credit_lines: number;
  interest_rate: number;
  loan_term: number;
  dti_ratio: number;
  education: string;
  employment_type: string;
  marital_status: string;
}

interface CreditRiskFormProps {
  onSubmit: (data: FormData) => void;
}

const CreditRiskForm: React.FC<CreditRiskFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    age: 30,
    income: 50000,
    loan_amount: 10000,
    credit_score: 650,
    months_employed: 24,
    num_credit_lines: 5,
    interest_rate: 10.0,
    loan_term: 36,
    dti_ratio: 0.3,
    education: 'Bachelor',
    employment_type: 'FullTime',
    marital_status: 'Single'
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'education' || name === 'employment_type' || name === 'marital_status' 
        ? value 
        : parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black p-2 border";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className={labelClass}>Age</label>
          <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="income" className={labelClass}>Income ($)</label>
          <input type="number" name="income" id="income" value={formData.income} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="loan_amount" className={labelClass}>Loan Amount ($)</label>
          <input type="number" name="loan_amount" id="loan_amount" value={formData.loan_amount} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="credit_score" className={labelClass}>Credit Score</label>
          <input type="number" name="credit_score" id="credit_score" value={formData.credit_score} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="months_employed" className={labelClass}>Months Employed</label>
          <input type="number" name="months_employed" id="months_employed" value={formData.months_employed} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="num_credit_lines" className={labelClass}>Num Credit Lines</label>
          <input type="number" name="num_credit_lines" id="num_credit_lines" value={formData.num_credit_lines} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="interest_rate" className={labelClass}>Interest Rate (%)</label>
          <input type="number" name="interest_rate" id="interest_rate" value={formData.interest_rate} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="loan_term" className={labelClass}>Loan Term (Months)</label>
          <input type="number" name="loan_term" id="loan_term" value={formData.loan_term} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="dti_ratio" className={labelClass}>DTI Ratio</label>
          <input type="number" step="0.01" name="dti_ratio" id="dti_ratio" value={formData.dti_ratio} onChange={handleChange} className={inputClass} />
        </div>
        
        {/* Selects */}
        <div>
          <label htmlFor="education" className={labelClass}>Education</label>
          <select name="education" id="education" value={formData.education} onChange={handleChange} className={inputClass}>
            <option value="HighSchool">High School</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
          </select>
        </div>
        <div>
          <label htmlFor="employment_type" className={labelClass}>Employment Type</label>
          <select name="employment_type" id="employment_type" value={formData.employment_type} onChange={handleChange} className={inputClass}>
            <option value="FullTime">Full Time</option>
            <option value="PartTime">Part Time</option>
            <option value="SelfEmployed">Self Employed</option>
            <option value="Unemployed">Unemployed</option>
          </select>
        </div>
        <div>
          <label htmlFor="marital_status" className={labelClass}>Marital Status</label>
          <select name="marital_status" id="marital_status" value={formData.marital_status} onChange={handleChange} className={inputClass}>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Assess Risk
        </button>
      </div>
    </form>
  );
};

export default CreditRiskForm;
