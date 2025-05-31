// src/components/LiveCall.jsx
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { mockData } from '../data/mockData';
import { AlertTriangle, Lightbulb, PlayCircle, PauseCircle, Loader2, Sparkles } from 'lucide-react';

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

const CoachingAlertModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 opacity-100">
                <div className="flex items-center mb-3">
                    <AlertTriangle size={24} className="text-yellow-500 mr-3" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{message}</p>
                <div className="mt-6 text-right">
                    <button onClick={onClose} className="bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-sky-600 transition-colors">Got it</button>
                </div>
            </div>
        </div>
    );
};

const LiveCall = () => {
    const [isCallActive, setIsCallActive] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState([]);
    const [currentSentimentData, setCurrentSentimentData] = useState([]);
    const [scriptSuggestion, setScriptSuggestion] = useState("No suggestions yet.");
    const [coachingAlert, setCoachingAlert] = useState({ isOpen: false, title: '', message: '' });
    
    const [showObjectionHelper, setShowObjectionHelper] = useState(false);
    const [lastCustomerObjection, setLastCustomerObjection] = useState("");
    const [aiObjectionResponses, setAiObjectionResponses] = useState([]);
    const [isFetchingObjectionHelp, setIsFetchingObjectionHelp] = useState(false);
    const [aiObjectionError, setAiObjectionError] = useState(null);

    const liveSentimentChartRef = useRef(null);
    const callIntervalRef = useRef(null);
    const transcriptContainerRef = useRef(null);

    useEffect(() => {
        if (transcriptContainerRef.current) {
            transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
        }
    }, [liveTranscript]);
    
    useEffect(() => {
        const config = {
            type: 'line',
            data: {
                labels: currentSentimentData.map((_, i) => i + 1),
                datasets: [{
                    label: 'Sentiment',
                    data: currentSentimentData,
                    borderColor: 'rgb(56, 189, 248)',
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { min: 0, max: 10, grid: { color: 'rgba(128,128,128,0.1)' } }, x: { grid: { display: false } } },
                plugins: { legend: { display: false } },
                animation: { duration: 300 }
            }
        };
        const chartInstance = createChartInstance(liveSentimentChartRef, config);
         return () => chartInstance?.destroy();
    }, [currentSentimentData]);

    const fetchObjectionResponsesFromGemini = async (objectionText) => {
        const prompt = `A customer made the following statement(s) which might be an objection: "${objectionText}". Provide 2-3 concise and actionable suggestions for how a sales/support agent can respond to this. Respond with a JSON object containing one key: "suggestedResponses" (an array of strings).`;
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: { "suggestedResponses": { "type": "ARRAY", "items": { "type": "STRING" } } },
                    required: ["suggestedResponses"]
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
                console.error("Gemini API Error (Objection Handling):", errorBody);
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const aiData = JSON.parse(result.candidates[0].content.parts[0].text);
                return aiData.suggestedResponses || [];
            } else {
                throw new Error("Failed to parse AI objection responses from API.");
            }
        } catch (error) {
            console.error("Error fetching AI objection responses:", error);
            setAiObjectionError(error.message || "Error generating AI objection tips.");
            return []; // Return empty array on error
        }
    };

    const handleObjectionHelpClick = async () => {
        if (!lastCustomerObjection) return;
        setIsFetchingObjectionHelp(true);
        setAiObjectionError(null);
        setAiObjectionResponses([]); 
        const responses = await fetchObjectionResponsesFromGemini(lastCustomerObjection);
        setAiObjectionResponses(responses);
        setIsFetchingObjectionHelp(false);
        setShowObjectionHelper(false); // Hide button after fetching
    };

    const startCall = () => {
        setIsCallActive(true);
        setLiveTranscript([]);
        setCurrentSentimentData([]);
        setAiObjectionResponses([]);
        setAiObjectionError(null);
        setShowObjectionHelper(false);
        setLastCustomerObjection("");
        setScriptSuggestion(mockData.liveCall.scriptSuggestions.find(s => s.time === 0)?.text || "No suggestions yet.");
        let step = 0;

        callIntervalRef.current = setInterval(() => {
            if (step >= mockData.liveCall.transcript.length) {
                endCall();
                return;
            }
            
            const currentTranscriptItem = mockData.liveCall.transcript[step];
            const currentSentiment = mockData.liveCall.sentiments[step];

            setLiveTranscript(prev => [...prev, currentTranscriptItem]);
            setCurrentSentimentData(prev => [...prev, currentSentiment]);
            
            const alert = mockData.liveCall.coachingAlerts.find(a => a.time === step);
            if (alert) {
                setCoachingAlert({ isOpen: true, title: '💡 Coaching Alert', message: alert.message });
            }

            const suggestion = mockData.liveCall.scriptSuggestions.find(s => s.time === step);
            if (suggestion) {
                setScriptSuggestion(suggestion.text);
            }

            // Check for objection trigger
            if (currentTranscriptItem.speaker === 'Customer' && currentSentiment <= 3 && !showObjectionHelper && !isFetchingObjectionHelp) {
                setShowObjectionHelper(true);
                setLastCustomerObjection(currentTranscriptItem.text);
            }

            step++;
        }, 2000);
    };

    const endCall = () => {
        clearInterval(callIntervalRef.current);
        setIsCallActive(false);
        setShowObjectionHelper(false);
        setLiveTranscript(prev => [...prev, { speaker: 'System', text: 'Call Ended.' }]);
    };

    useEffect(() => {
        return () => clearInterval(callIntervalRef.current); // Cleanup on unmount
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Live Call Simulation</h2>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Observe real-time transcription, sentiment, and coaching. Features AI-powered objection handling.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Live Transcript</h3>
                        <div>
                            {!isCallActive ? (
                                <button onClick={startCall} className="bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-sky-600 transition-colors flex items-center">
                                    <PlayCircle size={18} className="mr-2"/>Start Call
                                </button>
                            ) : (
                                <button onClick={endCall} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors flex items-center">
                                    <PauseCircle size={18} className="mr-2"/>End Call
                                </button>
                            )}
                        </div>
                    </div>
                    <div ref={transcriptContainerRef} className="h-96 overflow-y-auto bg-slate-100 dark:bg-slate-700 rounded-lg p-4 space-y-3 text-sm">
                        {liveTranscript.length === 0 && !isCallActive && <p className="text-slate-400 dark:text-slate-500 text-center italic">Call has not started.</p>}
                        {liveTranscript.map((item, index) => (
                            <div key={index}>
                                <p className={`font-bold ${item.speaker === 'Agent' || item.speaker === 'System' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-200'}`}>{item.speaker}</p>
                                <p className="text-slate-600 dark:text-slate-300">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">Live Sentiment</h3>
                        <div className="chart-container h-48 max-h-48"><canvas ref={liveSentimentChartRef}></canvas></div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">AI & Script Suggestions</h3>
                        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 min-h-[100px]">
                           <p><Lightbulb size={16} className="inline mr-2 text-yellow-400" /> {scriptSuggestion}</p>
                            {showObjectionHelper && !isFetchingObjectionHelp && (
                                <button 
                                    onClick={handleObjectionHelpClick}
                                    className="mt-2 w-full bg-amber-500 text-white px-3 py-2 rounded-lg font-semibold text-xs hover:bg-amber-600 transition-colors flex items-center justify-center">
                                    <Sparkles size={14} className="mr-1.5" /> Get Objection Handling Tips
                                </button>
                            )}
                            {isFetchingObjectionHelp && (
                                <div className="flex items-center text-slate-500 dark:text-slate-400 mt-2">
                                    <Loader2 size={16} className="animate-spin mr-2" /> Fetching AI tips...
                                </div>
                            )}
                            {aiObjectionError && <p className="text-red-500 dark:text-red-400 text-xs mt-2">Error: {aiObjectionError}</p>}
                            {aiObjectionResponses.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                                    <h4 className="font-semibold text-xs text-sky-600 dark:text-sky-400 mb-1.5">✨ AI Objection Handling Tips:</h4>
                                    <ul className="list-disc list-inside space-y-1 marker:text-sky-500">
                                        {aiObjectionResponses.map((resp, i) => <li key={i} className="text-xs">{resp}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <CoachingAlertModal 
                isOpen={coachingAlert.isOpen} 
                onClose={() => setCoachingAlert({ ...coachingAlert, isOpen: false })}
                title={coachingAlert.title}
                message={coachingAlert.message}
            />
        </div>
    );
};

export default LiveCall;

