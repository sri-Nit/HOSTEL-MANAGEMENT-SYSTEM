import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, ShieldAlert, ArrowRightCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showError, showSuccess } from '@/utils/toast';
import { formatDistanceToNow } from 'date-fns';

interface ComplaintRef {
  _id: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  location: {
    block: string;
    floor: string;
    room: string;
  };
  userId?: {
    name: string;
    email: string;
    hostelBlock?: string;
    roomNumber?: string;
  };
  assignedTo?: {
    name: string;
    email: string;
  };
}

interface EscalationItem {
  _id: string;
  escalatedAt: string;
  status: string;
  complaintId: ComplaintRef;
}

const AdminEscalations: React.FC = () => {
  const [escalatedComplaints, setEscalatedComplaints] = useState<EscalationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningCheck, setRunningCheck] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const loadEscalations = async () => {
    try {
      const response = await api.get<EscalationItem[]>('/admin/escalations');
      setEscalatedComplaints(response.data);
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to load escalations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEscalations();
  }, []);

  const handleRunCheck = async () => {
    setRunningCheck(true);
    try {
      const response = await api.post<{ escalatedCount: number }>('/admin/escalations/run-check');
      showSuccess(
        response.data.escalatedCount > 0
          ? `${response.data.escalatedCount} complaint(s) escalated.`
          : 'Escalation check completed. No complaints qualified yet.'
      );
      await loadEscalations();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to run escalation check.');
    } finally {
      setRunningCheck(false);
    }
  };

  const handleResolveEscalation = async (id: string) => {
    setResolvingId(id);
    try {
      await api.post(`/admin/escalations/${id}/resolve`);
      showSuccess('Escalated issue marked as resolved.');
      await loadEscalations();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to resolve escalation.');
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
                <ShieldAlert className="h-8 w-8" />
                Critical Escalations
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Issues that have exceeded the escalation threshold and need admin attention.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="destructive" className="text-lg px-4 py-1">
                {escalatedComplaints.length} Active
              </Badge>
              <Button onClick={handleRunCheck} disabled={runningCheck}>
                <RefreshCw className={`mr-2 h-4 w-4 ${runningCheck ? 'animate-spin' : ''}`} />
                Run Check
              </Button>
            </div>
          </div>

          {loading ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center text-muted-foreground">
                Loading escalations...
              </CardContent>
            </Card>
          ) : escalatedComplaints.length === 0 ? (
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
              {escalatedComplaints.map((escalation) => {
                const complaint = escalation.complaintId;

                return (
                  <Card key={escalation._id} className="border-l-4 border-l-red-600 shadow-md overflow-hidden">
                    <CardHeader className="bg-red-50 dark:bg-red-950/20 pb-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="border-red-600 text-red-600 bg-white">
                              {complaint.category}
                            </Badge>
                            <span className="text-xs font-mono text-gray-500">#{complaint._id.slice(-6)}</span>
                          </div>
                          <CardTitle className="text-xl">{complaint.userId?.name || 'Unknown student'}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            Escalated {formatDistanceToNow(new Date(escalation.escalatedAt))} ago
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold uppercase text-gray-500">Location</p>
                          <p className="text-sm font-medium">
                            Block {complaint.location?.block}, Room {complaint.location?.room}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid md:grid-cols-4 gap-6 items-center">
                        <div className="md:col-span-3 space-y-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {complaint.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Submitted {formatDistanceToNow(new Date(complaint.createdAt))} ago
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleResolveEscalation(escalation._id)}
                            disabled={resolvingId === escalation._id}
                          >
                            <ArrowRightCircle className="mr-2 h-4 w-4" />
                            {resolvingId === escalation._id ? 'Resolving...' : 'Resolve Now'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminEscalations;
