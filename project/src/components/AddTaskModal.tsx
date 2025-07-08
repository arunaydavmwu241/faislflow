import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface Task {
  id: string
  title: string
  emoji: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  time?: string
  category: string
}

interface AddTaskModalProps {
  visible: boolean
  onClose: () => void
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void
}

const priorities = [
  { id: 'high', label: 'High Priority', color: '#ff6b6b', emoji: '🔴' },
  { id: 'medium', label: 'Medium Priority', color: '#ffa726', emoji: '🟡' },
  { id: 'low', label: 'Low Priority', color: '#66bb6a', emoji: '⚪' },
]

const categories = [
  { id: 'work', label: 'Work', emoji: '💼', color: '#667eea' },
  { id: 'personal', label: 'Personal', emoji: '🌟', color: '#4ecdc4' },
  { id: 'health', label: 'Health', emoji: '💪', color: '#96ceb4' },
  { id: 'home', label: 'Home', emoji: '🏠', color: '#ffa726' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', color: '#ff6b6b' },
  { id: 'learning', label: 'Learning', emoji: '📚', color: '#a8edea' },
]

const taskEmojis = [
  '📝', '💻', '📞', '🛒', '🧹', '🏃‍♂️', '📚', '🍳', '🧺', '💡',
  '🎯', '⚡', '🌟', '🎨', '🎵', '📊', '💪', '🧘', '☕', '🌱'
]

const timeSlots = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
]

export default function AddTaskModal({ visible, onClose, onAddTask }: AddTaskModalProps) {
  const { theme } = useTheme()
  const [taskTitle, setTaskTitle] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('📝')
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [selectedCategory, setSelectedCategory] = useState('personal')
  const [selectedTime, setSelectedTime] = useState('')

  const handleAddTask = () => {
    if (!taskTitle.trim()) return

    const newTask = {
      title: taskTitle.trim(),
      emoji: selectedEmoji,
      priority: selectedPriority,
      category: categories.find(c => c.id === selectedCategory)?.label || 'Personal',
      time: selectedTime || undefined,
    }

    onAddTask(newTask)
    
    // Reset form
    setTaskTitle('')
    setSelectedEmoji('📝')
    setSelectedPriority('medium')
    setSelectedCategory('personal')
    setSelectedTime('')
    
    onClose()
  }

  const handleClose = () => {
    // Reset form when closing
    setTaskTitle('')
    setSelectedEmoji('📝')
    setSelectedPriority('medium')
    setSelectedCategory('personal')
    setSelectedTime('')
    onClose()
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'flex-end',
      flexDirection: 'column',
      zIndex: 1000,
    }}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          padding: '32px 24px 24px',
          color: 'white',
          position: 'relative',
        }}>
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <X size={24} />
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>
              Add New Task
            </h2>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>
              Create your next achievement ✨
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {/* Task Details */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '16px' }}>
              Task Details
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: theme.colors.text, marginBottom: '8px', display: 'block' }}>
                What needs to be done?
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g., Finish project presentation"
                style={{
                  width: '100%',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '16px',
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  outline: 'none',
                }}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: theme.colors.text, marginBottom: '8px', display: 'block' }}>
                Choose an emoji
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {taskEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '24px',
                      backgroundColor: selectedEmoji === emoji ? theme.colors.primary : theme.colors.border,
                      border: `2px solid ${selectedEmoji === emoji ? theme.colors.primary : 'transparent'}`,
                      cursor: 'pointer',
                      fontSize: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Priority Level */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '16px' }}>
              Priority Level
            </h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              {priorities.map((priority) => (
                <button
                  key={priority.id}
                  onClick={() => setSelectedPriority(priority.id as 'high' | 'medium' | 'low')}
                  style={{
                    flex: 1,
                    backgroundColor: priority.color,
                    border: `2px solid ${selectedPriority === priority.id ? theme.colors.text : 'transparent'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transform: selectedPriority === priority.id ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{priority.emoji}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600' }}>{priority.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '16px' }}>
              Category
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    backgroundColor: category.color,
                    border: `2px solid ${selectedCategory === category.id ? theme.colors.text : 'transparent'}`,
                    borderRadius: '12px',
                    padding: '12px',
                    color: 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transform: selectedCategory === category.id ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{category.emoji}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600' }}>{category.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Poppins, sans-serif', color: theme.colors.text, marginBottom: '16px' }}>
              Time (Optional)
            </h3>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              <button
                onClick={() => setSelectedTime('')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backgroundColor: !selectedTime ? theme.colors.primary : theme.colors.border,
                  border: `2px solid ${!selectedTime ? theme.colors.primary : 'transparent'}`,
                  color: !selectedTime ? 'white' : theme.colors.text,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                }}
              >
                No time
              </button>
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor: selectedTime === time ? theme.colors.primary : theme.colors.border,
                    border: `2px solid ${selectedTime === time ? theme.colors.primary : 'transparent'}`,
                    color: selectedTime === time ? 'white' : theme.colors.text,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', marginBottom: '20px' }}>
            <button
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '12px',
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
              onClick={handleAddTask}
              disabled={!taskTitle.trim()}
              style={{
                flex: 2,
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: taskTitle.trim() ? theme.colors.primary : theme.colors.border,
                color: 'white',
                cursor: taskTitle.trim() ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              Add Task ✨
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}