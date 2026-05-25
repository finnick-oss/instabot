import { motion, AnimatePresence } from 'motion/react'
import { ExternalLink, Link2 } from 'lucide-react'
import Toggle from './Toggle'

const S = {
  label: { fontSize: 11, color: '#555', fontWeight: 500, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' },
  input: {
    width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: 10,
    padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s',
  },
}

export default function AdminValue({ config, onChange }) {
  const enabled = config.admin_value_enabled ?? true
  const url = config.admin_value || ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Toggle header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderRadius: 12,
        background: '#0f0f0f', border: '1px solid #1a1a1a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: enabled ? 'rgba(16,185,129,0.12)' : '#161616',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Link2 size={16} color={enabled ? '#10b981' : '#444'} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: enabled ? '#e5e5e5' : '#555' }}>Value delivery</div>
            <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>Link or resource sent after follow gate</div>
          </div>
        </div>
        <Toggle checked={enabled} onChange={v => onChange({ admin_value_enabled: v })} />
      </div>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {/* URL input */}
            <div>
              <label style={S.label}>Value URL</label>
              <div style={{ position: 'relative' }}>
                <input
                  value={url}
                  onChange={e => onChange({ admin_value: e.target.value })}
                  placeholder="https://your-guide.com or a discount code"
                  style={{ ...S.input, paddingRight: url ? 40 : 14 }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.4)'}
                  onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                />
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      color: '#555', display: 'flex',
                    }}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <p style={{ fontSize: 11, color: '#444', marginTop: 6 }}>
                Can be a URL, Gumroad link, Notion page, PDF, or any link you want to share.
              </p>
            </div>

            {/* Button label */}
            <div>
              <label style={S.label}>Button text</label>
              <input
                value={config.admin_value_button_label || 'Get Your Link'}
                onChange={e => onChange({ admin_value_button_label: e.target.value })}
                placeholder="Get Your Link"
                style={S.input}
                onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.4)'}
                onBlur={e => e.target.style.borderColor = '#1e1e1e'}
              />
            </div>

            {/* Preview */}
            {url && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  padding: '14px 16px', borderRadius: 12,
                  background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
                }}
              >
                <p style={{ fontSize: 11, color: '#555', marginBottom: 10 }}>Preview — what user receives:</p>
                <div style={{ fontSize: 13, color: '#aaa', marginBottom: 10, lineHeight: 1.5 }}>
                  {config.dm_sequence?.link_message || "Here's your exclusive link 🎁"}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 9,
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                  fontSize: 13, color: '#10b981', fontWeight: 500,
                }}>
                  <ExternalLink size={12} />
                  {config.admin_value_button_label || 'Get Your Link'}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
