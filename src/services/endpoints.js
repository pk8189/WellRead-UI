import { readCookie } from './cookies';

export const HEADERS = {
  'Content-Type': 'application/json',
};

export const getToken = () => {
  const token = readCookie('authtoken');
  return token || null;
};

export const getAuthHeader = () => (getToken() ? { Authorization: `Bearer ${getToken()}` } : null);
