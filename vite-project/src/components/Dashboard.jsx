// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { getRecentCalls, getAgentStats } from '../services/api';

const Dashboard = () => {
  const [recentCalls, setRecentCalls] = useState([]);
  const [agentStats, setAgentStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const calls = await getRecentCalls();
        setRecentCalls(calls);
        const stats = await getAgentStats();
        setAgentStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Calls</h3>
          <p>{agentStats.totalCalls || 0}</p>
        </div>
        {/* Add more stats cards as needed */}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-medium mb-2">Recent Calls</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentCalls.map((call) => (
              <tr key={call.id}>
                <td>{call.id}</td>
                <td>{call.customer}</td>
                <td>{call.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;