import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export interface NotificationData {
  id: number;
  title: string;
  body: string;
  schedule?: {
    at: Date;
    repeats?: boolean;
    every?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  };
  extra?: any;
}

class NotificationService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permissions
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display === 'granted') {
        console.log('Local notification permissions granted');
      }

      // Initialize push notifications if on native platform
      if (Capacitor.isNativePlatform()) {
        await this.initializePushNotifications();
      }

      // Listen for notification actions
      await LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        console.log('Notification action performed:', notification);
        this.handleNotificationAction(notification);
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private async initializePushNotifications() {
    try {
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        await PushNotifications.register();
      }

      // Listen for registration
      await PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        // Store token for server-side notifications
        localStorage.setItem('push_token', token.value);
      });

      // Listen for push notifications
      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed: ', notification);
      });

    } catch (error) {
      console.error('Push notification setup failed:', error);
    }
  }

  async scheduleNotification(data: NotificationData) {
    try {
      await this.initialize();

      const options: ScheduleOptions = {
        notifications: [{
          id: data.id,
          title: data.title,
          body: data.body,
          schedule: data.schedule,
          extra: data.extra,
          sound: 'default',
          attachments: [],
          actionTypeId: '',
          group: 'taskflow'
        }]
      };

      await LocalNotifications.schedule(options);
      console.log('Notification scheduled:', data);
      return true;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return false;
    }
  }

  async cancelNotification(id: number) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: id.toString() }] });
      console.log('Notification cancelled:', id);
      return true;
    } catch (error) {
      console.error('Failed to cancel notification:', error);
      return false;
    }
  }

  async cancelAllNotifications() {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ 
          notifications: pending.notifications.map(n => ({ id: n.id }))
        });
      }
      console.log('All notifications cancelled');
      return true;
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
      return false;
    }
  }

  async getPendingNotifications() {
    try {
      const result = await LocalNotifications.getPending();
      return result.notifications;
    } catch (error) {
      console.error('Failed to get pending notifications:', error);
      return [];
    }
  }

  private handleNotificationAction(notification: any) {
    // Handle notification tap/action
    const { actionId, notification: notificationData } = notification;
    
    if (actionId === 'tap') {
      // User tapped the notification
      if (notificationData.extra?.taskId) {
        // Navigate to specific task
        window.location.href = `/tasks?highlight=${notificationData.extra.taskId}`;
      } else {
        // Navigate to home
        window.location.href = '/';
      }
    }
  }

  // ADHD-friendly notification helpers
  async scheduleTaskReminder(taskId: string, title: string, reminderTime: Date) {
    const id = parseInt(taskId) || Date.now();
    
    return await this.scheduleNotification({
      id,
      title: '🎯 Gentle Reminder',
      body: `Time to work on: ${title}`,
      schedule: {
        at: reminderTime
      },
      extra: { taskId, type: 'task_reminder' }
    });
  }

  async scheduleBreakReminder(intervalMinutes: number = 30) {
    const now = new Date();
    const breakTime = new Date(now.getTime() + intervalMinutes * 60000);
    
    return await this.scheduleNotification({
      id: Date.now(),
      title: '☕ Break Time!',
      body: 'Your ADHD brain needs a rest. Take a 5-10 minute break!',
      schedule: {
        at: breakTime,
        repeats: true,
        every: 'hour'
      },
      extra: { type: 'break_reminder' }
    });
  }

  async scheduleMotivationalNotification() {
    const motivationalMessages = [
      'You\'re doing amazing! Every small step counts 🌟',
      'Your ADHD brain is unique and powerful 💪',
      'Progress, not perfection. You\'ve got this! ✨',
      'Take a moment to celebrate what you\'ve accomplished today 🎉',
      'Remember: different brains, amazing results! 🧠'
    ];

    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM tomorrow

    return await this.scheduleNotification({
      id: Date.now(),
      title: '💫 Daily Motivation',
      body: randomMessage,
      schedule: {
        at: tomorrow,
        repeats: true,
        every: 'day'
      },
      extra: { type: 'motivation' }
    });
  }
}

export const notificationService = new NotificationService();