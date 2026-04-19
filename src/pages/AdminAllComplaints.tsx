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

interface Complaint {
  _id: string;
  studentName: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  rejectionReason?: string;
  location: {
    block: string;
    floor: string;
    room: string;
  };
}

const statusColors: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-200 text-green-900',
  rejected: 'bg-red-100 text-red-800',
  escalated: 'bg-orange-100 text-orange-800',
};

const AdminAllComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const loadComplaints = () => {
    const allComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    setComplaints(allComplaints);
    setFilteredComplaints(allComplaints);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    let result = [...complaints];

    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter(c => c.category === categoryFilter);
    }

    if (searchTerm) {
      result = result.filter(c => 
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredComplaints(result);
  }, [statusFilter, categoryFilter, searchTerm, sortOrder, complaints]);

  const handleUpdateStatus = (id: string, newStatus: string, reason?: string) => {
    const allComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    const updatedComplaints = allComplaints.map((c: Complaint) => {
      if (c._id === id) {
        return { ...c, status: newStatus, rejectionReason: reason || c.rejectionReason };
      }
      return c;
    });
    localStorage.setItem('user_complaints', JSON.stringify(updatedComplaints));
    showSuccess(`Complaint ${newStatus} successfully!`);
    loadComplaints();
    setRejectionReason('');
    setSelectedComplaintId(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">All Complaints</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and monitor every complaint submitted in the system.</p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search student or description..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Carpentry">Carpentry</SelectItem>
                    <SelectItem value="Internet">Internet/WiFi</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Sort: {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="max-w-[250px]">Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No complaints found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <TableRow key={complaint._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {complaint.studentName || 'Anonymous'}
                          </div>
                        </TableCell>
                        <TableCell>{complaint.category}</TableCell>
                        <TableCell>
                          {complaint.location ? (
                            <span className="text-xs">
                              Block {complaint.location.block}, Room {complaint.location.room}
                            </span>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate text-sm">
                          {complaint.description}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[complaint.status]}>
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {complaint.status === 'pending' ? (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => handleUpdateStatus(complaint._id, 'approved')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => setSelectedComplaintId(complaint._id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject Complaint</DialogTitle>
                                    <DialogDescription>
                                      Please provide a reason for rejecting this complaint. This will be visible to the student.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Textarea 
                                    placeholder="Enter rejection reason..." 
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                  />
                                  <DialogFooter>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => handleUpdateStatus(complaint._id, 'rejected', rejectionReason)}
                                      disabled={!rejectionReason}
                                    >
                                      Confirm Rejection
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default AdminAllComplaints;