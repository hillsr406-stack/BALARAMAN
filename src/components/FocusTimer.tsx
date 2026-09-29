import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, CheckCircle2, Flame } from 'lucide-react';
import { sounds } from '../utils/sound';

interface FocusTimerProps {
  soundEnabled: boolean;
  dailyGoal: number;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const FocusTimer: React.FC<FocusTimerProps> = ({ soundEnabled, dailyGoal }) => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.work);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    const saved = localStorage.getItem('balaram_completed_sessions');
    return saved ? parseInt(saved, 10) : 2;
  });
  const [ambientPlaying, setAmbientPlaying] = useState<boolean>(false);

  // Audio Context ref for ambient noise
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed!
      sounds.playAlarm(soundEnabled);
      if (mode === 'work') {
        const next = completedSessions + 1;
        setCompletedSessions(next);
        localStorage.setItem('balaram_completed_sessions', next.toString());
        setMode('shortBreak');
        setTimeLeft(MODE_DURATIONS.shortBreak);
      } else {
        setMode('work');
        setTimeLeft(MODE_DURATIONS.work);
      }
      setIsRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, mode, completedSessions, soundEnabled]);

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  const skipTimer = () => {
    setIsRunning(false);
    if (mode === 'work') {
      switchMode('shortBreak');
    } else {
      switchMode('work');
    }
  };

  // Toggle ambient brown noise (gentle focus sound)
  const toggleAmbientSound = () => {
    if (ambientPlaying) {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
        noiseNodeRef.current = null;
      }
      setAmbientPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        const bufferSize = audioCtxRef.current.sampleRate * 2;
        const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        // Generate Brown noise
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5; // Gain compensation
        }

        const noise = audioCtxRef.current.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Lowpass filter for warm soothing tone
        const filter = audioCtxRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, audioCtxRef.current.currentTime);

        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.setValueAtTime(0.06, audioCtxRef.current.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);

        noise.start();
        noiseNodeRef.current = noise;
        setAmbientPlaying(true);
      } catch (e) {
        console.error('Ambient audio error', e);
      }
    }
  };

  // Cleanup ambient audio on unmount
  useEffect(() => {
    return () => {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
      }
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalDuration = MODE_DURATIONS[mode];
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="p-8 bg-neutral-900/70 border border-neutral-800 rounded-xl relative overflow-hidden backdrop-blur-sm">
        {/* Subtle top progress bar */}
        <div 
          className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => switchMode('work')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              mode === 'work'
                ? 'bg-neutral-800 text-white border border-neutral-700/80 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Deep Work (25m)
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              mode === 'shortBreak'
                ? 'bg-neutral-800 text-white border border-neutral-700/80 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              mode === 'longBreak'
                ? 'bg-neutral-800 text-white border border-neutral-700/80 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Big Digital Timer Display */}
        <div className="text-center py-6">
          <div className="text-7xl sm:text-8xl font-mono font-bold tracking-tight text-white tabular-nums drop-shadow-sm select-none">
            {formattedTime}
          </div>
          <p className="mt-3 text-sm text-neutral-400 font-medium">
            {mode === 'work' ? 'Stay in the zone · Deep Work Block' : 'Step away, stretch, and refresh'}
          </p>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={resetTimer}
            className="p-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-md transition-all cursor-pointer min-w-36"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={skipTimer}
            className="p-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Skip to next phase"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Noise Generator Switch */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAmbientSound}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-colors cursor-pointer ${
                ambientPlaying
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                  : 'border-neutral-800 bg-neutral-800/50 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {ambientPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span>Focus Noise: Active</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Enable Ambient Focus Noise</span>
                </>
              )}
            </button>
            <span className="hidden sm:inline text-neutral-500">Soothing brown noise to block distractions</span>
          </div>

          <div className="flex items-center gap-2 font-mono tabular-nums">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{completedSessions} / {dailyGoal} blocks done</span>
          </div>
        </div>
      </div>

      {/* Daily Progress Card */}
      <div className="p-6 bg-neutral-900/40 border border-neutral-800/80 rounded-xl flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-neutral-200">Daily Focus Target</h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            {completedSessions >= dailyGoal
              ? 'Target achieved for today! Great momentum, Balaraman.'
              : `${dailyGoal - completedSessions} more session${dailyGoal - completedSessions > 1 ? 's' : ''} to reach your daily target.`}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: dailyGoal }).map((_, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono transition-colors ${
                idx < completedSessions
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                  : 'bg-neutral-800/60 text-neutral-600 border border-neutral-800'
              }`}
            >
              {idx < completedSessions ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
