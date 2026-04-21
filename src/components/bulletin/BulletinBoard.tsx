import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Clock, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface BulletinMessage {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

const typeIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  alert: Megaphone,
};

const typeColors = {
  info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  alert: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const BulletinBoard: React.FC = () => {
  const [messages, setMessages] = useState<BulletinMessage[]>([]);

  useEffect(() => {
    const loadMessages = () => {
      const saved = JSON.parse(localStorage.getItem('bulletin_messages') || '[]');
      setMessages(saved);
    };

    loadMessages();
    // Listen for storage changes to update in real-time if multiple tabs are open
    window.addEventListener('storage', loadMessages);
    return () => window.removeEventListener('storage', loadMessages);
  }, []);

  if (messages.length === 0) {
    return (
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 p-6">
          <CardTitle className="text-xl font-black text-[#0f172a] flex items-center gap-2">
            <Megaphone className="text-[#d9531e]" />
            Bulletin Board
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 text-center">
          <p className="text-slate-400 font-bold">No active announcements at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
      <CardHeader className="bg-white border-b border-slate-100 p-6">
        <CardTitle className="text-xl font-black text-[#0f172a] flex items-center gap-2">
          <Megaphone className="text-[#d9531e]" />
          Bulletin Board
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-50">
          {messages.map((msg) => {
            const Icon = typeIcons[msg.type];
            return (
              <div key={msg.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${typeColors[msg.type]}`}>
                      <Icon size={18} />
                    </div>
                    <h3 className="font-black text-[#0f172a]">{msg.title}</h3>
                  </div>
                  <Badge className={`${typeColors[msg.type]} border font-black text-[10px] uppercase tracking-wider`}>
                    {msg.type}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">{msg.content}</p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={12} />
                  {new Date(msg.date).toLocaleDateString()} at {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BulletinBoard;