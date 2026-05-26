import type { Play } from '../types/play'
import { normalizeCustomPlay } from './customPlays'

const exportVersion = 1

type PlaybookBackup = {
  kind: 'court-vision-lab-playbook'
  version: typeof exportVersion
  exportedAt: string
  plays: Play[]
}

type SinglePlayExport = {
  kind: 'court-vision-lab-play'
  version: typeof exportVersion
  exportedAt: string
  play: Play
}

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'play'

export const createJsonFileName = (playName: string) =>
  `court-vision-lab-${slugify(playName)}.json`

export const downloadJson = (data: unknown, fileName: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export const createPlayExport = (play: Play): SinglePlayExport => ({
  kind: 'court-vision-lab-play',
  version: exportVersion,
  exportedAt: new Date().toISOString(),
  play: {
    ...play,
    version: play.version ?? exportVersion,
  },
})

export const createPlaybookExport = (plays: Play[]): PlaybookBackup => ({
  kind: 'court-vision-lab-playbook',
  version: exportVersion,
  exportedAt: new Date().toISOString(),
  plays: plays.map((play) => ({ ...play, version: play.version ?? exportVersion })),
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const importId = (name: string) =>
  `custom-imported-${slugify(name)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

const withCustomId = (play: Play, existingIds: Set<string>): Play => {
  const nextName = play.name || 'Imported Play'
  const needsNewId = !play.id.startsWith('custom-') || existingIds.has(play.id)
  return {
    ...play,
    id: needsNewId ? importId(nextName) : play.id,
    source: 'custom',
    isCustom: true,
    category: play.category || 'My Playbook',
    createdAt: play.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export type ImportPlaysResult =
  | { ok: true; plays: Play[] }
  | { ok: false; message: string }

export const parseImportedPlays = (rawText: string, existingPlays: Play[]): ImportPlaysResult => {
  try {
    const parsed: unknown = JSON.parse(rawText)
    const existingIds = new Set(existingPlays.map((play) => play.id))
    const rawPlays = (() => {
      if (isRecord(parsed) && parsed.kind === 'court-vision-lab-playbook' && Array.isArray(parsed.plays)) {
        return parsed.plays
      }

      if (isRecord(parsed) && parsed.kind === 'court-vision-lab-play' && isRecord(parsed.play)) {
        return [parsed.play]
      }

      if (Array.isArray(parsed)) {
        return parsed
      }

      if (isRecord(parsed)) {
        return [parsed]
      }

      return []
    })()

    const imported = rawPlays.flatMap((rawPlay) => {
      const maybePlay = rawPlay as Play
      const customCandidate = withCustomId(maybePlay, existingIds)
      const normalized = normalizeCustomPlay(customCandidate)
      if (normalized) {
        existingIds.add(normalized.id)
        return [normalized]
      }

      return []
    })

    if (imported.length === 0) {
      return { ok: false, message: 'No valid plays found in JSON' }
    }

    return { ok: true, plays: imported }
  } catch {
    return { ok: false, message: 'Invalid JSON file' }
  }
}
