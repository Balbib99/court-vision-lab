import { ChevronDown } from 'lucide-react'
import type { Play } from '../../types/play'

type PlaySelectorProps = {
  plays: Play[]
  selectedPlayId: string
  onSelect: (playId: string) => void
}

export function PlaySelector({ plays, selectedPlayId, onSelect }: PlaySelectorProps) {
  const builtInPlays = plays.filter((play) => play.source !== 'custom' && !play.isCustom)
  const customPlays = plays.filter((play) => play.source === 'custom' || play.isCustom)

  return (
    <label className="block">
      <span className="text-soft mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.16em]">
        Playbook
      </span>
      <span className="relative block">
        <select
          value={selectedPlayId}
          onChange={(event) => onSelect(event.target.value)}
          className="panel h-11 w-full appearance-none rounded-md border px-3 pr-10 text-sm font-bold text-[var(--text-main)] outline-none transition focus:border-[var(--accent)]"
        >
          <optgroup label="Built-in Plays">
            {builtInPlays.map((play) => (
              <option key={play.id} value={play.id}>
                {play.name}
              </option>
            ))}
          </optgroup>
          {customPlays.length > 0 && (
            <optgroup label="My Plays">
              {customPlays.map((play) => (
                <option key={play.id} value={play.id}>
                  {play.name} · Custom
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <ChevronDown
          size={17}
          className="text-soft pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          aria-hidden="true"
        />
      </span>
    </label>
  )
}
