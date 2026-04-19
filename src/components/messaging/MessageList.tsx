import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, User } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isIncoming: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Warden',
    content: 'Hello! I have received your complaint regarding the plumbing. A plumber will be assigned shortly.',
    timestamp: '2 hours ago',
    isIncoming: true,
  },
  {
    id: '2',
    sender: 'You',
    content: 'Thank you, sir. Please ensure it is fixed by evening.',
    timestamp: '1 hour ago',
    isIncoming: false,
  },
];

const MessageList = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Message History
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {mockMessages.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">No messages yet.</p>
        ) : (
          mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.isIncoming ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className={msg.isIncoming ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}>
                  {msg.isIncoming ? 'W' : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col max-w-[80%] ${msg.isIncoming ? 'items-start' : 'items-end'}`}>
                <div className={`rounded-lg p-3 text-sm ${
                  msg.isIncoming 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">{msg.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MessageList;