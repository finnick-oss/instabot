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
          <p style={{ fontSize: 12, color: '#444', marginBottom: 40 }}>Last updated: November 4, 2026</p>

          {[
            {
              title: '1. Who We Are',
              body: 'InstaBot lets owners of Instagram professional accounts automatically reply to comments on their posts and send the commenter a direct message (for example a link they asked for). Account owners connect their own Instagram account with Facebook Login and choose which posts and keywords trigger a reply.',
            },
            {
              title: '2. Information We Collect',
              body: 'From account owners: Instagram account ID, username, name and profile picture, the linked Facebook Page ID, and the Page access token Meta issues when they connect. From people who comment on a connected owner\'s posts: their Instagram-scoped user ID, username, the comment text, and their replies or button taps in the resulting direct message conversation. We also check whether that person follows the account, only when the owner turns on the "follow to unlock" option.',
            },
            {
              title: '3. How We Use It',
              body: 'Solely to run the automations the account owner sets up: posting the public comment reply, sending the direct messages, checking follow status, and showing the owner a log and simple statistics of these interactions. We do not use the data for advertising, do not build profiles, and do not sell, rent or share it with third parties.',
            },
            {
              title: '4. Storage and Security',
              body: 'Data is stored in a managed Postgres database (Supabase) and processed by our server on Netlify. Access tokens are kept server-side only and are never shown in the browser or shared. All traffic uses HTTPS.',
            },
            {
              title: '5. Retention and Deletion',
              body: 'Account owners can delete everything at any time with "Disconnect" in the dashboard, which removes their account, automations, interaction logs and tokens and unsubscribes our app from their Page. Removing InstaBot in Facebook or Instagram settings triggers the same deletion through Meta\'s data deletion callback. People who commented can ask the account owner, or contact us below, to delete their interaction records.',
            },
            {
              title: '6. Meta Platform',
              body: 'InstaBot uses the Instagram Graph API, Messenger Platform for Instagram and Meta Webhooks in accordance with the Meta Platform Terms and Developer Policies. Data received from Meta is used only for the purposes described in this policy.',
            },
            {
              title: '7. Contact',
              body: 'For privacy questions or deletion requests, email bhatt6046@gmail.com or message @whoanuragbhatt on Instagram.',
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
