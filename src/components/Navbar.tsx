import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSidebarState } from '@/context/SidebarContext';
import { Button } from '@/components/ui/button';
import { Home, LogOut, User as UserIcon, Building2, ClipboardList, Moon, PanelLeft, ShieldCheck, UserCircle } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleSidebar, isDesktopExpanded, isMobile } = useSidebarState();

  const quickLinks =
    user?.role === 'student'
      ? [
          { to: '/student/dashboard', label: 'Home', icon: Home },
          { to: '/profile', label: 'Profile', icon: UserCircle },
          { to: '/student/my-complaints', label: 'Complaints', icon: ClipboardList },
        ]
      : user?.role === 'guard'
        ? [
            { to: '/guard/dashboard', label: 'Home', icon: Home },
            { to: '/profile', label: 'Profile', icon: UserCircle },
            { to: '/guard/complaints', label: 'Tasks', icon: ShieldCheck },
          ]
        : user?.role === 'admin'
          ? [
              { to: '/admin/dashboard', label: 'Home', icon: Home },
              { to: '/profile', label: 'Profile', icon: UserCircle },
              { to: '/admin/all-complaints', label: 'Complaints', icon: ClipboardList },
            ]
          : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(72,83,154,0.14)] bg-[rgba(255,255,255,0.92)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="rounded-full border border-[rgba(72,83,154,0.12)] bg-white text-slate-500 hover:bg-[#f5f7ff] hover:text-[#2f3c97]"
              title={isMobile ? 'Open sidebar' : isDesktopExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <PanelLeft className="h-4.5 w-4.5" />
            </Button>
          ) : null}
          <Link to="/" className="group flex items-center gap-3 animate-fade-in-soft">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(72,83,154,0.16)] bg-[#eef1ff] text-[#2f3c97] transition-transform duration-300 group-hover:scale-105">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight text-[#252b63]">Hostel Management System</div>
              <div className="text-[11px] font-medium text-slate-500">NIT Delhi Complaint Portal</div>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-[rgba(72,83,154,0.12)] bg-[#f8f9ff] px-2 py-1 md:flex">
                {quickLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-white hover:text-[#2f3c97]"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                ))}
              </div>
              <NotificationBell />
              <Button variant="ghost" size="icon" className="hidden rounded-full border border-[rgba(72,83,154,0.12)] text-slate-500 hover:bg-[#f5f7ff] hover:text-[#2f3c97] md:inline-flex">
                <Moon className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-11 w-11 rounded-full border border-[rgba(72,83,154,0.14)] bg-white hover:bg-[#f5f7ff]">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user?.name} />
                      <AvatarFallback className="bg-[#2f3c97] text-white font-bold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-2 w-64 border-[rgba(72,83,154,0.14)] bg-white text-slate-700 shadow-[0_18px_36px_-24px_rgba(42,51,107,0.35)]" align="end">
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none text-[#252b63]">{user?.name}</p>
                      <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                      <div className="pt-2">
                        <span className="rounded-full bg-[#eef1ff] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2f3c97]">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer p-3 focus:bg-red-50 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button className="rounded-full bg-[#2f3c97] px-6 font-bold text-white hover:bg-[#252b63]">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
