import React from 'react';
import { 
  Sparkles, 
  Trash2, 
  Quote, 
  Clock, 
  Calendar,
  Flame,
  Zap,
  Sprout
} from 'lucide-react';
import { AchievementItem } from '../types';
import { CATEGORIES } from '../lib/constants';
import { useApp } from '../context/AppContext';
import { fireAchievementConfetti, fireMajorWinConfetti } from '../lib/confetti';
import { formatDisplayDate } from '../lib/dateUtils';

interface AchievementCardProps {
  achievement: AchievementItem;
  showDate?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ 
  achievement,
  showDate = false,
}) => {
  const { deleteAchievement } = useApp();
  const categoryMeta = CATEGORIES[achievement.category] || CATEGORIES['deep-work'];

  const getImpactBadge = () => {
    switch (achievement.impact) {
      case 'major':
        return {
          label: 'Breakthrough Win',
          icon: Flame,
          classes: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
          glow: 'shadow-md shadow-amber-500/10 border-amber-400/40 dark:border-amber-500/30',
        };
      case 'meaningful':
        return {
          label: 'Milestone',
          icon: Zap,
          classes: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
          glow: 'border-indigo-400/30 dark:border-indigo-500/20',
        };
      case 'micro':
      default:
        return {
          label: 'Micro Win',
          icon: Sprout,
          classes: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          glow: 'border-emerald-400/30 dark:border-emerald-500/20',
        };
    }
  };

  const impactBadge = getImpactBadge();
  const ImpactIcon = impactBadge.icon;

  const handleCelebrate = () => {
    if (achievement.impact === 'major') {
      fireMajorWinConfetti();
    } else {
      fireAchievementConfetti();
    }
  };

  return (
    <div
      className={`group relative rounded-2xl bg-white dark:bg-slate-850 dark:bg-slate-800/90 border p-5 sm:p-6 transition-all duration-300 hover:scale-[1.01] ${impactBadge.glow}`}
    >
      <div className="flex items-start gap-4">
        {/* Emoji Badge Icon */}
        <button
          onClick={handleCelebrate}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-pink-500/20 dark:from-amber-500/30 dark:via-orange-500/20 dark:to-pink-500/30 border border-amber-500/30 flex items-center justify-center text-2xl shadow-xs transition hover:scale-110 active:scale-95 shrink-0"
          title="Click to celebrate this win!"
        >
          {achievement.badgeEmoji || '🏆'}
        </button>

        {/* Win details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Impact badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${impactBadge.classes}`}
            >
              <ImpactIcon className="w-3 h-3" />
              <span>{impactBadge.label}</span>
            </span>

            {/* Category */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${categoryMeta.bgColor} ${categoryMeta.textColor}`}
            >
              <span>{categoryMeta.emoji}</span>
              <span>{categoryMeta.label}</span>
            </span>

            {/* Date/Time */}
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {showDate ? (
                <>
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{formatDisplayDate(achievement.date)}</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{achievement.time}</span>
                </>
              )}
            </span>

            {/* Metric pill if present */}
            {achievement.metric && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{achievement.metric}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-snug">
            {achievement.title}
          </h3>

          {/* Description */}
          {achievement.description && (
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {achievement.description}
            </p>
          )}

          {/* Personal Reflection / Takeaway */}
          {achievement.reflection && (
            <div className="mt-3 bg-amber-500/5 dark:bg-amber-500/10 border-l-2 border-amber-500 rounded-r-xl px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-amber-200/90 italic flex items-start gap-2">
              <Quote className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>{achievement.reflection}</span>
            </div>
          )}
        </div>

        {/* Actions: Confetti & Delete */}
        <div className="flex flex-col items-center gap-1 opacity-80 sm:opacity-40 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCelebrate}
            className="p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition"
            title="Celebrate Win!"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={() => deleteAchievement(achievement.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
            title="Delete Win"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
