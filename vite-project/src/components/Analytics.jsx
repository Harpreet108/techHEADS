// src/components/Analytics.jsx
import { useState, useEffect } from 'react';
import { getAgentStats } from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAgentStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>
      <div className="bg-white p-4 rounded shadow">
        <p>Total Calls: {stats.totalCalls || 0}</p>
        {/* Add charts or additional analytics here */}
      </div>
    </div>
  );
};

export default Analytics;