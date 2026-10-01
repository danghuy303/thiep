import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Copy,
  GlassWater,
  Heart,
  Home,
  Music2,
  Navigation,
  Sparkles,
  Users,
  Utensils,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import type { WeddingTemplateProps } from '../../types'
import { cn, getDirectAudioUrl, uid, weekdayVi } from '../../utils'
import { EnvelopeCover } from '../../components/Wedding/EnvelopeCover'
import { EnvelopeGraphic } from '../../components/Wedding/EnvelopeGraphic'
import { Lightbox } from '../../components/Wedding/Lightbox'
import { TrauCauOrnament } from '../../components/Wedding/TrauCauOrnament'
import { Reveal } from '../../components/Wedding/Reveal'
import { GiftBoxCard } from '../../components/Wedding/GiftBoxCard'
import { storeApi } from '../../services/wedding/store'

const nav = [
  { id: 'home', label: 'Home' },
  { id: 'ceremony', label: 'Lễ Cưới' },
  { id: 'album', label: 'Album' },
  { id: 'reception', label: 'Tiệc Cưới' },
  { id: 'schedule', label: 'Lịch Trình' },
  { id: 'rsvp', label: 'Sổ Bút' },
]

/**
 * Faint Architectural Cathedral Line Art Background
 * Matching the background sketch seen in reference Images 1, 2, 3
 */
function BuildingSketchBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.07] z-0">
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 800 1200"
        fill="none"
        stroke="#450b14"
        strokeWidth="1"
      >
        {/* Neoclassical Cathedral Facade Line Sketch */}
        <path d="M 400 50 L 480 120 L 320 120 Z M 400 120 L 400 300" />
        <rect x="250" y="250" width="300" height="700" rx="4" />
        <path d="M 250 250 L 400 150 L 550 250" />
        {/* Dome & Arches */}
        <circle cx="400" cy="400" r="80" />
        <path d="M 320 400 A 80 80 0 0 1 480 400" />
        {/* Columns */}
        {[280, 330, 380, 420, 470, 520].map((x) => (
          <g key={x}>
            <line x1={x} y1="480" x2={x} y2="850" strokeWidth="1.5" />
            <path d={`M ${x - 8} 480 H ${x + 8} M ${x - 8} 850 H ${x + 8}`} />
          </g>
        ))}
        {/* Arched Windows */}
        {[300, 400, 500].map((x) => (
          <path key={x} d={`M ${x - 25} 600 V 550 A 25 25 0 0 1 ${x + 25} 550 V 600 Z`} />
        ))}
        {/* Grand Portal */}
        <path d="M 340 950 V 780 A 60 60 0 0 1 460 780 V 950 Z" strokeWidth="2" />
        <path d="M 360 950 V 810 A 40 40 0 0 1 440 810 V 950 Z" />
      </svg>
    </div>
  )
}

