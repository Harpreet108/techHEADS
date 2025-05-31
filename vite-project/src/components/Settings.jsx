// src/components/Settings.jsx
import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({ theme: 'light' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      alert('Settings saved!');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="bg-white p-4 rounded shadow">
        <label className="block mb-2">
          Theme:
          <select
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
            className="ml-2 p-1 border rounded"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;