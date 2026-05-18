import React from 'react';
import { 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { DailySummary } from '../types';

interface HistoryChartProps {
  data: DailySummary[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const maxVal = Math.max(...data.map(d => Math.max(d.total, d.goal)), 1000);
  const processedData = data.map((item) => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' }),
    isGoalMet: item.total >= item.goal
  }));

  return (
    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 h-80 shadow-sm group">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Performance History</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={processedData}>
          <XAxis 
            dataKey="displayDate" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }} 
            dy={10}
          />
          <YAxis hide domain={[0, maxVal * 1.1]} />
          <Tooltip 
            cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white/90 backdrop-blur-xl text-slate-900 p-4 rounded-2xl text-[10px] shadow-2xl border border-slate-100 uppercase tracking-widest font-bold">
                    <p className="mb-2 text-slate-400">{item.displayDate}</p>
                    <p className="text-cyan-600">{item.total}ml <span className="text-slate-300">/ {item.goal}ml</span></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="total" radius={[4, 4, 4, 4]} barSize={16}>
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.total >= entry.goal ? '#0891b2' : '#e2e8f0'} 
                className="transition-all duration-500 hover:opacity-80"
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;