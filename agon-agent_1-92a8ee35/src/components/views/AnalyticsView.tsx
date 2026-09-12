import React, { useMemo } from 'react';
import { 
  BarChart3, 
  Flame, 
  Trophy, 
  TrendingUp, 
  PieChart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../lib/constants';
import { CategoryType } from '../../types';
import { formatDuration, shiftDate, getTodayString, formatShortDate } from '../../lib/dateUtils';

export const AnalyticsView: React.FC = () => {
  const { activities, achievements, stats } = useApp();

  // Category distribution of all-time activities
  const categoryStats = useMemo(() => {
    const totals: Record<CategoryType, { count: number; minutes: number }> = {
      'deep-work': { count: 0, minutes: 0 },
      'tasks': { count: 0, minutes: 0 },
      'learning': { count: 0, minutes: 0 },
      'health': { count: 0, minutes: 0 },
      'creative': { count: 0, minutes: 0 },
      'personal': { count: 0, minutes: 0 },
      'social': { count: 0, minutes: 0 },
      'mindset': { count: 0, minutes: 0 },
    };

    activities.forEach((a) => {
      if (totals[a.category]) {
        totals[a.category].count += 1;
        totals[a.category].minutes += a.durationMinutes || 0;
      }
    });

    const totalMinutes = Object.values(totals).reduce((sum, item) => sum + item.minutes, 0);

    return { totals, totalMinutes };
  }, [activities]);

  // Last 7 days activity trend
  const past7Days = useMemo(() => {
    const today = getTodayString();
    const days: { date: string; label: string; minutes: number; achCount: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = shiftDate(today, -i);
      const dayActs = activities.filter(a => a.date === d);
      const dayAchs = achievements.filter(a => a.date === d);
      const mins = dayActs.reduce((acc, a) => acc + (a.durationMinutes || 0), 0);

      days.push({
        date: d,
        label: formatShortDate(d),
        minutes: mins,
        achCount: dayAchs.length,
      });
    }

    const maxMins = Math.max(...days.map(d => d.minutes), 240);
    return { days, maxMins };
  }, [activities, achievements]);

  // Achievements by Impact
  const achievementsByImpact = useMemo(() => {
    return {
      major: achievements.filter(a => a.impact === 'major').length,
      meaningful: achievements.filter(a => a.impact === 'meaningful').length,
      micro: achievements.filter(a => a.impact === 'micro').length,
    };
  }, [achievements]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Stat Banner */}
      <div className="bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Productivity & Achievement Insights</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Your Daily Momentum & Habit Trends
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              See where your time goes and watch your accomplishments compound.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs text-center min-w-[100px]">
              <span className="text-[11px] font-bold text-slate-400 block">Current Streak</span>
              <span className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-amber-500" />
                {stats.currentStreak}d
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs text-center min-w-[100px]">
              <span className="text-[11px] font-bold text-slate-400 block">Total Wins</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
                <Trophy className="w-5 h-5" />
                {achievements.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Trend Chart */}
      <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Last 7 Days Productive Time & Wins</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Daily logged hours (bars) and achievements earned (stars)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 border-b border-slate-100 dark:border-slate-700/60">
          {past7Days.days.map((day) => {
            const heightPercent = Math.max(8, Math.round((day.minutes / past7Days.maxMins) * 100));
            const isToday = day.date === getTodayString();
            return (
              <div key={day.date} className="flex flex-col items-center h-full justify-end group">
                {/* Wins indicator */}
                {day.achCount > 0 && (
                  <div className="mb-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-0.5 scale-90 group-hover:scale-105 transition">
                    <Trophy className="w-2.5 h-2.5 fill-amber-500" />
                    <span>{day.achCount}</span>
                  </div>
                )}

                {/* Duration Bar */}
                <div 
                  className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative ${
                    isToday
                      ? 'bg-gradient-to-t from-indigo-600 to-purple-500 shadow-md shadow-indigo-500/20'
                      : 'bg-indigo-500/25 dark:bg-indigo-500/30 hover:bg-indigo-500/40'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-10 transition">
                    {formatDuration(day.minutes)}
                  </div>
                </div>

                {/* Label */}
                <span className={`text-[11px] font-semibold mt-2 ${isToday ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Category Breakdown (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Time Distribution */}
        <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-indigo-500" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Time Distribution by Category
            </h3>
          </div>

          <div className="space-y-3">
            {(Object.keys(CATEGORIES) as CategoryType[]).map((catKey) => {
              const meta = CATEGORIES[catKey];
              const stat = categoryStats.totals[catKey];
              const pct = categoryStats.totalMinutes > 0
                ? Math.round((stat.minutes / categoryStats.totalMinutes) * 100)
                : 0;

              return (
                <div key={catKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{meta.emoji}</span>
                      <span>{meta.label}</span>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {formatDuration(stat.minutes)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: meta.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievement Breakdown by Impact & Milestones */}
        <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Wins Breakdown by Impact
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-center">
                <span className="text-xl">🔥</span>
                <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 block mt-1">
                  {achievementsByImpact.major}
                </span>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Breakthrough</span>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/30 p-3.5 rounded-xl text-center">
                <span className="text-xl">⚡</span>
                <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 block mt-1">
                  {achievementsByImpact.meaningful}
                </span>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Milestones</span>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-center">
                <span className="text-xl">🌱</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">
                  {achievementsByImpact.micro}
                </span>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Micro-Wins</span>
              </div>
            </div>

            {/* Motivational insight card */}
            <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-purple-500/20 p-4 rounded-xl">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">
                Momentum Principle
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "Big achievements are just thousands of micro-wins stacked on top of each other. Never underestimate a day where you made steady forward motion."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
