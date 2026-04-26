import React from 'react';

interface FormInputProps {
  id: string;
  type?: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  animationDelay?: string;
}

export default function FormInput({
  id,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  error,
  animationDelay = '0s',
}: FormInputProps) {
  return (
    <div style={{ animationDelay }} className={`${animationDelay ? 'animate-slideInLeft' : ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-200 mb-2">
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-300 ${className}`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
