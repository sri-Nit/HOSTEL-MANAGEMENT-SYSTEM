import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import { emitNotification } from '../services/socketService';

const SAME_ISSUE_AUTO_APPROVE_THRESHOLD = Number(process.env.SAME_ISSUE_AUTO_APPROVE_THRESHOLD || 3);

interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    role: string;
  };
}

const normalizeValue = (value: unknown) => String(value || '').trim().toLowerCase();

const isSameIssue = (
  complaint: { category?: string; location?: { block?: string; floor?: string; room?: string } },
  category: string,
  location: { block: string; floor: string; room?: string }
) => {
  return (
    normalizeValue(complaint.category) === normalizeValue(category) &&
    normalizeValue(complaint.location?.block) === normalizeValue(location.block) &&
    normalizeValue(complaint.location?.floor) === normalizeValue(location.floor) &&
    normalizeValue(complaint.location?.room) === normalizeValue(location.room)
  );
};

export const submitComplaint = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { category, description, location } = req.body;
    const normalizedLocation = {
      block: location?.block,
      floor: location?.floor,
      room: location?.room || ''
    };

    const { data: matchingComplaints, error: matchingComplaintsError } = await supabase
      .from('complaints')
      .select('category, location, status')
      .eq('category', category)
      .in('status', ['pending', 'approved', 'in_progress', 'escalated']);

    if (matchingComplaintsError) throw matchingComplaintsError;

    const sameIssueCount = (matchingComplaints || []).filter((existingComplaint) =>
      isSameIssue(existingComplaint, category, normalizedLocation)
    ).length;

    const shouldAutoApprove = sameIssueCount + 1 >= SAME_ISSUE_AUTO_APPROVE_THRESHOLD;
    const initialStatus = shouldAutoApprove ? 'approved' : 'pending';

    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert([
        {
          category,
          description,
          location: normalizedLocation,
          status: initialStatus,
          user_id: req.user._id
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await emitNotification(
      req.user._id,
      shouldAutoApprove
        ? `Your complaint #${complaint.id.slice(-6)} was automatically approved because multiple residents reported the same issue.`
        : `Your complaint #${complaint.id.slice(-6)} has been submitted successfully.`,
      shouldAutoApprove ? 'complaint_approved' : 'complaint_submitted',
      complaint.id
    );

    const { data: warders } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'guard');

    for (const warder of warders || []) {
      await emitNotification(
        warder.id,
        shouldAutoApprove
          ? `Complaint #${complaint.id.slice(-6)} was automatically approved after repeated reports and is ready for assignment.`
          : `New complaint #${complaint.id.slice(-6)} submitted by ${req.user.name}.`,
        shouldAutoApprove ? 'complaint_approved' : 'complaint_submitted',
        complaint.id
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

    let query = supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (req.user.role === 'student') {
      query = query.eq('user_id', req.user._id);
    } else if (req.user.role === 'service_personnel') {
      query = query.eq('assigned_to', req.user._id);
    } else if (!['guard', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaintById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { data: complaint, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role === 'student' && complaint.user_id !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    if (req.user.role === 'service_personnel' && complaint.assigned_to !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const { data: complaint, error } = await supabase
      .from('complaints')
      .update({
        status: 'approved',
        assigned_to: assignedTo,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const { data: servicePersonnel } = await supabase
      .from('users')
      .select('name')
      .eq('id', assignedTo)
      .single();

    await emitNotification(
      complaint.user_id,
      `Your complaint #${complaint.id.slice(-6)} has been approved and assigned to ${servicePersonnel?.name}.`,
      'complaint_approved',
      complaint.id
    );

    await emitNotification(
      assignedTo,
      `You have been assigned a new complaint #${complaint.id.slice(-6)}.`,
      'complaint_assigned',
      complaint.id
    );

    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const { data: complaint, error } = await supabase
      .from('complaints')
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await emitNotification(
      complaint.user_id,
      `Your complaint #${complaint.id.slice(-6)} has been rejected. Reason: ${rejectionReason}`,
      'complaint_rejected',
      complaint.id
    );

    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const startComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: complaint, error } = await supabase
      .from('complaints')
      .update({
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await emitNotification(
      complaint.user_id,
      `Your complaint #${complaint.id.slice(-6)} is now in progress.`,
      'complaint_in_progress',
      complaint.id
    );

    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: complaint, error } = await supabase
      .from('complaints')
      .update({
        status: 'resolved',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await emitNotification(
      complaint.user_id,
      `Your complaint #${complaint.id.slice(-6)} has been resolved!`,
      'complaint_resolved',
      complaint.id
    );

    const { data: warders } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'guard');

    for (const warder of warders || []) {
      await emitNotification(
        warder.id,
        `Complaint #${complaint.id.slice(-6)} has been resolved by ${req.user?.name}.`,
        'complaint_resolved',
        complaint.id
      );
    }

    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createComplaint = submitComplaint;
export const markInProgress = startComplaint;
