import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './page';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

// Mock child components to simplify integration test
vi.mock('@/components/CreditRiskForm', () => ({
  default: ({ onSubmit }: { onSubmit: any }) => (
    <div data-testid="mock-form">
      <button onClick={() => onSubmit({ age: 30, income: 50000, education: 'Bachelor' })}>Submit Mock</button>
    </div>
  ),
}));

vi.mock('@/components/ShapChart', () => ({
  default: () => <div data-testid="mock-chart">Chart</div>,
}));

// Mock SimulationPanel to avoid context data issues during test
vi.mock('@/components/SimulationPanel', () => ({
  default: () => <div data-testid="mock-simulation">Simulation</div>,
}));

describe('Home Page', () => {
  it('renders the title and form initially', () => {
    render(<Home />);
    // The text is split into spans: "XAI", "Credit Risk", "Assessor"
    // We can check for "Applicant Risk Profile" which is simpler and less styling-dependent
    expect(screen.getByText(/Applicant Risk Profile/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-form')).toBeInTheDocument();
  });

  it('displays prediction and chart after successful API call', async () => {
    // Mock API response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        prediction: 'Approved',
        probability: 0.1,
        explanation: {
          summary: 'Looks good.',
          feature_importance: []
        }
      }
    });

    render(<Home />);
    
    // Trigger submit
    fireEvent.click(screen.getByText('Submit Mock'));

    // Wait for prediction to appear (checking for "Prediction Outcome" label)
    await waitFor(() => {
        expect(screen.getByText(/Prediction Outcome/i)).toBeInTheDocument();
        expect(screen.getByText(/APPROVED/i)).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    expect(screen.getByText(/Looks good./i)).toBeInTheDocument();
  });
});