import React from 'react';
import { GraduationCap } from 'lucide-react';
import type { LearningMode } from '../../api/types';

const OPTIONS: { value: LearningMode; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'normal', label: 'Normal' },
  { value: 'advanced', label: 'Advanced' },
];

interface LearningModeSelectProps {
  value: LearningMode;
  onChange: (mode: LearningMode) => void;
  disabled?: boolean;
}

export const LearningModeSelect: React.FC<LearningModeSelectProps> = ({
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className="relative flex items-center">
      <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as LearningMode)}
        className="appearance-none bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-8 text-xs font-medium text-white hover:border-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors disabled:opacity-50 cursor-pointer"
        title="Learning mode"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0f172a] text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
