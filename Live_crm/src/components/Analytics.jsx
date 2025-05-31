// src/components/Analytics.jsx
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { mockData } from '../data/mockData';
import { Search, Zap, Loader2 } from 'lucide-react';

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

const CallHistoryList = ({ calls, onSelectCall, selectedCallId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCalls = calls.filter(call =>
        call.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.agent.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">Call History</h3>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search by customer or agent..."
                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 text-sm pl-10 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            </div>
            <ul className="space-y-2 flex-grow overflow-y-auto pr-1">
                {filteredCalls.length > 0 ? filteredCalls.map(call => {
                    const sentimentColor = call.sentiment === 'Positive' ? 'bg-green-100 dark:bg-green-700/50 text-green-800 dark:text-green-300' : call.sentiment === 'Negative' ? 'bg-red-100 dark:bg-red-700/50 text-red-800 dark:text-red-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300';
                    return (
                        <li key={call.id} onClick={() => onSelectCall(call.id)}
                            className={`p-3 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-700/50 cursor-pointer transition-colors ${selectedCallId === call.id ? 'bg-sky-100 dark:bg-sky-700/50 ring-2 ring-sky-400' : ''}`}>
                            <p className="font-bold text-slate-800 dark:text-slate-100">{call.customer}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{call.agent} - {call.date}</p>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full mt-2 inline-block ${sentimentColor}`}>{call.sentiment}</span>
                        </li>
                    );
                }) : <li className="text-slate-500 dark:text-slate-400 p-3 italic">No calls found.</li>}
            </ul>
        </div>
    );
};

const AnalyticsDetailPanel = ({ callId }) => {
    const [call, setCall] = useState(null);
    const [isLoadingAISummary, setIsLoadingAISummary] = useState(false);
    const [aiError, setAiError] = useState(null);

    const talkRatioChartRef = useRef(null);
    const callSentimentChartRef = useRef(null);

    useEffect(() => {
        if (callId) {
            const selectedCallData = mockData.calls.find(c => c.id === callId);
            if (selectedCallData) {
                 setCall(JSON.parse(JSON.stringify(selectedCallData))); 
            } else {
                setCall(null);
            }
            setAiError(null); 
        } else {
            setCall(null);
        }
    }, [callId]);

    useEffect(() => {
        if (call && call.talkRatio !== undefined) {
            const config = {
                type: 'doughnut',
                data: {
                    labels: ['Agent Talk', 'Customer Listen'],
                    datasets: [{ data: [call.talkRatio, 100 - call.talkRatio], backgroundColor: ['#0ea5e9', '#e2e8f0'], borderColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff', borderWidth: 4 }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#475569' } } } }
            };
            const chartInstance = createChartInstance(talkRatioChartRef, config);
            return () => chartInstance?.destroy();
        }
    }, [call]);

    useEffect(() => {
        if (call && call.sentimentData) {
             const config = {
                type: 'line',
                data: {
                    labels: call.sentimentData.map((_, i) => `Seg ${i + 1}`),
                    datasets: [{ label: 'Sentiment Score', data: call.sentimentData, borderColor: 'rgb(16, 185, 129)', backgroundColor: 'rgba(16, 185, 129, 0.2)', fill: true, tension: 0.4, pointBackgroundColor: 'rgb(16, 185, 129)', pointBorderColor: '#fff' }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 10, grid: { color: 'rgba(128,128,128,0.1)' } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } }, color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#475569', }
            };
            const chartInstance = createChartInstance(callSentimentChartRef, config);
            return () => chartInstance?.destroy();
        }
    }, [call]);


    const handleGenerateAISummary = async () => {
        if (!call || !call.transcript || call.transcript.length === 0) {
            setAiError("No transcript available for AI summary.");
            return;
        }
        setIsLoadingAISummary(true);
        setAiError(null);

        const transcriptText = call.transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
        const prompt = `Given the following call transcript, provide a concise summary of the conversation and a list of specific action items. Respond with a JSON object containing two keys: "summary" (string) and "actionItems" (array of strings).

Transcript:
${transcriptText}`;

        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: { "summary": { "type": "STRING" }, "actionItems": { "type": "ARRAY", "items": { "type": "STRING" } } },
                    required: ["summary", "actionItems"]
                }
            }
        };
        const apiKey = ""; // API key will be injected by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Gemini API Error Response:", errorBody);
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const aiData = JSON.parse(result.candidates[0].content.parts[0].text);
                setCall(prevCall => ({ ...prevCall, summary: aiData.summary, actionItems: aiData.actionItems }));
            } else {
                throw new Error("Failed to parse AI summary from API response.");
            }
        } catch (error) {
            console.error("Error fetching AI summary:", error);
            setAiError(error.message || "Error generating AI insights.");
        } finally {
            setIsLoadingAISummary(false);
        }
    };


    if (!call) {
        return (
            <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-700/30 rounded-xl p-8">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Select a call from the list to see its details.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                        <h3 className="font-bold text-xl mb-1 text-slate-800 dark:text-slate-100">Call Summary: {call.customer}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 sm:mb-0">{call.agent} on {call.date}</p>
                    </div>
                    <button onClick={handleGenerateAISummary} disabled={isLoadingAISummary}
                        className="bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mt-2 sm:mt-0 whitespace-nowrap">
                        {isLoadingAISummary ? <Loader2 size={18} className="animate-spin mr-2" /> : <Zap size={16} className="mr-2" />}
                        Generate AI Summary & Actions
                    </button>
                </div>
                {aiError && <p className="text-red-500 dark:text-red-400 text-sm mb-3">Error: {aiError}</p>}
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{call.summary}</p>
                
                <div className="mt-6">
                    <h4 className="font-semibold text-md mb-2 text-slate-800 dark:text-slate-100">Action Items</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-sm">
                        {call.actionItems.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div className="mt-6">
                    <h4 className="font-semibold text-md mb-2 text-slate-800 dark:text-slate-100">Key Topics</h4>
                    <div className="flex flex-wrap gap-2">
                        {call.topics.map(topic => <span key={topic} className="bg-sky-100 dark:bg-sky-700/50 text-sky-800 dark:text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-full">{topic}</span>)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">Talk / Listen Ratio</h3>
                    <div className="w-48 h-48"><canvas ref={talkRatioChartRef}></canvas></div>
                </div>
                <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">Sentiment Flow</h3>
                    <div className="chart-container h-48 max-h-48"><canvas ref={callSentimentChartRef}></canvas></div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">Full Transcript</h3>
                <div className="h-80 overflow-y-auto bg-slate-100 dark:bg-slate-700 rounded-lg p-4 space-y-3 text-sm">
                    {call.transcript && call.transcript.length > 0 ? call.transcript.map((t, i) => (
                        <div key={i}>
                            <p className={`font-bold ${t.speaker.toLowerCase().includes('customer') || t.speaker.toLowerCase().includes('client') ? 'text-slate-700 dark:text-slate-200' : 'text-sky-600 dark:text-sky-400'}`}>{t.speaker}</p>
                            <p className="text-slate-600 dark:text-slate-300">{t.text}</p>
                        </div>
                    )) : <p className="text-slate-400 dark:text-slate-500 italic">No transcript available for this call.</p>}
                </div>
            </div>
        </div>
    );
};

const Analytics = ({ selectedCallId, setSelectedCallId }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Call Analytics & Review</h2>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Explore past conversations for insights and performance review.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" style={{ minHeight: 'calc(100vh - 250px)'}}>
                <div className="lg:col-span-1 h-full">
                    <CallHistoryList calls={mockData.calls} onSelectCall={setSelectedCallId} selectedCallId={selectedCallId} />
                </div>
                <div className="lg:col-span-3 h-full">
                    <AnalyticsDetailPanel callId={selectedCallId} />
                </div>
            </div>
        </div>
    );
};

export default Analytics;

