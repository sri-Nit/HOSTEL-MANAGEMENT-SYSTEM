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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      socket.connect();
      socket.emit('joinRoom', storedUser._id);
    }
    setIsLoading(false);

    socket.on('newNotification', (notification) => {
      showSuccess(`New Notification: ${notification.message}`);
    });

    return () => {
      socket.off('newNotification');
      socket.disconnect();
    };
  }, []);

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