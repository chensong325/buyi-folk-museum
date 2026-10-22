import { useEffect, useId, useState, type ImgHTMLAttributes, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { routeGroups, routes, site } from '../data'
import type { PatternItem, PhotoStoryItem, RouteMeta } from '../types'
import { useMuseumAudio } from './AudioProvider'

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 42 42">
        <circle cx="10" cy="12" r="4" />
        <path d="M5 27c8-10 17-14 32-13M6 34c9-9 18-11 30-10" />
      </svg>
    </span>
  )
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { isPlaying, toggle, volume, setVolume, error, hasStarted } = useMuseumAudio()
  const [volumeOpen, setVolumeOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
    setVolumeOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="布依风物志首页">
        <BrandMark />
        <span className="brand-copy">
          <strong>布依风物志</strong>
          <small>BUYI ATLAS</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="主导航">
        {routeGroups.map((group) => (
          <div className="nav-group" key={group.id}>
            <NavLink
              to={group.routes[0].path}
              className="nav-parent"
              aria-haspopup="true"
            >
              {group.name}
            </NavLink>
            <div className="nav-popover">
              {group.routes.map((route) => (
                <NavLink key={route.path} to={route.path}>
                  <span>{route.navTitle}</span>
                  <small>{String(route.order).padStart(2, '0')}</small>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
        <NavLink className="nav-simple" to="/creative">文创</NavLink>
      </nav>

      <div className="header-actions">
        <div className="audio-control">
          <button
            className="icon-button audio-toggle"
            type="button"
            onClick={() => void toggle()}
            aria-label={isPlaying ? '暂停背景音乐' : '播放背景音乐'}
            title={isPlaying ? '暂停背景音乐' : '播放背景音乐'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span className="audio-wave" aria-hidden="true">
              <i /><i /><i />
            </span>
          </button>
          <button
            className="volume-toggle"
            type="button"
            onClick={() => setVolumeOpen((open) => !open)}
            aria-label="调节背景音乐音量"
            aria-expanded={volumeOpen}
          >
            <VolumeIcon />
          </button>
          <AnimatePresence>
            {volumeOpen && (
              <motion.div
                className="volume-panel"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <span>背景音乐</span>
                <input
                  aria-label="背景音乐音量"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                />
                <small>{Math.round(volume * 100)}%</small>
                {error && <em>{error}</em>}
                {!hasStarted && !error && <em>点击播放按钮开启</em>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mobile-menu-head">
              <span>展馆导览</span>
              <button type="button" onClick={() => setMenuOpen(false)}>关闭</button>
            </div>
            <nav aria-label="移动端主导航">
              {routeGroups.map((group) => (
                <section key={group.id}>
                  <p>{group.name}<span>{group.subtitle}</span></p>
                  {group.routes.map((route) => (
                    <NavLink key={route.path} to={route.path}>
                      <small>{String(route.order).padStart(2, '0')}</small>
                      {route.navTitle}
                    </NavLink>
                  ))}
                </section>
              ))}
              <section>
                <p>延展<span>当代转译</span></p>
                <NavLink to="/creative"><small>13</small>布依文创</NavLink>
                <NavLink to="/copyright"><small>14</small>版权声明</NavLink>
              </section>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function PlayIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4.5v11l8-5.5-8-5.5Z" /></svg>
}
function PauseIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 4.5v11M13.5 4.5v11" /></svg>
}
function VolumeIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 8v4h3l4 3V5L7 8H4Z" />
      <path d="M13.5 7.5c1.4 1.4 1.4 3.6 0 5M15.8 5.2c2.9 2.9 2.9 6.7 0 9.6" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <BrandMark />
        <div>
          <strong>{site.name}</strong>
          <p>{site.fullName}</p>
        </div>
      </div>
      <div className="footer-links">
        {routeGroups.map((group) => (
          <Link key={group.id} to={group.routes[0].path}>{group.name}</Link>
        ))}
        <Link to="/creative">布依文创</Link>
        <Link to="/copyright">版权声明</Link>
      </div>
      <p className="footer-note">以当代浏览方式，保存山地生活的细节与声音。</p>
    </footer>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">跳至主要内容</a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  )
}

export function ResponsiveImage({
  src,
  alt,
  sizes = '100vw',
  loading = 'lazy',
  ...rest
}: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & { src: string; alt: string; sizes?: string }) {
  const base = src.endsWith('.webp') ? src.slice(0, -5) : src
  const baseWidth = /\/image1\.webp$/.test(src) ? 876 : 1400
  return (
    <img
      src={src}
      srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w, ${src} ${baseWidth}w`}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding="async"
      {...rest}
    />
  )
}
export function PageHero({
  route,
  image,
  imageAlt,
  imageCaption,
  children,
  compact = false,
}: {
  route: RouteMeta
  image: string
  imageAlt: string
  imageCaption?: string
  children?: ReactNode
  compact?: boolean
}) {
  return (
    <section className={`page-hero ${compact ? 'page-hero-compact' : ''}`}>
      <div className="page-hero-copy">
        <Reveal>
          <p className="eyebrow"><span>{route.eyebrow}</span><i /></p>
          <h1>{route.title}</h1>
          <p className="lede">{route.description}</p>
          {children}
        </Reveal>
      </div>
      <Reveal className="page-hero-image" delay={0.08}>
        <ResponsiveImage src={image} alt={imageAlt} sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 46vw" loading="eager" fetchPriority="high" />
        {imageCaption && <figcaption>{imageCaption}</figcaption>}
      </Reveal>
      <span className="hero-index" aria-hidden="true">{String(route.order).padStart(2, '0')}</span>
    </section>
  )
}

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  children,
  align = 'left',
}: {
  index?: string
  eyebrow: string
  title: string
  children?: ReactNode
  align?: 'left' | 'center'
}) {
  return (
    <div className={`section-heading section-heading-${align}`}>
      {index && <span className="section-index">{index}</span>}
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {children && <p className="section-copy">{children}</p>}
      </div>
    </div>
  )
}

export function PhotoStory({ item }: { item: PhotoStoryItem }) {
  return (
    <Reveal className={`photo-story ${item.reverse ? 'photo-story-reverse' : ''}`}>
      <figure className="photo-story-image">
        <ResponsiveImage src={item.image.src} alt={item.image.alt} sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 54vw" />
        {item.image.caption && <figcaption>{item.image.caption}</figcaption>}
      </figure>
      <div className="photo-story-copy">
        <p className="eyebrow">{item.kicker}</p>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
      </div>
    </Reveal>
  )
}

export function QuoteBand({ mark = '“', children, source }: { mark?: string; children: ReactNode; source?: string }) {
  return (
    <Reveal className="quote-band">
      <span className="quote-mark" aria-hidden="true">{mark}</span>
      <blockquote>{children}</blockquote>
      {source && <p>{source}</p>}
    </Reveal>
  )
}

export function ChapterFooter({ route }: { route: RouteMeta }) {
  const nextRoute = routes.find((item) => item.path === route.nextPath)
  return (
    <section className="chapter-footer">
      <div>
        <p className="eyebrow">继续参观</p>
        <h2>{route.nextLabel}</h2>
        <p>{nextRoute?.description}</p>
      </div>
      <Link className="round-link" to={route.nextPath} aria-label={`前往${route.nextLabel}`}>
        <span>下一章</span>
        <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 24h23M27 16l8 8-8 8" /></svg>
      </Link>
    </section>
  )
}

export function PatternGlyph({
  glyph,
  color = 'currentColor',
  compact = false,
}: Pick<PatternItem, 'glyph'> & { color?: string; compact?: boolean }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      className={`pattern-glyph ${compact ? 'pattern-glyph-compact' : ''}`}
      viewBox="0 0 240 240"
      aria-hidden="true"
      style={{ color }}
    >
      <defs>
        <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
          {glyph === 'diamond' && <path d="M20 2 38 20 20 38 2 20Z" fill="none" stroke="currentColor" strokeWidth="3" />}
          {glyph === 'wave' && <path d="M0 23c10-16 20-16 30 0s20 16 30 0" fill="none" stroke="currentColor" strokeWidth="3" />}
          {glyph === 'field' && <><path d="M0 20h40M20 0v40" stroke="currentColor" strokeWidth="2" /><circle cx="20" cy="20" r="4" fill="currentColor" /></>}
          {glyph === 'fret' && <path d="M4 36V10h18v16h14V4M36 36V22H20" fill="none" stroke="currentColor" strokeWidth="3" />}
          {glyph === 'drum' && <><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M20 3v10M20 27v10M3 20h10M27 20h10" stroke="currentColor" strokeWidth="2" /></>}
          {glyph === 'grain' && <><path d="M20 5 35 20 20 35 5 20Z" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="20" cy="20" r="3" fill="currentColor" /></>}
        </pattern>
      </defs>
      <rect width="240" height="240" fill={`url(#${id}-grid)`} />
      {glyph === 'drum' && <circle cx="120" cy="120" r="78" fill="none" stroke="currentColor" strokeWidth="2" opacity=".55" />}
    </svg>
  )
}

export function SoundIcon() {
  return (
    <svg className="sound-icon" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M8 26h10L32 14v36L18 38H8V26Z" />
      <path d="M41 22c6 6 6 14 0 20M49 15c10 10 10 24 0 34" />
    </svg>
  )
}

export function ImageNote({ src, alt, index }: { src: string; alt: string; index: string }) {
  return (
    <figure className="image-note">
      <ResponsiveImage src={src} alt={alt} sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 50vw" />
      <figcaption><span>{index}</span>{alt}</figcaption>
    </figure>
  )
}




