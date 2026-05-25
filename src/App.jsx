import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Dashboard from './screens/Dashboard'
import AutomationBuilder from './screens/AutomationBuilder'
import PrivacyPolicy from './screens/PrivacyPolicy'
import { api } from './lib/api'

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

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const [editingConfig, setEditingConfig] = useState(null)
  const [automations, setAutomations] = useState([])
  const [stats, setStats] = useState({ comments_replied: 0, dms_sent: 0, clicks: 0, followers_gained: 0, emails_saved: 0 })
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api.fetchStats().then(setStats)
    api.fetchPosts().then(setPosts)
    api.fetchConfig().then(saved => {
      if (saved && saved.name) setAutomations([{ ...saved, id: saved.id || '1' }])
    })
  }, [])

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

  const handleDelete = (id) => setAutomations(prev => prev.filter(a => a.id !== id))

  const handleToggleActive = async (automation) => {
    const updated = { ...automation, active: !automation.active }
    await api.saveConfig(updated)
    setAutomations(prev => prev.map(a => a.id === automation.id ? updated : a))
  }

  const variants = {
    initial: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    animate: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <AnimatePresence mode="wait">
        {screen === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <Dashboard
              automations={automations}
              stats={stats}
              onCreateNew={openCreate}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onPrivacy={() => setScreen('privacy')}
            />
          </motion.div>
        )}
        {screen === 'builder' && (
          <motion.div key="builder" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <AutomationBuilder
              initialConfig={editingConfig}
              posts={posts}
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
