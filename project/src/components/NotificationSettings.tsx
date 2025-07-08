import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Coffee, Sparkles, X, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationSettingsProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationSettings({ visible, onClose }: NotificationSettingsProps) {
  const { theme } = useTheme();
  const {
    isEnabled,
    pendingNotifications,
    scheduleTaskReminder,
    scheduleBreakReminder,
    scheduleMotivationalNotification,
    cancelNotification,
    refreshPendingNotifications
  } = useNotifications();

  const [breakInterval, setBreakInterval] = useState(30);
  const [dailyMotivation, setDailyMotivation] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);

  useEffect(() => {
    if (visible) {
      refreshPendingNotifications();
    }
  }, [visible]);

  const handleBreakReminderToggle = async (enabled: boolean) => {
    if (enabled) {
      await scheduleBreakReminder(breakInterval);
    } else {
      // Cancel break reminders
      const breakNotifications = pendingNotifications.filter(n => 
        n.extra?.type === 'break_reminder'
      );
      for (const notification of breakNotifications) {
        await cancelNotification(parseInt(notification.id));
      }
    }
  };

  const handleMotivationToggle = async (enabled: boolean) => {
    setDailyMotivation(enabled);
    if (enabled) {
      await scheduleMotivationalNotification();
    } else {
      // Cancel motivation notifications
      const motivationNotifications = pendingNotifications.filter(n => 
        n.extra?.type === 'motivation'
      );
      for (const notification of motivationNotifications) {
        await cancelNotification(parseInt(notification.id));
      }
    }
  };

  const handleBreakIntervalChange = async (minutes: number) => {
    setBreakInterval(minutes);
    // Reschedule break reminders with new interval
    await handleBreakReminderToggle(false); // Cancel existing
    await scheduleBreakReminder(minutes); // Schedule new
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
          maxWidth: '400px',
          maxHeight: '90vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
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
            🔔 Notification Settings
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Customize your ADHD-friendly reminders
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* Status */}
          <div style={{
            backgroundColor: isEnabled 
              ? (theme.isDark ? 'rgba(76, 175, 80, 0.1)' : '#f8fff8')
              : (theme.isDark ? 'rgba(255, 107, 107, 0.1)' : '#fff0f0'),
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: `2px solid ${isEnabled ? '#4caf50' : '#ff6b6b'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Bell size={20} color={isEnabled ? '#4caf50' : '#ff6b6b'} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.text }}>
                Notification Status
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
              {isEnabled 
                ? '✅ Notifications are enabled and ready!'
                : '❌ Notifications are disabled. Enable them in your device settings.'
              }
            </p>
          </div>

          {/* Task Reminders */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, marginBottom: '16px' }}>
              Task Reminders
            </h3>
            
            <div style={{
              backgroundColor: theme.colors.border,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={20} color={theme.colors.primary} />
                  <span style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.text }}>
                    Task Reminders
                  </span>
                </div>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '50px',
                  height: '24px',
                }}>
                  <input
                    type="checkbox"
                    checked={taskReminders}
                    onChange={(e) => setTaskReminders(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: taskReminders ? theme.colors.primary : theme.colors.border,
                    borderRadius: '24px',
                    transition: '0.2s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '18px',
                      width: '18px',
                      left: taskReminders ? '29px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.2s',
                    }} />
                  </span>
                </label>
              </div>
              <p style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                Get notified 15 minutes before scheduled tasks
              </p>
            </div>
          </div>

          {/* Break Reminders */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, marginBottom: '16px' }}>
              Break Reminders
            </h3>
            
            <div style={{
              backgroundColor: theme.colors.border,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Coffee size={20} color={theme.colors.success} />
                  <span style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.text }}>
                    Break Reminders
                  </span>
                </div>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '50px',
                  height: '24px',
                }}>
                  <input
                    type="checkbox"
                    checked={breakInterval > 0}
                    onChange={(e) => handleBreakReminderToggle(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: breakInterval > 0 ? theme.colors.success : theme.colors.border,
                    borderRadius: '24px',
                    transition: '0.2s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '18px',
                      width: '18px',
                      left: breakInterval > 0 ? '29px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.2s',
                    }} />
                  </span>
                </label>
              </div>
              
              <p style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '12px' }}>
                Regular breaks help ADHD brains stay focused
              </p>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: theme.colors.text, marginBottom: '8px', display: 'block' }}>
                  Break interval (minutes)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[15, 30, 45, 60].map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => handleBreakIntervalChange(minutes)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: breakInterval === minutes ? theme.colors.success : theme.colors.surface,
                        color: breakInterval === minutes ? 'white' : theme.colors.text,
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {minutes}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Motivation */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, marginBottom: '16px' }}>
              Daily Motivation
            </h3>
            
            <div style={{
              backgroundColor: theme.colors.border,
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color={theme.colors.warning} />
                  <span style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.text }}>
                    Daily Motivation
                  </span>
                </div>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '50px',
                  height: '24px',
                }}>
                  <input
                    type="checkbox"
                    checked={dailyMotivation}
                    onChange={(e) => handleMotivationToggle(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: dailyMotivation ? theme.colors.warning : theme.colors.border,
                    borderRadius: '24px',
                    transition: '0.2s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '18px',
                      width: '18px',
                      left: dailyMotivation ? '29px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.2s',
                    }} />
                  </span>
                </label>
              </div>
              <p style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                Start each day with ADHD-positive affirmations at 9 AM
              </p>
            </div>
          </div>

          {/* Pending Notifications */}
          {pendingNotifications.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, marginBottom: '16px' }}>
                Scheduled Notifications ({pendingNotifications.length})
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                {pendingNotifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      backgroundColor: theme.colors.surface,
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                        {notification.title}
                      </p>
                      <p style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                        {notification.body}
                      </p>
                    </div>
                    <button
                      onClick={() => cancelNotification(parseInt(notification.id))}
                      style={{
                        padding: '4px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={16} color={theme.colors.error} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, marginBottom: '16px' }}>
              Quick Actions
            </h3>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => scheduleMotivationalNotification()}
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.warning,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Plus size={16} />
                Add Motivation
              </button>
              <button
                onClick={() => scheduleBreakReminder(30)}
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.success,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Plus size={16} />
                Add Break
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}