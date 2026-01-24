import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatAPI = {
  startSession: async (customerId) => {
    const response = await api.post('/chat/start', { customerId });
    return response.data;
  },
  
  sendMessage: async (sessionId, message, metadata = {}) => {
    const response = await api.post('/chat/message', {
      sessionId,
      message,
      metadata
    });
    return response.data;
  },
  
  getSession: async (sessionId) => {
    const response = await api.get(`/chat/session/${sessionId}`);
    return response.data;
  },
};

export const agentAPI = {
  getDemoCustomers: async () => {
    const response = await api.get('/agents/demo-customers');
    return response.data;
  },
  
  getCustomer: async (customerId) => {
    const response = await api.get(`/agents/customer/${customerId}`);
    return response.data;
  },
};

export const pdfAPI = {
  generateSanctionLetter: async (customer, loanDetails, underwritingResult) => {
    const response = await api.post('/pdf/generate-sanction-letter', {
      customer,
      loanDetails,
      underwritingResult
    }, {
      responseType: 'blob'
    });
    return response.data;
  },
};

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (token) => {
    const response = await api.post('/auth/logout', {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  getCurrentUser: async (token) => {
    const response = await api.get('/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  updateProfile: async (token, profileData) => {
    const response = await api.put('/auth/profile', profileData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  getLoanHistory: async (token) => {
    const response = await api.get('/auth/loans', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  getConversations: async (token) => {
    const response = await api.get('/auth/conversations', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },
};

export default api;
