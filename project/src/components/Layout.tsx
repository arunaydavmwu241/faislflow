import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import { useTheme } from '@/contexts/ThemeContext'

export default function Layout() {
  const { theme } = useTheme()

  return (
    <div style={{ 
      backgroundColor: theme.colors.background, 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <main style={{ flex: 1, paddingBottom: '80px' }}>
        <Outlet />
      </main>
      <Navigation />
    </div>
  )
}