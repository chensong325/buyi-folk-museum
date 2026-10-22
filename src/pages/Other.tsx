import { Link } from 'react-router-dom'
import { creativeItems, routes, site } from '../data'
import { ChapterFooter, PageHero, PatternGlyph, QuoteBand, ResponsiveImage, Reveal, SectionHeading } from '../components/Site'

const route = (path: string) => routes.find((item) => item.path === path)!

export function CreativePage() {
  return (
    <>
      <PageHero
        route={route('/creative')}
        image={`${import.meta.env.BASE_URL}images/image14.webp`}
        imageAlt="布依族传统纹样与文创展示场景"
        imageCaption="把传统民俗符号转化为现代文创，让非遗走进当代生活。"
      >
        <div className="hero-facts">
          <span>纹样转译</span><span>日常使用</span><span>当代表达</span>
        </div>
      </PageHero>

      <section className="section creative-section">
        <SectionHeading index="01" eyebrow="布依文创 · 四件示例" title="不是复制传统，而是继续使用它">
          以纹样、器物和食物色彩为灵感，构想让文化符号进入日常使用的四种方式。以下为界面概念，不作为实际商品销售。
        </SectionHeading>
        <div className="creative-grid">
          {creativeItems.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <article className={`creative-card creative-${item.id}`}>
                <div className="creative-visual">
                  <span className="creative-no">{String(index + 1).padStart(2, '0')}</span>
                  <div className="product-object">
                    <ProductShape id={item.id} glyph={item.glyph} color={item.color} />
                  </div>
                </div>
                <div className="creative-copy">
                  <p className="eyebrow">{item.material}</p>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span>概念设计 ↗</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="creative-manifesto">
        <Reveal className="creative-manifesto-copy">
          <p className="eyebrow">当代转译</p>
          <h2>让符号离开展柜，<br />回到可以触摸的日常。</h2>
          <p>文创不是把传统简化成图案，而是让更多人通过一个包、一条围巾或一枚书签，产生继续了解的兴趣。</p>
        </Reveal>
        <Reveal className="creative-loop" delay={0.08}>
          <div className="loop-orbit" aria-hidden="true"><i /><i /><span>纹样</span></div>
          <p>你已经创作过一张纹样卡吗？</p>
          <Link className="button-primary" to="/craft/collage">返回拼贴工坊 <span>→</span></Link>
        </Reveal>
      </section>

      <section className="creative-gallery">
        <Reveal className="creative-gallery-image">
          <ResponsiveImage src={`${import.meta.env.BASE_URL}images/image14.webp`} alt="布依族纹样文创灵感展示" sizes="(max-width: 640px) 65vw, (max-width: 900px) 100vw, 55vw" />
        </Reveal>
        <Reveal className="creative-gallery-copy" delay={0.08}>
          <p className="eyebrow">使用与尊重</p>
          <h3>好的转译，应该保留来源与语境。</h3>
          <p>纹样承载地域、支系与生活经验。将其用于设计时，应进一步核对具体来源，尊重社区与传承人的表达，避免把文化符号变成没有出处的装饰。</p>
        </Reveal>
      </section>

      <QuoteBand source="布依文创页 · 策展短句">
        把传统民俗符号转化为现代文创，降低民族文化接受门槛，让非遗走进当代生活。
      </QuoteBand>
      <ChapterFooter route={route('/creative')} />
    </>
  )
}

function ProductShape({ id, glyph, color }: { id: string; glyph: 'diamond' | 'wave' | 'field' | 'fret' | 'drum' | 'grain'; color: string }) {
  if (id === 'bag') {
    return (
      <div className="mock-bag">
        <span className="bag-handle" />
        <div className="bag-face"><PatternGlyph glyph={glyph} color={color} compact /></div>
        <small>BUYI TOTE</small>
      </div>
    )
  }
  if (id === 'scarf') {
    return (
      <div className="mock-scarf">
        <div><PatternGlyph glyph={glyph} color={color} compact /></div>
        <span>INDIGO</span>
      </div>
    )
  }
  if (id === 'magnet') {
    return (
      <div className="mock-magnets">
        {['#2E332E', '#A94B3C', '#D6AE55', '#735D7C', '#EFE7D6'].map((fill, index) => <span key={fill} style={{ background: fill, animationDelay: `${index * 0.15}s` }} />)}
      </div>
    )
  }
  return (
    <div className="mock-bookmark">
      <div><PatternGlyph glyph={glyph} color={color} compact /><span>一抹靛蓝</span></div>
      <i />
    </div>
  )
}

export function CopyrightPage() {
  return (
    <>
      <PageHero
        route={route('/copyright')}
        image={`${import.meta.env.BASE_URL}images/image1.webp`}
        imageAlt="石板房与山地村落景观"
        imageCaption="尊重文化，也尊重每一次记录、拍摄与创作。"
        compact
      />
      <section className="copyright-section">
        <Reveal className="copyright-main">
          <p className="eyebrow">版权声明</p>
          <h2>{site.fullName}</h2>
          <p>本站的页面大纲与配图由项目方提供，并用于本数字博物馆展示。背景音乐由项目方提供并授权使用：《琵琶语 古筝版》／玖月花儿与筝。</p>
          <p>站内新增的策展文字、界面设计、纹样视觉提炼与交互实现，除另有说明外，仅用于本项目的内容展示。未经项目方许可，不得将站内图片、文字、音频与界面素材用于商业发布、再销售或误导性传播。</p>
        </Reveal>
        <div className="copyright-grid">
          <Reveal>
            <span>01</span>
            <h3>内容基础</h3>
            <p>页面大纲及文档配图由项目方提供。新增文字为策展性整理与衔接，不替代学术研究或地方性知识。</p>
          </Reveal>
          <Reveal delay={0.05}>
            <span>02</span>
            <h3>图像说明</h3>
            <p>主图来自项目文档，局部图片为文档图片的裁切与视觉处理。界面纹样为设计化提炼，并非文物纹样的精确复原。</p>
          </Reveal>
          <Reveal delay={0.1}>
            <span>03</span>
            <h3>音乐说明</h3>
            <p>全馆背景音乐使用项目方提供的《琵琶语 古筝版》／玖月花儿与筝。该曲不作为任何单件民族乐器的真实演奏样本。</p>
          </Reveal>
          <Reveal delay={0.15}>
            <span>04</span>
            <h3>文化表述</h3>
            <p>民俗存在地域、支系与家庭差异。本站以大众文化科普为目标，具体习俗请以当地社区与传承人的说明为准。</p>
          </Reveal>
        </div>
        <Reveal className="copyright-contact">
          <p>如果发现内容需要更正，或希望进一步了解素材使用情况，请通过项目后续公布的联系方式与项目方联系。</p>
          <Link className="text-link" to="/">返回首页 <span>↑</span></Link>
        </Reveal>
      </section>
      <ChapterFooter route={route('/copyright')} />
    </>
  )
}



