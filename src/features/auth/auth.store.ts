import { create } from 'zustand'
import type { AuthUser } from '../../routes/types'

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  status: 'checking' | 'authenticated' | 'unauthenticated' | 'error'
  logoutCause: 'logout' | 'expired' | null
  version: number
  setAuth: (user: AuthUser) => void
  logout: (cause?: 'logout' | 'expired') => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  status: 'checking',
  logoutCause: null,
  version: 0,

  setAuth: (user: AuthUser) => {
    if (get().user === user && get().status === 'authenticated') return
    set({
      user,
      isAuthenticated: true,
      status: 'authenticated',
      logoutCause: null,
    })
  },

  logout: (cause = 'expired') => {
    set({
      user: null,
      isAuthenticated: false,
      status: 'unauthenticated',
      logoutCause: cause,
    })
  },
}))
