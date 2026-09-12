export type CategoryType = 
  | 'deep-work'
  | 'tasks'
  | 'learning'
  | 'health'
  | 'creative'
  | 'personal'
  | 'social'
  | 'mindset';

export type AchievementImpact = 'major' | 'meaningful' | 'micro';

export type MoodType = 'ecstatic' | 'energized' | 'content' | 'focused' | 'tired' | 'stressed';

export interface ActivityItem {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:30 AM" or "09:30"
  endTime?: string;
  durationMinutes: number; // in minutes
  title: string;
  description?: string;
  category: CategoryType;
  completed: boolean;
  isAchievement?: boolean;
  tags: string[];
  energyLevel?: 'high' | 'medium' | 'low';
  createdAt: number;
}

export interface AchievementItem {
  id: string;
  activityId?: string; // linked activity if promoted
  date: string; // YYYY-MM-DD
  time: string;
  title: string;
  description: string;
  impact: AchievementImpact;
  category: CategoryType;
  badgeEmoji: string;
  metric?: string; // e.g., "5.2 km", "4,200 words", "$1,200"
  reflection?: string;
  createdAt: number;
}

export interface DaySummary {
  date: string; // YYYY-MM-DD
  highlight: string;
  mood?: MoodType;
  energyRating: number; // 1 to 5
  reflectionWins: string;
  reflectionLearnings: string;
  tomorrowPriority: string;
  waterIntake?: number; // glasses
  sleepHours?: number;
  habitsChecked: string[];
}

export interface DailyHabit {
  id: string;
  title: string;
  emoji: string;
  category: CategoryType;
  targetPerWeek: number;
}

export interface UserSettings {
  userName: string;
  soundEnabled: boolean;
  theme: 'dark' | 'light' | 'system';
  workHoursTarget: number; // default 6h
  waterTarget: number; // default 8
}

export interface CategoryMeta {
  id: CategoryType;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  emoji: string;
}
