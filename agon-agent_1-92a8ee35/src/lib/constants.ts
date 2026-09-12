import { CategoryMeta, CategoryType } from '../types';

export const CATEGORIES: Record<CategoryType, CategoryMeta> = {
  'deep-work': {
    id: 'deep-work',
    label: 'Deep Work',
    color: '#6366F1',
    bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    emoji: '🧠',
  },
  'tasks': {
    id: 'tasks',
    label: 'Action & Admin',
    color: '#0EA5E9',
    bgColor: 'bg-sky-500/10 dark:bg-sky-500/20',
    borderColor: 'border-sky-500/30',
    textColor: 'text-sky-600 dark:text-sky-400',
    emoji: '⚡',
  },
  'learning': {
    id: 'learning',
    label: 'Learning & Skills',
    color: '#8B5CF6',
    bgColor: 'bg-purple-500/10 dark:bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    emoji: '📚',
  },
  'health': {
    id: 'health',
    label: 'Fitness & Health',
    color: '#10B981',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    emoji: '💪',
  },
  'creative': {
    id: 'creative',
    label: 'Creative & Build',
    color: '#F59E0B',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    emoji: '🎨',
  },
  'personal': {
    id: 'personal',
    label: 'Personal & Home',
    color: '#EC4899',
    bgColor: 'bg-pink-500/10 dark:bg-pink-500/20',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-600 dark:text-pink-400',
    emoji: '🏡',
  },
  'social': {
    id: 'social',
    label: 'Social & Network',
    color: '#14B8A6',
    bgColor: 'bg-teal-500/10 dark:bg-teal-500/20',
    borderColor: 'border-teal-500/30',
    textColor: 'text-teal-600 dark:text-teal-400',
    emoji: '💬',
  },
  'mindset': {
    id: 'mindset',
    label: 'Mindset & Rest',
    color: '#3B82F6',
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    emoji: '🧘',
  },
};

export const QUICK_PRESETS = [
  { title: 'Morning Workout & Stretch', category: 'health' as CategoryType, duration: 45, emoji: '🏋️' },
  { title: 'Deep Work Session', category: 'deep-work' as CategoryType, duration: 90, emoji: '💻' },
  { title: 'Read 25 Pages of Book', category: 'learning' as CategoryType, duration: 30, emoji: '📖' },
  { title: 'Zero Inbox & Quick Calls', category: 'tasks' as CategoryType, duration: 30, emoji: '📬' },
  { title: 'Shipped Feature / Clean Code', category: 'creative' as CategoryType, duration: 60, emoji: '🚀' },
  { title: '15m Mindfulness & Walk', category: 'mindset' as CategoryType, duration: 20, emoji: '🌿' },
  { title: 'Cooking Healthy Meal', category: 'personal' as CategoryType, duration: 40, emoji: '🥗' },
];

export const WIN_EMOJIS = ['🏆', '🚀', '🔥', '⭐', '🎯', '💡', '💪', '💎', '🎉', '🌟', '🧘', '✨', '🥇', '👑', '📈'];

export const DEFAULT_HABITS = [
  { id: 'h1', title: 'Hydration 2L+', emoji: '💧', category: 'health' as CategoryType, targetPerWeek: 7 },
  { id: 'h2', title: 'Daily Workout / Walk', emoji: '🏃‍♂️', category: 'health' as CategoryType, targetPerWeek: 5 },
  { id: 'h3', title: 'Read / Skill Practice', emoji: '📚', category: 'learning' as CategoryType, targetPerWeek: 6 },
  { id: 'h4', title: '2h+ Deep Uninterrupted Work', emoji: '🎯', category: 'deep-work' as CategoryType, targetPerWeek: 5 },
  { id: 'h5', title: 'Evening Log & Reflection', emoji: '🌙', category: 'mindset' as CategoryType, targetPerWeek: 7 },
];
