import { Request, Response } from 'express';
import { IUser } from '../models/User';
import { emitNotification } from '../services/socketService';
import { checkComplaintEscalations } from '../services/cronService';
import { supabase } from '../services/supabaseClient';

interface AuthRequest extends Request {
  user?: IUser;
}

const isUserApproved = (user: Record<string, any>) =>
  typeof user.is_approved === 'boolean' ? user.is_approved : true;

const ALLOWED_USER_ROLES = ['student', 'guard', 'admin', 'service_personnel'] as const;

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(
      (users || []).map(user => ({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: isUserApproved(user),
        createdAt: user.created_at,
      }))
    );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body as { role?: string };

    if (!role || !ALLOWED_USER_ROLES.includes(role as typeof ALLOWED_USER_ROLES[number])) {
      return res.status(400).json({ message: 'Please provide a valid role.' });
    }

    if (req.user?._id?.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot change your own role from this screen.' });
    }

    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates: Record<string, any> = { role };

    if ('is_approved' in currentUser) {
      updates.is_approved = role === 'guard' ? true : isUserApproved(currentUser);
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (updateError || !updatedUser) {
      return res.status(500).json({ message: updateError?.message || 'Failed to update role.' });
    }

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isApproved: isUserApproved(updatedUser),
      createdAt: updatedUser.created_at,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveUser = async (req: AuthRequest, res: Response) => {
  try {
    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!('is_approved' in targetUser)) {
      return res.status(400).json({
        message:
          'User approval is not available yet because the users.is_approved column has not been added. Run backend/sql/add_user_approval_column.sql in Supabase first.',
      });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ is_approved: true })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: isUserApproved(user),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEscalatedComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const { data: escalations, error: escalationsError } = await supabase
      .from('escalations')
      .select('*')
      .eq('status', 'pending')
      .order('escalated_at', { ascending: false });

    if (escalationsError) throw escalationsError;
    if (!escalations || escalations.length === 0) return res.json([]);

    const complaintIds = escalations.map(e => e.complaint_id);

    const { data: complaints, error: complaintsError } = await supabase
      .from('complaints')
      .select('*')
      .in('id', complaintIds);

    if (complaintsError) throw complaintsError;

    const userIds = Array.from(
      new Set(
        (complaints || [])
          .flatMap(c => [c.user_id, c.assigned_to])
          .filter(Boolean)
      )
    );

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, hostel_block, room_number')
      .in('id', userIds);

    if (usersError) throw usersError;

    const complaintsById = new Map((complaints || []).map(c => [c.id, c]));
    const usersById = new Map((users || []).map(u => [u.id, u]));

    const response = escalations.map(escalation => {
      const complaint = complaintsById.get(escalation.complaint_id);
      const student = complaint ? usersById.get(complaint.user_id) : null;
      const assignedTo = complaint?.assigned_to
        ? usersById.get(complaint.assigned_to)
        : null;

      return {
        _id: escalation.id,
        escalatedAt: escalation.escalated_at,
        status: escalation.status,
        complaintId: complaint
          ? {
              _id: complaint.id,
              category: complaint.category,
              description: complaint.description,
              status: complaint.status,
              createdAt: complaint.created_at,
              location: complaint.location,
              userId: student
                ? {
                    name: student.name,
                    email: student.email,
                    hostelBlock: student.hostel_block,
                    roomNumber: student.room_number
                  }
                : undefined,
              assignedTo: assignedTo
                ? {
                    name: assignedTo.name,
                    email: assignedTo.email
                  }
                : undefined
            }
          : null
      };
    }).filter(item => item.complaintId);

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const runEscalationCheck = async (req: AuthRequest, res: Response) => {
  try {
    const escalatedCount = await checkComplaintEscalations();
    res.json({ message: 'Escalation check completed', escalatedCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveEscalation = async (req: AuthRequest, res: Response) => {
  try {
    const { data: escalation, error } = await supabase
      .from('escalations')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !escalation) {
      return res.status(404).json({ message: 'Escalation not found' });
    }

    if (escalation.status !== 'pending') {
      return res.status(400).json({ message: 'Escalation already resolved' });
    }

    const { data: complaint, error: complaintError } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', escalation.complaint_id)
      .single();

    if (complaintError || !complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const now = new Date().toISOString();

    await supabase
      .from('escalations')
      .update({ status: 'resolved_by_admin' })
      .eq('id', req.params.id);

    await supabase
      .from('complaints')
      .update({
        status: 'resolved',
        updated_at: now,
        resolution_note:
          req.body.resolutionNote ||
          'Resolved by admin after escalation review.'
      })
      .eq('id', escalation.complaint_id);

    await emitNotification(
      complaint.user_id,
      `Your escalated complaint #${complaint.id.slice(-6)} has been resolved by Admin.`,
      'complaint_resolved',
      complaint.id
    );

    res.json({ message: 'Escalation resolved successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminReports = async (req: AuthRequest, res: Response) => {
  try {
    const countByStatus = async (status?: string) => {
      let query = supabase
        .from('complaints')
        .select('*', { count: 'exact', head: true });

      if (status) query = query.eq('status', status);

      const { count, error } = await query;
      if (error) throw error;

      return count || 0;
    };

    const [
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      escalatedComplaints
    ] = await Promise.all([
      countByStatus(),
      countByStatus('pending'),
      countByStatus('resolved'),
      countByStatus('escalated')
    ]);

    res.json({
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      escalatedComplaints
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
