import { BarChart3, ClipboardList, FolderOpen, Settings, Users } from 'lucide-react'

export type AppSection = 'board' | 'playbook' | 'roster' | 'stats'

const navItems = [
  { id: 'board', label: 'Board', icon: ClipboardList },
  { id: 'playbook', label: 'Playbook', icon: FolderOpen },
  { id: 'roster', label: 'Roster', icon: Users },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
] satisfies Array<{ id: AppSection; label: string; icon: typeof ClipboardList }>

type SidebarProps = {
  activeSection: AppSection
  onSelectSection: (section: AppSection) => void
}

export function Sidebar({ activeSection, onSelectSection }: SidebarProps) {
  return (
    <aside className="sidebar panel-glass hidden w-28 shrink-0 flex-col border-r py-5 md:flex xl:w-32">
      <div className="sidebar-logo mb-8 flex justify-center">
        <button
          type="button"
          onClick={() => onSelectSection('board')}
          className="sidebar-logo-mark accent-bg-soft tactical-border-strong accent-text flex h-12 w-12 items-center justify-center rounded-md border font-display text-lg"
          aria-label="Go to board"
          title="Go to board"
        >
          CV
        </button>
      </div>
      <nav className="sidebar-nav flex flex-1 flex-col items-center gap-3">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectSection(id)}
              className={[
                'sidebar-item flex w-[92px] flex-col items-center justify-center gap-1.5 rounded-md px-1.5 py-3 text-[10px] font-black uppercase tracking-wide transition xl:w-[104px]',
                isActive
                  ? 'is-active accent-bg'
                  : 'text-muted opacity-80 hover:bg-[var(--accent-muted)]',
              ].join(' ')}
              title={label}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              data-guide={`${id}-nav`}
            >
              <Icon size={22} aria-hidden="true" />
              <span className="sidebar-label w-full truncate text-center leading-tight">{label}</span>
            </button>
          )
        })}
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
