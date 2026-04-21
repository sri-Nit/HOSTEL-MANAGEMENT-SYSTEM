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
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 h-16 flex items-center">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 bg-slate-900 rounded-lg p-1.5 transition-all group-hover:scale-105 shadow-lg shadow-slate-200">
            <img 
              src="https://pasted-image-2026-04-21T19-18-37-057Z.png" 
              alt="HCMS Logo" 
              className="h-full w-full object-contain brightness-0 invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-slate-900 leading-none">HCMS</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hostel Management</span>
          </div>
        </Link>
        
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <div className="h-6 w-[1px] bg-slate-200 mx-2" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-slate-50 rounded-full transition-all">
                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                      <AvatarImage src="" alt={user?.name} />
                      <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-3 w-3" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start text-left">
                      <span className="text-xs font-bold text-slate-900 leading-none">{user?.name}</span>
                      <span className="text-[10px] font-medium text-slate-500 capitalize">{user?.role}</span>
                    </div>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 rounded-2xl shadow-2xl border-slate-100" align="end">
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer p-3 text-red-600 focus:text-red-600 focus:bg-red-50 rounded-xl m-1">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-bold">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 rounded-full shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5">
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