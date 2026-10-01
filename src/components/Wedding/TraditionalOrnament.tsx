import { cn } from '../../utils'

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

export function TraditionalOrnament({
  corner = 'center',
  className,
  opacity = 0.55,
}: {
  corner?: Corner
  className?: string
  opacity?: number
}) {
  const pos: Record<Corner, string> = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 scale-x-[-1]',
    'bottom-left': 'bottom-0 left-0 scale-y-[-1]',
    'bottom-right': 'bottom-0 right-0 scale-[-1]',
    center: 'inset-0 m-auto',
  }

  return (
    <svg
      viewBox="0 0 220 260"
      fill="none"
      className={cn('pointer-events-none absolute w-36 md:w-48', pos[corner], className)}
      style={{ opacity }}
      aria-hidden
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M48 210c28-18 46-52 42-96" strokeWidth="1.4" />
        <path d="M90 118c-18-38-8-72 22-96" strokeWidth="1.4" />
        <path
          d="M112 28c18 8 28 26 18 48-22 8-36-10-18-48z"
          strokeWidth="1.3"
          fill="currentColor"
          fillOpacity="0.08"
        />
        <ellipse cx="78" cy="86" rx="10" ry="16" transform="rotate(-28 78 86)" strokeWidth="1.2" />
        <ellipse cx="70" cy="118" rx="9" ry="15" transform="rotate(-12 70 118)" strokeWidth="1.2" />
        <path d="M64 150c18-6 22-22 8-30-16 8-18 22-8 30z" strokeWidth="1.2" fill="currentColor" fillOpacity="0.12" />
        <circle cx="92" cy="168" r="5" strokeWidth="1.1" />
        <circle cx="104" cy="186" r="4" strokeWidth="1.1" />
        <path d="M40 70c20 8 18 34-4 40 6-16 2-32 4-40z" strokeWidth="1.1" />
        <path d="M132 92c22 2 28 28 6 40" strokeWidth="1.1" />
        <path d="M148 48c14 18 6 40-16 44" strokeWidth="1" />
        <circle cx="156" cy="42" r="3" />
      </g>
    </svg>
  )
}

export function FloralSpray({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 320" className={cn('pointer-events-none', className)} aria-hidden>
      <g fill="none" strokeLinecap="round">
        <path d="M40 300 C80 240 70 160 120 90" stroke="#5a3a2a" strokeWidth="2" />
        <circle cx="78" cy="230" r="22" fill="#6b1d2a" />
        <circle cx="72" cy="224" r="8" fill="#3d1018" opacity="0.35" />
        <circle cx="118" cy="170" r="28" fill="#7a2230" />
        <circle cx="112" cy="162" r="10" fill="#4a121c" opacity="0.3" />
        <circle cx="150" cy="118" r="20" fill="#efe6d4" />
        <circle cx="146" cy="112" r="6" fill="#c9a24d" opacity="0.5" />
        <circle cx="168" cy="78" r="16" fill="#6b1d2a" />
        <ellipse cx="96" cy="200" rx="18" ry="10" fill="#4e6a4a" opacity="0.55" transform="rotate(-30 96 200)" />
        <ellipse cx="140" cy="148" rx="16" ry="8" fill="#5d7a58" opacity="0.45" transform="rotate(-20 140 148)" />
        <circle cx="54" cy="268" r="10" fill="#8e2a3a" />
        <circle cx="190" cy="58" r="5" fill="#c9a24d" />
      </g>
    </svg>
  )
}

export function WaxSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      <defs>
        <radialGradient id="waxGold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fcedb4" />
          <stop offset="35%" stopColor="#e5b84c" />
          <stop offset="70%" stopColor="#b38722" />
          <stop offset="100%" stopColor="#6e4f0c" />
        </radialGradient>
        <filter id="waxShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      {/* Irregular Organic Wax Stamp Outer Edge */}
      <path
        d="M 40 4 C 58 3, 75 12, 77 30 C 79 48, 70 73, 50 76 C 30 79, 6 68, 4 48 C 2 28, 22 5, 40 4 Z"
        fill="url(#waxGold)"
        filter="url(#waxShadow)"
      />
      {/* Outer Debossed Groove */}
      <path
        d="M 40 9 C 55 8, 70 16, 72 32 C 74 47, 65 67, 48 70 C 31 73, 11 63, 9 46 C 7 30, 25 10, 40 9 Z"
        fill="none"
        stroke="#fff4cc"
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Inner Rim Accent */}
      <circle cx="40" cy="40" r="26" fill="none" stroke="#5e4107" strokeWidth="1.8" opacity="0.6" />

      {/* Heart Logo Motif Matching Reference Image 2 */}
      <path
        d="M 40 53 C 33 46, 23 37, 23 29 C 23 22, 28 17, 35 17 C 38.5 17, 40 19.5, 40 19.5 C 40 19.5, 41.5 17, 45 17 C 52 17, 57 22, 57 29 C 57 37, 47 46, 40 53 Z"
        fill="none"
        stroke="#523907"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 40 53 C 33 46, 23 37, 23 29 C 23 22, 28 17, 35 17 C 38.5 17, 40 19.5, 40 19.5 C 40 19.5, 41.5 17, 45 17 C 52 17, 57 22, 57 29 C 57 37, 47 46, 40 53 Z"
        fill="none"
        stroke="#450b14"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PalaceSketch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 220" className={cn('pointer-events-none text-[var(--primary)]', className)} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.18">
        <path d="M40 200 L80 120 H160 L200 200" />
        <path d="M80 120 L120 70 L160 120" />
        <rect x="100" y="140" width="40" height="60" />
        <path d="M230 200 V90 H570 V200" />
        <path d="M230 90 L400 30 L570 90" />
        <circle cx="400" cy="70" r="18" />
        <rect x="280" y="120" width="50" height="80" />
        <rect x="470" y="120" width="50" height="80" />
        <path d="M600 200 L640 110 H720 L760 200" />
        <path d="M640 110 L680 60 L720 110" />
      </g>
    </svg>
  )
}
