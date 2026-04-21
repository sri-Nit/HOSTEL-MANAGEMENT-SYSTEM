import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Home, FileText, Shield, BarChart, ListChecks, UserCircle, HelpCircle, ShieldCheck, Users, ClipboardList } from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user } = useAuth();
  const location = useLocation();

  const studentLinks = [
    { to: '/student/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/student/submit-complaint', icon: FileText, label: 'Submit Complaint' },
    { to: '/student/my-complaints', icon: ListChecks, label: 'My Complaints' },
    { to: '/student/need-help', icon: HelpCircle, label: 'Need Help' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const guardLinks = [
    { to: '/guard/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/guard/complaints', icon: ShieldCheck, label: 'Verify Complaints' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/all-complaints', icon: ClipboardList, label: 'All Complaints' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/escalations', icon: Shield, label: 'Escalations' },
    { to: '/admin/reports', icon: BarChart, label: 'Reports' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  let navLinks: { to: string; icon: React.ElementType; label: string }[] = [];

  if (user) {
    switch (user.role) {
      case 'student': navLinks = studentLinks; break;
      case 'guard': navLinks = guardLinks; break;
      case 'admin': navLinks = adminLinks; break;
    }
  }

  return (
    <div className={cn("pb-12 w-64 border-r bg-sidebar text-sidebar-foreground", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {user?.role ? `${user.role === 'guard' ? 'Warder' : user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel` : 'Navigation'}
          </h2>
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === link.to ? "bg-sidebar-accent text-sidebar-accent-foreground" : "transparent"
                )}
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