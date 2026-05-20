import type { Play } from '../types/play'

const pickAndRollPlayers: Play['initialPlayers'] = [
  { id: 'o1', label: 'O1', team: 'offense', role: 'Ball handler', position: { x: 31, y: 28 }, hasBall: true },
  { id: 'o2', label: 'O2', team: 'offense', role: 'Strong-side corner', position: { x: 10, y: 45 } },
  { id: 'o3', label: 'O3', team: 'offense', role: 'Weak-side slot', position: { x: 48, y: 20 } },
  { id: 'o4', label: 'O4', team: 'offense', role: 'Weak-side wing', position: { x: 46, y: 38 } },
  { id: 'o5', label: 'O5', team: 'offense', role: 'Screener', position: { x: 18, y: 34 } },
  { id: 'd1', label: 'D1', team: 'defense', role: 'Point-of-attack', position: { x: 34, y: 28 } },
  { id: 'd2', label: 'D2', team: 'defense', role: 'Corner defender', position: { x: 13, y: 43 } },
  { id: 'd3', label: 'D3', team: 'defense', role: 'Nail help', position: { x: 50, y: 22 } },
  { id: 'd4', label: 'D4', team: 'defense', role: 'Low help', position: { x: 44, y: 40 } },
  { id: 'd5', label: 'D5', team: 'defense', role: 'Screen defender', position: { x: 22, y: 31 } },
]

