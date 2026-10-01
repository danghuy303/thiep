import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { WeddingPage } from '../Wedding/WeddingPage'
import { useStore } from '../../services/wedding/store'

export function PreviewPage() {
  const { weddingId, guestSlug } = useParams()
  const [params] = useSearchParams()
  const device = params.get('device') || 'desktop'
  const { db } = useStore()
  const wedding = db.weddings.find((w) => w.id === weddingId)
  const navigate = useNavigate()
  if (!wedding) return <Navigate to="/admin" />
  const guests = db.guests.filter((g) => g.weddingId === wedding.id)
  const width = device === 'mobile' ? 390 : device === 'tablet' ? 768 : '100%'

  return (
    <div className="min-h-dvh bg-[#e8e0d4]">
      <div className="sticky top-0 z-50 bg-[#fffaf3] border-b px-4 py-3 flex flex-wrap gap-3 items-center text-sm">
        <span className="serif text-lg">Preview</span>
        <select
          value={guestSlug || ''}
          onChange={(e) => navigate(`/preview/${wedding.id}${e.target.value ? `/${e.target.value}` : ''}`)}
        >
          <option value="">Quý khách</option>
          {guests.map((g) => (
            <option key={g.id} value={g.slug}>
              {g.displayName}
            </option>
          ))}
        </select>
        {['mobile', 'tablet', 'desktop'].map((d) => (
          <button key={d} className="border px-2 py-1" onClick={() => navigate(`?device=${d}`)}>
            {d}
          </button>
        ))}
      </div>
      <div className="mx-auto" style={{ width, maxWidth: '100%' }}>
        <WeddingPage preview />
      </div>
    </div>
  )
}
