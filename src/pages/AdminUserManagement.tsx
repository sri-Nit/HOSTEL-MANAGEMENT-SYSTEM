import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, UserCog, ShieldAlert, UserMinus, UserCheck, MoreHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  id: string;
  name: string;
  role: string;
  email?: string;
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Note: We can't easily get emails from auth.users via client SDK for security
      // In a real app, you'd store email in the profiles table too.
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      showError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      showSuccess(`User role updated to ${newRole}`);
      loadUsers();
    } catch (error: any) {
      showError("Failed to update role.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || user.role === activeTab;
    return matchesSearch && matchesTab;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">Admin</Badge>;
      case 'guard': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Warder</Badge>;
      case 'student': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Student</Badge>;
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
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage roles and permissions for all registered users.
            </p>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white dark:bg-gray-800 border-b pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                  <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="student">Students</TabsTrigger>
                    <TabsTrigger value="guard">Warders</TabsTrigger>
                    <TabsTrigger value="admin">Admins</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
              ) : (
                <Table>
                  <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Current Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {user.name?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <span className="font-semibold">{user.name || 'Unnamed User'}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'student')}>
                                  <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                                  Set as Student
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'guard')}>
                                  <ShieldAlert className="mr-2 h-4 w-4 text-blue-600" />
                                  Set as Warder
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                                  <UserCog className="mr-2 h-4 w-4 text-purple-600" />
                                  Set as Admin
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminUserManagement;