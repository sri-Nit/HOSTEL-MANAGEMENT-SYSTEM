import { UserData } from './auth.types';

// Mock database in localStorage
const getMockUsers = () => JSON.parse(localStorage.getItem('mock_users') || '[]');
const saveMockUser = (user: any) => {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem('mock_users', JSON.stringify(users));
};

export const register = async (userData: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getMockUsers();
  if (users.find((u: any) => u.email === userData.email)) {
    throw { response: { data: { message: 'User already exists' } } };
  }

  const newUser = {
    ...userData,
    _id: Math.random().toString(36).substr(2, 9),
    token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 5)
  };
  
  saveMockUser(newUser);
  return newUser;
};

export const login = async (credentials: any) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getMockUsers();
  const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password);
  
  if (!user) {
    throw { response: { data: { message: 'Invalid email or password' } } };
  }

  const userData = { ...user };
  delete userData.password;
  localStorage.setItem('user', JSON.stringify(userData));
  return userData;
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