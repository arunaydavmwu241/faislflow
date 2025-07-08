import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Clock, X, Shuffle, Check, Trash2 } from 'lucide-react'
import AddTaskModal from '@/components/AddTaskModal'
import CelebrationModal from '@/components/CelebrationModal'
import SpinWheelModal from '@/components/SpinWheelModal'
import FocusModeModal from '@/components/FocusModeModal'
import { useTheme } from '@/contexts/ThemeContext'
import { useCapacitor } from '@/hooks/useCapacitor'
import { useNotifications } from '@/hooks/useNotifications'
import { useCalendar } from '@/hooks/useCalendar'

interface Task {
  id: string
  title: string
  emoji: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  time?: string
  category: string
}

interface PrePlannedTask {
  id: string
  title: string
  emoji: string
  description: string
  tasks: string[]
  color: string
  category: string
  estimatedTime: string
}

const mockTasks: Task[] = [
  { id: '1', title: 'Morning workout', emoji: '🏃‍♂️', completed: true, priority: 'high', time: '7:00 AM', category: 'Health' },
  { id: '2', title: 'Finish project presentation', emoji: '📊', completed: false, priority: 'high', time: '2:00 PM', category: 'Work' },
  { id: '3', title: 'Buy groceries', emoji: '🛒', completed: false, priority: 'medium', time: '5:00 PM', category: 'Personal' },
  { id: '4', title: 'Read for 30 minutes', emoji: '📚', completed: false, priority: 'low', time: '8:00 PM', category: 'Personal' },
]

const prePlannedTasks: PrePlannedTask[] = [
  {
    id: 'plan1',
    title: 'Focus Mode',
    emoji: '📘',
    description: 'Deep work session with breaks',
    tasks: ['📝 Write for 2 hours', '☕ Coffee break (15 min)', '💻 Code review', '🧘 Meditation (10 min)'],
    color: '#4ecdc4',
    category: 'Productivity',
    estimatedTime: '3 hours'
  },
  {
    id: 'plan2',
    title: 'Sunday Reset',
    emoji: '🧺',
    description: 'Organize and prepare for the week',
    tasks: ['🧹 Clean house', '🛒 Grocery shopping', '📅 Plan next week', '🧺 Do laundry', '📋 Review goals'],
    color: '#ff6b6b',
    category: 'Life',
    estimatedTime: '4 hours'
  },
  {
    id: 'plan3',
    title: 'Creative Flow',
    emoji: '🎨',
    description: 'Express your creativity',
    tasks: ['🎨 Art project (1 hour)', '📸 Photography walk', '✍️ Journal writing', '🎵 Listen to music'],
    color: '#ffa726',
    category: 'Creative',
    estimatedTime: '2.5 hours'
  },
  {
    id: 'plan4',
    title: 'Workout & Meal Prep',
    emoji: '🏋️‍♂️',
    description: 'Health and nutrition focus',
    tasks: ['🏋️‍♂️ Strength training', '🥗 Prep healthy meals', '💧 Drink water (8 glasses)', '🍎 Plan snacks'],
    color: '#96ceb4',
    category: 'Health',
    estimatedTime: '2 hours'
  },
]

