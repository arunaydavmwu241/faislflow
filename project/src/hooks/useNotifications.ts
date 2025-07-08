import { useState, useEffect } from 'react';
import { notificationService, NotificationData } from '../services/notificationService';

export const useNotifications = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [pendingNotifications, setPendingNotifications] = useState<any[]>([]);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      await notificationService.initialize();
      setIsEnabled(true);
      await refreshPendingNotifications();
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      setIsEnabled(false);
    }
  };

  const refreshPendingNotifications = async () => {
    const pending = await notificationService.getPendingNotifications();
    setPendingNotifications(pending);
  };

  const scheduleNotification = async (data: NotificationData) => {
    const success = await notificationService.scheduleNotification(data);
    if (success) {
      await refreshPendingNotifications();
    }
    return success;
  };

  const cancelNotification = async (id: number) => {
    const success = await notificationService.cancelNotification(id);
    if (success) {
      await refreshPendingNotifications();
    }
    return success;
  };

  const cancelAllNotifications = async () => {
    const success = await notificationService.cancelAllNotifications();
    if (success) {
      await refreshPendingNotifications();
    }
    return success;
  };

  const scheduleTaskReminder = async (taskId: string, title: string, reminderTime: Date) => {
    return await notificationService.scheduleTaskReminder(taskId, title, reminderTime);
  };

  const scheduleBreakReminder = async (intervalMinutes: number = 30) => {
    return await notificationService.scheduleBreakReminder(intervalMinutes);
  };

  const scheduleMotivationalNotification = async () => {
    return await notificationService.scheduleMotivationalNotification();
  };

  return {
    isEnabled,
    pendingNotifications,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    scheduleTaskReminder,
    scheduleBreakReminder,
    scheduleMotivationalNotification,
    refreshPendingNotifications
  };
};