import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, UserCog, ShieldAlert, UserMinus, UserCheck, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/utils/toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'guard' | 'admin' | 'disabled';
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    setUsers(allUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    const allUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const updatedUsers = allUsers.map((user: User) => {
      if (user._id === userId) return { ...user, role: newRole };
      return user;
    });
    localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
    showSuccess(`User role updated to ${newRole}`);
    loadUsers();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || user.role === activeTab;
    return matchesSearch && matchesTab;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">Worker</Badge>;
      case 'guard': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Warden</Badge>;
      case 'student': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Student</Badge>;
      case 'disabled': return <Badge variant="destructive">Disabled</Badge>;
      default: return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <UserCog className="h-8 w-8 text-primary" />
              User Management System
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Centralized control for all system users, roles, and access permissions.
            </p>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white dark:bg-gray-800 border-b pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                  <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="student">Students</TabsTrigger>
                    <TabsTrigger value="guard">Wardens</TabsTrigger>
                    <TabsTrigger value="admin">Workers</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or email..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                  <TableRow>
                    <TableHead className="w-[250px]">User Details</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        No users found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Manage Access</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'student')}>
                                <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                                Set as Student
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'guard')}>
                                <ShieldAlert className="mr-2 h-4 w-4 text-blue-600" />
                                Set as Warden
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'admin')}>
                                <UserCog className="mr-2 h-4 w-4 text-purple-600" />
                                Set as Worker
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleRoleChange(user._id, 'disabled')}
                                className="text-red-600 focus:text-red-600"
                              >
                                <UserMinus className="mr-2 h-4 w-4" />
                                Disable Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminUserManagement;