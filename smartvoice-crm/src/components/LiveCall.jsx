// src/components/LiveCall.jsx
import { useState } from 'react';
import { Phone, Mic, Square, Zap } from 'lucide-react';

// Mock WebSocket hook for UI development (keep for now)
const useWebSocket = (url) => {
  const [transcript, setTranscript] = useState("Alice: Hello, I'm calling about my recent order.\nAgent: Hello Alice, I can help you with that. Can I have your order number please?\nAlice: Sure, it's 12345ABC.\nAgent: Thank you. One moment...\n");
  const startTranscription = () => console.log('Start transcription triggered for', url);
  const stopTranscription = () => console.log('Stop transcription triggered for', url);
  return { transcript, startTranscription, stopTranscription };
};

const ActionButton = ({ onClick, disabled, children, variant = 'primary', icon }) => {
  // Base styles updated
  const baseStyle = "px-4 py-2 rounded-md font-semibold flex items-center justify-center space-x-2 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800";
  // Variant styles updated for light/dark
  const variants = {
    primary: `bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-slate-600 hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-400 text-slate-100 dark:text-slate-100 focus:ring-slate-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
  };
  // Specific override for secondary in light mode for better contrast
  if (variant === 'secondary' && !document.documentElement.classList.contains('dark')) {
     variants.secondary = `bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  }


  return (
    <button className={`${baseStyle} ${variants[variant]}`} onClick={onClick} disabled={disabled}>
      {icon}
      <span>{children}</span>
    </button>
  );
};

const LiveCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { transcript, startTranscription, stopTranscription } = useWebSocket('ws://localhost:8080');

  const startCall = () => setIsCallActive(true);
  const endCall = () => {
    setIsCallActive(false);
    if (isRecording) {
      stopTranscription();
      setIsRecording(false);
    }
  };
  const toggleRecording = () => {
    if (!isCallActive) return;
    if (isRecording) stopTranscription();
    else startTranscription();
    setIsRecording(!isRecording);
  };

  return (
    <div>
      {/* Text color updated */}
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6 transition-colors duration-300">Live Call Management</h2>
      
      {/* Container background, border updated */}
      <div className="bg-white dark:bg-slate-700/50 shadow-md dark:shadow-slate-900/50 rounded-lg p-6 mb-6 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        {/* Border color updated */}
        <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-600 transition-colors duration-300">
          <ActionButton onClick={startCall} disabled={isCallActive} icon={<Phone size={18}/>} variant="primary">
            Start Call
          </ActionButton>
          <ActionButton onClick={endCall} disabled={!isCallActive} icon={<Square size={18}/>} variant="danger">
            End Call
          </ActionButton>
          <ActionButton onClick={toggleRecording} disabled={!isCallActive} icon={<Mic size={18}/>} variant="secondary">
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </ActionButton>
        </div>
        
        {isCallActive && (
          <div className="mb-4">
            {/* Text color potentially needs light mode adjustment too */}
            <p className="text-sm text-green-600 dark:text-green-400 animate-pulse flex items-center transition-colors duration-300"><Zap size={16} className="mr-2"/> Call in Progress {isRecording && "(Recording)"}</p>
          </div>
        )}

        <div>
          {/* Text color updated */}
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2 transition-colors duration-300">Live Transcription</h3>
          {/* Transcription area background, border, text updated */}
          <div className="bg-slate-50 dark:bg-slate-900/70 p-4 rounded-md min-h-[200px] max-h-[400px] overflow-y-auto border border-slate-300 dark:border-slate-600 transition-colors duration-300">
            {transcript ? (
              <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-sans transition-colors duration-300">{transcript}</pre>
            ) : (
              <p className="text-slate-500 dark:text-slate-500 italic transition-colors duration-300">
                {isCallActive ? (isRecording ? "Listening for speech..." : "Recording paused or not started.") : "Start a call and recording to see transcription."}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Placeholder for Coaching Alerts */}
      {/* <div className="bg-white dark:bg-slate-700/50 shadow-md dark:shadow-slate-900/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Coaching Alerts</h3>
        <p className="text-slate-500 dark:text-slate-500 italic">Alerts will appear here...</p>
      </div> */}
    </div>
  );
};

export default LiveCall;
