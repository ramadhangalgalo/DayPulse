import React, { useState } from 'react';
import { X, Trophy } from 'lucide-react';
import { ActivityItem, CategoryType } from '../types';
import { CATEGORIES, QUICK_PRESETS } from '../lib/constants';
import { getCurrentTimeFormatted } from '../lib/dateUtils';
import { useApp } from '../context/AppContext';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialActivity?: ActivityItem | null;
}

const ActivityForm: React.FC<{
  initialActivity?: ActivityItem | null;
  onClose: () => void;
}> = ({ initialActivity, onClose }) => {
  const { selectedDate, addActivity, updateActivity } = useApp();

  const [title, setTitle] = useState(initialActivity ? initialActivity.title : '');
  const [description, setDescription] = useState(initialActivity ? initialActivity.description || '' : '');
  const [category, setCategory] = useState<CategoryType>(initialActivity ? initialActivity.category : 'deep-work');
  const [time, setTime] = useState(initialActivity ? initialActivity.time : getCurrentTimeFormatted());
  const [durationMinutes, setDurationMinutes] = useState(initialActivity ? initialActivity.durationMinutes || 30 : 45);
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>(initialActivity?.energyLevel || 'high');
  const [isAchievement, setIsAchievement] = useState(Boolean(initialActivity?.isAchievement));
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialActivity?.tags || []);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const applyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setDurationMinutes(preset.duration);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialActivity) {
      updateActivity(initialActivity.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        time,
        durationMinutes: Number(durationMinutes) || 0,
        energyLevel,
        isAchievement,
        tags,
      });
    } else {
      addActivity({
        date: selectedDate,
        time: time.trim() || getCurrentTimeFormatted(),
        durationMinutes: Number(durationMinutes) || 0,
        title: title.trim(),
        description: description.trim(),
        category,
        completed: true,
        isAchievement,
        tags,
        energyLevel,
      });
    }

    onClose();
  };

  return (
    <div>
      {/* Quick Presets (only on new) */}
      {!initialActivity && (
        <div className="pt-4 pb-1">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
            Quick Suggestions
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {QUICK_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg whitespace-nowrap transition border border-transparent hover:border-indigo-300 dark:hover:border-indigo-800"
              >
                <span>{p.emoji}</span> {p.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 pt-3">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Activity Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Finished technical spec, 5km morning run, Built UI..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            autoFocus
          />
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(CATEGORIES) as CategoryType[]).map((catKey) => {
              const meta = CATEGORIES[catKey];
              const isSelected = category === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setCategory(catKey)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition text-left ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span>{meta.emoji}</span>
                  <span className="truncate">{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time & Duration & Energy */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Time
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="10:00 AM"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Duration (min)
            </label>
            <input
              type="number"
              min="1"
              max="720"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Energy Level
            </label>
            <select
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.target.value as 'high' | 'medium' | 'low')}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
            >
              <option value="high">⚡ High</option>
              <option value="medium">🔹 Medium</option>
              <option value="low">☕ Low</option>
            </select>
          </div>
        </div>

        {/* Notes / Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Notes or Reflection (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="What specifically happened? Any breakthroughs or insights?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Tags (Press Enter)
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-md"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="hover:text-rose-500 ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={tags.length === 0 ? "Type tag & enter..." : "Add tag..."}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="flex-1 min-w-[90px] bg-transparent text-xs text-slate-800 dark:text-white focus:outline-hidden placeholder-slate-400"
            />
          </div>
        </div>

        {/* Also promote as achievement checkbox */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Celebrate as an Achievement?
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Adds directly to your daily trophy vault
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAchievement}
              onChange={(e) => setIsAchievement(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
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
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20"
          >
            {initialActivity ? 'Save Changes' : 'Log Activity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  initialActivity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {initialActivity ? 'Edit Activity' : 'Log Daily Activity'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Record what you've done throughout your day
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ActivityForm
          key={initialActivity ? initialActivity.id : 'new-activity'}
          initialActivity={initialActivity}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
