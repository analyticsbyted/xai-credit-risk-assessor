'use client';

import React, { useState } from 'react';
import axios from 'axios';
import CreditRiskForm from '@/components/CreditRiskForm';
import ShapChart from '@/components/ShapChart';
import SimulationPanel from '@/components/SimulationPanel';
import { mapFormToApiPayload } from '@/utils/modelMapper';

interface PredictionResult {
  prediction: string;
  probability: number;
  explanation: {
    summary: string;
    feature_importance: any[];
  };
}

export default function Home() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [currentData, setCurrentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssessment = async (data: any) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentData(data); // Store RAW data for the UI/Sliders
    
    try {
      // Transform data for API
      const apiPayload = mapFormToApiPayload(data);
      
      // Use relative path for deployment
      const response = await axios.post('/predict', apiPayload);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to get prediction. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            XAI Credit Risk Assessor
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Explainable AI-powered loan default prediction.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Form Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Applicant Information</h2>
            <CreditRiskForm onSubmit={handleAssessment} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-10">
              <p className="text-xl text-indigo-600">Analyzing Risk Model...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="bg-white shadow rounded-lg p-6 space-y-6 animate-fade-in">
              <div className="border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  Prediction: <span className={result.prediction === 'Denied' ? 'text-red-600' : 'text-green-600'}>{result.prediction}</span>
                </h2>
                <p className="mt-1 text-gray-500">
                  Default Probability: {(result.probability * 100).toFixed(2)}%
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800">Explanation</h3>
                <p className="mt-2 text-gray-600 text-lg">{result.explanation.summary}</p>
              </div>

              <div>
                <ShapChart features={result.explanation.feature_importance} />
              </div>

              {/* Simulation Panel */}
              <SimulationPanel 
                initialData={currentData} 
                baseProbability={result.probability} 
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}