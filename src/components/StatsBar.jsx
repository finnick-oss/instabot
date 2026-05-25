export default function StatsBar({ stats }) {
  const items = [
    { label: 'Comments Replied', value: stats.comments_replied ?? 0 },
    { label: 'DMs Sent', value: stats.dms_sent ?? 0 },
    { label: 'Clicks', value: stats.clicks ?? 0 },
    { label: 'Followers Gained', value: stats.followers_gained ?? 0 },
    { label: 'Emails Saved', value: stats.emails_saved ?? 0 },
  ]

  return (
    <div className="flex items-center gap-6 px-6 py-3 bg-[#111] border-b border-[#222]">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div>
            <div className="text-xl font-semibold text-white">{item.value}</div>
            <div className="text-xs text-[#666]">{item.label}</div>
          </div>
          {i < items.length - 1 && <div className="w-px h-8 bg-[#222] ml-3" />}
        </div>
      ))}
    </div>
  )
}
