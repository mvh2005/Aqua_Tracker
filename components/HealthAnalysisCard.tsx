import React from 'react';
import { Activity, Zap, Brain, ShieldCheck } from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { UserProfile } from '../types';

interface HealthAnalysisCardProps {
  profile: UserProfile;
  currentIntake: number;
}

const HealthAnalysisCard: React.FC<HealthAnalysisCardProps> = ({ profile, currentIntake }) => {
  const percentage = Math.min((currentIntake / profile.dailyGoal) * 100, 100);
  
  // Simulated physiological metrics based on hydration progress
  const metrics = [
    { subject: 'Cellular Vol', A: percentage, fullMark: 100 },
    { subject: 'Metabolism', A: Math.max(20, percentage * 0.9), fullMark: 100 },
    { subject: 'Focus', A: Math.max(10, percentage * 0.8), fullMark: 100 },
    { subject: 'Kidney Filter', A: percentage >= 50 ? 90 : percentage + 20, fullMark: 100 },
    { subject: 'ATP Energy', A: Math.max(30, percentage * 0.95), fullMark: 100 },
  ];

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 shadow-lg p-3 rounded-2xl text-white">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Bio-Metric Analysis</h3>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time Physiological Sync</p>
          </div>
        </div>
        <div className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100 uppercase tracking-widest">
           {percentage.toFixed(0)}% Opt
        </div>
      </div>

      <div className="h-64 w-full relative z-10 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metrics}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 8, fontWeight: 700, letterSpacing: '0.1em' }}
            />
            <Radar
              name="Health"
              dataKey="A"
              stroke="#0891b2"
              fill="#06b6d4"
              fillOpacity={0.2}
              animationDuration={1500}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 shadow-sm">
          <Zap size={14} className="text-yellow-600/50" />
          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Energy</div>
          <div className="text-xs font-bold text-slate-900">{(percentage * 0.95).toFixed(0)}%</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 shadow-sm">
          <Brain size={14} className="text-purple-600/50" />
          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Cognitive</div>
          <div className="text-xs font-bold text-slate-900">{(percentage * 0.8).toFixed(0)}%</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 shadow-sm">
          <ShieldCheck size={14} className="text-emerald-600/50" />
          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Immune</div>
          <div className="text-xs font-bold text-slate-900">{(40 + percentage * 0.6).toFixed(0)}%</div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${currentIntake > 0 ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Neural Analysis Active</span>
         </div>
         <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            REF: ISO-2026-PHY
         </div>
      </div>
    </div>
  );
};

export default HealthAnalysisCard;
