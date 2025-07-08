import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Theme {
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    card: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
    accent: string
    gradient: {
      primary: string[]
      secondary: string[]
      accent: string[]
    }
  }
  isDark: boolean
}

const lightTheme: Theme = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    background: '#f8f9fa',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e9ecef',
    success: '#4ecdc4',
    warning: '#ffa726',
    error: '#ff6b6b',
    accent: '#a8edea',
    gradient: {
      primary: ['#667eea', '#764ba2'],
      secondary: ['#a8edea', '#fed6e3'],
      accent: ['#ff6b6b', '#ffa726'],
    },
  },
  isDark: false,
}

const darkTheme: Theme = {
  colors: {
    primary: '#8b9aff',
    secondary: '#9d7cc7',
    background: '#0f0f0f',
    surface: '#1a1a1a',
    card: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#3a3a3a',
    success: '#5ce1d8',
    warning: '#ffb74d',
    error: '#ff8a80',
    accent: '#b8f2ef',
    gradient: {
      primary: ['#8b9aff', '#9d7cc7'],
      secondary: ['#2a2a2a', '#3a3a3a'],
      accent: ['#ff8a80', '#ffb74d'],
    },
  },
  isDark: true,
}

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'taskflow_theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = () => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      if (savedTheme !== null) {
        setIsDark(JSON.parse(savedTheme))
      }
    } catch (error) {
      console.log('Error loading theme:', error)
    }
  }

  const saveTheme = (darkMode: boolean) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(darkMode))
    } catch (error) {
      console.log('Error saving theme:', error)
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    saveTheme(newTheme)
  }

  const setTheme = (darkMode: boolean) => {
    setIsDark(darkMode)
    saveTheme(darkMode)
  }

  const theme = isDark ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}