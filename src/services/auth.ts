import api from './api';

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'guard' | 'admin';
  hostelBlock?: string;
  roomNumber?: string;
  assignedCategories?: string[];
  token: string;
}

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const login = async (userData: any) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): UserData | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};