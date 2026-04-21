import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Home, FileText, Shield, BarChart, ListChecks, UserCircle, HelpCircle, ShieldCheck, Users, ClipboardList } from 'lucide-react';

const Sidebar: React.FC = () => {
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
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 py-8 px-4 space-y-8">
        <div>
          <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
            {user?.role === 'guard' ? 'Warder' : user?.role} Navigation
          </h2>
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group",
                    isActive 
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <link.icon className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                  )} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      <div className="p-6 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-bold text-slate-700">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;