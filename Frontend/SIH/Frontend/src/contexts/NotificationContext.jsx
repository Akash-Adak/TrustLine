// src/contexts/NotificationContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

// Mock data to simulate fetching from an API
const initialNotifications = [
  { id: 1, message: 'Welcome to CitizenConnect!', read: true, date: '2025-09-17T14:30:00Z' },
  { id: 2, message: 'Your report #123 (Pothole on Main St) has been FILED.', read: true, date: '2025-09-17T14:35:00Z' },
];

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  // Simulate fetching new notifications from a backend
  useEffect(() => {
    const interval = setInterval(() => {
      const isUpdate = Math.random() > 0.7; // 30% chance of a new notification every 15 seconds
      if (isUpdate) {
        const newNotification = {
          id: Date.now(),
          message: 'Status of report #123 updated to IN_PROGRESS.',
          read: false,
          date: new Date().toISOString(),
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}