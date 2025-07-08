import { useState, useEffect } from 'react';
import { calendarService, CalendarEvent } from '../services/calendarService';

export const useCalendar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = () => {
    setIsConnected(calendarService.isConnected());
  };

  const connect = async () => {
    setIsLoading(true);
    try {
      const success = await calendarService.signIn();
      setIsConnected(success);
      if (success) {
        await loadEvents();
      }
      return success;
    } catch (error) {
      console.error('Calendar connection failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    setIsLoading(true);
    try {
      await calendarService.signOut();
      setIsConnected(false);
      setEvents([]);
    } catch (error) {
      console.error('Calendar disconnection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvents = async (startDate?: Date, endDate?: Date) => {
    if (!isConnected) return;

    setIsLoading(true);
    try {
      const start = startDate || new Date();
      const end = endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      
      const calendarEvents = await calendarService.getEvents(start, end);
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Failed to load calendar events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (event: CalendarEvent) => {
    if (!isConnected) return null;

    setIsLoading(true);
    try {
      const eventId = await calendarService.createEvent(event);
      if (eventId) {
        await loadEvents(); // Refresh events
      }
      return eventId;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (eventId: string, event: CalendarEvent) => {
    if (!isConnected) return false;

    setIsLoading(true);
    try {
      const success = await calendarService.updateEvent(eventId, event);
      if (success) {
        await loadEvents(); // Refresh events
      }
      return success;
    } catch (error) {
      console.error('Failed to update calendar event:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!isConnected) return false;

    setIsLoading(true);
    try {
      const success = await calendarService.deleteEvent(eventId);
      if (success) {
        await loadEvents(); // Refresh events
      }
      return success;
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createTaskEvent = async (task: any) => {
    if (!isConnected) return null;

    return await calendarService.createTaskEvent(task);
  };

  return {
    isConnected,
    isLoading,
    events,
    connect,
    disconnect,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    createTaskEvent,
    checkConnection
  };
};