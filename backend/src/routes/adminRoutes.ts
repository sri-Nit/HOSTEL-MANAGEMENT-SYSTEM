import { Router } from 'express';
import {
  getUsers,
  approveUser,
  updateUserRole,
  getEscalatedComplaints,
  getAdminReports,
  runEscalationCheck,
  resolveEscalation
} from '../controllers/adminController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/users', protect, authorizeRoles('admin'), getUsers);
router.post('/users/:id/approve', protect, authorizeRoles('admin'), approveUser);
router.patch('/users/:id/role', protect, authorizeRoles('admin'), updateUserRole);
router.get('/escalations', protect, authorizeRoles('admin'), getEscalatedComplaints);
router.post('/escalations/run-check', protect, authorizeRoles('admin'), runEscalationCheck);
router.post('/escalations/:id/resolve', protect, authorizeRoles('admin'), resolveEscalation);
router.get('/reports', protect, authorizeRoles('admin'), getAdminReports);

export default router;
