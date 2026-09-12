import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Zap, 
  Moon, 
  Droplets, 
  Trophy, 
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDisplayDate, formatDuration } from '../../lib/dateUtils';
import { MoodType } from '../../types';

export const DayReviewView: React.FC = () => {
  const { 
    selectedDate, 
    currentActivities, 
    currentAchievements, 
    currentSummary, 
    updateDaySummary,
    stats 
  } = useApp();

  const [copied, setCopied] = useState(false);

  const moods: { type: MoodType; emoji: string; label: string }[] = [
    { type: 'ecstatic', emoji: '🤩', label: 'On Fire' },
    { type: 'energized', emoji: '⚡', label: 'Energized' },
    { type: 'content', emoji: '😊', label: 'Content' },
    { type: 'focused', emoji: '🎯', label: 'Focused' },
    { type: 'tired', emoji: '☕', label: 'Tired' },
    { type: 'stressed', emoji: '😮‍💨', label: 'Stressed' },
  ];

  // Generate markdown recap
  const generateMarkdownReport = () => {
    const lines = [
      `# 📅 Daily Recap: ${formatDisplayDate(selectedDate)}`,
      `**Mood:** ${currentSummary.mood || 'Content'} | **Energy:** ${currentSummary.energyRating || 4}/5 | **Time Logged:** ${formatDuration(stats.todayTimeMinutes)}`,
      '',
      `### 🌟 Highlight of the Day`,
      `> ${currentSummary.highlight || 'Productive day moving the needle forward.'}`,
      '',
      `### 🏆 What I Achieved (${currentAchievements.length} Wins)`,
    ];

    if (currentAchievements.length === 0) {
      lines.push('- No explicit wins recorded today.');
    } else {
      currentAchievements.forEach((ach) => {
        lines.push(`- ${ach.badgeEmoji || '🏆'} **${ach.title}** [${ach.impact.toUpperCase()}] ${ach.metric ? `(${ach.metric})` : ''}`);
        if (ach.reflection) lines.push(`  - *Lesson:* "${ach.reflection}"`);
      });
    }

    lines.push('', `### ✅ What I Did (${stats.todayCompletedCount}/${stats.todayTotalCount} Activities)`);
    currentActivities.forEach((act) => {
      lines.push(`- [${act.completed ? 'x' : ' '}] **${act.time}:** ${act.title} (${formatDuration(act.durationMinutes)})`);
    });

    lines.push(
      '',
      `### 💭 Evening Reflection`,
      `**What went well:** ${currentSummary.reflectionWins || 'Steady progress throughout the day.'}`,
      `**Key learning:** ${currentSummary.reflectionLearnings || 'Consistency compounds over time.'}`,
      `**Tomorrow's #1 Focus:** ${currentSummary.tomorrowPriority || 'Keep momentum going.'}`,
    );

    return lines.join('\n');
  };

  const handleCopyReport = () => {
    const report = generateMarkdownReport();
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Title & Copy Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-850 dark:bg-slate-800/80 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Daily Review & Evening Journal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Reflecting on {formatDisplayDate(selectedDate)}
          </p>
        </div>

        <button
          onClick={handleCopyReport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Copied Recap to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Daily Report</span>
            </>
          )}
        </button>
      </div>

      {/* Mood, Energy, Health quick inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mood Selector */}
        <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Overall Day Vibe
          </label>
          <div className="flex items-center justify-between gap-1">
            {moods.map((m) => (
              <button
                key={m.type}
                onClick={() => updateDaySummary(selectedDate, { mood: m.type })}
                className={`p-2 rounded-xl text-xl transition ${
                  currentSummary.mood === m.type
                    ? 'bg-indigo-100 dark:bg-indigo-950/80 border-2 border-indigo-500 scale-110 shadow-xs'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 opacity-60 hover:opacity-100'
                }`}
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Rating */}
        <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Average Energy (1-5)
          </label>
          <div className="flex items-center justify-between gap-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => updateDaySummary(selectedDate, { energyRating: lvl })}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  lvl <= (currentSummary.energyRating || 4)
                    ? 'bg-amber-400 text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                }`}
              >
                {lvl}★
              </button>
            ))}
          </div>
        </div>

        {/* Water & Sleep */}
        <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs flex items-center justify-between gap-4">
          <div className="flex-1">
            <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              Water
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                max="20"
                value={currentSummary.waterIntake || 0}
                onChange={(e) => updateDaySummary(selectedDate, { waterIntake: Number(e.target.value) })}
                className="w-14 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <span className="text-xs text-slate-400">glasses</span>
            </div>
          </div>

          <div className="flex-1">
            <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              Sleep
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={currentSummary.sleepHours || 0}
                onChange={(e) => updateDaySummary(selectedDate, { sleepHours: Number(e.target.value) })}
                className="w-14 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <span className="text-xs text-slate-400">hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Evening Reflection Questions */}
      <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5 sm:p-6 shadow-xs space-y-5">
        {/* Question 1: Highlight */}
        <div>
          <label className="block text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>1. What was the absolute highlight of your day?</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Closing the client deal, hitting 5km run in 23m, cooking with family..."
            value={currentSummary.highlight || ''}
            onChange={(e) => updateDaySummary(selectedDate, { highlight: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
          />
        </div>

        {/* Question 2: What went well / Wins */}
        <div>
          <label className="block text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            <span>2. What went well today? (Celebrate your progress)</span>
          </label>
          <textarea
            rows={2}
            placeholder="What actions worked well? What decisions turned out right?"
            value={currentSummary.reflectionWins || ''}
            onChange={(e) => updateDaySummary(selectedDate, { reflectionWins: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Question 3: What did you learn */}
        <div>
          <label className="block text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>3. What did you learn or what could you adjust tomorrow?</span>
          </label>
          <textarea
            rows={2}
            placeholder="Any friction you noticed? An insight about your energy or focus?"
            value={currentSummary.reflectionLearnings || ''}
            onChange={(e) => updateDaySummary(selectedDate, { reflectionLearnings: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Question 4: Tomorrow's Top Priority */}
        <div>
          <label className="block text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>4. Tomorrow's #1 Focus (Hit the ground running)</span>
          </label>
          <input
            type="text"
            placeholder="What is the single most impactful thing to accomplish tomorrow morning?"
            value={currentSummary.tomorrowPriority || ''}
            onChange={(e) => updateDaySummary(selectedDate, { tomorrowPriority: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
          />
        </div>
      </div>

      {/* Formatted Report Preview Box */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Shareable Daily Summary
            </span>
          </div>
          <button
            onClick={handleCopyReport}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition"
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>

        <pre className="mt-3 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-72">
          {generateMarkdownReport()}
        </pre>
      </div>
    </div>
  );
};
