import { motion } from 'motion/react'
import { Zap, MessageCircle, Send, Lock, AlertCircle } from 'lucide-react'
import Footer from '../components/Footer'
import { api } from '../lib/api'

const FEATURES = [
  { icon: MessageCircle, text: 'Auto-reply to comments on your posts and reels' },
  { icon: Send, text: 'Send a DM with your link to everyone who comments' },
  { icon: Lock, text: 'Your account, your automations — nobody else can see them' },
]

export default function Login({ error, onPrivacy }) {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            width: '100%', maxWidth: 420,
            background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 24,
            padding: '36px 32px'
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
          }}>
            <Zap size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: 0 }}>InstaBot</h1>
          <p style={{ fontSize: 14, color: '#666', marginTop: 8, lineHeight: 1.5 }}>
            Turn Instagram comments into conversations. Connect your professional account to get started.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '28px 0' }}>
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="#8b5cf6" />
                </div>
                <span style={{ fontSize: 13, color: '#888' }}>{text}</span>
              </div>
            ))}
          </div>

          {error && (
            <div role="alert" style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '12px 14px', borderRadius: 12, marginBottom: 16,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)'
            }}>
              <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, color: '#f87171', lineHeight: 1.45 }}>{error}</span>
            </div>
          )}

          <motion.a
            href={api.loginUrl()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
              background: '#7c3aed', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none'
            }}
          >
            Connect Instagram
          </motion.a>
          <p style={{ fontSize: 12, color: '#444', marginTop: 14, lineHeight: 1.5, textAlign: 'center' }}>
            You'll sign in with Facebook and pick the Page linked to your Instagram professional account.
          </p>
        </motion.div>
      </main>
      <Footer onPrivacy={onPrivacy} />
    </div>
  )
}
