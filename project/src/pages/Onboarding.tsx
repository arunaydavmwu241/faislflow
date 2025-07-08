import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ChevronRight, CheckCircle } from 'lucide-react'

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to TaskFlow',
    subtitle: 'Transform your daily tasks into a fun, rewarding experience designed for your unique brain',
    emoji: '✨',
  },
  {
    id: 'motivation',
    title: 'What drives you to form good habits?',
    options: [
      { id: 1, emoji: '🎯', text: 'Achieve goals', color: '#ff6b6b' },
      { id: 2, emoji: '💪', text: 'Boost confidence', color: '#4ecdc4' },
      { id: 3, emoji: '🌟', text: 'Be my best self', color: '#45b7d1' },
      { id: 4, emoji: '💚', text: 'Improve health', color: '#96ceb4' },
    ],
  },
  {
    id: 'struggle',
    title: "What's your biggest struggle with planning?",
    options: [
      { id: 1, emoji: '😵‍💫', text: 'Overwhelm', color: '#ff9ff3' },
      { id: 2, emoji: '⏰', text: 'Forgetting', color: '#54a0ff' },
      { id: 3, emoji: '😴', text: 'Procrastination', color: '#5f27cd' },
      { id: 4, emoji: '🤷‍♂️', text: 'Not knowing where to start', color: '#00d2d3' },
    ],
  },
  {
    id: 'vibe',
    title: "What's your ideal daily vibe?",
    options: [
      { id: 1, emoji: '🔥', text: 'Productive Hustler', color: '#ff6b35' },
      { id: 2, emoji: '🌈', text: 'Chill and Mindful', color: '#f7b733' },
      { id: 3, emoji: '🎨', text: 'Creative Chaos', color: '#fc4a1a' },
      { id: 4, emoji: '🧘', text: 'Calm and Focused', color: '#4ecdc4' },
    ],
  },
  {
    id: 'complete',
    title: "You're All Set!",
    subtitle: "Your personalized TaskFlow experience is ready. Let's turn your tasks into achievements! 🚀",
    emoji: '🎉',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number }>({})

  const step = steps[currentStep]
  const isWelcome = step.id === 'welcome'
  const isComplete = step.id === 'complete'
  const hasOptions = step.options && step.options.length > 0
  const canProceed = isWelcome || isComplete || (hasOptions && selectedOptions[step.id])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      navigate('/')
    }
  }

  const handleOptionSelect = (optionId: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [step.id]: optionId
    }))
  }

  const getGradientColors = () => {
    switch (currentStep) {
      case 0: return ['#667eea', '#764ba2', '#f093fb']
      case 1: return ['#ffecd2', '#fcb69f']
      case 2: return ['#a8edea', '#fed6e3']
      case 3: return ['#d299c2', '#fef9d7']
      case 4: return ['#667eea', '#764ba2', '#f093fb']
      default: return ['#667eea', '#764ba2']
    }
  }

  return (
    <div style={{
      background: `linear-gradient(135deg, ${getGradientColors().join(', ')})`,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 30px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Progress Indicator */}
        {!isWelcome && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#666',
              marginBottom: '20px',
            }}
          >
            {currentStep} of {steps.length - 2}
          </motion.div>
        )}

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: isWelcome || isComplete ? '80px' : '60px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {isWelcome && <Sparkles size={80} color="#fff" />}
          {isComplete && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <CheckCircle size={80} color="#fff" />
            </motion.div>
          )}
          <span>{step.emoji}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: isWelcome || isComplete ? '32px' : '24px',
            fontWeight: '700',
            fontFamily: 'Poppins, sans-serif',
            color: isWelcome || isComplete ? '#fff' : '#333',
            textAlign: 'center',
            marginBottom: '16px',
            lineHeight: '1.2',
          }}
        >
          {step.title}
        </motion.h1>

        {/* Subtitle */}
        {step.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              fontSize: '18px',
              color: isWelcome || isComplete ? '#fff' : '#666',
              textAlign: 'center',
              lineHeight: '1.4',
              marginBottom: '40px',
              opacity: 0.9,
            }}
          >
            {step.subtitle}
          </motion.p>
        )}

        {/* Options */}
        {hasOptions && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '40px',
          }}>
            {step.options!.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={() => handleOptionSelect(option.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px 24px',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: option.color,
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '600',
                  textAlign: 'left',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transform: selectedOptions[step.id] === option.id ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = selectedOptions[step.id] === option.id ? 'scale(1.02)' : 'scale(1)'}
              >
                <span style={{ fontSize: '28px', marginRight: '16px' }}>{option.emoji}</span>
                <span style={{ flex: 1 }}>{option.text}</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Features (Complete Step) */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            {[
              { emoji: '🎯', text: 'Smart task prioritization' },
              { emoji: '🎡', text: 'Decision-making wheel' },
              { emoji: '📊', text: 'Progress tracking' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px 20px',
                  borderRadius: '20px',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>{feature.emoji}</span>
                <span style={{ fontSize: '16px', fontWeight: '500', color: '#fff' }}>
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Next Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isWelcome || isComplete ? 0.8 : 1.0 }}
          onClick={handleNext}
          disabled={!canProceed}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 32px',
            borderRadius: '25px',
            border: 'none',
            backgroundColor: canProceed ? '#fff' : '#ccc',
            color: canProceed ? '#667eea' : '#999',
            cursor: canProceed ? 'pointer' : 'not-allowed',
            fontSize: '18px',
            fontWeight: '600',
            fontFamily: 'Poppins, sans-serif',
            gap: '8px',
            boxShadow: canProceed ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none',
            transition: 'all 0.2s ease',
            minWidth: '200px',
          }}
        >
          <span>
            {isWelcome ? "Let's Get Started! 🚀" : 
             isComplete ? "Start My Journey! 🌟" : 
             currentStep === steps.length - 2 ? "Complete" : "Next"}
          </span>
          {!isWelcome && !isComplete && <ChevronRight size={20} />}
        </motion.button>
      </div>
    </div>
  )
}