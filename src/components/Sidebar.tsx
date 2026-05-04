import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSidebarState } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';
import { Home, FileText, Shield, BarChart, ListChecks, UserCircle, HelpCircle, ShieldCheck, Users, ClipboardList, ChevronRight, BellRing, X } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { isMobile, isDesktopExpanded, isMobileOpen, closeMobileSidebar } = useSidebarState();

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

  const sidebarInner = (
    <>
      <div className="flex-1 space-y-8 px-4 py-6">
        <div>
          <div className="mb-4 flex items-center justify-between px-2">
            <h2 className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-opacity duration-200",
              !isMobile && !isDesktopExpanded && "opacity-0"
            )}>
            {user?.role === 'guard' ? 'Warder' : user?.role} Workspace
            </h2>
            {isMobile ? (
              <button
                type="button"
                onClick={closeMobileSidebar}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(72,83,154,0.14)] text-slate-500 hover:bg-[#f5f7ff] hover:text-[#2f3c97]"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={isMobile ? closeMobileSidebar : undefined}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                    isActive 
                      ? "bg-[#eef1ff] text-[#2f3c97] shadow-[0_10px_24px_-18px_rgba(47,60,151,0.35)]" 
                      : "text-slate-600 hover:bg-[#f8f9ff] hover:text-[#2f3c97]",
                    !isMobile && !isDesktopExpanded && "justify-center px-3"
                  )}
                  title={!isMobile && !isDesktopExpanded ? link.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300",
                      isActive
                        ? "border-[#cfd6ff] bg-white text-[#2f3c97]"
                        : "border-transparent bg-[#f4f6fd] text-slate-400 group-hover:border-[#d7ddff] group-hover:bg-white group-hover:text-[#2f3c97]"
                    )}>
                      <link.icon className="h-4 w-4" />
                    </span>
                    <span className={cn("transition-all duration-200", !isMobile && !isDesktopExpanded && "hidden")}>{link.label}</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-all duration-300",
                    !isMobile && !isDesktopExpanded && "hidden",
                    isActive ? "translate-x-0 text-[#2f3c97]" : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-400"
                  )} />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      <div className={cn("border-t border-[rgba(72,83,154,0.12)] p-4", !isMobile && !isDesktopExpanded && "p-3")}>
        <div className="campus-panel-soft p-4">
          <div className="mb-3 flex items-center gap-2 text-[#252b63]">
            <BellRing className="h-4 w-4" />
            <p className={cn("text-xs font-extrabold uppercase tracking-[0.16em]", !isMobile && !isDesktopExpanded && "hidden")}>Campus Status</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className={cn("text-xs font-semibold text-slate-600", !isMobile && !isDesktopExpanded && "hidden")}>
              Notifications and workflow engine are active
            </span>
          </div>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <div
          className={cn(
            "fixed inset-0 z-40 bg-[#1f2559]/30 backdrop-blur-[2px] transition-opacity duration-300 md:hidden",
            isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
          onClick={closeMobileSidebar}
        />
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[rgba(72,83,154,0.14)] bg-white shadow-[0_24px_50px_-20px_rgba(42,51,107,0.35)] transition-transform duration-300 md:hidden",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarInner}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "hidden flex-col border-r border-[rgba(72,83,154,0.14)] bg-[rgba(255,255,255,0.88)] backdrop-blur-sm transition-[width] duration-300 lg:flex",
        isDesktopExpanded ? "w-72" : "w-24"
      )}
    >
      {sidebarInner}
    </aside>
  );
};

export default Sidebar;
