'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
  timestamp: number; // For sorting
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'time'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Paracetamol 500mg is below reorder level.',
    time: '2 mins ago',
    read: false,
    timestamp: Date.now() - 120000,
  },
  {
    id: '2',
    type: 'info',
    title: 'System Update',
    message: 'Dashboard maintenance scheduled for tonight.',
    time: '1 hour ago',
    read: false,
    timestamp: Date.now() - 3600000,
  },
  {
    id: '3',
    type: 'success',
    title: 'Order Delivered',
    message: 'Order #12345 has been delivered successfully.',
    time: '2 hours ago',
    read: true,
    timestamp: Date.now() - 7200000,
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  // Helper to format "time ago"
  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `Just now`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `1 day ago`; 
  };

  // Update times every minute
  useEffect(() => {
    const interval = setInterval(() => {
        setNotifications(prev => prev.map(n => ({ ...n, time: getTimeAgo(n.timestamp) })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Simulate Live Updates
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance to add a notification every 20 seconds
      if (Math.random() > 0.7) {
        const types: ('alert' | 'info' | 'success')[] = ['alert', 'success', 'info'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let title = '';
        let message = '';

        if (type === 'alert') {
            title = 'Critical Stock Alert';
            message = `Stock for Item #${Math.floor(Math.random() * 1000)} is critically low.`;
        } else if (type === 'success') {
            title = 'New Order Received';
            message = `Order #${Math.floor(Math.random() * 10000)} has been placed by a retailer.`;
        } else {
            title = 'System Info';
            message = 'Data synchronization completed successfully.';
        }

        const newNotification: Notification = {
            id: Date.now().toString(),
            type,
            title,
            message,
            read: false,
            timestamp: Date.now(),
            time: 'Just now'
        };

        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 20000); // Check every 20 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const clearAll = () => {
    setNotifications([]);
  }

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read' | 'time'>) => {
      const newNotif: Notification = {
          ...notif,
          id: Date.now().toString(),
          timestamp: Date.now(),
          read: false,
          time: 'Just now'
      };
      setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
