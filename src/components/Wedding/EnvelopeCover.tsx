import { motion } from 'framer-motion'
import { Heart, Volume2, VolumeX } from 'lucide-react'
import type { Guest, Wedding, WeddingSettings } from '../../types'
import { formatWeddingDate } from '../../utils'
import { TrauCauOrnament } from './TrauCauOrnament'

export function EnvelopeCover({
  wedding,
  guest,
  settings,
  onOpen,
  musicOn,
  onToggleMusic,
}: {
  wedding: Wedding
  guest?: Guest | null
  settings: WeddingSettings
  onOpen: () => void
  musicOn: boolean
  onToggleMusic: () => void
}) {
  const guestLabel = guest?.displayName || settings.defaultGuestLabel

  return (
    <div className="relative min-h-dvh bg-[#450b14] text-[#450b14] overflow-hidden flex flex-col items-center justify-center px-4 py-8">
      {/* Background Floating Hearts Particle Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-200/40"
            style={{
              left: `${(i * 17) % 95}%`,
              top: `${(i * 23) % 90}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 4 + (i % 3) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          >
            <Heart size={10 + (i % 4) * 6} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Music Toggle Floating Button */}
      <button
        type="button"
        onClick={onToggleMusic}
        className="absolute top-5 right-5 z-30 text-amber-100/90 bg-[#32060c]/60 p-2.5 rounded-full border border-amber-200/30 backdrop-blur-sm"
        aria-label="Nhạc nền"
      >
        {musicOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* Central Envelope / Invitation Card (Matching Image 1) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-[370px] bg-[#faf6f0] rounded-2xl p-7 md:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.55)] border border-amber-200/40 text-center flex flex-col items-center z-10"
      >
        {/* Decorative Floral Side Ornaments (Resized smaller & positioned to avoid obscuring text) */}
        <TrauCauOrnament className="absolute -left-7 -top-7 w-24 md:w-28 h-auto pointer-events-none drop-shadow-md z-0" opacity={0.95} />
        <TrauCauOrnament className="absolute -right-7 -top-7 w-24 md:w-28 h-auto pointer-events-none -scale-x-100 drop-shadow-md z-0" opacity={0.95} />

        {/* Top Heart Icon Badge */}
        <div className="w-11 h-11 rounded-full bg-[#450b14] text-amber-100 flex items-center justify-center mb-5 shadow-inner z-10">
          <Heart size={20} fill="currentColor" />
        </div>

        {/* Guest Greeting if personal */}
        {guestLabel && guestLabel !== 'Quý khách' && (
          <p className="text-xs uppercase tracking-[0.2em] text-[#8c6d1e] mb-2 font-medium z-10">
            {settings.invitationPrefix} {guestLabel}
          </p>
        )}

        {/* Couple Names - Ensures clear visibility without floral overlap */}
        <div className="z-10 w-full px-2 my-1">
          <h1 className="serif text-3xl md:text-[34px] text-[#450b14] leading-snug font-normal tracking-tight">
            {wedding.groom.shortName}
          </h1>
          <p className="script text-2xl text-[#c9a24d] my-1">&</p>
          <h2 className="serif text-3xl md:text-[34px] text-[#450b14] leading-snug font-normal tracking-tight mb-3">
            {wedding.bride.shortName}
          </h2>
        </div>

        {/* Subtle Decorative Line */}
        <div className="flex items-center gap-2 my-2 text-[#c9a24d]/60 z-10">
          <div className="h-px w-12 bg-[#c9a24d]/40" />
          <span className="text-xs">❖</span>
          <div className="h-px w-12 bg-[#c9a24d]/40" />
        </div>

        {/* Date Display */}
        <p className="text-sm font-medium tracking-wide text-[#574312] mt-2 mb-2">
          {formatWeddingDate(wedding.weddingDate)}
        </p>

        <p className="text-xs tracking-[0.2em] text-[#8c6d1e] uppercase mb-8">{settings.coverTitle}</p>

        {/* Action Button: Mở thiệp */}
        <motion.button
          type="button"
          onClick={onOpen}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="bg-[#450b14] hover:bg-[#5c101d] text-amber-100 font-medium px-9 py-3 rounded-full text-xs tracking-[0.25em] uppercase shadow-lg border border-amber-300/30 transition-all flex items-center gap-2"
        >
          <span>Mở thiệp</span>
        </motion.button>
      </motion.div>
    </div>
  )
}
