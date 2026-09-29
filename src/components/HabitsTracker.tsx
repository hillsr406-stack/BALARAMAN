import React, { useState } from 'react';
import { Habit } from '../types';
import { Flame, Plus, Check, Trash2 } from 'lucide-react';
import { sounds } from '../utils/sound';

interface HabitsTrackerProps {
  habits: Habit[];
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
  onAddHabit: (title: string, iconName: string, color: string) => void;
  onDeleteHabit: (habitId: string) => void;
  soundEnabled: boolean;
}

export const HabitsTracker: React.FC<HabitsTrackerProps> = ({
  habits,
  onToggleHabitDay,
  onAddHabit,
  onDeleteHabit,
  soundEnabled,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Generate last 7 days including today
  const days: { dateStr: string; dayName: string; dayNumber: string; isToday: boolean }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate().toString();
    days.push({
      dateStr,
      dayName,
      dayNumber,
      isToday: i === 0,
    });
  }

  const handleToggle = (habitId: string, dateStr: string) => {
    sounds.playCheck(soundEnabled);
    onToggleHabitDay(habitId, dateStr);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddHabit(newTitle.trim(), 'Zap', '#6366f1');
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Daily Habit Streaks</h2>
          <p className="text-xs text-neutral-400 mt-1">Consistency builds momentum. Track your daily rituals.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Habit</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center gap-3">
          <input
            type="text"
            required
            placeholder="e.g. Read 20 pages, 30 min cardio, Code 1 hour"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Habits Table */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 p-4 border-b border-neutral-800/80 text-xs font-medium text-neutral-400">
          <div className="col-span-5 sm:col-span-4">Habit</div>
          <div className="col-span-7 sm:col-span-6 grid grid-cols-7 gap-1 text-center">
            {days.map((d) => (
              <div key={d.dateStr} className={`text-[11px] ${d.isToday ? 'text-indigo-400 font-semibold' : ''}`}>
                <div>{d.dayName}</div>
                <div className="font-mono text-[10px] text-neutral-500">{d.dayNumber}</div>
              </div>
            ))}
          </div>
          <div className="hidden sm:block sm:col-span-2 text-right pr-2">Streak</div>
        </div>

        {/* Habits Rows */}
        <div className="divide-y divide-neutral-800/50">
          {habits.map((habit) => {
            return (
              <div key={habit.id} className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-neutral-900/40 transition-colors">
                <div className="col-span-5 sm:col-span-4 flex items-center justify-between pr-2">
                  <span className="text-xs sm:text-sm font-medium text-neutral-200 truncate">{habit.title}</span>
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="p-1 text-neutral-600 hover:text-rose-400 transition-colors cursor-pointer sm:hidden"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="col-span-7 sm:col-span-6 grid grid-cols-7 gap-1">
                  {days.map((d) => {
                    const done = !!habit.history[d.dateStr];
                    return (
                      <button
                        key={d.dateStr}
                        onClick={() => handleToggle(habit.id, d.dateStr)}
                        className={`aspect-square w-full max-w-8 mx-auto rounded-md flex items-center justify-center transition-all cursor-pointer ${
                          done
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 text-transparent'
                        }`}
                        title={`${habit.title} - ${d.dateStr} (${done ? 'Done' : 'Incomplete'})`}
                      >
                        {done && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                <div className="hidden sm:flex sm:col-span-2 items-center justify-end gap-3 pr-2">
                  <div className="flex items-center gap-1 text-xs font-mono tabular-nums text-amber-400">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{habit.streak}d</span>
                  </div>
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="p-1 text-neutral-600 hover:text-rose-400 rounded transition-colors cursor-pointer"
                    title="Delete habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