export function Template01(props: WeddingTemplateProps) {
  const { wedding, guest, photos, settings, bankAccounts, preview } = props
  const [opened, setOpened] = useState(Boolean(preview))
  const [musicOn, setMusicOn] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [giftOpen, setGiftOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const album = photos.filter((p) => p.category === 'album' || p.category === 'hero')
  const guestLabel = guest?.displayName || settings.defaultGuestLabel

  useEffect(() => {
    const targetUrl = getDirectAudioUrl(wedding.musicUrl)
    const audio = new Audio(targetUrl)
    audio.loop = true
    audio.volume = wedding.musicVolume ?? 0.5
    audioRef.current = audio

    const handleAudioError = () => {
      if (audioRef.current && targetUrl !== '/music/vay-cuoi.mp3') {
        audioRef.current.src = '/music/vay-cuoi.mp3'
        audioRef.current.load()
      }
    }

    audio.addEventListener('error', handleAudioError)

    return () => {
      audio.removeEventListener('error', handleAudioError)
      audio.pause()
      audioRef.current = null
    }
  }, [wedding.musicUrl, wedding.musicVolume])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (musicOn) {
      audio.pause()
      setMusicOn(false)
    } else {
      void audio.play().then(() => setMusicOn(true)).catch(() => {
        // Fallback to default mp3 on play error
        audio.src = '/music/vay-cuoi.mp3'
        audio.load()
        void audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false))
      })
    }
  }

  const openInvitation = () => {
    setOpened(true)
    if (audioRef.current) {
      void audioRef.current.play().then(() => setMusicOn(true)).catch(() => {
        if (audioRef.current) {
          audioRef.current.src = '/music/vay-cuoi.mp3'
          audioRef.current.load()
          void audioRef.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false))
        }
      })
    }
  }

  return (
    <div
      className="wedding-root min-h-dvh bg-[#3d0910] flex justify-center text-[#3c141a]"
      style={
        {
          '--primary': props.theme.primary || '#450b14',
          '--secondary': props.theme.secondary || '#6b1622',
          '--background': props.theme.background || '#F7F3EC',
          '--surface': props.theme.surface || '#FAF6F0',
          '--text': props.theme.text || '#38161b',
          '--muted': props.theme.muted || '#7a5a60',
          '--accent': props.theme.accent || '#8c2432',
          '--gold': props.theme.gold || '#d4af37',
        } as CSSProperties
      }
    >
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div key="cover" className="w-full" exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.7 }}>
            <EnvelopeCover
              wedding={wedding}
              guest={guest}
              settings={settings}
              onOpen={openInvitation}
              musicOn={musicOn}
              onToggleMusic={toggleMusic}
            />
          </motion.div>
        ) : (
          <motion.div key="main" className="w-full max-w-[480px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <InvitationBody
              {...props}
              guest={guest}
              guestLabel={guestLabel}
              album={album}
              onLightbox={setLightbox}
              onGift={() => setGiftOpen(true)}
              musicOn={musicOn}
              onToggleMusic={toggleMusic}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Lightbox photos={album} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
      {giftOpen && <GiftModal banks={bankAccounts} onClose={() => setGiftOpen(false)} />}
    </div>
  )
}

