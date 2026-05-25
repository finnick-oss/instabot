import { motion, AnimatePresence } from 'motion/react'
import { Plus, MessageCircle, Send, MousePointerClick, UserPlus, Mail, Zap, Trash2, Edit3, Activity } from 'lucide-react'
import Footer from '../components/Footer'

const STAT_CARDS = [
  { key: 'comments_replied', label: 'Replies', icon: MessageCircle, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  { key: 'dms_sent', label: 'DMs Sent', icon: Send, color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
  { key: 'clicks', label: 'Link Clicks', icon: MousePointerClick, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
  { key: 'followers_gained', label: 'New Followers', icon: UserPlus, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { key: 'emails_saved', label: 'Emails', icon: Mail, color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
]

function StatCard({ stat, value, index }) {
  const Icon = stat.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: '#0f0f0f',
        border: '1px solid #1a1a1a',
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={stat.color} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value ?? 0}</div>
        <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{stat.label}</div>
      </div>
    </motion.div>
  )
}

function AutomationCard({ automation, onEdit, onDelete, onToggle, index }) {
  const isActive = automation.active

  const flowSteps = []
  if (automation.comment_replies_enabled) flowSteps.push('Comment Reply')
  if (automation.dm_sequence?.opening_enabled) flowSteps.push('Opening DM')
  if (automation.dm_sequence?.follow_gate_enabled) flowSteps.push('Follow Gate')
  if (automation.admin_value_enabled && automation.admin_value) flowSteps.push('Value Link')

  const postLabel =
    automation.post_target === 'any' ? 'Any post/reel' :
    automation.post_target === 'next' ? 'Next post/reel' :
    `${(automation.selected_posts || []).length} post(s) selected`

  const keywordLabel = automation.keywords?.length > 0
    ? automation.keywords.slice(0, 3).join(', ') + (automation.keywords.length > 3 ? '…' : '')
    : 'Any comment'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2 }}
      style={{
        background: '#0f0f0f',
        border: `1px solid ${isActive ? 'rgba(139,92,246,0.25)' : '#1a1a1a'}`,
        borderRadius: 20,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
        boxShadow: isActive ? '0 0 0 1px rgba(139,92,246,0.1)' : 'none',
      }}
    >
      {/* Card header */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: isActive ? 'rgba(139,92,246,0.15)' : '#1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Zap size={18} color={isActive ? '#8b5cf6' : '#444'} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {automation.name}
            </div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 3 }}>{postLabel} · {keywordLabel}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Active badge */}
          <motion.div
            animate={{ opacity: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 20,
              background: isActive ? 'rgba(34,197,94,0.1)' : '#1a1a1a',
              border: `1px solid ${isActive ? 'rgba(34,197,94,0.25)' : '#252525'}`,
            }}
          >
            {isActive && (
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}
              />
            )}
            <span style={{ fontSize: 11, color: isActive ? '#22c55e' : '#555', fontWeight: 500 }}>
              {isActive ? 'Live' : 'Inactive'}
            </span>
          </motion.div>

          {/* Toggle */}
          <button
            type="button"
            onClick={() => onToggle(automation)}
            style={{
              width: 40, height: 22, borderRadius: 11,
              background: isActive ? '#7c3aed' : '#1e1e1e',
              border: `1px solid ${isActive ? '#7c3aed' : '#2a2a2a'}`,
              cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0
            }}
          >
            <motion.span
              animate={{ x: isActive ? 19 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', display: 'block' }}
            />
          </button>
        </div>
      </div>

      {/* Flow steps */}
      {flowSteps.length > 0 && (
        <div style={{ padding: '0 24px 16px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {flowSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20,
                background: '#161616', border: '1px solid #222', color: '#888'
              }}>{step}</span>
              {i < flowSteps.length - 1 && (
                <span style={{ fontSize: 10, color: '#333' }}>→</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Card footer */}
      <div style={{ padding: '14px 24px', borderTop: '1px solid #141414', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, color: '#444' }}>
          {automation.updated_at
            ? `Updated ${new Date(automation.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
            : 'Just created'}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onEdit(automation)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 8,
              background: '#161616', border: '1px solid #222',
              color: '#888', fontSize: 12, cursor: 'pointer'
            }}
          >
            <Edit3 size={12} /> Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onDelete(automation.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 8,
              background: '#161616', border: '1px solid #222',
              color: '#555', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s'
            }}
          >
            <Trash2 size={12} /> Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Dashboard({ automations, stats, onCreateNew, onEdit, onDelete, onToggleActive, onPrivacy }) {
  const activeCount = automations.filter(a => a.active).length

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #141414',
        padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>InstaBot</span>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#1a1a1a', color: '#555', border: '1px solid #222' }}>
            Dashboard
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {activeCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}
              />
              <span style={{ fontSize: 12, color: '#22c55e' }}>{activeCount} automation{activeCount > 1 ? 's' : ''} live</span>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.02, background: '#6d28d9' }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onCreateNew}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 10,
              background: '#7c3aed', border: 'none',
              color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer'
            }}
          >
            <Plus size={15} /> Create Auto DM
          </motion.button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 32px', flex: 1, width: '100%' }}>

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 32 }}
        >
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>Automations</h1>
          <p style={{ fontSize: 14, color: '#555', marginTop: 6 }}>
            Auto-reply to comments and DM your audience on Instagram
          </p>
        </motion.div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          {STAT_CARDS.map((stat, i) => (
            <StatCard key={stat.key} stat={stat} value={stats[stat.key]} index={i} />
          ))}
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={14} color="#555" />
            <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>
              {automations.length} automation{automations.length !== 1 ? 's' : ''}
            </span>
          </div>
          {automations.length > 0 && (
            <span style={{ fontSize: 12, color: '#444' }}>
              {activeCount} active · {automations.length - activeCount} inactive
            </span>
          )}
        </div>

        {/* Automation cards */}
        <AnimatePresence>
          {automations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center', padding: '80px 40px',
                background: '#0f0f0f', border: '1px dashed #1e1e1e',
                borderRadius: 20
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#161616', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Zap size={24} color="#333" />
              </div>
              <p style={{ fontSize: 15, color: '#444', marginBottom: 6 }}>No automations yet</p>
              <p style={{ fontSize: 13, color: '#333', marginBottom: 24 }}>Create your first Auto DM to start converting comments into conversations</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onCreateNew}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 10,
                  background: '#7c3aed', border: 'none',
                  color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer'
                }}
              >
                <Plus size={16} /> Create Auto DM
              </motion.button>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {automations.map((automation, i) => (
                <AutomationCard
                  key={automation.id || i}
                  automation={automation}
                  index={i}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggle={onToggleActive}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Bottom CTA if has automations */}
        {automations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginTop: 20, textAlign: 'center' }}
          >
            <button
              type="button"
              onClick={onCreateNew}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 10,
                background: 'transparent', border: '1px solid #1e1e1e',
                color: '#555', fontSize: 13, cursor: 'pointer'
              }}
            >
              <Plus size={13} /> Add another automation
            </button>
          </motion.div>
        )}
      </main>
      <Footer onPrivacy={onPrivacy} />
    </div>
  )
}
