export type ThemeId = 'home' | 'craft' | 'stage' | 'season' | 'creative' | 'about'

export interface MediaAsset {
  src: string
  alt: string
  caption?: string
  position?: string
  creditRequired: false
}

export interface ThemeEntry {
  id: Exclude<ThemeId, 'home' | 'about'>
  index: string
  name: string
  subtitle: string
  description: string
  image: string
  route: string
  accent: string
}

export interface RouteMeta {
  path: string
  navTitle: string
  title: string
  eyebrow: string
  description: string
  theme: ThemeId
  order: number
  nextPath: string
  nextLabel: string
}

export interface PatternItem {
  id: string
  name: string
  category: string
  meaning: string
  story: string
  glyph: 'diamond' | 'wave' | 'field' | 'fret' | 'drum' | 'grain'
  color: string
}

export interface CostumeHotspot {
  id: string
  label: string
  x: number
  y: number
  description: string
}

export interface TimelineStop {
  id: string
  label: string
  time: string
  title: string
  description: string
}

export interface MapRegion {
  id: string
  name: string
  x: number
  y: number
  tags: string[]
  description: string
}

export interface CreativeItem {
  id: string
  name: string
  material: string
  description: string
  glyph: PatternItem['glyph']
  color: string
}

export interface CollagePlacement {
  instanceId: string
  patternId: string
  x: number
  y: number
  scale: number
  rotation: number
}

export interface InstrumentItem {
  name: string
  role: string
  description: string
}

export interface FoodColorItem {
  color: string
  ink: string
  name: string
  source: string
  note: string
}

export interface PhotoStoryItem {
  image: MediaAsset
  kicker: string
  title: string
  body: string
  reverse?: boolean
}
