import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Complaint {
  _id: string;
  studentName: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  location: {
    block: string;
    room: string;
  };
}

const ManageComplaintsWarden: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const allComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    setComplaints(allComplaints);
  }, []);

  const filteredComplaints = complaints.filter(c => 
    c.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    pending: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-200 text-green-900',
    rejected: 'bg-red-100 text-red-800',
    escalated: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Verify & Approve Complaints</h1>
            <p className="text-gray-600 dark:text-gray-400">Review student submissions and assign them for resolution.</p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by student or category..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No complaints found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <TableRow key={complaint._id}>
                        <TableCell className="font-medium">{complaint.studentName}</TableCell>
                        <TableCell>{complaint.category}</TableCell>
                        <TableCell>Block {complaint.location?.block}, Room {complaint.location?.room}</TableCell>
                        <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[complaint.status]}>
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/guard/complaint/${complaint._id}`}>
                            <Button size="sm" variant="ghost" className="gap-2">
                              <Eye className="h-4 w-4" /> View
                            </Button>
                          </Link>
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

export default ManageComplaintsWarden;