// src/components/Dashboard.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { mockData } from '../data/mockData';
import { PhoneCall, Clock, TrendingUp, ListChecks } from 'lucide-react';

// Helper function for Chart.js (can be moved to a shared utils file)
const createChartInstance = (canvasRef, config) => {
    if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (canvasRef.current.chartInstance) {
            canvasRef.current.chartInstance.destroy();
        }
        canvasRef.current.chartInstance = new Chart(ctx, config);
        return canvasRef.current.chartInstance;
    }
    return null;
};

const KpiCard = ({ title, value, icon, color = 'text-sky-500' }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-500 dark:text-slate-400">{title}</h3>
            {React.cloneElement(icon, { size: 24, className: `text-slate-400 dark:text-slate-500` })}
        </div>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
);

const AgentPerformanceChart = () => {
    const chartRef = useRef(null);
    useEffect(() => {
        const data = {
            labels: mockData.agents.map(a => a.name),
            datasets: [{
                label: 'Avg Sentiment',
                data: mockData.agents.map(a => a.avgSentiment),
                backgroundColor: 'rgba(56, 189, 248, 0.6)',
                borderColor: 'rgba(56, 189, 248, 1)',
                borderWidth: 1,
                borderRadius: 4,
            }, {
                label: 'Calls Handled',
                data: mockData.agents.map(a => a.calls),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
                borderRadius: 4,
            }]
        };
        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, grid: { color: 'rgba(128,128,128,0.1)' } }, x: { grid: { display: false } } },
                plugins: { legend: { position: 'bottom', labels: { color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#475569' } } },
                color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#475569',
            }
        };
        const chartInstance = createChartInstance(chartRef, config);
        return () => chartInstance?.destroy();
    }, []);
    return <div className="chart-container h-[320px] max-h-[400px]"><canvas ref={chartRef}></canvas></div>;
};

const SentimentTrendChart = () => {
    const chartRef = useRef(null);
    useEffect(() => {
        const data = {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Customer Sentiment',
                data: mockData.sentimentTrend,
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(75, 192, 192)'
            }]
        };
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: Math.min(...mockData.sentimentTrend) - 1,
                        max: Math.max(...mockData.sentimentTrend) + 1,
                        grid: { color: 'rgba(128,128,128,0.1)' }
                    },
                    x: { grid: { display: false } }
                },
                plugins: { legend: { display: false } },
                color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#475569',
            }
        };
        const chartInstance = createChartInstance(chartRef, config);
        return () => chartInstance?.destroy();
    }, []);
    return <div className="chart-container h-[320px] max-h-[400px]"><canvas ref={chartRef}></canvas></div>;
};

const RecentCallsTable = ({ setActiveTab, setSelectedCallIdForAnalytics }) => {
    const handleRowClick = (callId) => {
        setSelectedCallIdForAnalytics(callId);
        setActiveTab('analytics');
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b-2 border-slate-100 dark:border-slate-700">
                    <tr>
                        <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Customer</th>
                        <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Agent</th>
                        <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Sentiment</th>
                        <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Duration</th>
                        <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {mockData.calls.slice(0, 5).map(call => {
                        const sentimentColor = call.sentiment === 'Positive' ? 'text-green-500 dark:text-green-400' : call.sentiment === 'Negative' ? 'text-red-500 dark:text-red-400' : 'text-slate-600 dark:text-slate-300';
                        return (
                            <tr key={call.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors" onClick={() => handleRowClick(call.id)}>
                                <td className="p-3 font-medium text-slate-800 dark:text-slate-100">{call.customer}</td>
                                <td className="p-3 text-slate-700 dark:text-slate-200">{call.agent}</td>
                                <td className={`p-3 font-semibold ${sentimentColor}`}>{call.sentiment}</td>
                                <td className="p-3 text-slate-700 dark:text-slate-200">{call.duration}</td>
                                <td className="p-3 text-slate-700 dark:text-slate-200">{call.date}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const Dashboard = ({ setActiveTab, setSelectedCallIdForAnalytics }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Manager's Dashboard</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
                High-level overview of team performance and key call metrics.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <KpiCard title="Total Calls Today" value="128" icon={<PhoneCall />} />
            <KpiCard title="Avg. Call Duration" value="5:42 min" icon={<Clock />} />
            <KpiCard title="Team Sentiment" value="Positive" icon={<TrendingUp />} color="text-green-500 dark:text-green-400" />
            <KpiCard title="Action Items" value="34" icon={<ListChecks />} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Agent Performance</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Key metrics across your sales team for the current week.</p>
                <AgentPerformanceChart />
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Customer Sentiment Trend</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Overall customer sentiment from calls over the last 7 days.</p>
                <SentimentTrendChart />
            </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Recent Call Log</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Most recent calls. Click any row for detailed analytics.</p>
            <RecentCallsTable setActiveTab={setActiveTab} setSelectedCallIdForAnalytics={setSelectedCallIdForAnalytics} />
        </div>
    </div>
);

export default Dashboard;

