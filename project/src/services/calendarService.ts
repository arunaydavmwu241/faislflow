import { google } from 'googleapis';

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  reminder?: {
    minutes: number;
  };
  taskId?: string;
}

class CalendarService {
  private auth: any = null;
  private calendar: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize Google Auth
      this.auth = new google.auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events'
        ],
        credentials: {
          // These would normally come from environment variables
          // For demo purposes, we'll use a client-side flow
          client_id: process.env.VITE_GOOGLE_CLIENT_ID,
          client_secret: process.env.VITE_GOOGLE_CLIENT_SECRET,
        }
      });

      this.calendar = google.calendar({ version: 'v3', auth: this.auth });
      this.isInitialized = true;
      
      console.log('Calendar service initialized');
    } catch (error) {
      console.error('Failed to initialize calendar service:', error);
      // Fallback to browser-based auth
      await this.initializeBrowserAuth();
    }
  }

  private async initializeBrowserAuth() {
    try {
      // Load Google API
      await this.loadGoogleAPI();
      
      await window.gapi.load('auth2', async () => {
        const authInstance = await window.gapi.auth2.init({
          client_id: process.env.VITE_GOOGLE_CLIENT_ID || 'your-client-id'
        });

        // Check if user is already signed in
        if (authInstance.isSignedIn.get()) {
          await this.setupCalendarAPI();
        }
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Browser auth initialization failed:', error);
    }
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  private async setupCalendarAPI() {
    await window.gapi.load('client', async () => {
      await window.gapi.client.init({
        apiKey: process.env.VITE_GOOGLE_API_KEY,
        clientId: process.env.VITE_GOOGLE_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
      });
    });
  }

  async signIn(): Promise<boolean> {
    try {
      await this.initialize();

      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        const user = await authInstance.signIn();
        
        if (user.isSignedIn()) {
          await this.setupCalendarAPI();
          localStorage.setItem('calendar_connected', 'true');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Calendar sign in failed:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    try {
      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        await authInstance.signOut();
        localStorage.removeItem('calendar_connected');
      }
    } catch (error) {
      console.error('Calendar sign out failed:', error);
    }
  }

  isConnected(): boolean {
    return localStorage.getItem('calendar_connected') === 'true';
  }

  async createEvent(event: CalendarEvent): Promise<string | null> {
    try {
      await this.initialize();

      if (!this.isConnected()) {
        throw new Error('Calendar not connected');
      }

      const calendarEvent = {
        summary: event.title,
        description: event.description || '',
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: event.reminder ? [
            { method: 'popup', minutes: event.reminder.minutes },
            { method: 'email', minutes: event.reminder.minutes }
          ] : []
        },
        extendedProperties: {
          private: {
            taskflowTaskId: event.taskId || '',
            source: 'taskflow'
          }
        }
      };

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: calendarEvent
      });

      console.log('Calendar event created:', response.result.id);
      return response.result.id;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      return null;
    }
  }

  async updateEvent(eventId: string, event: CalendarEvent): Promise<boolean> {
    try {
      await this.initialize();

      if (!this.isConnected()) {
        throw new Error('Calendar not connected');
      }

      const calendarEvent = {
        summary: event.title,
        description: event.description || '',
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: event.reminder ? [
            { method: 'popup', minutes: event.reminder.minutes },
            { method: 'email', minutes: event.reminder.minutes }
          ] : []
        }
      };

      await window.gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: calendarEvent
      });

      console.log('Calendar event updated:', eventId);
      return true;
    } catch (error) {
      console.error('Failed to update calendar event:', error);
      return false;
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await this.initialize();

      if (!this.isConnected()) {
        throw new Error('Calendar not connected');
      }

      await window.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });

      console.log('Calendar event deleted:', eventId);
      return true;
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
      return false;
    }
  }

  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      await this.initialize();

      if (!this.isConnected()) {
        return [];
      }

      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      const events = response.result.items || [];
      
      return events.map((event: any) => ({
        id: event.id,
        title: event.summary || 'Untitled',
        description: event.description || '',
        startTime: new Date(event.start.dateTime || event.start.date),
        endTime: new Date(event.end.dateTime || event.end.date),
        taskId: event.extendedProperties?.private?.taskflowTaskId
      }));
    } catch (error) {
      console.error('Failed to get calendar events:', error);
      return [];
    }
  }

  // Helper method to create calendar event from task
  async createTaskEvent(task: any): Promise<string | null> {
    const startTime = task.time ? this.parseTimeToDate(task.time) : new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    return await this.createEvent({
      title: `${task.emoji} ${task.title}`,
      description: `TaskFlow Task - Category: ${task.category}\nPriority: ${task.priority}`,
      startTime,
      endTime,
      reminder: { minutes: 15 },
      taskId: task.id
    });
  }

  private parseTimeToDate(timeString: string): Date {
    const today = new Date();
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }

    today.setHours(hour24, minutes, 0, 0);
    return today;
  }
}

// Global type declarations for Google API
declare global {
  interface Window {
    gapi: any;
  }
}

export const calendarService = new CalendarService();