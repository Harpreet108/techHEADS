import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function SmartVoiceCRMApp() {
  const [calls, setCalls] = useState([]);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [dashboard, setDashboard] = useState({ totalCalls: 0, avgDuration: 0, avgScore: 0, actionItems: 0 });

  useEffect(() => {
    // Fetch dashboard data
    fetch('/api/analytics/dashboard')
      .then(res => res.json())
      .then(setDashboard);

    // Fetch recent calls
    fetch('/api/calls/recent')
      .then(res => res.json())
      .then(setCalls);

    // Listen for real-time updates
    socket.on('transcript', data => setLiveTranscript(data.text));
    socket.on('coaching', alert => alert && alert('Coaching Tip: ' + alert.message));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📞 SmartVoice CRM Dashboard</h1>

      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <Card title="Total Calls" value={dashboard.totalCalls} />
        <Card title="Avg Duration" value={dashboard.avgDuration + ' min'} />
        <Card title="Avg Score" value={dashboard.avgScore} />
        <Card title="Action Items" value={dashboard.actionItems} />
      </div>

      <button onClick={() => socket.emit('startCall')}>Start Call</button>
      <button onClick={() => socket.emit('endCall')}>End Call</button>

      <h2>📜 Live Transcript</h2>
      <div style={{ background: '#fff', padding: 10, borderRadius: 4, minHeight: 100 }}>
        {liveTranscript}
      </div>

      <h2>📂 Recent Calls</h2>
      <table border="1" cellPadding="5" style={{ background: '#fff' }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Sentiment</th>
            <th>Score</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {calls.map(call => (
            <tr key={call.id}>
              <td>{call.customer}</td>
              <td>{call.sentiment}</td>
              <td>{call.score}</td>
              <td>{call.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      background: '#fff', padding: 10, borderRadius: 8,
      flex: 1, textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: 24 }}>{value}</p>
    </div>
  );
}