export default function Tasks() {
  const { theme } = useTheme()
  const { triggerHaptic } = useCapacitor()
  const { scheduleTaskReminder } = useNotifications()
  const { createTaskEvent } = useCalendar()
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PrePlannedTask | null>(null)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today')
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebratedTask, setCelebratedTask] = useState<Task | null>(null)
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [showFocusMode, setShowFocusMode] = useState(false)

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
    
    // Create calendar event if connected
    createTaskEvent(newTask)
  }

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    if (!task.completed) {
      setCelebratedTask(task)
      setShowCelebration(true)
      triggerHaptic()
    }
    
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ))
  }

  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      setTasks(tasks.filter(t => t.id !== taskId))
    }
  }

  const addPrePlannedTasks = (plan: PrePlannedTask) => {
    const newTasks: Task[] = plan.tasks.map((taskTitle, index) => ({
      id: `${plan.id}-${index}-${Date.now()}`,
      title: taskTitle,
      emoji: taskTitle.split(' ')[0],
      completed: false,
      priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
      category: plan.category,
      time: undefined
    }))

    setTasks(prevTasks => [...prevTasks, ...newTasks])
    setShowPlanModal(false)
    setSelectedPlan(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b'
      case 'medium': return '#ffa726'
      case 'low': return '#66bb6a'
      default: return '#999'
    }
  }

  const handleSpinWheelTaskSelected = (task: Task) => {
    // Highlight the selected task
    setSelectedTask(task.id)
    setTimeout(() => setSelectedTask(null), 3000)
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
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.colors.gradient.secondary[0]}, ${theme.colors.gradient.secondary[1]})`,
        padding: '40px 20px 20px',
        color: theme.colors.text,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '20px' }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>
            Tasks & Planning
          </h1>
          <p style={{ fontSize: '16px', color: theme.colors.textSecondary }}>
            Organize your day with focus 🎯
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '4px',
          }}
        >
          {[
            { key: 'today', label: 'Today', emoji: '📅' },
            { key: 'week', label: 'Week', emoji: '📆' },
            { key: 'month', label: 'Month', emoji: '🗓️' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'today' | 'week' | 'month')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: activeTab === tab.key ? '#fff' : 'transparent',
                color: activeTab === tab.key ? theme.colors.text : theme.colors.textSecondary,
                cursor: 'pointer',
                gap: '6px',
                boxShadow: activeTab === tab.key ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{tab.emoji}</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{tab.label}</span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: '12px', margin: '20px 0' }}
        >
          <button
            onClick={() => setShowSpinWheel(true)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: '#ff6b6b',
              color: 'white',
              cursor: 'pointer',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            <Shuffle size={20} />
            Spin Wheel
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: '#4ecdc4',
              color: 'white',
              cursor: 'pointer',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            <Plus size={20} />
            Add Task
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ marginBottom: '30px' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '4px' }}>
            Pre-Planned Task Collections
          </h2>
          <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '16px' }}>
            Tap to add entire collections to your day ✨
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
            gap: '12px' 
          }}>
            {prePlannedTasks.map((plan, index) => (
              <motion.button
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                onClick={() => {
                  setSelectedPlan(plan)
                  setShowPlanModal(true)
                }}
                style={{
                  backgroundColor: plan.color,
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px',
                  cursor: 'pointer',
                  color: 'white',
                  textAlign: 'left',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '28px' }}>{plan.emoji}</span>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '700',
                  }}>
                    {plan.tasks.length}
                  </div>
                </div>
                
                <h3 style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>
                  {plan.title}
                </h3>
                <p style={{ fontSize: '12px', opacity: 0.9, marginBottom: '12px', flex: 1 }}>
                  {plan.description}
                </p>
                
                <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '12px' }}>
                  ⏱️ {plan.estimatedTime} • {plan.category}
                </div>
                
                <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '12px' }}>
                  {plan.tasks.slice(0, 2).map((task, i) => (
                    <div key={i}>• {task}</div>
                  ))}
                  {plan.tasks.length > 2 && <div>+{plan.tasks.length - 2} more tasks</div>}
                </div>
                
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '6px',
                  textAlign: 'center',
                  fontSize: '11px',
                  fontWeight: '600',
                }}>
                  Tap to Add All ✨
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{ marginBottom: '30px' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '16px' }}>
            Your Tasks ({tasks.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.05 }}
                style={{
                  backgroundColor: task.completed 
                    ? (theme.isDark ? 'rgba(76, 175, 80, 0.1)' : '#f8fff8')
                    : theme.colors.surface,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: theme.isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                  opacity: task.completed ? 0.7 : 1,
                  border: selectedTask === task.id ? '2px solid #ffc107' : 'none',
                  ...(selectedTask === task.id && {
                    backgroundColor: '#fff3cd',
                  }),
                }}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>{task.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: task.completed ? theme.colors.textSecondary : theme.colors.text,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        marginBottom: '4px',
                      }}>
                        {task.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: theme.colors.primary,
                          backgroundColor: theme.isDark ? 'rgba(139, 154, 255, 0.2)' : '#f0f0ff',
                          padding: '2px 8px',
                          borderRadius: '8px',
                        }}>
                          {task.category}
                        </span>
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
                      {task.completed && <Check size={16} color="#fff" />}
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    padding: '16px 8px 16px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={16} color="#ff6b6b" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AddTaskModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTask={addNewTask}
      />

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

      {/* Pre-Planned Task Detail Modal */}
      {showPlanModal && selectedPlan && (
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
          <div style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '24px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <button
              onClick={() => setShowPlanModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 1,
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              <X size={24} color="#333" />
            </button>
            
            <div style={{
              backgroundColor: selectedPlan.color,
              padding: '24px',
              textAlign: 'center',
              color: 'white',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{selectedPlan.emoji}</div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginBottom: '8px' }}>
                {selectedPlan.title}
              </h2>
              <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '16px' }}>
                {selectedPlan.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Duration</div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{selectedPlan.estimatedTime}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Tasks</div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{selectedPlan.tasks.length}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>Category</div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{selectedPlan.category}</div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: '#333', marginBottom: '16px' }}>
                Tasks included:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {selectedPlan.tasks.map((task, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '12px',
                      backgroundColor: theme.colors.border,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: theme.colors.textSecondary,
                    }}>
                      {index + 1}
                    </div>
                    <span style={{ fontSize: '14px', color: theme.colors.text, flex: 1 }}>
                      {task}
                    </span>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowPlanModal(false)}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: theme.colors.border,
                    color: theme.colors.textSecondary,
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => addPrePlannedTasks(selectedPlan)}
                  style={{
                    flex: 2,
                    padding: '16px',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: selectedPlan.color,
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  Add All Tasks ✨
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}