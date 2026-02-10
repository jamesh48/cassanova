'use client'

import { useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

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
  const router = useRouter()

  // Validate token with your API
  const validateToken = useCallback(
    async (tokenToValidate: string): Promise<boolean> => {
      try {
        const response = await fetch(
          'http://localhost:3030/api/validate-token',
          {
            headers: {
              Authorization: `Bearer ${tokenToValidate}`,
            },
          },
        )
        // Returns true for 200, false for 401/403
        return response.ok
      } catch (error) {
        console.error('Token validation failed:', error)
        return false
      }
    },
    [],
  )

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('authToken')

      if (storedToken) {
        const isValid = await validateToken(storedToken)

        if (isValid) {
          setToken(storedToken)
          setIsAuthenticated(true)
        } else {
          // Token is stale/invalid
          localStorage.removeItem('authToken')
          setToken(null)
          setIsAuthenticated(false)
          router.push('/login')
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, validateToken])

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
