import { NavLink } from 'react-router-dom'
import { Home, Calendar, BarChart3, Settings } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function Navigation() {
  const { theme } = useTheme()

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tasks', icon: Calendar, label: 'Tasks' },
    { to: '/progress', icon: BarChart3, label: 'Progress' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
      borderTop: `1px solid ${theme.colors.border}`,
      padding: '8px 0',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '70px',
      zIndex: 1000,
      boxShadow: theme.isDark 
        ? '0 -2px 8px rgba(0, 0, 0, 0.3)' 
        : '0 -2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 12px',
            borderRadius: '12px',
            textDecoration: 'none',
            color: isActive ? theme.colors.primary : theme.colors.textSecondary,
            backgroundColor: isActive ? (theme.isDark ? 'rgba(139, 154, 255, 0.2)' : '#f0f0ff') : 'transparent',
            transition: 'all 0.2s ease',
            minWidth: '60px',
          })}
        >
          <Icon size={24} />
          <span style={{
            fontSize: '12px',
            fontWeight: '500',
            marginTop: '4px',
            fontFamily: 'Inter, sans-serif',
          }}>
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  )
}