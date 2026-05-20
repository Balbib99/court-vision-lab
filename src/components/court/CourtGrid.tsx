export function CourtGrid() {
  return (
    <div
      className="absolute inset-0 opacity-80"
      style={{
        backgroundImage:
          'linear-gradient(var(--court-grid) 1px, transparent 1px), linear-gradient(90deg, var(--court-grid) 1px, transparent 1px)',
        backgroundSize: '3.5% 6.25%',
      }}
      aria-hidden="true"
    />
  )
}
