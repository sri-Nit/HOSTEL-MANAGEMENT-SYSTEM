import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { UserData } from '@/services/auth.types';

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
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userData: UserData = {
          _id: session.user.id,
          name: session.user.user_metadata.name,
          email: session.user.email || '',
          role: session.user.user_metadata.role,
          hostelBlock: session.user.user_metadata.hostelBlock,
          roomNumber: session.user.user_metadata.roomNumber,
          token: session.access_token
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      setIsLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData: UserData = {
          _id: session.user.id,
          name: session.user.user_metadata.name,
          email: session.user.email || '',
          role: session.user.user_metadata.role,
          hostelBlock: session.user.user_metadata.hostelBlock,
          roomNumber: session.user.user_metadata.roomNumber,
          token: session.access_token
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/auth');
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