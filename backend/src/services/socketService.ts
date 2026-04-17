import { Server as SocketIOServer } from 'socket.io';
import Notification, { INotification } from '../models/Notification';
import { IUser } from '../models/User';

let io: SocketIOServer;

export const initSocket = (socketServer: SocketIOServer) => {
  io = socketServer;

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    // Join a room based on user ID for private notifications
    socket.on('joinRoom', (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });
  });
};

export const emitNotification = async (
  userId: string | mongoose.Schema.Types.ObjectId,
  message: string,
  type: INotification['type'],
  complaintId?: mongoose.Schema.Types.ObjectId
) => {
  const notification = await Notification.create({
    userId,
    message,
    type,
    complaintId,
    read: false,
  });

  if (io) {
    io.to(userId.toString()).emit('newNotification', notification);
    console.log(`Emitted notification to user ${userId}: ${message}`);
  }
};

export const emitToRole = async (
  role: IUser['role'],
  message: string,
  type: INotification['type'],
  complaintId?: mongoose.Schema.Types.ObjectId
) => {
  // This would require a more complex setup to track users by role in real-time
  // For simplicity, we'll assume a mechanism to get all user IDs for a role
  // In a real app, you might have a map of connected sockets to user IDs and roles.
  // For now, this function will primarily be used to notify specific users or the admin.
  console.log(`Attempted to emit to role ${role}: ${message}`);
  // Example: If you want to notify all wardens, you'd fetch all warden user IDs and emit to each.
};