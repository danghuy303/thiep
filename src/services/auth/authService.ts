const SESSION_KEY = 'wi_session'

export interface Session {
  userId: string
  email: string
  name: string
}

export const authService = {
  getSession(): Session | null {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) {
      const defaultSession = { userId: 'user-demo', email: 'admin@demo.com', name: 'Admin Demo' }
      localStorage.setItem(SESSION_KEY, JSON.stringify(defaultSession))
      return defaultSession
    }
    try {
      return JSON.parse(raw) as Session
    } catch {
      const defaultSession = { userId: 'user-demo', email: 'admin@demo.com', name: 'Admin Demo' }
      localStorage.setItem(SESSION_KEY, JSON.stringify(defaultSession))
      return defaultSession
    }
  },
  setSession(session: Session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  },
  logout() {
    localStorage.removeItem(SESSION_KEY)
  },
}
