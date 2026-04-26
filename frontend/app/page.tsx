'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useAuth } from '@/lib/useAuth';

export default function Home() {
  const router = useRouter();
  useAuth(); // Initialize auth
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      router.push('/dashboard');
    }
  }, [accessToken, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Logo/Brand */}
        <div className="mb-8 inline-block animate-slideInRight">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-75"></div>
            <div className="relative px-6 py-4 bg-slate-900 rounded-2xl">
              <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                TaskGuard
              </span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
          Master Your Tasks
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
          Stay organized, productive, and secure with TaskGuard. A modern task management system built with security at its core.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
          <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full text-sm font-medium">
            Secure
          </span>
          <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium">
            Fast
          </span>
          <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full text-sm font-medium">
            Modern
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/login"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 border-2 border-slate-600 hover:border-slate-500 text-slate-200 hover:text-white font-semibold rounded-lg transition duration-300 hover:bg-slate-700/30"
          >
            Create Account
          </Link>
        </div>

        {/* Footer Text */}
        <p className="mt-12 text-slate-500 text-sm animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          © 2026 TaskGuard. Built with security, performance, and user experience in mind.
        </p>
      </div>
    </div>
  );
}
