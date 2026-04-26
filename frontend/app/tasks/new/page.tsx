'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TaskForm from '@/components/TaskForm';
import ErrorMessage from '@/components/ErrorMessage';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api';
import { withProtectedRoute } from '@/lib/withProtectedRoute';
import { useAuth } from '@/lib/useAuth';

function CreateTaskPage() {
  const router = useRouter();
  useAuth(); // Initialize auth and load token from localStorage
  const accessToken = useAuthStore((state) => state.accessToken);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setError('');
      setIsLoading(true);

      const payload = {
        title: data.title,
        description: data.description || undefined,
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      };

      await apiClient.post('/tasks', payload);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 p-8 backdrop-blur-xl animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">
                  Create New Task
                </h1>
                <p className="text-slate-400">Add a new task to your list</p>
              </div>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-200 hover:text-white rounded-lg hover:bg-slate-600/50 transition duration-300"
              >
                ✕ Cancel
              </Link>
            </div>

            <ErrorMessage message={error} />
            <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withProtectedRoute(CreateTaskPage);
