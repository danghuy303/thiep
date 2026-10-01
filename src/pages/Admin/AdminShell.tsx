import { useState } from 'react'
import {
  Calendar,
  Camera,
  Heart,
  LayoutTemplate,
  LogOut,
  MessageCircleHeart,
  Palette,
  Settings,
  Users,
  Wallet,
  Home,
  Menu,
  X,
  Eye,
  ExternalLink,
} from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { authService } from '../../services/auth/authService'
import { useStore } from '../../services/wedding/store'

export function AdminShell() {
  const navigate = useNavigate()
  const session = authService.getSession()
  const { weddingId } = useParams()
  const { db } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const wedding = weddingId
    ? db.weddings.find((w) => w.id === weddingId)
    : db.weddings[0]

  const items = wedding
    ? [
        { to: `/admin/weddings/${wedding.id}`, icon: Home, label: 'Tổng quan', end: true },
        { to: `/admin/weddings/${wedding.id}/couple`, icon: Heart, label: 'Cô dâu & Chú rể' },
        { to: `/admin/weddings/${wedding.id}/album`, icon: Camera, label: 'Album ảnh cưới' },
        { to: `/admin/weddings/${wedding.id}/story`, icon: Heart, label: 'Câu chuyện tình yêu' },
        { to: `/admin/weddings/${wedding.id}/events`, icon: Calendar, label: 'Thời gian & Lễ cưới' },
        { to: `/admin/weddings/${wedding.id}/guests`, icon: Users, label: 'Danh sách khách mời' },
        { to: `/admin/weddings/${wedding.id}/rsvp`, icon: MessageCircleHeart, label: 'Xác nhận RSVP' },
        { to: `/admin/weddings/${wedding.id}/wishes`, icon: MessageCircleHeart, label: 'Lời chúc sổ bút' },
        { to: `/admin/weddings/${wedding.id}/gift`, icon: Wallet, label: 'Mừng cưới & QR' },
        { to: `/admin/weddings/${wedding.id}/template`, icon: LayoutTemplate, label: 'Giao diện Thiệp' },
        { to: `/admin/weddings/${wedding.id}/theme`, icon: Palette, label: 'Tông màu Theme' },
        { to: `/admin/weddings/${wedding.id}/settings`, icon: Settings, label: 'Cài đặt nhạc & SEO' },
      ]
    : [{ to: '/admin', icon: Home, label: 'Bảng điều khiển', end: true }]

  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-[#f8f5ef] text-[#2c1a16] font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-64 hidden md:flex flex-col border-r border-stone-200 bg-[#fffcf7] shadow-sm sticky top-0 h-dvh">
        <div className="p-6 border-b border-stone-100">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#7a5a60] font-bold">Trang Quản Trị</p>
          <h1 className="serif text-2xl text-[#450b14] font-semibold mt-1">Thiệp Cưới Online</h1>
          {wedding && (
            <p className="text-xs text-[#7a5a60] mt-1 font-medium truncate">
              {wedding.groom.shortName} ❤️ {wedding.bride.shortName}
            </p>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#450b14] text-amber-100 shadow-md font-semibold'
                    : 'text-stone-700 hover:bg-stone-100/80 hover:text-[#450b14]'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-100 space-y-2">
          {wedding && (
            <Link
              to={`/w/${wedding.slug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs bg-amber-50 text-[#450b14] border border-amber-200 rounded-xl font-semibold hover:bg-amber-100 transition-colors"
            >
              <ExternalLink size={14} /> Xem Thiệp Public
            </Link>
          )}
          <button
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs text-red-700 hover:bg-red-50 rounded-xl font-semibold transition-colors"
            onClick={() => {
              authService.logout()
              navigate('/admin/login')
            }}
          >
            <LogOut size={15} /> Đăng xuất ({session?.name || 'Admin'})
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-[#fffcf7] border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#450b14] hover:bg-stone-100 rounded-lg"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div>
            <h1 className="serif text-lg text-[#450b14] font-semibold leading-none">Trang Quản Trị</h1>
            {wedding && (
              <p className="text-[11px] text-[#7a5a60] mt-0.5 font-medium">
                {wedding.groom.shortName} & {wedding.bride.shortName}
              </p>
            )}
          </div>
        </div>

        {wedding && (
          <div className="flex items-center gap-2">
            <Link
              to={`/preview/${wedding.id}`}
              target="_blank"
              className="p-2 text-stone-700 bg-stone-100 rounded-lg text-xs flex items-center gap-1 font-semibold"
            >
              <Eye size={16} /> Preview
            </Link>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-[#fffcf7] h-full flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="serif text-xl text-[#450b14] font-semibold">Danh mục quản trị</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-stone-600">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 my-3 space-y-1 overflow-y-auto">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                      isActive
                        ? 'bg-[#450b14] text-amber-100 font-semibold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            {wedding && (
              <Link
                to={`/w/${wedding.slug}`}
                target="_blank"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 text-xs bg-[#450b14] text-amber-100 rounded-xl font-semibold my-2"
              >
                <ExternalLink size={15} /> Xem trang thiệp Public
              </Link>
            )}
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <Outlet />
      </div>
    </div>
  )
}
