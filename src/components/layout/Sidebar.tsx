import { BarChart3, ClipboardList, FolderOpen, Settings, Users } from 'lucide-react'

const navItems = [
  { label: 'Board', icon: ClipboardList, active: true },
  { label: 'Playbook', icon: FolderOpen, active: false },
  { label: 'Roster', icon: Users, active: false },
  { label: 'Stats', icon: BarChart3, active: false },
]

export function Sidebar() {
  return (
    <aside className="hidden w-20 shrink-0 flex-col border-r border-[#584237]/25 bg-[#1c1b1d] py-5 md:flex">
      <div className="mb-10 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-orange-500/45 bg-orange-500/10 font-display text-lg text-orange-500">
          CV
        </div>
      </div>
      <nav className="flex flex-1 flex-col items-center gap-3">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            disabled={!active}
            className={[
              'flex w-[60px] flex-col items-center justify-center gap-1 rounded-md py-3 text-[10px] font-black uppercase tracking-wide transition',
              active
                ? 'bg-orange-500 text-[#341100]'
                : 'text-[#e0c0b1] opacity-70 hover:bg-[#353437]/70',
            ].join(' ')}
            title={active ? label : `${label} coming soon`}
            aria-label={active ? label : `${label} coming soon`}
          >
            <Icon size={22} aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>
      <button
        type="button"
        disabled
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-md text-[#e0c0b1] opacity-70"
        title="Settings coming soon"
        aria-label="Settings coming soon"
      >
        <Settings size={23} aria-hidden="true" />
      </button>
    </aside>
  )
}
