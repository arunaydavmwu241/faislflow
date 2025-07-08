import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Play, Pause, RotateCcw, Coffee, Clock } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface FocusModeModalProps {
  visible: boolean
  onClose: () => void
}

const focusPresets = [
  {
    id: 'pomodoro',
    name: 'Pomodoro Technique',
    emoji: '🍅',
    description: '25 min work, 5 min break',
    sessions: [
      { type: 'work' as const, duration: 25 * 60, label: 'Focus Time' },
      { type: 'break' as const, duration: 5 * 60, label: 'Short Break' },
    ]
  },
  {
    id: 'deep-work',
    name: 'Deep Work',
    emoji: '🧠',
    description: '45 min work, 15 min break',
    sessions: [
      { type: 'work' as const, duration: 45 * 60, label: 'Deep Focus' },
      { type: 'break' as const, duration: 15 * 60, label: 'Rest Break' },
    ]
  },
  {
    id: 'adhd-friendly',
    name: 'ADHD Friendly',
    emoji: '⚡',
    description: '15 min work, 5 min break',
    sessions: [
      { type: 'work' as const, duration: 15 * 60, label: 'Quick Focus' },
      { type: 'break' as const, duration: 5 * 60, label: 'Brain Break' },
    ]
  },
  {
    id: 'micro-session',
    name: 'Micro Session',
    emoji: '⏱️',
    description: '10 min work, 2 min break',
    sessions: [
      { type: 'work' as const, duration: 10 * 60, label: 'Micro Focus' },
      { type: 'break' as const, duration: 2 * 60, label: 'Quick Break' },
    ]
  }
]

export default function FocusModeModal({ visible, onClose }: FocusModeModalProps) {
  const { theme } = useTheme()
  const [selectedPreset, setSelectedPreset] = useState(focusPresets[0])
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)

  const currentSession = selectedPreset.sessions[currentSessionIndex % selectedPreset.sessions.length]

  useEffect(() => {
    if (!isStarted) {
      setTimeRemaining(currentSession.duration)
    }
  }, [currentSession, isStarted])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            // Session completed
            setIsActive(false)
            setCompletedSessions(prev => prev + 1)
            setCurrentSessionIndex(prev => prev + 1)
            setIsStarted(false)
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else if (!isActive && interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    setIsActive(true)
    setIsStarted(true)
  }

  const pauseTimer = () => {
    setIsActive(false)
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsStarted(false)
    setTimeRemaining(currentSession.duration)
    setCurrentSessionIndex(0)
    setCompletedSessions(0)
  }

  const selectPreset = (preset: typeof focusPresets[0]) => {
    setSelectedPreset(preset)
    setIsActive(false)
    setIsStarted(false)
    setCurrentSessionIndex(0)
    setCompletedSessions(0)
    setTimeRemaining(preset.sessions[0].duration)
  }

  const getProgressPercentage = () => {
    return ((currentSession.duration - timeRemaining) / currentSession.duration) * 100
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
          background: currentSession.type === 'work' 
            ? 'linear-gradient(135deg, #4ecdc4, #44a08d)'
            : 'linear-gradient(135deg, #96ceb4, #ffeaa7)',
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
            ⚡ Focus Mode
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            {currentSession.type === 'work' ? 'Time to focus and get things done!' : 'Take a well-deserved break!'}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {!isStarted ? (
            /* Preset Selection */
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, marginBottom: '16px' }}>
                Choose Your Focus Style
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {focusPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      borderRadius: '16px',
                      border: `2px solid ${selectedPreset.id === preset.id ? theme.colors.primary : 'transparent'}`,
                      backgroundColor: selectedPreset.id === preset.id 
                        ? (theme.isDark ? 'rgba(139, 154, 255, 0.1)' : '#f0f0ff')
                        : theme.colors.border,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ fontSize: '32px', marginRight: '16px' }}>{preset.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.text, marginBottom: '4px' }}>
                        {preset.name}
                      </h4>
                      <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
                        {preset.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={startTimer}
                style={{
                  width: '100%',
                  backgroundColor: '#4ecdc4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Play size={20} />
                Start Focus Session
              </button>
            </div>
          ) : (
            /* Timer Interface */
            <div style={{ textAlign: 'center' }}>
              {/* Session Info */}
              <div style={{
                backgroundColor: currentSession.type === 'work' 
                  ? (theme.isDark ? 'rgba(78, 205, 196, 0.1)' : '#f0fffe')
                  : (theme.isDark ? 'rgba(150, 206, 180, 0.1)' : '#f8fff8'),
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '24px',
                border: `2px solid ${currentSession.type === 'work' ? '#4ecdc4' : '#96ceb4'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                  {currentSession.type === 'work' ? <Clock size={20} /> : <Coffee size={20} />}
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text }}>
                    {currentSession.label}
                  </h3>
                </div>
                <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
                  Session {currentSessionIndex + 1} • {selectedPreset.name}
                </p>
              </div>

              {/* Timer Display */}
              <div style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 24px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Progress Circle */}
                <svg width="200" height="200" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke={theme.colors.border}
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke={currentSession.type === 'work' ? '#4ecdc4' : '#96ceb4'}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgressPercentage() / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                
                {/* Time Display */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    fontFamily: 'Poppins, sans-serif',
                    color: theme.colors.text,
                    marginBottom: '4px',
                  }}>
                    {formatTime(timeRemaining)}
                  </div>
                  <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
                    {Math.round(getProgressPercentage())}% complete
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
                <button
                  onClick={resetTimer}
                  style={{
                    backgroundColor: theme.colors.border,
                    color: theme.colors.textSecondary,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button
                  onClick={isActive ? pauseTimer : startTimer}
                  style={{
                    backgroundColor: currentSession.type === 'work' ? '#4ecdc4' : '#96ceb4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {isActive ? <Pause size={16} /> : <Play size={16} />}
                  {isActive ? 'Pause' : 'Resume'}
                </button>
              </div>

              {/* Stats */}
              <div style={{
                backgroundColor: theme.colors.border,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-around',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: theme.colors.primary }}>
                    {completedSessions}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                    Completed
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: theme.colors.primary }}>
                    {Math.floor(currentSessionIndex / 2) + 1}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                    Cycles
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: theme.colors.primary }}>
                    {selectedPreset.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                    Method
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADHD Tips */}
          <div style={{
            marginTop: '24px',
            backgroundColor: theme.isDark ? 'rgba(255, 107, 107, 0.1)' : '#fff0f0',
            borderRadius: '12px',
            padding: '16px',
            borderLeft: `4px solid #ff6b6b`,
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text, marginBottom: '8px' }}>
              💡 ADHD Focus Tips
            </h4>
            <div style={{ fontSize: '12px', color: theme.colors.textSecondary, lineHeight: '1.4' }}>
              {currentSession.type === 'work' ? (
                <>• Remove distractions from your workspace<br/>
                • Use noise-canceling headphones or white noise<br/>
                • Keep a water bottle and snacks nearby</>
              ) : (
                <>• Step away from your workspace<br/>
                • Do some light stretching or movement<br/>
                • Avoid checking social media or emails</>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}