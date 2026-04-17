import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Home, FileText, Shield, Wrench, BarChart } from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/student/submit-complaint', icon: FileText, label: 'Submit Complaint' },
  ];

  const wardenLinks = [
    { to: '/warden/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/warden/complaints', icon: FileText, label: 'Manage Complaints' },
  ];

  const servicePersonnelLinks = [
    { to: '/service-personnel/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/service-personnel/assigned-complaints', icon: Wrench, label: 'Assigned Complaints' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/escalations', icon: Shield, label: 'Escalations' },
    { to: '/admin/reports', icon: BarChart, label: 'Reports' },
    { to: '/admin/manage-users', icon: UserIcon, label: 'Manage Users' }, // Placeholder for future
  ];

  let navLinks: { to: string; icon: React.ElementType; label: string }[] = [];

  if (user) {
    switch (user.role) {
      case 'student':
        navLinks = studentLinks;
        break;
      case 'warden':
        navLinks = wardenLinks;
        break;
      case 'service_personnel':
        navLinks = servicePersonnelLinks;
        break;
      case 'admin':
        navLinks = adminLinks;
        break;
      default:
        break;
    }
  }

  return (
    <div className={cn("pb-12 w-64 border-r bg-sidebar text-sidebar-foreground", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel` : 'Navigation'}
          </h2>
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;