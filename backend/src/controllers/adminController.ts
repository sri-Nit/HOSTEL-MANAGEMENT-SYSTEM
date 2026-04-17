import { Request, Response } from 'express';
import Escalation from '../models/Escalation';
import Complaint from '../models/Complaint';
import User from '../models/User';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const getEscalatedComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const escalatedComplaints = await Escalation.find({ status: 'pending' })
      .populate({
        path: 'complaintId',
        populate: [
          { path: 'userId', select: 'name email hostelBlock roomNumber' },
          { path: 'assignedTo', select: 'name email' }
        ]
      });

    res.json(escalatedComplaints);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminReports = async (req: AuthRequest, res: Response) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const approvedComplaints = await Complaint.countDocuments({ status: 'approved' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'in_progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const rejectedComplaints = await Complaint.countDocuments({ status: 'rejected' });
    const escalatedComplaints = await Complaint.countDocuments({ status: 'escalated' });

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({
      totalComplaints,
      pendingComplaints,
      approvedComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      escalatedComplaints,
      usersByRole,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};