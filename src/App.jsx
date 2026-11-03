import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Dashboard from './screens/Dashboard'
import AutomationBuilder from './screens/AutomationBuilder'
import PrivacyPolicy from './screens/PrivacyPolicy'
import Login from './screens/Login'
import { api, setSession, hasSession } from './lib/api'

export const DEFAULT_CONFIG = {
  id: null,
  name: 'New Automation',
  active: false,
  post_target: 'any',
  selected_posts: [],
  keyword_mode: 'any',
  keywords: [],
  comment_replies_enabled: true,
  comment_replies: ['Hey {name}! Check your DMs 👀'],
  dm_sequence: {
    opening_enabled: true,
    opening_message: 'Hey {name}! Thanks so much for your comment 🙌',
    follow_gate_enabled: true,
    follow_gate_message: "Hey {name}! To get your exclusive link, follow us first 👇",
    email_enabled: false,
    email_message: "Drop your email and I'll send you the full guide 📩",
    link_enabled: true,
    link_message: "Here's your exclusive link 🎁",
    button_label: 'Get Your Link',
  },
  admin_value: '',
  admin_value_button_label: 'Get Your Link',
  admin_value_enabled: true,
}

// Pick up #session=… / #auth_error=… that the backend appends after Facebook login
function consumeAuthFragment() {
  const params = new URLSearchParams(window.location.hash.slice(1))
  const session = params.get('session')
  const error = params.get('auth_error')
  // Netlify forwards the callback's query string (?code&state) on the redirect, so drop it too
  if (session || error) window.history.replaceState(null, '', window.location.pathname)
  if (session) setSession(session)
  return error
}

const EMPTY_STATS = { comments_replied: 0, dms_sent: 0, clicks: 0, followers_gained: 0, emails_saved: 0 }

export default function App() {
  const [authError, setAuthError] = useState(consumeAuthFragment)
  const [account, setAccount] = useState(null)
  const [authChecked, setAuthChecked] = useState(!hasSession())
  const [screen, setScreen] = useState('dashboard')
  const [editingConfig, setEditingConfig] = useState(null)
  const [automations, setAutomations] = useState([])
  const [stats, setStats] = useState(EMPTY_STATS)
  const [posts, setPosts] = useState([])
  const [webhook, setWebhook] = useState(null)

  const signOut = useCallback(() => {
    setAccount(null)
    setAutomations([])
    setStats(EMPTY_STATS)
    setPosts([])
    setWebhook(null)
    setScreen('dashboard')
  }, [])

  useEffect(() => {
    api.onUnauthorized(() => {
      signOut()
      setAuthError('Your session expired. Please connect again.')
    })
    if (!hasSession()) return
    api.me()
      .then(me => { setAccount(me); setAuthError(null) })
      .catch(() => {})
      .finally(() => setAuthChecked(true))
  }, [signOut])

  useEffect(() => {
    if (!account) return
    api.fetchStats().then(setStats)
    api.fetchPosts().then(setPosts)
    api.fetchAutomations().then(setAutomations)
    api.accountStatus().then(status => setWebhook(status?.webhook || null))
  }, [account])

  const handleLogout = async () => {
    await api.logout()
    signOut()
  }

  const handleResubscribe = async () => {
    await api.resubscribe()
    const status = await api.accountStatus()
    setWebhook(status?.webhook || null)
  }

  const handleSyncPosts = async () => {
    const result = await api.syncPosts()
    if (result?.posts) setPosts(result.posts)
  }

  const openCreate = () => {
    setEditingConfig({ ...DEFAULT_CONFIG, id: Date.now().toString() })
    setScreen('builder')
  }

  const openEdit = (automation) => {
    setEditingConfig(automation)
    setScreen('builder')
  }

  const handleSaved = (config) => {
    setAutomations(prev => {
      const exists = prev.find(a => a.id === config.id)
      return exists ? prev.map(a => a.id === config.id ? config : a) : [...prev, config]
    })
    api.fetchStats().then(setStats)
  }

  const handleDelete = async (id) => {
    const result = await api.deleteAutomation(id)
    if (result.success) setAutomations(prev => prev.filter(a => a.id !== id))
  }

  const handleToggleActive = async (automation) => {
    const updated = { ...automation, active: !automation.active }
    const result = await api.saveAutomation(updated)
    if (result.success) setAutomations(prev => prev.map(a => a.id === automation.id ? updated : a))
  }

  if (!authChecked) return <div style={{ minHeight: '100vh', background: '#080808' }} />

  if (!account) {
    return screen === 'privacy'
      ? <PrivacyPolicy onBack={() => setScreen('dashboard')} />
      : <Login error={authError} onPrivacy={() => setScreen('privacy')} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <AnimatePresence mode="wait">
        {screen === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <Dashboard
              account={account}
              webhook={webhook}
              automations={automations}
              stats={stats}
              onCreateNew={openCreate}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onLogout={handleLogout}
              onResubscribe={handleResubscribe}
              onPrivacy={() => setScreen('privacy')}
            />
          </motion.div>
        )}
        {screen === 'builder' && (
          <motion.div key="builder" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <AutomationBuilder
              initialConfig={editingConfig}
              posts={posts}
              onSyncPosts={handleSyncPosts}
              onBack={() => setScreen('dashboard')}
              onSaved={handleSaved}
              onPrivacy={() => setScreen('privacy')}
            />
          </motion.div>
        )}
        {screen === 'privacy' && (
          <motion.div key="privacy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.22 }}>
            <PrivacyPolicy onBack={() => setScreen('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
