export default function Toggle({ checked, onChange, size = 'md' }) {
  const w = size === 'sm' ? 'w-8' : 'w-10'
  const h = size === 'sm' ? 'h-4' : 'h-5'
  const dot = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const translate = size === 'sm' ? 'translate-x-4' : 'translate-x-5'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center rounded-full transition-colors duration-200 ${w} ${h} ${checked ? 'bg-purple-500' : 'bg-[#333]'}`}
    >
      <span className={`inline-block rounded-full bg-white shadow transition-transform duration-200 ${dot} ${checked ? translate : 'translate-x-0.5'}`} />
    </button>
  )
}
