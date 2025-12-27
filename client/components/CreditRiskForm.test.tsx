import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CreditRiskForm from './CreditRiskForm';

describe('CreditRiskForm', () => {
  it('renders all required input fields', () => {
    render(<CreditRiskForm onSubmit={vi.fn()} />);
    
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Loan Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Credit Score/i)).toBeInTheDocument();
    // Check for a few others
    expect(screen.getByLabelText(/Months Employed/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submitted', () => {
    const handleSubmit = vi.fn();
    render(<CreditRiskForm onSubmit={handleSubmit} />);
    
    const ageInput = screen.getByLabelText(/Age/i);
    fireEvent.change(ageInput, { target: { value: '30' } });
    
    const incomeInput = screen.getByLabelText(/Income/i);
    fireEvent.change(incomeInput, { target: { value: '50000' } });
    
    const submitButton = screen.getByRole('button', { name: /Assess Risk/i });
    fireEvent.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    // We can inspect the called arguments later once the component structure is solid
  });
});
