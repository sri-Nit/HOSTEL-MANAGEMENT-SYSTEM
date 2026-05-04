import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../services/supabaseClient';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isApproved?: boolean;
  hostelBlock?: string | null;
  roomNumber?: string | null;
  assignedCategories?: string[] | null;
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

const isUserApproved = (user: Record<string, any>) =>
  typeof user.is_approved === 'boolean' ? user.is_approved : true;

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.id)
        .maybeSingle();

      if (error || !user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: isUserApproved(user),
        hostelBlock: user.hostel_block,
        roomNumber: user.room_number,
        assignedCategories: user.assigned_categories,
      };

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user?.role} is not authorized to access this route` });
    }
    next();
  };
};
