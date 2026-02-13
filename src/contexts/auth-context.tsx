'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { useLazyValidateTokenQuery } from '@/redux/services'

type AuthContextType = {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  token: string | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [triggerValidateToken] = useLazyValidateTokenQuery()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('authToken')

      if (storedToken) {
        try {
          await triggerValidateToken().unwrap()
          setToken(storedToken)
          setIsAuthenticated(true)
        } catch (error) {
          // Token is invalid/expired
          console.error('Token validation failed:', error)
          localStorage.removeItem('authToken')
          setToken(null)
          setIsAuthenticated(false)
          router.push('/login')
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, triggerValidateToken])

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken)
    setToken(newToken)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setToken(null)
    setIsAuthenticated(false)
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, token, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
