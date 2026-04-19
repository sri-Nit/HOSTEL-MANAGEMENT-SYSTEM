import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComplaintTimeline from './ComplaintTimeline';

// Mock data for demonstration
const mockComplaints = [
  {
    _id: '1',
    category: 'Plumbing',
    description: 'Leaking tap in the bathroom.',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    category: 'Electrical',
    description: 'Fan not working in room 101.',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

const statusColors: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-200 text-green-900',
  rejected: 'bg-red-100 text-red-800',
  escalated: 'bg-orange-100 text-orange-800',
};

const ComplaintList = () => {
  return (
    <div className="space-y-4">
      {mockComplaints.map((complaint) => (
        <Card key={complaint._id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{complaint.category}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge className={statusColors[complaint.status]}>
                {complaint.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{complaint.description}</p>
            <div className="border-t pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Status Tracking</h4>
              <ComplaintTimeline currentStatus={complaint.status as any} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ComplaintList;