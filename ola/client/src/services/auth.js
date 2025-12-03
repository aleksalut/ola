import api from './api'

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  if (data?.token) localStorage.setItem('token', data.token)
  return data
}

export async function register(payloadOrEmail, password) {
  // Backward compatibility: allow register(email, password)
  const payload = typeof payloadOrEmail === 'string'
    ? { email: payloadOrEmail, password }
    : payloadOrEmail
  const { data } = await api.post('/auth/register', payload)
  return data
}

export function logout() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

export function isAuthenticated() {
  return !!localStorage.getItem('token')
}
