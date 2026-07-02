// frontend/src/services/api.js

import axios from 'axios';

// Backend URL from .env
const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Search Properties
export const searchProperties = async (searchParams) => {
  try {
    const response = await api.post(
      '/api/properties/search',
      searchParams
    );

    return response.data;
  } catch (error) {
    console.error('Error searching properties:', error);

    // Return backend error if available
    throw error.response?.data || error;
  }
};

// Get Location Trends
export const getLocationTrends = async (city) => {
  try {
    const response = await api.get(
      `/api/properties/${encodeURIComponent(city)}/trends`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching location trends:', error);

    throw error.response?.data || error;
  }
};

export default api;