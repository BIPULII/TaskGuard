'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TaskForm from '@/components/TaskForm';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api';
import { Task } from '@/types';
import { withProtectedRoute } from '@/lib/withProtectedRoute';

function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const accessToken = useAuthStore((state) => state.accessToken);
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!accessToken || !taskId) return;

    const fetchTask = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await apiClient.get(`/tasks/${taskId}`);
        setTask(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch task');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [accessToken, taskId]);

  const handleSubmit = async (data: any) => {
    try {
      setError('');
      setIsSubmitting(true);

      const payload = {
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      };

      await apiClient.put(`/tasks/${taskId}`, payload);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!task) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <ErrorMessage message={error || 'Task not found'} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </Link>
            </div>

            <ErrorMessage message={error} />
            <TaskForm task={task} onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withProtectedRoute(EditTaskPage);
