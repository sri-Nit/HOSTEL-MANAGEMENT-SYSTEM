export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'guard' | 'admin';
  hostelBlock?: string;
  roomNumber?: string;
  assignedCategories?: string[];
  securityQuestion?: string;
  securityAnswer?: string;
  token: string;
}