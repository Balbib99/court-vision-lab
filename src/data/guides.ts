export type GuideSection = 'board' | 'playbook' | 'roster' | 'stats'

export type GuideStep = {
  id: string
  title: string
  description: string
  target?: string
  requiredSection?: GuideSection
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'center'
  actionHint?: string
}

export type GuideTask = {
  id: string
  title: string
  description: string
  icon: 'play' | 'timeline' | 'draw' | 'image' | 'json' | 'coach' | 'roster' | 'keyboard' | 'playbook' | 'template'
  steps: GuideStep[]
}

export const guideTasks: GuideTask[] = [
  {
    id: 'create-new-play',
    title: 'Create a new play',
    description: 'Start from a blank board or template, place players, add steps and save it.',
    icon: 'play',
    steps: [
      { id: 'open-playbook', title: 'Open Playbook', description: 'The Playbook view is where you manage plays and start from an empty board.', target: "[data-guide='playbook-nav']", requiredSection: 'board' },
      { id: 'templates', title: 'Use templates', description: 'Board Templates gives you ready-made setups like 5v5, 3v3 and drill boards.', target: "[data-guide='board-templates-button']", requiredSection: 'board' },
      { id: 'edit-mode', title: 'Enter Edit Mode', description: 'Edit Mode unlocks player movement, creation tools and ball assignment.', target: "[data-guide='edit-mode-toggle']", requiredSection: 'board' },
      { id: 'add-offense', title: 'Add offense', description: 'Use +O to add the first missing offensive player from O1 to O5.', target: "[data-guide='add-offense-button']", requiredSection: 'board' },
      { id: 'add-defense', title: 'Add defense', description: 'Use +D to add defenders from D1 to D5 without exceeding 5v5.', target: "[data-guide='add-defense-button']", requiredSection: 'board' },
      { id: 'court', title: 'Move players', description: 'Drag players on the court to set spacing and tactical alignment.', target: "[data-guide='court-board']", requiredSection: 'board' },
      { id: 'add-step', title: 'Add a step', description: 'Save the current player positions as a timeline step for custom plays.', target: "[data-guide='add-step-button']", requiredSection: 'board' },
      { id: 'save-custom', title: 'Save as custom play', description: 'Save the board into My Playbook when the setup is ready.', target: "[data-guide='save-as-play-button']", requiredSection: 'board' },
    ],
  },
  {
    id: 'edit-timeline',
    title: 'Edit a play timeline',
    description: 'Update snapshots, add movement steps and preview the full sequence.',
    icon: 'timeline',
    steps: [
      { id: 'duplicate', title: 'Duplicate first', description: 'Built-in plays are protected. Duplicate one to edit its timeline.', target: "[data-guide='duplicate-play-button']", requiredSection: 'board' },
      { id: 'edit', title: 'Enter Edit Mode', description: 'Timeline editing works best while the board is editable.', target: "[data-guide='edit-mode-toggle']", requiredSection: 'board' },
      { id: 'timeline', title: 'Select a step', description: 'Use the timeline to choose the step you want to inspect or edit.', target: "[data-guide='play-timeline']", requiredSection: 'board' },
      { id: 'court', title: 'Move players', description: 'Adjust player locations on the court for the selected step.', target: "[data-guide='court-board']", requiredSection: 'board' },
      { id: 'update', title: 'Update Step', description: 'Update Step saves the current board snapshot into the active timeline step.', target: "[data-guide='update-step-button']", requiredSection: 'board' },
      { id: 'add', title: 'Add next step', description: 'Add Step appends a new snapshot to continue the play.', target: "[data-guide='add-step-button']", requiredSection: 'board' },
      { id: 'play', title: 'Preview sequence', description: 'Play Full Sequence animates the timeline from step to step.', target: "[data-guide='play-sequence-button']", requiredSection: 'board' },
    ],
  },
  {
    id: 'annotations',
    title: 'Add tactical annotations',
    description: 'Draw movement arrows, pass lines and screen markers on custom play steps.',
    icon: 'draw',
    steps: [
      { id: 'edit', title: 'Enter Edit Mode', description: 'Drawing tools are only active in Edit Mode.', target: "[data-guide='edit-mode-toggle']", requiredSection: 'board' },
      { id: 'movement', title: 'Movement arrow', description: 'Select the movement tool to draw solid arrows on the court.', target: "[data-guide='movement-tool']", requiredSection: 'board' },
      { id: 'pass', title: 'Pass line', description: 'Use the pass tool for dashed passing reads.', target: "[data-guide='pass-tool']", requiredSection: 'board' },
      { id: 'screen', title: 'Screen marker', description: 'Place screen markers to show picks and off-ball screens.', target: "[data-guide='screen-tool']", requiredSection: 'board' },
      { id: 'erase', title: 'Erase annotations', description: 'Erase removes manual annotations from the current step.', target: "[data-guide='erase-tool']", requiredSection: 'board' },
      { id: 'clear', title: 'Clear step annotations', description: 'Use Clear Annotations when you want to reset the current step drawing layer.', target: "[data-guide='clear-annotations-button']", requiredSection: 'board' },
    ],
  },
  {
    id: 'export-png',
    title: 'Export a play as PNG',
    description: 'Capture the current court state as a clean image for sharing.',
    icon: 'image',
    steps: [
      { id: 'step', title: 'Choose a step', description: 'Select the step you want to export from the timeline.', target: "[data-guide='play-timeline']", requiredSection: 'board' },
      { id: 'coach', title: 'Optional Coach Mode', description: 'Coach Mode gives you a cleaner presentation view before exporting.', target: "[data-guide='coach-mode-button']", requiredSection: 'board' },
      { id: 'export', title: 'Export PNG', description: 'Export PNG captures the court, players, ball, movement paths and annotations.', target: "[data-guide='export-png-button']", requiredSection: 'board' },
    ],
  },
  {
    id: 'json',
    title: 'Import / Export JSON',
    description: 'Back up custom plays or move play data between browsers.',
    icon: 'json',
    steps: [
      { id: 'import', title: 'Import JSON', description: 'Import a single play JSON or full playbook backup.', target: "[data-guide='import-json-button']", requiredSection: 'board' },
      { id: 'export', title: 'Export JSON', description: 'Export the active play as a JSON file.', target: "[data-guide='export-json-button']", requiredSection: 'board' },
      { id: 'backup', title: 'Export Playbook', description: 'Export all custom plays as one backup file.', target: "[data-guide='export-playbook-button']", requiredSection: 'board' },
      { id: 'playbook', title: 'Find imported plays', description: 'Imported plays appear in My Playbook alongside other custom plays.', target: "[data-guide='playbook-nav']", requiredSection: 'board' },
    ],
  },
  {
    id: 'coach-mode',
    title: 'Use Coach Mode',
    description: 'Present plays with the court as the main focus.',
    icon: 'coach',
    steps: [
      { id: 'enter', title: 'Enter Coach Mode', description: 'Coach Mode hides editing UI and keeps presentation controls.', target: "[data-guide='coach-mode-button']", requiredSection: 'board' },
      { id: 'controls', title: 'Control the sequence', description: 'Use play, previous, next and reset while presenting.', target: "[data-guide='bottom-controls']", requiredSection: 'board' },
      { id: 'exit', title: 'Exit anytime', description: 'Use the same button or Escape to return to the full workspace.', target: "[data-guide='coach-mode-button']", requiredSection: 'board' },
    ],
  },
  {
    id: 'load-roster',
    title: 'Load a roster to the court',
    description: 'Apply the demo active roster to O1-O5 with player metadata.',
    icon: 'roster',
    steps: [
      { id: 'open-roster', title: 'Open Roster', description: 'Roster contains the active unit and bench players.', target: "[data-guide='roster-nav']", requiredSection: 'board' },
      { id: 'load', title: 'Load Active Roster', description: 'This assigns the five active players to O1-O5 without breaking tactical IDs.', target: "[data-guide='load-roster-button']", requiredSection: 'roster' },
      { id: 'inspect', title: 'Inspect on Board', description: 'Return to Board and select a player to see their name and role.', target: "[data-guide='board-nav']", requiredSection: 'roster' },
    ],
  },
  {
    id: 'shortcuts',
    title: 'Use keyboard shortcuts',
    description: 'Speed up common coaching-board actions from the keyboard.',
    icon: 'keyboard',
    steps: [
      { id: 'keys', title: 'Shortcut map', placement: 'center', description: 'Space: Play/Pause. ArrowRight: Next Step. ArrowLeft: Previous Step. Ctrl/Cmd+S: Save. Ctrl/Cmd+Z: Undo. Ctrl/Cmd+Y or Cmd+Shift+Z: Redo. V/M/P/S/E: Select, Movement, Pass, Screen, Erase. Esc: close guide or exit Coach Mode.' },
    ],
  },
  {
    id: 'manage-custom',
    title: 'Manage custom plays',
    description: 'Load, duplicate and delete plays from the play library.',
    icon: 'playbook',
    steps: [
      { id: 'open', title: 'Open Playbook', description: 'Playbook is the larger management view for built-in and custom plays.', target: "[data-guide='playbook-nav']", requiredSection: 'board' },
      { id: 'cards', title: 'Use play cards', description: 'Cards show difficulty, step count, updated date and actions.', target: "[data-guide='playbook-grid']", requiredSection: 'playbook' },
      { id: 'duplicate', title: 'Duplicate to edit', description: 'Duplicate built-in plays before changing timeline or annotations.', target: "[data-guide='playbook-grid']", requiredSection: 'playbook' },
    ],
  },
  {
    id: 'templates',
    title: 'Use board templates',
    description: 'Start from common tactical setups without building every player manually.',
    icon: 'template',
    steps: [
      { id: 'button', title: 'Open Templates', description: 'The template button opens preset boards like Empty 5v5 and Fast Break Drill.', target: "[data-guide='board-templates-button']", requiredSection: 'board' },
      { id: 'choose', title: 'Choose a template', placement: 'center', description: 'Pick a setup, confirm if you have unsaved changes, then continue editing from the loaded board.' },
      { id: 'edit', title: 'Continue in Edit Mode', description: 'Templates load into an editable board while preserving the 5v5 player limits.', target: "[data-guide='edit-mode-toggle']", requiredSection: 'board' },
    ],
  },
]
