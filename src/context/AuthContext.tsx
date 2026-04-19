import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getCurrentUser, logout as authLogout, UserData } from '@/services/auth';
import { socket } from '@/services/socket';
import { showSuccess, showError } from '@/utils/toast';

interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for bypassing authentication - Defaulting to student
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
  const [user, setUser] = useState<UserData | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (user) {
      try {
        socket.connect();
        socket.emit('joinRoom', user._id);
      } catch (e) {
        console.warn("Socket connection failed, but continuing in mock mode.");
      }
    }

    const handleNewNotification = (notification: any) => {
      showSuccess(`New Notification: ${notification.message}`);
    };

    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('newNotification', handleNewNotification);
      socket.disconnect();
    };
  }, [user]);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setIsAuthenticated(true);
    socket.connect();
    socket.emit('joinRoom', userData._id);
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
    socket.disconnect();
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