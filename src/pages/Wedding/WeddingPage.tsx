import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { themes } from '../../themes'
import { useStore } from '../../services/wedding/store'
import { WeddingRenderer } from '../../templates/WeddingRenderer'

export function WeddingPage({ preview = false }: { preview?: boolean }) {
  const { slug, guestSlug, weddingId } = useParams()
  const { db } = useStore()
  const wedding = weddingId
    ? db.weddings.find((w) => w.id === weddingId)
    : db.weddings.find((w) => w.slug === slug)

  useEffect(() => {
    if (!wedding) return
    const settings = db.settings.find((s) => s.weddingId === wedding.id)
    document.title = settings?.seoTitle || `${wedding.groom.shortName} & ${wedding.bride.shortName} – Wedding Invitation`
    const desc = settings?.seoDescription || wedding.description
    setMeta('description', desc)
    setMeta('og:title', document.title, 'property')
    setMeta('og:description', desc, 'property')
    setMeta('og:image', wedding.heroImage, 'property')
  }, [wedding, db.settings])

  if (!wedding) {
    return (
      <div className="min-h-dvh grid place-items-center paper-bg">
        <p>Không tìm thấy thiệp cưới.</p>
      </div>
    )
  }

  if (!preview && wedding.status !== 'PUBLISHED') {
    return (
      <div className="min-h-dvh grid place-items-center paper-bg text-center px-6">
        <div>
          <p className="serif text-3xl">Thiệp đang được hoàn thiện</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Wedding này chưa được publish.</p>
        </div>
      </div>
    )
  }

  const pack = {
    wedding,
    events: db.events.filter((e) => e.weddingId === wedding.id).sort((a, b) => a.order - b.order),
    photos: db.photos.filter((p) => p.weddingId === wedding.id).sort((a, b) => a.order - b.order),
    loveStory: db.loveStories.filter((s) => s.weddingId === wedding.id).sort((a, b) => a.order - b.order),
    wishes: db.wishes.filter((w) => w.weddingId === wedding.id),
    bankAccounts: db.bankAccounts.filter((b) => b.weddingId === wedding.id),
    settings: db.settings.find((s) => s.weddingId === wedding.id)!,
    guest: guestSlug
      ? db.guests.find((g) => g.weddingId === wedding.id && g.slug === guestSlug) || null
      : null,
    theme: themes[wedding.themeId],
    preview,
  }

  if (guestSlug && !pack.guest) {
    return (
      <div className="min-h-dvh grid place-items-center paper-bg">
        <p>Không tìm thấy khách mời này.</p>
      </div>
    )
  }

  return <WeddingRenderer {...pack} />
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

export function HomePage() {
  const { db } = useStore()
  const published = db.weddings.filter((w) => w.status === 'PUBLISHED')
  return (
    <div className="min-h-dvh paper-bg px-6 py-16 text-center">
      <p className="tracking-[0.35em] uppercase text-xs text-[var(--primary)]">Wedding Invitation Platform</p>
      <h1 className="serif text-5xl mt-4">Thiệp cưới online</h1>
      <p className="mt-4 text-[var(--muted)] max-w-lg mx-auto">
        Template cao cấp, quản trị nội dung, và link thiệp cá nhân hóa cho từng khách mời.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/w/minhan-ngocha" className="bg-[var(--primary)] text-[var(--surface)] px-6 py-3 text-xs tracking-[0.2em] uppercase">
          Xem thiệp demo
        </Link>
        <Link to="/admin/login" className="border border-[var(--primary)] px-6 py-3 text-xs tracking-[0.2em] uppercase">
          Đăng nhập Admin
        </Link>
      </div>
      <div className="mt-16 max-w-xl mx-auto space-y-3">
        {published.map((w) => (
          <Link key={w.id} to={`/w/${w.slug}`} className="block bg-[var(--surface)] py-4 px-5">
            <span className="serif text-2xl">
              {w.groom.shortName} & {w.bride.shortName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
