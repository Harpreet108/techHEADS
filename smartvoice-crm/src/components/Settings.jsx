// src/components/Settings.jsx
import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';

// Mock API functions for UI development - Remove if you have actual API calls
const getSettingsFromAPI = async () => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  // In a real app, you might fetch user's preference for language/notifications here
  // Theme is managed globally, so not fetched/saved here directly through API
  return { notifications: true, language: 'en' };
};
const saveOtherSettingsToAPI = async (otherSettings) => {
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
  console.log('Other settings saved:', otherSettings);
  return otherSettings;
};

// Receive currentTheme and setTheme as props
const Settings = ({ currentTheme, setTheme }) => {
  // Local state for settings other than theme
  const [otherSettings, setOtherSettings] = useState({ notifications: true, language: 'en' });
  const [isLoading, setIsLoading] = useState(true); // For fetching 'otherSettings'
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchOtherSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSettingsFromAPI();
        setOtherSettings(data || { notifications: true, language: 'en' });
      } catch (err) {
        console.error('Error fetching other settings:', err);
        setError(err.message || 'Failed to load other settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOtherSettings();
  }, []);

  const handleThemeChange = (e) => {
    setTheme(e.target.value); // Call the setTheme function from App.jsx
  };

  const handleOtherSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOtherSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage('');
    try {
      // Save other settings (language, notifications) to your backend
      await saveOtherSettingsToAPI({
        language: otherSettings.language,
        notifications: otherSettings.notifications,
      });
      // Theme is saved to localStorage by App.jsx, no need to save it here via API
      setSuccessMessage('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><p className="text-slate-500 dark:text-slate-400">Loading settings...</p></div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Application Settings</h2>
      <form onSubmit={handleSave} className="space-y-6">
        {error && <div className="p-3 rounded-md bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 text-sm">{error}</div>}
        {successMessage && <div className="p-3 rounded-md bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-sm">{successMessage}</div>}

        {/* Theme Setting */}
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            value={currentTheme} // Use currentTheme prop
            onChange={handleThemeChange} // Use dedicated theme change handler
            className="w-full sm:w-1/2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Language Setting */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={otherSettings.language}
            onChange={handleOtherSettingsChange}
            className="w-full sm:w-1/2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {/* Notifications Setting */}
        <div className="flex items-center">
          <input
            id="notifications"
            name="notifications"
            type="checkbox"
            checked={otherSettings.notifications}
            onChange={handleOtherSettingsChange}
            className="h-4 w-4 text-sky-600 dark:text-sky-500 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 focus:ring-sky-500"
          />
          <label htmlFor="notifications" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
            Enable Notifications
          </label>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
