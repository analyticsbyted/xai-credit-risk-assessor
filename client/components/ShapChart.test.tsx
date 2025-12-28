import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ShapChart from './ShapChart';

// Mock Recharts ResponsiveContainer to avoid size issues in JSDOM
// Recharts often needs a mock in tests because it relies on client layout
import React from 'react';
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe('ShapChart', () => {
  const mockData = [
    { feature: 'Income', value: 50000, impact: -0.2 },
    { feature: 'DTI Ratio', value: 0.4, impact: 0.5 },
  ];

  it('renders the chart container', () => {
    render(<ShapChart features={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('displays the chart title', () => {
    render(<ShapChart features={mockData} />);
    expect(screen.getByText(/Feature Impact/i)).toBeInTheDocument();
  });
});
