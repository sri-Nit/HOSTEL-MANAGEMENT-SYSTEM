import mongoose, { Document, Schema } from 'mongoose';

export interface IEscalation extends Document {
  complaintId: mongoose.Types.ObjectId;
  escalatedAt: Date;
  status: 'pending' | 'resolved_by_admin';
}

const EscalationSchema: Schema = new Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true, unique: true },
  escalatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'resolved_by_admin'], default: 'pending' },
});

export default mongoose.model<IEscalation>('Escalation', EscalationSchema);
