let toastFn = null
export function setToastFunction(fn) {
  toastFn = fn
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Get auth token from localStorage
function getToken() {
  try {
    const stored = localStorage.getItem('ledger_auth')
    if (stored) {
      const { token } = JSON.parse(stored)
      return token
    }
  } catch {
    return null
  }
  return null
}

// Make API requests with auth header
async function request(method, endpoint, body = null) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const options = {
    method,
    headers,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options)
    const data = await response.json()

    if (!data.success && response.status === 401) {
      // Token expired or invalid, clear storage
      localStorage.removeItem('ledger_auth')
      window.location.href = '/login'
    }

    if (!data.success) {
      const errorMsg = data.message || 'API error'
      if (toastFn) toastFn(errorMsg, 'error') 
      throw new Error(data.message || 'API error')
    }

    return data
  } catch (error) {
    if (toastFn) toastFn(error.message, 'error')
    throw error
  }
}

// ==================== AUTH API ====================

export const authAPI = {
  // Signup new user
  async signup(name, email, password, passwordConfirm) {
    const response = await request('POST', '/auth/signup', {
      name,
      email,
      password,
      passwordConfirm,
    })
    return response
  },

  // Login user
  async login(email, password) {
    const response = await request('POST', '/auth/login', {
      email,
      password,
    })
    return response
  },

  // Get current user profile
  async getMe() {
    const response = await request('GET', '/auth/me')
    return response
  },
}

// ==================== PLAN API ====================

export const planAPI = {
  // Get all plans
  async getPlans() {
    const response = await request('GET', '/plans')
    return response.plans || []
  },

  // Get single plan
  async getPlan(id) {
    const response = await request('GET', `/plans/${id}`)
    return response.plan
  },

  // Create new plan
  async createPlan(name, points, recurring = true) {
    const response = await request('POST', '/plans', {
      name,
      points,
      recurring,
    })
    return response.plan
  },

  // Update plan (name or recurring status)
  async updatePlan(id, updates) {
    const response = await request('PATCH', `/plans/${id}`, updates)
    return response.plan
  },

  // Delete plan
  async deletePlan(id) {
    const response = await request('DELETE', `/plans/${id}`)
    return response
  },

  // Get daily stats and streak
  async getDailyStats() {
    const response = await request('GET', '/plans/stats/daily')
    return response.stats
  },
}

// ==================== POINT API ====================

export const pointAPI = {
  // Toggle point done status
  async togglePoint(planId, pointId) {
    const response = await request(
      'PATCH',
      `/plans/${planId}/points/${pointId}/toggle`,
    )
    return response.plan
  },

  // Add new point to plan
  async addPoint(planId, text) {
    const response = await request('POST', `/plans/${planId}/points`, {
      text,
    })
    return response.plan
  },

  // Remove point from plan
  async removePoint(planId, pointId) {
    const response = await request('DELETE', `/plans/${planId}/points/${pointId}`)
    return response.plan
  },
}

// ==================== COMBINED API ====================

export const api = {
  auth: authAPI,
  plans: planAPI,
  points: pointAPI,

  // Utility: clear auth on logout
  clearAuth() {
    localStorage.removeItem('ledger_auth')
  },

  // Utility: save auth on login/signup
  saveAuth(data) {
    localStorage.setItem('ledger_auth', JSON.stringify(data))
  },

  // Utility: get stored user
  getStoredUser() {
    try {
      const stored = localStorage.getItem('ledger_auth')
      if (stored) {
        return JSON.parse(stored).user
      }
    } catch {
      return null
    }
    return null
  },

  // Utility: get stored token
  getStoredToken() {
    return getToken()
  },
}
