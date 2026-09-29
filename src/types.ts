export type Priority = 'low' | 'medium' | 'high';
export type TaskCategory = 'Work' | 'Engineering' | 'Personal' | 'Ideas' | 'Health';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: Priority;
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  pinned: boolean;
  updatedAt: string;
}

export interface Habit {
  id: string;
  title: string;
  iconName: string;
  color: string;
  streak: number;
  history: Record<string, boolean>; // date string "YYYY-MM-DD" -> completed
}

export type ViewTab = 'dashboard' | 'tasks' | 'focus' | 'notes' | 'habits' | 'tools';

export interface UserProfile {
  name: string;
  title: string;
  dailyGoalSessions: number;
  soundEnabled: boolean;
}
