// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Users, PhoneOutgoing, AlertCircle } from 'lucide-react'; // Example icons

// Mock API functions for UI development (keep for now)
const getRecentCalls = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 'C001', customer: 'Alice Wonderland', time: '10:30 AM', status: 'Completed', sentiment: 'Positive' },
    { id: 'C002', customer: 'Bob The Builder', time: '11:15 AM', status: 'Missed', sentiment: 'N/A' },
    { id: 'C003', customer: 'Charlie Brown', time: '09:45 AM', status: 'In Progress', sentiment: 'Neutral' },
  ];
};

const getAgentStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { totalCalls: 25, averageHandleTime: '5m 30s', sentimentScore: 7.8 };
};

const StatCard = ({ title, value, icon, unit }) => (
  // Updated for theme switching
  <div className="bg-white dark:bg-slate-700/50 p-5 rounded-lg shadow-lg flex items-center space-x-4 transition-colors duration-300 hover:bg-slate-50 dark:hover:bg-slate-700">
    {/* Icon background and text color updated for theme switching */}
    <div className="p-3 bg-sky-100 dark:bg-sky-500/20 rounded-full text-sky-600 dark:text-sky-400 transition-colors duration-300">
      {icon}
    </div>
    <div>
      {/* Text colors updated */}
      <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">{title}</p>
      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {value} <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300">{unit}</span>
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const [recentCalls, setRecentCalls] = useState([]);
  const [agentStats, setAgentStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [calls, stats] = await Promise.all([
          getRecentCalls(),
          getAgentStats()
        ]);
        setRecentCalls(calls);
        setAgentStats(stats);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Loading dashboard data...</p></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 dark:text-red-400 transition-colors duration-300"><p>Error: {error}</p></div>;
  }

  return (
    <div>
      {/* Text color updated */}
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6 transition-colors duration-300">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Calls Today" value={agentStats.totalCalls || 0} icon={<PhoneOutgoing size={24}/>} />
        <StatCard title="Avg. Handle Time" value={agentStats.averageHandleTime || 'N/A'} icon={<Users size={24}/>} />
        <StatCard title="Overall Sentiment" value={agentStats.sentimentScore || 'N/A'} unit="/10" icon={<AlertCircle size={24}/>} />
      </div>

      <div>
        {/* Text color updated */}
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">Recent Calls</h3>
        {/* Container background, shadow, border updated */}
        <div className="bg-white dark:bg-slate-700/50 shadow-md dark:shadow-slate-900/50 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-left">
              {/* Table header background, border, text updated */}
              <thead className="border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 transition-colors duration-300">
                <tr>
                  <th className="px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Call ID</th>
                  <th className="px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Time</th>
                  <th className="px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Sentiment</th>
                </tr>
              </thead>
              {/* Table body divider, text, hover updated */}
              <tbody className="divide-y divide-slate-200 dark:divide-slate-600 transition-colors duration-300">
                {recentCalls.length > 0 ? recentCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-slate-50 dark:hover:bg-slate-600/50 transition-colors duration-150">
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">{call.id}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">{call.customer}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{call.time}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm">
                      {/* Status badge colors updated */}
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${call.status === 'Completed' ? 'bg-green-100 dark:bg-green-600/30 text-green-700 dark:text-green-300' : 
                          call.status === 'Missed' ? 'bg-red-100 dark:bg-red-600/30 text-red-700 dark:text-red-300' : 
                          'bg-yellow-100 dark:bg-yellow-600/30 text-yellow-700 dark:text-yellow-300'}`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{call.sentiment}</td>
                  </tr>
                )) : (
                  <tr>
                    {/* Text color updated */}
                    <td colSpan="5" className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">No recent calls found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
