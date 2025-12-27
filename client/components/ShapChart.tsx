import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface FeatureImportance {
  feature: string;
  value: number;
  impact: number;
}

interface ShapChartProps {
  features: FeatureImportance[];
}

const ShapChart: React.FC<ShapChartProps> = ({ features }) => {
  return (
    <div className="h-96 w-full bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Contribution (SHAP Values)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={features}
          margin={{
            top: 5,
            right: 30,
            left: 100, // Extra space for feature labels
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="feature" width={100} />
          <Tooltip 
            formatter={(value: any) => [Number(value).toFixed(4), 'Impact']}
            contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc' }}
          />
          <Bar dataKey="impact" name="Impact">
            {features.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.impact > 0 ? '#ef4444' : '#10b981'} // Red for > 0 (Risk/Denied), Green for < 0 (Safe/Approved)
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-center text-sm text-gray-500 space-x-4">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 mr-1"></span> Increases Risk (Denied)
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 mr-1"></span> Decreases Risk (Approved)
        </div>
      </div>
    </div>
  );
};

export default ShapChart;
