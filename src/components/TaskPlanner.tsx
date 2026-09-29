import React, { useState } from 'react';
import { Task, TaskCategory, Priority } from '../types';
import { Check, Trash2, Calendar, Search, Filter, Plus, Clock } from 'lucide-react';
import { sounds } from '../utils/sound';

interface TaskPlannerProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onOpenNewTask: () => void;
  soundEnabled: boolean;
}

export const TaskPlanner: React.FC<TaskPlannerProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onOpenNewTask,
  soundEnabled,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  const categories: TaskCategory[] = ['Engineering', 'Work', 'Personal', 'Ideas', 'Health'];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && !task.completed) ||
      (filterStatus === 'completed' && task.completed);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const handleToggle = (id: string) => {
    sounds.playCheck(soundEnabled);
    onToggleTask(id);
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case 'medium':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'low':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Controls & Metrics Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Tasks & Objectives</h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
            <span className="font-mono tabular-nums">{pendingCount} pending</span>
            <span>·</span>
            <span className="font-mono tabular-nums">{completedCount} completed</span>
            <span>·</span>
            <span>{tasks.length} total</span>
          </div>
        </div>

        <button
          onClick={onOpenNewTask}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Objective</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search objectives and tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-neutral-950/80 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Category & Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-neutral-950/80 border border-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterStatus === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterStatus === 'pending' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterStatus === 'completed' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Done
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-neutral-950/80 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20">
            <Clock className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-neutral-300">No tasks found</h3>
            <p className="text-xs text-neutral-500 mt-1">
              {searchQuery ? 'Try clearing your search query or filters' : 'Start your day by adding your first task.'}
            </p>
            <button
              onClick={onOpenNewTask}
              className="mt-4 px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              Create New Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-start sm:items-center justify-between p-4 bg-neutral-900/60 border rounded-xl transition-all duration-150 ${
                task.completed
                  ? 'border-neutral-800/40 bg-neutral-900/20 opacity-70'
                  : 'border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/90'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0 pr-4">
                {/* Custom Checkbox Button */}
                <button
                  type="button"
                  onClick={() => handleToggle(task.id)}
                  className={`mt-0.5 sm:mt-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    task.completed
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-neutral-700 hover:border-indigo-400 bg-neutral-950/60'
                  }`}
                  aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-medium transition-colors ${
                        task.completed ? 'line-through text-neutral-500' : 'text-neutral-100'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Clean unboxed metadata row */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-neutral-500">
                    <span className="text-neutral-400">{task.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{task.priority} priority</span>
                    {task.dueDate && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <Calendar className="w-3 h-3 text-neutral-500" />
                          <span>Due {task.dueDate}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                  title="Delete Task"
                  aria-label="Delete Task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
