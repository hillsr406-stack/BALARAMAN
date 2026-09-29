import { useState, useEffect } from 'react';
import { ViewTab, Task, Note, Habit, UserProfile } from './types';
import { initialUserProfile, initialTasks, initialNotes, initialHabits } from './utils/initialData';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TaskPlanner } from './components/TaskPlanner';
import { FocusTimer } from './components/FocusTimer';
import { NotesScratchpad } from './components/NotesScratchpad';
import { HabitsTracker } from './components/HabitsTracker';
import { QuickTools } from './components/QuickTools';
import { NewTaskModal } from './components/NewTaskModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('balaram_user_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('balaram_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  // Notes
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('balaram_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  // Habits
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('balaram_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('balaram_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('balaram_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('balaram_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('balaram_habits', JSON.stringify(habits));
  }, [habits]);

  // Task actions
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Note actions
  const handleAddNote = (newNoteData: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...newNoteData,
      id: `n-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleQuickSaveNote = (title: string, content: string) => {
    const newNote: Note = {
      id: `n-${Date.now()}`,
      title,
      content,
      tag: 'Quick Note',
      pinned: false,
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  // Habit actions
  const handleToggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const currentDone = !!h.history[dateStr];
        const newDone = !currentDone;
        const newHistory = { ...h.history, [dateStr]: newDone };
        const streakChange = newDone ? 1 : Math.max(0, h.streak - 1);
        return {
          ...h,
          streak: newDone ? h.streak + 1 : streakChange,
          history: newHistory,
        };
      })
    );
  };

  const handleToggleHabitToday = (habitId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    handleToggleHabitDay(habitId, todayStr);
  };

  const handleAddHabit = (title: string, iconName: string, color: string) => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      title,
      iconName,
      color,
      streak: 1,
      history: {
        [new Date().toISOString().split('T')[0]]: true,
      },
    };
    setHabits((prev) => [newHabit, ...prev]);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  // Reset all data
  const handleResetAllData = () => {
    localStorage.clear();
    setUserProfile(initialUserProfile);
    setTasks(initialTasks);
    setNotes(initialNotes);
    setHabits(initialHabits);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userProfile={userProfile}
        onOpenNewTask={() => setIsNewTaskOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            tasks={tasks}
            habits={habits}
            notes={notes}
            onSelectTab={setCurrentTab}
            onToggleTask={handleToggleTask}
            onToggleHabitToday={handleToggleHabitToday}
            onOpenNewTask={() => setIsNewTaskOpen(true)}
            onQuickSaveNote={handleQuickSaveNote}
            soundEnabled={userProfile.soundEnabled}
          />
        )}

        {currentTab === 'tasks' && (
          <TaskPlanner
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onOpenNewTask={() => setIsNewTaskOpen(true)}
            soundEnabled={userProfile.soundEnabled}
          />
        )}

        {currentTab === 'focus' && (
          <FocusTimer
            soundEnabled={userProfile.soundEnabled}
            dailyGoal={userProfile.dailyGoalSessions}
          />
        )}

        {currentTab === 'notes' && (
          <NotesScratchpad
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            soundEnabled={userProfile.soundEnabled}
          />
        )}

        {currentTab === 'habits' && (
          <HabitsTracker
            habits={habits}
            onToggleHabitDay={handleToggleHabitDay}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
            soundEnabled={userProfile.soundEnabled}
          />
        )}

        {currentTab === 'tools' && (
          <QuickTools soundEnabled={userProfile.soundEnabled} />
        )}
      </main>

      {/* Modals */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        tasks={tasks}
        notes={notes}
        habits={habits}
        onResetAllData={handleResetAllData}
      />

      {/* Clean quiet footer */}
      <footer className="border-t border-neutral-800/60 py-6 text-center text-xs text-neutral-500">
        <p className="flex items-center justify-center gap-2">
          <span>{userProfile.name} Studio</span>
          <span>·</span>
          <span>Private Local Workspace</span>
          <span>·</span>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-neutral-300 transition-colors underline underline-offset-4 cursor-pointer"
          >
            Preferences
          </button>
        </p>
      </footer>
    </div>
  );
}
