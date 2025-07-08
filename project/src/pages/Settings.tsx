import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Moon, Sun, Volume2, Vibrate, Heart, HelpCircle, ChevronRight, Palette, Calendar, Zap, Coffee, Sparkles, Settings as SettingsIcon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useNotifications } from '@/hooks/useNotifications'
import { useCalendar } from '@/hooks/useCalendar'
import NotificationSettings from '@/components/NotificationSettings'
import CalendarSync from '@/components/CalendarSync'

export default function Settings() {
  const { theme, isDark, toggleTheme } = useTheme()
  const { isEnabled: notificationsEnabled } = useNotifications()
  const { isConnected: calendarConnected } = useCalendar()
  const [notifications, setNotifications] = useState(true)
  const [sounds, setSounds] = useState(true)
  const [vibration, setVibration] = useState(true)
  const [gentleReminders, setGentleReminders] = useState(true)
  const [celebrationAnimations, setCelebrationAnimations] = useState(true)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [showCalendarSync, setShowCalendarSync] = useState(false)

  const handleSoundToggle = (enabled: boolean) => {
    setSounds(enabled)
    if (enabled) {
      // Play a test sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
      audio.volume = 0.1
      audio.play().catch(() => {})
    }
  }

  const handleVibrationToggle = (enabled: boolean) => {
    setVibration(enabled)
    if (enabled && 'vibrate' in navigator) {
      navigator.vibrate(100)
    }
  }

  const settingsData = [
    {
      title: 'Appearance',
      items: [
        {
          icon: isDark ? Moon : Sun,
          label: 'Dark Mode',
          subtitle: 'Easy on the eyes',
          value: isDark,
          onToggle: toggleTheme,
          type: 'switch'
        },
        {
          icon: Palette,
          label: 'Theme Color',
          subtitle: 'Purple Gradient',
          type: 'navigation',
          onPress: () => {}
        },
        {
          icon: Sparkles,
          label: 'Celebration Animations',
          subtitle: 'Fun completion effects',
          value: celebrationAnimations,
          onToggle: setCelebrationAnimations,
          type: 'switch'
        }
      ]
    },
    {
      title: 'ADHD-Friendly Features',
      items: [
        {
          icon: Bell,
          label: 'Gentle Reminders',
          subtitle: 'Motivating, not nagging',
          value: gentleReminders,
          onToggle: setGentleReminders,
          type: 'switch'
        },
        {
          icon: Zap,
          label: 'Focus Mode',
          subtitle: 'Minimal Mode',
          type: 'navigation',
          onPress: () => {}
        },
        {
          icon: Coffee,
          label: 'Break Reminders',
          subtitle: 'Every 30 minutes',
          type: 'navigation',
          onPress: () => {}
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          subtitle: notificationsEnabled ? 'Enabled' : 'Disabled',
          type: 'navigation',
          onPress: () => setShowNotificationSettings(true)
        },
        {
          icon: Volume2,
          label: 'Sounds',
          subtitle: 'Gentle audio cues',
          value: sounds,
          onToggle: handleSoundToggle,
          type: 'switch'
        },
        {
          icon: Vibrate,
          label: 'Haptic Feedback',
          subtitle: 'Touch responses',
          value: vibration,
          onToggle: handleVibrationToggle,
          type: 'switch'
        }
      ]
    },
    {
      title: 'Account & Data',
      items: [
        {
          icon: Calendar,
          label: 'Calendar Sync',
          subtitle: calendarConnected ? 'Connected to Google Calendar' : 'Connect to Google Calendar',
          type: 'navigation',
          onPress: () => setShowCalendarSync(true)
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & FAQ',
          subtitle: 'Tips for ADHD success',
          type: 'navigation',
          onPress: () => {}
        },
        {
          icon: Heart,
          label: 'Rate TaskFlow',
          subtitle: 'Love the app? Share it!',
          type: 'navigation',
          onPress: () => alert('Thank you for your support! You\'ll be redirected to the app store.')
        }
      ]
    }
  ]

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.colors.gradient.primary[0]}, ${theme.colors.gradient.primary[1]})`,
        padding: '40px 20px 30px',
        color: 'white',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>
            Settings
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            Customize your experience ⚙️
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px' }}>
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '16px',
            padding: '20px',
            marginTop: '-15px',
            marginBottom: '30px',
            boxShadow: theme.isDark ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '30px',
            backgroundColor: theme.isDark ? 'rgba(139, 154, 255, 0.2)' : '#f0f0ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            fontSize: '24px',
          }}>
            🌟
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '2px' }}>
              TaskFlow Champion
            </h2>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
              Ready to conquer today!
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: theme.colors.primary }}>
                12
              </div>
              <div style={{ fontSize: '10px', fontWeight: '500', color: theme.colors.textSecondary }}>
                Day Streak
              </div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: theme.colors.primary }}>
                156
              </div>
              <div style={{ fontSize: '10px', fontWeight: '500', color: theme.colors.textSecondary }}>
                Tasks Done
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        {settingsData.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + sectionIndex * 0.1 }}
            style={{ marginBottom: '30px' }}
          >
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              fontFamily: 'Poppins, sans-serif',
              color: theme.colors.text,
              marginBottom: '12px',
              marginLeft: '4px',
            }}>
              {section.title}
            </h3>
            <div style={{
              backgroundColor: theme.colors.surface,
              borderRadius: '16px',
              boxShadow: theme.isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}>
              {section.items.map((item, itemIndex) => (
                <button
                  key={`${section.title}-${itemIndex}`}
                  onClick={() => {
                    if ('onPress' in item && item.onPress) {
                      item.onPress()
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    borderBottom: itemIndex < section.items.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px',
                      backgroundColor: section.title === 'ADHD-Friendly Features' 
                        ? (theme.isDark ? 'rgba(255, 107, 107, 0.2)' : '#fff0f0')
                        : (theme.isDark ? 'rgba(139, 154, 255, 0.2)' : '#f0f0ff'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                    }}>
                      <item.icon size={20} color={
                        section.title === 'ADHD-Friendly Features' ? theme.colors.error : theme.colors.primary
                      } />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.text, marginBottom: '2px' }}>
                        {item.label}
                      </h4>
                      {item.subtitle && (
                        <p style={{ fontSize: '13px', color: theme.colors.textSecondary }}>
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ marginLeft: '16px' }}>
                    {item.type === 'switch' && item.onToggle ? (
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '50px',
                        height: '24px',
                      }}>
                        <input
                          type="checkbox"
                          checked={item.value}
                          onChange={(e) => {
                            if ('onToggle' in item && typeof item.onToggle === 'function') {
                              item.onToggle(e.target.checked)
                            }
                          }}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: item.value ? theme.colors.primary : theme.colors.border,
                          borderRadius: '24px',
                          transition: '0.2s',
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '""',
                            height: '18px',
                            width: '18px',
                            left: item.value ? '29px' : '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            transition: '0.2s',
                          }} />
                        </span>
                      </label>
                    ) : (
                      <ChevronRight size={20} color={theme.colors.textSecondary} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Motivational Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          style={{
            background: `linear-gradient(135deg, ${theme.colors.gradient.accent[0]}, ${theme.colors.gradient.accent[1]})`,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: theme.isDark ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
            color: 'white',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginBottom: '8px' }}>
            🎯 You're Crushing It!
          </h3>
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '16px', lineHeight: '1.5' }}>
            Your brain works differently, and that's your superpower! Keep building those habits one task at a time.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔥</div>
              <div style={{ fontSize: '12px', fontWeight: '500', opacity: 0.9 }}>12 day streak</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎯</div>
              <div style={{ fontSize: '12px', fontWeight: '500', opacity: 0.9 }}>87% completion</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚡</div>
              <div style={{ fontSize: '12px', fontWeight: '500', opacity: 0.9 }}>Focus master</div>
            </div>
          </div>
        </motion.div>

        {/* ADHD Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: theme.isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '16px' }}>
            💡 ADHD Success Tips
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary, lineHeight: '1.5' }}>
              🌟 Start with the smallest task to build momentum
            </p>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary, lineHeight: '1.5' }}>
              🎯 Use the spin wheel when feeling overwhelmed
            </p>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary, lineHeight: '1.5' }}>
              ⏰ Set gentle reminders, not strict deadlines
            </p>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary, lineHeight: '1.5' }}>
              🎉 Celebrate every completed task, no matter how small
            </p>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          style={{ textAlign: 'center', padding: '20px 0', marginBottom: '20px' }}
        >
          <p style={{ fontSize: '14px', fontWeight: '500', color: theme.colors.textSecondary, marginBottom: '4px' }}>
            TaskFlow v1.0.0
          </p>
          <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
            Built with ❤️ for neurodivergent minds
          </p>
          <p style={{ fontSize: '12px', color: theme.colors.primary, fontStyle: 'italic' }}>
            "Different brains, amazing results" ✨
          </p>
        </motion.div>
      </div>

      {/* Modals */}
      <NotificationSettings
        visible={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />

      <CalendarSync
        visible={showCalendarSync}
        onClose={() => setShowCalendarSync(false)}
        tasks={[]} // You can pass current tasks here if needed
      />
    </div>
  )
}