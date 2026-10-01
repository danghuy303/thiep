import { useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import type { BankAccount, Guest, LoveStoryItem, Photo, ThemeId, Wedding, WeddingEvent, WeddingSettings } from '../../types'
import { templateOptions, themes } from '../../themes'
import { compressImage } from '../../services/storage/StorageService'
import { storeApi, useStore } from '../../services/wedding/store'
import { formatBytes, formatWeddingDate, slugifyVi, uid } from '../../utils'

function useOwnedWedding() {
  const { weddingId } = useParams()
  const { db } = useStore()
  const wedding = weddingId ? db.weddings.find((w) => w.id === weddingId) : db.weddings[0]
  return { db, wedding }
}

export function WeddingHome() {
  const { db, wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  const guests = db.guests.filter((g) => g.weddingId === wedding.id)
  const rsvps = db.rsvps.filter((r) => r.weddingId === wedding.id)
  const yes = rsvps.filter((r) => r.attendance === 'yes')
  const no = rsvps.filter((r) => r.attendance === 'no')
  const cards = [
    ['Cô dâu', wedding.bride.shortName],
    ['Chú rể', wedding.groom.shortName],
    ['Ngày cưới', formatWeddingDate(wedding.weddingDate)],
    ['Khách mời', String(guests.length)],
    ['Album ảnh', String(db.photos.filter((p) => p.weddingId === wedding.id).length)],
    ['Xác nhận RSVP', `${yes.length} tham dự · ${no.length} vắng`],
    ['Lời chúc', String(db.wishes.filter((w) => w.weddingId === wedding.id).length)],
    ['Trạng thái thiệp', wedding.status],
  ]
  return (
    <div>
      <Header wedding={wedding} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {cards.map(([k, v]) => (
          <div key={k} className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a5a60]">{k}</p>
            <p className="serif text-2xl mt-2 text-[#450b14] font-medium">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="serif text-2xl text-[#450b14]">Lối tắt chỉnh sửa nhanh</h3>
        <div className="flex flex-wrap gap-3">
          <Link to={`/admin/weddings/${wedding.id}/couple`} className="bg-[#450b14] text-amber-100 px-5 py-2.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold shadow-sm hover:bg-[#5c101d] transition-colors">
            ✏️ Sửa thông tin & Upload ảnh thiệp
          </Link>
          <Link to={`/admin/weddings/${wedding.id}/album`} className="bg-amber-100 text-[#450b14] border border-amber-300 px-5 py-2.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold shadow-sm hover:bg-amber-200 transition-colors">
            🖼️ Thêm ảnh vào Album
          </Link>
          <Link to={`/admin/weddings/${wedding.id}/gift`} className="bg-stone-100 text-stone-800 border border-stone-300 px-5 py-2.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold shadow-sm hover:bg-stone-200 transition-colors">
            💳 Ngân hàng & QR Mừng cưới
          </Link>
          <Link to={`/w/${wedding.slug}`} target="_blank" className="border border-[#450b14] text-[#450b14] px-5 py-2.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#450b14] hover:text-amber-100 transition-colors">
            🔗 Xem trang thiệp Public
          </Link>
        </div>
      </div>
    </div>
  )
}

export function CoupleEditor() {
  const { wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  return (
    <EditorForm wedding={wedding}>
      {(draft, set) => (
        <div className="space-y-8">
          {/* SECTION 1: CÔ DÂU & CHÚ RỂ */}
          <div>
            <h2 className="serif text-2xl text-[#450b14] border-b pb-2 mb-4">1. Thông tin Cô Dâu & Chú Rể</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <PersonFields title="Chú Rể (Nhà Trai)" person={draft.groom} onChange={(groom) => set({ ...draft, groom })} />
              <PersonFields title="Cô Dâu (Nhà Gái)" person={draft.bride} onChange={(bride) => set({ ...draft, bride })} />
            </div>
          </div>

          {/* SECTION 2: HÌNH ẢNH CHÍNH */}
          <div>
            <h2 className="serif text-2xl text-[#450b14] border-b pb-2 mb-4">2. Upload Hình Ảnh Thiệp & Bao Thư</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <ImageField
                label="📸 Ảnh cưới trong bao thư (SAVE THE DATE - Hiển thị nhô ra khỏi phong bao)"
                value={draft.heroImage || draft.coverImage}
                onChange={(heroImage) => set({ ...draft, heroImage, coverImage: heroImage })}
              />
              <ImageField
                label="Ảnh bìa bổ sung (Cover Image)"
                value={draft.coverImage || draft.heroImage}
                onChange={(coverImage) => set({ ...draft, coverImage })}
              />
            </div>
          </div>

          {/* SECTION 3: THỜI GIAN & ĐỊA ĐIỂM */}
          <div>
            <h2 className="serif text-2xl text-[#450b14] border-b pb-2 mb-4">3. Thời Gian & Địa Điểm Tổ Chức</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Ngày cưới (Dương lịch)" type="date" value={draft.weddingDate} onChange={(weddingDate) => set({ ...draft, weddingDate })} />
              <Field label="Giờ tổ chức chính" value={draft.weddingTime} onChange={(weddingTime) => set({ ...draft, weddingTime })} />
              <Field label="Ngày âm lịch (Ví dụ: Tức ngày 15 tháng 11 năm Ất Tỵ)" value={draft.lunarDate || ''} onChange={(lunarDate) => set({ ...draft, lunarDate })} />
              <Field label="Tên trung tâm / địa điểm tiệc" value={draft.venueName} onChange={(venueName) => set({ ...draft, venueName })} />
              <div className="md:col-span-2">
                <Field label="Địa chỉ chi tiết" value={draft.venueAddress} onChange={(venueAddress) => set({ ...draft, venueAddress })} />
              </div>
              <div className="md:col-span-2">
                <Field label="Đường dẫn Google Maps (Chỉ đường)" value={draft.googleMapsUrl} onChange={(googleMapsUrl) => set({ ...draft, googleMapsUrl })} />
              </div>
              <div className="md:col-span-2">
                <Field label="Lời ngỏ / Mô tả ngắn" value={draft.description} onChange={(description) => set({ ...draft, description })} />
              </div>
            </div>
          </div>
        </div>
      )}
    </EditorForm>
  )
}

export function AlbumEditor() {
  const { db, wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  const photos = db.photos.filter((p) => p.weddingId === wedding.id).sort((a, b) => a.order - b.order)

  const addFiles = async (files: FileList | null) => {
    if (!files) return
    const added: Photo[] = []
    for (const file of Array.from(files)) {
      const compressed = await compressImage(file)
      added.push({
        id: uid('photo'),
        weddingId: wedding.id,
        url: compressed.dataUrl,
        alt: file.name,
        width: compressed.width,
        height: compressed.height,
        sizeLabel: `${compressed.width}×${compressed.height}`,
        bytes: compressed.bytes,
        order: photos.length + added.length + 1,
        isCover: false,
        category: 'album',
      })
    }
    storeApi.savePhotos(wedding.id, [...photos, ...added])
  }

  return (
    <div>
      <Header wedding={wedding} title="Album Ảnh Cưới" />
      <label className="mt-4 block border-2 border-dashed border-amber-800/30 p-8 text-center bg-white rounded-xl cursor-pointer hover:bg-amber-50/50 transition-colors">
        <span className="text-2xl block mb-2">📸</span>
        <span className="font-semibold text-[#450b14]">Bấm vào đây hoặc Kéo thả ảnh để Upload vào Album</span>
        <span className="block text-xs text-[var(--muted)] mt-1">(Ảnh sẽ tự động được nén tối ưu dung lượng)</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => void addFiles(e.target.files)} />
      </label>
      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((p, i) => (
          <div key={p.id} className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <img src={p.url} alt="" className="w-full h-44 object-cover rounded-lg bg-stone-200" />
            <div className="mt-2 text-xs">
              <p className="font-medium truncate">{p.alt}</p>
              <p className="text-[10px] text-[var(--muted)]">
                {p.sizeLabel} · {formatBytes(p.bytes)}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t flex justify-between items-center text-xs">
              <button
                className="text-xs bg-stone-100 px-2 py-1 rounded hover:bg-stone-200"
                onClick={() => {
                  const next = photos.map((x, idx) => (idx === i ? { ...x, isCover: true } : { ...x, isCover: false }))
                  storeApi.savePhotos(wedding.id, next)
                  storeApi.saveWedding({ ...wedding, coverImage: p.url })
                }}
              >
                Đặt làm Cover
              </button>
              <div className="flex gap-2">
                <button disabled={i === 0} onClick={() => movePhoto(photos, i, -1, wedding.id)} className="disabled:opacity-30">
                  ←
                </button>
                <button disabled={i === photos.length - 1} onClick={() => movePhoto(photos, i, 1, wedding.id)} className="disabled:opacity-30">
                  →
                </button>
                <button className="text-red-700 font-bold ml-1" onClick={() => storeApi.savePhotos(wedding.id, photos.filter((x) => x.id !== p.id))}>
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function movePhoto(photos: Photo[], index: number, dir: number, weddingId: string) {
  const next = [...photos]
  const target = index + dir
  if (target < 0 || target >= next.length) return
  const temp = next[index]
  next[index] = next[target]
  next[target] = temp
  const reordered = next.map((p, idx) => ({ ...p, order: idx + 1 }))
  storeApi.savePhotos(weddingId, reordered)
}

export function StoryEditor() {
  const { db, wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  const story = db.loveStories.filter((s) => s.weddingId === wedding.id).sort((a, b) => a.order - b.order)
  return (
    <div>
      <Header wedding={wedding} title="Love Story" />
      <div className="mt-4 space-y-4">
        {story.map((item, i) => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Năm" value={item.year} onChange={(year) => updateStory(story, i, { ...item, year }, wedding.id)} />
              <Field label="Tiêu đề" value={item.title} onChange={(title) => updateStory(story, i, { ...item, title }, wedding.id)} />
            </div>
            <Field label="Nội dung kỷ niệm" value={item.content} onChange={(content) => updateStory(story, i, { ...item, content }, wedding.id)} />
            <ImageField label="Ảnh kỷ niệm" value={item.image || ''} onChange={(image) => updateStory(story, i, { ...item, image }, wedding.id)} />
            <button className="text-xs text-red-700 font-semibold" onClick={() => storeApi.saveStories(wedding.id, story.filter((_, idx) => idx !== i))}>
              Xóa kỷ niệm này
            </button>
          </div>
        ))}
        <button
          className="bg-[#450b14] text-amber-100 px-4 py-2 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold"
          onClick={() =>
            storeApi.saveStories(wedding.id, [
              ...story,
              { id: uid('story'), weddingId: wedding.id, year: '2024', title: 'Kỷ niệm mới', content: '', order: story.length + 1 },
            ])
          }
        >
          + Thêm cột mốc kỷ niệm
        </button>
      </div>
    </div>
  )
}

function updateStory(list: LoveStoryItem[], index: number, item: LoveStoryItem, weddingId: string) {
  const next = [...list]
  next[index] = item
  storeApi.saveStories(weddingId, next)
}

export function EventsEditor() {
  const { db, wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  const events = db.events.filter((e) => e.weddingId === wedding.id).sort((a, b) => a.order - b.order)
  return (
    <div>
      <Header wedding={wedding} title="Sự kiện Lễ Cưới & Tiệc Cưới" />
      <div className="mt-4 space-y-6">
        {events.map((ev, i) => (
          <div key={ev.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3">
            <h3 className="serif text-xl text-[#450b14] font-medium">{ev.title}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Tên sự kiện" value={ev.title} onChange={(title) => updateEvent(events, i, { ...ev, title }, wedding.id)} />
              <Field label="Ngày cử hành" type="date" value={ev.date} onChange={(date) => updateEvent(events, i, { ...ev, date }, wedding.id)} />
              <Field label="Giờ bắt đầu" value={ev.time} onChange={(time) => updateEvent(events, i, { ...ev, time }, wedding.id)} />
              <Field label="Địa chỉ tổ chức" value={ev.address} onChange={(address) => updateEvent(events, i, { ...ev, address }, wedding.id)} />
              <div className="sm:col-span-2">
                <Field label="Mô tả phụ (Ví dụ: Đón khách 17:30 · Khai tiệc 18:00)" value={ev.description || ''} onChange={(description) => updateEvent(events, i, { ...ev, description }, wedding.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function updateEvent(list: WeddingEvent[], index: number, item: WeddingEvent, weddingId: string) {
  const next = [...list]
  next[index] = item
  storeApi.saveEvents(weddingId, next)
}

export function GuestsEditor() {
  const { db, wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  const guests = db.guests.filter((g) => g.weddingId === wedding.id)
  const [name, setName] = useState('')
  return (
    <div>
      <Header wedding={wedding} title="Danh sách Khách mời" />
      <div className="bg-white p-4 mt-4 rounded-xl border border-stone-200 shadow-sm flex gap-3">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
          placeholder="Nhập tên khách mời..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="bg-[#450b14] text-amber-100 px-5 py-2 rounded-lg text-xs uppercase font-semibold"
          onClick={() => {
            if (!name.trim()) return
            const baseSlug = slugifyVi(name) || uid('g')
            const newGuest: Guest = {
              id: uid('guest'),
              weddingId: wedding.id,
              name: name.trim(),
              displayName: name.trim(),
              slug: baseSlug,
              numberOfGuests: 1,
              relationship: 'Bạn bè',
              status: 'pending',
              createdAt: new Date().toISOString(),
            }
            storeApi.upsertGuest(newGuest)
            setName('')
          }}
        >
          + Thêm khách
        </button>
      </div>
      <div className="mt-4 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden text-sm">
        {guests.map((g) => (
          <div key={g.id} className="p-3 border-b flex justify-between items-center">
            <div>
              <p className="font-semibold text-stone-800">{g.name}</p>
              <p className="text-xs text-[var(--muted)]">Link thiệp: /w/{wedding.slug}/{g.slug}</p>
            </div>
            <button className="text-xs text-red-700 font-bold" onClick={() => storeApi.deleteGuest(g.id)}>
              Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RsvpAdmin() {
  const { db, wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  const rsvps = db.rsvps.filter((r) => r.weddingId === wedding.id)
  return (
    <div>
      <Header wedding={wedding} title="Xác nhận tham dự (RSVP)" />
      <div className="mt-4 space-y-3">
        {rsvps.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-bold">{r.name}</p>
              <p className="text-xs text-[var(--muted)]">Số người tham dự: {r.numberOfGuests}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${r.attendance === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {r.attendance === 'yes' ? 'Tham dự' : 'Không thể đến'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WishesAdmin() {
  const { db, wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  const wishes = db.wishes.filter((w) => w.weddingId === wedding.id)
  return (
    <div>
      <Header wedding={wedding} title="Lời chúc Sổ Bút" />
      <div className="mt-4 space-y-3">
        {wishes.map((w) => (
          <div key={w.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <p className="serif italic text-stone-800">“{w.message}”</p>
            <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
              <span className="font-bold text-[#450b14]">— {w.name}</span>
              <button className="text-red-700 font-bold" onClick={() => storeApi.deleteWish(w.id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function GiftAdmin() {
  const { db, wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  const banks = db.bankAccounts.filter((b) => b.weddingId === wedding.id)
  return (
    <div>
      <Header wedding={wedding} title="Thông tin Mừng cưới & Mã QR" />
      <div className="mt-4 space-y-4">
        {banks.map((b, i) => (
          <div key={b.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Tên ngân hàng" value={b.bankName} onChange={(bankName) => updateBank(banks, i, { ...b, bankName }, wedding.id)} />
              <Field label="Tên chủ tài khoản" value={b.accountName} onChange={(accountName) => updateBank(banks, i, { ...b, accountName }, wedding.id)} />
              <Field label="Số tài khoản" value={b.accountNumber} onChange={(accountNumber) => updateBank(banks, i, { ...b, accountNumber }, wedding.id)} />
            </div>
            <ImageField label="Mã QR Chuyển Khoản" value={b.qrImage || ''} onChange={(qrImage) => updateBank(banks, i, { ...b, qrImage }, wedding.id)} />
            <button className="text-xs text-red-700 font-semibold" onClick={() => storeApi.saveBanks(wedding.id, banks.filter((_, idx) => idx !== i))}>
              Xóa tài khoản này
            </button>
          </div>
        ))}
        <button
          className="bg-[#450b14] text-amber-100 px-4 py-2 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold"
          onClick={() =>
            storeApi.saveBanks(wedding.id, [
              ...banks,
              { id: uid('bank'), weddingId: wedding.id, bankName: 'Vietcombank', accountName: wedding.groom.name, accountNumber: '0123456789', forPerson: 'both' },
            ])
          }
        >
          + Thêm tài khoản ngân hàng
        </button>
      </div>
    </div>
  )
}

function updateBank(list: BankAccount[], index: number, item: BankAccount, weddingId: string) {
  const next = [...list]
  next[index] = item
  storeApi.saveBanks(weddingId, next)
}

export function TemplateAdmin() {
  const { wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  return (
    <div>
      <Header wedding={wedding} title="Chọn Template" />
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        {templateOptions.map((t) => (
          <button
            key={t.id}
            className={`p-5 text-left rounded-xl border bg-white shadow-sm transition-all ${wedding.templateId === t.id ? 'border-[#450b14] ring-2 ring-[#450b14]/20' : 'border-stone-200'}`}
            onClick={() => storeApi.saveWedding({ ...wedding, templateId: t.id })}
          >
            <h3 className="serif text-xl font-bold">{t.name}</h3>
          </button>
        ))}
      </div>
    </div>
  )
}

export function ThemeAdmin() {
  const { wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  return (
    <div>
      <Header wedding={wedding} title="Màu sắc Theme" />
      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        {Object.entries(themes).map(([id, t]) => (
          <button
            key={id}
            className={`p-4 rounded-xl border bg-white shadow-sm text-left ${wedding.themeId === id ? 'border-[#450b14] ring-2 ring-[#450b14]/20' : 'border-stone-200'}`}
            onClick={() => storeApi.saveWedding({ ...wedding, themeId: id as ThemeId })}
          >
            <div className="flex gap-2 mb-2">
              <span className="w-5 h-5 rounded-full" style={{ background: t.primary }} />
              <span className="w-5 h-5 rounded-full" style={{ background: t.secondary }} />
              <span className="w-5 h-5 rounded-full" style={{ background: t.background }} />
            </div>
            <p className="serif font-semibold">{t.name}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export function SettingsAdmin() {
  const { db, wedding } = useOwnedWedding()
  if (!wedding) return <Navigate to="/admin" />
  const settings = db.settings.find((s) => s.weddingId === wedding.id)!
  const saveS = (s: WeddingSettings) => storeApi.saveSettings(s)
  return (
    <div>
      <Header wedding={wedding} title="Cài đặt thiệp" />
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm mt-4 space-y-4">
        <Field label="Slug URL thiệp" value={wedding.slug} onChange={(slug) => storeApi.saveWedding({ ...wedding, slug: slugifyVi(slug) })} />
        <Field label="Lời xưng hô / Tiêu đề kính mời (VD: Kính mời, Trân trọng kính mời)" value={settings.invitationPrefix || ''} onChange={(invitationPrefix) => saveS({ ...settings, invitationPrefix })} />
        <Field label="Tên khách mời mặc định (khi chưa chọn cá nhân hóa)" value={settings.defaultGuestLabel || ''} onChange={(defaultGuestLabel) => saveS({ ...settings, defaultGuestLabel })} />
        <Field label="Tiêu đề cover" value={settings.coverTitle} onChange={(coverTitle) => saveS({ ...settings, coverTitle })} />
        <div>
          <Field label="Nhạc nền URL (Link file MP3 trực tiếp)" value={wedding.musicUrl || ''} onChange={(musicUrl) => storeApi.saveWedding({ ...wedding, musicUrl, musicEnabled: true })} />
          <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
            💡 <strong>Lưu ý:</strong> Cần dán link đường dẫn trực tiếp tới file đuôi <code>.mp3</code> (VD: <code>https://domain.com/song.mp3</code>). Link trang web HTML của ZingMP3 (như <code>zingmp3.vn/bai-hat/...html</code>) trình duyệt không thể đọc được MP3, khi đó hệ thống sẽ tự động phát bài MP3 mặc định (Váy Cưới) để đảm bảo thiệp luôn có nhạc.
          </p>
        </div>
        <label className="flex gap-2 text-sm font-medium">
          <input type="checkbox" checked={wedding.musicEnabled ?? true} onChange={(e) => storeApi.saveWedding({ ...wedding, musicEnabled: e.target.checked })} /> Bật nhạc nền
        </label>
        <label className="flex gap-2 text-sm font-medium">
          <input type="checkbox" checked={wedding.musicAutoplay ?? true} onChange={(e) => storeApi.saveWedding({ ...wedding, musicAutoplay: e.target.checked })} /> Tự động phát nhạc khi mở thiệp
        </label>
        <div className="pt-4 border-t">
          <button className="text-xs text-red-700 font-bold underline" onClick={() => storeApi.reset()}>
            Reset dữ liệu về mặc định demo
          </button>
        </div>
      </div>
    </div>
  )
}

function Header({ wedding, title }: { wedding: Wedding; title?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--muted)]">{title || 'Tổng quan'}</p>
        <h1 className="serif text-3xl text-[#450b14] font-medium">
          {wedding.groom.shortName} & {wedding.bride.shortName}
        </h1>
      </div>
      <div className="flex gap-2 text-xs uppercase tracking-widest font-semibold">
        <Link className="border border-stone-300 bg-white px-3.5 py-2 rounded-lg hover:bg-stone-50" to={`/preview/${wedding.id}`} target="_blank">
          👁️ Xem trước
        </Link>
        <Link className="border border-stone-300 bg-white px-3.5 py-2 rounded-lg hover:bg-stone-50" to={`/w/${wedding.slug}`} target="_blank">
          🔗 Public link
        </Link>
        <button
          className="bg-[#450b14] text-amber-100 px-4 py-2 rounded-lg hover:bg-[#5c101d]"
          onClick={() => storeApi.saveWedding({ ...wedding, status: wedding.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })}
        >
          {wedding.status === 'PUBLISHED' ? 'Đã Xuất Bản (Published)' : 'Đang Bản Nháp (Draft)'}
        </button>
      </div>
    </div>
  )
}

function EditorForm({
  wedding,
  children,
}: {
  wedding: Wedding
  children: (draft: Wedding, set: (w: Wedding) => void) => ReactNode
}) {
  const [draft, setDraft] = useState(wedding)
  const [saved, setSaved] = useState(false)
  return (
    <div>
      <Header wedding={wedding} title="Thông tin Cô dâu & Chú rể" />
      <div className="bg-white p-6 mt-4 rounded-xl border border-stone-200 shadow-sm">{children(draft, setDraft)}</div>
      <div className="flex items-center gap-3 mt-6">
        <button
          className="bg-[#450b14] hover:bg-[#5c101d] text-amber-100 px-6 py-3 rounded-xl text-xs font-sans tracking-widest uppercase font-semibold shadow-md transition-all"
          onClick={() => {
            storeApi.saveWedding(draft)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
          }}
        >
          💾 Lưu thay đổi
        </button>
        {saved && <span className="text-xs text-green-700 font-bold">✓ Đã lưu thành công!</span>}
        <Link className="border border-stone-300 bg-white px-5 py-3 rounded-xl text-xs uppercase font-semibold text-stone-700 hover:bg-stone-50" to={`/w/${wedding.slug}`} target="_blank">
          Xem kết quả công khai
        </Link>
      </div>
    </div>
  )
}

function PersonFields({
  title,
  person,
  onChange,
}: {
  title: string
  person: Wedding['groom']
  onChange: (p: Wedding['groom']) => void
}) {
  return (
    <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
      <h3 className="serif text-xl text-[#450b14] font-medium border-b pb-1.5">{title}</h3>
      <Field label="Họ tên đầy đủ" value={person.name} onChange={(name) => onChange({ ...person, name })} />
      <Field label="Tên gọi ngắn" value={person.shortName} onChange={(shortName) => onChange({ ...person, shortName })} />
      <Field label="Tên Bố" value={person.father || ''} onChange={(father) => onChange({ ...person, father })} />
      <Field label="Tên Mẹ" value={person.mother || ''} onChange={(mother) => onChange({ ...person, mother })} />
      <Field label="Tên gia đình" value={person.family || ''} onChange={(family) => onChange({ ...person, family })} />
      <ImageField label="Ảnh đại diện Avatar" value={person.avatar || ''} onChange={(avatar) => onChange({ ...person, avatar })} />
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1 block">{label}</span>
      <input
        className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#450b14] focus:ring-1 focus:ring-[#450b14]"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5 border border-stone-200 p-3.5 rounded-xl bg-stone-50/50">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#450b14] block">{label}</span>
      {value && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-stone-300 shadow-sm my-2 bg-stone-200">
          <img src={value} alt={label} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <label className="cursor-pointer bg-[#450b14] hover:bg-[#5c101d] text-amber-100 text-xs py-2.5 px-4 rounded-lg font-semibold tracking-wider uppercase inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors">
          📷 Upload từ máy tính
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              void compressImage(file).then((r) => onChange(r.dataUrl))
            }}
          />
        </label>
        <input
          className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#450b14]"
          placeholder="Hoặc dán link ảnh URL..."
          value={value.startsWith('data:') ? '[Đã nén & lưu ảnh upload trực tiếp]' : value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}
