import type { Player } from '../types/play'

export type BoardTemplate = {
  id: string
  name: string
  description: string
  suggestedUse: string
  tags: string[]
  players: Player[]
  ballOwnerId?: string
}

const offense = (label: `O${1 | 2 | 3 | 4 | 5}`, x: number, y: number, hasBall = false): Player => ({
  id: label.toLowerCase(),
  label,
  team: 'offense',
  position: { x, y },
  hasBall,
})

const defense = (label: `D${1 | 2 | 3 | 4 | 5}`, x: number, y: number): Player => ({
  id: label.toLowerCase(),
  label,
  team: 'defense',
  position: { x, y },
})

export const boardTemplates: BoardTemplate[] = [
  {
    id: 'empty-board',
    name: 'Empty Board',
    description: 'A clean court with no players. Use +O and +D to build a setup from scratch.',
    suggestedUse: 'Freeform teaching board',
    tags: ['Custom', 'Blank'],
    players: [],
  },
  {
    id: 'empty-5v5',
    name: 'Empty 5v5',
    description: 'Balanced 5-on-5 spacing with the ball at the top.',
    suggestedUse: 'Start a full-team half-court concept',
    tags: ['5v5', 'Setup'],
    ballOwnerId: 'o1',
    players: [
      offense('O1', 31, 50, true),
      offense('O2', 18, 78),
      offense('O3', 72, 78),
      offense('O4', 43, 38),
      offense('O5', 43, 62),
      defense('D1', 34, 50),
      defense('D2', 21, 73),
      defense('D3', 69, 73),
      defense('D4', 46, 36),
      defense('D5', 46, 60),
    ],
  },
  {
    id: 'empty-3v3',
    name: 'Empty 3v3',
    description: 'Three-player spacing for small-sided actions.',
    suggestedUse: 'Teach reads with less traffic',
    tags: ['3v3', 'Spacing'],
    ballOwnerId: 'o1',
    players: [
      offense('O1', 30, 50, true),
      offense('O2', 18, 75),
      offense('O3', 54, 30),
      defense('D1', 34, 50),
      defense('D2', 22, 70),
      defense('D3', 57, 34),
    ],
  },
  {
    id: 'half-court-3v3',
    name: 'Half-court 3v3',
    description: 'Compact 3v3 alignment around the left half court.',
    suggestedUse: 'Small-sided teaching and constraints',
    tags: ['3v3', 'Half court'],
    ballOwnerId: 'o1',
    players: [
      offense('O1', 24, 50, true),
      offense('O2', 15, 26),
      offense('O3', 15, 74),
      defense('D1', 28, 50),
      defense('D2', 19, 30),
      defense('D3', 19, 70),
    ],
  },
  {
    id: 'two-v-two-pnr',
    name: '2v2 Pick and Roll Setup',
    description: 'Basic ball screen shell with handler, screener and two defenders.',
    suggestedUse: 'Teach screen angle and contain coverage',
    tags: ['2v2', 'Pick and Roll'],
    ballOwnerId: 'o1',
    players: [
      offense('O1', 30, 50, true),
      offense('O5', 42, 50),
      defense('D1', 34, 50),
      defense('D5', 44, 55),
    ],
  },
  {
    id: 'fast-break-drill',
    name: 'Fast Break Drill',
    description: 'Transition lanes with three attackers and retreating defenders.',
    suggestedUse: 'Train pace, lane discipline and advance passes',
    tags: ['Drill', 'Transition'],
    ballOwnerId: 'o1',
    players: [
      offense('O1', 18, 50, true),
      offense('O2', 18, 20),
      offense('O3', 18, 80),
      offense('O4', 8, 58),
      defense('D1', 62, 50),
      defense('D2', 72, 28),
      defense('D3', 72, 72),
    ],
  },
  {
    id: 'defensive-shell',
    name: 'Defensive Shell Drill',
    description: 'Four-out shell positions for teaching help, stunt and recovery.',
    suggestedUse: 'Defensive rotations',
    tags: ['Drill', 'Defense'],
    ballOwnerId: 'o1',
    players: [
      offense('O1', 30, 50, true),
      offense('O2', 20, 25),
      offense('O3', 20, 75),
      offense('O4', 58, 25),
      offense('O5', 58, 75),
      defense('D1', 34, 50),
      defense('D2', 25, 30),
      defense('D3', 25, 70),
      defense('D4', 54, 32),
      defense('D5', 54, 68),
    ],
  },
]
