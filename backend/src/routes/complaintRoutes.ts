import { Router } from 'express';
import {
  submitComplaint,
  getComplaints,
  getComplaintById,
  approveComplaint,
  rejectComplaint,
  startComplaint,
  resolveComplaint,
} from '../controllers/complaintController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Student routes
router.post('/', protect, authorizeRoles('student'), upload.array('images', 3), submitComplaint);
router.get('/', protect, getComplaints); // All roles can get complaints relevant to them
router.get('/:id', protect, getComplaintById); // All roles can get a specific complaint relevant to them

// Warden routes
router.put('/:id/approve', protect, authorizeRoles('warden'), approveComplaint);
router.put('/:id/reject', protect, authorizeRoles('warden'), rejectComplaint);

// Service Personnel routes
router.put('/:id/start', protect, authorizeRoles('service_personnel'), startComplaint);
router.put('/:id/resolve', protect, authorizeRoles('service_personnel'), upload.single('resolutionPhoto'), resolveComplaint);

export default router;