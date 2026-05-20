import { ChevronDown } from 'lucide-react'
import type { Play } from '../../types/play'

type PlaySelectorProps = {
  plays: Play[]
  selectedPlayId: string
  onSelect: (playId: string) => void
}

export function PlaySelector({ plays, selectedPlayId, onSelect }: PlaySelectorProps) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e0c0b1]">
        Playbook
      </span>
      <span className="relative block">
        <select
          value={selectedPlayId}
          onChange={(event) => onSelect(event.target.value)}
          className="h-11 w-full appearance-none rounded-md border border-[#584237]/55 bg-[#131315] px-3 pr-10 text-sm font-bold text-[#e5e1e4] outline-none transition focus:border-orange-500"
        >
          {plays.map((play) => (
            <option key={play.id} value={play.id}>
              {play.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#e0c0b1]"
          aria-hidden="true"
        />
      </span>
    </label>
  )
}
