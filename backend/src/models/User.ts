import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Password can be optional for certain operations, but required for creation
  role: 'student' | 'warden' | 'service_personnel' | 'admin';
  hostelBlock?: string;
  roomNumber?: string;
  assignedCategories?: string[]; // For service personnel
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'warden', 'service_personnel', 'admin'], required: true },
  hostelBlock: { type: String },
  roomNumber: { type: String },
  assignedCategories: [{ type: String }] // e.g., ['Plumbing', 'Electrical']
});

export default mongoose.model<IUser>('User', UserSchema);