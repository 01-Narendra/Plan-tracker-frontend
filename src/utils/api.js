// API client for Ledger backend
// This file centralizes all API calls to the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ==================== Helper Functions ====================

function getHeaders(token) {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function handleResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }
  return data
}

// ==================== Auth Endpoints ====================

export async function apiSignup(name, email, password, passwordConfirm) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password, passwordConfirm }),
  })
  return handleResponse(response)
}

export async function apiLogin(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  })
  return handleResponse(response)
}

export async function apiGetMe(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getHeaders(token),
  })
  return handleResponse(response)
}

// ==================== Plan Endpoints ====================

export async function apiGetPlans(token) {
  const response = await fetch(`${API_BASE_URL}/plans`, {
    method: 'GET',
    headers: getHeaders(token),
  })
  const data = await handleResponse(response)
  return data.plans
}

export async function apiGetPlan(token, planId) {
  const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
    method: 'GET',
    headers: getHeaders(token),
  })
  const data = await handleResponse(response)
  return data.plan
}

export async function apiCreatePlan(token, { name, points, recurring = true }) {
  const response = await fetch(`${API_BASE_URL}/plans`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ name, points, recurring }),
  })
  const data = await handleResponse(response)
  return data.plan
}

export async function apiUpdatePlan(token, planId, { name, recurring }) {
  const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify({ name, recurring }),
  })
  const data = await handleResponse(response)
  return data.plan
}

export async function apiDeletePlan(token, planId) {
  const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  })
  return handleResponse(response)
}

// ==================== Point Endpoints ====================

export async function apiTogglePoint(token, planId, pointId) {
  const response = await fetch(
    `${API_BASE_URL}/plans/${planId}/points/${pointId}/toggle`,
    {
      method: 'PATCH',
      headers: getHeaders(token),
    }
  )
  const data = await handleResponse(response)
  return data.plan
}

export async function apiAddPoint(token, planId, text) {
  const response = await fetch(`${API_BASE_URL}/plans/${planId}/points`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ text }),
  })
  const data = await handleResponse(response)
  return data.plan
}

export async function apiRemovePoint(token, planId, pointId) {
  const response = await fetch(`${API_BASE_URL}/plans/${planId}/points/${pointId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  })
  const data = await handleResponse(response)
  return data.plan
}

// ==================== Stats Endpoints ====================

export async function apiGetDailyStats(token) {
  const response = await fetch(`${API_BASE_URL}/plans/stats/daily`, {
    method: 'GET',
    headers: getHeaders(token),
  })
  const data = await handleResponse(response)
  return data.stats
}

// ==================== Utility Functions ====================

// Helper to calculate completion percentage
export function calcPercentage(points) {
  if (!points || points.length === 0) return 0
  const done = points.filter((p) => p.done).length
  return Math.round((done / points.length) * 100)
}

// Helper to determine if yesterday was 100% completed
export function completedYesterday(plan) {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const y = yesterday.toISOString().slice(0, 10)
  const entry = (plan.history || []).find((h) => h.date === y)
  return !!entry && entry.percentage === 100
}

// Helper to determine trend direction
export function trendDirection(plan) {
  const history = plan.history || []
  if (history.length < 2) return 'flat'
  const last = history[history.length - 1].percentage
  const prev = history[history.length - 2].percentage
  if (last > prev) return 'up'
  if (last < prev) return 'down'
  return 'flat'
}
