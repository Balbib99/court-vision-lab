import { useMemo, useState } from 'react'
import { Copy, FilePlus2, PlayCircle, Search, Trash2 } from 'lucide-react'
import type { Play } from '../../types/play'

type PlaybookFilter = 'all' | 'offensive' | 'defensive' | 'drills' | 'built-in' | 'custom'

type PlaybookViewProps = {
  builtInPlays: Play[]
  customPlays: Play[]
  selectedPlayId: string
  onCreateEmptyBoard: () => void
  onDeletePlay: (play: Play) => void
  onDuplicatePlay: (play: Play) => void
  onLoadPlay: (playId: string) => void
}

const filters: Array<{ id: PlaybookFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'offensive', label: 'Offensive' },
  { id: 'defensive', label: 'Defensive' },
  { id: 'drills', label: 'Drills' },
  { id: 'built-in', label: 'Built-in' },
  { id: 'custom', label: 'My Plays' },
]

const getPlayKind = (play: Play) => (play.source === 'custom' || play.isCustom ? 'custom' : 'built-in')

function matchesFilter(play: Play, filter: PlaybookFilter) {
  if (filter === 'all') return true
  if (filter === 'built-in' || filter === 'custom') return getPlayKind(play) === filter
  const text = `${play.category} ${play.name}`.toLowerCase()
  if (filter === 'offensive') return text.includes('offense') || text.includes('half-court') || text.includes('transition') || text.includes('screen')
  if (filter === 'defensive') return text.includes('defense')
  return text.includes('drill')
}

function PlayCard({ play, selectedPlayId, onDeletePlay, onDuplicatePlay, onLoadPlay }: {
  play: Play
  selectedPlayId: string
  onDeletePlay: (play: Play) => void
  onDuplicatePlay: (play: Play) => void
  onLoadPlay: (playId: string) => void
}) {
  const isCustom = getPlayKind(play) === 'custom'
  const updatedLabel = play.updatedAt ? new Date(play.updatedAt).toLocaleDateString() : 'Template'

  return (
    <article className="panel-floating rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="accent-text font-mono text-[10px] font-bold uppercase tracking-[0.14em]">{play.category}</p>
          <h3 className="text-main mt-1 text-lg font-black">{play.name}</h3>
        </div>
        <span className="accent-badge rounded-sm px-2 py-1 font-mono text-[10px] font-bold uppercase">
          {isCustom ? 'Custom' : 'Built-in'}
        </span>
      </div>
      <p className="text-muted mt-3 line-clamp-2 text-sm leading-6">{play.description}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.1em]">
        <span className="panel rounded-sm border px-2 py-1 text-center text-[var(--text-muted)]">{play.difficulty}</span>
        <span className="panel rounded-sm border px-2 py-1 text-center text-[var(--text-muted)]">{play.steps.length} steps</span>
        <span className="panel rounded-sm border px-2 py-1 text-center text-[var(--text-muted)]">{updatedLabel}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => onLoadPlay(play.id)} className="accent-badge inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-bold" aria-label={`Load ${play.name}`} title={`Load ${play.name}`}>
          <PlayCircle size={16} aria-hidden="true" />
          {selectedPlayId === play.id ? 'Active' : 'Load'}
        </button>
        <button type="button" onClick={() => onDuplicatePlay(play)} className="panel inline-flex h-9 w-9 items-center justify-center rounded-md border text-[var(--text-muted)] transition hover:bg-[var(--accent-muted)]" aria-label={`Duplicate ${play.name}`} title={`Duplicate ${play.name}`}>
          <Copy size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => onDeletePlay(play)} disabled={!isCustom} className="panel inline-flex h-9 w-9 items-center justify-center rounded-md border text-[var(--defense)] transition hover:bg-[var(--accent-muted)] disabled:cursor-not-allowed disabled:opacity-35" aria-label={isCustom ? `Delete ${play.name}` : 'Built-in plays cannot be deleted'} title={isCustom ? `Delete ${play.name}` : 'Built-in plays cannot be deleted'}>
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

export function PlaybookView({ builtInPlays, customPlays, selectedPlayId, onCreateEmptyBoard, onDeletePlay, onDuplicatePlay, onLoadPlay }: PlaybookViewProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PlaybookFilter>('all')
  const allPlays = useMemo(() => [...builtInPlays, ...customPlays], [builtInPlays, customPlays])
  const visiblePlays = allPlays.filter((play) => {
    const queryText = `${play.name} ${play.category} ${play.description}`.toLowerCase()
    return queryText.includes(query.toLowerCase()) && matchesFilter(play, filter)
  })

  return (
    <section className="min-h-full p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="accent-text font-mono text-xs font-bold uppercase tracking-[0.16em]">Playbook</p>
            <h2 className="text-main mt-2 font-display text-3xl tracking-[0.05em]">Play Library</h2>
            <p className="text-muted mt-2 text-sm">{allPlays.length} total plays · {customPlays.length} custom saved</p>
          </div>
          <button type="button" onClick={onCreateEmptyBoard} className="accent-badge inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-bold" aria-label="Start from empty board" title="Start from empty board">
            <FilePlus2 size={17} aria-hidden="true" />
            Start from Empty Board
          </button>
        </div>
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="panel flex h-11 w-full items-center gap-3 rounded-md border px-3 text-[var(--text-muted)] lg:max-w-md">
            <Search size={17} aria-hidden="true" />
            <input className="text-main w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-[var(--text-soft)]" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search plays..." />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((item) => (
              <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={[ 'min-w-fit rounded-md border px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition', filter === item.id ? 'accent-badge' : 'panel text-[var(--text-muted)] hover:bg-[var(--accent-muted)]' ].join(' ')}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {visiblePlays.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {visiblePlays.map((play) => (
              <PlayCard key={play.id} play={play} selectedPlayId={selectedPlayId} onDeletePlay={onDeletePlay} onDuplicatePlay={onDuplicatePlay} onLoadPlay={onLoadPlay} />
            ))}
          </div>
        ) : (
          <div className="panel-floating rounded-xl border p-6 text-[var(--text-muted)]">
            No plays match this view. Create one from the board or clear the filters.
          </div>
        )}
        {customPlays.length === 0 && (
          <div className="panel-floating mt-5 rounded-xl border p-6 text-[var(--text-muted)]">
            No custom plays yet. Create one from the board.
          </div>
        )}
      </div>
    </section>
  )
}
