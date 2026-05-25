import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle, Zap, MessageCircle, Send, UserPlus, Link2, ChevronRight } from 'lucide-react'
import Footer from '../components/Footer'
import PostSelector from '../components/PostSelector'
import KeywordFilter from '../components/KeywordFilter'
import CommentReplies from '../components/CommentReplies'
import DMSequence from '../components/DMSequence'
import AdminValue from '../components/AdminValue'
import Toggle from '../components/Toggle'
import { api } from '../lib/api'

const STEPS = [
  { id: 'trigger', label: 'Trigger', icon: Zap, desc: 'When someone comments on' },
  { id: 'filter', label: 'Filter', icon: MessageCircle, desc: 'Comment has keyword' },
  { id: 'reply', label: 'Reply', icon: MessageCircle, desc: 'Public comment reply' },
  { id: 'dm', label: 'DM Sequence', icon: Send, desc: 'Messages they receive' },
  { id: 'value', label: 'Value', icon: Link2, desc: 'Link or resource' },
]

function StepNav({ activeStep, onStep, config }) {
  const completedMap = {
    trigger: config.post_target !== undefined,
    filter: true,
    reply: config.comment_replies_enabled,
    dm: config.dm_sequence?.opening_enabled,
    value: !!(config.admin_value_enabled && config.admin_value),
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const isActive = activeStep === step.id
        const isDone = completedMap[step.id]
        return (
          <motion.button
            key={step.id}
            type="button"
            onClick={() => onStep(step.id)}
            whileHover={{ x: 2 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
              background: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: isActive ? 'rgba(124,58,237,0.2)' : '#161616',
              border: `1px solid ${isActive ? 'rgba(124,58,237,0.4)' : '#1e1e1e'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={14} color={isActive ? '#8b5cf6' : '#555'} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: isActive ? '#fff' : '#666' }}>{step.label}</div>
              <div style={{ fontSize: 11, color: '#444', marginTop: 1 }}>{step.desc}</div>
            </div>
            {isActive && <ChevronRight size={14} color="#8b5cf6" />}
          </motion.button>
        )
      })}
    </div>
  )
}

function FlowPreview({ config }) {
  const steps = []
  if (config.comment_replies_enabled) steps.push({ label: 'Comment Reply', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' })
  if (config.dm_sequence?.opening_enabled) steps.push({ label: 'Opening DM', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' })
  if (config.dm_sequence?.follow_gate_enabled) steps.push({ label: 'Follow Gate', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' })
  if (config.dm_sequence?.email_enabled) steps.push({ label: 'Email Capture', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' })
  if (config.admin_value_enabled && config.admin_value) steps.push({ label: 'Value Link', color: '#10b981', bg: 'rgba(16,185,129,0.1)' })

  if (steps.length === 0) return null

  return (
    <div style={{ padding: '16px', background: '#0a0a0a', borderRadius: 12, border: '1px solid #161616' }}>
      <div style={{ fontSize: 11, color: '#444', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Flow Preview</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && (
              <div style={{ position: 'absolute', left: 22, width: 1, height: 10, background: '#1e1e1e' }} />
            )}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', borderRadius: 8,
              background: step.bg, border: `1px solid ${step.color}22`, flex: 1
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: step.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: step.color, fontWeight: 500 }}>{step.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const STEP_CONTENT = {
  trigger: ({ config, onChange, posts, syncing, onSync }) => (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>When someone comments on</h2>
      <p style={{ fontSize: 13, color: '#555', marginBottom: 24 }}>Choose which posts or reels trigger this automation</p>
      <PostSelector posts={posts} config={config} onChange={onChange} onSync={onSync} syncing={syncing} />
    </div>
  ),
  filter: ({ config, onChange }) => (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Filter by keyword</h2>
      <p style={{ fontSize: 13, color: '#555', marginBottom: 24 }}>Only trigger when the comment contains specific words</p>
      <KeywordFilter config={config} onChange={onChange} />
    </div>
  ),
  reply: ({ config, onChange }) => (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Public comment reply</h2>
      <p style={{ fontSize: 13, color: '#555', marginBottom: 24 }}>Reply publicly under their comment to drive DM engagement</p>
      <CommentReplies config={config} onChange={onChange} />
    </div>
  ),
  dm: ({ config, onChange }) => (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>DM Sequence</h2>
      <p style={{ fontSize: 13, color: '#555', marginBottom: 24 }}>Design the messages they receive in their DMs</p>
      <DMSequence config={config} onChange={onChange} />
    </div>
  ),
  value: ({ config, onChange }) => (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Value delivery</h2>
      <p style={{ fontSize: 13, color: '#555', marginBottom: 24 }}>The link or resource you send after they follow</p>
      <AdminValue config={config} onChange={onChange} />
    </div>
  ),
}

export default function AutomationBuilder({ initialConfig, posts, onBack, onSaved, onPrivacy }) {
  const [config, setConfig] = useState(initialConfig)
  const [activeStep, setActiveStep] = useState('trigger')
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [syncing, setSyncing] = useState(false)

  const updateConfig = useCallback((patch) => {
    setConfig(prev => ({ ...prev, ...patch }))
  }, [])

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSaveStatus(null)
    const result = await api.saveConfig(config)
    setSaving(false)
    if (result.success) {
      setSaveStatus('success')
      onSaved(config)
      setTimeout(() => setSaveStatus(null), 2500)
    } else {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    await api.syncPosts()
    setSyncing(false)
  }

  const StepContent = STEP_CONTENT[activeStep]
  const stepIndex = STEPS.findIndex(s => s.id === activeStep)

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #141414',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
          <motion.button
            whileHover={{ x: -2 }}
            type="button"
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 10px', borderRadius: 8,
              background: 'transparent', border: '1px solid #1e1e1e',
              color: '#666', fontSize: 13, cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} /> Back
          </motion.button>

          <div style={{ width: 1, height: 20, background: '#1e1e1e' }} />

          <input
            value={config.name}
            onChange={(e) => updateConfig({ name: e.target.value })}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: 15, fontWeight: 600, flex: 1, minWidth: 0
            }}
          />

          <div style={{
            fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
            background: config.active ? 'rgba(34,197,94,0.1)' : '#161616',
            border: `1px solid ${config.active ? 'rgba(34,197,94,0.25)' : '#252525'}`,
            color: config.active ? '#22c55e' : '#555', flexShrink: 0
          }}>
            {config.active ? 'Live' : 'Draft'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <AnimatePresence>
            {saveStatus === 'success' && (
              <motion.span
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#22c55e' }}
              >
                <CheckCircle2 size={13} /> Saved
              </motion.span>
            )}
            {saveStatus === 'error' && (
              <motion.span
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#ef4444' }}
              >
                <AlertCircle size={13} /> Failed
              </motion.span>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', borderLeft: '1px solid #1a1a1a' }}>
            <span style={{ fontSize: 12, color: '#555' }}>{config.active ? 'Active' : 'Inactive'}</span>
            <Toggle checked={config.active} onChange={(v) => updateConfig({ active: v })} size="sm" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, background: '#6d28d9' }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 9,
              background: '#7c3aed', border: 'none',
              color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
            {saving ? 'Saving…' : 'Save & Activate'}
          </motion.button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* Left sidebar — steps */}
        <aside style={{
          width: 220, flexShrink: 0,
          borderRight: '1px solid #111',
          padding: '24px 12px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: 11, color: '#444', marginBottom: 12, paddingLeft: 14, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Setup Steps
          </div>
          <StepNav activeStep={activeStep} onStep={setActiveStep} config={config} />

          <div style={{ marginTop: 24, padding: '0 2px' }}>
            <FlowPreview config={config} />
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '40px 48px', maxWidth: 700 }}>

          {/* Step progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
            {STEPS.map((step, i) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <motion.div
                  animate={{
                    background: i === stepIndex ? '#7c3aed' : i < stepIndex ? '#4c1d95' : '#161616',
                    borderColor: i === stepIndex ? '#7c3aed' : i < stepIndex ? '#4c1d95' : '#252525',
                  }}
                  style={{
                    width: 28, height: 28, borderRadius: '50%', border: '1px solid',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600,
                    color: i <= stepIndex ? '#fff' : '#444',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveStep(step.id)}
                >
                  {i < stepIndex ? '✓' : i + 1}
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 32, height: 1, background: i < stepIndex ? '#4c1d95' : '#1a1a1a' }} />
                )}
              </div>
            ))}
            <span style={{ marginLeft: 8, fontSize: 12, color: '#555' }}>
              Step {stepIndex + 1} of {STEPS.length} — {STEPS[stepIndex].label}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {StepContent && (
                <StepContent
                  config={config}
                  onChange={updateConfig}
                  posts={posts}
                  syncing={syncing}
                  onSync={handleSync}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Step navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 24, borderTop: '1px solid #111' }}>
            <button
              type="button"
              onClick={() => stepIndex > 0 && setActiveStep(STEPS[stepIndex - 1].id)}
              disabled={stepIndex === 0}
              style={{
                padding: '8px 16px', borderRadius: 9, border: '1px solid #1e1e1e',
                background: 'transparent', color: stepIndex === 0 ? '#333' : '#777',
                fontSize: 13, cursor: stepIndex === 0 ? 'default' : 'pointer'
              }}
            >
              ← Previous
            </button>

            {stepIndex < STEPS.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setActiveStep(STEPS[stepIndex + 1].id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px', borderRadius: 9,
                  background: '#161616', border: '1px solid #252525',
                  color: '#fff', fontSize: 13, cursor: 'pointer'
                }}
              >
                Next: {STEPS[stepIndex + 1].label} →
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, background: '#6d28d9' }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px', borderRadius: 9,
                  background: '#7c3aed', border: 'none',
                  color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer'
                }}
              >
                {saving ? <Loader2 size={13} /> : <Save size={13} />}
                {saving ? 'Saving…' : 'Save & Activate'}
              </motion.button>
            )}
          </div>
        </main>
      </div>
      <Footer onPrivacy={onPrivacy} />
    </div>
  )
}
