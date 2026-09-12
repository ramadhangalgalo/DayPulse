import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  ActivityItem, 
  AchievementItem, 
  DaySummary, 
  DailyHabit, 
  UserSettings, 
  CategoryType,
  AchievementImpact
} from '../types';
import { getInitialData } from '../lib/sampleData';
import { getTodayString, getCurrentTimeFormatted, formatDateToISO, shiftDate } from '../lib/dateUtils';
import { sound } from '../lib/audio';
import { fireAchievementConfetti, fireMajorWinConfetti } from '../lib/confetti';
import { DEFAULT_HABITS } from '../lib/constants';

interface ActiveTimerState {
  running: boolean;
  seconds: number;
  title: string;
  category: CategoryType;
  startTime: number | null;
}

interface AppContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  goToToday: () => void;
  prevDay: () => void;
  nextDay: () => void;
  
  activities: ActivityItem[];
  achievements: AchievementItem[];
  summaries: Record<string, DaySummary>;
  habits: DailyHabit[];
  settings: UserSettings;

  // Filtered for current selectedDate
  currentActivities: ActivityItem[];
  currentAchievements: AchievementItem[];
  currentSummary: DaySummary;

  // Activity Actions
  addActivity: (activity: Omit<ActivityItem, 'id' | 'createdAt'>) => ActivityItem;
  updateActivity: (id: string, updates: Partial<ActivityItem>) => void;
  deleteActivity: (id: string) => void;
  toggleActivityComplete: (id: string) => void;
  promoteToAchievement: (activity: ActivityItem, impact?: AchievementImpact, reflection?: string) => void;

  // Achievement Actions
  addAchievement: (achievement: Omit<AchievementItem, 'id' | 'createdAt'>) => AchievementItem;
  updateAchievement: (id: string, updates: Partial<AchievementItem>) => void;
  deleteAchievement: (id: string) => void;

  // Summary Actions
  updateDaySummary: (date: string, partial: Partial<DaySummary>) => void;
  toggleHabit: (date: string, habitId: string) => void;

  // Timer Actions
  activeTimer: ActiveTimerState;
  startTimer: (title: string, category: CategoryType) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopAndLogTimer: () => void;
  resetTimer: () => void;

  // Settings & Storage
  toggleSound: () => void;
  toggleTheme: () => void;
  loadSampleData: () => void;
  clearAllData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;

  // Computed Metrics
  stats: {
    todayTimeMinutes: number;
    todayCompletedCount: number;
    todayTotalCount: number;
    todayAchievementsCount: number;
    currentStreak: number;
    totalAchievements: number;
    totalActivitiesLogged: number;
  };
}

