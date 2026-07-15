import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/api.js'

const AuthContext = createContext(null)

const AUTH_STORAGE_KEY = 'ledger_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const { user: storedUser, token: storedToken } = JSON.parse(stored)
        setUser(storedUser)
        setToken(storedToken)
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setInitializing(false)
  }, [])

  async function login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const response = await api.auth.login(email, password)
    const authData = { user: response.user, token: response.token }
    api.saveAuth(response)
    setUser(response.user)
    setToken(response.token)
    return response.user
  }

  async function signup(name, email, password, passwordConfirm) {
    if (!name || !email || !password) {
      throw new Error('All fields are required')
    }

    const response = await api.auth.signup(name, email, password, passwordConfirm)
    api.saveAuth(response)
    setUser(response.user)
    setToken(response.token)
    return response.user
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, initializing, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
