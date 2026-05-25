import { X, Plus, Hash, Globe } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const S = {
  label: { fontSize: 12, color: '#888', fontWeight: 500, display: 'block', marginBottom: 8 },
  input: {
    width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: 10,
    padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
  },
}

export default function KeywordFilter({ config, onChange }) {
  const mode = config.keyword_mode || 'any'
  const keywords = config.keywords || []
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)

  const addKeyword = () => {
    const kw = input.trim().toLowerCase()
    if (!kw || keywords.includes(kw)) return
    onChange({ keywords: [...keywords, kw] })
    setInput('')
  }

  const removeKeyword = (kw) => onChange({ keywords: keywords.filter(k => k !== kw) })

  const options = [
    { key: 'any', label: 'Any comment', sub: 'Trigger on every comment', icon: Globe },
    { key: 'specific', label: 'Specific keyword', sub: 'Only trigger when keyword matches', icon: Hash },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Mode selector */}
      <div>
        <label style={S.label}>Trigger when comment</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {options.map(({ key, label, sub, icon: Icon }) => {
            const active = mode === key
            return (
              <motion.button
                key={key}
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange({ keyword_mode: key })}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 16px', borderRadius: 12, border: `1px solid ${active ? 'rgba(124,58,237,0.5)' : '#1e1e1e'}`,
                  background: active ? 'rgba(124,58,237,0.08)' : '#0f0f0f',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0, marginTop: 1,
                  background: active ? 'rgba(124,58,237,0.2)' : '#161616',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={15} color={active ? '#8b5cf6' : '#555'} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: active ? '#fff' : '#777' }}>{label}</div>
                  <div style={{ fontSize: 11, color: active ? '#8b5cf6' : '#444', marginTop: 2 }}>{sub}</div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Keyword input */}
      <AnimatePresence>
        {mode === 'specific' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <label style={S.label}>Keywords</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addKeyword()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="e.g. GUIDE, FREE, INFO"
                style={{ ...S.input, flex: 1, borderColor: focused ? 'rgba(124,58,237,0.5)' : '#1e1e1e' }}
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addKeyword}
                style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: '#7c3aed', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Plus size={16} color="#fff" />
              </motion.button>
            </div>

            {keywords.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <AnimatePresence>
                  {keywords.map(kw => (
                    <motion.span
                      key={kw}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 20,
                        background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
                        fontSize: 12, color: '#a78bfa', fontWeight: 500,
                      }}
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => removeKeyword(kw)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#7c3aed' }}
                      >
                        <X size={11} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <p style={{ fontSize: 11, color: '#444', marginTop: 10 }}>
              Press Enter or click + to add. Automation triggers when comment contains any keyword (case-insensitive).
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
