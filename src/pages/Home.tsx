import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { heroImage, site, themes } from '../data'
import { Reveal } from '../components/Site'
import { useMuseumAudio } from '../components/AudioProvider'

const INTRO_KEY = 'buyi:intro-seen'

export function SplashGate({ onEntered }: { onEntered: () => void }) {
  const { play } = useMuseumAudio()
  const [leaving, setLeaving] = useState(false)

  const enter = () => {
    if (leaving) return
    setLeaving(true)
    localStorage.setItem(INTRO_KEY, '1')
    void play()
    window.setTimeout(onEntered, 700)
  }

  return (
    <motion.div
      className="splash"
      initial={{ opacity: 1 }}
      animate={leaving ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="splash-title"
    >
      <div className="splash-backdrop" style={{ backgroundImage: `url(${heroImage.src})` }} />
      <div className="splash-grid" aria-hidden="true" />
      <div className="splash-top">
        <span>{site.fullName}</span>
        <span>GUIZHOU · CHINA</span>
      </div>
      <div className="splash-copy">
        <p className="splash-kicker">A DIGITAL MUSEUM OF EVERYDAY LIFE</p>
        <h1 id="splash-title">从一抹蓝开始，<br />走进布依族的日常。</h1>
        <p>沿着染布的蓝、舞台上的声与山间的节令，进入一座可以触摸细节的数字展馆。</p>
        <button className="enter-button" type="button" onClick={enter}>
          <span>进入展馆</span>
          <svg viewBox="0 0 52 52" aria-hidden="true"><path d="M11 26h28M29 16l10 10-10 10" /></svg>
        </button>
        <small>点击进入后播放馆内背景音乐，可在右上角随时暂停。</small>
      </div>
      <div className="splash-bottom">
        <span>01 / 15</span>
        <span>布依风物志</span>
        <span>SCROLL TO DISCOVER</span>
      </div>
    </motion.div>
  )
}

export function HomePage() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !localStorage.getItem(INTRO_KEY)
    } catch {
      return true
    }
  })

  return (
    <>
      {showSplash && <SplashGate onEntered={() => setShowSplash(false)} />}
      <div className="home-page">
        <section className="home-hero">
          <div className="home-hero-orbit" aria-hidden="true">
            <svg viewBox="0 0 600 600">
              <circle cx="300" cy="300" r="240" />
              <circle cx="300" cy="300" r="176" />
              <path d="M65 300h470M300 65v470M135 135l330 330M465 135 135 465" />
            </svg>
          </div>
          <motion.div
            className="home-hero-copy"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <p className="eyebrow"><span>贵州布依族民俗文化数字博物馆</span><i /></p>
            <h1>山地的日常，<br /><em>藏在蓝与声里。</em></h1>
            <p className="home-lede">三种观看入口，十三段文化现场。不是把民俗陈列在远处，而是从细节里走近它。</p>
            <a className="text-link" href="#themes">开始参观 <span>↓</span></a>
          </motion.div>

          <motion.figure
            className="home-hero-photo"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <img src={heroImage.src} alt={heroImage.alt} fetchPriority="high" />
            <figcaption><span>石板房与山地聚落</span><span>01</span></figcaption>
          </motion.figure>

          <div className="home-side-note" aria-hidden="true">
            <span>GUIZHOU</span>
            <i />
            <span>BUYI · 布依</span>
          </div>
        </section>

        <section className="home-intro" id="themes">
          <Reveal className="home-intro-title">
            <p className="eyebrow">展览动线 · 三章</p>
            <h2>看见手艺，<br />听见表演，<br />走进生活。</h2>
          </Reveal>
          <Reveal className="home-intro-copy" delay={0.08}>
            <p>蓝染的纹样、戏台的旋律与节令里的食物，并不是彼此分离的展品。它们共同生长在同一片山地，也在今天的日常里继续被使用与改写。</p>
            <div className="home-stats">
              <div><strong>03</strong><span>叙事板块</span></div>
              <div><strong>13</strong><span>文化主题</span></div>
              <div><strong>01</strong><span>声音入口</span></div>
            </div>
          </Reveal>
        </section>

        <section className="theme-entries" aria-label="三大展览板块">
          {themes.map((theme, index) => (
            <Reveal key={theme.id} delay={index * 0.08}>
              <Link className={`theme-card theme-card-${theme.id}`} to={theme.route}>
                <div className="theme-card-image">
                  <img src={theme.image} alt="" loading="lazy" />
                  <span>{theme.index}</span>
                </div>
                <div className="theme-card-copy">
                  <p>{theme.subtitle}</p>
                  <h3>{theme.name}</h3>
                  <span className="theme-card-description">{theme.description}</span>
                  <span className="theme-card-arrow" aria-hidden="true">↗</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </section>

        <Reveal className="home-closing">
          <span className="closing-index">00 / 序</span>
          <p>{site.closing}</p>
          <div className="closing-rule" aria-hidden="true" />
          <small>从入口开始，沿着自己的兴趣进入任何一章。没有唯一的观看顺序。</small>
        </Reveal>
      </div>
    </>
  )
}
