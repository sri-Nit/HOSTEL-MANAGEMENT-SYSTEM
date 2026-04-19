import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { UserData } from '@/services/auth';
import { showSuccess } from '@/utils/toast';

interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for bypassing authentication
const mockUser: UserData = {
  _id: 'mock-user-id-123',
  name: 'Mock Student',
  email: 'student@example.com',
  role: 'student',
  hostelBlock: 'Block A',
  roomNumber: '101',
  token: 'mock-token-for-development'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with mock user to bypass login
  const [user, setUser] = useState<UserData | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    showSuccess("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};