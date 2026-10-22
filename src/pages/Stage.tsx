import { useState } from 'react'
import { motion } from 'motion/react'
import { heroCrops, instruments, oralChain, routes } from '../data'
import {
  ChapterFooter,
  PageHero,
  QuoteBand,
  ResponsiveImage,
  Reveal,
  SectionHeading,
  SoundIcon,
} from '../components/Site'
import { useMuseumAudio } from '../components/AudioProvider'

const route = (path: string) => routes.find((item) => item.path === path)!

export function InstrumentsPage() {
  const { isPlaying, play, pause } = useMuseumAudio()
  const listen = () => {
    if (isPlaying) pause()
    else void play()
  }

  return (
    <>
      <PageHero
        route={route('/stage/instruments')}
        image={`${import.meta.env.BASE_URL}images/image6.webp`}
        imageAlt="八音坐唱与布依族传统乐器表演场景"
        imageCaption="乐器依附歌舞而生，也把布依人的情感留在了声音里。"
      >
        <button className="hero-sound-button" type="button" onClick={listen} aria-label={isPlaying ? '暂停馆内背景音乐' : '播放馆内背景音乐'}>
          <SoundIcon />
          <span><strong>{isPlaying ? '暂停馆内声景' : '聆听馆内声景'}</strong><small>馆内背景音乐 · 可随时暂停</small></span>
        </button>
      </PageHero>

      <section className="section instruments-section">
        <SectionHeading index="01" eyebrow="八音坐唱 · 四件乐器" title="一场合奏，各自发声">
          传统乐器在同一声场中彼此呼应。这里以展签方式介绍四种常见声音角色，单件乐器音频仍在筹备中。
        </SectionHeading>
        <div className="instrument-grid">
          {instruments.map((instrument, index) => (
            <Reveal key={instrument.name} delay={index * 0.05}>
              <article className="instrument-card">
                <span className="instrument-number">{String(index + 1).padStart(2, '0')}</span>
                <InstrumentLine index={index} />
                <p className="eyebrow">{instrument.role}</p>
                <h3>{instrument.name}</h3>
                <p>{instrument.description}</p>
                <button type="button" onClick={listen}>
                  <span className="mini-wave"><i /><i /><i /><i /></span>
                  {isPlaying ? '暂停背景声景' : '打开馆内声景'}
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sound-field">
        <Reveal className="sound-field-copy">
          <p className="eyebrow">声景说明</p>
          <h2>听见一种在场的<br />距离与温度。</h2>
          <p>当前网站使用一首项目方提供的古筝曲作为全馆背景音乐，不作为某一件乐器的真实演奏样本。它负责建立观看时的整体氛围。</p>
          <button className="text-link" type="button" onClick={listen}>{isPlaying ? '暂停背景音乐' : '播放背景音乐'} <span>{isPlaying ? 'Ⅱ' : '▶'}</span></button>
        </Reveal>
        <Reveal className="sound-field-art" delay={0.08}>
          <div className={isPlaying ? 'record-disc is-playing' : 'record-disc'}><span /><i /><b /></div>
          <div className="wave-lines" aria-hidden="true">
            {Array.from({ length: 36 }).map((_, index) => (
              <motion.i
                key={index}
                animate={{ height: isPlaying ? [12, 24 + (index % 8) * 7, 15] : 12 }}
                transition={{ duration: 1.4 + (index % 5) * 0.12, repeat: isPlaying ? Infinity : 0, delay: index * 0.025 }}
              />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="stage-photo-pair">
        <Reveal className="stage-photo stage-photo-large">
          <ResponsiveImage src={heroCrops.instrumentA} alt="布依族传统乐器演奏场景局部" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 56vw" />
          <p><span>演奏现场</span>乐器与歌唱并非孤立存在，它们在场景中共同完成表达。</p>
        </Reveal>
        <Reveal className="stage-photo" delay={0.08}>
          <ResponsiveImage src={heroCrops.instrumentB} alt="传统乐器与人物的近景细节" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 42vw" />
          <p><span>声音细节</span>不同音色构成层次，也留下地域与表演者的差异。</p>
        </Reveal>
      </section>

      <QuoteBand source="八音坐唱与乐器页 · 策展短句">
        乐器依附歌舞而生，也把布依人的情感留在了声音里。
      </QuoteBand>
      <ChapterFooter route={route('/stage/instruments')} />
    </>
  )
}

function InstrumentLine({ index }: { index: number }) {
  const paths = [
    'M38 26v74m0 0c-8-15-15-22-20-25m20 25c8-15 15-22 20-25M23 58h30M28 47h20M31 69h18',
    'M30 22c8-5 16 0 18 10l8 42c2 9-2 17-11 19l-15 3c-9 2-16-4-16-13V51c0-12 6-23 16-29Zm-4 23c9-4 19-2 25 5M31 44v47',
    'M20 43c0-14 9-25 20-25s20 11 20 25v22c0 14-9 25-20 25s-20-11-20-25V43Zm8 1c0 7 5 12 12 12s12-5 12-12M27 65h26',
    'M38 18a19 19 0 1 1 0 38 19 19 0 0 1 0-38Zm0 7v24M14 88l48-58M26 84l-9-8M50 84l9-8',
  ]
  return (
    <svg className="instrument-line" viewBox="0 0 80 110" aria-hidden="true">
      <path d={paths[index]} />
    </svg>
  )
}

export function OperaPage() {
  const { isPlaying, play, pause } = useMuseumAudio()
  const keywords = [
    { number: '国家级', title: '非物质文化遗产', body: '布依戏作为传统戏剧形式，受到非物质文化遗产保护。' },
    { number: '融合', title: '民歌与舞蹈', body: '唱、念、做与民间歌舞相互交织，形成鲜明的地方表演风格。' },
    { number: '叙事', title: '记录民族故事', body: '戏剧把民族故事搬上舞台，也把伦理观念唱给后人听。' },
  ]

  return (
    <>
      <PageHero
        route={route('/stage/opera')}
        image={`${import.meta.env.BASE_URL}images/image7.webp`}
        imageAlt="布依戏舞台演出人物"
        imageCaption="布依戏把民族故事搬上舞台，也把伦理观念唱给后人听。"
      >
        <div className="hero-facts">
          <span>唱</span><span>念</span><span>做</span><span>叙事</span>
        </div>
      </PageHero>

      <section className="section opera-keywords">
        <SectionHeading index="02" eyebrow="布依戏 · 谷艺" title="舞台上的三重身份">
          用三个关键词理解布依戏：它既是受保护的非物质文化遗产，也是一种融合多种表演语汇、持续讲述民族故事的戏剧实践。
        </SectionHeading>
        <div className="opera-keyword-grid">
          {keywords.map((keyword, index) => (
            <Reveal key={keyword.title} delay={index * 0.06}>
              <article>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p className="keyword-number">{keyword.number}</p>
                <h3>{keyword.title}</h3>
                <p>{keyword.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="opera-stage-section">
        <Reveal className="opera-poster">
          <ResponsiveImage src={`${import.meta.env.BASE_URL}images/image7.webp`} alt="布依戏演出人物全身" sizes="(max-width: 900px) 70vw, 32vw" />
          <span className="poster-label">舞台人物 · 展签视觉</span>
          <div className="poster-meta"><span>布依戏</span><small>BUYI OPERA</small></div>
        </Reveal>
        <Reveal className="opera-poster-detail" delay={0.08}>
          <ResponsiveImage src={heroCrops.opera} alt="布依戏舞台服装与身段细节" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 48vw" />
          <p>当前无独立授权的演出片段，页面使用项目提供的静态剧照与全馆背景音乐呈现舞台氛围，不将背景曲目误标为布依戏唱段。</p>
        </Reveal>
      </section>

      <section className="section opera-copy-section">
        <p className="eyebrow">观看提示</p>
        <h2>看身段，也听故事如何被传下去。</h2>
        <p>舞台上的服装、动作和唱腔彼此配合，让人物关系与伦理选择变得可感。即使缺少完整演出片段，剧照也保留了表演的瞬间与人物姿态。</p>
        <button className="button-secondary" type="button" onClick={() => isPlaying ? pause() : void play()}>
          {isPlaying ? '暂停馆内背景音乐' : '播放馆内背景音乐'}
        </button>
      </section>

      <QuoteBand source="布依戏页 · 策展短句">
        布依戏把民族故事搬上舞台，也把伦理观念唱给后人听。
      </QuoteBand>
      <ChapterFooter route={route('/stage/opera')} />
    </>
  )
}

export function SongsPage() {
  const [active, setActive] = useState(0)
  return (
    <>
      <PageHero
        route={route('/stage/songs')}
        image={`${import.meta.env.BASE_URL}images/image8.webp`}
        imageAlt="布依族古歌吟唱与口传文化场景"
        imageCaption="没有本民族通用文字，故事便在声音里延续。"
      >
        <div className="hero-facts">
          <span>口耳相传</span><span>集体记忆</span><span>活态传承</span>
        </div>
      </PageHero>

      <section className="section oral-section">
        <SectionHeading index="03" eyebrow="口传链 · 四个环节" title="没有写下的，仍在被讲述">
          布依族没有本民族通用文字，古歌与民间传说依靠口耳相传。点击时间轴，查看记忆如何在不同内容之间流动。
        </SectionHeading>
        <div className="oral-timeline">
          {oralChain.map((item, index) => (
            <button key={item.title} type="button" className={active === index ? 'is-active' : ''} onClick={() => setActive(index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.title}</strong>
              <i />
            </button>
          ))}
        </div>
        <motion.div className="oral-detail" key={oralChain[active].title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <span>{String(active + 1).padStart(2, '0')}</span>
          <h3>{oralChain[active].title}</h3>
          <p>{oralChain[active].text}</p>
          <small>口传不是静止的复制，而是在每一次讲述中与当下重新发生关系。</small>
        </motion.div>
      </section>

      <section className="section oral-quote-layout">
        <Reveal className="oral-image">
          <ResponsiveImage src={`${import.meta.env.BASE_URL}images/image8.webp`} alt="古歌吟唱者与口传文化现场" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 42vw" />
          <figcaption>声音，是另一种形式的档案。</figcaption>
        </Reveal>
        <Reveal className="oral-copy" delay={0.08}>
          <p className="eyebrow">听一段古歌 · 文字卡片</p>
          <blockquote>“把山唱进去，把河唱进去，把先人的路唱进去。”</blockquote>
          <p>这段文字为本站根据页面主题撰写的策展短句，并非古歌原文或译文。由于暂无独立授权的古歌音频，这里用文字与图像保留一个想象的入口。</p>
        </Reveal>
      </section>

      <QuoteBand source="古歌与民间传说页 · 策展短句">
        当文字缺席，记忆就交给声音；当声音被再次唱起，过去便重新拥有了现在。
      </QuoteBand>
      <ChapterFooter route={route('/stage/songs')} />
    </>
  )
}

export function ChabaiPage() {
  return (
    <>
      <PageHero
        route={route('/stage/chabai')}
        image={`${import.meta.env.BASE_URL}images/image9.webp`}
        imageAlt="查白歌节与布依族青年对歌场景"
        imageCaption="以歌传情，是布依口头歌谣文化的重要传承场景。"
      >
        <div className="keyword-stamp">浪哨<span>LANG SHAO</span></div>
      </PageHero>

      <section className="section chabai-feature">
        <Reveal className="chabai-word">
          <p className="eyebrow">关键词 · 浪哨</p>
          <h2>以歌传情，<br />让相识自然发生。</h2>
          <p>浪哨是布依族青年以歌传情的社交习俗。歌声让陌生变得可以接近，也让表达拥有含蓄而明亮的路径。</p>
        </Reveal>
        <Reveal className="chabai-facts" delay={0.08}>
          <article><span>01</span><h3>歌节场景</h3><p>查白歌节依托民间传说形成，以歌传情，是口头歌谣文化的重要传承场景。</p></article>
          <article><span>02</span><h3>与六月六相呼应</h3><p>歌节与节令风物共同构成民俗生活。本站将在“六月六”页继续展开节日流程。</p></article>
        </Reveal>
      </section>

      <section className="chabai-photo">
        <ResponsiveImage src={heroCrops.chabai} alt="查白歌节人物与对歌现场细节" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 55vw" />
        <div>
          <p className="eyebrow">人与人的相会</p>
          <blockquote>“以歌相会，不必把情感一次说尽。”</blockquote>
          <p>本页不展开节日流程，而是把注意力留给“歌”如何成为青年交往与社会连接的媒介。</p>
        </div>
      </section>

      <section className="section chabai-link">
        <Reveal>
          <p className="eyebrow">继续阅读</p>
          <h2>歌里的情感，也在礼俗中获得回应。</h2>
          <button className="text-link" type="button" onClick={() => window.location.assign('#/season/courtship')}>前往婚恋习俗 <span>→</span></button>
        </Reveal>
      </section>

      <QuoteBand source="查白歌节页 · 策展短句">
        歌把远山拉近，也把彼此未说出口的话，交给一段旋律慢慢抵达。
      </QuoteBand>
      <ChapterFooter route={route('/stage/chabai')} />
    </>
  )
}





