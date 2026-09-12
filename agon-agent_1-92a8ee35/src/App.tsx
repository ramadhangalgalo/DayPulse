import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { FocusTimerWidget } from './components/FocusTimerWidget';
import { AddActivityModal } from './components/AddActivityModal';
import { AddAchievementModal } from './components/AddAchievementModal';
import { SettingsModal } from './components/SettingsModal';

import { TodayTimelineView } from './components/views/TodayTimelineView';
import { AchievementsVaultView } from './components/views/AchievementsVaultView';
import { DayReviewView } from './components/views/DayReviewView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { CalendarView } from './components/views/CalendarView';

import { ActivityItem, CategoryType } from './types';
import { Clock, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('today');

  // Modals state
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);

  const [isAddAchievementOpen, setIsAddAchievementOpen] = useState(false);
  const [promotedAchData, setPromotedAchData] = useState<{
    title: string;
    category: CategoryType;
    activityId?: string;
  }>({
    title: '',
    category: 'deep-work',
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  const handleOpenAddActivity = (initial?: ActivityItem | null) => {
    setEditingActivity(initial || null);
    setIsAddActivityOpen(true);
  };

  const handleOpenAddAchievement = (
    title: string = '',
    cat: CategoryType = 'deep-work',
    actId?: string
  ) => {
    setPromotedAchData({
      title,
      category: cat,
      activityId: actId,
    });
    setIsAddAchievementOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddActivity={() => handleOpenAddActivity(null)}
        onOpenAddAchievement={() => handleOpenAddAchievement()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTimer={() => setIsTimerOpen((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {currentTab === 'today' && (
          <TodayTimelineView
            onOpenAddActivity={handleOpenAddActivity}
            onOpenAddAchievement={handleOpenAddAchievement}
            onSwitchTab={setCurrentTab}
          />
        )}

        {currentTab === 'achievements' && (
          <AchievementsVaultView
            onOpenAddAchievement={() => handleOpenAddAchievement()}
          />
        )}

        {currentTab === 'review' && <DayReviewView />}

        {currentTab === 'analytics' && <AnalyticsView />}

        {currentTab === 'calendar' && (
          <CalendarView
            onSwitchTab={setCurrentTab}
            onOpenAddActivity={() => handleOpenAddActivity(null)}
          />
        )}
      </main>

      {/* Focus Timer Floating Widget */}
      <FocusTimerWidget
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />

      {/* Modals */}
      <AddActivityModal
        isOpen={isAddActivityOpen}
        onClose={() => {
          setIsAddActivityOpen(false);
          setEditingActivity(null);
        }}
        initialActivity={editingActivity}
      />

      <AddAchievementModal
        isOpen={isAddAchievementOpen}
        onClose={() => {
          setIsAddAchievementOpen(false);
          setPromotedAchData({ title: '', category: 'deep-work' });
        }}
        promotedTitle={promotedAchData.title}
        promotedCategory={promotedAchData.category}
        promotedActivityId={promotedAchData.activityId}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Mobile Floating Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentTab('today')}
          className={`flex flex-col items-center gap-0.5 p-1 ${
            currentTab === 'today' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px]">Today</span>
        </button>

        <button
          onClick={() => setCurrentTab('achievements')}
          className={`flex flex-col items-center gap-0.5 p-1 ${
            currentTab === 'achievements' ? 'text-amber-500 font-bold' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px]">Wins</span>
        </button>

        {/* Center quick add trigger */}
        <button
          onClick={() => handleOpenAddActivity(null)}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 -mt-5"
          title="Add Activity"
        >
          <span className="text-xl font-bold leading-none">+</span>
        </button>

        <button
          onClick={() => setCurrentTab('review')}
          className={`flex flex-col items-center gap-0.5 p-1 ${
            currentTab === 'review' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">Review</span>
        </button>

        <button
          onClick={() => setCurrentTab('analytics')}
          className={`flex flex-col items-center gap-0.5 p-1 ${
            currentTab === 'analytics' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-[10px]">Insights</span>
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
