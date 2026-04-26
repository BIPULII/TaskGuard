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

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { border: string; shadow: string; icon: string; bg: string; text: string; gradient: string } } = {
      blue: {
        border: 'hover:border-blue-500/50',
        shadow: 'hover:shadow-blue-500/10',
        icon: 'text-blue-400',
        bg: 'bg-blue-500/10',
        text: 'text-blue-300',
        gradient: 'from-blue-400 to-blue-600',
      },
      emerald: {
        border: 'hover:border-emerald-500/50',
        shadow: 'hover:shadow-emerald-500/10',
        icon: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-300',
        gradient: 'from-emerald-400 to-emerald-600',
      },
      yellow: {
        border: 'hover:border-yellow-500/50',
        shadow: 'hover:shadow-yellow-500/10',
        icon: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-300',
        gradient: 'from-yellow-400 to-yellow-600',
      },
      red: {
        border: 'hover:border-red-500/50',
        shadow: 'hover:shadow-red-500/10',
        icon: 'text-red-400',
        bg: 'bg-red-500/10',
        text: 'text-red-300',
        gradient: 'from-red-400 to-red-600',
      },
      orange: {
        border: 'hover:border-orange-500/50',
        shadow: 'hover:shadow-orange-500/10',
        icon: 'text-orange-400',
        bg: 'bg-orange-500/10',
        text: 'text-orange-300',
        gradient: 'from-orange-400 to-orange-600',
      },
      purple: {
        border: 'hover:border-purple-500/50',
        shadow: 'hover:shadow-purple-500/10',
        icon: 'text-purple-400',
        bg: 'bg-purple-500/10',
        text: 'text-purple-300',
        gradient: 'from-purple-400 to-purple-600',
      },
    };
    return colorMap[color] || colorMap['blue'];
  };

  const StatCard = ({ icon, label, value, color }: any) => {
    const colorClasses = getColorClasses(color);
    return (
      <div className={`group bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 ${colorClasses.border} p-6 hover:shadow-lg ${colorClasses.shadow} transition duration-300 animate-fadeIn`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-4xl ${colorClasses.icon}`}>{icon}</span>
          <div className={`px-3 py-1 rounded-full ${colorClasses.bg} ${colorClasses.text} text-xs font-semibold`}>
            {label}
          </div>
        </div>
        <p className={`text-4xl font-bold bg-gradient-to-r ${colorClasses.gradient} bg-clip-text text-transparent`}>
          {value}
        </p>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && <ErrorMessage message={error} />}

          {/* Welcome Section */}
          <div className="mb-10 animate-slideInRight">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-slate-400 text-lg">
              Stay on top of your tasks and boost your productivity
            </p>
          </div>

          {/* Stats Section */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
              <StatCard icon="" label="Total" value={stats.totalTasks} color="blue" />
              <StatCard icon="" label="Completed" value={stats.completedTasks} color="emerald" />
              <StatCard icon="" label="Pending" value={stats.pendingTasks} color="yellow" />
              <StatCard icon="" label="High Priority" value={stats.highPriorityTasks} color="red" />
              <StatCard icon="" label="Overdue" value={stats.overdueTasks} color="orange" />
              <StatCard icon="" label="Today" value={stats.todayTasks} color="purple" />
            </div>
          )}

          {/* Filters and Create Button */}
          <div className="flex flex-col md:flex-row gap-3 mb-8 animate-slideInRight" style={{ animationDelay: '0.1s' }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-300 cursor-pointer"
            >
              <option value=""> All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-300 cursor-pointer"
            >
              <option value=""> All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <Link
              href="/tasks/new"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 md:ml-auto whitespace-nowrap text-center"
            >
              Create Task
            </Link>
          </div>

          {/* Tasks Section */}
          <div className="animate-slideInRight" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center space-x-2">
                <span></span>
                <span>Your Tasks</span>
              </h2>
              {tasks.length > 0 && (
                <span className="px-4 py-2 bg-slate-700/50 text-slate-200 rounded-lg border border-slate-600/50 text-sm font-medium">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {tasks.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-slate-300 text-lg mb-6 font-medium">No tasks yet</p>
                <p className="text-slate-400 mb-8">Create your first task to get started</p>
                <Link
                  href="/tasks/new"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition duration-300 shadow-lg shadow-blue-500/20"
                >
                  Create First Task
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tasks.map((task, index) => (
                  <div key={task.id} style={{ animationDelay: `${0.1 * (index + 1)}s` }} className="animate-fadeIn">
                    <TaskCard
                      task={task}
                      onDelete={handleDelete}
                      isDeleting={deletingId === task.id}
                    />
                  </div>
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
