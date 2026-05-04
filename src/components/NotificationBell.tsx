import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { socket } from '@/services/socket';
import { showSuccess, showError } from '@/utils/toast';

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: string;
  complaintId?: string;
}

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/notifications/user/${user._id}`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      showError('Failed to load notifications.');
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    socket.connect();
    socket.emit('joinRoom', user._id);

    socket.on('newNotification', (newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showSuccess(`New Notification: ${newNotification.message}`);
    });

    return () => {
      socket.off('newNotification');
      socket.disconnect();
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      showError('Failed to mark notification as read.');
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      await api.put(`/notifications/mark-all-read/${user?._id}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      showSuccess('All notifications marked as read.');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      showError('Failed to mark all notifications as read.');
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full border border-[rgba(72,83,154,0.12)] bg-white text-slate-500 hover:bg-[#f5f7ff] hover:text-[#2f3c97]">
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#b94a48] px-1.5 text-[10px] font-bold leading-none text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 overflow-hidden rounded-2xl border-[rgba(72,83,154,0.14)] p-0 shadow-[0_18px_40px_-24px_rgba(42,51,107,0.35)]">
        <div className="flex items-center justify-between bg-[#f8f9ff] p-4">
          <h4 className="font-bold text-[#252b63]">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" className="text-[#2f3c97]" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-72">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`flex cursor-pointer items-start gap-2 p-4 text-sm transition-colors duration-200 ${
                    !notification.read ? 'bg-[#f7f8ff]' : ''
                  } hover:bg-[#eef1ff]`}
                  onClick={() => !notification.read && markAsRead(notification._id)}
                >
                  <div className="flex-1">
                    <p className="font-medium text-[#252b63]">{notification.message}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification._id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
