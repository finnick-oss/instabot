import { useState } from 'react'
import { Plus, Trash2, Shuffle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import Toggle from './Toggle'

export default function CommentReplies({ config, onChange }) {
  const replies = config.comment_replies || ['Hey {name}! Check your DMs 👀']
  const enabled = config.comment_replies_enabled ?? true
  const [focused, setFocused] = useState(null)

  const update = (i, val) => {
    const next = [...replies]
    next[i] = val
    onChange({ comment_replies: next })
  }

  const add = () => onChange({ comment_replies: [...replies, ''] })
  const remove = (i) => {
    if (replies.length === 1) return
    onChange({ comment_replies: replies.filter((_, idx) => idx !== i) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Toggle row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderRadius: 12,
        background: '#0f0f0f', border: '1px solid #1a1a1a',
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: enabled ? '#fff' : '#555' }}>
            Public comment reply
          </div>
          <div style={{ fontSize: 12, color: '#444', marginTop: 2 }}>
            Reply under their comment to drive DM engagement
          </div>
        </div>
        <Toggle checked={enabled} onChange={v => onChange({ comment_replies_enabled: v })} />
      </div>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {/* Info pill */}
            {replies.length > 1 && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 20, alignSelf: 'flex-start',
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
              }}>
                <Shuffle size={11} color="#f59e0b" />
                <span style={{ fontSize: 11, color: '#f59e0b' }}>One reply picked at random per comment</span>
              </div>
            )}

            {replies.map((reply, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${focused === i ? 'rgba(124,58,237,0.4)' : '#1a1a1a'}`,
                  background: '#0f0f0f',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s',
                }}
              >
                <textarea
                  value={reply}
                  onChange={e => update(i, e.target.value)}
                  onFocus={() => setFocused(i)}
                  onBlur={() => setFocused(null)}
                  maxLength={500}
                  rows={3}
                  placeholder="Hey {name}! Check your DMs 👀"
                  style={{
                    width: '100%', background: 'transparent', border: 'none', outline: 'none',
                    padding: '14px 16px', fontSize: 14, color: '#fff',
                    resize: 'none', boxSizing: 'border-box', lineHeight: 1.6,
                    fontFamily: 'inherit',
                  }}
                />
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 16px', borderTop: '1px solid #151515',
                  background: '#0a0a0a',
                }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span
                      onClick={() => update(i, reply + '{name}')}
                      style={{
                        fontSize: 11, color: '#555', cursor: 'pointer', padding: '2px 8px',
                        borderRadius: 6, background: '#161616', border: '1px solid #1e1e1e',
                        userSelect: 'none',
                      }}
                    >
                      + {'{name}'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, color: '#333' }}>{reply.length} / 500</span>
                    {replies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#444', display: 'flex', padding: 2,
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.button
              type="button"
              whileHover={{ x: 2 }}
              onClick={add}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
                padding: '8px 14px', borderRadius: 9,
                background: 'transparent', border: '1px dashed #222',
                color: '#555', fontSize: 13, cursor: 'pointer',
              }}
            >
              <Plus size={14} /> Add variant reply
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
