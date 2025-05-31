// src/components/Analytics.jsx
import { useState, useEffect } from 'react';
// import { getAgentStats } from '../services/api'; // Assuming API service is set up
import { BarChartHorizontalBig } from 'lucide-react';

// Mock API functions for UI development
const getAgentStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return { totalCalls: 120, averageCallDuration: '6m 15s', firstCallResolution: '75%', customerSatisfaction: '8.5/10' };
};


const Analytics = () => {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAgentStats(); // Replace with actual API call
        setStats(data);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><p className="text-slate-400">Loading analytics data...</p></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-400"><p>Error: {error}</p></div>;
  }
  
  const StatDisplay = ({ label, value }) => (
    <div className="bg-slate-700 p-4 rounded-md">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-xl font-semibold text-slate-100">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center mb-6">
        <BarChartHorizontalBig size={28} className="mr-3 text-sky-400" />
        <h2 className="text-2xl font-semibold text-slate-100">Performance Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatDisplay label="Total Calls (Period)" value={stats.totalCalls} />
        <StatDisplay label="Average Call Duration" value={stats.averageCallDuration} />
        <StatDisplay label="First Call Resolution Rate" value={stats.firstCallResolution} />
        <StatDisplay label="Customer Satisfaction (CSAT)" value={stats.customerSatisfaction} />
      </div>

      <div className="bg-slate-700/50 shadow-md rounded-lg p-6 min-h-[300px] flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium text-slate-200 mb-2">Call Volume Trends</h3>
        {/* Placeholder for a chart */}
        <p className="text-slate-500 italic">Chart component will be rendered here.</p>
        <div className="w-full h-64 bg-slate-600/50 rounded-md mt-4 flex items-center justify-center text-slate-400">
          Chart Area
        </div>
      </div>
    </div>
  );
};

export default Analytics;
