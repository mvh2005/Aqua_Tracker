import React, { useState } from 'react';
import { Plus, Droplets } from 'lucide-react';

interface ManualInputProps {
  onAdd: (amount: number) => void;
}

const ManualInput: React.FC<ManualInputProps> = ({ onAdd }) => {
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(amount);
    if (!isNaN(value) && value > 0) {
      onAdd(value);
      setAmount('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 flex items-center gap-4 group hover:border-slate-300 transition-all duration-300"
    >
      <div className="bg-white p-3 rounded-2xl text-cyan-600 group-hover:scale-110 transition-transform shadow-sm border border-slate-100">
        <Droplets size={20} />
      </div>
      <div className="flex-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
          Custom Amount
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="bg-transparent text-xl font-bold text-slate-900 w-full outline-none placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ml</span>
        </div>
      </div>
      <button
        type="submit"
        disabled={!amount || parseInt(amount) <= 0}
        className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 disabled:shadow-none"
      >
        <Plus size={20} strokeWidth={3} />
      </button>
    </form>
  );
};

export default ManualInput;
