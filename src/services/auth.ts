import { supabase } from '@/integrations/supabase/client';
import { UserData } from './auth.types';

export const register = async (userData: any) => {
  const { email, password, name, role, hostelBlock, roomNumber } = userData;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        hostelBlock,
        roomNumber,
      }
    }
  });

  if (error) throw error;
  return data.user;
};

export const login = async (credentials: any) => {
  const { email, password } = credentials;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  
  const user = data.user;
  const userData: UserData = {
    _id: user.id,
    name: user.user_metadata.name,
    email: user.email || '',
    role: user.user_metadata.role,
    hostelBlock: user.user_metadata.hostelBlock,
    roomNumber: user.user_metadata.roomNumber,
    token: data.session?.access_token || ''
  };

  return userData;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  localStorage.removeItem('user');
};