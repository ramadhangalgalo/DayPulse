import React from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Plus, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Settings, 
  Flame, 
  Clock,
  Play,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayString } from '../lib/dateUtils';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAddActivity: () => void;
  onOpenAddAchievement: () => void;
  onOpenSettings: () => void;
  onToggleTimer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAddActivity,
  onOpenAddAchievement,
  onOpenSettings,
  onToggleTimer,
}) => {
  const { 
    selectedDate, 
    setSelectedDate, 
    goToToday, 
    prevDay, 
    nextDay, 
    settings, 
    toggleSound, 
    toggleTheme, 
    stats,
    activeTimer 
  } = useApp();

  const isToday = selectedDate === getTodayString();

  const formatTimerSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const navItems = [
    { id: 'today', label: 'Timeline & Log', icon: Clock },
    { id: 'achievements', label: 'Achievements', icon: Trophy, badge: stats.todayAchievementsCount },
    { id: 'review', label: 'Day Review', icon: Sparkles },
    { id: 'analytics', label: 'Insights', icon: CheckCircle2 },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main top bar */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Streak */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold text-lg">
                <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  DayPulse
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  Track & Achieve
                </span>
              </div>
            </div>

            {/* Streak Counter */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold"
              title={`${stats.currentStreak} day streak of tracking your days!`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{stats.currentStreak}d Streak</span>
            </div>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
            <button
              onClick={prevDay}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
              title="Previous Day"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              />
            </div>

            <button
              onClick={nextDay}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
              title="Next Day"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isToday && (
              <button
                onClick={goToToday}
                className="ml-1 text-xs font-semibold px-2 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-xs"
              >
                Today
              </button>
            )}
          </div>

          {/* Top Actions: Live Timer, Quick Add Activity, Quick Add Win, Tools */}
          <div className="flex items-center gap-2">
            {/* Live Focus Timer Mini Pill */}
            <button
              onClick={onToggleTimer}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                activeTimer.running
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title="Focus Timer"
            >
              {activeTimer.running ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>{formatTimerSeconds(activeTimer.seconds)}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden md:inline">Focus Timer</span>
                </>
              )}
            </button>

            {/* Log Achievement Button (Golden) */}
            <button
              onClick={onOpenAddAchievement}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              title="Record an Achievement or Win"
            >
              <Trophy className="w-4 h-4 text-amber-100" />
              <span className="hidden sm:inline">Log Win</span>
            </button>

            {/* Log Activity Button */}
            <button
              onClick={onOpenAddActivity}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Log Activity</span>
            </button>

            {/* System Utilities */}
            <div className="hidden md:flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
              <button
                onClick={toggleSound}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                title={settings.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
              >
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                title="Toggle Dark/Light Mode"
              >
                {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              <button
                onClick={onOpenSettings}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                title="Settings & Export Data"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800/80 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