function InvitationBody(
  props: WeddingTemplateProps & {
    guestLabel: string
    album: WeddingTemplateProps['photos']
    onLightbox: (i: number) => void
    onGift: () => void
    musicOn: boolean
    onToggleMusic: () => void
  },
) {
  const { wedding, events, wishes, guestLabel, album, onLightbox, onGift } = props
  const ceremony = events[0] || {
    title: 'Lễ thành hôn',
    date: wedding.weddingDate,
    time: '09:00',
    address: wedding.venueAddress,
    description: 'Lễ thành hôn được cử hành tại tư gia.',
  }
  const reception = events[1] || ceremony
  const [albumIndex, setAlbumIndex] = useState(0)

  // Calendar date breakdown
  const dateObj = new Date(`${wedding.weddingDate}T00:00:00`)
  const dayStr = dateObj.getDate().toString().padStart(2, '0')
  const monthStr = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const yearStr = dateObj.getFullYear()

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Đám cưới ${wedding.groom.shortName} & ${wedding.bride.shortName}`)
    const details = encodeURIComponent(`Trân trọng kính mời tham dự tiệc cưới của ${wedding.groom.name} & ${wedding.bride.name}.\nĐịa điểm: ${wedding.venueAddress}`)
    const location = encodeURIComponent(`${wedding.venueName}, ${wedding.venueAddress}`)
    const startDate = `${yearStr}${monthStr}${dayStr}T110000Z`
    const endDate = `${yearStr}${monthStr}${dayStr}T140000Z`
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`
  }

  return (
    <div id="home" className="relative min-h-dvh bg-[#F7F3EC] text-[#3c141a] pb-28 shadow-2xl overflow-x-hidden font-serif">
      {/* Background Architectural Sketch */}
      <BuildingSketchBg />

      {/* Floating Music Control */}
      <button
        type="button"
        onClick={props.onToggleMusic}
        className="fixed top-4 right-4 z-50 rounded-full bg-[#450b14] text-amber-200 p-2.5 shadow-lg border border-amber-300/40 backdrop-blur-md"
        aria-label="Toggle Music"
      >
        {props.musicOn ? <Volume2 size={18} /> : wedding.musicUrl ? <VolumeX size={18} /> : <Music2 size={18} />}
      </button>

      {/* TOP HERO HEADER SECTION: SAVE THE DATE (Matching Image 1) */}
      <header className="relative pt-8 pb-4 px-4 text-center z-10">
        <p className="tracking-[0.35em] text-[11px] uppercase text-[#8c6d1e] font-sans font-semibold mb-2">SAVE THE DATE</p>

        {/* Opened V-Cut Envelope Graphic with Tilted Polaroid Photo & Left Bouquet (Matching Image 1) */}
        <EnvelopeGraphic
          photoUrl={wedding.heroImage || wedding.coverImage}
          groomName={wedding.groom.shortName}
          brideName={wedding.bride.shortName}
        />
      </header>

      {/* CARD 1: THÔNG TIN LỄ CƯỚI (Dark Burgundy Card) */}
      <section id="ceremony" className="px-4 py-2 relative z-10">
        <Reveal>
          <div className="relative bg-[#450b14] text-[#FAF6F0] rounded-2xl p-6 md:p-8 shadow-2xl border border-amber-400/30 text-center overflow-hidden">
            {/* Resized floral ornament on right edge - kept small & faint watermark z-0 to never overlap text */}
            <TrauCauOrnament className="absolute -right-12 md:-right-16 top-1/2 -translate-y-1/2 w-20 md:w-24 h-auto z-0 pointer-events-none drop-shadow-sm opacity-25" />

            <div className="relative z-10">
              <p className="tracking-[0.25em] text-xs uppercase text-[#e5c882] font-sans font-semibold mb-6">
                THÔNG TIN LỄ CƯỚI
              </p>

              {/* Parents Information (2 Columns with vertical divider) */}
              <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed border-b border-amber-200/20 pb-5 mb-5 opacity-90">
                <div className="pr-2 border-r border-amber-200/20 text-center">
                  <p className="uppercase tracking-widest text-[9px] text-[#e5c882] font-sans mb-1">Ông Bà</p>
                  <p className="font-semibold text-amber-100">{wedding.groom.father}</p>
                  <p className="font-semibold text-amber-100">{wedding.groom.mother}</p>
                </div>
                <div className="pl-2 text-center">
                  <p className="uppercase tracking-widest text-[9px] text-[#e5c882] font-sans mb-1">Ông Bà</p>
                  <p className="font-semibold text-amber-100">{wedding.bride.father}</p>
                  <p className="font-semibold text-amber-100">{wedding.bride.mother}</p>
                </div>
              </div>

              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200/80 mb-5 px-2">
                TRÂN TRỌNG BÁO TIN LỄ THÀNH HÔN CỦA CON CHÚNG TÔI
              </p>

              {/* Full Names */}
              <div className="space-y-4">
                <div>
                  <h3 className="serif text-3xl font-medium text-amber-100">{wedding.groom.name}</h3>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#e5c882] mt-0.5 font-sans">TRƯỞNG NAM</p>
                </div>

                <p className="script text-2xl text-amber-300">&</p>

                <div>
                  <h3 className="serif text-3xl font-medium text-amber-100">{wedding.bride.name}</h3>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#e5c882] mt-0.5 font-sans">TRƯỞNG NỮ</p>
                </div>
              </div>

              {/* Location & Time */}
              <div className="mt-7 pt-5 border-t border-amber-200/20">
                <p className="text-xs uppercase tracking-[0.18em] font-sans text-amber-200 font-medium">
                  LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI TƯ GIA
                </p>
                <p className="text-xs mt-3 text-amber-100/90 font-sans">
                  VÀO LÚC {ceremony.time} · {weekdayVi(ceremony.date).toUpperCase()}
                </p>

                <div className="flex items-center justify-center gap-3 my-3">
                  <span className="serif text-6xl text-amber-200 font-bold">{dayStr}</span>
                  <div className="text-left font-sans text-xs tracking-wider border-l border-amber-200/40 pl-3">
                    <p className="font-bold text-amber-200">THÁNG {monthStr}</p>
                    <p className="opacity-80">{yearStr}</p>
                  </div>
                </div>

                {wedding.lunarDate && (
                  <p className="text-[11px] italic text-amber-200/80 mt-1 font-serif">({wedding.lunarDate})</p>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SECTION 2: ALBUM ẢNH */}
      <section id="album" className="mt-12 px-4 text-center relative z-10">
        <Reveal>
          <p className="tracking-[0.3em] uppercase text-xs text-[#8c6d1e] font-sans font-semibold mb-6">ALBUM ẢNH</p>
          <AlbumFan photos={album} index={albumIndex} setIndex={setAlbumIndex} onOpen={onLightbox} />
        </Reveal>
      </section>

      {/* CARD 2: THÔNG TIN TIỆC CƯỚI (Dark Burgundy Card with Calendar) */}
      <section id="reception" className="px-4 mt-12 relative z-10">
        <Reveal>
          <div className="relative bg-[#450b14] text-[#FAF6F0] rounded-2xl p-6 md:p-8 shadow-2xl border border-amber-400/30 text-center overflow-hidden">
            {/* Resized floral ornament on left edge - kept small & faint watermark z-0 to never overlap text */}
            <TrauCauOrnament className="absolute -left-12 md:-left-16 top-1/2 -translate-y-1/2 w-20 md:w-24 h-auto z-0 pointer-events-none drop-shadow-sm opacity-25 -scale-x-100" />

            <div className="relative z-10">
              <p className="tracking-[0.25em] text-xs uppercase text-[#e5c882] font-sans font-semibold mb-2">
                THÔNG TIN TIỆC CƯỚI
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/90 font-sans my-3">
                TIỆC CƯỚI SẼ DIỄN RA VÀO LÚC:
              </p>

              <p className="text-xs text-amber-200 font-sans font-medium">
                {reception.time} · {weekdayVi(reception.date).toUpperCase()}
              </p>

              <div className="flex items-center justify-center gap-3 my-3">
                <span className="serif text-6xl text-amber-200 font-bold">{dayStr}</span>
                <div className="text-left font-sans text-xs tracking-wider border-l border-amber-200/40 pl-3">
                  <p className="font-bold text-amber-200">THÁNG {monthStr}</p>
                  <p className="opacity-80">{yearStr}</p>
                </div>
              </div>

              {wedding.lunarDate && (
                <p className="text-[11px] italic text-amber-200/80 mt-1">({wedding.lunarDate})</p>
              )}

              <div className="flex justify-center gap-6 text-xs mt-4 pt-3 border-t border-amber-200/20 font-sans">
                <div>
                  <p className="text-[10px] uppercase text-[#e5c882] opacity-80">ĐÓN KHÁCH</p>
                  <p className="font-semibold text-amber-100">17:30</p>
                </div>
                <div className="w-px bg-amber-200/20" />
                <div>
                  <p className="text-[10px] uppercase text-[#e5c882] opacity-80">KHAI TIỆC</p>
                  <p className="font-semibold text-amber-100">{reception.time}</p>
                </div>
              </div>

              {/* Embedded White Mini Calendar Card */}
              <MiniCalendar iso={reception.date} />

              {/* Calendar & RSVP Actions */}
              <div className="mt-6 flex flex-col gap-3 max-w-xs mx-auto">
                <a
                  href={generateGoogleCalendarUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#5e121e] hover:bg-[#731726] text-amber-100 border border-amber-300/30 py-2.5 px-4 rounded-full text-xs font-sans tracking-wider uppercase transition-colors shadow-sm"
                >
                  <Calendar size={14} /> Thêm vào lịch
                </a>
                <a
                  href="#rsvp"
                  className="inline-flex items-center justify-center gap-2 bg-[#FAF6F0] hover:bg-white text-[#450b14] font-semibold py-2.5 px-4 rounded-full text-xs font-sans tracking-wider uppercase shadow-md transition-colors border border-amber-200/60"
                >
                  Xác nhận tham dự
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* VENUE LOCATION SECTION */}
      <section className="mt-12 px-4 text-center relative z-10">
        <Reveal>
          <p className="tracking-[0.25em] uppercase text-xs text-[#8c6d1e] font-sans font-semibold">
            TIỆC CƯỚI SẼ TỔ CHỨC TẠI
          </p>
          <p className="serif text-2xl md:text-3xl text-[#450b14] mt-2 font-medium">{wedding.venueName}</p>
          <p className="text-xs text-[#7a5a60] mt-1 max-w-xs mx-auto leading-relaxed">{wedding.venueAddress}</p>

          {wedding.googleMapsUrl && (
            <a
              href={wedding.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-5 bg-[#FAF6F0] border border-[#450b14]/30 text-[#450b14] px-5 py-2.5 rounded-full text-xs font-sans tracking-wider uppercase shadow-sm hover:bg-[#450b14] hover:text-amber-100 transition-colors font-medium"
            >
              <Navigation size={14} /> Chỉ đường
            </a>
          )}
        </Reveal>
      </section>

      {/* CARD 3: LỊCH TRÌNH NGÀY CƯỚI */}
      <section id="schedule" className="px-4 mt-12 relative z-10">
        <Reveal>
          <div className="relative bg-[#450b14] text-[#FAF6F0] rounded-2xl p-6 md:p-8 shadow-2xl border border-amber-400/30 text-center overflow-hidden">
            <TrauCauOrnament className="absolute -right-8 -top-8 w-28 md:w-30 h-auto opacity-75 z-0 pointer-events-none" />

            <div className="relative z-10">
              <p className="tracking-[0.25em] text-xs uppercase text-[#e5c882] font-sans font-semibold mb-8">
                LỊCH TRÌNH NGÀY CƯỚI
              </p>

              {/* Timeline List */}
              <div className="relative max-w-xs mx-auto space-y-6 text-left font-sans text-xs">
                <div className="absolute left-[84px] top-2 bottom-2 w-px bg-amber-300/40" />

                <div className="relative flex items-center gap-4">
                  <span className="w-16 text-right font-bold text-amber-200">17:00</span>
                  <div className="relative z-10 w-6 h-6 rounded-full bg-amber-300/20 border border-amber-300 flex items-center justify-center text-amber-200">
                    <Users size={12} />
                  </div>
                  <span className="font-medium text-amber-100">Đón khách</span>
                </div>

                <div className="relative flex items-center gap-4">
                  <span className="w-16 text-right font-bold text-amber-200">18:00</span>
                  <div className="relative z-10 w-6 h-6 rounded-full bg-amber-300/20 border border-amber-300 flex items-center justify-center text-amber-200">
                    <Utensils size={12} />
                  </div>
                  <span className="font-medium text-amber-100">Khai tiệc</span>
                </div>

                <div className="relative flex items-center gap-4">
                  <span className="w-16 text-right font-bold text-amber-200">18:30</span>
                  <div className="relative z-10 w-6 h-6 rounded-full bg-amber-300/20 border border-amber-300 flex items-center justify-center text-amber-200">
                    <Heart size={12} />
                  </div>
                  <span className="font-medium text-amber-100">Nghi thức cưới</span>
                </div>

                <div className="relative flex items-center gap-4">
                  <span className="w-16 text-right font-bold text-amber-200">19:00</span>
                  <div className="relative z-10 w-6 h-6 rounded-full bg-amber-300/20 border border-amber-300 flex items-center justify-center text-amber-200">
                    <GlassWater size={12} />
                  </div>
                  <span className="font-medium text-amber-100">Cắt bánh & nâng ly</span>
                </div>

                <div className="relative flex items-center gap-4">
                  <span className="w-16 text-right font-bold text-amber-200">20:30</span>
                  <div className="relative z-10 w-6 h-6 rounded-full bg-amber-300/20 border border-amber-300 flex items-center justify-center text-amber-200">
                    <Sparkles size={12} />
                  </div>
                  <span className="font-medium text-amber-100">Kết thúc tiệc</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SECTION 4: SỔ LƯU BÚT & RSVP */}
      <section id="rsvp" className="px-4 mt-12 relative z-10">
        <Reveal>
          <div className="relative bg-[#FBF8F2] text-[#38161b] rounded-2xl p-6 md:p-8 shadow-md border border-[#d8c8b0] overflow-hidden">
            <TrauCauOrnament className="absolute -left-8 -bottom-6 w-28 md:w-30 h-auto opacity-75 z-0 pointer-events-none -scale-x-100" />

            <div className="relative z-10">
              <p className="text-center tracking-[0.25em] uppercase text-xs text-[#450b14] font-sans font-semibold mb-6">
                SỔ LƯU BÚT
              </p>

            <WishForm weddingId={wedding.id} guestName={guestLabel !== 'Quý khách' ? guestLabel : ''} />

            {/* List of Wishes */}
            {wishes.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#d8c8b0]/60">
                <p className="text-xs font-sans text-[#7a5a60] uppercase tracking-wider mb-4 text-center">
                  Lời chúc từ người thân & bạn bè
                </p>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {wishes
                    .filter((w) => w.visibility === 'visible')
                    .map((w) => (
                      <div key={w.id} className="bg-white p-3.5 rounded-xl border border-[#e8dcc8] shadow-sm text-xs">
                        <p className="font-serif italic text-stone-800">“{w.message}”</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-[#7a5a60] font-sans">
                          <span className="font-bold text-[#450b14]">— {w.name}</span>
                          <span>{w.createdAt ? new Date(w.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>

      {/* GIFT BOX CARD & CLOSING */}
      <section className="mt-12 text-center px-4 relative z-10">
        <Reveal>
          <GiftBoxCard onOpen={onGift} />
        </Reveal>

        <div className="mt-12 text-center">
          <Heart className="mx-auto text-[#450b14]" size={20} fill="currentColor" />
          <p className="serif text-3xl text-[#450b14] mt-3">
            {wedding.groom.shortName} & {wedding.bride.shortName}
          </p>
          <p className="mt-2 text-xs font-sans text-[#7a5a60]">Hẹn gặp bạn trong ngày vui của chúng mình.</p>


        </div>
      </section>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-1 rounded-full bg-[#450b14]/90 backdrop-blur-md text-amber-100 px-3 py-2 shadow-2xl border border-amber-300/30 max-w-[92vw] overflow-x-auto">
        {nav.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="px-2 py-1 text-[10px] font-sans tracking-widest uppercase hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            {item.id === 'home' ? <Home size={14} className="inline" /> : item.label}
          </a>
        ))}
      </nav>
    </div>
  )
}

function AlbumFan({
  photos,
  index,
  setIndex,
  onOpen,
}: {
  photos: WeddingTemplateProps['photos']
  index: number
  setIndex: (n: number) => void
  onOpen: (i: number) => void
}) {
  const visible = useMemo(() => {
    const items = []
    for (let offset = -2; offset <= 2; offset += 1) {
      const i = (index + offset + photos.length) % photos.length
      items.push({ photo: photos[i], i, offset })
    }
    return items
  }, [index, photos])

  if (!photos.length) return null

  return (
    <div className="relative h-[380px] max-w-sm mx-auto flex items-center justify-center">
      <button
        className="absolute left-1 top-1/2 z-30 -translate-y-1/2 bg-white/80 rounded-full p-2 text-[#450b14] shadow-md hover:bg-white"
        onClick={() => setIndex((index - 1 + photos.length) % photos.length)}
        aria-label="Trước"
      >
        <ChevronLeft size={18} />
      </button>

      {visible.map(({ photo, i, offset }) => (
        <button
          key={`${photo.id}-${offset}`}
          type="button"
          onClick={() => (offset === 0 ? onOpen(i) : setIndex(i))}
          className="absolute origin-bottom transition-all duration-300"
          style={{
            width: offset === 0 ? '220px' : '150px',
            transform: `translateX(${offset * 75}px) rotate(${offset * 7}deg) scale(${offset === 0 ? 1 : 0.85})`,
            zIndex: 10 - Math.abs(offset),
            opacity: Math.abs(offset) === 2 ? 0.5 : 1,
          }}
        >
          <img
            src={photo.url}
            alt={photo.alt}
            className={cn(
              'w-full h-[290px] object-cover rounded-xl shadow-xl bg-stone-200',
              offset === 0 && 'border-4 border-white ring-2 ring-amber-300/50',
            )}
            loading="lazy"
          />
        </button>
      ))}

      <button
        className="absolute right-1 top-1/2 z-30 -translate-y-1/2 bg-white/80 rounded-full p-2 text-[#450b14] shadow-md hover:bg-white"
        onClick={() => setIndex((index + 1) % photos.length)}
        aria-label="Sau"
      >
        <ChevronRight size={18} />
      </button>

      {/* Pagination dots */}
      <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-1.5 z-30">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              'h-2 rounded-full transition-all',
              i === index ? 'w-5 bg-[#450b14]' : 'w-2 bg-[#450b14]/30',
            )}
            aria-label={`Trang ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function MiniCalendar({ iso }: { iso: string }) {
  const date = new Date(`${iso}T00:00:00`)
  const year = date.getFullYear()
  const month = date.getMonth()
  const selected = date.getDate()

  const rawFirstDay = new Date(year, month, 1).getDay()
  const firstDay = rawFirstDay === 0 ? 6 : rawFirstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => (i < firstDay ? null : i - firstDay + 1))
  const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

  return (
    <div className="mt-6 mx-auto max-w-[270px] bg-[#FAF6F0] text-[#38161b] p-4 rounded-xl shadow-md border border-amber-200/60">
      <p className="script text-2xl mb-3 text-[#450b14] text-center font-normal">
        Tháng {month + 1} / {year}
      </p>
      <div className="grid grid-cols-7 gap-y-1.5 text-center font-sans text-xs">
        {labels.map((l) => (
          <div key={l} className="font-bold text-[10px] text-[#7a5a60]">
            {l}
          </div>
        ))}
        {cells.map((d, i) => (
          <div key={i} className="h-6 flex items-center justify-center font-serif">
            {d === selected ? (
              <span className="w-6 h-6 rounded-full bg-[#450b14] text-amber-200 flex items-center justify-center font-bold text-xs shadow-md relative">
                {d}
              </span>
            ) : (
              <span className="opacity-80">{d}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function WishForm({ weddingId, guestName }: { weddingId: string; guestName?: string }) {
  const [name, setName] = useState(guestName || '')
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)

  if (done) return <p className="text-center font-sans text-xs text-[#450b14] font-medium my-4">Cảm ơn bạn! Lời chúc đã được gửi.</p>

  return (
    <form
      className="space-y-3 font-sans text-xs"
      onSubmit={(e) => {
        e.preventDefault()
        storeApi.addWish({
          id: uid('wish'),
          weddingId,
          name: name || 'Khách mời',
          message,
          visibility: 'visible',
          createdAt: new Date().toISOString(),
        })
        setDone(true)
      }}
    >
      <input
        className="w-full border border-[#d8c8b0] bg-white rounded-lg px-3 py-2.5 outline-none focus:border-[#450b14]"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nhập tên*"
        required
      />
      <textarea
        className="w-full border border-[#d8c8b0] bg-white rounded-lg px-3 py-2.5 outline-none focus:border-[#450b14]"
        rows={3}
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nhập lời chúc*"
      />
      <button className="w-full bg-[#450b14] text-amber-100 font-medium py-3 rounded-lg uppercase tracking-wider text-[11px] shadow-md hover:bg-[#5c101d] transition-colors">
        Gửi lời chúc
      </button>
    </form>
  )
}

function GiftModal({
  banks,
  onClose,
}: {
  banks: WeddingTemplateProps['bankAccounts']
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#FAF6F0] text-[#38161b] w-full max-w-sm p-6 rounded-2xl shadow-2xl font-sans" onClick={(e) => e.stopPropagation()}>
        <p className="tracking-[0.25em] uppercase text-xs text-center font-bold text-[#450b14]">Gửi mừng cưới</p>

        <div className="mt-6 space-y-6">
          {banks.map((b) => (
            <div key={b.id} className="text-center bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <p className="text-xs text-[#7a5a60] uppercase tracking-wider">{b.bankName}</p>
              <p className="serif text-xl text-[#450b14] font-medium my-1">{b.accountName}</p>
              <p className="tracking-widest font-mono text-sm font-bold text-stone-800">{b.accountNumber}</p>
              {b.qrImage && <img src={b.qrImage} alt="QR" className="w-40 mx-auto mt-3 rounded-lg shadow-sm" />}
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#450b14] font-semibold hover:underline"
                onClick={() => void navigator.clipboard.writeText(b.accountNumber)}
              >
                <Copy size={13} /> Copy số tài khoản
              </button>
            </div>
          ))}
        </div>

        <button className="mt-6 w-full bg-[#450b14] text-amber-100 py-3 rounded-xl text-xs tracking-widest uppercase font-medium" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  )
}
