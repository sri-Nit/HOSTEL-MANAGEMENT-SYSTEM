import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'guard' | 'admin';
  hostelBlock?: string;
  roomNumber?: string;
  assignedCategories?: string[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'guard', 'admin'], required: true },
  hostelBlock: { type: String },
  roomNumber: { type: String },
  assignedCategories: [{ type: String }]
});

export default mongoose.model<IUser>('User', UserSchema);