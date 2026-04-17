import mongoose, { Document, Schema } from 'mongoose';

export interface IComplaint extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  category: string;
  description: string;
  location: {
    block: string;
    floor: string;
    room: string;
  };
  images: string[]; // Array of image URLs
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'resolved' | 'escalated';
  rejectionReason?: string;
  assignedTo?: mongoose.Schema.Types.ObjectId; // Service Personnel ID
  resolutionNote?: string;
  resolutionPhoto?: string;
  createdAt: Date;
  updatedAt: Date;
  escalatedAt?: Date;
}

const ComplaintSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    block: { type: String, required: true },
    floor: { type: String, required: true },
    room: { type: String, required: true },
  },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in_progress', 'resolved', 'escalated'],
    default: 'pending',
  },
  rejectionReason: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolutionNote: { type: String },
  resolutionPhoto: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  escalatedAt: { type: Date },
});

export default mongoose.model<IComplaint>('Complaint', ComplaintSchema);