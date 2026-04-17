import { Request, Response } from 'express';
import Notification from '../models/Notification';
import { IUser } from '../models/User';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: IUser;
}

export const getNotificationsByUserId = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to view these notifications' });
    }

    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications

    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (!req.user || notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllNotificationsAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to update these notifications' });
    }

    await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { $set: { read: true } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};