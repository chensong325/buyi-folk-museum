import { describe, expect, it } from 'vitest'
import { clampPlacement, createPlacement, parseStoredCollage } from '../collage'

describe('collage helpers', () => {
  it('clamps placements inside the printable canvas', () => {
    expect(clampPlacement(-10)).toBe(8)
    expect(clampPlacement(33)).toBe(33)
    expect(clampPlacement(120)).toBe(92)
  })

  it('creates a valid placement with stable pattern identity', () => {
    const item = createPlacement('wave', 1)
    expect(item.patternId).toBe('wave')
    expect(item.x).toBeGreaterThanOrEqual(8)
    expect(item.y).toBeGreaterThanOrEqual(8)
    expect(item.scale).toBe(1)
  })

  it('restores valid saved placements and ignores malformed entries', () => {
    const restored = parseStoredCollage(JSON.stringify([
      { instanceId: 'a', patternId: 'wave', x: 45, y: 55, scale: 1.2, rotation: 5 },
      { instanceId: 'b', patternId: 'unknown', x: 20, y: 20, scale: 1, rotation: 0 },
    ]))
    expect(restored).toHaveLength(1)
    expect(restored[0].patternId).toBe('wave')
  })

  it('returns an empty list for malformed storage', () => {
    expect(parseStoredCollage('not json')).toEqual([])
    expect(parseStoredCollage(null)).toEqual([])
  })
})
