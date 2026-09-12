import React from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HabitsChecklist: React.FC = () => {
  const { selectedDate, currentSummary, habits, toggleHabit } = useApp();
  const checkedList = currentSummary.habitsChecked || [];

  return (
    <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Daily Foundations
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            ({checkedList.length}/{habits.length})
          </span>
        </div>
        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
          {Math.round((checkedList.length / (habits.length || 1)) * 100)}% done
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {habits.map((habit) => {
          const isDone = checkedList.includes(habit.id);
          return (
            <button
              key={habit.id}
              onClick={() => toggleHabit(selectedDate, habit.id)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                isDone
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px] transition ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : 'border border-slate-300 dark:border-slate-600'
                }`}
              >
                {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold block truncate">
                  {habit.emoji} {habit.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
