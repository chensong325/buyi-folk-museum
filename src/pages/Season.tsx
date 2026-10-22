import { useState } from 'react'
import { motion } from 'motion/react'
import { foodColors, heroCrops, mapRegions, festivalStops, routes } from '../data'
import {
  ChapterFooter,
  PageHero,
  QuoteBand,
  ResponsiveImage,
  Reveal,
  SectionHeading,
} from '../components/Site'

const route = (path: string) => routes.find((item) => item.path === path)!

export function LiuyueliuPage() {
  const [active, setActive] = useState(0)
  const stop = festivalStops[active]

  return (
    <>
      <PageHero
        route={route('/season/liuyueliu')}
        image={`${import.meta.env.BASE_URL}images/image10.webp`}
        imageAlt="布依族六月六节庆活动场景"
        imageCaption="六月六：最为盛大的传统年节。"
      >
        <div className="hero-facts">
          <span>敬农祈福</span><span>族群团聚</span><span>歌舞相会</span>
        </div>
      </PageHero>

      <section className="section festival-section">
        <SectionHeading index="01" eyebrow="六月六 · 一天的时间轴" title="从清晨到夜晚，节日如何展开">
          点击时间节点，沿一天的节律观察祭祖、包粽、丢花包、对歌与夜晚歌舞。
        </SectionHeading>
        <div className="festival-timeline" role="tablist" aria-label="六月六活动时间轴">
          {festivalStops.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active === index}
              className={active === index ? 'is-active' : ''}
              onClick={() => setActive(index)}
            >
              <small>{item.time}</small>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>
        <motion.div key={stop.id} className="festival-detail" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <span>{stop.time}</span>
          <h3>{stop.title}</h3>
          <p>{stop.description}</p>
          <small>节日内涵：敬农祈福、族群团聚</small>
        </motion.div>
      </section>

      <section className="festival-editorial">
        <Reveal className="festival-editorial-image">
          <ResponsiveImage src={heroCrops.festival} alt="六月六节庆人物与活动细节" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 55vw" />
          <figcaption><span>节令现场</span>共同的时间，让分散的日常重新聚在一起。</figcaption>
        </Reveal>
        <Reveal className="festival-editorial-copy" delay={0.08}>
          <p className="eyebrow">节日不是节目单</p>
          <h2>它是一整套关于<br />土地、亲缘与相聚的记忆。</h2>
          <p>祭祖回望来处，包粽分享食物，花包与歌声创造交往，夜晚歌舞把情绪交给集体。每一个环节，都在把人与自然、人与人的关系重新确认一遍。</p>
        </Reveal>
      </section>

      <QuoteBand source="六月六页 · 策展短句">
        节日把散落在日常里的情感重新聚拢，也把对丰收的期待交给共同的时间。
      </QuoteBand>
      <ChapterFooter route={route('/season/liuyueliu')} />
    </>
  )
}

