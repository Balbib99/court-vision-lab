export function CourtLines() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 56.25"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect x="0.35" y="0.35" width="99.3" height="55.55" fill="none" stroke="var(--court-line)" strokeOpacity="0.45" strokeWidth="0.35" />
      <line x1="50" y1="0.4" x2="50" y2="55.85" stroke="var(--court-line)" strokeOpacity="0.4" strokeWidth="0.25" />
      <circle cx="50" cy="28.125" r="8.6" fill="none" stroke="var(--court-line)" strokeOpacity="0.42" strokeWidth="0.35" />
      <circle cx="50" cy="28.125" r="1.25" fill="var(--court-line)" opacity="0.24" />

      <rect x="0.35" y="17.1" width="19.7" height="22.05" fill="none" stroke="var(--court-line)" strokeOpacity="0.45" strokeWidth="0.35" />
      <path d="M15.2 21.15 A4.05 7 0 0 1 15.2 35.1" fill="none" stroke="var(--court-line)" strokeOpacity="0.34" strokeWidth="0.3" />
      <path d="M0.35 11.8 A22 22 0 0 1 0.35 44.45" fill="none" stroke="var(--court-line)" strokeOpacity="0.42" strokeWidth="0.35" />
      <circle cx="5.2" cy="28.125" r="0.9" fill="none" stroke="var(--accent)" strokeOpacity="0.62" strokeWidth="0.32" />
      <line x1="0.35" y1="24" x2="1.7" y2="24" stroke="var(--court-line)" strokeOpacity="0.5" strokeWidth="0.32" />
      <line x1="0.35" y1="32.25" x2="1.7" y2="32.25" stroke="var(--court-line)" strokeOpacity="0.5" strokeWidth="0.32" />

      <rect x="79.95" y="17.1" width="19.7" height="22.05" fill="none" stroke="var(--court-line)" strokeOpacity="0.45" strokeWidth="0.35" />
      <path d="M84.8 21.15 A4.05 7 0 0 0 84.8 35.1" fill="none" stroke="var(--court-line)" strokeOpacity="0.34" strokeWidth="0.3" />
      <path d="M99.65 11.8 A22 22 0 0 0 99.65 44.45" fill="none" stroke="var(--court-line)" strokeOpacity="0.42" strokeWidth="0.35" />
      <circle cx="94.8" cy="28.125" r="0.9" fill="none" stroke="var(--accent)" strokeOpacity="0.62" strokeWidth="0.32" />
      <line x1="98.3" y1="24" x2="99.65" y2="24" stroke="var(--court-line)" strokeOpacity="0.5" strokeWidth="0.32" />
      <line x1="98.3" y1="32.25" x2="99.65" y2="32.25" stroke="var(--court-line)" strokeOpacity="0.5" strokeWidth="0.32" />
    </svg>
  )
}
