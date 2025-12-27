import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { mapFormToApiPayload } from '@/utils/modelMapper';

interface SimulationPanelProps {
  initialData: any;
  baseProbability: number;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ initialData, baseProbability }) => {
  const [values, setValues] = useState(initialData);
  const [simProbability, setSimProbability] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define simulateable fields
  const sliders = [
    { name: 'income', label: 'Income', min: 20000, max: 200000, step: 5000 },
    { name: 'credit_score', label: 'Credit Score', min: 300, max: 850, step: 10 },
    { name: 'dti_ratio', label: 'DTI Ratio', min: 0, max: 1.0, step: 0.05 },
    { name: 'loan_amount', label: 'Loan Amount', min: 1000, max: 50000, step: 1000 },
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
    }, 500); // 500ms debounce
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
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 shadow-inner border border-indigo-100 mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">What-If Simulation</h3>
          <p className="text-sm text-gray-600">Adjust sliders to see how changes affect your risk.</p>
        </div>
        
        <div className="text-right">
           <div className="text-sm text-gray-500">Simulated Default Risk</div>
           <div className={`text-2xl font-bold ${loading ? 'opacity-50' : ''}`}>
             {simProbability !== null ? (simProbability * 100).toFixed(2) : (baseProbability * 100).toFixed(2)}%
           </div>
           {simProbability !== null && (
             <div className={`text-sm font-medium ${isBetter ? 'text-green-600' : 'text-red-600'}`}>
               {diff > 0 ? '+' : ''}{percentDiff}% ({isBetter ? 'Improved' : 'Worsened'})
             </div>
           )}
        </div>
      </div>

      <div className="space-y-6">
        {sliders.map((slider) => (
          <div key={slider.name}>
            <div className="flex justify-between mb-1">
              <label htmlFor={`sim-${slider.name}`} className="text-sm font-medium text-gray-700">{slider.label}</label>
              <span className="text-sm text-gray-900 font-mono">{values[slider.name]}</span>
            </div>
            <input
              type="range"
              id={`sim-${slider.name}`}
              name={slider.name}
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={values[slider.name]}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulationPanel;
