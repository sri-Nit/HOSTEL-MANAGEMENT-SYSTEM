import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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

  const fetchUserProfile = async (sessionUser: any, token: string) => {
    try {
      // Add a 5-second timeout to the profile fetch to prevent hanging
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

      if (error) throw error;

      const userData: UserData = {
        _id: sessionUser.id,
        name: profile.name || sessionUser.user_metadata.name,
        email: sessionUser.email || '',
        role: profile.role as any,
        hostelBlock: profile.hostel_block,
        roomNumber: profile.room_number,
        token: token
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Auth: Profile fetch failed, using metadata fallback", error);
      const userData: UserData = {
        _id: sessionUser.id,
        name: sessionUser.user_metadata.name || 'User',
        email: sessionUser.email || '',
        role: sessionUser.user_metadata.role || 'student',
        hostelBlock: sessionUser.user_metadata.hostelBlock,
        roomNumber: sessionUser.user_metadata.roomNumber,
        token: token
      };
      setUser(userData);
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user, session.access_token);
        }
      } catch (err) {
        console.error("Auth: Initial check failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user, session.access_token);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      }
      
      if (event === 'SIGNED_OUT') {
        setIsLoading(false);
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
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    setIsLoading(false);
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