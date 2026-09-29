import { Task, Note, Habit, UserProfile } from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Balaraman',
  title: 'Full Stack Engineer & Creator',
  dailyGoalSessions: 4,
  soundEnabled: true,
};

export const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Review System Architecture & API Endpoints',
    description: 'Ensure low-latency throughput and evaluate event subscription scalability.',
    category: 'Engineering',
    priority: 'high',
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-2',
    title: 'Finalize UI Component Hierarchy & State Store',
    description: 'Refactor state hooks and polish micro-interactions for snappy feedback.',
    category: 'Engineering',
    priority: 'medium',
    completed: true,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-3',
    title: 'Conduct Deep Focus Session (4 Pomodoros)',
    description: 'Uninterrupted block for core algorithm design and logic validation.',
    category: 'Work',
    priority: 'high',
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-4',
    title: 'Review weekly progress and update project milestones',
    description: 'Document achievements, blockers, and set goals for the upcoming sprint.',
    category: 'Personal',
    priority: 'low',
    completed: false,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
];

export const initialNotes: Note[] = [
  {
    id: 'n-1',
    title: 'Engineering Principles & Best Practices',
    content: `1. Simplicity over cleverness: Clean code is maintainable code.
2. Zero-latency feedback: Ensure state transitions feel instantaneous.
3. Typography & Math: Consistent spacing scale and tabular figures for all data.
4. Resilient architectures: Graceful fallbacks and defensive state handling.`,
    tag: 'Engineering',
    pinned: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'n-2',
    title: 'Quick Scratchpad & Idea Dump',
    content: `Explore Web Audio synthesizer patterns.
Experiment with reactive UI performance tuning.
Check out new database indexing techniques.`,
    tag: 'Ideas',
    pinned: false,
    updatedAt: new Date().toISOString(),
  },
];

export const initialHabits: Habit[] = [
  {
    id: 'h-1',
    title: 'Morning Focus & Deep Work',
    iconName: 'Zap',
    color: '#6366f1',
    streak: 6,
    history: {
      [new Date().toISOString().split('T')[0]]: true,
    },
  },
  {
    id: 'h-2',
    title: 'Read Research & Technical Articles',
    iconName: 'BookOpen',
    color: '#06b6d4',
    streak: 4,
    history: {
      [new Date().toISOString().split('T')[0]]: false,
    },
  },
  {
    id: 'h-3',
    title: 'Physical Workout & Stretching',
    iconName: 'Activity',
    color: '#10b981',
    streak: 8,
    history: {
      [new Date().toISOString().split('T')[0]]: true,
    },
  },
  {
    id: 'h-4',
    title: 'Hydration Target (2.5L+)',
    iconName: 'Droplets',
    color: '#3b82f6',
    streak: 12,
    history: {
      [new Date().toISOString().split('T')[0]]: true,
    },
  },
];
