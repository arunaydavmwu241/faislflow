import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, X, Plus, Trash2, Clock, AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarEvent } from '@/services/calendarService';

interface CalendarSyncProps {
  visible: boolean;
  onClose: () => void;
  tasks?: any[];
}

export default function CalendarSync({ visible, onClose, tasks = [] }: CalendarSyncProps) {
  const { theme } = useTheme();
  const {
    isConnected,
    isLoading,
    events,
    connect,
    disconnect,
    loadEvents,
    createEvent,
    deleteEvent,
    createTaskEvent
  } = useCalendar();

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    if (visible && isConnected) {
      loadEvents();
    }
  }, [visible, isConnected]);

  const handleConnect = async () => {
    const success = await connect();
    if (success) {
      alert('Successfully connected to Google Calendar!');
    } else {
      alert('Failed to connect to Google Calendar. Please try again.');
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect from Google Calendar?')) {
      await disconnect();
    }
  };

  const handleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSyncSelectedTasks = async () => {
    if (selectedTasks.length === 0) return;

    setSyncInProgress(true);
    try {
      const tasksToSync = tasks.filter(task => selectedTasks.includes(task.id));
      let successCount = 0;

      for (const task of tasksToSync) {
        const eventId = await createTaskEvent(task);
        if (eventId) {
          successCount++;
        }
      }

      alert(`Successfully synced ${successCount} out of ${tasksToSync.length} tasks to your calendar!`);
      setSelectedTasks([]);
      await loadEvents(); // Refresh events
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Failed to sync some tasks. Please try again.');
    } finally {
      setSyncInProgress(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}" from your calendar?`)) {
      const success = await deleteEvent(eventId);
      if (success) {
        alert('Event deleted successfully!');
      } else {
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: '24px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4285f4, #34a853)',
          padding: '24px',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <X size={24} />
          </button>
          
          <h2 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginBottom: '8px' }}>
            📅 Google Calendar Sync
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Sync your tasks with Google Calendar
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Connection Status */}
          <div style={{
            backgroundColor: isConnected 
              ? (theme.isDark ? 'rgba(76, 175, 80, 0.1)' : '#f8fff8')
              : (theme.isDark ? 'rgba(255, 107, 107, 0.1)' : '#fff0f0'),
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: `2px solid ${isConnected ? '#4caf50' : '#ff6b6b'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Calendar size={20} color={isConnected ? '#4caf50' : '#ff6b6b'} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.text }}>
                Connection Status
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '12px' }}>
              {isConnected 
                ? '✅ Connected to Google Calendar'
                : '❌ Not connected to Google Calendar'
              }
            </p>
            
            {!isConnected ? (
              <button
                onClick={handleConnect}
                disabled={isLoading}
                style={{
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? 'Connecting...' : 'Connect to Google Calendar'}
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                style={{
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                Disconnect
              </button>
            )}
          </div>

          {isConnected && (
            <>
              {/* Sync Tasks Section */}
              {tasks.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, marginBottom: '16px' }}>
                    Sync Tasks to Calendar
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '12px' }}>
                      Select tasks to add to your Google Calendar:
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                      {tasks.filter(task => !task.completed).map((task) => (
                        <div
                          key={task.id}
                          style={{
                            backgroundColor: theme.colors.border,
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(task.id)}
                            onChange={() => handleTaskSelection(task.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '20px' }}>{task.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                              {task.title}
                            </p>
                            <p style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                              {task.category} • {task.priority} priority
                              {task.time && ` • ${task.time}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {selectedTasks.length > 0 && (
                    <button
                      onClick={handleSyncSelectedTasks}
                      disabled={syncInProgress}
                      style={{
                        backgroundColor: '#34a853',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: syncInProgress ? 'not-allowed' : 'pointer',
                        opacity: syncInProgress ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        justifyContent: 'center',
                      }}
                    >
                      <Plus size={16} />
                      {syncInProgress ? 'Syncing...' : `Sync ${selectedTasks.length} Task${selectedTasks.length > 1 ? 's' : ''}`}
                    </button>
                  )}
                </div>
              )}

              {/* Calendar Events */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, marginBottom: '16px' }}>
                  Upcoming Calendar Events
                </h3>
                
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
                      Loading events...
                    </p>
                  </div>
                ) : events.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Calendar size={48} color={theme.colors.textSecondary} style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
                      No upcoming events found
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                    {events.slice(0, 10).map((event) => (
                      <div
                        key={event.id}
                        style={{
                          backgroundColor: theme.colors.border,
                          borderRadius: '8px',
                          padding: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                            {event.title}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                            <Clock size={12} color={theme.colors.textSecondary} />
                            <p style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                              {formatEventTime(event.startTime)}
                            </p>
                          </div>
                          {event.taskId && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                              <span style={{ fontSize: '10px', backgroundColor: theme.colors.primary, color: 'white', padding: '2px 6px', borderRadius: '4px' }}>
                                TaskFlow
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {event.taskId && (
                          <button
                            onClick={() => handleDeleteEvent(event.id!, event.title)}
                            style={{
                              padding: '4px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={16} color={theme.colors.error} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Card */}
              <div style={{
                backgroundColor: theme.isDark ? 'rgba(66, 133, 244, 0.1)' : '#f0f4ff',
                borderRadius: '12px',
                padding: '16px',
                border: `2px solid #4285f4`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertCircle size={16} color="#4285f4" />
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                    How Calendar Sync Works
                  </h4>
                </div>
                <div style={{ fontSize: '12px', color: theme.colors.textSecondary, lineHeight: '1.4' }}>
                  • Tasks are created as 1-hour calendar events<br/>
                  • Reminders are set 15 minutes before each task<br/>
                  • Only incomplete tasks can be synced<br/>
                  • Events marked with "TaskFlow" can be deleted here
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}