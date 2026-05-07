import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/constants';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const verifyPhone = (idToken) =>
  api.post('/auth/verify', { idToken }).then((r) => r.data);

export const getMe = () => api.get('/users/me').then((r) => r.data);
export const updateProfile = (data) => api.put('/users/me', data).then((r) => r.data);
export const switchRole = (isBiker) =>
  api.put('/users/me/role', { isBiker }).then((r) => r.data);
export const submitDocs = (data) =>
  api.put('/users/me/docs', data).then((r) => r.data);
export const updateLocation = (lat, lng) =>
  api.put('/users/me/location', { lat, lng }).then((r) => r.data);

export const createDelivery = (data) =>
  api.post('/deliveries', data).then((r) => r.data);
export const getMyDeliveries = () =>
  api.get('/deliveries/mine').then((r) => r.data);
export const getPendingDeliveries = () =>
  api.get('/deliveries/pending').then((r) => r.data);
export const getDelivery = (id) =>
  api.get(`/deliveries/${id}`).then((r) => r.data);
export const acceptDelivery = (id) =>
  api.put(`/deliveries/${id}/accept`).then((r) => r.data);
export const updateDeliveryStatus = (id, status) =>
  api.put(`/deliveries/${id}/status`, { status }).then((r) => r.data);
export const rateDelivery = (id, rating) =>
  api.post(`/deliveries/${id}/rate`, { rating }).then((r) => r.data);

export const getMyEarnings = () => api.get('/earnings').then((r) => r.data);

export default api;
