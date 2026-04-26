'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api';
import { Task, TaskStats } from '@/types';
import { withProtectedRoute } from '@/lib/withProtectedRoute';
import { useAuth } from '@/lib/useAuth';

function DashboardPage() {
  const router = useRouter();
  useAuth(); // Initialize auth and load token from localStorage
  const accessToken = useAuthStore((state) => state.accessToken);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [accessToken, router, filterStatus, filterPriority]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterPriority) params.append('priority', filterPriority);

      const [tasksRes, statsRes] = await Promise.all([
        apiClient.get(`/tasks?${params.toString()}`),
        apiClient.get('/tasks/stats'),
      ]);

      setTasks(tasksRes.data.tasks);
      setStats(statsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setDeletingId(taskId);
      await apiClient.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading && !stats) {
    return <Loading />;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && <ErrorMessage message={error} />}

          {/* Stats Section */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalTasks}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingTasks}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm">High Priority</p>
                <p className="text-3xl font-bold text-red-600">{stats.highPriorityTasks}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm">Overdue</p>
                <p className="text-3xl font-bold text-orange-600">{stats.overdueTasks}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm">Due Today</p>
                <p className="text-3xl font-bold text-purple-600">{stats.todayTasks}</p>
              </div>
            </div>
          )}

          {/* Filters and Create Button */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <Link
              href="/tasks/new"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ml-auto"
            >
              Create Task
            </Link>
          </div>

          {/* Tasks Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tasks</h2>
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No tasks yet</p>
                <Link
                  href="/tasks/new"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create your first task
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    isDeleting={deletingId === task.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withProtectedRoute(DashboardPage);
