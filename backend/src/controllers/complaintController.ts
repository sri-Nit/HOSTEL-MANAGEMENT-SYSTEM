import { Request, Response } from 'express';
import Complaint, { IComplaint } from '../models/Complaint';
import User, { IUser } from '../models/User';
import { emitNotification } from '../services/socketService';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: IUser;
}

export const submitComplaint = async (req: AuthRequest, res: Response) => {
  const { category, description, location } = req.body;
  const images = (req.files as Express.Multer.File[])?.map(file => `/uploads/${file.filename}`);

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const complaint = await Complaint.create({
      userId: req.user._id,
      category,
      description,
      location,
      images: images || [],
      status: 'pending',
    });

    // Notify Student (Confirmation)
    await emitNotification(
      req.user._id,
      `Your complaint #${complaint._id.toString().slice(-6)} has been submitted successfully.`,
      'complaint_submitted',
      complaint._id as mongoose.Schema.Types.ObjectId
    );

    // Notify Wardens
    const wardens = await User.find({ role: 'warden' });
    for (const warden of wardens) {
      await emitNotification(
        warden._id,
        `New complaint #${complaint._id.toString().slice(-6)} submitted by ${req.user.name}.`,
        'complaint_submitted',
        complaint._id as mongoose.Schema.Types.ObjectId
      );
    }

    res.status(201).json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaints = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    let complaints: IComplaint[] = [];
    const userRole = req.user.role;
    const userId = req.user._id;

    if (userRole === 'student') {
      complaints = await Complaint.find({ userId }).populate('assignedTo', 'name email');
    } else if (userRole === 'warden') {
      complaints = await Complaint.find({ status: { $in: ['pending', 'approved', 'in_progress', 'resolved', 'escalated'] } })
        .populate('userId', 'name email hostelBlock roomNumber')
        .populate('assignedTo', 'name email');
    } else if (userRole === 'service_personnel') {
      complaints = await Complaint.find({ assignedTo: userId, status: { $in: ['approved', 'in_progress'] } })
        .populate('userId', 'name email hostelBlock roomNumber');
    } else if (userRole === 'admin') {
      complaints = await Complaint.find({})
        .populate('userId', 'name email hostelBlock roomNumber')
        .populate('assignedTo', 'name email');
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(complaints);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaintById = async (req: AuthRequest, res: Response) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email hostelBlock roomNumber')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user?.role === 'student' && complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveComplaint = async (req: AuthRequest, res: Response) => {
  const { assignedTo } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status !== 'pending') {
      return res.status(400).json({ message: 'Complaint is not in pending status' });
    }

    const servicePersonnel = await User.findById(assignedTo);
    if (!servicePersonnel || servicePersonnel.role !== 'service_personnel') {
      return res.status(400).json({ message: 'Invalid service personnel ID' });
    }

    complaint.status = 'approved';
    complaint.assignedTo = assignedTo;
    complaint.updatedAt = new Date();
    await complaint.save();

    // Notify Student (Approved & Assigned)
    await emitNotification(
      complaint.userId,
      `Your complaint #${complaint._id.toString().slice(-6)} has been approved and assigned to ${servicePersonnel.name}.`,
      'complaint_approved',
      complaint._id as mongoose.Schema.Types.ObjectId
    );

    // Notify Service Personnel
    await emitNotification(
      assignedTo,
      `You have been assigned a new complaint #${complaint._id.toString().slice(-6)}.`,
      'complaint_assigned',
      complaint._id as mongoose.Schema.Types.ObjectId
    );

    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectComplaint = async (req: AuthRequest, res: Response) => {
  const { rejectionReason } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status !== 'pending') {
      return res.status(400).json({ message: 'Complaint is not in pending status' });
    }

    complaint.status = 'rejected';
    complaint.rejectionReason = rejectionReason;
    complaint.updatedAt = new Date();
    await complaint.save();

    // Notify Student (Rejected)
    await emitNotification(
      complaint.userId,
      `Your complaint #${complaint._id.toString().slice(-6)} has been rejected. Reason: ${rejectionReason}`,
      'complaint_rejected',
      complaint._id as mongoose.Schema.Types.ObjectId
    );

    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const startComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.assignedTo?.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this complaint' });
    }

    if (complaint.status !== 'approved') {
      return res.status(400).json({ message: 'Complaint is not in approved status' });
    }

    complaint.status = 'in_progress';
    complaint.updatedAt = new Date();
    await complaint.save();

    // Notify Student (In Progress)
    await emitNotification(
      complaint.userId,
      `Your complaint #${complaint._id.toString().slice(-6)} is now in progress.`,
      'complaint_in_progress',
      complaint._id as mongoose.Schema.Types.ObjectId
    );

    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveComplaint = async (req: AuthRequest, res: Response) => {
  const { resolutionNote } = req.body;
  const resolutionPhoto = (req.file as Express.Multer.File)?.filename ? `/uploads/${(req.file as Express.Multer.File).filename}` : undefined;

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.assignedTo?.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this complaint' });
    }

    if (complaint.status !== 'in_progress') {
      return res.status(400).json({ message: 'Complaint is not in progress status' });
    }

    complaint.status = 'resolved';
    complaint.resolutionNote = resolutionNote;
    complaint.resolutionPhoto = resolutionPhoto;
    complaint.updatedAt = new Date();
    await complaint.save();

    // Notify Student (Resolved)
    await emitNotification(
      complaint.userId,
      `Your complaint #${complaint._id.toString().slice(-6)} has been resolved!`,
      'complaint_resolved',
      complaint._id as mongoose.Schema.Types.ObjectId
    );

    // Notify Warden
    const wardens = await User.find({ role: 'warden' });
    for (const warden of wardens) {
      await emitNotification(
        warden._id,
        `Complaint #${complaint._id.toString().slice(-6)} has been resolved by ${req.user?.name}.`,
        'complaint_resolved',
        complaint._id as mongoose.Schema.Types.ObjectId
      );
    }

    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};