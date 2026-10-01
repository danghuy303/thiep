import { cn } from '../../utils'

/**
 * Burgundy Peony & Ivory Rose Floral Ornament Component
 * Rendering the authentic webp asset matching reference Images 1, 2, 3 & 4
 */
export function FloralOrnament({
  className,
  opacity = 1,
}: {
  className?: string
  opacity?: number
}) {
  return (
    <img
      src="/floral-ornament.webp"
      alt="Floral Ornament"
      className={cn('pointer-events-none drop-shadow-xl object-contain select-none', className)}
      style={{ opacity }}
    />
  )
}

// Export alias for compatibility
export const TrauCauOrnament = FloralOrnament

export function FloralHeaderSpray({ className }: { className?: string }) {
  return (
    <div className={cn('relative pointer-events-none flex justify-center items-center', className)}>
      <FloralOrnament className="w-32 h-auto -scale-x-100" />
      <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/60 flex items-center justify-center text-[#d4af37] font-serif text-lg font-bold shadow-md -mx-4 z-10">
        囍
      </div>
      <FloralOrnament className="w-32 h-auto" />
    </div>
  )
}
