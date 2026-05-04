import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserCog, UserCheck, Clock3, RefreshCw, ShieldAlert } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'guard' | 'admin' | 'service_personnel';
  isApproved: boolean;
  createdAt?: string;
}

type RoleOption = User['role'];

const roleLabels: Record<RoleOption, string> = {
  student: 'Student',
  guard: 'Warder',
  admin: 'Admin',
  service_personnel: 'Service Personnel',
};

const userFilters = [
  { value: 'all', label: 'All' },
  { value: 'student', label: 'Students' },
  { value: 'guard', label: 'Warders' },
  { value: 'service_personnel', label: 'Service' },
  { value: 'admin', label: 'Admins' },
] as const;

const AdminUserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [savingRoleId, setSavingRoleId] = useState<string | null>(null);
  const [draftRoles, setDraftRoles] = useState<Record<string, RoleOption>>({});
  const [loadingUsers, setLoadingUsers] = useState(true);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get<User[]>('/admin/users');
      setUsers(response.data);
      setDraftRoles(
        response.data.reduce<Record<string, RoleOption>>((acc, entry) => {
          acc[entry._id] = entry.role;
          return acc;
        }, {})
      );
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApproveUser = async (userId: string) => {
    setApprovingId(userId);
    try {
      await api.post(`/admin/users/${userId}/approve`);
      showSuccess('Warder account approved.');
      await loadUsers();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to approve user.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleRoleSave = async (targetUser: User) => {
    const nextRole = draftRoles[targetUser._id];
    if (!nextRole || nextRole === targetUser.role) {
      return;
    }

    setSavingRoleId(targetUser._id);
    try {
      await api.patch(`/admin/users/${targetUser._id}/role`, { role: nextRole });
      showSuccess(`${targetUser.name} is now ${roleLabels[nextRole]}.`);
      await loadUsers();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to update user role.');
    } finally {
      setSavingRoleId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((entry) => {
      const matchesSearch =
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'all' || entry.role === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [users, searchTerm, activeTab]);

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Badge className="border-[#d6ccff] bg-[#f2edff] text-[#6548b1] hover:bg-[#f2edff]">Admin</Badge>;
      case 'guard':
        return <Badge className="border-[#cad4ff] bg-[#eef1ff] text-[#2f3c97] hover:bg-[#eef1ff]">Warder</Badge>;
      case 'student':
        return <Badge className="border-[#bfe7ce] bg-[#e8f8ee] text-[#2f8b52] hover:bg-[#e8f8ee]">Student</Badge>;
      case 'service_personnel':
        return <Badge className="border-[#ffd7ad] bg-[#fff1e1] text-[#b6671a] hover:bg-[#fff1e1]">Service Personnel</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getApprovalBadge = (entry: User) => {
    if (entry.role !== 'guard') {
      return <Badge className="border-[#bfe7ce] bg-[#e8f8ee] text-[#2f8b52] hover:bg-[#e8f8ee]">Active</Badge>;
    }

    return entry.isApproved ? (
      <Badge className="border-[#bfe7ce] bg-[#e8f8ee] text-[#2f8b52] hover:bg-[#e8f8ee]">Approved</Badge>
    ) : (
      <Badge className="border-[#ffd7ad] bg-[#fff1e1] text-[#b6671a] hover:bg-[#fff1e1]">Pending Approval</Badge>
    );
  };

  return (
    <div className="campus-page flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6 animate-fade-up">
          <section className="campus-panel p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#2f3c97]">
                  <UserCog className="h-3.5 w-3.5" />
                  Access Control
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#252b63]">User Management</h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  This is where you can promote users to admin or warder, approve warder accounts, and keep the hostel workflow access tidy.
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-full border-[#dbe1ff] bg-white text-[#2f3c97] hover:bg-[#f8f9ff]"
                onClick={loadUsers}
                disabled={loadingUsers}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                Refresh Users
              </Button>
            </div>
          </section>

          <Card className="campus-table-shell overflow-hidden">
            <CardHeader className="border-b border-slate-100 px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-xl font-extrabold text-[#252b63]">Manage Roles and Approvals</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">
                    Promote users, convert them to warders, or approve pending warder accounts.
                  </p>
                </div>
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-end">
                  <div className="flex flex-wrap gap-2 xl:max-w-[560px] xl:justify-end">
                    {userFilters.map((filter) => (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => setActiveTab(filter.value)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                          activeTab === filter.value
                            ? 'bg-[#2f3c97] text-white shadow-[0_10px_20px_-14px_rgba(47,60,151,0.55)]'
                            : 'bg-[#f4f6fd] text-slate-600 hover:bg-[#e9edff] hover:text-[#2f3c97]'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <div className="w-full xl:w-80 xl:flex-none">
  <div className="flex items-center h-11 rounded-full border border-slate-200 bg-white px-3 focus-within:ring-2 focus-within:ring-[#2f3c97]/20">
    <Search className="h-4 w-4 text-slate-400 mr-2" />
    <Input
      placeholder="Search by name or email..."
      className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table className="min-w-[1100px]">
                <TableHeader className="bg-[#f8f9ff]">
                  <TableRow>
                    <TableHead className="w-[240px]">User Details</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Account Status</TableHead>
                    <TableHead>Promote / Change Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingUsers ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                        No users found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((entry) => {
                      const isCurrentUser = currentUser?._id === entry._id;
                      const hasRoleChanged = draftRoles[entry._id] && draftRoles[entry._id] !== entry.role;

                      return (
                        <TableRow key={entry._id} className="transition-colors hover:bg-[#fafbff]">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef1ff] font-bold text-[#2f3c97]">
                                {entry.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-[#252b63]">{entry.name}</div>
                                {entry.createdAt ? (
                                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                    <Clock3 className="h-3 w-3" />
                                    Joined {new Date(entry.createdAt).toLocaleDateString()}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500">{entry.email}</TableCell>
                          <TableCell>{getRoleBadge(entry.role)}</TableCell>
                          <TableCell>{getApprovalBadge(entry)}</TableCell>
                          <TableCell>
                            <div className="flex min-w-[240px] items-center gap-2">
                              <Select
                                value={draftRoles[entry._id] || entry.role}
                                onValueChange={(value: RoleOption) =>
                                  setDraftRoles((prev) => ({ ...prev, [entry._id]: value }))
                                }
                                disabled={isCurrentUser || savingRoleId === entry._id}
                              >
                                <SelectTrigger className="h-10 min-w-[160px] bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="student">Student</SelectItem>
                                  <SelectItem value="guard">Warder</SelectItem>
                                  <SelectItem value="service_personnel">Service Personnel</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                className="rounded-lg bg-[#2f3c97] whitespace-nowrap hover:bg-[#252b63]"
                                disabled={!hasRoleChanged || isCurrentUser || savingRoleId === entry._id}
                                onClick={() => handleRoleSave(entry)}
                              >
                                {savingRoleId === entry._id ? 'Saving...' : 'Save'}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {entry.role === 'guard' && !entry.isApproved ? (
                              <Button
                                size="sm"
                                className="whitespace-nowrap"
                                onClick={() => handleApproveUser(entry._id)}
                                disabled={approvingId === entry._id}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                {approvingId === entry._id ? 'Approving...' : 'Approve'}
                              </Button>
                            ) : isCurrentUser ? (
                              <Button variant="ghost" size="sm" disabled className="whitespace-nowrap">
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Current Admin
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" disabled className="whitespace-nowrap">
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                No Action
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
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
