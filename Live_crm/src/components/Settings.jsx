// src/components/Settings.jsx
import React from 'react';

const Settings = ({ currentTheme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h2>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Customize your application experience.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Appearance</h3>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-300">Theme</span>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors text-sm font-medium"
          >
            Switch to {currentTheme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>
       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="emailNotifications" className="text-slate-600 dark:text-slate-300">Email Notifications</label>
            <input type="checkbox" id="emailNotifications" className="form-checkbox h-5 w-5 text-sky-500 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-400" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="inAppNotifications" className="text-slate-600 dark:text-slate-300">In-App Coaching Alerts</label>
            <input type="checkbox" id="inAppNotifications" defaultChecked className="form-checkbox h-5 w-5 text-sky-500 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

