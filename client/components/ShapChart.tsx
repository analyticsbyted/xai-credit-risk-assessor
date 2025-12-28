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
    <div className="h-96 w-full glass p-6 rounded-2xl border border-border mt-4">
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        Individual Feature Impact Scores
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          layout="vertical"
          data={features}
          margin={{
            top: 5,
            right: 30,
            left: 100,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
          <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(val) => val.toFixed(2)} />
          <YAxis type="category" dataKey="feature" width={100} stroke="var(--muted-foreground)" fontSize={12} />
          <Tooltip
            formatter={(value: any) => [Number(value).toFixed(4), 'SHAP Value']}
            contentStyle={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              borderRadius: '12px',
              color: 'var(--foreground)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
          <Bar dataKey="impact" name="Impact" radius={[0, 4, 4, 0]}>
            {features.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.impact > 0 ? '#f43f5e' : '#10b981'} // Rose-500 and Emerald-500
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          <span>Increases Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span>Decreases Risk</span>
        </div>
      </div>
    </div>
  );
};

export default ShapChart;
