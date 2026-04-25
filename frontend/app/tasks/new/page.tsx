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

function CreateTaskPage() {
  const router = useRouter();
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
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
