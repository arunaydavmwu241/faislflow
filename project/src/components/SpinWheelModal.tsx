import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, Play } from 'lucide-react'
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

interface SpinWheelModalProps {
  visible: boolean
  onClose: () => void
  tasks: Task[]
  onTaskSelected: (task: Task) => void
}

export default function SpinWheelModal({ visible, onClose, tasks, onTaskSelected }: SpinWheelModalProps) {
  const { theme } = useTheme()
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [rotation, setRotation] = useState(0)

  const incompleteTasks = tasks.filter(task => !task.completed)

  const spinWheel = () => {
    if (incompleteTasks.length === 0 || isSpinning) return

    setIsSpinning(true)
    setSelectedTask(null)

    // Random rotation between 1440 and 2160 degrees (4-6 full rotations)
    const randomRotation = 1440 + Math.random() * 720
    setRotation(prev => prev + randomRotation)

    // Select random task
    const randomIndex = Math.floor(Math.random() * incompleteTasks.length)
    const selected = incompleteTasks[randomIndex]

    setTimeout(() => {
      setSelectedTask(selected)
      setIsSpinning(false)
    }, 3000)
  }

  const handleTaskSelect = () => {
    if (selectedTask) {
      onTaskSelected(selectedTask)
      onClose()
    }
  }

  const resetWheel = () => {
    setRotation(0)
    setSelectedTask(null)
    setIsSpinning(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
          background: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
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
            🎡 Decision Wheel
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Can't decide? Let the wheel choose for you!
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', textAlign: 'center' }}>
          {incompleteTasks.length === 0 ? (
            <div style={{ padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, marginBottom: '8px' }}>
                All tasks completed!
              </h3>
              <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
                You've finished everything. Time to celebrate! 🌟
              </p>
            </div>
          ) : (
            <>
              {/* Wheel Container */}
              <div style={{
                position: 'relative',
                width: '200px',
                height: '200px',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Wheel */}
                <motion.div
                  animate={{ rotate: rotation }}
                  transition={{ duration: 3, ease: "easeOut" }}
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: `conic-gradient(${incompleteTasks.map((_, index) => {
                      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffa726', '#a8edea']
                      return colors[index % colors.length]
                    }).join(', ')})`,
                    position: 'relative',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {/* Task segments */}
                  {incompleteTasks.map((task, index) => {
                    const angle = (360 / incompleteTasks.length) * index
                    return (
                      <div
                        key={task.id}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-60px)`,
                          fontSize: '20px',
                          textAlign: 'center',
                        }}
                      >
                        {task.emoji}
                      </div>
                    )
                  })}
                </motion.div>

                {/* Pointer */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderTop: '20px solid #333',
                  zIndex: 1,
                }} />
              </div>

              {/* Selected Task Display */}
              <AnimatePresence>
                {selectedTask && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    style={{
                      backgroundColor: theme.isDark ? 'rgba(255, 107, 107, 0.1)' : '#fff0f0',
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '20px',
                      border: `2px solid #ff6b6b`,
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{selectedTask.emoji}</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, marginBottom: '4px' }}>
                      {selectedTask.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '16px' }}>
                      Category: {selectedTask.category}
                    </p>
                    <button
                      onClick={handleTaskSelect}
                      style={{
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: '0 auto',
                      }}
                    >
                      <Play size={16} />
                      Start This Task
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={resetWheel}
                  disabled={isSpinning}
                  style={{
                    backgroundColor: theme.colors.border,
                    color: theme.colors.textSecondary,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    cursor: isSpinning ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isSpinning ? 0.5 : 1,
                  }}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  style={{
                    backgroundColor: isSpinning ? theme.colors.border : '#ff6b6b',
                    color: isSpinning ? theme.colors.textSecondary : 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isSpinning ? 'not-allowed' : 'pointer',
                    opacity: isSpinning ? 0.7 : 1,
                  }}
                >
                  {isSpinning ? 'Spinning...' : 'Spin Wheel! 🎡'}
                </button>
              </div>

              {/* Task List */}
              <div style={{ marginTop: '24px', textAlign: 'left' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.text, marginBottom: '12px' }}>
                  Available Tasks ({incompleteTasks.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                  {incompleteTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 12px',
                        backgroundColor: theme.colors.border,
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>{task.emoji}</span>
                      <span style={{ color: theme.colors.text, flex: 1 }}>{task.title}</span>
                      <span style={{ 
                        fontSize: '10px', 
                        color: 'white',
                        backgroundColor: task.priority === 'high' ? '#ff6b6b' : task.priority === 'medium' ? '#ffa726' : '#66bb6a',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}