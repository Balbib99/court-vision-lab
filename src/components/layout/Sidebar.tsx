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
    <aside className="sidebar chrome-surface hidden w-20 shrink-0 flex-col border-r py-5 md:flex xl:w-24">
      <div className="sidebar-logo mb-6 flex justify-center">
        <button
          type="button"
          onClick={() => onSelectSection('board')}
          className="sidebar-logo-mark chrome-btn flex h-11 w-11 items-center justify-center rounded-md border border-[color:var(--border)] font-display text-base text-[var(--text-main)]"
          aria-label="Go to board"
          title="Go to board"
        >
          CV
        </button>
      </div>
      <nav className="sidebar-nav flex flex-1 flex-col items-center gap-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectSection(id)}
              className={[
                'sidebar-item relative flex w-16 flex-col items-center justify-center gap-1.5 rounded-md px-1.5 py-3 text-[10px] font-bold transition xl:w-[76px]',
                isActive ? 'is-active text-[var(--text-main)]' : 'chrome-btn opacity-80',
              ].join(' ')}
              title={label}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              data-guide={`${id}-nav`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-[var(--text-main)]" aria-hidden="true" />
              )}
              <Icon size={21} strokeWidth={1.75} aria-hidden="true" />
              <span className="sidebar-label w-full text-center leading-tight">{label}</span>
            </button>
          )
        })}
      </nav>
      <button
        type="button"
        disabled
        className="sidebar-settings chrome-btn mx-auto flex h-11 w-11 items-center justify-center rounded-md"
        title="Settings coming soon"
        aria-label="Settings coming soon"
      >
        <Settings size={21} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </aside>
  )
}
