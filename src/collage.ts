import { patterns } from './data'
import type { CollagePlacement, PatternItem } from './types'

export const COLLAGE_KEY = 'buyi:collage:v1'
export const MAX_COLLAGE_ITEMS = 5
export const MIN_COLLAGE_ITEMS = 3

export function clampPlacement(value: number, min = 8, max = 92) {
  return Math.min(max, Math.max(min, value))
}

export function createPlacement(patternId: string, index: number): CollagePlacement {
  const positions = [
    [35, 36],
    [63, 40],
    [48, 63],
    [28, 65],
    [73, 66],
  ]
  const [x, y] = positions[index % positions.length]
  return {
    instanceId: `${patternId}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    patternId,
    x,
    y,
    scale: 1,
    rotation: index % 2 === 0 ? -8 : 7,
  }
}

export function parseStoredCollage(raw: string | null): CollagePlacement[] {
  if (!raw) return []
  try {
    const value: unknown = JSON.parse(raw)
    if (!Array.isArray(value)) return []
    return value
      .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map((item) => ({
        instanceId: typeof item.instanceId === 'string' ? item.instanceId : `saved-${Math.random()}`,
        patternId: typeof item.patternId === 'string' ? item.patternId : 'diamond',
        x: clampPlacement(Number(item.x) || 50),
        y: clampPlacement(Number(item.y) || 50),
        scale: Math.min(1.8, Math.max(0.6, Number(item.scale) || 1)),
        rotation: Number(item.rotation) || 0,
      }))
      .filter((item) => patterns.some((pattern) => pattern.id === item.patternId))
      .slice(0, MAX_COLLAGE_ITEMS)
  } catch {
    return []
  }
}

function drawGlyph(
  ctx: CanvasRenderingContext2D,
  glyph: PatternItem['glyph'],
  x: number,
  y: number,
  size: number,
  color: string,
) {
  const s = size / 240
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(s, s)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()

  if (glyph === 'diamond') {
    for (let row = -1; row <= 2; row += 1) {
      for (let col = -1; col <= 2; col += 1) {
        const cx = 40 + col * 60 + (row % 2) * 30
        const cy = 30 + row * 60
        ctx.moveTo(cx, cy - 20)
        ctx.lineTo(cx + 20, cy)
        ctx.lineTo(cx, cy + 20)
        ctx.lineTo(cx - 20, cy)
        ctx.closePath()
      }
    }
  } else if (glyph === 'wave') {
    for (let row = 0; row < 5; row += 1) {
      const yy = 42 + row * 40
      ctx.moveTo(-10, yy)
      for (let x0 = -10; x0 <= 250; x0 += 60) {
        ctx.bezierCurveTo(x0 + 15, yy - 24, x0 + 45, yy - 24, x0 + 60, yy)
      }
    }
  } else if (glyph === 'field') {
    for (let i = 0; i <= 6; i += 1) {
      ctx.moveTo(i * 40, 0)
      ctx.lineTo(i * 40, 240)
      ctx.moveTo(0, i * 40)
      ctx.lineTo(240, i * 40)
    }
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < 6; col += 1) {
        if ((row + col) % 2 === 0) ctx.fillRect(col * 40 + 15, row * 40 + 15, 10, 10)
      }
    }
  } else if (glyph === 'fret') {
    for (let i = 0; i < 3; i += 1) {
      const offset = i * 70
      ctx.moveTo(10 + offset, 230)
      ctx.lineTo(10 + offset, 20)
      ctx.lineTo(58 + offset, 20)
      ctx.lineTo(58 + offset, 120)
      ctx.lineTo(95 + offset, 120)
    }
  } else if (glyph === 'drum') {
    for (let r = 28; r <= 105; r += 26) {
      ctx.moveTo(120 + r, 120)
      ctx.arc(120, 120, r, 0, Math.PI * 2)
    }
    ctx.stroke()
    for (let i = 0; i < 16; i += 1) {
      const angle = (Math.PI * 2 * i) / 16
      ctx.beginPath()
      ctx.moveTo(120 + Math.cos(angle) * 108, 120 + Math.sin(angle) * 108)
      ctx.lineTo(120 + Math.cos(angle) * 124, 120 + Math.sin(angle) * 124)
      ctx.stroke()
    }
    ctx.beginPath()
  } else {
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < 6; col += 1) {
        const cx = 25 + col * 38 + (row % 2) * 19
        const cy = 24 + row * 38
        ctx.moveTo(cx, cy - 8)
        ctx.lineTo(cx + 8, cy)
        ctx.lineTo(cx, cy + 8)
        ctx.lineTo(cx - 8, cy)
        ctx.closePath()
      }
    }
  }
  ctx.stroke()
  ctx.restore()
}

export async function renderCollageBlob(placements: CollagePlacement[], size = 1080): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')

  ctx.fillStyle = '#F7F2E8'
  ctx.fillRect(0, 0, size, size)
  ctx.strokeStyle = '#143D5C'
  ctx.lineWidth = 2
  ctx.strokeRect(42, 42, size - 84, size - 84)

  ctx.fillStyle = '#143D5C'
  ctx.font = '600 34px "Noto Serif SC", serif'
  ctx.fillText('我的布依纹样卡', 72, 116)
  ctx.font = '18px "Noto Sans SC", sans-serif'
  ctx.fillStyle = '#6B6D66'
  ctx.fillText('BUYI PATTERN STUDY · 2026', 72, 148)

  for (const placement of placements) {
    const pattern = patterns.find((item) => item.id === placement.patternId)
    if (!pattern) continue
    const baseSize = size * 0.24 * placement.scale
    ctx.save()
    ctx.translate((placement.x / 100) * size, (placement.y / 100) * size)
    ctx.rotate((placement.rotation * Math.PI) / 180)
    drawGlyph(ctx, pattern.glyph, -baseSize / 2, -baseSize / 2, baseSize, pattern.color)
    ctx.restore()
  }

  ctx.fillStyle = '#6B6D66'
  ctx.font = '18px "Noto Sans SC", sans-serif'
  ctx.fillText('让传统纹样融入现代审美，让非遗在指尖活起来。', 72, size - 92)
  ctx.textAlign = 'right'
  ctx.fillText('布依风物志', size - 72, size - 92)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Unable to export image'))
    }, 'image/png')
  })
}
