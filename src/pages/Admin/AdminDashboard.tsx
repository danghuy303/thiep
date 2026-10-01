import { Link } from 'react-router-dom'
import { authService } from '../../services/auth/authService'
import { storeApi, useStore } from '../../services/wedding/store'

export function AdminDashboard() {
  const session = authService.getSession()!
  const { db } = useStore()
  const weddings = db.weddings.filter((w) => w.ownerId === session.userId)

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-[var(--muted)]">Dashboard</p>
          <h1 className="serif text-4xl mt-1">Thiệp cưới</h1>
        </div>
        <button
          className="bg-[#6b1d2a] text-white px-4 py-2 text-xs tracking-widest uppercase"
          onClick={() => {
            const w = storeApi.createWedding(session.userId, {})
            window.location.href = `/admin/weddings/${w.id}`
          }}
        >
          Tạo wedding mới
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {weddings.map((w) => {
          const guests = db.guests.filter((g) => g.weddingId === w.id)
          const rsvps = db.rsvps.filter((r) => r.weddingId === w.id)
          return (
            <Link key={w.id} to={`/admin/weddings/${w.id}`} className="bg-white p-5">
              <p className="text-[10px] tracking-widest uppercase text-[var(--muted)]">{w.status}</p>
              <h2 className="serif text-2xl mt-1">
                {w.groom.shortName} & {w.bride.shortName}
              </h2>
              <p className="text-sm mt-2 text-[var(--muted)]">
                {guests.length} khách · {rsvps.length} RSVP
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
