import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  heroCrops,
  patterns,
  processSteps,
  processStories,
  costumeHotspots,
  routes,
} from '../data'
import type { CollagePlacement } from '../types'
import {
  ChapterFooter,
  ImageNote,
  PageHero,
  PatternGlyph,
  PhotoStory,
  ResponsiveImage,
  QuoteBand,
  Reveal,
  SectionHeading,
} from '../components/Site'
import {
  COLLAGE_KEY,
  MAX_COLLAGE_ITEMS,
  MIN_COLLAGE_ITEMS,
  clampPlacement,
  createPlacement,
  parseStoredCollage,
  renderCollageBlob,
} from '../collage'

const route = (path: string) => routes.find((item) => item.path === path)!

export function ProcessPage() {
  const [stepIndex, setStepIndex] = useState(0)
  const [dips, setDips] = useState(3)
  const step = processSteps[stepIndex]
  const dye = ['#DDE9EB', '#B4D2DB', '#77A9BA', '#3D7899', '#143D5C'][dips - 1]

  return (
    <>
      <PageHero
        route={route('/craft/process')}
        image={processSteps[1].image}
        imageAlt={processSteps[1].alt}
        imageCaption="靛蓝的深浅，是工序留下的时间刻度。"
      >
        <div className="hero-facts">
          <span>4 道工序</span>
          <span>蓝白之间</span>
          <span>反复浸染</span>
        </div>
      </PageHero>

      <section className="section section-process">
        <SectionHeading index="01" eyebrow="工序滑动条" title="颜色，在等待中发生">
          切换四个步骤，观察一块白布如何经由手的动作、染液的浸透与风的吹拂，变成可以穿用的蓝。
        </SectionHeading>

        <div className="process-layout">
          <div className="process-tabs" role="tablist" aria-label="蜡染工序">
            {processSteps.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === stepIndex}
                aria-controls="process-panel"
                className={index === stepIndex ? 'is-active' : ''}
                onClick={() => setStepIndex(index)}
              >
                <span>{item.index}</span>
                <strong>{item.title}</strong>
                <small>{item.lead}</small>
              </button>
            ))}
          </div>
          <Reveal className="process-stage" key={step.id}>
            <div className="process-image">
              <ResponsiveImage src={step.image} alt={step.alt} sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 58vw" />
              <span className="process-number">{step.index}</span>
            </div>
            <div className="process-panel" id="process-panel" role="tabpanel">
              <p className="eyebrow">STEP {step.index}</p>
              <h3>{step.title}</h3>
              <p className="process-lead">{step.lead}</p>
              <p>{step.body}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section dye-section">
        <Reveal className="dye-copy">
          <p className="eyebrow">互动实验 · 调蓝</p>
          <h2>多浸一次，<br />蓝色就再深一点。</h2>
          <p>拖动滑块改变浸染次数。颜色由浅至深，像工序被一帧帧展开。</p>
        </Reveal>
        <Reveal className="dye-lab" delay={0.08}>
          <div className="dye-swatch" style={{ '--dye-color': dye } as CSSProperties}>
            <div className="fabric-lines" />
            <span>{dips} 次浸染</span>
          </div>
          <label className="dye-control">
            <span>浸染次数</span>
            <input
              aria-label="浸染次数"
              type="range"
              min="1"
              max="5"
              value={dips}
              onChange={(event) => setDips(Number(event.target.value))}
            />
            <div className="dye-labels"><span>浅蓝</span><span>靛青</span></div>
          </label>
          <div className="dye-readout">
            <span style={{ background: dye }} />
            <p>{dips <= 2 ? '颜色仍在浅处，布面保留了更多呼吸。' : dips <= 4 ? '蓝色逐渐沉稳，纹样与底色的对比变得清晰。' : '深靛抵达。反复浸染让颜色拥有了厚度。'}</p>
          </div>
        </Reveal>
      </section>

      <section className="stories-section">
        {processStories.map((item) => <PhotoStory key={item.title} item={item} />)}
      </section>

      <section className="section pattern-detail-band">
        <ImageNote
          src={heroCrops.pattern}
          alt="蜡染纹样局部细节"
          index="细节"
        />
        <Reveal className="pattern-detail-copy">
          <p className="eyebrow">从工艺到纹样</p>
          <h2>蓝色完成后，<br />纹样才开始被阅读。</h2>
          <p>水波、田畴与几何骨架在布面上重复出现。下一章，把这些纹样逐一展开。</p>
          <button className="text-link" type="button" onClick={() => window.location.assign('#/craft/patterns')}>打开纹样图鉴 <span>→</span></button>
        </Reveal>
      </section>

      <QuoteBand source="蜡染工序页 · 策展短句">
        蜂蜡挡住颜色，时间留下蓝色。手的每一次移动，都成为布面不可复制的细节。
      </QuoteBand>
      <ChapterFooter route={route('/craft/process')} />
    </>
  )
}

