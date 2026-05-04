import api from './api';
import { UserData } from './auth.types';

export const register = async (userData: any) => {
  const response = await api.post<UserData>('/auth/register', userData);
  return response.data;
};

export const login = async (credentials: any) => {
  const response = await api.post<UserData>('/auth/login', credentials);
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

export const getSecurityQuestion = async (_email: string) => {
  throw new Error('Password recovery is not connected to the backend yet.');
};

export const resetPassword = async (_email: string, _answer: string, _newPassword: string) => {
  throw new Error('Password recovery is not connected to the backend yet.');
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): UserData | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const clearAllData = () => {
  localStorage.removeItem('mock_users');
  localStorage.removeItem('user_complaints');
  localStorage.removeItem('bulletin_messages');
  localStorage.removeItem('user');
};
