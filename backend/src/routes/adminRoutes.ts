import { Router } from 'express';
import { getEscalatedComplaints, getAdminReports } from '../controllers/adminController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/escalations', protect, authorizeRoles('admin'), getEscalatedComplaints);
router.get('/reports', protect, authorizeRoles('admin'), getAdminReports);

export default router;