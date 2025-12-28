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

  const inputClass = "mt-1 block w-full rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm focus:border-primary focus:ring-primary outline-none transition-all placeholder:text-muted-foreground focus:ring-1"; // text-base (16px) prevents iOS zoom
  const labelClass = "block text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-1";

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-2xl space-y-8 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label htmlFor="age" className={labelClass}>Age</label>
          <input type="number" inputMode="numeric" name="age" id="age" value={formData.age} onChange={handleChange} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="income" className={labelClass}>Annual Income ($)</label>
          <input type="number" inputMode="decimal" name="income" id="income" value={formData.income} onChange={handleChange} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="loan_amount" className={labelClass}>Loan Amount ($)</label>
          <input type="number" inputMode="decimal" name="loan_amount" id="loan_amount" value={formData.loan_amount} onChange={handleChange} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="credit_score" className={labelClass}>Credit Score</label>
          <input type="number" inputMode="numeric" name="credit_score" id="credit_score" value={formData.credit_score} onChange={handleChange} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="months_employed" className={labelClass}>Months Employed</label>
          <input type="number" inputMode="numeric" name="months_employed" id="months_employed" value={formData.months_employed} onChange={handleChange} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="num_credit_lines" className={labelClass}>Active Credit Lines</label>
          <input type="number" inputMode="numeric" name="num_credit_lines" id="num_credit_lines" value={formData.num_credit_lines} onChange={handleChange} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="interest_rate" className={labelClass}>Interest Rate (%)</label>
          <input type="number" inputMode="decimal" name="interest_rate" id="interest_rate" value={formData.interest_rate} onChange={handleChange} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="loan_term" className={labelClass}>Loan Term (Months)</label>
          <input type="number" inputMode="numeric" name="loan_term" id="loan_term" value={formData.loan_term} onChange={handleChange} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label htmlFor="dti_ratio" className={labelClass}>DTI Ratio</label>
          <input type="number" inputMode="decimal" step="0.01" name="dti_ratio" id="dti_ratio" value={formData.dti_ratio} onChange={handleChange} className={inputClass} />
        </div>

        {/* Selects */}
        <div className="space-y-1">
          <label htmlFor="education" className={labelClass}>Education Level</label>
          <select name="education" id="education" value={formData.education} onChange={handleChange} className={inputClass}>
            <option value="HighSchool">High School</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="employment_type" className={labelClass}>Employment Type</label>
          <select name="employment_type" id="employment_type" value={formData.employment_type} onChange={handleChange} className={inputClass}>
            <option value="FullTime">Full Time</option>
            <option value="PartTime">Part Time</option>
            <option value="SelfEmployed">Self Employed</option>
            <option value="Unemployed">Unemployed</option>
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="marital_status" className={labelClass}>Marital Status</label>
          <select name="marital_status" id="marital_status" value={formData.marital_status} onChange={handleChange} className={inputClass}>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
          </select>
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <button
          type="submit"
          className="w-full flex justify-center py-4 px-6 rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98] transform"
        >
          Generate Risk Assessment
        </button>
      </div>
    </form>
  );
};

export default CreditRiskForm;
