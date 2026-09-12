import React from 'react';
import { 
  Check, 
  Clock, 
  Trash2, 
  Edit3, 
  Trophy, 
  Tag, 
  Zap
} from 'lucide-react';
import { ActivityItem } from '../types';
import { CATEGORIES } from '../lib/constants';
import { useApp } from '../context/AppContext';
import { formatDuration } from '../lib/dateUtils';

interface ActivityCardProps {
  activity: ActivityItem;
  onEdit: (activity: ActivityItem) => void;
  onPromote: (activity: ActivityItem) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onEdit,
  onPromote,
}) => {
  const { toggleActivityComplete, deleteActivity } = useApp();
  const categoryMeta = CATEGORIES[activity.category] || CATEGORIES['deep-work'];

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden ${
        activity.completed
          ? 'bg-white/90 dark:bg-slate-800/80 border-slate-200 dark:border-slate-750 shadow-xs'
          : 'bg-white dark:bg-slate-850 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Category accent bar on the left */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: categoryMeta.color }}
      />

      <div className="p-4 sm:p-5 pl-5 sm:pl-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Complete checkbox */}
          <button
            type="button"
            onClick={() => toggleActivityComplete(activity.id)}
            className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
              activity.completed
                ? 'bg-emerald-500 text-white shadow-xs scale-105'
                : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-transparent'
            }`}
            title={activity.completed ? 'Mark as incomplete' : 'Mark as completed'}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Activity main content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {/* Category chip */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${categoryMeta.bgColor} ${categoryMeta.textColor} border ${categoryMeta.borderColor}`}
              >
                <span>{categoryMeta.emoji}</span>
                <span>{categoryMeta.label}</span>
              </span>

              {/* Time & Duration badge */}
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{activity.time}</span>
                {activity.endTime && <span>- {activity.endTime}</span>}
                {activity.durationMinutes > 0 && (
                  <span className="text-slate-400 dark:text-slate-500">
                    ({formatDuration(activity.durationMinutes)})
                  </span>
                )}
              </span>

              {/* Energy rating chip if set */}
              {activity.energyLevel && (
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.2 rounded-full ${
                  activity.energyLevel === 'high' 
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                    : activity.energyLevel === 'medium'
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                }`}>
                  <Zap className="w-2.5 h-2.5" />
                  <span>{activity.energyLevel} energy</span>
                </span>
              )}

              {/* Achievement Badge if linked */}
              {activity.isAchievement && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Trophy className="w-3 h-3 fill-amber-500" />
                  <span>Logged as Win</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              className={`text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white ${
                activity.completed ? 'line-through opacity-70 text-slate-500 dark:text-slate-400' : ''
              }`}
            >
              {activity.title}
            </h3>

            {/* Description / Reflection */}
            {activity.description && (
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {activity.description}
              </p>
            )}

            {/* Tags */}
            {activity.tags && activity.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                  >
                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-40 group-hover:opacity-100 transition-opacity">
            {!activity.isAchievement && (
              <button
                type="button"
                onClick={() => onPromote(activity)}
                className="p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition"
                title="Promote to Daily Achievement"
              >
                <Trophy className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onEdit(activity)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition"
              title="Edit Activity"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => deleteActivity(activity.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              title="Delete Activity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
