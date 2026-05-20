import { BarChart3, ClipboardList, FolderOpen, Settings, Users } from 'lucide-react'

const navItems = [
  { label: 'Board', icon: ClipboardList, active: true },
  { label: 'Playbook', icon: FolderOpen, active: false },
  { label: 'Roster', icon: Users, active: false },
  { label: 'Stats', icon: BarChart3, active: false },
]

export function Sidebar() {
  return (
    <aside className="sidebar panel-glass hidden w-20 shrink-0 flex-col border-r py-5 md:flex">
      <div className="sidebar-logo mb-10 flex justify-center">
        <div className="sidebar-logo-mark accent-bg-soft tactical-border-strong accent-text flex h-12 w-12 items-center justify-center rounded-md border font-display text-lg">
          CV
        </div>
      </div>
      <nav className="sidebar-nav flex flex-1 flex-col items-center gap-3">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            disabled={!active}
            className={[
              'sidebar-item flex w-[60px] flex-col items-center justify-center gap-1 rounded-md py-3 text-[10px] font-black uppercase tracking-wide transition',
              active
                ? 'is-active accent-bg'
                : 'text-muted opacity-70 hover:bg-[var(--accent-muted)]',
            ].join(' ')}
            title={active ? label : `${label} coming soon`}
            aria-label={active ? label : `${label} coming soon`}
          >
            <Icon size={22} aria-hidden="true" />
            <span className="sidebar-label">{label}</span>
          </button>
        ))}
      </nav>
      <button
        type="button"
        disabled
        className="sidebar-settings text-muted mx-auto flex h-12 w-12 items-center justify-center rounded-md opacity-70"
        title="Settings coming soon"
        aria-label="Settings coming soon"
      >
        <Settings size={23} aria-hidden="true" />
      </button>
    </aside>
  )
}
