import { motion } from 'framer-motion'

export function GiftBoxCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="cursor-pointer group inline-flex flex-col items-center justify-center p-4 transition-transform hover:scale-[1.03] select-none focus:outline-none"
    >
      <p className="tracking-[0.25em] text-sm uppercase text-[#574312] font-serif font-bold mb-6">
        HỘP QUÀ MỪNG
      </p>

      {/* 3D Interactive Floating Giftbox Container */}
      <motion.div
        className="relative"
        style={{ width: 200, height: 220 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Drop Shadow */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            bottom: '-8px',
            width: 144,
            height: 12,
            marginLeft: -72,
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            filter: 'blur(4px)',
            zIndex: 0,
            willChange: 'transform, opacity',
          }}
        />

        {/* Mini Floating Giftbox Decors */}
        <img
          alt=""
          loading="lazy"
          className="absolute pointer-events-none"
          src="/images/giftbox/mini/porcelain_blue.webp"
          style={{
            left: -20,
            top: 10,
            width: 34,
            zIndex: 1,
            transform: 'rotate(-22deg)',
            filter: 'drop-shadow(rgba(0, 0, 0, 0.25) 0px 2px 3px)',
          }}
        />
        <img
          alt=""
          loading="lazy"
          className="absolute pointer-events-none"
          src="/images/giftbox/mini/double_dragon_red.webp"
          style={{
            left: 168,
            top: 2,
            width: 38,
            zIndex: 1,
            transform: 'rotate(20deg)',
            filter: 'drop-shadow(rgba(0, 0, 0, 0.25) 0px 2px 3px)',
          }}
        />
        <img
          alt=""
          loading="lazy"
          className="absolute pointer-events-none"
          src="/images/giftbox/mini/porcelain_brown.webp"
          style={{
            left: -16,
            top: 120,
            width: 26,
            zIndex: 1,
            transform: 'rotate(-18deg)',
            filter: 'drop-shadow(rgba(0, 0, 0, 0.25) 0px 2px 3px)',
          }}
        />
        <img
          alt=""
          loading="lazy"
          className="absolute pointer-events-none"
          src="/images/giftbox/mini/riviera_blue.webp"
          style={{
            left: 182,
            top: 114,
            width: 24,
            zIndex: 1,
            transform: 'rotate(14deg)',
            filter: 'drop-shadow(rgba(0, 0, 0, 0.25) 0px 2px 3px)',
          }}
        />

        {/* Main Central 3D Gift Box */}
        <img
          alt="Hộp quà mừng"
          loading="lazy"
          className="absolute pointer-events-none transition-transform group-hover:scale-105"
          src="/images/giftbox/minimalism_brown.webp"
          style={{
            left: '50%',
            bottom: 0,
            width: 170,
            maxHeight: 220,
            objectFit: 'contain',
            marginLeft: -85,
            zIndex: 2,
            filter: 'drop-shadow(rgba(0, 0, 0, 0.25) 0px 10px 18px)',
          }}
        />

        {/* Bottom Decors */}
        <img
          alt=""
          loading="lazy"
          className="absolute pointer-events-none"
          src="/images/giftbox/mini/qasr_gold.webp"
          style={{
            left: -8,
            top: 172,
            width: 44,
            zIndex: 3,
            transform: 'rotate(8deg)',
            filter: 'drop-shadow(rgba(0, 0, 0, 0.25) 0px 2px 3px)',
          }}
        />
        <img
          alt=""
          loading="lazy"
          className="absolute pointer-events-none"
          src="/images/giftbox/mini/sunflower_yellow.webp"
          style={{
            left: 26,
            top: 182,
            width: 26,
            zIndex: 3,
            transform: 'rotate(-10deg)',
            filter: 'drop-shadow(rgba(0, 0, 0, 0.25) 0px 2px 3px)',
          }}
        />
        <img
          alt=""
          loading="lazy"
          className="absolute pointer-events-none"
          src="/images/giftbox/mini/minimalism_red.webp"
          style={{
            left: 118,
            top: 176,
            width: 40,
            zIndex: 3,
            transform: 'rotate(-14deg)',
            filter: 'drop-shadow(rgba(0, 0, 0, 0.25) 0px 2px 3px)',
          }}
        />
      </motion.div>

      <p className="text-xs text-[#574312]/80 font-sans tracking-wide mt-6 group-hover:text-[#450b14] group-hover:font-medium transition-colors">
        Nhấn để mở
      </p>
    </div>
  )
}
