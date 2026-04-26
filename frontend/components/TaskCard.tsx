'use client';

import Link from 'next/link';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => Promise<void>;
  isDeleting?: boolean;
}

export default function TaskCard({ task, onDelete, isDeleting = false }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'LOW':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      default:
        return 'bg-slate-600/20 text-slate-300 border border-slate-600/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'IN_PROGRESS':
        return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
      case 'TODO':
        return 'bg-slate-600/20 text-slate-300 border border-slate-600/30';
      default:
        return 'bg-slate-600/20 text-slate-300 border border-slate-600/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'H';
      case 'MEDIUM':
        return 'M';
      case 'LOW':
        return 'L';
      default:
        return '·';
    }
  };

  return (
    <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 p-5 hover:shadow-2xl hover:shadow-cyan-500/10 transition duration-300 animate-fadeIn hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-slate-100 flex-1 group-hover:text-white transition line-clamp-2">{task.title}</h3>
        <div className="flex space-x-2 ml-3">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
            <span>{getPriorityIcon(task.priority)}</span>
            <span>{task.priority}</span>
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-slate-400 text-sm mb-3 line-clamp-2 group-hover:text-slate-300 transition">{task.description}</p>
      )}

      {task.dueDate && (
        <div className="flex items-center text-slate-500 text-xs mb-4 space-x-2">
          <span>Due:</span>
          <span>
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-slate-700/50">
        <Link
          href={`/tasks/${task.id}/edit`}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition duration-300 text-center shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(task.id)}
          disabled={isDeleting}
          className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-red-600/80 text-slate-200 hover:text-white text-sm font-medium rounded-lg disabled:opacity-50 transition duration-300 border border-slate-600/50 hover:border-red-600/50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
