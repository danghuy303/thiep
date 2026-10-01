import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect } from 'react'
import type { Photo } from '../../types'

export function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: Photo[]
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
}) {
  const photo = index === null ? null : photos[index]

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % photos.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, photos.length, onClose, onIndex])

  return (
    <AnimatePresence>
      {photo && index !== null && (
        <motion.div
          className="fixed inset-0 z-[80] bg-black/85 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button className="absolute top-4 right-4 text-white/80" onClick={onClose} aria-label="Đóng">
            <X />
          </button>
          <button
            className="absolute left-3 text-white/80"
            onClick={(e) => {
              e.stopPropagation()
              onIndex((index - 1 + photos.length) % photos.length)
            }}
            aria-label="Trước"
          >
            <ChevronLeft size={36} />
          </button>
          <motion.img
            key={photo.id}
            src={photo.url}
            alt={photo.alt}
            className="max-h-[88vh] max-w-[92vw] object-contain shadow-2xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
          <button
            className="absolute right-3 text-white/80"
            onClick={(e) => {
              e.stopPropagation()
              onIndex((index + 1) % photos.length)
            }}
            aria-label="Sau"
          >
            <ChevronRight size={36} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
