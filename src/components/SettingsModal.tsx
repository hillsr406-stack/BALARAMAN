import React, { useState } from 'react';
import { UserProfile, Task, Note, Habit } from '../types';
import { X, Volume2, VolumeX, Download, RotateCcw, Check, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  tasks: Task[];
  notes: Note[];
  habits: Habit[];
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  tasks,
  notes,
  habits,
  onResetAllData,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [title, setTitle] = useState(userProfile.title);
  const [dailyGoal, setDailyGoal] = useState(userProfile.dailyGoalSessions);
  const [soundEnabled, setSoundEnabled] = useState(userProfile.soundEnabled);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim() || 'Balaraman',
      title: title.trim() || 'Creator & Engineer',
      dailyGoalSessions: Number(dailyGoal) || 4,
      soundEnabled,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  const handleExportData = () => {
    const data = {
      profile: userProfile,
      tasks,
      notes,
      habits,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balaram-studio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">Studio Preferences</h3>
        </div>
        <p className="text-xs text-neutral-400 mt-1">Configure profile and local workspace settings.</p>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Balaraman or Bala"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Title / Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stack Engineer & Creator"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Daily Focus Blocks Target (Pomodoros)
            </label>
            <input
              type="number"
              min="1"
              max="16"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-full flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs hover:border-neutral-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 text-neutral-200">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-neutral-500" />
                )}
                <span>Haptic & Audio Chimes</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${soundEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-500 bg-neutral-800'}`}>
                {soundEnabled ? 'ENABLED' : 'MUTED'}
              </span>
            </button>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all tasks, notes and habits to initial default state?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {savedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
