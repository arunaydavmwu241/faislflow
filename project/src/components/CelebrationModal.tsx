import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useCapacitor } from '@/hooks/useCapacitor'

interface CelebrationModalProps {
  visible: boolean
  onClose: () => void
  taskTitle: string
  emoji: string
}

export default function CelebrationModal({ visible, onClose, taskTitle, emoji }: CelebrationModalProps) {
  const { triggerHaptic } = useCapacitor()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(visible)
    if (visible) {
      triggerHaptic()
    }
  }, [visible])

  if (!isVisible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
          borderRadius: '24px',
          padding: '30px',
          width: '100%',
          maxWidth: '350px',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
        }}
      >
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

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ marginBottom: '16px' }}
        >
          <Sparkles size={40} />
        </motion.div>
        
        <h2 style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Poppins, sans-serif', marginBottom: '12px' }}>
          🎉 Amazing!
        </h2>
        
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{emoji}</div>
        
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          "{taskTitle}"
        </h3>
        
        <p style={{ fontSize: '16px', fontWeight: '500', opacity: 0.9, marginBottom: '20px' }}>
          Task completed! 🌟
        </p>
        
        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            Your ADHD brain just conquered another challenge! 💪
          </p>
          <p style={{ fontSize: '13px', opacity: 0.8, fontStyle: 'italic' }}>
            Every small win builds momentum. Keep going! ✨
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            backgroundColor: '#fff',
            color: '#667eea',
            border: 'none',
            borderRadius: '25px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: 'Poppins, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            width: '100%',
          }}
        >
          Keep Going! 🚀
        </button>
      </motion.div>
    </div>
  )
}