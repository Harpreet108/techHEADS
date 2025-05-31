// src/services/api.js
import axios from 'axios';

// The proxy in vite.config.js will handle prepending http://localhost:5000
const API_URL = '/api';

export const getRecentCalls = async () => {
  const response = await axios.get(`${API_URL}/calls/recent`);
  return response.data;
};

export const getAgentStats = async () => {
  const response = await axios.get(`${API_URL}/agent/stats`);
  return response.data;
};

// ... (rest of the functions remain similar)
export const getSettings = async () => {
  const response = await axios.get(`${API_URL}/settings`);
  return response.data;
};

export const saveSettings = async (settings) => {
  const response = await axios.post(`${API_URL}/settings`, settings);
  return response.data;
};
