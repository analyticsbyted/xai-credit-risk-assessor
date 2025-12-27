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
      <button onClick={() => onSubmit({ age: 30 })}>Submit Mock</button>
    </div>
  ),
}));

vi.mock('@/components/ShapChart', () => ({
  default: () => <div data-testid="mock-chart">Chart</div>,
}));

describe('Home Page', () => {
  it('renders the title and form initially', () => {
    render(<Home />);
    expect(screen.getByText(/Credit Risk Assessor/i)).toBeInTheDocument();
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

    // Wait for prediction to appear
    await waitFor(() => {
        expect(screen.getByText('Prediction:')).toBeInTheDocument();
        expect(screen.getByText('Approved')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    expect(screen.getByText(/Looks good./i)).toBeInTheDocument();
  });
});
