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

// Warder routes
router.put('/:id/approve', protect, authorizeRoles('guard'), approveComplaint);
router.put('/:id/reject', protect, authorizeRoles('guard'), rejectComplaint);

// Work progress routes
router.put('/:id/start', protect, authorizeRoles('guard', 'service_personnel'), startComplaint);
router.put('/:id/resolve', protect, authorizeRoles('guard', 'service_personnel'), upload.single('resolutionPhoto'), resolveComplaint);

export default router;
