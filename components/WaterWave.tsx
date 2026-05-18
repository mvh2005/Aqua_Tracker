import React from 'react';

export default function WaterWave({ percentage }: { percentage: number }) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const fillLevel = 100 - clamped;

  return (
    <div className="relative w-72 h-72">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-slate-100 rounded-full blur-[60px] animate-pulse" />
      
      {/* Main Container */}
      <div className="relative w-full h-full rounded-full border border-slate-100 bg-white overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05),inset_0_0_20px_rgba(0,0,0,0.02)]">
        
        {/* Fill Layer */}
        <div 
          className="absolute inset-0 transition-transform duration-[1500ms] cubic-bezier(0.4, 0, 0.2, 1)" 
          style={{ transform: `translateY(${fillLevel}%)` }}
        >
          {/* Wave Surface */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-cyan-400 opacity-40 blur-xl -translate-y-1/2" />
          
          {/* Main Body */}
          <div className="w-full h-[200%] bg-gradient-to-b from-cyan-400 to-cyan-600 shadow-[inset_0_10px_20px_rgba(255,255,255,0.3)]" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.4em] mb-2">
            Progress
          </span>
          <div className="flex items-baseline">
            <span className="text-7xl font-bold text-slate-900 tracking-tighter">
              {Math.round(clamped)}
            </span>
            <span className="text-2xl font-bold text-slate-200 ml-1">%</span>
          </div>
        </div>

        {/* Glass Reflection */}
        <div className="absolute top-4 left-1/4 w-1/2 h-4 bg-white/40 blur-md rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
