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
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4 animate-in">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl lg:text-7xl tracking-tight">
            XAI <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Credit Risk</span> Assessor
          </h1>
          <p className="max-w-xl mx-auto text-xl text-muted-foreground">
            Leverage Game-Theoretic Explainability for High-Stakes Loan Decision Support.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Form Section */}
          <div className="animate-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">Applicant Risk Profile</h2>
            </div>
            <CreditRiskForm onSubmit={handleAssessment} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-10 animate-pulse">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status" />
              <p className="mt-4 text-xl font-medium text-primary">Analyzing Model Weights...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl animate-in">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="glass-card rounded-2xl p-8 space-y-8 animate-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Prediction Outcome</div>
                  <h2 className="text-4xl font-black tracking-tight">
                    <span className={result.prediction === 'Denied' ? 'text-red-500' : 'text-emerald-500'}>
                      {result.prediction.toUpperCase()}
                    </span>
                  </h2>
                </div>
                <div className="bg-background/50 border border-border rounded-2xl p-4 min-w-[200px]">
                  <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Risk Weighted Probability</div>
                  <div className="text-3xl font-mono font-bold tracking-tighter">
                    {(result.probability * 100).toFixed(2)}%
                  </div>
                  <div className="mt-2 w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${result.prediction === 'Denied' ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${result.probability * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Narrative Summary
                  </h3>
                  <div className="bg-muted/30 border border-border p-6 rounded-xl leading-relaxed text-foreground/90 italic quote">
                    "{result.explanation.summary}"
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Game-Theoretic Feature Attribution (TreeSHAP)
                  </h3>
                  <ShapChart features={result.explanation.feature_importance} />
                </div>
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

      <footer className="mt-20 py-10 border-t border-border/50 text-center animate-in" style={{ animationDelay: '0.4s' }}>
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-muted-foreground text-sm font-medium tracking-wide">
            &copy; {new Date().getFullYear()} <span className="text-foreground font-bold">Ted Dickey II</span>. All rights reserved.
          </p>
          <div className="mt-4">
            <a
              href="https://teddickey.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary hover:bg-primary/10 transition-all duration-300 group"
            >
              <span className="font-bold text-sm">Portfolio</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}