const STORAGE_KEY = 'daypulse_state_v2';
const SETTINGS_KEY = 'daypulse_settings_v2';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  // Load state from localStorage or initialize with rich sample data
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return getInitialData().activities;
  });

  const [achievements, setAchievements] = useState<AchievementItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_achievements`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return getInitialData().achievements;
  });

  const [summaries, setSummaries] = useState<Record<string, DaySummary>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_summaries`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return getInitialData().summaries;
  });

  const [habits] = useState<DailyHabit[]>(DEFAULT_HABITS);

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      userName: 'Friend',
      soundEnabled: true,
      theme: 'dark',
      workHoursTarget: 6,
      waterTarget: 8,
    };
  });

  // Active Timer state
  const [activeTimer, setActiveTimer] = useState<ActiveTimerState>({
    running: false,
    seconds: 0,
    title: '',
    category: 'deep-work',
    startTime: null,
  });

  // Persist activities
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }, [activities]);

  // Persist achievements
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_achievements`, JSON.stringify(achievements));
    } catch (e) {
      console.error(e);
    }
  }, [achievements]);

  // Persist summaries
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_summaries`, JSON.stringify(summaries));
    } catch (e) {
      console.error(e);
    }
  }, [summaries]);

  // Persist settings & sync sound/theme
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
    sound.setEnabled(settings.soundEnabled);
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Live Timer ticker
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeTimer.running) {
      interval = setInterval(() => {
        setActiveTimer(prev => ({
          ...prev,
          seconds: prev.seconds + 1,
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer.running]);

  // Navigation helpers
  const goToToday = () => {
    sound.playClick();
    setSelectedDate(getTodayString());
  };

  const prevDay = () => {
    sound.playClick();
    setSelectedDate(prev => shiftDate(prev, -1));
  };

  const nextDay = () => {
    sound.playClick();
    setSelectedDate(prev => shiftDate(prev, 1));
  };

  // Activity Actions
  const addActivity = (data: Omit<ActivityItem, 'id' | 'createdAt'>): ActivityItem => {
    sound.playClick();
    const newActivity: ActivityItem = {
      ...data,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    setActivities(prev => [newActivity, ...prev]);

    // If marked as achievement right away
    if (data.isAchievement) {
      sound.playAchievementChime();
      fireAchievementConfetti();
      const newAch: AchievementItem = {
        id: `ach_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        activityId: newActivity.id,
        date: newActivity.date,
        time: newActivity.time,
        title: newActivity.title,
        description: newActivity.description || 'Completed activity milestone.',
        impact: 'meaningful',
        category: newActivity.category,
        badgeEmoji: '🎯',
        createdAt: Date.now(),
      };
      setAchievements(prev => [newAch, ...prev]);
    }

    return newActivity;
  };

  const updateActivity = (id: string, updates: Partial<ActivityItem>) => {
    sound.playClick();
    setActivities(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteActivity = (id: string) => {
    sound.playClick();
    setActivities(prev => prev.filter(item => item.id !== id));
  };

  const toggleActivityComplete = (id: string) => {
    setActivities(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextVal = !item.completed;
          if (nextVal) {
            sound.playComplete();
          } else {
            sound.playClick();
          }
          return { ...item, completed: nextVal };
        }
        return item;
      })
    );
  };

  const promoteToAchievement = (
    activity: ActivityItem,
    impact: AchievementImpact = 'meaningful',
    reflection?: string
  ) => {
    sound.playAchievementChime();
    if (impact === 'major') {
      fireMajorWinConfetti();
    } else {
      fireAchievementConfetti();
    }

    // Mark activity flag
    updateActivity(activity.id, { isAchievement: true });

    const newAch: AchievementItem = {
      id: `ach_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      activityId: activity.id,
      date: activity.date,
      time: activity.time,
      title: activity.title,
      description: activity.description || 'Logged as a celebrated daily achievement.',
      impact,
      category: activity.category,
      badgeEmoji: impact === 'major' ? '🏆' : '⚡',
      reflection: reflection || '',
      createdAt: Date.now(),
    };

    setAchievements(prev => [newAch, ...prev]);
  };

  // Achievement Actions
  const addAchievement = (data: Omit<AchievementItem, 'id' | 'createdAt'>): AchievementItem => {
    sound.playAchievementChime();
    if (data.impact === 'major') {
      fireMajorWinConfetti();
    } else {
      fireAchievementConfetti();
    }

    const newAch: AchievementItem = {
      ...data,
      id: `ach_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    setAchievements(prev => [newAch, ...prev]);
    return newAch;
  };

  const updateAchievement = (id: string, updates: Partial<AchievementItem>) => {
    sound.playClick();
    setAchievements(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteAchievement = (id: string) => {
    sound.playClick();
    setAchievements(prev => prev.filter(item => item.id !== id));
  };

  // Summary Actions
  const updateDaySummary = (date: string, partial: Partial<DaySummary>) => {
    sound.playClick();
    setSummaries(prev => {
      const existing = prev[date] || {
        date,
        highlight: '',
        mood: 'content',
        energyRating: 4,
        reflectionWins: '',
        reflectionLearnings: '',
        tomorrowPriority: '',
        habitsChecked: [],
      };
      return {
        ...prev,
        [date]: { ...existing, ...partial },
      };
    });
  };

  const toggleHabit = (date: string, habitId: string) => {
    sound.playClick();
    setSummaries(prev => {
      const existing = prev[date] || {
        date,
        highlight: '',
        mood: 'content',
        energyRating: 4,
        reflectionWins: '',
        reflectionLearnings: '',
        tomorrowPriority: '',
        habitsChecked: [],
      };
      const checked = existing.habitsChecked || [];
      const has = checked.includes(habitId);
      const nextChecked = has
        ? checked.filter(id => id !== habitId)
        : [...checked, habitId];

      if (!has) {
        sound.playComplete();
      }

      return {
        ...prev,
        [date]: {
          ...existing,
          habitsChecked: nextChecked,
        },
      };
    });
  };

  // Timer Handlers
  const startTimer = (title: string, category: CategoryType) => {
    sound.playClick();
    setActiveTimer({
      running: true,
      seconds: 0,
      title: title.trim() || 'Focus Session',
      category,
      startTime: Date.now(),
    });
  };

  const pauseTimer = () => {
    sound.playClick();
    setActiveTimer(prev => ({ ...prev, running: false }));
  };

  const resumeTimer = () => {
    sound.playClick();
    setActiveTimer(prev => ({ ...prev, running: true }));
  };

  const stopAndLogTimer = () => {
    sound.playTimerFinish();
    const durationMins = Math.max(1, Math.round(activeTimer.seconds / 60));
    const title = activeTimer.title || 'Focus Session';
    const category = activeTimer.category;

    addActivity({
      date: getTodayString(),
      time: getCurrentTimeFormatted(),
      durationMinutes: durationMins,
      title: `${title} (${durationMins}m)`,
      description: `Completed tracked focus timer session.`,
      category,
      completed: true,
      tags: ['timer', 'focus'],
      energyLevel: 'high',
    });

    setActiveTimer({
      running: false,
      seconds: 0,
      title: '',
      category: 'deep-work',
      startTime: null,
    });
  };

  const resetTimer = () => {
    sound.playClick();
    setActiveTimer({
      running: false,
      seconds: 0,
      title: '',
      category: 'deep-work',
      startTime: null,
    });
  };

  // Settings
  const toggleSound = () => {
    setSettings(prev => {
      const nextVal = !prev.soundEnabled;
      sound.setEnabled(nextVal);
      if (nextVal) sound.playClick();
      return { ...prev, soundEnabled: nextVal };
    });
  };

  const toggleTheme = () => {
    sound.playClick();
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const loadSampleData = () => {
    sound.playAchievementChime();
    const sample = getInitialData();
    setActivities(sample.activities);
    setAchievements(sample.achievements);
    setSummaries(sample.summaries);
  };

  const clearAllData = () => {
    sound.playClick();
    setActivities([]);
    setAchievements([]);
    setSummaries({});
  };

  const exportDataJson = () => {
    const payload = {
      activities,
      achievements,
      summaries,
      settings,
      exportDate: new Date().toISOString(),
      version: '2.0',
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.activities) && Array.isArray(data.achievements)) {
        setActivities(data.activities);
        setAchievements(data.achievements);
        if (data.summaries) setSummaries(data.summaries);
        if (data.settings) setSettings(data.settings);
        sound.playAchievementChime();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Filtered lists for the active date
  const currentActivities = useMemo(() => {
    return activities.filter(a => a.date === selectedDate);
  }, [activities, selectedDate]);

  const currentAchievements = useMemo(() => {
    return achievements.filter(a => a.date === selectedDate);
  }, [achievements, selectedDate]);

  const currentSummary = useMemo(() => {
    return (
      summaries[selectedDate] || {
        date: selectedDate,
        highlight: '',
        mood: 'content',
        energyRating: 4,
        reflectionWins: '',
        reflectionLearnings: '',
        tomorrowPriority: '',
        habitsChecked: [],
      }
    );
  }, [summaries, selectedDate]);

  // Overall Metrics
  const stats = useMemo(() => {
    const todayTimeMinutes = currentActivities.reduce(
      (acc, item) => acc + (item.durationMinutes || 0),
      0
    );
    const todayCompletedCount = currentActivities.filter(a => a.completed).length;
    const todayTotalCount = currentActivities.length;
    const todayAchievementsCount = currentAchievements.length;

    // Calculate streak
    // A streak day has either >= 1 activity or >= 1 achievement
    const activeDates = new Set<string>();
    activities.forEach(a => activeDates.add(a.date));
    achievements.forEach(a => activeDates.add(a.date));

    let streak = 0;
    const checkDate = new Date();
    // Check if today or yesterday is logged
    const todayStr = formatDateToISO(checkDate);
    if (!activeDates.has(todayStr)) {
      // Check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (activeDates.has(formatDateToISO(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      todayTimeMinutes,
      todayCompletedCount,
      todayTotalCount,
      todayAchievementsCount,
      currentStreak: streak || 1,
      totalAchievements: achievements.length,
      totalActivitiesLogged: activities.length,
    };
  }, [currentActivities, currentAchievements, activities, achievements]);

  return (
    <AppContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        goToToday,
        prevDay,
        nextDay,
        activities,
        achievements,
        summaries,
        habits,
        settings,
        currentActivities,
        currentAchievements,
        currentSummary,
        addActivity,
        updateActivity,
        deleteActivity,
        toggleActivityComplete,
        promoteToAchievement,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        updateDaySummary,
        toggleHabit,
        activeTimer,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopAndLogTimer,
        resetTimer,
        toggleSound,
        toggleTheme,
        loadSampleData,
        clearAllData,
        exportDataJson,
        importDataJson,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
