import { UserData } from './auth.types';

// Mock database in localStorage
const getMockUsers = () => JSON.parse(localStorage.getItem('mock_users') || '[]');
const saveMockUsers = (users: any[]) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

// Initialize with a default admin if none exists
export const initDefaultAdmin = () => {
  const users = getMockUsers();
  if (users.length === 0) {
    const defaultAdmin = {
      _id: 'admin-1',
      name: 'System Admin',
      email: 'admin@hcms.com',
      password: 'admin',
      role: 'admin',
      securityQuestion: 'What is your favorite color?',
      securityAnswer: 'blue',
      token: 'mock-admin-token'
    };
    saveMockUsers([defaultAdmin]);
  }
};

initDefaultAdmin();

export const register = async (userData: any) => {
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
  users.push(newUser);
  saveMockUsers(users);
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

export const getSecurityQuestion = async (email: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const users = getMockUsers();
  const user = users.find((u: any) => u.email === email);
  if (!user) throw new Error('User not found');
  return user.securityQuestion;
};

export const resetPassword = async (email: string, answer: string, newPassword: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const users = getMockUsers();
  const userIndex = users.findIndex((u: any) => u.email === email && u.securityAnswer.toLowerCase() === answer.toLowerCase());
  
  if (userIndex === -1) {
    throw new Error('Incorrect answer to security question');
  }

  users[userIndex].password = newPassword;
  saveMockUsers(users);
  return true;
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
  initDefaultAdmin();
};