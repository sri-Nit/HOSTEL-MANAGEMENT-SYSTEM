import React from 'react';
import { CheckCircle2, Clock, PlayCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'pending' | 'approved' | 'in_progress' | 'resolved' | 'rejected' | 'escalated';

interface TimelineStep {
  status: Status;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const steps: TimelineStep[] = [
  { status: 'pending', label: 'Submitted', description: 'Complaint received and awaiting review.', icon: Clock, color: 'text-blue-500' },
  { status: 'approved', label: 'Approved', description: 'Warden has approved and assigned personnel.', icon: CheckCircle2, color: 'text-green-500' },
  { status: 'in_progress', label: 'In Progress', description: 'Service personnel is working on the issue.', icon: PlayCircle, color: 'text-yellow-500' },
  { status: 'resolved', label: 'Resolved', description: 'The issue has been fixed.', icon: CheckCircle2, color: 'text-green-600' },
];

const ComplaintTimeline = ({ currentStatus }: { currentStatus: Status }) => {
  const getStatusIndex = (status: Status) => {
    if (status === 'rejected') return -1;
    if (status === 'escalated') return 2; // Show as after in_progress
    return steps.findIndex(s => s.status === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  if (currentStatus === 'rejected') {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <AlertCircle className="h-5 w-5" />
        <div>
          <p className="font-semibold">Complaint Rejected</p>
          <p className="text-sm">Please check the rejection reason in details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.status} className="relative flex gap-4">
            {index !== steps.length - 1 && (
              <div className={cn(
                "absolute left-[11px] top-6 w-[2px] h-full bg-gray-200",
                index < currentIndex && "bg-green-500"
              )} />
            )}
            <div className={cn(
              "relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2",
              isCompleted ? "border-green-500 bg-green-50" : "border-gray-300"
            )}>
              <Icon className={cn("h-4 w-4", isCompleted ? "text-green-600" : "text-gray-400")} />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-sm font-semibold",
                isCurrent ? "text-primary" : isCompleted ? "text-green-700" : "text-gray-500"
              )}>
                {step.label}
              </span>
              <span className="text-xs text-gray-500">{step.description}</span>
            </div>
          </div>
        );
      })}
      {currentStatus === 'escalated' && (
        <div className="flex items-center gap-2 mt-4 p-2 bg-orange-50 border border-orange-200 rounded text-orange-700 text-xs">
          <ShieldAlert className="h-4 w-4" />
          <span>This complaint has been escalated to Admin.</span>
        </div>
      )}
    </div>
  );
};

export default ComplaintTimeline;