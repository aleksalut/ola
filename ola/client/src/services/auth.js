import api from './api'

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  if (data?.token) {
    localStorage.setItem('token', data.token)
    
    // Decode token and store user info including roles
    const payload = decodeToken(data.token)
    if (payload) {
      const roles = []
      // JWT roles can be stored as single value or array
      if (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
        const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        if (Array.isArray(roleClaim)) {
          roles.push(...roleClaim)
        } else {
          roles.push(roleClaim)
        }
      }
      
      const userInfo = {
        id: payload.sub || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email,
        username: payload.unique_name,
        roles: roles
      }
      localStorage.setItem('user', JSON.stringify(userInfo))
    }
  }
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
  localStorage.removeItem('user')
  window.location.href = '/login'
}

export function isAuthenticated() {
  return !!localStorage.getItem('token')
}

export function getCurrentUser() {
  try {
    const userJson = localStorage.getItem('user')
    return userJson ? JSON.parse(userJson) : null
  } catch {
    return null
  }
}

export function hasRole(role) {
  const user = getCurrentUser()
  return user?.roles?.includes(role) || false
}
