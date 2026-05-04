import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

const mapNotification = (notification: Record<string, any>) => ({
  _id: notification.id,
  message: notification.message,
  read: notification.read,
  createdAt: notification.created_at,
  type: notification.type,
  complaintId: notification.complaint_id ?? undefined,
});

// 📩 Get notifications
export const getNotificationsByUserId = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user._id !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json((data || []).map(mapNotification));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Mark one as read
export const markNotificationAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (!req.user || notification.user_id !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { data, error: updateError } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json(mapNotification(data));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Mark all as read
export const markAllNotificationsAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user._id !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', req.params.userId)
      .eq('read', false);

    if (error) throw error;

    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
