'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import Client from '@/app/api'
import { User } from '@/app/lib/types/user'

interface AuthContextType {
  user: User | null
  loading?: boolean
  loggedIn: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  refreshUser?: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const refreshUser = async () => {
    try {
      const client = new Client()
      const authRes = await client.authorize()
      const user = authRes?.user as User;
      setUser(user)
    } catch (error) {
      setUser(null)
      console.error('Failed to refresh user:', error)
    }
  }

  const logout = async () => {
    try {
      const client = new Client()
      await client.logout()
      setUser(null)

      console.log('Logged out successfully')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const login = async (email?: string, password?: string): Promise<User> => {
    try {
      const client = new Client();
      const user = await client.login(email || '', password || '');
      setUser(user);
      return user;
    } catch (error) {
      setUser(null);
      throw error;
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value: AuthContextType = {
    user,
    logout,
    login,
    loggedIn: !!user,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
