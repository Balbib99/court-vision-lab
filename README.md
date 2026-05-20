# Court Vision Lab

Court Vision Lab is an interactive basketball tactics board built with React and TypeScript. It allows users to visualize and replay offensive plays through animated player movement, tactical panels and a polished dark interface.

## Preview / Demo

The current MVP is designed as a frontend-only tactical dashboard. It includes a full-court 2D board, animated player markers, a visible ball marker, playback controls and a tactical details panel.

Deployment target: Vercel.

## Features

- Interactive 2D basketball court
- Animated player movement
- Predefined Pick and Roll play
- Offensive and defensive player markers
- Ball marker
- Tactical details panel
- Playback controls
- Responsive tactical dashboard UI
- Built with reusable TypeScript data models

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

## Project Goals

The goal of Court Vision Lab is to present a portfolio-quality frontend application that feels like a real tactical tool for coaches, analysts and basketball creators. The MVP focuses on clean interaction, polished visual design and a data model that can later support a play editor, persistence, export features and a 3D court view.

## Current MVP Status

The MVP currently supports selecting a predefined play, replaying animated player movement, resetting the sequence and reading tactical context for each play. The play data is separated from the rendering layer so it can be reused by future 2D, 3D or editor experiences.

Included plays:

- Pick and Roll
- Horns
- Fast Break

## Roadmap

- Add more plays: Horns, Fast Break, Spain Pick and Roll
- Add play timeline
- Add drag-and-drop player editing
- Add custom play creation
- Add localStorage persistence
- Add export as image
- Add optional 3D court view with Three.js / React Three Fiber

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Folder Structure

```text
src/
  components/
    court/
      Court.tsx
      CourtLines.tsx
      CourtGrid.tsx
      PlayerMarker.tsx
      BallMarker.tsx
      MovementPath.tsx
    layout/
      AppShell.tsx
      TopBar.tsx
      Sidebar.tsx
      RightToolbar.tsx
      BottomControls.tsx
    plays/
      PlaySelector.tsx
      PlayDetailsPanel.tsx
  data/
    plays.ts
  hooks/
    usePlayAnimation.ts
  types/
    play.ts
  utils/
    positions.ts
  App.tsx
  main.tsx
  index.css
```

## What I Learned

- Designing a reusable TypeScript model for tactical play data.
- Keeping animation state separate from rendering components.
- Building a dashboard-style interface with Tailwind CSS.
- Using Framer Motion for clear, controlled player movement.
- Structuring a frontend MVP so future features can be added without rewriting the core logic.

## Future Improvements

- Add a richer play timeline with manual step navigation.
- Add editable player positions with drag-and-drop.
- Store custom plays in localStorage.
- Export play diagrams as images.
- Add keyboard shortcuts for playback.
- Add a future 3D court mode with Three.js or React Three Fiber.

## Author

Built by Balbi as a portfolio project.
