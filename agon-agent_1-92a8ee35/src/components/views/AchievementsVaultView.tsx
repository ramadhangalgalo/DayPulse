import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Plus, 
  Flame, 
  Zap, 
  Sprout, 
  Search, 
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AchievementCard } from '../AchievementCard';
import { CategoryType } from '../../types';
import { CATEGORIES } from '../../lib/constants';
import { fireMajorWinConfetti } from '../../lib/confetti';
import { sound } from '../../lib/audio';

interface AchievementsVaultViewProps {
  onOpenAddAchievement: () => void;
}

export const AchievementsVaultView: React.FC<AchievementsVaultViewProps> = ({
  onOpenAddAchievement,
}) => {
  const { achievements } = useApp();

  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const majorWinsCount = useMemo(() => {
    return achievements.filter(a => a.impact === 'major').length;
  }, [achievements]);

  const milestoneWinsCount = useMemo(() => {
    return achievements.filter(a => a.impact === 'meaningful').length;
  }, [achievements]);

  const microWinsCount = useMemo(() => {
    return achievements.filter(a => a.impact === 'micro').length;
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((ach) => {
      const matchImpact = selectedImpact === 'all' || ach.impact === selectedImpact;
      const matchCat = selectedCategory === 'all' || ach.category === selectedCategory;
      const matchSearch =
        ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ach.description && ach.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ach.metric && ach.metric.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ach.reflection && ach.reflection.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchImpact && matchCat && matchSearch;
    });
  }, [achievements, selectedImpact, selectedCategory, searchQuery]);

  const triggerGrandConfetti = () => {
    sound.playAchievementChime();
    fireMajorWinConfetti();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-600/10 to-indigo-600/15 border border-amber-500/30 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3 border border-amber-500/30">
              <Trophy className="w-4 h-4 fill-amber-500" />
              <span>Achievement & Wins Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Celebrate Everything You Have Achieved
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mt-1 leading-relaxed">
              Tracking your wins trains your brain to notice progress, build momentum, and recognize the impact of your daily effort.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={triggerGrandConfetti}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold shadow-xs transition"
              title="Celebrate All Wins"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Celebrate Wins!</span>
            </button>

            <button
              onClick={onOpenAddAchievement}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Log a New Win</span>
            </button>
          </div>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Total Wins Logged</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {achievements.length}
            </div>
            <span className="text-[11px] text-slate-400">All-time victories</span>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-amber-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Breakthroughs</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-500">
              {majorWinsCount}
            </div>
            <span className="text-[11px] text-slate-400">Major game-changers</span>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-indigo-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Milestones</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-500">
              {milestoneWinsCount}
            </div>
            <span className="text-[11px] text-slate-400">Meaningful steps</span>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <Sprout className="w-4 h-4 text-emerald-500" />
              <span>Micro-Wins</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-500">
              {microWinsCount}
            </div>
            <span className="text-[11px] text-slate-400">Habit & flow victories</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Impact Selector Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedImpact('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                selectedImpact === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              All Wins ({achievements.length})
            </button>
            <button
              onClick={() => setSelectedImpact('major')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1 ${
                selectedImpact === 'major'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Breakthrough ({majorWinsCount})</span>
            </button>
            <button
              onClick={() => setSelectedImpact('meaningful')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1 ${
                selectedImpact === 'meaningful'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Milestones ({milestoneWinsCount})</span>
            </button>
            <button
              onClick={() => setSelectedImpact('micro')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1 ${
                selectedImpact === 'micro'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Micro-Wins ({microWinsCount})</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
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
      </div>

      {/* Achievement Showcase Cards */}
      {filteredAchievements.length === 0 ? (
        <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center mb-3">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No achievements found for this filter
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filter or record a new win you're proud of!
          </p>
          <button
            onClick={onOpenAddAchievement}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            + Log a New Win
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} showDate={true} />
          ))}
        </div>
      )}
    </div>
  );
};
