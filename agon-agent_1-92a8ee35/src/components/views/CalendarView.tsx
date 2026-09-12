import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateToISO, formatDisplayDate, formatDuration, getTodayString } from '../../lib/dateUtils';

interface CalendarViewProps {
  onSwitchTab: (tab: string) => void;
  onOpenAddActivity?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onSwitchTab,
}) => {
  const { 
    selectedDate, 
    setSelectedDate, 
    activities, 
    achievements, 
    summaries 
  } = useApp();

  // Active month in view
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const [y, m] = selectedDate.split('-').map(Number);
    return new Date(y, m - 1, 1);
  });

  const nextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const jumpToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(getTodayString());
  };

  // Build grid of days
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, d);
      days.push({
        dateStr: formatDateToISO(prevDate),
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const curDate = new Date(year, month, d);
      days.push({
        dateStr: formatDateToISO(curDate),
        dayNum: d,
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill grid
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      days.push({
        dateStr: formatDateToISO(nextDate),
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonthDate]);

  // Selected day items
  const selectedDayActivities = activities.filter(a => a.date === selectedDate);
  const selectedDayAchievements = achievements.filter(a => a.date === selectedDate);
  const selectedDaySummary = summaries[selectedDate];

  const monthLabel = currentMonthDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Calendar Navigation Card */}
      <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {monthLabel}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={jumpToCurrentMonth}
              className="px-3 py-1.5 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 transition"
            >
              Current Month
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-400 py-3">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((cell) => {
            const isSelected = cell.dateStr === selectedDate;
            const isToday = cell.dateStr === getTodayString();
            const dayActs = activities.filter(a => a.date === cell.dateStr);
            const dayAchs = achievements.filter(a => a.date === cell.dateStr);

            return (
              <button
                key={cell.dateStr}
                onClick={() => setSelectedDate(cell.dateStr)}
                className={`min-h-[64px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/15 shadow-sm'
                    : isToday
                    ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40 hover:border-indigo-300'
                    : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                } ${!cell.isCurrentMonth ? 'opacity-35' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      isSelected
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : isToday
                        ? 'text-slate-900 dark:text-white underline underline-offset-4 decoration-indigo-500'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {dayAchs.length > 0 && (
                    <span className="text-[10px] font-bold text-amber-500 flex items-center">
                      <Trophy className="w-3 h-3 fill-amber-500" />
                    </span>
                  )}
                </div>

                {/* Micro indicators */}
                <div className="flex items-center gap-1 mt-1">
                  {dayActs.length > 0 && (
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {dayActs.length} {dayActs.length === 1 ? 'task' : 'tasks'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Preview */}
      <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Details for {formatDisplayDate(selectedDate)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {selectedDayActivities.length} activities logged • {selectedDayAchievements.length} achievements
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSwitchTab('today')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <span>Open in Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Highlight if available */}
        {selectedDaySummary?.highlight && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 font-medium">
            <span className="font-bold mr-1.5">Highlight:</span> {selectedDaySummary.highlight}
          </div>
        )}

        {/* Selected Day Activities List */}
        <div className="mt-4 space-y-3">
          {selectedDayActivities.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              No entries logged for this date.
            </div>
          ) : (
            selectedDayActivities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400 mr-2">{act.time}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {act.title}
                  </span>
                  {act.durationMinutes > 0 && (
                    <span className="ml-2 text-xs text-slate-400">
                      ({formatDuration(act.durationMinutes)})
                    </span>
                  )}
                </div>
                {act.isAchievement && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Trophy className="w-3 h-3 fill-amber-500" />
                    <span>Win</span>
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
