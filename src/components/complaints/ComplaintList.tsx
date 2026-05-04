import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComplaintTimeline from './ComplaintTimeline';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface Complaint {
  id: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-200 text-green-900',
  rejected: 'bg-red-100 text-red-800',
  escalated: 'bg-orange-100 text-orange-800',
};

const ComplaintList = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .eq('user_id', user._id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setComplaints(data || []);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No complaints found in the database. Submit one to see it here!
          </CardContent>
        </Card>
      ) : (
        complaints.map((complaint) => (
          <Card key={complaint.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{complaint.category}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Submitted on {new Date(complaint.created_at).toLocaleDateString()}
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
        ))
      )}
    </div>
  );
};

export default ComplaintList;