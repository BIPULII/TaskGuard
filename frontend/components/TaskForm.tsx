'use client';

import { useForm } from 'react-hook-form';
import { Task } from '@/types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function TaskForm({ task, onSubmit, isLoading = false }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'TODO',
      priority: task?.priority || 'MEDIUM',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title Field */}
      <div className="animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          Task Title *
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-300"
          placeholder="Enter task title"
        />
        {errors.title && <p className="text-red-400 text-sm mt-2">{errors.title.message}</p>}
      </div>

      {/* Description Field */}
      <div className="animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-300 resize-none"
          placeholder="Add task description (optional)"
          rows={4}
        />
      </div>

      {/* Status and Priority Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-300 cursor-pointer"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Priority
          </label>
          <select
            {...register('priority')}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-300 cursor-pointer"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {/* Due Date Field */}
      <div className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          Due Date
        </label>
        <input
          {...register('dueDate')}
          type="date"
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-300"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 animate-slideInLeft" style={{ animationDelay: '0.5s' }}>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{task ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <>
              <span>{task ? ' Update Task' : ' Create Task'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
