import { useCallback, useRef, useState } from 'react'
import { toPng } from 'html-to-image'

type ExportStatus = 'idle' | 'exporting' | 'exported' | 'failed'

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'court-vision-lab'

const downloadPng = (dataUrl: string, filename: string) => {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

export function useExportCourt() {
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle')
  const statusTimerRef = useRef<number | undefined>(undefined)

  const exportCourt = useCallback(async (target: HTMLElement | null, name: string, stepIndex: number) => {
    if (!target) {
      setExportStatus('failed')
      return
    }

    if (statusTimerRef.current) {
      window.clearTimeout(statusTimerRef.current)
    }

    setExportStatus('exporting')

    try {
      const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#111827',
      })
      downloadPng(dataUrl, `court-vision-lab-${slugify(name)}-step-${stepIndex + 1}.png`)
      setExportStatus('exported')
    } catch (error) {
      console.error('Court export failed', error)
      setExportStatus('failed')
    }

    statusTimerRef.current = window.setTimeout(() => {
      setExportStatus('idle')
      statusTimerRef.current = undefined
    }, 1800)
  }, [])

  return {
    exportCourt,
    exportStatus,
  }
}
