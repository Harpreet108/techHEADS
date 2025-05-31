// src/hooks/useWebSocket.js
import { useEffect, useState } from 'react';

export const useWebSocket = (url) => {
  const [transcript, setTranscript] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTranscript((prev) => prev + '\n' + data.transcript);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const startTranscription = () => {
    if (ws) {
      ws.send(JSON.stringify({ action: 'startTranscription' }));
    }
  };

  const stopTranscription = () => {
    if (ws) {
      ws.send(JSON.stringify({ action: 'stopTranscription' }));
    }
  };

  return { transcript, startTranscription, stopTranscription };
};