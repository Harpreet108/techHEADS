// src/App.jsx
import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Keep for theme updates, though components manage their own charts
import Dashboard from './components/Dashboard';
import LiveCall from './components/LiveCall';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { BarChart2, PhoneCall, Settings as SettingsIcon, LayoutDashboard } from 'lucide-react';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedCallIdForAnalytics, setSelectedCallIdForAnalytics] = useState(null);
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
        
        // Attempt to update chart colors on theme change
        // This relies on Chart.js instances being globally accessible or components re-rendering
        Object.values(Chart.instances).forEach(instance => {
            if(instance && typeof instance.update === 'function'){
                if (instance.options.plugins.legend.labels) {
                     instance.options.plugins.legend.labels.color = theme === 'dark' ? '#cbd5e1' : '#475569';
                }
                if (instance.options.scales?.x?.ticks) {
                     instance.options.scales.x.ticks.color = theme === 'dark' ? '#cbd5e1' : '#475569';
                }
                 if (instance.options.scales?.x?.grid) { // Added for grid lines
                    instance.options.scales.x.grid.color = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                }
                if (instance.options.scales?.y?.ticks) {
                     instance.options.scales.y.ticks.color = theme === 'dark' ? '#cbd5e1' : '#475569';
                }
                if (instance.options.scales?.y?.grid) { // Added for grid lines
                    instance.options.scales.y.grid.color = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                }
                instance.update();
            }
        });
    }, [theme]);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'live-call', label: 'Live Call', icon: <PhoneCall size={18} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300">
            <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-30 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">SmartVoice CRM</h1>
                        </div>
                        <nav className="hidden sm:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
                                    ${activeTab === item.id
                                        ? 'bg-sky-100 dark:bg-sky-700 text-sky-600 dark:text-sky-300'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                                    }`}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                     }}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                         <div className="sm:hidden">
                            <select 
                                value={activeTab} 
                                onChange={(e) => setActiveTab(e.target.value)}
                                className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-md p-2 focus:ring-sky-500 focus:border-sky-500"
                            >
                                {navItems.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} setSelectedCallIdForAnalytics={setSelectedCallIdForAnalytics} />}
                {activeTab === 'live-call' && <LiveCall />}
                {activeTab === 'analytics' && <Analytics selectedCallId={selectedCallIdForAnalytics} setSelectedCallId={setSelectedCallIdForAnalytics} />}
                {activeTab === 'settings' && <Settings currentTheme={theme} setTheme={setTheme} />}
            </main>
            <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 mt-8">
                © {new Date().getFullYear()} SmartVoice CRM. All rights reserved.
            </footer>
        </div>
    );
}

export default App;
