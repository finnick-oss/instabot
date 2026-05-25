import { motion } from 'motion/react'
import { ArrowLeft, Shield } from 'lucide-react'
import Footer from '../components/Footer'

export default function PrivacyPolicy({ onBack }) {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #141414',
        padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <motion.button
          whileHover={{ x: -2 }}
          type="button"
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 8,
            background: 'transparent', border: '1px solid #1e1e1e',
            color: '#666', fontSize: 13, cursor: 'pointer',
          }}
        >
          <ArrowLeft size={14} /> Back
        </motion.button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={16} color="#8b5cf6" />
          <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Privacy Policy</span>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 720, margin: '0 auto', padding: '48px 32px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p style={{ fontSize: 12, color: '#444', marginBottom: 40 }}>Last updated: May 26, 2026</p>

          {[
            {
              title: '1. Information We Collect',
              body: 'InstaBot collects Instagram user IDs, usernames, and comment text from users who interact with posts where this automation is active. This data is used solely to send automated replies and direct messages on behalf of the account owner.',
            },
            {
              title: '2. How We Use Your Information',
              body: 'Data collected is used exclusively to: (a) send public comment replies, (b) send direct messages as configured by the account owner, and (c) verify follow status on Instagram. We do not sell, share, or transfer any personal data to third parties.',
            },
            {
              title: '3. Data Storage',
              body: 'Interaction logs are stored locally on the account owner\'s device in a JSON file. No data is sent to external servers beyond the Instagram Graph API. Logs are limited to the 500 most recent interactions and can be cleared at any time.',
            },
            {
              title: '4. Instagram API Usage',
              body: 'This application uses the Instagram Graph API and Meta Webhooks in accordance with Meta\'s Platform Terms. User data accessed via the API is used only for the functionality described in this policy.',
            },
            {
              title: '5. User Rights',
              body: 'Users who have interacted with this automation may request deletion of their data by contacting the account owner (@whoanuragbhatt on Instagram). Data is not retained beyond what is necessary for automation functionality.',
            },
            {
              title: '6. Security',
              body: 'Access tokens and API credentials are stored locally and never transmitted to third-party services. All communication with Instagram\'s API uses HTTPS encryption.',
            },
            {
              title: '7. Contact',
              body: 'For any privacy concerns or data deletion requests, contact @whoanuragbhatt on Instagram or via the Meta platform.',
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              style={{ marginBottom: 32 }}
            >
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{section.title}</h2>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>{section.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <Footer onPrivacy={() => {}} />
    </div>
  )
}
