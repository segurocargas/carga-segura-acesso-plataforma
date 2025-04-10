import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string; }[];
  showCheck?: boolean;
  isCity?: boolean;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, showCheck = false, isCity = false, placeholder, ...props }) => {
  if (isCity) {
    return (
      <div>
        <label className="block text-base font-medium text-gray-200 mb-2">{label}</label>
        <div className="relative">
          <input
            type="text"
            className="w-full h-14 px-4 pr-12 border border-[#404040] rounded-xl bg-[#1a1a1a] text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent text-base"
            placeholder={placeholder || options[0]?.label || 'Digite a cidade'}
            {...props}
          />
          {showCheck && props.value && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Check className="text-[#4CAF50]" size={20} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-base font-medium text-gray-200 mb-2">{label}</label>
      <div className="relative">
        <select
          className="w-full h-14 px-4 pr-12 border border-[#404040] rounded-xl bg-[#1a1a1a] text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent text-base"
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {showCheck && props.value && (
            <Check className="text-[#4CAF50]" size={20} />
          )}
          <ChevronDown className="text-gray-400" size={20} />
        </div>
      </div>
    </div>
  );
};