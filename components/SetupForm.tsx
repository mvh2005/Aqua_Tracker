import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, Climate, WeightUnit } from '../types';
import { calculateHydrationGoal } from '../utils/calculations';
import { User, Activity, Ruler, Weight, Cloud, Coffee, Activity as ExerciseIcon, HeartPulse } from 'lucide-react';

interface SetupFormProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

const SetupForm: React.FC<SetupFormProps> = ({ onComplete, initialProfile }) => {
  const [formData, setFormData] = useState<Omit<UserProfile, 'dailyGoal'>>({
    name: initialProfile?.name || '',
    age: initialProfile?.age || 25,
    weight: initialProfile?.weight || 70,
    weightUnit: initialProfile?.weightUnit || WeightUnit.KG,
    height: initialProfile?.height || 170,
    gender: initialProfile?.gender || Gender.MALE,
    activityLevel: initialProfile?.activityLevel || ActivityLevel.LIGHT,
    exerciseMinutesPerSession: initialProfile?.exerciseMinutesPerSession || 45,
    exerciseDaysPerWeek: initialProfile?.exerciseDaysPerWeek || 3,
    climate: initialProfile?.climate || Climate.MODERATE,
    caffeineCups: initialProfile?.caffeineCups || 1,
    sodaCans: initialProfile?.sodaCans || 0,
    hasMedicalCondition: initialProfile?.hasMedicalCondition || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dailyGoal = calculateHydrationGoal(formData);
    onComplete({ ...formData, dailyGoal });
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-slate-100 text-slate-900 rounded-3xl mb-6 shadow-sm border border-slate-100">
          <Activity size={32} strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tighter">Profile Configuration</h2>
        <p className="text-slate-400 text-sm tracking-wide">Enter your biological metrics for precision calculation.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section: Basic Info */}
        <div className="space-y-6">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
            <User size={14} className="text-slate-300" /> Identity & Vitality
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Full Name"
              className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-slate-400 focus:bg-white outline-none text-slate-900 font-medium transition-all shadow-inner"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            <input
              type="number"
              placeholder="Age"
              className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-slate-400 focus:bg-white outline-none text-slate-900 font-medium transition-all shadow-inner"
              value={formData.age}
              onChange={(e) => updateField('age', parseInt(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-slate-400 focus:bg-white outline-none text-slate-900 font-medium appearance-none transition-all shadow-inner"
              value={formData.gender}
              onChange={(e) => updateField('gender', e.target.value as Gender)}
            >
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
              <option value={Gender.OTHER}>Other</option>
            </select>
            <div className="flex gap-2">
               <input
                type="number"
                placeholder="Weight"
                className="flex-1 px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-slate-400 focus:bg-white outline-none text-slate-900 font-medium transition-all shadow-inner"
                value={formData.weight}
                onChange={(e) => updateField('weight', parseFloat(e.target.value))}
              />
              <select
                className="w-24 px-3 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-slate-400 focus:bg-white outline-none text-slate-900 font-medium appearance-none transition-all shadow-inner"
                value={formData.weightUnit}
                onChange={(e) => updateField('weightUnit', e.target.value as WeightUnit)}
              >
                <option value={WeightUnit.KG}>kg</option>
                <option value={WeightUnit.LBS}>lbs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Lifestyle */}
        <div className="space-y-6">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
            <ExerciseIcon size={14} className="text-slate-300" /> Metabolism & Active Load
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">Daily Activity</span>
              <select
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-slate-400 focus:bg-white outline-none text-slate-900 font-medium appearance-none transition-all shadow-inner"
                value={formData.activityLevel}
                onChange={(e) => updateField('activityLevel', e.target.value as ActivityLevel)}
              >
                <option value={ActivityLevel.SEDENTARY}>Sedentary</option>
                <option value={ActivityLevel.LIGHT}>Lightly Active</option>
                <option value={ActivityLevel.MODERATE}>Moderately Active</option>
                <option value={ActivityLevel.ACTIVE}>Very Active</option>
              </select>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">Caffeine Frequency (Cups)</span>
              <div className="flex items-center gap-3 px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
                <Coffee size={18} className="text-slate-400" />
                <input
                  type="number"
                  className="bg-transparent w-full text-slate-900 font-medium outline-none"
                  value={formData.caffeineCups}
                  onChange={(e) => updateField('caffeineCups', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">Soda Consumption (Cans)</span>
              <div className="flex items-center gap-3 px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
                <Activity size={18} className="text-slate-400" />
                <input
                  type="number"
                  className="bg-transparent w-full text-slate-900 font-medium outline-none"
                  value={formData.sodaCans}
                  onChange={(e) => updateField('sodaCans', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Environment */}
        <div className="space-y-6">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
            <Cloud size={14} className="text-slate-300" /> Environmental Constants
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">Current Climate</span>
              <select
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-slate-400 focus:bg-white outline-none text-slate-900 font-medium appearance-none transition-all shadow-inner"
                value={formData.climate}
                onChange={(e) => updateField('climate', e.target.value as Climate)}
              >
                <option value={Climate.MODERATE}>Moderate</option>
                <option value={Climate.HOT_HUMID}>Hot/Humid</option>
                <option value={Climate.COLD}>Cold</option>
                <option value={Climate.HIGH_ALTITUDE}>High Altitude</option>
              </select>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-6 rounded-2xl transition-colors hover:border-slate-200">
              <div className={`p-4 rounded-xl shadow-inner transition-colors ${formData.hasMedicalCondition ? 'bg-red-50 text-red-600' : 'bg-white text-slate-300'}`}>
                <HeartPulse size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 tracking-tight">Clinical Conditions</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Impact factor</p>
              </div>
              <input
                type="checkbox"
                className="w-6 h-6 rounded-lg bg-white border-slate-200 text-slate-900 focus:ring-slate-900 transition-all cursor-pointer"
                checked={formData.hasMedicalCondition}
                onChange={(e) => updateField('hasMedicalCondition', e.target.checked)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-black text-white font-bold py-6 rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg group"
        >
          Initialize Plan
          <div className="w-6 h-[1px] bg-white/30 group-hover:w-10 transition-all" />
        </button>
      </form>
    </div>
  );
};

export default SetupForm;
