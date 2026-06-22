import fontUrl from '../assets/fonts/Recursive-Variable.woff2?url'
import logoDarkUrl from '../assets/foontik-dark.svg?url'

interface AxisValues {
  wght: number
  slnt: number
  CASL: number
  MONO: number
  CRSV: number
  scale: number
}

interface ExportOptions {
  showWordmark?: boolean
}

function readAxisValues(root: HTMLElement): AxisValues {
  const styles = getComputedStyle(root)
  return {
    wght: parseFloat(styles.getPropertyValue('--fnt-wght')) || 650,
    slnt: parseFloat(styles.getPropertyValue('--fnt-slnt')) || 0,
    CASL: parseFloat(styles.getPropertyValue('--fnt-CASL')) || 0.3,
    MONO: parseFloat(styles.getPropertyValue('--fnt-MONO')) || 0,
    CRSV: parseFloat(styles.getPropertyValue('--fnt-CRSV')) || 0.5,
    scale: parseFloat(styles.getPropertyValue('--fnt-scale')) || 1,
  }
}

async function ensureFontLoaded(): Promise<void> {
  const existing = [...document.fonts].find((face) => face.family === 'Recursive')
  if (existing?.status === 'loaded') return

  const face = new FontFace('Recursive', `url(${fontUrl}) format('woff2')`, {
    weight: '300 1000',
    style: 'oblique -15deg 0deg',
  })
  await face.load()
  document.fonts.add(face)
  await document.fonts.ready
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Logo image failed to load'))
    img.src = src
  })
}

function triggerDownload(blob: Blob, filename: string): void {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

function drawPosterFrame(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = '#0a0a0c'
  ctx.fillRect(0, 0, width, height)

  const gradient = ctx.createRadialGradient(width * 0.2, height * 0.2, 0, width * 0.2, height * 0.2, width * 0.5)
  gradient.addColorStop(0, 'rgba(232, 255, 71, 0.06)')
  gradient.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
  ctx.lineWidth = 1
  const inset = 32
  ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2)
}

/**
 * PNG export via same-origin FontFace + Canvas 2D.
 * Avoids foreignObject SVG (which taints the canvas in Chrome).
 */
export async function exportStageSnapshot(
  target: HTMLElement,
  options: ExportOptions = {},
): Promise<void> {
  const { showWordmark = true } = options
  const root = target.closest('.foontik-root') as HTMLElement | null
  if (!root) throw new Error('Foontik root not found')

  await ensureFontLoaded()

  const targetStyles = getComputedStyle(target)
  const axes = readAxisValues(root)
  const text = target.textContent?.trim() || 'FOONTIK'
  const fontSizePx = parseFloat(targetStyles.fontSize) || 120
  const scaledSize = fontSizePx * axes.scale

  const width = window.innerWidth
  const height = window.innerHeight
  const exportScale = 2
  const dpr = Math.min(window.devicePixelRatio || 1, 3)

  const canvas = document.createElement('canvas')
  canvas.width = width * exportScale * dpr
  canvas.height = height * exportScale * dpr

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')

  ctx.scale(exportScale * dpr, exportScale * dpr)
  drawPosterFrame(ctx, width, height)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = `${Math.round(axes.wght)} ${scaledSize}px "Recursive"`

  const variation = `"MONO" ${axes.MONO}, "CASL" ${axes.CASL}, "wght" ${Math.round(axes.wght)}, "slnt" ${axes.slnt}, "CRSV" ${axes.CRSV}`
  ;(ctx as CanvasRenderingContext2D & { fontVariationSettings?: string }).fontVariationSettings =
    variation

  ctx.fillText(text, width / 2, height / 2)

  if (showWordmark) {
    const logo = await loadImage(logoDarkUrl)
    const logoHeight = 28
    const logoWidth = (logo.naturalWidth / logo.naturalHeight) * logoHeight
    const margin = 40
    ctx.globalAlpha = 0.35
    ctx.drawImage(logo, width - margin - logoWidth, height - margin - logoHeight, logoWidth, logoHeight)
    ctx.globalAlpha = 1
  }

  await new Promise<void>((resolve, reject) => {
    canvas.toBlob(
      (png) => {
        if (!png) {
          reject(new Error('PNG export failed'))
          return
        }
        triggerDownload(png, `foontik-poster-${Date.now()}.png`)
        resolve()
      },
      'image/png',
      1,
    )
  })
}
