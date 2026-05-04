export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'guard' | 'service_personnel' | 'admin';
  isApproved?: boolean;
  hostelBlock?: string;
  roomNumber?: string;
  assignedCategories?: string[];
  securityQuestion?: string;
  securityAnswer?: string;
  token: string;
  requiresApproval?: boolean;
}
