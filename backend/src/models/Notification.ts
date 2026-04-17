import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  message: string;
  type: 'complaint_submitted' | 'complaint_approved' | 'complaint_rejected' | 'complaint_assigned' | 'complaint_in_progress' | 'complaint_resolved' | 'complaint_escalated';
  complaintId?: mongoose.Schema.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['complaint_submitted', 'complaint_approved', 'complaint_rejected', 'complaint_assigned', 'complaint_in_progress', 'complaint_resolved', 'complaint_escalated'],
    required: true,
  },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>('Notification', NotificationSchema);