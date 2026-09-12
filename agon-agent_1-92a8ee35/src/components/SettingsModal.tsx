import React, { useState } from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  Trash2, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    settings, 
    toggleSound, 
    toggleTheme, 
    loadSampleData, 
    clearAllData, 
    exportDataJson, 
    importDataJson 
  } = useApp();

  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daypulse_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        setImportStatus('Data imported successfully!');
      } else {
        setImportStatus('Failed to import: invalid JSON format.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              App Settings & Data Backup
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 pt-4 text-xs sm:text-sm">
          {/* Preferences */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Preferences
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Audio & Sound Effects
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Tactile feedback on task completion & win fanfare
                </span>
              </div>
              <button
                onClick={toggleSound}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  settings.soundEnabled
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {settings.soundEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Color Theme
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Currently in {settings.theme === 'dark' ? 'Dark' : 'Light'} Mode
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition"
              >
                Switch to {settings.theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>

          {/* Backup & Data */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Data Sovereignty & Backup
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition border border-slate-200 dark:border-slate-700"
              >
                <Download className="w-4 h-4 text-indigo-500" />
                <span>Export JSON</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition border border-slate-200 dark:border-slate-700 cursor-pointer">
                <Upload className="w-4 h-4 text-emerald-500" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <div className="p-2 text-xs font-bold text-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                {importStatus}
              </div>
            )}
          </div>

          {/* Reset / Sample Data */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  loadSampleData();
                  onClose();
                }}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reload Sample Data</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Clear all logs and achievements? Make sure you have exported a backup if needed.')) {
                    clearAllData();
                    onClose();
                  }
                }}
                className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
