import { Home, Zap, Settings, BarChart2 } from 'lucide-react'

const nav = [
  { icon: Home, label: 'Home' },
  { icon: Zap, label: 'Automations', active: true },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="w-14 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col items-center py-4 gap-1 flex-shrink-0">
      {/* Logo */}
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, flexShrink: 0 }}>
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>IG</span>
      </div>

      {nav.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          title={label}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
            active ? 'bg-purple-500/20 text-purple-400' : 'text-[#555] hover:text-[#999] hover:bg-[#111]'
          }`}
        >
          <Icon size={17} />
        </button>
      ))}
    </aside>
  )
}
