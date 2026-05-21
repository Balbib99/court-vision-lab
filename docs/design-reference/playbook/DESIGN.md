---
name: Pro-Court Tactical
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#e0c0b1'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#a78b7d'
  outline-variant: '#584237'
  surface-tint: '#ffb690'
  primary: '#ffb690'
  on-primary: '#552100'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#9d4300'
  secondary: '#ffca45'
  on-secondary: '#3f2e00'
  secondary-container: '#e4ae00'
  on-secondary-container: '#5b4400'
  tertiary: '#ccc5c1'
  on-tertiary: '#33302d'
  tertiary-container: '#9f9995'
  on-tertiary-container: '#35312f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#ffdf9a'
  secondary-fixed-dim: '#f7be1d'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4300'
  tertiary-fixed: '#e8e1dd'
  tertiary-fixed-dim: '#ccc5c1'
  on-tertiary-fixed: '#1e1b19'
  on-tertiary-fixed-variant: '#4a4643'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Anton
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  headline-md:
    fontFamily: Anton
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  max-width: 1440px
---

## Brand & Style
The design system embodies the high-stakes, data-driven environment of professional basketball operations. It balances the raw energy of the hardwood with the cold precision of tactical software. The target audience includes coaches, scouts, and front-office analysts who require rapid information processing under pressure.

The aesthetic is **Tactical Corporate**, characterized by:
- **Professional Intensity:** High-contrast interfaces that command attention.
- **Data-First Hierarchy:** A focus on legibility and information density.
- **Athletic Edge:** Subtle nods to sports equipment through texture and bold geometric forms.
- **Premium Execution:** A dark-mode default that reduces eye strain during late-night film sessions while feeling like an "Official League" utility.

## Colors
The palette is rooted in the "Arena Atmosphere." 

- **Hardwood Orange (Primary):** A vibrant #F97316 used for primary actions, active states, and critical data points. It represents the ball and the energy of the game.
- **Trophy Gold (Secondary):** Used for highlights, achievements, and premium tier information.
- **Midnight & Charcoal:** The foundation of the UI. #09090B is used for the deepest backgrounds, while #18181B creates a layered surface effect for containers and cards.
- **Hardwood Accent:** A deep #78350F used sparingly for subtle dividers or "court-side" decorative elements to ground the digital experience in the physical sport.

## Typography
The typographic system is built for impact and precision.

- **Headlines (Anton):** Bold, condensed, and authoritative. Anton provides the "scoreboard" aesthetic, making headers feel like official announcements.
- **Body (Hanken Grotesk):** A modern, sharp sans-serif that ensures high readability for long-form scouting reports and player bios.
- **Data & Labels (JetBrains Mono):** A monospaced font used for tactical coordinates, jersey numbers, and statistical data to emphasize the technical nature of the tool.

## Layout & Spacing
The layout follows a **Rigid Tactical Grid**. Information is organized into modular blocks that mimic a coach's clipboard or a broadcast stat-sheet.

- **Grid:** A 12-column system on desktop with fixed 24px gutters.
- **Density:** High information density is preferred. Use 8px (base) increments for internal component spacing.
- **Alignment:** Content should lean towards left-aligned structures for scanability, with statistical data right-aligned for easy comparison.
- **Mobile:** Reflows to a single column with increased vertical padding (32px) between major sections to allow for touch-friendly navigation of data tables.

## Elevation & Depth
In this design system, depth is communicated through **Tonal Stacking** and **Subtle Outlines** rather than heavy shadows.

- **Surface Tiers:**
  - Base: #09090B (Background)
  - Level 1: #18181B (Cards, Sidebars)
  - Level 2: #27272A (Modals, Hover states)
- **Outlines:** Use a 1px solid stroke (#3F3F46) to define container boundaries, ensuring clear separation without visual clutter.
- **Tactical Overlays:** Use semi-transparent Hardwood Orange overlays (10-20% opacity) for highlighting selected court zones or active player tracks.

## Shapes
The shape language is **Industrial and Sharp**. 

- **Sharp Edges:** 0px rounding is the standard for all containers, buttons, and input fields to maintain a serious, high-tech tactical feel.
- **Angled Accents:** Use 45-degree chamfered corners for decorative elements or specific status badges to mimic the aggressive lines of modern sports arenas.
- **Stroke Weights:** Maintain a consistent 1px or 2px stroke for all borders to ensure the UI feels structural and engineered.

## Components

- **Buttons:** Sharp-edged and high-contrast. Primary buttons are solid Hardwood Orange with black text. Secondary buttons are outlined in orange with orange text.
- **Data Chips:** Use JetBrains Mono for text. Dark charcoal backgrounds with primary-colored left-border accents to categorize data types (e.g., Offense, Defense, Transition).
- **Input Fields:** Dark background (#09090B) with a sharp 1px border. On focus, the border turns Hardwood Orange. Labels are always placed above the field in uppercase JetBrains Mono.
- **Tactical Cards:** No shadows. Defined by their #18181B background and a subtle top-border in Hardwood Orange for "active" or "priority" cards.
- **Scoreboard Lists:** High-density lists with zebra-striping (#18181B and #09090B). Use monospaced numbers for statistical alignment.
- **Court Visualizers:** Interactive diagrams should use the Wood Accent (#78350F) for court lines, set against a dark floor texture.