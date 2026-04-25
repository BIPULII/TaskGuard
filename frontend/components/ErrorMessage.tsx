'use client';

import { ReactNode } from 'react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {message}
    </div>
  );
}
