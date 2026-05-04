import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../services/supabaseClient';

const ADMIN_SEED_EMAIL = 'admin@hcms.com';
const ALLOWED_EMAIL_DOMAIN = '@nitdelhi.ac.in';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isUserApproved = (user: Record<string, any>) =>
  typeof user.is_approved === 'boolean' ? user.is_approved : true;

const isAllowedLoginEmail = (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  return normalizedEmail === ADMIN_SEED_EMAIL || normalizedEmail.endsWith(ALLOWED_EMAIL_DOMAIN);
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, hostelBlock, roomNumber, assignedCategories } = req.body;

  try {
    const normalizedEmail = normalizeEmail(email);

    if (!isAllowedLoginEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Please use your @nitdelhi.ac.in email address.' });
    }

    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existingUserError) {
      throw existingUserError;
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      is_approved: role === 'guard' ? false : true,
      hostel_block: role === 'student' ? hostelBlock : null,
      room_number: role === 'student' ? roomNumber : null,
      assigned_categories: role === 'service_personnel' ? assignedCategories || [] : null,
    };

    const { data: user, error } = await supabase
      .from('users')
      .insert([payload])
      .select('*')
      .single();

    if (error || !user) {
      throw error || new Error('Failed to create user');
    }

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: isUserApproved(user),
      hostelBlock: user.hostel_block,
      roomNumber: user.room_number,
      assignedCategories: user.assigned_categories,
      token: generateToken(user.id),
      requiresApproval: role === 'guard' && !isUserApproved(user),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = normalizeEmail(email);

    if (!isAllowedLoginEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Please log in with your @nitdelhi.ac.in email address.' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.role === 'guard' && !isUserApproved(user)) {
      return res.status(403).json({ message: 'Your warder account is awaiting admin approval.' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: isUserApproved(user),
      hostelBlock: user.hostel_block,
      roomNumber: user.room_number,
      assignedCategories: user.assigned_categories,
      token: generateToken(user.id),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