export function FoodPage() {
  const [active, setActive] = useState(0)
  const color = foodColors[active]
  return (
    <>
      <PageHero
        route={route('/season/food')}
        image={`${import.meta.env.BASE_URL}images/image11.webp`}
        imageAlt="布依族五色糯米饭与节庆餐桌"
        imageCaption="吃的是饭，传的是礼。"
      >
        <div className="hero-facts">
          <span>五色糯米饭</span><span>植物染色</span><span>节庆待客</span>
        </div>
      </PageHero>

      <section className="section food-section">
        <SectionHeading index="02" eyebrow="五色糯米饭 · 互动图谱" title="颜色从哪里来？">
          点击五个色块，查看常见的天然染色来源。不同地域、家庭与节令做法会有差异，这里呈现的是文化理解的入口。
        </SectionHeading>
        <div className="food-lab">
          <div className="rice-bowl" aria-label="五色糯米饭色彩图谱">
            {foodColors.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className={active === index ? 'is-active' : ''}
                style={{ background: item.color, color: item.ink }}
                onClick={() => setActive(index)}
                aria-label={`查看${item.name}糯米饭与${item.source}`}
              >
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          <motion.div className="food-detail" key={color.name} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
            <span className="food-detail-swatch" style={{ background: color.color }} />
            <p className="eyebrow">{color.name} · 天然来源</p>
            <h3>{color.source}</h3>
            <p>{color.note}</p>
            <small>小提示：颜色深浅会随植物、水质、温度与浸泡时间变化。</small>
          </motion.div>
        </div>
      </section>

      <section className="food-story">
        <Reveal className="food-story-image">
          <ResponsiveImage src={heroCrops.food} alt="五色糯米饭与节庆食物细节" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 55vw" />
          <p><span>食物现场</span>色彩来自植物，也来自一桌人共同准备的时间。</p>
        </Reveal>
        <Reveal className="food-story-copy" delay={0.08}>
          <p className="eyebrow">餐桌上的礼</p>
          <h2>吃饭，也是<br />一次关系的确认。</h2>
          <p>食物与节庆、祭祀、待客礼仪深度绑定。准备什么、如何摆放、先递给谁，都是文化秩序在日常生活中的细小表达。</p>
          <div className="food-rule"><span>节庆</span><i /><span>祭祀</span><i /><span>待客</span></div>
        </Reveal>
      </section>

      <QuoteBand source="饮食文化页 · 策展短句">
        食物与节庆、祭祀、待客礼仪深度绑定，吃的是饭，传的是礼。
      </QuoteBand>
      <ChapterFooter route={route('/season/food')} />
    </>
  )
}

export function CourtshipPage() {
  return (
    <>
      <PageHero
        route={route('/season/courtship')}
        image={`${import.meta.env.BASE_URL}images/image12.webp`}
        imageAlt="布依族传统婚恋习俗与人物场景"
        imageCaption="重礼重情，尊重青年，是布依族传统社会文化的底色。"
      />

      <section className="section courtship-section">
        <SectionHeading index="03" eyebrow="婚恋习俗 · 两个阶段" title="从自由交往，到郑重礼仪">
          本页侧重礼俗流程，不再展开对歌。以“浪哨”为起点，看青年交往如何进入家庭与社会关系。
        </SectionHeading>
        <div className="courtship-path">
          <Reveal className="courtship-step courtship-step-one">
            <span className="step-roman">I</span>
            <div>
              <p className="eyebrow">自由交往 · 浪哨</p>
              <h2>先让彼此认识。</h2>
              <p>浪哨保留了青年自由交往的空间，以歌传情，也让情感拥有被听见的机会。</p>
            </div>
            <div className="courtship-rings" aria-hidden="true"><i /><i /><b /></div>
          </Reveal>
          <div className="courtship-connector" aria-hidden="true"><span>→</span><small>进入家庭与社会的确认</small></div>
          <Reveal className="courtship-step courtship-step-two" delay={0.08}>
            <span className="step-roman">II</span>
            <div>
              <p className="eyebrow">整套婚恋礼仪</p>
              <h2>再把承诺放进礼俗。</h2>
              <p>婚恋礼仪连接两个家庭，也连接共同体对关系、责任与尊重的理解。</p>
            </div>
            <div className="courtship-symbol" aria-hidden="true"><span>礼</span><small>重礼重情</small></div>
          </Reveal>
        </div>
      </section>

      <section className="courtship-editorial">
        <Reveal>
          <p className="eyebrow">文化底色</p>
          <h2>尊重青年，<br />也尊重关系的分寸。</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p>自由交往与郑重礼仪并不是彼此对立的两端。一个让情感被听见，一个让承诺被共同体看见。理解这套过程，比罗列仪式细节更接近其文化意义。</p>
          <p className="small-note">不同地区、支系与家庭的具体流程可能有差异，本页不作统一化概括。</p>
        </Reveal>
      </section>

      <QuoteBand source="婚恋习俗页 · 策展短句">
        重礼重情，尊重青年，是布依族传统社会文化的底色。
      </QuoteBand>
      <ChapterFooter route={route('/season/courtship')} />
    </>
  )
}

export function GeographyPage() {
  const [active, setActive] = useState(mapRegions[0].id)
  const region = mapRegions.find((item) => item.id === active) ?? mapRegions[0]
  return (
    <>
      <PageHero
        route={route('/season/geography')}
        image={`${import.meta.env.BASE_URL}images/image13.webp`}
        imageAlt="贵州布依族文化地理分布示意图"
        imageCaption="地域环境塑造民俗差异，分布格局帮助理解布依文化的多样性。"
      />

      <section className="section geography-section">
        <SectionHeading index="04" eyebrow="文化地理 · 区域索引" title="同一片山地，不同的生活侧面">
          点击地图上的标签，查看区域文化主题。地图为文化理解索引，不表示民族边界，也不代表精确的分布范围。
        </SectionHeading>
        <div className="geography-layout">
          <Reveal className="map-stage">
            <ResponsiveImage src={`${import.meta.env.BASE_URL}images/image13.webp`} alt="文化地理交互底图" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 58vw" />
            <div className="map-overlay">
              {mapRegions.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={active === item.id ? 'is-active' : ''}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  onClick={() => setActive(item.id)}
                  aria-label={`查看${item.name}文化标签`}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.name}
                </button>
              ))}
            </div>
            <p className="map-note">交互索引 / NOT A CULTURAL BOUNDARY</p>
          </Reveal>
          <motion.div className="map-detail" key={region.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow">区域文化标签</p>
            <h3>{region.name}</h3>
            <p>{region.description}</p>
            <div className="map-tags">
              {region.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <div className="map-detail-image">
              <ResponsiveImage src={heroCrops.geography} alt="山地聚落与地域环境细节" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 35vw" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="geography-copy">
        <Reveal>
          <p className="eyebrow">从分布到理解</p>
          <h2>地理不是背景，<br />它参与塑造文化。</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p>山地的海拔、河流、田地与交通，影响聚落形态、建筑选材和作物节律，也影响人们如何相遇、如何举行节庆。地域差异不是简单的标签，而是生活环境长期作用的结果。</p>
        </Reveal>
      </section>

      <QuoteBand source="文化地理分布页 · 策展短句">
        地域环境塑造民俗差异，分布格局帮助理解布依文化的多样性。
      </QuoteBand>
      <ChapterFooter route={route('/season/geography')} />
    </>
  )
}



