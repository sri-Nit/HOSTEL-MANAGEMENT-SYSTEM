import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { MadeWithDyad } from '@/components/made-with-dyad';
import MessageInterface from '@/components/messaging/MessageInterface';
import MessageList from '@/components/messaging/MessageList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Clock, ShieldAlert } from 'lucide-react';

const NeedHelp: React.FC = () => {
  const [selectedRecipient, setSelectedRecipient] = useState('warden');

  const contacts = [
    { role: 'Warden', name: 'Mr. Rajesh Kumar', phone: '+91 98765 43210', email: 'warden.blocka@hcms.edu' },
    { role: 'Security Desk', name: 'Main Gate', phone: '+91 98765 43211', email: 'security@hcms.edu' },
    { role: 'Medical Room', name: 'Emergency', phone: '+91 98765 43212', email: 'medical@hcms.edu' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Need Help?</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Get in touch with the hostel staff for any queries or emergencies.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Messaging */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MessageInterface recipient={selectedRecipient} setRecipient={setSelectedRecipient} />
                <MessageList recipient={selectedRecipient} />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between text-red-600 font-medium">
                      <span>Sunday</span>
                      <span>Closed (Emergency Only)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Contacts */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700 dark:text-red-400 flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.role} className="space-y-1">
                      <p className="text-xs font-bold uppercase text-red-600/70 dark:text-red-400/70">{contact.role}</p>
                      <p className="font-semibold text-sm">{contact.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default NeedHelp;