import { useCallback, useEffect, useMemo, useState } from 'react'
import { SettingsContext } from './context.js'

export const THEMES = ['light', 'dark', 'system']

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // сховище недоступне — налаштування просто не збережуться
  }
}

function initialTheme() {
  const saved = read('theme', 'system')
  return THEMES.includes(saved) ? saved : 'system'
}

function initialUser() {
  const saved = read('user', {})
  return { name: '', username: '', email: '', plan: 'Pro', registered: false, joinedAt: new Date().toISOString(), ...saved }
}

export default function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)
  const [user, setUser] = useState(initialUser)

  useEffect(() => {
    // «system» — прибираємо атрибут, тема визначається через prefers-color-scheme
    if (theme === 'system') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
    write('theme', theme)
  }, [theme])

  useEffect(() => {
    write('user', user)
  }, [user])

  const updateUser = useCallback((patch) => setUser((prev) => ({ ...prev, ...patch })), [])

  const value = useMemo(() => ({ theme, setTheme, user, updateUser }), [theme, user, updateUser])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
