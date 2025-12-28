import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { mapFormToApiPayload } from '@/utils/modelMapper';

interface FeatureImportance {
  feature: string;
  value: number;
  impact: number;
}

interface PredictionResult {
  prediction: string;
  probability: number;
  explanation: {
    summary: string;
    feature_importance: FeatureImportance[];
  };
}

interface AssessmentContextType {
  result: PredictionResult | null;
  currentData: any;
  loading: boolean;
  error: string | null;
  submitAssessment: (data: any) => Promise<void>;
  simulateAssessment: (data: any) => Promise<number | null>;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [currentData, setCurrentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAssessment = async (data: any) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentData(data); // Store for simulation
    
    try {
      const apiPayload = mapFormToApiPayload(data);
      const response = await axios.post('/predict', apiPayload);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to get prediction. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const simulateAssessment = async (data: any): Promise<number | null> => {
    try {
      const apiPayload = mapFormToApiPayload(data);
      const response = await axios.post('/predict?include_explanation=false', apiPayload);
      return response.data.probability;
    } catch (err) {
      console.error("Simulation failed", err);
      return null;
    }
  };

  return (
    <AssessmentContext.Provider value={{ result, currentData, loading, error, submitAssessment, simulateAssessment }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
