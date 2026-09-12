import React from 'react';
import { Clock, CheckCircle2, Trophy, Zap, Smile } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDisplayDate, formatDuration } from '../lib/dateUtils';
import { MoodType } from '../types';

export const DailyStatsHeader: React.FC = () => {
  const { 
    selectedDate, 
    currentSummary, 
    updateDaySummary, 
    stats, 
    settings 
  } = useApp();

  const targetMinutes = (settings.workHoursTarget || 6) * 60;
  const timeProgress = Math.min(100, Math.round((stats.todayTimeMinutes / targetMinutes) * 100));
  const completionPercent = stats.todayTotalCount > 0 
    ? Math.round((stats.todayCompletedCount / stats.todayTotalCount) * 100) 
    : 0;

  const moods: { type: MoodType; emoji: string; label: string }[] = [
    { type: 'ecstatic', emoji: '🤩', label: 'On Fire' },
    { type: 'energized', emoji: '⚡', label: 'Energized' },
    { type: 'content', emoji: '😊', label: 'Content' },
    { type: 'focused', emoji: '🎯', label: 'Focused' },
    { type: 'tired', emoji: '☕', label: 'Tired' },
    { type: 'stressed', emoji: '😮‍💨', label: 'Stressed' },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-xs">
      {/* Date & Day Highlight */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatDisplayDate(selectedDate)}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Keep your pulse on what you do and celebrate every milestone along the way.
          </p>
        </div>

        {/* Daily Highlight Input */}
        <div className="flex-1 max-w-md bg-white/70 dark:bg-slate-800/80 backdrop-blur-xs border border-indigo-200/60 dark:border-indigo-900/60 rounded-xl px-3 py-2 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <Zap className="w-3 h-3 fill-indigo-500" />
            <span>Today's Main Highlight</span>
          </div>
          <input
            type="text"
            placeholder="What's the #1 standout moment of today?"
            value={currentSummary.highlight || ''}
            onChange={(e) => updateDaySummary(selectedDate, { highlight: e.target.value })}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden font-medium"
          />
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Time Logged */}
        <div className="bg-white/80 dark:bg-slate-850 dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs transition hover:border-indigo-400/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span className="font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              Time Logged
            </span>
            <span className="text-[11px] font-medium">{timeProgress}% of goal</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {formatDuration(stats.todayTimeMinutes)}
            </span>
            <span className="text-xs text-slate-400">/ {settings.workHoursTarget}h</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${timeProgress}%` }}
            />
          </div>
        </div>

        {/* Card 2: Activities Completed */}
        <div className="bg-white/80 dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs transition hover:border-emerald-400/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Activities Done
            </span>
            <span className="text-[11px] font-medium">{completionPercent}%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.todayCompletedCount}
            </span>
            <span className="text-xs text-slate-400">of {stats.todayTotalCount} tracked</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* Card 3: Wins Unlocked */}
        <div className="bg-white/80 dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs transition hover:border-amber-400/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span className="font-semibold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Wins Unlocked
            </span>
            <span className="text-[11px] font-bold text-amber-500">Day's Wins</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-amber-500">
              {stats.todayAchievementsCount}
            </span>
            <span className="text-xs text-slate-400">achievements</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
            {stats.todayAchievementsCount === 0 
              ? 'No win logged yet today' 
              : `${stats.todayAchievementsCount} proud achievement${stats.todayAchievementsCount > 1 ? 's' : ''}!`}
          </div>
        </div>

        {/* Card 4: Mood & Energy */}
        <div className="bg-white/80 dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span className="font-semibold flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-pink-500" />
              Day Vibe & Mood
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Energy {currentSummary.energyRating || 4}/5
            </span>
          </div>
          <div className="flex items-center justify-between gap-1 mt-1">
            {moods.map((m) => {
              const isSelected = currentSummary.mood === m.type;
              return (
                <button
                  key={m.type}
                  onClick={() => updateDaySummary(selectedDate, { mood: m.type })}
                  className={`p-1.5 sm:p-2 text-base sm:text-lg rounded-lg transition-transform active:scale-90 ${
                    isSelected
                      ? 'bg-indigo-100 dark:bg-indigo-950/80 border-2 border-indigo-500 scale-110 shadow-xs'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 opacity-60 hover:opacity-100'
                  }`}
                  title={`${m.label} - Click to set`}
                >
                  {m.emoji}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span>Low</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => updateDaySummary(selectedDate, { energyRating: lvl })}
                  className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-bold ${
                    lvl <= (currentSummary.energyRating || 4)
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}
                  title={`Energy level ${lvl}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <span>Peak</span>
          </div>
        </div>
      </div>
    </div>
  );
};
