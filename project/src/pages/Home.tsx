import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, CheckCircle, Clock, Target, Sparkles, Zap } from 'lucide-react'
import AddTaskModal from '@/components/AddTaskModal'
import CelebrationModal from '@/components/CelebrationModal'
import SpinWheelModal from '@/components/SpinWheelModal'
import FocusModeModal from '@/components/FocusModeModal'
import { useTheme } from '@/contexts/ThemeContext'
import { useCapacitor } from '@/hooks/useCapacitor'
import { useNotifications } from '@/hooks/useNotifications'

interface Task {
  id: string
  title: string
  emoji: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  time?: string
  category: string
}

const mockTasks: Task[] = [
  { id: '1', title: 'Morning workout', emoji: '🏃‍♂️', completed: true, priority: 'high', time: '7:00 AM', category: 'Health' },
  { id: '2', title: 'Finish project presentation', emoji: '📊', completed: false, priority: 'high', time: '2:00 PM', category: 'Work' },
  { id: '3', title: 'Buy groceries', emoji: '🛒', completed: false, priority: 'medium', time: '5:00 PM', category: 'Personal' },
  { id: '4', title: 'Read for 30 minutes', emoji: '📚', completed: false, priority: 'low', time: '8:00 PM', category: 'Personal' },
]

export default function Home() {
  const { theme } = useTheme()
  const { triggerHaptic } = useCapacitor()
  const { scheduleTaskReminder } = useNotifications()
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebratedTask, setCelebratedTask] = useState<Task | null>(null)
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [showFocusMode, setShowFocusMode] = useState(false)
  
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progressPercentage = (completedTasks / totalTasks) * 100

  const addNewTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      completed: false,
      ...newTaskData,
    }
    setTasks(prevTasks => [...prevTasks, newTask])
    
    // Schedule notification if task has a time
    if (newTask.time) {
      const reminderTime = parseTimeToDate(newTask.time)
      reminderTime.setMinutes(reminderTime.getMinutes() - 15) // 15 minutes before
      scheduleTaskReminder(newTask.id, newTask.title, reminderTime)
    }
  }

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task && !task.completed) {
      setCelebratedTask(task)
      setShowCelebration(true)
      triggerHaptic()
    }
    
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error
      case 'medium': return theme.colors.warning
      case 'low': return theme.colors.success
      default: return theme.colors.textSecondary
    }
  }

  const getMotivationalMessage = () => {
    const completionRate = (completedTasks / totalTasks) * 100
    if (completionRate === 100) return "🎉 Perfect day! You're unstoppable!"
    if (completionRate >= 75) return "🌟 Almost there! You're doing amazing!"
    if (completionRate >= 50) return "💪 Great progress! Keep the momentum!"
    if (completionRate >= 25) return "🎯 You've got this! One task at a time!"
    return "✨ Fresh start! Your brain is ready to conquer!"
  }

  const handleSpinWheelTaskSelected = (task: Task) => {
    // You could add logic here to highlight the selected task or navigate to it
    console.log('Selected task from spin wheel:', task)
  }

  const parseTimeToDate = (timeString: string): Date => {
    const today = new Date()
    const [time, period] = timeString.split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    
    let hour24 = hours
    if (period === 'PM' && hours !== 12) {
      hour24 += 12
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0
    }

    today.setHours(hour24, minutes, 0, 0)
    return today
  }

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header with Gradient */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.colors.gradient.primary[0]}, ${theme.colors.gradient.primary[1]})`,
        padding: '40px 20px 30px',
        color: 'white',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 style={{ fontSize: '18px', fontWeight: '400', marginBottom: '4px' }}>
            Good morning! 🌅
          </h1>
          <h2 style={{ fontSize: '24px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>
            Ready to conquer today?
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.8, fontStyle: 'italic' }}>
            {getMotivationalMessage()}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '16px',
            padding: '20px',
            marginTop: '20px',
            boxShadow: theme.isDark ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
            <Sparkles size={24} color={theme.colors.primary} />
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.text, flex: 1 }}>
              Today's Progress
            </h3>
            <div style={{
              backgroundColor: theme.isDark ? 'rgba(255, 107, 107, 0.2)' : '#fff0f0',
              padding: '4px 8px',
              borderRadius: '12px',
            }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: theme.colors.error }}>
                🔥 12
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
              {completedTasks} of {totalTasks} tasks completed
            </p>
            <div style={{
              height: '8px',
              backgroundColor: theme.colors.border,
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                backgroundColor: theme.colors.primary,
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }} />
            </div>
            <p style={{ fontSize: '12px', fontWeight: '700', color: theme.colors.primary, textAlign: 'right' }}>
              {Math.round(progressPercentage)}%
            </p>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0 16px' }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text }}>
            Today's Focus
          </h3>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{
            backgroundColor: theme.colors.border,
            border: 'none',
            borderRadius: '12px',
            padding: '8px',
            cursor: 'pointer',
          }}>
            <Plus size={20} color={theme.colors.primary} />
          </button>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <button
                onClick={() => toggleTask(task.id)}
                style={{
                  width: '100%',
                  backgroundColor: task.completed 
                    ? (theme.isDark ? 'rgba(76, 175, 80, 0.1)' : '#f8fff8')
                    : theme.colors.surface,
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: theme.isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                  opacity: task.completed ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>{task.emoji}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: task.completed ? theme.colors.textSecondary : theme.colors.text,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      marginBottom: task.time ? '4px' : '0',
                    }}>
                      {task.title}
                    </p>
                    {task.time && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} color={theme.colors.textSecondary} />
                        <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                          {task.time}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: getPriorityColor(task.priority),
                  }} />
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '12px',
                    border: `2px solid ${task.completed ? theme.colors.primary : theme.colors.border}`,
                    backgroundColor: task.completed ? theme.colors.primary : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {task.completed && <CheckCircle size={16} color="#fff" />}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{ marginBottom: '20px' }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '16px' }}>
            ADHD-Friendly Tools
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              flex: 1,
              backgroundColor: theme.colors.error,
              border: 'none',
              borderRadius: '16px',
              padding: '16px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
            onClick={() => setShowSpinWheel(true)}
            >
              <Target size={24} />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Spin Wheel</span>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Can't decide?</span>
            </button>
            <button style={{
              flex: 1,
              backgroundColor: theme.colors.success,
              border: 'none',
              borderRadius: '16px',
              padding: '16px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
            onClick={() => setShowFocusMode(true)}
            >
              <Zap size={24} />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Focus Mode</span>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Deep work time</span>
            </button>
          </div>
        </motion.div>

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
            borderLeft: `4px solid ${theme.colors.primary}`,
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.text, marginBottom: '8px' }}>
            💡 Today's ADHD Tip
          </h3>
          <p style={{ fontSize: '14px', color: theme.colors.textSecondary, lineHeight: '1.5', fontStyle: 'italic' }}>
            "Start with the easiest task to build momentum. Your brain loves quick wins! 🎯"
          </p>
        </motion.div>
      </div>

      <CelebrationModal
        visible={showCelebration}
        onClose={() => setShowCelebration(false)}
        taskTitle={celebratedTask?.title || ''}
        emoji={celebratedTask?.emoji || '🎉'}
      />

      <SpinWheelModal
        visible={showSpinWheel}
        onClose={() => setShowSpinWheel(false)}
        tasks={tasks}
        onTaskSelected={handleSpinWheelTaskSelected}
      />

      <FocusModeModal
        visible={showFocusMode}
        onClose={() => setShowFocusMode(false)}
      />

      <AddTaskModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTask={addNewTask}
      />
    </div>
  )
}