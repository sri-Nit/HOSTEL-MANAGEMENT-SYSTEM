import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'student' | 'guard' | 'service_personnel' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  hostelBlock?: string;
  roomNumber?: string;
  assignedCategories?: string[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'guard', 'service_personnel', 'admin'], required: true },
  hostelBlock: { type: String },
  roomNumber: { type: String },
  assignedCategories: [{ type: String }]
});

export default mongoose.model<IUser>('User', UserSchema);
