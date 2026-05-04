import { Server as SocketIOServer } from 'socket.io';
import { supabase } from './supabaseClient';

let io: SocketIOServer;

export type NotificationType =
  | 'complaint_submitted'
  | 'complaint_approved'
  | 'complaint_rejected'
  | 'complaint_assigned'
  | 'complaint_in_progress'
  | 'complaint_resolved'
  | 'complaint_escalated';

export const initSocket = (socketServer: SocketIOServer) => {
  io = socketServer;

  io.on('connection', (socket) => {
    socket.on('joinRoom', (userId: string) => {
      if (userId) {
        socket.join(userId);
      }
    });
  });
};

export const emitNotification = async (
  userId: string,
  message: string,
  type: NotificationType,
  complaintId?: string
) => {
  const { data: notification, error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: userId,
        message,
        type,
        complaint_id: complaintId,
        read: false
      }
    ])
    .select()
    .single();

  if (error) throw error;

  if (io) {
    io.to(userId).emit('newNotification', {
      _id: notification.id,
      message: notification.message,
      read: notification.read,
      createdAt: notification.created_at,
      type: notification.type,
      complaintId: notification.complaint_id ?? undefined,
    });
  }
};
