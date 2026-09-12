import React, { useState } from 'react';
import { X, Trophy, Sparkles, Flame, Zap, Sprout } from 'lucide-react';
import { AchievementImpact, CategoryType } from '../types';
import { CATEGORIES, WIN_EMOJIS } from '../lib/constants';
import { getCurrentTimeFormatted } from '../lib/dateUtils';
import { useApp } from '../context/AppContext';

interface AddAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotedTitle?: string;
  promotedCategory?: CategoryType;
  promotedActivityId?: string;
}

const AchievementForm: React.FC<{
  initialTitle: string;
  initialCategory: CategoryType;
  promotedActivityId?: string;
  onClose: () => void;
}> = ({ initialTitle, initialCategory, promotedActivityId, onClose }) => {
  const { selectedDate, addAchievement } = useApp();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState<AchievementImpact>('meaningful');
  const [category, setCategory] = useState<CategoryType>(initialCategory);
  const [badgeEmoji, setBadgeEmoji] = useState('🏆');
  const [metric, setMetric] = useState('');
  const [reflection, setReflection] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addAchievement({
      activityId: promotedActivityId,
      date: selectedDate,
      time: getCurrentTimeFormatted(),
      title: title.trim(),
      description: description.trim() || 'Accomplished with focus and discipline.',
      impact,
      category,
      badgeEmoji,
      metric: metric.trim() || undefined,
      reflection: reflection.trim() || undefined,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      {/* Impact Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Impact Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setImpact('major');
              setBadgeEmoji('🔥');
            }}
            className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition ${
              impact === 'major'
                ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold ring-2 ring-amber-500/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Flame className="w-4 h-4 mb-1 text-amber-500" />
            <span className="text-xs font-bold">Breakthrough</span>
            <span className="text-[10px] text-slate-400">Major win</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setImpact('meaningful');
              setBadgeEmoji('⚡');
            }}
            className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition ${
              impact === 'meaningful'
                ? 'border-indigo-500 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Zap className="w-4 h-4 mb-1 text-indigo-500" />
            <span className="text-xs font-bold">Milestone</span>
            <span className="text-[10px] text-slate-400">Solid step</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setImpact('micro');
              setBadgeEmoji('🌱');
            }}
            className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition ${
              impact === 'micro'
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Sprout className="w-4 h-4 mb-1 text-emerald-500" />
            <span className="text-xs font-bold">Micro Win</span>
            <span className="text-[10px] text-slate-400">Habit & flow</span>
          </button>
        </div>
      </div>

      {/* Emoji Badge selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Badge Icon
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {WIN_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setBadgeEmoji(emoji)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition ${
                badgeEmoji === emoji
                  ? 'bg-amber-500/20 border-2 border-amber-500 scale-110 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Achievement Title *
        </label>
        <input
          type="text"
          required
          placeholder="e.g., Shipped feature to production, Ran 10km under 50m, Closed deal..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          autoFocus
        />
      </div>

      {/* Category & Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
          >
            {(Object.keys(CATEGORIES) as CategoryType[]).map((catKey) => (
              <option key={catKey} value={catKey}>
                {CATEGORIES[catKey].emoji} {CATEGORIES[catKey].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Metric / Stat (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., 5.0 km, 2h Focus, $3.2k, 100%"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Details & Context
        </label>
        <textarea
          rows={2}
          placeholder="What obstacle did you overcome? How did you pull it off?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
        />
      </div>

      {/* Reflection */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Takeaway or Lesson (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g., Consistency in warmups paid off, Early starts beat late stress"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold transition shadow-md shadow-amber-500/25 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Celebrate & Save Win</span>
        </button>
      </div>
    </form>
  );
};

export const AddAchievementModal: React.FC<AddAchievementModalProps> = ({
  isOpen,
  onClose,
  promotedTitle = '',
  promotedCategory = 'deep-work',
  promotedActivityId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-amber-500/30 dark:border-amber-500/20 shadow-2xl p-5 sm:p-7 overflow-hidden my-8">
        {/* Glow Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5 fill-amber-100" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Log What You Achieved
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every victory matters, big or small. Lock it in!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <AchievementForm
          key={`${promotedTitle}_${promotedCategory}_${promotedActivityId || ''}`}
          initialTitle={promotedTitle}
          initialCategory={promotedCategory}
          promotedActivityId={promotedActivityId}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
