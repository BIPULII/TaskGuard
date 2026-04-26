import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  loadingText?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  loading = false,
  loadingText = 'Loading...',
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40',
    secondary: 'border border-slate-600/50 hover:border-slate-500 text-slate-200 hover:text-white hover:bg-slate-700/30',
    danger: 'bg-slate-700/50 hover:bg-red-600/80 text-slate-200 hover:text-white border border-slate-600/50 hover:border-red-600/50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-3 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ${variantClasses[variant]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center space-x-2">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
