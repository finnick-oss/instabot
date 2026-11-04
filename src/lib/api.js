import axios from 'axios'

// Dev talks to the local backend; production builds use VITE_API_URL or the hosted backend
export const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : 'https://autoreplyagent.netlify.app')).replace(/\/$/, '')

const SESSION_KEY = 'instabot_session'

function readSession() {
  try { return localStorage.getItem(SESSION_KEY) } catch { return null }
}

let sessionToken = readSession()
let onUnauthorized = () => {}

const http = axios.create({ baseURL: API_URL, timeout: 15000 })
http.interceptors.request.use(config => {
  if (sessionToken) config.headers.Authorization = `Bearer ${sessionToken}`
  return config
})
http.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && sessionToken) {
      setSession(null)
      onUnauthorized()
    }
    return Promise.reject(err)
  }
)

export function setSession(token) {
  sessionToken = token
  try {
    if (token) localStorage.setItem(SESSION_KEY, token)
    else localStorage.removeItem(SESSION_KEY)
  } catch { /* storage unavailable (private mode) — session lasts for this tab only */ }
}

export const hasSession = () => !!sessionToken

const errorMessage = (e) => e.response?.data?.error || e.message

export const api = {
  onUnauthorized(handler) { onUnauthorized = handler },

  // Full-page redirect to Facebook Login for Business, or to Instagram Login with provider 'instagram';
  // the backend sends the user back with #session=…
  loginUrl(provider = 'facebook') {
    const returnTo = window.location.origin + window.location.pathname
    const path = provider === 'instagram' ? '/api/auth/instagram/login' : '/api/auth/login'
    return `${API_URL}${path}?return_to=${encodeURIComponent(returnTo)}`
  },

  async me() {
    const res = await http.get('/api/me')
    return res.data
  },

  async logout() {
    try { await http.post('/api/auth/logout') } catch { /* sign out locally even if the server is unreachable */ }
    setSession(null)
  },

  async accountStatus() {
    try {
      const res = await http.get('/api/account/status')
      return res.data
    } catch {
      return null
    }
  },

  async resubscribe() {
    try {
      const res = await http.post('/api/account/subscribe')
      return res.data
    } catch (e) {
      return { ok: false, error: errorMessage(e) }
    }
  },

  async disconnect() {
    await http.delete('/api/account')
    setSession(null)
  },

  async fetchPosts() {
    try {
      const res = await http.get('/api/posts')
      return res.data?.posts || []
    } catch (err) {
      console.warn('fetchPosts failed:', errorMessage(err))
      return []
    }
  },

  async fetchStats() {
    try {
      const res = await http.get('/api/stats')
      return res.data
    } catch {
      return { comments_replied: 0, dms_sent: 0, clicks: 0, followers_gained: 0, emails_saved: 0 }
    }
  },

  async fetchAutomations() {
    try {
      const res = await http.get('/api/automations')
      return res.data || []
    } catch {
      return []
    }
  },

  async saveAutomation(automation) {
    try {
      const res = await http.put(`/api/automations/${encodeURIComponent(automation.id)}`, automation)
      return { success: true, data: res.data }
    } catch (e) {
      return { success: false, error: errorMessage(e) }
    }
  },

  async deleteAutomation(id) {
    try {
      await http.delete(`/api/automations/${encodeURIComponent(id)}`)
      return { success: true }
    } catch (e) {
      return { success: false, error: errorMessage(e) }
    }
  },

  async syncPosts() {
    try {
      const res = await http.post('/api/sync', {})
      return res.data
    } catch (e) {
      return { success: false, error: errorMessage(e) }
    }
  },

  async checkHealth() {
    try {
      const res = await http.get('/api/health', { timeout: 5000 })
      return res.data
    } catch {
      return { ok: false }
    }
  }
}
