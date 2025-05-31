// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getRecentCalls = async () => {
  const response = await axios.get(`${API_URL}/calls/recent`);
  return response.data;
};

export const getAgentStats = async () => {
  const response = await axios.get(`${API_URL}/agent/stats`);
  return response.data;
};

export const getSettings = async () => {
  const response = await axios.get(`${API_URL}/settings`);
  return response.data;
};

export const saveSettings = async (settings) => {
  const response = await axios.post(`${API_URL}/settings`, settings);
  return response.data;
};