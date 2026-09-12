import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Clock, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../lib/constants';
import { CategoryType } from '../types';

interface FocusTimerWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FocusTimerWidget: React.FC<FocusTimerWidgetProps> = ({ isOpen, onClose }) => {
  const { 
    activeTimer, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    stopAndLogTimer, 
    resetTimer 
  } = useApp();

  const [inputTitle, setInputTitle] = useState('Deep Work Sprint');
  const [selectedCat, setSelectedCat] = useState<CategoryType>('deep-work');

  if (!isOpen && !activeTimer.running) return null;

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    startTimer(inputTitle, selectedCat);
  };

  const setPresetMinutes = (minutes: number) => {
    // If not running, start with preset duration indicator
    setInputTitle(`Focus Session (${minutes}m)`);
    startTimer(`Focus Session (${minutes}m)`, selectedCat);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full sm:w-96 bg-slate-900/95 text-white p-4 rounded-2xl border border-indigo-500/40 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Clock className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight">Live Activity Focus Timer</span>
            <p className="text-[11px] text-slate-400">Track current task in real-time</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-4 text-center">
        {/* Large Time Display */}
        <div className="text-4xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-pink-300 drop-shadow-sm">
          {formatTimer(activeTimer.seconds)}
        </div>

        {/* Current task name or input */}
        {activeTimer.running || activeTimer.seconds > 0 ? (
          <div className="mt-2 text-xs font-semibold text-indigo-300 px-3 py-1 bg-indigo-950/60 rounded-full inline-block border border-indigo-800/50">
            {activeTimer.title || 'Focus Session'} • {CATEGORIES[activeTimer.category]?.label}
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              placeholder="What are you focusing on right now?"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
            />
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(Object.keys(CATEGORIES) as CategoryType[]).slice(0, 5).map((cat) => {
                const meta = CATEGORIES[cat];
                const isSelected = selectedCat === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCat(cat)}
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-lg whitespace-nowrap transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {meta.emoji} {meta.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-800">
        {!activeTimer.running && activeTimer.seconds === 0 ? (
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={handleStart}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Focus</span>
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => setPresetMinutes(25)}
                className="px-2.5 py-2 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                title="25 min Pomodoro"
              >
                25m
              </button>
              <button
                onClick={() => setPresetMinutes(50)}
                className="px-2.5 py-2 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                title="50 min Deep Session"
              >
                50m
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full">
            {activeTimer.running ? (
              <button
                onClick={pauseTimer}
                className="flex-1 flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-xl text-xs font-bold transition"
              >
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={resumeTimer}
                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold transition"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Resume</span>
              </button>
            )}

            <button
              onClick={stopAndLogTimer}
              className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Log to Day</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
