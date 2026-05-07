export const API_URL = 'http://localhost:5000/api';
export const SOCKET_URL = 'http://localhost:5000';

export const DEFAULT_REGION = {
  latitude: -17.8292,
  longitude: 31.0522,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const COLORS = {
  primary: '#FF6B00',
  secondary: '#1A1A2E',
  success: '#2ECC71',
  danger: '#E74C3C',
  light: '#F8F9FA',
  muted: '#6C757D',
  white: '#FFFFFF',
};

export const DELIVERY_STATUSES = {
  pending: 'Waiting for Biker',
  accepted: 'Biker Assigned',
  picked_up: 'Package Picked Up',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
