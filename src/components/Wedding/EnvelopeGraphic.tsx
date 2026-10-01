import type { CSSProperties } from 'react'

/**
 * Envelope Graphic implementation with photo and floral bouquet shifted downwards
 * into the envelope pocket V-notch area.
 */
export function EnvelopeGraphic({
  photoUrl,
  groomName,
  brideName,
}: {
  photoUrl: string
  groomName: string
  brideName: string
}) {
  const displayPhoto = photoUrl || '/hero-wedding.jpg'

  return (
    <div className="relative z-10 mt-4 w-[88%] max-w-[340px] md:max-w-[420px] mx-auto select-none">
      <div className="relative aspect-[333/384]">
        {/* 1. Background Envelope (Top Flap & Inner lining) */}
        <img
          alt="Envelope Background"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 w-full max-w-none object-contain"
          src="/envelope-open.webp"
        />

        {/* 2. Photo (Shifted downwards inside envelope pocket) */}
        <div
          className="absolute left-[32%] top-[16%] z-20 w-[60%]"
          style={
            {
              animation: '6.5s ease-in-out 0.4s infinite normal none running drFloat',
              willChange: 'transform',
            } as CSSProperties
          }
        >
          <div className="aspect-[221/309] rotate-[12deg] border-[6px] border-white bg-white shadow-[2px_2px_6px_rgba(0,0,0,0.3)] overflow-hidden">
            <img
              alt={`${groomName} & ${brideName}`}
              className="h-full w-full object-cover"
              src={displayPhoto}
            />
          </div>
        </div>

        {/* 3. Flower decoration (Shifted downwards on left) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute block left-[0%] top-[2%] z-[25] w-[42%]"
        >
          <span
            className="block"
            style={
              {
                animation: '5s ease-in-out 0s infinite normal none running drFloat',
                willChange: 'transform',
              } as CSSProperties
            }
          >
            <img
              alt="Flower Decoration"
              className="block w-full max-w-none object-contain drop-shadow-[3px_4px_3px_rgba(0,0,0,0.3)] rotate-[-17deg]"
              src="/floral-ornament.webp"
            />
          </span>
        </span>

        {/* 4. Front Cover Envelope (Pocket covering the bottom of photo and flower) */}
        <div
          className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
          style={{ clipPath: 'inset(100% 0 0 0)' } as CSSProperties}
        >
          <img
            alt="Envelope Cover"
            aria-hidden="true"
            className="w-full h-full object-contain"
            src="/envelope-open.webp"
          />
        </div>
      </div>
    </div>
  )
}
