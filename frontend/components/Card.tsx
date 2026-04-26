import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export default function Card({ children, className = '', animate = true }: CardProps) {
  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 ${
        animate ? 'animate-fadeIn' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
