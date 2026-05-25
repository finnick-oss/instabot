import { motion, AnimatePresence } from 'motion/react'
import { Link, UserPlus, Mail, MessageSquare, ChevronDown } from 'lucide-react'
import Toggle from './Toggle'
import { useState } from 'react'

const S = {
  input: {
    width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: 10,
    padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s',
  },
  textarea: {
    width: '100%', background: 'transparent', border: 'none', outline: 'none',
    padding: '14px 16px 8px', fontSize: 14, color: '#fff', resize: 'none',
    boxSizing: 'border-box', lineHeight: 1.6, fontFamily: 'inherit', minHeight: 80,
  },
  label: { fontSize: 11, color: '#555', fontWeight: 500, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' },
  hint: { fontSize: 11, color: '#444', marginTop: 6, lineHeight: 1.5 },
}

function DMBlock({ icon: Icon, title, subtitle, badge, badgeColor = '#8b5cf6', enabled, onToggle, children, accent }) {
  const color = accent || '#8b5cf6'
  return (
    <div style={{
      borderRadius: 14, border: `1px solid ${enabled ? `${color}22` : '#141414'}`,
      background: '#0c0c0c', overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Block header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: enabled && children ? '1px solid #141414' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: enabled ? `${color}18` : '#161616',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={16} color={enabled ? color : '#444'} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: enabled ? '#e5e5e5' : '#555' }}>{title}</span>
              {badge && (
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                  background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}30`,
                }}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{subtitle}</div>}
          </div>
        </div>
        <Toggle checked={enabled} onChange={onToggle} size="sm" />
      </div>

      {/* Block body */}
      <AnimatePresence>
        {enabled && children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '16px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TextBlock({ value, onChange, placeholder, hint, onAddName }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      borderRadius: 10, border: `1px solid ${focused ? 'rgba(124,58,237,0.35)' : '#1a1a1a'}`,
      background: '#111', overflow: 'hidden', transition: 'border-color 0.15s',
    }}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={3}
        style={S.textarea}
      />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px 10px', borderTop: '1px solid #161616',
      }}>
        <span
          onClick={onAddName}
          style={{
            fontSize: 11, color: '#555', cursor: 'pointer', padding: '2px 8px',
            borderRadius: 6, background: '#161616', border: '1px solid #1e1e1e',
            userSelect: 'none',
          }}
        >
          + {'{name}'}
        </span>
        {hint && <span style={{ fontSize: 11, color: '#333' }}>{hint}</span>}
      </div>
    </div>
  )
}

export default function DMSequence({ config, onChange }) {
  const dm = config.dm_sequence || {}
  const update = (key, val) => onChange({ dm_sequence: { ...dm, [key]: val } })

  const blocks = [
    {
      id: 'opening',
      icon: MessageSquare,
      title: 'Opening message',
      subtitle: 'First DM they receive after commenting',
      accent: '#8b5cf6',
      enabledKey: 'opening_enabled',
      content: (
        <TextBlock
          value={dm.opening_message || ''}
          onChange={v => update('opening_message', v)}
          placeholder="Hey {name}! Thanks for your comment 🙌"
          hint="{name} = their username"
          onAddName={() => update('opening_message', (dm.opening_message || '') + '{name}')}
        />
      ),
    },
    {
      id: 'follow_gate',
      icon: UserPlus,
      title: 'Follow gate',
      subtitle: 'Ask them to follow before unlocking the link',
      badge: 'Gate',
      badgeColor: '#f59e0b',
      accent: '#f59e0b',
      enabledKey: 'follow_gate_enabled',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextBlock
            value={dm.follow_gate_message || ''}
            onChange={v => update('follow_gate_message', v)}
            placeholder="Hey {name}! Follow us first to unlock your link 👇"
            onAddName={() => update('follow_gate_message', (dm.follow_gate_message || '') + '{name}')}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              flex: 1, padding: '8px 14px', borderRadius: 9,
              background: '#161616', border: '1px solid #222',
              fontSize: 12, color: '#777', textAlign: 'center',
            }}>
              👉 Follow Now
            </div>
            <div style={{
              flex: 1, padding: '8px 14px', borderRadius: 9,
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
              fontSize: 12, color: '#f59e0b', textAlign: 'center',
            }}>
              ✅ I Followed
            </div>
          </div>
          <p style={S.hint}>These buttons are added automatically to the message above.</p>
        </div>
      ),
    },
    {
      id: 'email',
      icon: Mail,
      title: 'Email capture',
      subtitle: 'Collect their email before sending the link',
      badge: 'Optional',
      badgeColor: '#ec4899',
      accent: '#ec4899',
      enabledKey: 'email_enabled',
      content: (
        <TextBlock
          value={dm.email_message || ''}
          onChange={v => update('email_message', v)}
          placeholder="Drop your email below and I'll send you the full guide 📩"
          hint="Reply saved automatically"
          onAddName={() => update('email_message', (dm.email_message || '') + '{name}')}
        />
      ),
    },
    {
      id: 'link',
      icon: Link,
      title: 'Link message',
      subtitle: 'Final DM with the button link',
      accent: '#10b981',
      enabledKey: 'link_enabled',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextBlock
            value={dm.link_message || ''}
            onChange={v => update('link_message', v)}
            placeholder="Here's your exclusive link 🎁"
            onAddName={() => update('link_message', (dm.link_message || '') + '{name}')}
          />
          <div>
            <label style={S.label}>Button label</label>
            <input
              value={dm.button_label || 'Get Your Link'}
              onChange={e => update('button_label', e.target.value)}
              placeholder="Get Your Link"
              style={S.input}
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Flow arrow connector */}
      {blocks.map((block, i) => (
        <div key={block.id}>
          <DMBlock
            icon={block.icon}
            title={block.title}
            subtitle={block.subtitle}
            badge={block.badge}
            badgeColor={block.badgeColor}
            accent={block.accent}
            enabled={dm[block.enabledKey] ?? (block.id !== 'email')}
            onToggle={v => update(block.enabledKey, v)}
          >
            {block.content}
          </DMBlock>
          {i < blocks.length - 1 && (dm[block.enabledKey] ?? true) && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
              <ChevronDown size={14} color="#222" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
