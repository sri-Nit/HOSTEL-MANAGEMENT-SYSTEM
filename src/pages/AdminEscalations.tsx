import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, ShieldAlert, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/utils/toast';
import { formatDistanceToNow } from 'date-fns';

interface Complaint {
  _id: string;
  studentName: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  location: {
    block: string;
    floor: string;
    room: string;
  };
}

const AdminEscalations: React.FC = () => {
  const [escalatedComplaints, setEscalatedComplaints] = useState<Complaint[]>([]);

  const loadEscalations = () => {
    const allComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    const filtered = allComplaints.filter((c: Complaint) => c.status === 'escalated');
    setEscalatedComplaints(filtered);
  };

  useEffect(() => {
    loadEscalations();
  }, []);

  const handleResolveEscalation = (id: string) => {
    const allComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    const updated = allComplaints.map((c: Complaint) => {
      if (c._id === id) return { ...c, status: 'resolved' };
      return c;
    });
    localStorage.setItem('user_complaints', JSON.stringify(updated));
    showSuccess("Escalated issue marked as resolved.");
    loadEscalations();
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
                <ShieldAlert className="h-8 w-8" />
                Critical Escalations
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Issues that have exceeded the 72-hour resolution threshold.
              </p>
            </div>
            <Badge variant="destructive" className="text-lg px-4 py-1 animate-pulse">
              {escalatedComplaints.length} Active
            </Badge>
          </div>

          {escalatedComplaints.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <Clock className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle>All Clear!</CardTitle>
                <CardDescription>There are currently no escalated complaints requiring immediate attention.</CardDescription>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {escalatedComplaints.map((complaint) => (
                <Card key={complaint._id} className="border-l-4 border-l-red-600 shadow-md overflow-hidden">
                  <CardHeader className="bg-red-50 dark:bg-red-950/20 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="border-red-600 text-red-600 bg-white">
                            {complaint.category}
                          </Badge>
                          <span className="text-xs font-mono text-gray-500">#{complaint._id.slice(-6)}</span>
                        </div>
                        <CardTitle className="text-xl">{complaint.studentName}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                          Delayed by <span className="font-bold text-red-600">{formatDistanceToNow(new Date(complaint.createdAt))}</span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase text-gray-500">Location</p>
                        <p className="text-sm font-medium">Block {complaint.location.block}, Room {complaint.location.room}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid md:grid-cols-4 gap-6 items-center">
                      <div className="md:col-span-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {complaint.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleResolveEscalation(complaint._id)}
                        >
                          <ArrowRightCircle className="mr-2 h-4 w-4" />
                          Resolve Now
                        </Button>
                        <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default AdminEscalations;