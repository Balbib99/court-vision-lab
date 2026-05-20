---
name: Pro-Court Tactical
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#909097'
  outline-variant: '#45464d'
  surface-tint: '#bec6e0'
  primary: '#bec6e0'
  on-primary: '#283044'
  primary-container: '#0f172a'
  on-primary-container: '#798098'
  inverse-primary: '#565e74'
  secondary: '#ffb3ad'
  on-secondary: '#68000a'
  secondary-container: '#a40217'
  on-secondary-container: '#ffaea8'
  tertiary: '#adc6ff'
  on-tertiary: '#002e6a'
  tertiary-container: '#00163a'
  on-tertiary-container: '#357df1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3ad'
  on-secondary-fixed: '#410004'
  on-secondary-fixed-variant: '#930013'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  player-number:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 18px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-uppercase:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  baseline: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  toolbar-height: 64px
---

## Brand & Style
The design system focuses on high-stakes performance and tactical clarity. It targets professional coaching staffs and analysts who require split-second readability and a distraction-free environment. The aesthetic merges the physical presence of a high-end basketball arena with a sophisticated digital overlay.

The style is **Professional / Functional Minimalism** infused with **Glassmorphism**. By using semi-transparent, blurred menu systems, the UI maintains the "court context" even when adjusting settings or player rosters. The emotional response is one of authority, precision, and focus.

## Colors
The palette is rooted in a deep, rubberized slate-blue (`#1E293B`) to represent the court surface, providing a low-strain background for long tactical sessions. 

- **Primary:** Deep Navy/Slate for the base environment.
- **Secondary (Away/Home A):** Vibrant Red for high visibility on player icons and aggressive tactical lines.
- **Tertiary (Home/Away B):** Electric Blue for clear distinction between opposing teams.
- **Neutral:** Stark white and light grays for court markings (key, three-point line, sidelines) and typography.
- **Functional Glass:** A semi-transparent layer of the primary color with 70% opacity and high-refraction blur for overlays.

## Typography
Inter is utilized for its exceptional legibility and neutral, systematic feel. The hierarchy is designed for quick scanning:
- **Display & Headlines:** Heavy weights (700-800) for scoreboards, period clocks, and drill names.
- **Player Numbers:** Bold, centered within player markers for instant recognition.
- **Labels:** Uppercase with increased tracking for technical settings and court-side data.
- **Body:** Clean, medium-sized text for play descriptions and coaching notes.

## Layout & Spacing
The design system employs a **Fixed Content Grid** for the court area to ensure tactical accuracy, surrounded by **Fluid Overlays** for controls. 

- **Court Area:** Maintain a 16:9 or 3:2 aspect ratio container to represent the full or half-court, centered in the viewport.
- **Safe Zones:** 32px internal padding from the viewport edge on desktop; 16px on mobile.
- **Sidebars:** Toolbars use a fixed 64px width on the left or right to maximize the central "action" area.
- **Breakpoints:** On mobile, sidebars collapse into a bottom sheet to preserve the horizontal width of the basketball court.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Tonal Layering** rather than traditional shadows, ensuring the UI feels like a modern "heads-up display" (HUD).

1.  **Level 0 (Base):** The court surface (`#1E293B`) with high-contrast white lines (`#F8FAFC`, 0.8 opacity).
2.  **Level 1 (Interaction Layer):** Player markers and ball icons. These use subtle outer glows in their respective team colors to indicate selection.
3.  **Level 2 (Menu Overlays):** Semi-transparent surfaces with a 20px backdrop-blur and a 1px white border (0.1 opacity) to define the edge.
4.  **Level 3 (Modals/Popovers):** Higher contrast glass with a secondary inner stroke to simulate thick, polished acrylic.

## Shapes
The design system uses a **Rounded** (0.5rem) language to balance the aggressive, sharp lines of a basketball court with a modern software feel.

- **Player Markers:** Perfect circles to differentiate from the rectangular nature of the court.
- **Action Buttons:** `rounded-lg` (1rem) for a tactile, "pressable" feel.
- **Menu Containers:** `rounded-xl` (1.5rem) to soften the edges of the technical HUD overlays.
- **Input Fields:** `rounded-md` (0.5rem) for a clean, professional appearance.

## Components
- **Player Chips:** Circular avatars with a thick team-colored border. When active, they feature a pulsing glow. Numbers are centered in bold white.
- **Tactical Lines:** Solid lines for player movement, dashed lines for passes, and zig-zag lines for dribbling. Ends feature arrowheads or "T" bars for screens.
- **Glass Toolbars:** Vertical floating bars with blurred backgrounds. Icons are white, turning to the primary brand color when active.
- **Control Cards:** Semi-transparent cards for "Play Properties" or "Roster Management," featuring subtle dividers and high-contrast typography.
- **Timeline / Scrubber:** A thin horizontal bar at the bottom with a high-contrast playhead, allowing coaches to flip through frames of a play.
- **Floating Action Buttons (FAB):** For "Add Player" or "Record Play," using a solid white background with dark icons to pop against the glass and court layers.