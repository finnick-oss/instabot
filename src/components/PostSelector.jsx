import { useState } from 'react'
import { Image, Film, RefreshCw, Globe, Zap, LayoutGrid } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const TARGET_OPTIONS = [
  { key: 'any', icon: Globe, label: 'Any Post / Reel', sub: 'Trigger on all your content', color: '#8b5cf6' },
  { key: 'next', icon: Zap, label: 'Next Post / Reel', sub: 'Only your upcoming post', color: '#06b6d4' },
  { key: 'specific', icon: LayoutGrid, label: 'Specific Posts', sub: 'Choose from your content', color: '#10b981' },
]

export default function PostSelector({ posts, config, onChange, onSync, syncing }) {
  const [showAll, setShowAll] = useState(false)
  const postTarget = config.post_target || 'any'
  const visible = showAll ? posts : posts.slice(0, 6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Target selector cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {TARGET_OPTIONS.map(({ key, icon: Icon, label, sub, color }) => {
          const active = postTarget === key
          return (
            <motion.button
              key={key}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange({ post_target: key, selected_posts: [] })}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
                padding: '14px', borderRadius: 14, border: `1px solid ${active ? `${color}44` : '#1a1a1a'}`,
                background: active ? `${color}0d` : '#0f0f0f',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', outline: 'none',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: active ? `${color}1a` : '#161616',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
              }}>
                <Icon size={16} color={active ? color : '#444'} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: active ? '#fff' : '#666', lineHeight: 1.2 }}>{label}</div>
                <div style={{ fontSize: 11, color: active ? color : '#3a3a3a', marginTop: 3 }}>{sub}</div>
              </div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', alignSelf: 'flex-end', background: active ? color : 'transparent', transition: 'background 0.15s' }} />
            </motion.button>
          )
        })}
      </div>

      {/* Post grid — specific */}
      <AnimatePresence>
        {postTarget === 'specific' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: 16, borderRadius: 14, background: '#0c0c0c', border: '1px solid #161616' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>
                  {(config.selected_posts || []).length > 0 ? `${config.selected_posts.length} selected` : 'Select posts or reels'}
                </span>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  onClick={onSync}
                  disabled={syncing}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px', borderRadius: 8, border: '1px solid #1e1e1e',
                    background: '#111', color: '#666', fontSize: 12, cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={11} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
                  {syncing ? 'Syncing…' : 'Sync'}
                </motion.button>
              </div>

              {posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#333', fontSize: 13 }}>
                  No posts yet — click Sync to fetch from Instagram
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {visible.map(post => {
                      const selected = (config.selected_posts || []).includes(post.id)
                      return (
                        <motion.button
                          key={post.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            const current = config.selected_posts || []
                            const next = selected ? current.filter(id => id !== post.id) : [...current, post.id]
                            onChange({ selected_posts: next })
                          }}
                          style={{
                            position: 'relative', borderRadius: 10, overflow: 'hidden',
                            aspectRatio: '1', border: `2px solid ${selected ? '#8b5cf6' : 'transparent'}`,
                            background: '#161616', cursor: 'pointer', padding: 0, transition: 'border-color 0.15s',
                          }}
                        >
                          {post.thumbnail_url ? (
                            <img src={post.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 8 }}>
                              {post.media_type === 'VIDEO' ? <Film size={18} color="#444" /> : <Image size={18} color="#444" />}
                              <span style={{ fontSize: 10, color: '#444', textAlign: 'center', lineHeight: 1.3 }}>
                                {post.caption?.slice(0, 50) || 'No caption'}
                              </span>
                            </div>
                          )}
                          {post.media_type === 'VIDEO' && (
                            <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 5, padding: '2px 5px', display: 'flex' }}>
                              <Film size={9} color="#fff" />
                            </div>
                          )}
                          <AnimatePresence>
                            {selected && (
                              <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      )
                    })}
                  </div>
                  {posts.length > 6 && (
                    <button type="button" onClick={() => setShowAll(!showAll)}
                      style={{ marginTop: 12, fontSize: 12, color: '#555', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {showAll ? 'Show less ↑' : `Show all ${posts.length} posts ↓`}
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info for non-specific modes */}
      {postTarget === 'any' && (
        <div style={{ fontSize: 12, color: '#444', padding: '10px 14px', borderRadius: 10, background: '#0c0c0c', border: '1px solid #141414' }}>
          Automation triggers on comments on <strong style={{ color: '#666' }}>all your posts and reels</strong>.
        </div>
      )}
      {postTarget === 'next' && (
        <div style={{ fontSize: 12, color: '#444', padding: '10px 14px', borderRadius: 10, background: '#0c0c0c', border: '1px solid #141414' }}>
          Automation triggers only on your <strong style={{ color: '#666' }}>next published post or reel</strong>.
        </div>
      )}
    </div>
  )
}
