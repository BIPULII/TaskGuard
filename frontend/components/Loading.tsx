'use client';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-75 animate-pulse"></div>
          <div className="relative w-16 h-16 rounded-full border-4 border-slate-700/50 border-t-cyan-500 animate-spin"></div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <p className="text-white font-semibold text-lg">Loading</p>
          <p className="text-slate-400 text-sm">Preparing your tasks...</p>
        </div>
      </div>
    </div>
  );
}
