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
  private isInitialized = false;
  private isSignedIn = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load Google API script
      await this.loadGoogleAPI();
      
      // Initialize the API
      await new Promise<void>((resolve, reject) => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
              clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
              scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
            });

            // Check if user is already signed in
            const authInstance = window.gapi.auth2.getAuthInstance();
            this.isSignedIn = authInstance.isSignedIn.get();
            
            this.isInitialized = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });

      console.log('Calendar service initialized');
    } catch (error) {
      console.error('Failed to initialize calendar service:', error);
      // Set as initialized even if it fails to prevent repeated attempts
      this.isInitialized = true;
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

  async signIn(): Promise<boolean> {
    try {
      await this.initialize();

      if (!window.gapi || !window.gapi.auth2) {
        console.error('Google API not loaded');
        return false;
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      
      if (!authInstance.isSignedIn.get()) {
        const user = await authInstance.signIn();
        this.isSignedIn = user.isSignedIn();
      } else {
        this.isSignedIn = true;
      }
      
      if (this.isSignedIn) {
        localStorage.setItem('calendar_connected', 'true');
      }
      
      return this.isSignedIn;
    } catch (error) {
      console.error('Calendar sign in failed:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.initialize();
      
      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
          await authInstance.signOut();
        }
      }
      
      this.isSignedIn = false;
      localStorage.removeItem('calendar_connected');
    } catch (error) {
      console.error('Calendar sign out failed:', error);
    }
  }

  isConnected(): boolean {
    return this.isSignedIn && localStorage.getItem('calendar_connected') === 'true';
  }

  async createEvent(event: CalendarEvent): Promise<string | null> {
    try {
      await this.initialize();

      if (!this.isConnected() || !window.gapi || !window.gapi.client) {
        throw new Error('Calendar not connected or API not loaded');
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

      if (!this.isConnected() || !window.gapi || !window.gapi.client) {
        throw new Error('Calendar not connected or API not loaded');
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

      if (!this.isConnected() || !window.gapi || !window.gapi.client) {
        throw new Error('Calendar not connected or API not loaded');
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

      if (!this.isConnected() || !window.gapi || !window.gapi.client) {
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
    if (!this.isConnected()) {
      return null;
    }

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