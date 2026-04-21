import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, Send, Trash2 } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const AdminBulletinForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'info' | 'success' | 'warning' | 'alert'>('info');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      type,
      date: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('bulletin_messages') || '[]');
    localStorage.setItem('bulletin_messages', JSON.stringify([newMessage, ...existing]));
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
    
    showSuccess('Announcement pinned to bulletin board!');
    setTitle('');
    setContent('');
    setType('info');
  };

  const clearBoard = () => {
    localStorage.setItem('bulletin_messages', '[]');
    window.dispatchEvent(new Event('storage'));
    showSuccess('Bulletin board cleared.');
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          Post Announcement
        </CardTitle>
        <CardDescription>Pin a message to the student bulletin board.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePost} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
              <Input 
                placeholder="e.g., Maintenance Completed" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Type</label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="success">Work Completed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="alert">Urgent Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Message Content</label>
            <Textarea 
              placeholder="Provide details for the students..." 
              className="min-h-[100px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 gap-2">
              <Send className="h-4 w-4" /> Pin Announcement
            </Button>
            <Button type="button" variant="outline" onClick={clearBoard} className="text-red-500 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminBulletinForm;