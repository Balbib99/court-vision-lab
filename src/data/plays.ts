import type { Play } from '../types/play'

const defenseShell: Play['initialPlayers'] = [
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
    initialPlayers: [
      { id: 'o1', label: 'O1', team: 'offense', role: 'Ball handler', position: { x: 31, y: 28 }, hasBall: true },
      { id: 'o2', label: 'O2', team: 'offense', role: 'Strong-side corner', position: { x: 10, y: 45 } },
      { id: 'o3', label: 'O3', team: 'offense', role: 'Weak-side slot', position: { x: 48, y: 20 } },
      { id: 'o4', label: 'O4', team: 'offense', role: 'Weak-side wing', position: { x: 46, y: 38 } },
      { id: 'o5', label: 'O5', team: 'offense', role: 'Screener', position: { x: 18, y: 34 } },
      ...defenseShell,
    ],
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
    description:
      'A two-big alignment at both elbows that gives the ball handler immediate screen, handoff and flare reads.',
    objective:
      'Make the defense defend both elbows, then free a shooter by forcing help to react to the ball screen.',
    concepts: ['Elbow spacing', 'Rub screen', 'Flare option', 'Weak-side lift'],
    initialPlayers: [
      { id: 'o1', label: 'O1', team: 'offense', role: 'Initiator', position: { x: 30, y: 28 }, hasBall: true },
      { id: 'o2', label: 'O2', team: 'offense', role: 'Left corner shooter', position: { x: 7, y: 47 } },
      { id: 'o3', label: 'O3', team: 'offense', role: 'Right corner shooter', position: { x: 64, y: 47 } },
      { id: 'o4', label: 'O4', team: 'offense', role: 'Left elbow screener', position: { x: 40, y: 22 } },
      { id: 'o5', label: 'O5', team: 'offense', role: 'Right elbow screener', position: { x: 40, y: 35 } },
      { id: 'd1', label: 'D1', team: 'defense', role: 'On-ball defender', position: { x: 33, y: 28 } },
      { id: 'd2', label: 'D2', team: 'defense', role: 'Corner defender', position: { x: 10, y: 44 } },
      { id: 'd3', label: 'D3', team: 'defense', role: 'Corner defender', position: { x: 61, y: 44 } },
      { id: 'd4', label: 'D4', team: 'defense', role: 'Elbow defender', position: { x: 43, y: 23 } },
      { id: 'd5', label: 'D5', team: 'defense', role: 'Elbow defender', position: { x: 43, y: 34 } },
    ],
    steps: [
      {
        id: 'horns-spacing',
        title: 'Horns spacing',
        description: 'Both bigs hold the elbows while O2 and O3 pin the defense in the corners.',
        duration: 900,
        ball: { carrierId: 'o1' },
        movements: [],
      },
      {
        id: 'elbow-screen',
        title: 'Elbow screen',
        description: 'O5 steps up into the ball screen and O1 drives toward the middle lane.',
        duration: 1100,
        ball: { carrierId: 'o1' },
        movements: [
          { playerId: 'o5', to: { x: 38, y: 30 }, duration: 800, note: 'Screen the ball' },
          { playerId: 'o1', to: { x: 42, y: 28 }, duration: 900, note: 'Use the screen' },
          { playerId: 'd1', to: { x: 39, y: 29 }, duration: 800, note: 'Trail over' },
          { playerId: 'd5', to: { x: 45, y: 31 }, duration: 800, note: 'Contain the drive' },
        ],
      },
      {
        id: 'shooter-release',
        title: 'Shooter release',
        description: 'O4 turns into a pin-down angle and O3 rises out of the corner for a catch-and-shoot read.',
        duration: 1150,
        ball: { carrierId: 'o1' },
        movements: [
          { playerId: 'o3', to: { x: 57, y: 22 }, duration: 900, note: 'Lift to open window' },
          { playerId: 'o4', to: { x: 50, y: 25 }, duration: 850, note: 'Brush screen' },
          { playerId: 'd3', to: { x: 57, y: 28 }, duration: 850, note: 'Chase the shooter' },
          { playerId: 'd4', to: { x: 51, y: 24 }, duration: 700, note: 'Help late' },
        ],
      },
      {
        id: 'kickout-option',
        title: 'Kickout option',
        description: 'The ball moves to the shooter while O5 dives and occupies the low defender.',
        duration: 1200,
        ball: { carrierId: 'o3' },
        movements: [
          { playerId: 'o3', to: { x: 61, y: 20 }, duration: 850, note: 'Receive outside' },
          { playerId: 'o5', to: { x: 55, y: 35 }, duration: 900, note: 'Dive to rim' },
          { playerId: 'd5', to: { x: 56, y: 34 }, duration: 850, note: 'Recover inside' },
          { playerId: 'd3', to: { x: 62, y: 22 }, duration: 750, note: 'Close out' },
        ],
      },
    ],
  },
  {
    id: 'fast-break',
    name: 'Fast Break',
    category: 'Transition',
    difficulty: 'Easy',
    description:
      'A transition attack with the ball pushed through the middle, wings sprinting wide and a trailing big arriving late.',
    objective:
      'Create an early-number advantage before the defense is matched, then finish at the rim or spray to a corner.',
    concepts: ['Middle push', 'Wide lanes', 'Rim run', 'Trailing big', 'Early corner'],
    initialPlayers: [
      { id: 'o1', label: 'O1', team: 'offense', role: 'Push guard', position: { x: 20, y: 28 }, hasBall: true },
      { id: 'o2', label: 'O2', team: 'offense', role: 'Left lane runner', position: { x: 16, y: 47 } },
      { id: 'o3', label: 'O3', team: 'offense', role: 'Right lane runner', position: { x: 16, y: 9 } },
      { id: 'o4', label: 'O4', team: 'offense', role: 'Trailer', position: { x: 10, y: 35 } },
      { id: 'o5', label: 'O5', team: 'offense', role: 'Rim runner', position: { x: 24, y: 30 } },
      { id: 'd1', label: 'D1', team: 'defense', role: 'Ball stopper', position: { x: 34, y: 28 } },
      { id: 'd2', label: 'D2', team: 'defense', role: 'Left retreat', position: { x: 39, y: 43 } },
      { id: 'd3', label: 'D3', team: 'defense', role: 'Right retreat', position: { x: 39, y: 13 } },
      { id: 'd4', label: 'D4', team: 'defense', role: 'Low wall', position: { x: 50, y: 35 } },
      { id: 'd5', label: 'D5', team: 'defense', role: 'Rim protection', position: { x: 48, y: 28 } },
    ],
    steps: [
      {
        id: 'outlet-and-run',
        title: 'Outlet and run',
        description: 'O1 receives the outlet and immediately pushes through the middle lane.',
        duration: 900,
        ball: { carrierId: 'o1' },
        movements: [],
      },
      {
        id: 'lane-fill',
        title: 'Lane fill',
        description: 'O2 and O3 sprint wide while O5 rim-runs to force the defense into the paint.',
        duration: 1100,
        ball: { carrierId: 'o1' },
        movements: [
          { playerId: 'o1', to: { x: 43, y: 28 }, duration: 900, note: 'Push middle' },
          { playerId: 'o2', to: { x: 46, y: 49 }, duration: 950, note: 'Wide lane' },
          { playerId: 'o3', to: { x: 48, y: 8 }, duration: 950, note: 'Opposite lane' },
          { playerId: 'o5', to: { x: 52, y: 29 }, duration: 900, note: 'Rim run' },
          { playerId: 'd1', to: { x: 47, y: 29 }, duration: 900, note: 'Stop the ball' },
          { playerId: 'd5', to: { x: 57, y: 30 }, duration: 900, note: 'Protect rim' },
        ],
      },
      {
        id: 'trailer-arrives',
        title: 'Trailer arrives',
        description: 'O4 trails into the slot as the defense collapses to protect the lane.',
        duration: 1100,
        ball: { carrierId: 'o1' },
        movements: [
          { playerId: 'o4', to: { x: 45, y: 36 }, duration: 900, note: 'Trail slot' },
          { playerId: 'o5', to: { x: 62, y: 29 }, duration: 850, note: 'Seal at rim' },
          { playerId: 'd4', to: { x: 60, y: 34 }, duration: 850, note: 'Sink to paint' },
          { playerId: 'd2', to: { x: 55, y: 44 }, duration: 850, note: 'Protect corner' },
        ],
      },
      {
        id: 'corner-or-layup',
        title: 'Corner or layup',
        description: 'O1 can finish at the rim or fire to O2 in the corner if the low defender commits.',
        duration: 1200,
        ball: { carrierId: 'o2' },
        movements: [
          { playerId: 'o1', to: { x: 61, y: 26 }, duration: 850, note: 'Draw the defense' },
          { playerId: 'o2', to: { x: 70, y: 47 }, duration: 850, note: 'Corner target' },
          { playerId: 'o5', to: { x: 68, y: 30 }, duration: 800, note: 'Rim pressure' },
          { playerId: 'd5', to: { x: 66, y: 29 }, duration: 800, note: 'Contest rim' },
          { playerId: 'd2', to: { x: 66, y: 44 }, duration: 750, note: 'Late closeout' },
        ],
      },
    ],
  },
  {
    id: 'spain-pick-and-roll',
    name: 'Spain Pick and Roll',
    category: 'Advanced ball screen',
    difficulty: 'Advanced',
    description:
      'A layered ball-screen action where a shooter back-screens the roller defender, then pops out for a perimeter shot.',
    objective:
      'Delay the big defender with the back screen, open the roll for O5 and create a second read for the popping shooter.',
    concepts: ['Back screen', 'Roll timing', 'Pop spacing', 'Two-man tag', 'Advanced read'],
    initialPlayers: [
      { id: 'o1', label: 'O1', team: 'offense', role: 'Ball handler', position: { x: 31, y: 28 }, hasBall: true },
      { id: 'o2', label: 'O2', team: 'offense', role: 'Back screener', position: { x: 45, y: 42 } },
      { id: 'o3', label: 'O3', team: 'offense', role: 'Weak-side spacer', position: { x: 12, y: 9 } },
      { id: 'o4', label: 'O4', team: 'offense', role: 'Corner spacer', position: { x: 10, y: 47 } },
      { id: 'o5', label: 'O5', team: 'offense', role: 'Primary screener', position: { x: 36, y: 31 } },
      { id: 'd1', label: 'D1', team: 'defense', role: 'On-ball defender', position: { x: 34, y: 28 } },
      { id: 'd2', label: 'D2', team: 'defense', role: 'Back-screen defender', position: { x: 45, y: 39 } },
      { id: 'd3', label: 'D3', team: 'defense', role: 'Weak-side help', position: { x: 16, y: 12 } },
      { id: 'd4', label: 'D4', team: 'defense', role: 'Low tag', position: { x: 18, y: 43 } },
      { id: 'd5', label: 'D5', team: 'defense', role: 'Roll defender', position: { x: 40, y: 29 } },
    ],
    steps: [
      {
        id: 'spain-alignment',
        title: 'Spain alignment',
        description: 'O1 controls the ball up top, O5 is ready to screen, and O2 hides below the action.',
        duration: 900,
        ball: { carrierId: 'o1' },
        movements: [],
      },
      {
        id: 'direct-screen',
        title: 'Direct screen',
        description: 'O5 sets the high screen for O1. The defense begins to load up against the drive.',
        duration: 1100,
        ball: { carrierId: 'o1' },
        movements: [
          { playerId: 'o5', to: { x: 38, y: 29 }, duration: 800, note: 'Set ball screen' },
          { playerId: 'o1', to: { x: 45, y: 25 }, duration: 900, note: 'Use screen' },
          { playerId: 'd1', to: { x: 41, y: 27 }, duration: 800, note: 'Chase over' },
          { playerId: 'd5', to: { x: 46, y: 29 }, duration: 800, note: 'Contain drive' },
        ],
      },
      {
        id: 'back-screen-roll',
        title: 'Back screen and roll',
        description: 'O2 back-screens D5 just as O5 rolls, making the rim protection late.',
        duration: 1200,
        ball: { carrierId: 'o1' },
        movements: [
          { playerId: 'o2', to: { x: 47, y: 31 }, duration: 800, note: 'Back screen D5' },
          { playerId: 'o5', to: { x: 55, y: 33 }, duration: 950, note: 'Roll behind screen' },
          { playerId: 'o1', to: { x: 52, y: 23 }, duration: 800, note: 'Hold the defender' },
          { playerId: 'd5', to: { x: 49, y: 32 }, duration: 850, note: 'Delayed by screen' },
          { playerId: 'd4', to: { x: 48, y: 39 }, duration: 850, note: 'Tag the roller' },
        ],
      },
      {
        id: 'pop-read',
        title: 'Pop read',
        description: 'After screening, O2 pops out. O1 can hit O5 on the roll or O2 for the open three.',
        duration: 1250,
        ball: { carrierId: 'o2' },
        movements: [
          { playerId: 'o2', to: { x: 60, y: 19 }, duration: 900, note: 'Pop to three' },
          { playerId: 'o5', to: { x: 62, y: 32 }, duration: 850, note: 'Continue to rim' },
          { playerId: 'o1', to: { x: 56, y: 23 }, duration: 700, note: 'Deliver the read' },
          { playerId: 'd2', to: { x: 58, y: 22 }, duration: 900, note: 'Recover late' },
          { playerId: 'd4', to: { x: 58, y: 35 }, duration: 800, note: 'Help inside' },
        ],
      },
    ],
  },
]

export const defaultPlay = plays[0]
