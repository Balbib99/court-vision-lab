export function CourtGrid() {
  return (
    <div
      className="absolute inset-0 opacity-80"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255, 182, 144, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 182, 144, 0.06) 1px, transparent 1px)',
        backgroundSize: '3.5% 6.25%',
      }}
      aria-hidden="true"
    />
  )
}
