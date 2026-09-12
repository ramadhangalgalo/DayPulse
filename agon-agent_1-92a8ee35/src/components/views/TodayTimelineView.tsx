import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trophy, 
  Clock, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyStatsHeader } from '../DailyStatsHeader';
import { ActivityCard } from '../ActivityCard';
import { AchievementCard } from '../AchievementCard';
import { HabitsChecklist } from '../HabitsChecklist';
import { ActivityItem, CategoryType } from '../../types';
import { CATEGORIES, QUICK_PRESETS } from '../../lib/constants';
import { getCurrentTimeFormatted } from '../../lib/dateUtils';

interface TodayTimelineViewProps {
  onOpenAddActivity: (initial?: ActivityItem | null) => void;
  onOpenAddAchievement: (initialTitle?: string, initialCat?: CategoryType, actId?: string) => void;
  onSwitchTab: (tab: string) => void;
}

export const TodayTimelineView: React.FC<TodayTimelineViewProps> = ({
  onOpenAddActivity,
  onOpenAddAchievement,
  onSwitchTab,
}) => {
  const { 
    selectedDate, 
    currentActivities, 
    currentAchievements,
    addActivity
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [quickInput, setQuickInput] = useState('');

  // Quick 1-click preset creator
  const handleQuickAdd = (title: string, category: CategoryType, duration: number) => {
    addActivity({
      date: selectedDate,
      time: getCurrentTimeFormatted(),
      durationMinutes: duration,
      title,
      category,
      completed: true,
      tags: ['quick-log'],
      energyLevel: 'high',
    });
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    addActivity({
      date: selectedDate,
      time: getCurrentTimeFormatted(),
      durationMinutes: 30,
      title: quickInput.trim(),
      category: 'tasks',
      completed: true,
      tags: [],
      energyLevel: 'medium',
    });
    setQuickInput('');
  };

  // Filter activities
  const filteredActivities = useMemo(() => {
    return currentActivities.filter((act) => {
      const matchSearch =
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (act.description && act.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (act.tags && act.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchCat = selectedCategory === 'all' || act.category === selectedCategory;

      const matchStatus =
        filterStatus === 'all'
          ? true
          : filterStatus === 'completed'
          ? act.completed
          : !act.completed;

      return matchSearch && matchCat && matchStatus;
    });
  }, [currentActivities, searchQuery, selectedCategory, filterStatus]);

  const handlePromoteActivity = (activity: ActivityItem) => {
    onOpenAddAchievement(activity.title, activity.category, activity.id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Day Overview & Progress Card */}
      <DailyStatsHeader />

      {/* Habits Checklist */}
      <HabitsChecklist />

      {/* Main Grid: Left Timeline Activities (70%), Right Wins & Highlights (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline & Log (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Quick Input Bar */}
          <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-3 sm:p-4 shadow-xs">
            <form onSubmit={handleQuickSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Quick log what you just did... (e.g. Replied to urgent emails, 30m team sync)"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
              <button
                type="submit"
                disabled={!quickInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-xs whitespace-nowrap"
              >
                + Log
              </button>
            </form>

            {/* Quick 1-click Preset chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">1-Tap Presets:</span>
              {QUICK_PRESETS.slice(0, 5).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickAdd(p.title, p.category, p.duration)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-750 dark:bg-slate-700/60 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg transition whitespace-nowrap border border-slate-200/60 dark:border-slate-700/60"
                >
                  <span>{p.emoji}</span>
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activities Header & Filters */}
          <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Today's Timeline & What Got Done
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {filteredActivities.length}
                </span>
              </div>

              <button
                onClick={() => onOpenAddActivity(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Activity</span>
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[160px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search activities & tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filterStatus === 'all'
                      ? 'bg-white dark:bg-slate-750 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filterStatus === 'completed'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Done
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filterStatus === 'pending'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Pending
                </button>
              </div>

              {/* Category Filter dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Categories</option>
                {(Object.keys(CATEGORIES) as CategoryType[]).map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {CATEGORIES[catKey].emoji} {CATEGORIES[catKey].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Activities List */}
          {filteredActivities.length === 0 ? (
            <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 sm:p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 mx-auto flex items-center justify-center mb-3">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No activities logged for this day
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Track what you did in morning, afternoon, or evening. Even 15 minutes of progress counts!
              </p>
              <button
                onClick={() => onOpenAddActivity(null)}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20"
              >
                + Log First Activity
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((act) => (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  onEdit={(item) => onOpenAddActivity(item)}
                  onPromote={handlePromoteActivity}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Today's Achievements & Reflection Spotlight (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Achievements Spotlight Box */}
          <div className="bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent rounded-2xl border border-amber-500/30 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Trophy className="w-4 h-4 fill-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Today's Wins ({currentAchievements.length})
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    What you achieved today
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenAddAchievement()}
                className="p-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition shadow-xs"
                title="Log an Achievement"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {currentAchievements.length === 0 ? (
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl border border-amber-500/20 p-5 text-center">
                <span className="text-2xl block mb-1">🌟</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  What did you achieve today?
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Could be finishing a tough task, hitting a gym goal, or staying patient under pressure!
                </p>
                <button
                  onClick={() => onOpenAddAchievement()}
                  className="mt-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition shadow-xs"
                >
                  + Record Win
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentAchievements.map((ach) => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}
              </div>
            )}

            <button
              onClick={() => onSwitchTab('achievements')}
              className="mt-3 w-full py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl transition"
            >
              <span>View All Achievements Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Evening Review Card prompt */}
          <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Evening Reflection & Recap
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Close out the day with clarity. Review what went well, what you learned, and generate your shareable daily recap.
            </p>
            <button
              onClick={() => onSwitchTab('review')}
              className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Open Evening Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
