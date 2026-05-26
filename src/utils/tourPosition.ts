export type TourRect = {
  height: number
  left: number
  top: number
  width: number
}

export type TourPlacement = 'top' | 'right' | 'bottom' | 'left' | 'center'

type ViewportSize = {
  height: number
  width: number
}

export type TourCardPosition = {
  left: number | string
  placement: TourPlacement
  top: number | string
  transform?: string
}

export type OverlayPiece = {
  height: number
  left: number
  top: number
  width: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const getSpotlightRect = (
  rect: TourRect,
  viewport: ViewportSize,
  padding = 10,
): TourRect => {
  const left = clamp(rect.left - padding, 0, viewport.width)
  const top = clamp(rect.top - padding, 0, viewport.height)
  const right = clamp(rect.left + rect.width + padding, 0, viewport.width)
  const bottom = clamp(rect.top + rect.height + padding, 0, viewport.height)

  return {
    height: Math.max(0, bottom - top),
    left,
    top,
    width: Math.max(0, right - left),
  }
}

export const getSpotlightOverlayPieces = (
  spotlight: TourRect,
  viewport: ViewportSize,
): OverlayPiece[] => {
  const right = spotlight.left + spotlight.width
  const bottom = spotlight.top + spotlight.height

  return [
    { left: 0, top: 0, width: viewport.width, height: spotlight.top },
    { left: 0, top: bottom, width: viewport.width, height: Math.max(0, viewport.height - bottom) },
    { left: 0, top: spotlight.top, width: spotlight.left, height: spotlight.height },
    { left: right, top: spotlight.top, width: Math.max(0, viewport.width - right), height: spotlight.height },
  ].filter((piece) => piece.width > 0 && piece.height > 0)
}

export const getBestTourCardPosition = (
  target: TourRect | undefined,
  preferredPlacement: TourPlacement | undefined,
  viewport: ViewportSize,
): TourCardPosition => {
  if (!target || preferredPlacement === 'center') {
    return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', placement: 'center' }
  }

  const margin = 18
  const safe = 16
  const cardWidth = Math.min(380, viewport.width - safe * 2)
  const cardHeight = Math.min(270, viewport.height - safe * 2)
  const placementOrder: TourPlacement[] = ['right', 'left', 'bottom', 'top', 'center']
  const placements: TourPlacement[] = preferredPlacement
    ? [preferredPlacement, ...placementOrder.filter((placement) => placement !== preferredPlacement)]
    : placementOrder

  const targetCenterX = target.left + target.width / 2
  const targetCenterY = target.top + target.height / 2
  const candidates: Record<TourPlacement, TourCardPosition> = {
    right: {
      left: target.left + target.width + margin,
      top: clamp(targetCenterY - cardHeight / 2, safe, viewport.height - cardHeight - safe),
      placement: 'right',
    },
    left: {
      left: target.left - cardWidth - margin,
      top: clamp(targetCenterY - cardHeight / 2, safe, viewport.height - cardHeight - safe),
      placement: 'left',
    },
    bottom: {
      left: clamp(targetCenterX - cardWidth / 2, safe, viewport.width - cardWidth - safe),
      top: target.top + target.height + margin,
      placement: 'bottom',
    },
    top: {
      left: clamp(targetCenterX - cardWidth / 2, safe, viewport.width - cardWidth - safe),
      top: target.top - cardHeight - margin,
      placement: 'top',
    },
    center: { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', placement: 'center' },
  }

  const fits = (position: TourCardPosition) => {
    if (typeof position.left !== 'number' || typeof position.top !== 'number') {
      return true
    }

    return (
      position.left >= safe &&
      position.top >= safe &&
      position.left + cardWidth <= viewport.width - safe &&
      position.top + cardHeight <= viewport.height - safe
    )
  }

  return placements.map((placement) => candidates[placement]).find(fits) ?? candidates.center
}
