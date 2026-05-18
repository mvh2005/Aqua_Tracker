import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  count: number;
  size?: 'sm' | 'lg';
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ count, size = 'sm' }) => {
  if (count === 0 && size === 'sm') return null;
  const isLarge = size === 'lg';

  return (
    <div className={`flex items-center gap-2 rounded-2xl font-bold transition-all ${
      isLarge 
        ? 'flex-col gap-6 py-4' 
        : 'bg-orange-50 text-orange-600 px-4 py-2 border border-orange-100'
    }`}>
      <div className={`${isLarge ? 'bg-orange-50 p-6 rounded-[2rem] border border-orange-100 shadow-sm' : ''}`}>
        <Flame className={`${isLarge ? 'w-10 h-10 text-orange-600' : 'w-4 h-4 fill-current'}`} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col items-center">
        <span className={isLarge ? 'text-6xl text-slate-900 tracking-tighter' : 'text-xs tracking-tight'}>
          {count}
        </span>
        {isLarge && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Active Day Streak</span>}
        {!isLarge && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 hidden sm:inline">Days</span>}
      </div>
    </div>
  );
};

export default StreakBadge;