export function PatternsPage() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = patterns.find((pattern) => pattern.id === activeId) ?? null
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveId(null)
    }
    document.addEventListener('keydown', onKey)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [active])

  const addToCollage = (id: string) => {
    navigate(`/craft/collage?pattern=${id}`)
  }

  return (
    <>
      <PageHero
        route={route('/craft/patterns')}
        image={patternSource()}
        imageAlt="多种蜡染纹样组合的布面"
        imageCaption="纹样彼此连接，也各自拥有独立的含义。"
      >
        <p className="hero-note">点击任意纹样，查看它的视觉结构与展签。</p>
      </PageHero>

      <section className="section patterns-section">
        <SectionHeading index="02" eyebrow="纹样图鉴 · 六枚" title="从几何里，认出山与水">
          以下图形为基于页面内容的界面化提炼，用于理解纹样语言，不作为文物纹样的精确复原。
        </SectionHeading>
        <div className="pattern-grid">
          {patterns.map((pattern, index) => (
            <Reveal key={pattern.id} delay={index * 0.04}>
              <button className="pattern-card" type="button" onClick={() => setActiveId(pattern.id)}>
                <span className="pattern-card-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="pattern-card-art"><PatternGlyph glyph={pattern.glyph} color={pattern.color} /></div>
                <div className="pattern-card-copy">
                  <span>{pattern.category}</span>
                  <h3>{pattern.name}</h3>
                  <p>{pattern.story}</p>
                  <i>查看纹样 ↗</i>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section patterns-context">
        <Reveal className="patterns-context-image">
          <ResponsiveImage src={heroCrops.pattern} alt="蜡染纹样局部与布面肌理" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 50vw" />
          <p><span>布面细节</span> 纹样在重复中获得节奏，也在手作差异中保留温度。</p>
        </Reveal>
        <Reveal className="patterns-context-copy" delay={0.08}>
          <p className="eyebrow">阅读方式</p>
          <h2>先看结构，<br />再听它讲述什么。</h2>
          <p>一条线可以是河流，也可以是迁徙的路；一个重复的方格，可能对应田畴与耕作。纹样的意义，既来自形式，也来自使用它的生活。</p>
          <p className="small-note">说明：界面纹样为文化传播而设计，若用于研究或设计生产，应进一步核对具体支系、地域与传统图谱。</p>
        </Reveal>
      </section>

      <section className="section collage-invite">
        <p>把喜欢的纹样带进下一章，重新排布它们的节奏。</p>
        <button className="button-primary" type="button" onClick={() => navigate('/craft/collage')}>开始纹样拼贴 <span>→</span></button>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveId(null)
            }}
          >
            <motion.div
              className="pattern-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="pattern-modal-title"
              ref={dialogRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
            >
              <button className="modal-close" type="button" onClick={() => setActiveId(null)} aria-label="关闭纹样详情">×</button>
              <div className="pattern-modal-art" style={{ background: `${active.color}12` }}>
                <PatternGlyph glyph={active.glyph} color={active.color} />
              </div>
              <div className="pattern-modal-copy">
                <p className="eyebrow">{active.category} · {active.meaning}</p>
                <h2 id="pattern-modal-title">{active.name}</h2>
                <p>{active.story}</p>
                <p className="modal-note">该纹样可用于拼贴创作。界面图形为设计提炼，并非文物纹样复制。</p>
                <button className="button-primary" type="button" onClick={() => addToCollage(active.id)}>加入拼贴 <span>→</span></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChapterFooter route={route('/craft/patterns')} />
    </>
  )
}

function patternSource() {
  return `${import.meta.env.BASE_URL}images/image4.webp`
}

export function CostumePage() {
  const [activeId, setActiveId] = useState(costumeHotspots[0].id)
  const active = costumeHotspots.find((item) => item.id === activeId) ?? costumeHotspots[0]
  const image = `${import.meta.env.BASE_URL}images/image5.webp`

  return (
    <>
      <PageHero
        route={route('/craft/costume')}
        image={image}
        imageAlt="三位身着不同布依族传统服饰的女性"
        imageCaption="节庆与日常，穿在身上的族群记忆。"
      >
        <div className="hero-facts">
          <span>头饰</span><span>上衣</span><span>围腰</span><span>裙装</span>
        </div>
      </PageHero>

      <section className="section costume-section">
        <SectionHeading index="03" eyebrow="服饰热点 · 点击查看" title="一件衣服，有多种阅读入口">
          点击图片上的标签，或使用下方按钮切换部位。服饰的形制、纹样和穿戴方式共同构成文化表达。
        </SectionHeading>
        <div className="costume-layout">
          <Reveal className="costume-stage">
            <ResponsiveImage src={image} alt="布依族传统服饰整体展示" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 58vw" />
            <div className="hotspot-layer">
              {costumeHotspots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  className={`hotspot ${active.id === spot.id ? 'is-active' : ''}`}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  onClick={() => setActiveId(spot.id)}
                  aria-label={`查看${spot.label}说明`}
                >
                  <span />
                  <strong>{spot.label}</strong>
                </button>
              ))}
            </div>
          </Reveal>
          <div className="costume-detail">
            <div className="costume-switcher" role="tablist" aria-label="服饰部位">
              {costumeHotspots.map((spot, index) => (
                <button
                  key={spot.id}
                  type="button"
                  role="tab"
                  aria-selected={active.id === spot.id}
                  className={active.id === spot.id ? 'is-active' : ''}
                  onClick={() => setActiveId(spot.id)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>{spot.label}
                </button>
              ))}
            </div>
            <motion.div key={active.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="costume-detail-copy">
              <span className="detail-symbol">↗</span>
              <p className="eyebrow">服饰部位 · {active.label}</p>
              <h3>{active.label}</h3>
              <p>{active.description}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="costume-gallery">
        <Reveal className="costume-gallery-item costume-gallery-wide">
          <ResponsiveImage src={heroCrops.costumeA} alt="传统服饰上半身与头饰细节" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 55vw" />
          <p><span>细节 01</span>头饰与衣襟的层次，构成第一眼的身份识别。</p>
        </Reveal>
        <Reveal className="costume-gallery-item" delay={0.06}>
          <ResponsiveImage src={heroCrops.costumeB} alt="传统服饰围腰与裙装局部" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 40vw" />
          <p><span>细节 02</span>围腰与裙装让纹样在行走中获得节奏。</p>
        </Reveal>
      </section>

      <section className="section costume-link-band">
        <Reveal>
          <p className="eyebrow">纹样同源</p>
          <h2>服饰上的纹样，与蜡染共享同一套视觉语言。</h2>
          <p>继续进入纹样图鉴，观察菱形、水波与田畴如何在不同材质上重复出现。</p>
          <button className="text-link" type="button" onClick={() => window.location.assign('#/craft/patterns')}>查看纹样图鉴 <span>→</span></button>
        </Reveal>
      </section>

      <ChapterFooter route={route('/craft/costume')} />
    </>
  )
}

interface DragState {
  id: string
  startX: number
  startY: number
  originX: number
  originY: number
  width: number
  height: number
}

export function CollagePage() {
  const [searchParams] = useSearchParams()
  const [placements, setPlacements] = useState<CollagePlacement[]>(() => {
    try {
      return parseStoredCollage(localStorage.getItem(COLLAGE_KEY))
    } catch {
      return []
    }
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)
  const dragRef = useRef<DragState | null>(null)
  const prefilled = useRef(false)
  const selected = placements.find((item) => item.instanceId === selectedId) ?? null

  useEffect(() => {
    const requested = searchParams.get('pattern')
    if (!requested || prefilled.current) return
    prefilled.current = true
    if (!patterns.some((pattern) => pattern.id === requested)) return
    setPlacements((current) => {
      if (current.length >= MAX_COLLAGE_ITEMS) return current
      const next = createPlacement(requested, current.length)
      setSelectedId(next.instanceId)
      return [...current, next]
    })
  }, [searchParams])

  useEffect(() => {
    try {
      localStorage.setItem(COLLAGE_KEY, JSON.stringify(placements))
    } catch {
      // Storage may be unavailable in private browsing; the editor still works.
    }
  }, [placements])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const addPattern = (patternId: string) => {
    if (placements.length >= MAX_COLLAGE_ITEMS) {
      showToast('最多放入 5 个纹样')
      return
    }
    const next = createPlacement(patternId, placements.length)
    setPlacements((current) => [...current, next])
    setSelectedId(next.instanceId)
  }

  const updateSelected = (patch: Partial<CollagePlacement>) => {
    if (!selectedId) return
    setPlacements((current) => current.map((item) => item.instanceId === selectedId ? { ...item, ...patch } : item))
  }

  const removeSelected = () => {
    if (!selectedId) return
    setPlacements((current) => current.filter((item) => item.instanceId !== selectedId))
    setSelectedId(null)
  }

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>, item: CollagePlacement) => {
    const canvas = event.currentTarget.closest('.collage-canvas')?.getBoundingClientRect()
    if (!canvas) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      id: item.instanceId,
      startX: event.clientX,
      startY: event.clientY,
      originX: item.x,
      originY: item.y,
      width: canvas.width,
      height: canvas.height,
    }
    setSelectedId(item.instanceId)
  }

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = ((event.clientX - drag.startX) / drag.width) * 100
    const dy = ((event.clientY - drag.startY) / drag.height) * 100
    setPlacements((current) => current.map((item) => item.instanceId === drag.id ? {
      ...item,
      x: clampPlacement(drag.originX + dx),
      y: clampPlacement(drag.originY + dy),
    } : item))
  }

  const endDrag = () => {
    dragRef.current = null
  }

  const nudge = (event: React.KeyboardEvent<HTMLDivElement>, item: CollagePlacement) => {
    const amount = event.shiftKey ? 5 : 1
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    setSelectedId(item.instanceId)
    setPlacements((current) => current.map((entry) => {
      if (entry.instanceId !== item.instanceId) return entry
      return {
        ...entry,
        x: clampPlacement(entry.x + (event.key === 'ArrowLeft' ? -amount : event.key === 'ArrowRight' ? amount : 0)),
        y: clampPlacement(entry.y + (event.key === 'ArrowUp' ? -amount : event.key === 'ArrowDown' ? amount : 0)),
      }
    }))
  }

  const prepareBlob = async () => {
    if (placements.length < MIN_COLLAGE_ITEMS) {
      showToast('至少放入 3 个纹样后再生成')
      return null
    }
    setBusy(true)
    try {
      return await renderCollageBlob(placements)
    } catch {
      showToast('图片生成失败，请稍后重试')
      return null
    } finally {
      setBusy(false)
    }
  }

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '我的布依纹样卡.png'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const saveCard = async () => {
    const blob = await prepareBlob()
    if (!blob) return
    downloadBlob(blob)
    showToast('纹样卡已生成并下载')
  }

  const shareCard = async () => {
    const blob = await prepareBlob()
    if (!blob) return
    const file = new File([blob], '我的布依纹样卡.png', { type: 'image/png' })
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title: '我的布依纹样卡', text: '来自一抹靛蓝·布依风物的纹样创作', files: [file] })
        return
      } catch {
        // A cancelled share should not force a download.
        return
      }
    }
    downloadBlob(blob)
    showToast('当前浏览器不支持直接分享，已下载图片')
  }

  const reset = () => {
    setPlacements([])
    setSelectedId(null)
    showToast('画布已清空')
  }

  return (
    <>
      <PageHero
        route={route('/craft/collage')}
        image={`${import.meta.env.BASE_URL}images/image4.webp`}
        imageAlt="用于拼贴灵感的蜡染纹样布面"
        imageCaption="选择、移动、重组，让旧纹样产生新的关系。"
        compact
      />

      <section className="section collage-section">
        <SectionHeading index="04" eyebrow="互动工坊" title="你的纹样卡，由你编排">
          从下方选择 3—5 个纹样，拖动调整位置。可以旋转、缩放，也可以随时清空重来。
        </SectionHeading>

        <div className="collage-workspace">
          <div className="collage-palette">
            <div className="palette-head">
              <span>纹样选择</span>
              <small>{placements.length} / {MAX_COLLAGE_ITEMS}</small>
            </div>
            {patterns.map((pattern) => (
              <button
                key={pattern.id}
                type="button"
                className="palette-item"
                onClick={() => addPattern(pattern.id)}
                disabled={placements.length >= MAX_COLLAGE_ITEMS}
              >
                <span className="palette-glyph"><PatternGlyph glyph={pattern.glyph} color={pattern.color} compact /></span>
                <span><strong>{pattern.name}</strong><small>{pattern.meaning}</small></span>
                <i>＋</i>
              </button>
            ))}
            <p className="palette-note">界面纹样为设计提炼，可用于本站拼贴体验。</p>
          </div>

          <div className="collage-main">
            <div className="collage-canvas" aria-label="纹样拼贴画布">
              <div className="canvas-border" aria-hidden="true" />
              <div className="canvas-title" aria-hidden="true"><span>我的布依纹样卡</span><small>BUYI PATTERN STUDY</small></div>
              {placements.length === 0 && (
                <div className="canvas-empty"><span>＋</span><p>从左侧选择纹样<br />开始你的构图</p></div>
              )}
              {placements.map((item) => {
                const pattern = patterns.find((entry) => entry.id === item.patternId)
                if (!pattern) return null
                return (
                  <div
                    key={item.instanceId}
                    className={`collage-object ${selectedId === item.instanceId ? 'is-selected' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${pattern.name}，可拖动，方向键微调位置`}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: `${24 * item.scale}%`,
                      transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                    }}
                    onPointerDown={(event) => beginDrag(event, item)}
                    onPointerMove={moveDrag}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    onKeyDown={(event) => nudge(event, item)}
                  >
                    <PatternGlyph glyph={pattern.glyph} color={pattern.color} />
                  </div>
                )
              })}
              <div className="canvas-signature" aria-hidden="true">一抹靛蓝 · 2026</div>
            </div>

            <div className="collage-controls">
              <div className="selection-controls">
                {selected ? (
                  <>
                    <span>{patterns.find((item) => item.id === selected.patternId)?.name}</span>
                    <button type="button" onClick={() => updateSelected({ scale: Math.min(1.8, selected.scale + 0.1) })}>放大</button>
                    <button type="button" onClick={() => updateSelected({ scale: Math.max(0.6, selected.scale - 0.1) })}>缩小</button>
                    <button type="button" onClick={() => updateSelected({ rotation: selected.rotation - 15 })}>左转</button>
                    <button type="button" onClick={() => updateSelected({ rotation: selected.rotation + 15 })}>右转</button>
                    <button className="danger" type="button" onClick={removeSelected}>删除</button>
                  </>
                ) : <span className="muted">点击画布中的纹样进行调整</span>}
              </div>
              <div className="collage-actions">
                <button className="button-secondary" type="button" onClick={reset} disabled={placements.length === 0}>清空画布</button>
                <button className="button-secondary" type="button" onClick={() => void shareCard()} disabled={busy || placements.length < MIN_COLLAGE_ITEMS}>分享</button>
                <button className="button-primary" type="button" onClick={() => void saveCard()} disabled={busy || placements.length < MIN_COLLAGE_ITEMS}>
                  {busy ? '生成中…' : '保存纹样卡'}
                </button>
              </div>
              <p className="collage-rule">{placements.length < MIN_COLLAGE_ITEMS ? `还差 ${MIN_COLLAGE_ITEMS - placements.length} 个纹样即可生成` : '已满足生成条件：3—5 个纹样'}</p>
            </div>
          </div>
        </div>
      </section>

      <QuoteBand source="纹样拼贴页 · 策展短句">
        让传统纹样融入现代审美，让非遗在指尖活起来。
      </QuoteBand>
      <ChapterFooter route={route('/craft/collage')} />
      <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{toast}</motion.div>}</AnimatePresence>
    </>
  )
}



