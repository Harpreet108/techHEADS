// src/App.jsx
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LiveCall from './components/LiveCall';
import Analytics from './components/Analytics';
import Settings from './components/Settings'; // Corrected Settings component
import { BarChart2, PhoneCall, Settings as SettingsIcon, LayoutDashboard } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'dark'; // Default to dark theme
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'live-call', label: 'Live Call', icon: <PhoneCall size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    // Apply base styling that reacts to the 'dark' class on <html>
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-sky-500 dark:text-sky-400">SmartVoice CRM</h1>
        </div>
      </header>

      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <div className="flex space-x-1 sm:space-x-2 border-b border-slate-300 dark:border-slate-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-3 text-sm sm:text-base font-medium rounded-t-md transition-colors duration-150 ease-in-out
                  ${activeTab === item.id
                    ? 'border-b-2 border-sky-500 dark:border-sky-400 text-sky-500 dark:text-sky-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                  }`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'live-call' && <LiveCall />}
          {activeTab === 'analytics' && <Analytics />}
          {/* Pass currentTheme and setTheme to the Settings component */}
          {activeTab === 'settings' && <Settings currentTheme={theme} setTheme={setTheme} />}
        </div>
      </div>

      <footer className="text-center py-4 text-slate-600 dark:text-slate-500 text-sm border-t border-slate-200 dark:border-slate-700">
        © {new Date().getFullYear()} SmartVoice CRM. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
