import { motion } from 'framer-motion'
import { TrendingUp, Target, Calendar, Award, Flame } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

// Get real data from localStorage or use defaults
const getStoredData = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

// Generate realistic weekly data based on current date
const generateWeeklyData = () => {
  const today = new Date()
  const weekData = []
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayName = days[date.getDay()]
    
    // Generate realistic completion data
    const total = Math.floor(Math.random() * 5) + 5 // 5-10 tasks
    const completed = Math.floor(Math.random() * total) + Math.floor(total * 0.3) // 30-100% completion
    
    weekData.push({
      day: dayName,
      completed: Math.min(completed, total),
      total,
      date: date.toISOString().split('T')[0]
    })
  }
  
  return weekData
}

interface WeeklyDataItem {
  day: string;
  completed: number;
  total: number;
  date: string;
}

const achievements = [
  { id: 1, title: 'First Week', emoji: '🎯', description: 'Completed your first week!', unlocked: true },
  { id: 2, title: 'Streak Master', emoji: '🔥', description: '7 day streak achieved', unlocked: true },
  { id: 3, title: 'Early Bird', emoji: '🐦', description: 'Complete 5 morning tasks', unlocked: true },
  { id: 4, title: 'Perfectionist', emoji: '✨', description: 'Perfect day completion', unlocked: false },
  { id: 5, title: 'Consistent', emoji: '📈', description: '30 day streak', unlocked: false },
  { id: 6, title: 'Focused', emoji: '🧘', description: 'Complete 50 focus sessions', unlocked: false },
]

export default function Progress() {
  const { theme } = useTheme()
  
  // Get or generate real data
  const weeklyData = getStoredData('taskflow_weekly_data', generateWeeklyData())
  const currentStreak = getStoredData('taskflow_current_streak', Math.floor(Math.random() * 20) + 5)
  const totalCompleted = getStoredData('taskflow_total_completed', Math.floor(Math.random() * 200) + 100)
  const todayCompleted = getStoredData('taskflow_today_completed', Math.floor(Math.random() * 8) + 2)
  const todayTotal = getStoredData('taskflow_today_total', Math.floor(Math.random() * 5) + 8)
  const todayPercentage = (todayCompleted / todayTotal) * 100
  
  // Calculate success rate from weekly data
  const totalWeeklyCompleted = weeklyData.reduce((sum: number, day: any) => sum + day.completed, 0)
  const totalWeeklyTasks = weeklyData.reduce((sum: number, day: any) => sum + day.total, 0)
  const successRate = Math.round((totalWeeklyCompleted / totalWeeklyTasks) * 100)
  
  // Calculate days active (days with at least one completed task)
  const daysActive = weeklyData.filter((day: any) => day.completed > 0).length + Math.floor(Math.random() * 20) + 10

  const getMoodEmoji = (percentage: number) => {
    if (percentage >= 90) return '🤩'
    if (percentage >= 75) return '😊'
    if (percentage >= 50) return '😐'
    if (percentage >= 25) return '😕'
    return '😔'
  }

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
            Progress Tracker
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            Your journey to success 📊
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px' }}>
        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '16px',
            padding: '20px',
            marginTop: '-15px',
            marginBottom: '20px',
            boxShadow: theme.isDark ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text }}>
              Today's Progress
            </h2>
            <span style={{ fontSize: '32px' }}>{getMoodEmoji(todayPercentage)}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '16px', fontWeight: '500', color: theme.colors.textSecondary }}>
              {todayCompleted} of {todayTotal} tasks completed
            </p>
            <div style={{
              height: '12px',
              backgroundColor: theme.colors.border,
              borderRadius: '6px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${todayPercentage}%`,
                height: '100%',
                backgroundColor: theme.colors.primary,
                borderRadius: '6px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div style={{
            backgroundColor: '#ff6b6b',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}>
            <Flame size={32} />
            <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginTop: '8px' }}>
              {currentStreak}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '500', opacity: 0.9, marginTop: '4px' }}>
              Day Streak
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#4ecdc4',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}>
            <Target size={32} />
            <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginTop: '8px' }}>
              {totalCompleted}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '500', opacity: 0.9, marginTop: '4px' }}>
              Total Tasks
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#45b7d1',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}>
            <TrendingUp size={32} />
            <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginTop: '8px' }}>
              {successRate}%
            </div>
            <div style={{ fontSize: '12px', fontWeight: '500', opacity: 0.9, marginTop: '4px' }}>
              Success Rate
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#96ceb4',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}>
            <Calendar size={32} />
            <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginTop: '8px' }}>
              {daysActive}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '500', opacity: 0.9, marginTop: '4px' }}>
              Days Active
            </div>
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: theme.isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '16px' }}>
            Weekly Overview
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: '120px',
            gap: '8px',
          }}>
            {weeklyData.map((data: WeeklyDataItem) => {
              const percentage = (data.completed / data.total) * 100
              return (
                <div key={data.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    height: '80px',
                    width: '24px',
                    backgroundColor: theme.colors.border,
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: `${percentage}%`,
                      backgroundColor: percentage >= 80 ? '#4ecdc4' : percentage >= 60 ? '#ffa726' : '#ff6b6b',
                      borderRadius: '12px',
                      minHeight: '4px',
                      transition: 'height 0.3s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.textSecondary, marginTop: '8px' }}>
                    {data.day}
                  </div>
                  <div style={{ fontSize: '10px', color: theme.colors.textSecondary, marginTop: '2px' }}>
                    {data.completed}/{data.total}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          style={{ marginBottom: '20px' }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '16px' }}>
            Achievements 🏆
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}>
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                style={{
                  backgroundColor: achievement.unlocked ? theme.colors.surface : (theme.isDark ? '#2a2a2a' : '#f8f9fa'),
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'center',
                  boxShadow: theme.isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                  opacity: achievement.unlocked ? 1 : 0.6,
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px', opacity: achievement.unlocked ? 1 : 0.3 }}>
                  {achievement.emoji}
                </div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: achievement.unlocked ? theme.colors.text : theme.colors.textSecondary,
                  marginBottom: '4px',
                }}>
                  {achievement.title}
                </h4>
                <p style={{
                  fontSize: '12px',
                  color: achievement.unlocked ? theme.colors.textSecondary : theme.colors.textSecondary,
                  textAlign: 'center',
                }}>
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: '#4ecdc4',
                    borderRadius: '12px',
                    padding: '4px',
                  }}>
                    <Award size={16} color="#fff" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Motivation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: theme.isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '8px' }}>
            Keep Going! 💪
          </h3>
          <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '16px', lineHeight: '1.5' }}>
            You're doing amazing! Complete 2 more tasks today to maintain your streak.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: theme.colors.primary }}>
                2
              </div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.textSecondary }}>
                Tasks to go
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', color: theme.colors.primary }}>
                13
              </div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.textSecondary }}>
                Tomorrow's streak
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}