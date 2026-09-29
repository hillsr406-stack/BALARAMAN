import React, { useState, useEffect } from 'react';
import { Task, Habit, Note, UserProfile, ViewTab } from '../types';
import { Timer, CheckSquare, Flame, FileText, ArrowRight, Check, Play, Pause } from 'lucide-react';
import { sounds } from '../utils/sound';

interface DashboardViewProps {
  userProfile: UserProfile;
  tasks: Task[];
  habits: Habit[];
  notes: Note[];
  onSelectTab: (tab: ViewTab) => void;
  onToggleTask: (id: string) => void;
  onToggleHabitToday: (habitId: string) => void;
  onOpenNewTask: () => void;
  onQuickSaveNote: (title: string, content: string) => void;
  soundEnabled: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  tasks,
  habits,
  notes,
  onSelectTab,
  onToggleTask,
  onToggleHabitToday,
  onOpenNewTask,
  onQuickSaveNote,
  soundEnabled,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickNoteSaved, setQuickNoteSaved] = useState(false);

  // Quick mini timer state
  const [miniTimerRunning, setMiniTimerRunning] = useState(false);
  const [miniTimerSeconds, setMiniTimerSeconds] = useState(25 * 60);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (miniTimerRunning && miniTimerSeconds > 0) {
      timer = setInterval(() => setMiniTimerSeconds((prev) => prev - 1), 1000);
    } else if (miniTimerSeconds === 0 && miniTimerRunning) {
      sounds.playAlarm(soundEnabled);
      setMiniTimerRunning(false);
      setMiniTimerSeconds(25 * 60);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [miniTimerRunning, miniTimerSeconds, soundEnabled]);

  const todayStr = currentTime.toISOString().split('T')[0];
  const hour = currentTime.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const pendingTasks = tasks.filter((t) => !t.completed);
  const highPriorityPending = pendingTasks.filter((t) => t.priority === 'high');
  const todayHabitsDone = habits.filter((h) => !!h.history[todayStr]).length;
  const habitCompletionPercent = habits.length > 0 ? Math.round((todayHabitsDone / habits.length) * 100) : 0;

  const handleTaskCheck = (id: string) => {
    sounds.playCheck(soundEnabled);
    onToggleTask(id);
  };

  const handleHabitCheck = (habitId: string) => {
    sounds.playCheck(soundEnabled);
    onToggleHabitToday(habitId);
  };

  const handleSaveQuickNote = () => {
    if (!quickNoteText.trim()) return;
    const lines = quickNoteText.trim().split('\n');
    const title = lines[0].slice(0, 40) || 'Quick Scratchpad Note';
    onQuickSaveNote(title, quickNoteText.trim());
    setQuickNoteText('');
    setQuickNoteSaved(true);
    sounds.playCheck(soundEnabled);
    setTimeout(() => setQuickNoteSaved(false), 2000);
  };

  const timerMin = Math.floor(miniTimerSeconds / 60);
  const timerSec = miniTimerSeconds % 60;
  const formattedTimer = `${String(timerMin).padStart(2, '0')}:${String(timerSec).padStart(2, '0')}`;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Welcome Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-neutral-900/90 border border-neutral-800 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>STUDIO ONLINE</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {currentTime.toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {greeting}, {userProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              You have <span className="text-indigo-300 font-semibold">{pendingTasks.length} pending objectives</span> and {highPriorityPending.length} high-priority targets lined up for today.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-5 py-3 bg-neutral-950/80 border border-neutral-800/80 rounded-xl text-right">
              <span className="text-[10px] uppercase font-mono text-neutral-500 block">Local Time</span>
              <span className="text-2xl font-mono font-bold tracking-tight text-white tabular-nums">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stat Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-800/60">
          <div 
            onClick={() => onSelectTab('tasks')}
            className="p-3.5 bg-neutral-950/40 border border-neutral-800/60 hover:border-neutral-700 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">Pending Tasks</span>
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {pendingTasks.length}
            </div>
          </div>

          <div 
            onClick={() => onSelectTab('focus')}
            className="p-3.5 bg-neutral-950/40 border border-neutral-800/60 hover:border-neutral-700 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">Daily Target</span>
              <Timer className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {userProfile.dailyGoalSessions} Sessions
            </div>
          </div>

          <div 
            onClick={() => onSelectTab('habits')}
            className="p-3.5 bg-neutral-950/40 border border-neutral-800/60 hover:border-neutral-700 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">Habits Done</span>
              <Flame className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {habitCompletionPercent}%
            </div>
          </div>

          <div 
            onClick={() => onSelectTab('notes')}
            className="p-3.5 bg-neutral-950/40 border border-neutral-800/60 hover:border-neutral-700 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-xs font-medium">Notes Pinned</span>
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {notes.filter((n) => n.pinned).length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Priorities & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Priority Objectives */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Today's Focus Objectives</h3>
                <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                  {pendingTasks.slice(0, 4).length} items
                </span>
              </div>
              <button
                onClick={() => onSelectTab('tasks')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>All Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {pendingTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-neutral-950/60 border border-neutral-800/70 hover:border-neutral-700 rounded-lg transition-colors group"
                >
                  <button
                    onClick={() => handleTaskCheck(task.id)}
                    className="mt-0.5 w-4 h-4 rounded border border-neutral-700 hover:border-indigo-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    aria-label="Complete task"
                  >
                    {task.completed && <Check className="w-3 h-3 text-indigo-400" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-neutral-200 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-500 font-mono">
                      <span>{task.category}</span>
                      <span>·</span>
                      <span className={task.priority === 'high' ? 'text-rose-400' : 'text-neutral-400'}>
                        {task.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {pendingTasks.length === 0 && (
                <div className="py-8 text-center text-xs text-neutral-500">
                  All tasks are cleared for today! Enjoy your progress.
                </div>
              )}
            </div>

            <button
              onClick={onOpenNewTask}
              className="w-full mt-4 py-2 border border-dashed border-neutral-800 hover:border-neutral-700 rounded-lg text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-center"
            >
              + Add Objective to Today's Agenda
            </button>
          </div>

          {/* Quick Scratchpad Box */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white tracking-tight">Quick Scratchpad</h3>
              <span className="text-[10px] text-neutral-500">Auto-saves to Notes</span>
            </div>
            <textarea
              rows={3}
              value={quickNoteText}
              onChange={(e) => setQuickNoteText(e.target.value)}
              placeholder="Jot down a quick thought, link, or snippet..."
              className="w-full px-3 py-2 bg-neutral-950/80 border border-neutral-800 rounded-lg text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 font-mono resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-neutral-500">
                {quickNoteSaved ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <Check className="w-3 h-3" /> Saved to Notes
                  </span>
                ) : (
                  'Press Save to store in notebook'
                )}
              </span>
              <button
                onClick={handleSaveQuickNote}
                disabled={!quickNoteText.trim()}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Focus Timer Widget & Daily Habits */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Focus Pomodoro Widget */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white tracking-tight">Focus Session</h3>
              <button
                onClick={() => onSelectTab('focus')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
              >
                Open Full Timer
              </button>
            </div>

            <div className="p-4 bg-neutral-950/70 border border-neutral-800/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">Current Block</span>
                <span className="text-3xl font-mono font-bold text-white tabular-nums tracking-tight">
                  {formattedTimer}
                </span>
              </div>
              <button
                onClick={() => setMiniTimerRunning(!miniTimerRunning)}
                className="p-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                title={miniTimerRunning ? 'Pause' : 'Start'}
              >
                {miniTimerRunning ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Daily Habit Checklist for Today */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">Daily Habit Routine</h3>
              <button
                onClick={() => onSelectTab('habits')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
              >
                Habits Matrix
              </button>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => {
                const done = !!habit.history[todayStr];
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleHabitCheck(habit.id)}
                    className="flex items-center justify-between p-3 bg-neutral-950/60 border border-neutral-800/70 hover:border-neutral-700 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          done
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-neutral-700 bg-neutral-900'
                        }`}
                      >
                        {done && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-medium ${done ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                        {habit.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>{habit.streak}d</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
