import React from 'react';
import { ViewTab, UserProfile } from '../types';
import { CheckSquare, Timer, FileText, Flame, Wrench, LayoutDashboard, Plus, Settings } from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  userProfile: UserProfile;
  onOpenNewTask: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  userProfile,
  onOpenNewTask,
  onOpenSettings,
}) => {
  const navItems: { id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'focus', label: 'Focus Timer', icon: Timer },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'habits', label: 'Habits', icon: Flame },
    { id: 'tools', label: 'Quick Tools', icon: Wrench },
  ];

  return (
    <header className="border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with personal brand identifier */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white text-sm shadow-sm ring-1 ring-white/20">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={() => onSelectTab('dashboard')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-base font-semibold tracking-tight text-neutral-100 group-hover:text-white transition-colors">
              {userProfile.name} Studio
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-white bg-neutral-800 border border-neutral-700/60 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-md transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
          
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/70 rounded-md transition-colors cursor-pointer"
            title="Settings & Profile"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar below header */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 border-t border-neutral-800/60 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'text-white bg-neutral-800 border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
