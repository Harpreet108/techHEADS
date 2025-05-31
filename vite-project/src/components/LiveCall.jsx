// src/components/LiveCall.jsx
import { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

const LiveCall = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { transcript, startTranscription, stopTranscription } = useWebSocket('ws://localhost:8080');

  const startCall = () => {
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsRecording(false);
    stopTranscription();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopTranscription();
    } else {
      startTranscription();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Live Call</h2>
      <div className="space-x-4 mb-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={startCall}
          disabled={isCallActive}
        >
          Start Call
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={endCall}
          disabled={!isCallActive}
        >
          End Call
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={toggleRecording}
          disabled={!isCallActive}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      <div className="bg-white p-4 rounded shadow h-64 overflow-auto">
        <p>{transcript || 'No transcription yet...'}</p>
      </div>
    </div>
  );
};

export default LiveCall;