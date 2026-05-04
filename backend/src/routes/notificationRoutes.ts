import { Router } from 'express';
import {
  getNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/user/:userId', protect, getNotificationsByUserId);
router.put('/:id/read', protect, markNotificationAsRead);
router.put('/mark-all-read/:userId', protect, markAllNotificationsAsRead);

export default router;
