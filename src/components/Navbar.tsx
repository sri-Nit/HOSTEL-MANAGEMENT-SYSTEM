"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
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

  return (
    <nav className="bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 h-16 flex items-center">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 bg-white rounded-lg p-1 transition-all group-hover:scale-105 shadow-lg shadow-white/5">
            <img 
              src="https://pasted-image-2026-04-21T19-18-37-057Z.png" 
              alt="HCMS Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-white leading-none">HCMS</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hostel Management</span>
          </div>
        </Link>
        
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <div className="h-6 w-[1px] bg-white/10 mx-2" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-white/5 rounded-full transition-all">
                    <Avatar className="h-8 w-8 border-2 border-[#d9531e]/20 shadow-sm">
                      <AvatarImage src="" alt={user?.name} />
                      <AvatarFallback className="bg-[#d9531e] text-white text-xs font-bold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-3 w-3" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start text-left">
                      <span className="text-xs font-bold text-white leading-none">{user?.name}</span>
                      <span className="text-[10px] font-medium text-slate-500 capitalize">{user?.role}</span>
                    </div>
                    <ChevronDown className="h-3 w-3 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 rounded-2xl shadow-2xl bg-[#0f172a] border-white/10 text-white" align="end">
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-white">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer p-3 text-red-400 focus:text-red-400 focus:bg-red-500/10 rounded-xl m-1">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-bold">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button className="bg-[#d9531e] hover:bg-[#bf4618] text-white font-bold px-6 rounded-full shadow-lg shadow-[#d9531e]/20 transition-all hover:-translate-y-0.5">
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