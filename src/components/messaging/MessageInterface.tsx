import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface MessageInterfaceProps {
  recipient: string;
  setRecipient: (value: string) => void;
}

const MessageInterface: React.FC<MessageInterfaceProps> = ({ recipient, setRecipient }) => {
  const [message, setMessage] = React.useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !message) return;
    
    console.log(`Message to ${recipient}: ${message}`);
    showSuccess(`Message sent to ${recipient.replace('_', ' ')}!`);
    setMessage('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send a Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient</label>
            <Select onValueChange={setRecipient} value={recipient}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warden">Hostel Warden</SelectItem>
                <SelectItem value="security_guard">Security Guard</SelectItem>
                <SelectItem value="maintenance_head">Maintenance Head</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea 
              placeholder="Type your message here..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <Button type="submit" className="w-full" disabled={!recipient || !message}>
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MessageInterface;