import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { storeApi } from '../../services/wedding/store'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../../data/seed'

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState('')

  return (
    <div className="min-h-dvh paper-bg grid place-items-center px-4">
      <form
        className="w-full max-w-sm bg-[var(--surface)] p-8 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault()
          try {
            storeApi.login(email, password)
            navigate('/admin')
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
          }
        }}
      >
        <p className="tracking-[0.3em] uppercase text-xs text-[var(--primary)]">Admin</p>
        <h1 className="serif text-3xl mt-2">Đăng nhập</h1>
        <label className="block mt-6 text-xs uppercase tracking-widest">Email</label>
        <input className="w-full border-b py-2 bg-transparent" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block mt-4 text-xs uppercase tracking-widest">Mật khẩu</label>
        <input className="w-full border-b py-2 bg-transparent" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-700 mt-3">{error}</p>}
        <button className="mt-6 w-full bg-[var(--primary)] text-[var(--surface)] py-3 text-xs tracking-[0.2em] uppercase">
          Vào dashboard
        </button>
        <p className="mt-4 text-xs text-[var(--muted)]">
          Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
        </p>
      </form>
    </div>
  )
}
