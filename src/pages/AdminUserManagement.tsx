import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowUpDown, CheckCircle, XCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'guard' | 'admin' | 'disabled';
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<'student' | 'guard' | 'admin' | 'disabled'>('student');

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let result = [...filteredUsers];

    if (searchTerm) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(result);
  }, [searchTerm, filteredUsers]);

  const handleRoleChange = (userId: string) => {
    const allUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const updatedUsers = allUsers.map((user) => {
      if (user._id === userId) {
        return { ...user, role: newRole };
      }
      return user;
    });
    localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
    showSuccess(`User role updated to ${newRole}`);
    setNewRole('student');
    setSelectedUserId(null);
    loadUsers();
  };

  const handleDisableUser = (userId: string) => {
    const allUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const updatedUsers = allUsers.map((user) => {
      if (user._id === userId) {
        return { ...user, role: 'disabled' };
      }
      return user;
    });
    localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
    showSuccess("User disabled successfully!");
    loadUsers();
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              <User className="h-6 w-6 text-primary" />
              Admin User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all users in the system: view, assign roles, and disable accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold">Students</h2>
              <table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers
                    .filter((user) => user.role === 'student')
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'disabled' ? 'destructive' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role !== 'disabled' ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => {
                                  setNewRole('student');
                                  setSelectedUserId(user._id);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Assign Role
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => setSelectedUserId(user._id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Disable
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Disable User</DialogTitle>
                                    <DialogDescription>
                                      This will deactivate the user's account.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Textarea
                                    placeholder="Enter reason (optional)..."
                                    value={''}
                                    onChange={(e) => setNewRole('disabled')}
                                  />
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDisableUser(user._id)}
                                      disabled={newRole === 'disabled'}
                                    >
                                      Confirm Disable
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No actions available</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </table>
            </div>

            <div>
              <h2 className="text-xl font-bold">Wardens</h2>
              <table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers
                    .filter((user) => user.role === 'guard')
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'disabled' ? 'destructive' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role !== 'disabled' ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => {
                                  setNewRole('guard');
                                  setSelectedUserId(user._id);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Assign Role
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => setSelectedUserId(user._id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Disable
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Disable User</DialogTitle>
                                    <DialogDescription>
                                      This will deactivate the user's account.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Textarea
                                    placeholder="Enter reason (optional)..."
                                    value={''}
                                    onChange={(e) => setNewRole('disabled')}
                                  />
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDisableUser(user._id)}
                                      disabled={newRole === 'disabled'}
                                    >
                                      Confirm Disable
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No actions available</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </table>
            </div>

            <div>
              <h2 className="text-xl font-bold">Workers</h2>
              <table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers
                    .filter((user) => user.role === 'admin')
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'disabled' ? 'destructive' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role !== 'disabled' ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => {
                                  setNewRole('admin');
                                  setSelectedUserId(user._id);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Assign Role
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => setSelectedUserId(user._id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Disable
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Disable User</DialogTitle>
                                    <DialogDescription>
                                      This will deactivate the user's account.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Textarea
                                    placeholder="Enter reason (optional)..."
                                    value={''}
                                    onChange={(e) => setNewRole('disabled')}
                                  />
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDisableUser(user._id)}
                                      disabled={newRole === 'disabled'}
                                    >
                                      Confirm Disable
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No actions available</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </table>
            </div>

            <div>
              <h2 className="text-xl font-bold">Disabled Users</h2>
              <table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers
                    .filter((user) => user.role === 'disabled')
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{user.role}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </table>
            </div>
          </div>
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default AdminUserManagement;