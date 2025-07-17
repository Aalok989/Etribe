import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Use proxy path in development
  headers: {
    'Client-Service': 'COHAPPRT',
    'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
    'rurl': 'pftii.etribes.in',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for sending cookies (ci_session)
});

export default api;