export const plays: Play[] = [
  {
    id: 'pick-and-roll',
    name: 'Pick and Roll',
    category: 'Half-court action',
    difficulty: 'Medium',
    description:
      'A high ball-screen action that creates pressure on the point-of-attack defender and forces the big to choose between the drive and the roll.',
    objective:
      'Generate a two-on-one advantage, pull the low help into the lane, then finish at the rim or kick to the open spacer.',
    concepts: ['Screen angle', 'Roll gravity', 'Spacing', 'Help defense', 'Passing window'],
    initialPlayers: pickAndRollPlayers,
    steps: [
      {
        id: 'initial-spacing',
        title: 'Initial spacing',
        description:
          'O1 starts on the left slot with the ball. The floor is spaced with two weak-side outlets and a strong-side corner.',
        duration: 900,
        ball: { carrierId: 'o1' },
        movements: [],
      },
      {
        id: 'screen-setup',
        title: 'Screen setup',
        description:
          'O5 climbs from the dunker spot to set a high screen. The defense shades into drop coverage while the help line tightens.',
        duration: 1150,
        ball: { carrierId: 'o1' },
        movements: [
          { playerId: 'o5', to: { x: 36, y: 29 }, duration: 900, note: 'Set the screen' },
          { playerId: 'o2', to: { x: 8, y: 47 }, duration: 700, note: 'Deep corner spacing' },
          { playerId: 'd5', to: { x: 40, y: 30 }, duration: 900, note: 'Drop alignment' },
          { playerId: 'd3', to: { x: 52, y: 25 }, duration: 700, note: 'Nail help' },
        ],
      },
      {
        id: 'drive-and-roll',
        title: 'Drive and roll',
        description:
          'O1 turns the corner off O5. O5 rolls into the lane as D1 trails and D5 contains the ball.',
        duration: 1250,
        ball: { carrierId: 'o1' },
        movements: [
          { playerId: 'o1', to: { x: 49, y: 24 }, duration: 1000, note: 'Attack downhill' },
          { playerId: 'o5', to: { x: 47, y: 34 }, duration: 1000, note: 'Roll to rim' },
          { playerId: 'd1', to: { x: 44, y: 26 }, duration: 900, note: 'Chase over' },
          { playerId: 'd5', to: { x: 52, y: 29 }, duration: 900, note: 'Contain' },
          { playerId: 'd4', to: { x: 50, y: 39 }, duration: 750, note: 'Tag the roller' },
        ],
      },
      {
        id: 'passing-option-finish',
        title: 'Passing option / finish',
        description:
          'The ball hits O5 on the roll. If the tag commits, O4 and O3 are ready as kickout options.',
        duration: 1200,
        ball: { carrierId: 'o5' },
        movements: [
          { playerId: 'o5', to: { x: 57, y: 32 }, duration: 950, note: 'Catch in the lane' },
          { playerId: 'o1', to: { x: 55, y: 22 }, duration: 700, note: 'Keep the passing angle' },
          { playerId: 'o4', to: { x: 55, y: 43 }, duration: 800, note: 'Lift to outlet' },
          { playerId: 'd4', to: { x: 55, y: 36 }, duration: 800, note: 'Late help' },
          { playerId: 'd5', to: { x: 58, y: 30 }, duration: 700, note: 'Recover' },
        ],
      },
    ],
  },
  {
    id: 'horns',
    name: 'Horns',
    category: 'Half-court set',
    difficulty: 'Medium',
    description: 'Two bigs start at the elbows, creating quick handoff, slip, and flare options.',
    objective: 'Force the defense to guard both elbows and open a clean read for the ball handler.',
    concepts: ['Elbow spacing', 'Handoff', 'Slip', 'Weak-side flare'],
    initialPlayers: pickAndRollPlayers.map((player) => ({
      ...player,
      position:
        player.id === 'o4'
          ? { x: 42, y: 22 }
          : player.id === 'o5'
            ? { x: 42, y: 35 }
            : player.position,
      hasBall: player.id === 'o1',
    })),
    steps: [
      {
        id: 'horns-entry',
        title: 'Horns entry',
        description: 'The ball enters the slot while both bigs hold the elbows.',
        duration: 1000,
        ball: { carrierId: 'o1' },
        movements: [{ playerId: 'o1', to: { x: 38, y: 28 }, duration: 800 }],
      },
      {
        id: 'handoff-read',
        title: 'Handoff read',
        description: 'O4 becomes the handoff option while O5 is ready to slip.',
        duration: 1000,
        ball: { carrierId: 'o4' },
        movements: [
          { playerId: 'o4', to: { x: 47, y: 24 }, duration: 800 },
          { playerId: 'o5', to: { x: 52, y: 34 }, duration: 800 },
        ],
      },
    ],
  },
  {
    id: 'fast-break',
    name: 'Fast Break',
    category: 'Transition',
    difficulty: 'Easy',
    description: 'A simple transition lane fill with the ball advanced to the middle.',
    objective: 'Create an early-number advantage before the defense is fully matched.',
    concepts: ['Rim run', 'Wide lanes', 'Advance pass', 'Early offense'],
    initialPlayers: pickAndRollPlayers.map((player) => ({
      ...player,
      position:
        player.team === 'offense'
          ? { x: Math.max(10, player.position.x - 14), y: player.position.y }
          : { x: player.position.x + 12, y: player.position.y },
      hasBall: player.id === 'o1',
    })),
    steps: [
      {
        id: 'lane-fill',
        title: 'Lane fill',
        description: 'Wings sprint wide and the big runs the middle lane.',
        duration: 1000,
        ball: { carrierId: 'o1' },
        movements: [
          { playerId: 'o1', to: { x: 44, y: 28 }, duration: 900 },
          { playerId: 'o2', to: { x: 38, y: 48 }, duration: 900 },
          { playerId: 'o3', to: { x: 58, y: 14 }, duration: 900 },
          { playerId: 'o5', to: { x: 54, y: 30 }, duration: 900 },
        ],
      },
      {
        id: 'early-finish',
        title: 'Early finish',
        description: 'The ball is advanced before the low defender can protect the rim.',
        duration: 1000,
        ball: { carrierId: 'o5' },
        movements: [
          { playerId: 'o5', to: { x: 70, y: 30 }, duration: 900 },
          { playerId: 'd5', to: { x: 64, y: 31 }, duration: 900 },
        ],
      },
    ],
  },
]

export const defaultPlay = plays[0]
