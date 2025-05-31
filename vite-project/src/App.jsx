/ src/App.jsx
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import LiveCall from './components/LiveCall';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold">SmartVoice CRM</h1>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex space-x-4 mb-6">
          <button
            className={px-4 py-2 ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={px-4 py-2 ${activeTab === 'live-call' ? 'bg-blue-500 text-white' : 'bg-gray-200'}}
            onClick={() => setActiveTab('live-call')}
          >
            Live Call
          </button>
          <button
            className={px-4 py-2 ${activeTab === 'analytics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={px-4 py-2 ${activeTab === 'settings' ? 'bg-blue-500 text-white' : 'bg-gray-200'}}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'live-call' && <LiveCall />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
};

export default App;
