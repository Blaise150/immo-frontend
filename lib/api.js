import axios from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://immo-backend-production-deb8.up.railway.app';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Injecte le token JWT sur chaque requête
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Déconnexion automatique si token expiré
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────
export const login = (email, password) =>
  api.post('/auth/login/', { email, password });

export const register = (data) => api.post('/auth/register/', data);

// ─── Propriétés ───────────────────────────────────
export const getProperties = (params = {}) =>
  api.get('/properties/', { params });

export const getProperty = (id) => api.get(`/properties/${id}/`);

// ─── Contact ──────────────────────────────────────
export const sendContactMessage = (data) => api.post('/contact/', data);

export default api;
