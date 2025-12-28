import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { mapFormToApiPayload } from '@/utils/modelMapper';

interface SimulationPanelProps {
  initialData: any;
  baseProbability: number;
}

import { AdjustmentsHorizontalIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const SimulationPanel: React.FC<SimulationPanelProps> = ({ initialData, baseProbability }) => {
  const [values, setValues] = useState(initialData);
  const [simProbability, setSimProbability] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define simulateable fields
  const sliders = [
    { name: 'income', label: 'Income', min: 20000, max: 200000, step: 5000, unit: '$' },
    { name: 'credit_score', label: 'Credit Score', min: 300, max: 850, step: 10, unit: '' },
    { name: 'dti_ratio', label: 'DTI Ratio', min: 0, max: 1.0, step: 0.05, unit: '' },
    { name: 'loan_amount', label: 'Loan Amount', min: 1000, max: 50000, step: 1000, unit: '$' },
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    const newValues = { ...values, [name]: numValue };
    setValues(newValues);

    // Debounce API call
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const apiPayload = mapFormToApiPayload(newValues);
        const response = await axios.post(
          '/predict?include_explanation=false',
          apiPayload
        );
        setSimProbability(response.data.probability);
      } catch (err) {
        console.error("Simulation failed", err);
      } finally {
        setLoading(false);
      }
    }, 400); // Slightly faster debounce
  };

  // Reset simulation when base data changes
  useEffect(() => {
    setValues(initialData);
    setSimProbability(null);
  }, [initialData]);

  const diff = simProbability !== null ? simProbability - baseProbability : 0;
  const percentDiff = (diff * 100).toFixed(2);
  const isBetter = diff < 0; // Lower probability is better (less risk)

  return (
    <div className="glass-card rounded-2xl p-8 border border-border mt-12 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <AdjustmentsHorizontalIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">What-If Simulation</h3>
            <p className="text-sm text-muted-foreground">Adjust parameters to see real-time risk fluctuations.</p>
          </div>
        </div>

        <div className="w-full md:w-auto text-right bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border min-w-[200px]">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Simulated Risk</div>
          <div className={`text-3xl font-black ${loading ? 'opacity-30' : ''} transition-opacity duration-200`}>
            {simProbability !== null ? (simProbability * 100).toFixed(1) : (baseProbability * 100).toFixed(1)}%
          </div>
          {simProbability !== null && Math.abs(diff) > 0.0001 && (
            <div className={`text-sm font-bold mt-1 flex items-center justify-end gap-1 ${isBetter ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isBetter ? <ArrowTrendingDownIcon className="w-4 h-4" /> : <ArrowTrendingUpIcon className="w-4 h-4" />}
              {diff > 0 ? '+' : ''}{percentDiff}%
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {sliders.map((slider) => (
          <div key={slider.name} className="space-y-3">
            <div className="flex justify-between items-end">
              <label htmlFor={`sim-${slider.name}`} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {slider.label}
              </label>
              <span className="text-sm font-black font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                {slider.unit}{values[slider.name].toLocaleString()}
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                type="range"
                id={`sim-${slider.name}`}
                name={slider.name}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={values[slider.name]}
                onChange={handleSliderChange}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-hover transition-all"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
        <p className="text-xs text-muted-foreground italic">
          This simulation uses the same underlying XGBoost model to provide instantaneous decision support.
        </p>
      </div>
    </div>
  );
};

export default SimulationPanel;
