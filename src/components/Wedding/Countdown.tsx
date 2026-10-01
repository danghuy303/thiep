import { useEffect, useMemo, useState } from 'react'

export function Countdown({ date, time }: { date: string; time: string }) {
  const target = useMemo(() => new Date(`${date}T${time}:00`).getTime(), [date, time])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  const diff = target - now
  if (diff <= 0) {
    return (
      <p className="serif text-center text-2xl md:text-3xl text-[var(--gold)]">Ngày trọng đại đã đến ❤️</p>
    )
  }

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  const items = [
    [days, 'Ngày'],
    [hours, 'Giờ'],
    [minutes, 'Phút'],
    [seconds, 'Giây'],
  ] as const

  return (
    <div className="flex justify-center gap-4 md:gap-8">
      {items.map(([value, label]) => (
        <div key={label} className="text-center min-w-16">
          <div className="serif text-4xl md:text-5xl font-medium tracking-wide">{String(value).padStart(2, '0')}</div>
          <div className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-[var(--muted)] mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
