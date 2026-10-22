import { describe, expect, it } from 'vitest'
import { patterns, routeGroups, routes, themes } from '../data'

describe('content model', () => {
  it('defines all fifteen planned pages with unique routes', () => {
    expect(routes).toHaveLength(15)
    expect(new Set(routes.map((route) => route.path)).size).toBe(15)
  })

  it('groups thirteen cultural topics into three wings', () => {
    expect(themes).toHaveLength(3)
    expect(routeGroups.flatMap((group) => group.routes)).toHaveLength(12)
    expect(patterns).toHaveLength(6)
  })

  it('links every chapter to an existing next route', () => {
    const paths = new Set(routes.map((route) => route.path))
    for (const route of routes) {
      expect(paths.has(route.nextPath), `${route.path} -> ${route.nextPath}`).toBe(true)
    }
  })

  it('keeps visual pattern identifiers unique', () => {
    expect(new Set(patterns.map((pattern) => pattern.id)).size).toBe(patterns.length)
    expect(new Set(patterns.map((pattern) => pattern.glyph)).size).toBe(patterns.length)
  })
})
