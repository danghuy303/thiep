import { createContext, createElement, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import type {
  AppDatabase,
  BankAccount,
  Guest,
  LoveStoryItem,
  Photo,
  Rsvp,
  Wedding,
  WeddingEvent,
  WeddingSettings,
  Wish,
} from '../../types'
import { seedDatabase } from '../../data/seed'
import { slugifyVi, uid } from '../../utils'
import { authService, type Session } from '../auth/authService'

const DB_KEY = 'wi_db_v1'

function loadDb(): AppDatabase {
  const raw = localStorage.getItem(DB_KEY)
  if (!raw) {
    const seed = seedDatabase()
    localStorage.setItem(DB_KEY, JSON.stringify(seed))
    return seed
  }
  try {
    const data = JSON.parse(raw) as AppDatabase
    if (data.weddings && data.weddings[0]) {
      data.weddings[0].musicUrl = '/music/vay-cuoi.mp3'
      localStorage.setItem(DB_KEY, JSON.stringify(data))
    }
    return data
  } catch {
    const seed = seedDatabase()
    localStorage.setItem(DB_KEY, JSON.stringify(seed))
    return seed
  }
}

let db = loadDb()
const listeners = new Set<() => void>()

function emit() {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function snapshot() {
  return db
}

function mutate(recipe: (current: AppDatabase) => AppDatabase) {
  db = recipe(db)
  emit()
}

export const storeApi = {
  reset() {
    db = seedDatabase()
    emit()
  },
  login(email: string, password: string): Session {
    const user = db.users.find((u) => u.email === email && u.password === password)
    if (!user) throw new Error('Email hoặc mật khẩu không đúng')
    const session = { userId: user.id, email: user.email, name: user.name }
    authService.setSession(session)
    return session
  },
  weddingsOf(userId: string) {
    return db.weddings.filter((w) => w.ownerId === userId)
  },
  weddingById(id: string) {
    return db.weddings.find((w) => w.id === id)
  },
  weddingBySlug(slug: string) {
    return db.weddings.find((w) => w.slug === slug)
  },
  pack(weddingId: string) {
    const wedding = db.weddings.find((w) => w.id === weddingId)
    if (!wedding) return null
    return {
      wedding,
      events: db.events.filter((e) => e.weddingId === weddingId).sort((a, b) => a.order - b.order),
      photos: db.photos.filter((p) => p.weddingId === weddingId).sort((a, b) => a.order - b.order),
      loveStory: db.loveStories.filter((s) => s.weddingId === weddingId).sort((a, b) => a.order - b.order),
      guests: db.guests.filter((g) => g.weddingId === weddingId),
      rsvps: db.rsvps.filter((r) => r.weddingId === weddingId),
      wishes: db.wishes.filter((w) => w.weddingId === weddingId),
      bankAccounts: db.bankAccounts.filter((b) => b.weddingId === weddingId),
      settings: db.settings.find((s) => s.weddingId === weddingId)!,
    }
  },
  saveWedding(wedding: Wedding) {
    mutate((d) => ({
      ...d,
      weddings: d.weddings.map((w) => (w.id === wedding.id ? { ...wedding, updatedAt: new Date().toISOString() } : w)),
    }))
  },
  createWedding(ownerId: string, payload: Partial<Wedding>) {
    const id = uid('wedding')
    const groomName = payload.groom?.shortName || 'Chú rể'
    const brideName = payload.bride?.shortName || 'Cô dâu'
    const slug = slugifyVi(`${groomName}-${brideName}`) || id
    const wedding: Wedding = {
      id,
      ownerId,
      slug,
      groom: {
        name: 'Chú rể',
        shortName: 'Chú rể',
        showBirthDate: false,
        showFamily: true,
        ...payload.groom,
      },
      bride: {
        name: 'Cô dâu',
        shortName: 'Cô dâu',
        showBirthDate: false,
        showFamily: true,
        ...payload.bride,
      },
      weddingDate: payload.weddingDate || new Date().toISOString().slice(0, 10),
      weddingTime: payload.weddingTime || '18:00',
      heroImage: payload.heroImage || '',
      coverImage: payload.coverImage || '',
      description: payload.description || '',
      venueName: payload.venueName || '',
      venueAddress: payload.venueAddress || '',
      googleMapsUrl: payload.googleMapsUrl || '',
      templateId: payload.templateId || 'template-01',
      themeId: payload.themeId || 'burgundy',
      fontPreset: payload.fontPreset || 'serif',
      layoutPreset: payload.layoutPreset || 'editorial',
      albumLayout: payload.albumLayout || 'editorial',
      status: 'DRAFT',
      showOrnaments: true,
      musicEnabled: true,
      musicAutoplay: true,
      musicVolume: 0.35,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const settings: WeddingSettings = {
      weddingId: id,
      coverTitle: 'Trân trọng kính mời',
      invitationPrefix: 'Kính mời',
      defaultGuestLabel: 'Quý khách',
      shareMessageTemplate:
        '💌 {groom} & {bride} trân trọng kính mời {guest} đến chung vui trong ngày trọng đại {date}. Thiệp mời: {url}',
    }
    mutate((d) => ({
      ...d,
      weddings: [...d.weddings, wedding],
      settings: [...d.settings, settings],
    }))
    return wedding
  },
  saveSettings(settings: WeddingSettings) {
    mutate((d) => ({
      ...d,
      settings: d.settings.map((s) => (s.weddingId === settings.weddingId ? settings : s)),
    }))
  },
  saveEvents(weddingId: string, events: WeddingEvent[]) {
    mutate((d) => ({
      ...d,
      events: [...d.events.filter((e) => e.weddingId !== weddingId), ...events],
    }))
  },
  saveStories(weddingId: string, stories: LoveStoryItem[]) {
    mutate((d) => ({
      ...d,
      loveStories: [...d.loveStories.filter((s) => s.weddingId !== weddingId), ...stories],
    }))
  },
  savePhotos(weddingId: string, photos: Photo[]) {
    mutate((d) => ({
      ...d,
      photos: [...d.photos.filter((p) => p.weddingId !== weddingId), ...photos],
    }))
  },
  saveBanks(weddingId: string, banks: BankAccount[]) {
    mutate((d) => ({
      ...d,
      bankAccounts: [...d.bankAccounts.filter((b) => b.weddingId !== weddingId), ...banks],
    }))
  },
  upsertGuest(guest: Guest) {
    mutate((d) => {
      const exists = d.guests.some((g) => g.id === guest.id)
      return {
        ...d,
        guests: exists ? d.guests.map((g) => (g.id === guest.id ? guest : g)) : [...d.guests, guest],
      }
    })
  },
  deleteGuest(id: string) {
    mutate((d) => ({ ...d, guests: d.guests.filter((g) => g.id !== id) }))
  },
  importGuests(weddingId: string, rows: Array<{ name: string; numberOfGuests: number; relationship: string }>) {
    const existing = db.guests.filter((g) => g.weddingId === weddingId).map((g) => g.slug)
    const created: Guest[] = rows.map((row) => {
      const base = slugifyVi(row.name)
      const slug = uniqueSlug(existing, base)
      existing.push(slug)
      return {
        id: uid('guest'),
        weddingId,
        name: row.name,
        displayName: row.name,
        slug,
        numberOfGuests: row.numberOfGuests || 1,
        relationship: row.relationship || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    })
    mutate((d) => ({ ...d, guests: [...d.guests, ...created] }))
    return created
  },
  addRsvp(rsvp: Rsvp) {
    mutate((d) => ({ ...d, rsvps: [rsvp, ...d.rsvps] }))
  },
  addWish(wish: Wish) {
    mutate((d) => ({ ...d, wishes: [wish, ...d.wishes] }))
  },
  updateWish(wish: Wish) {
    mutate((d) => ({ ...d, wishes: d.wishes.map((w) => (w.id === wish.id ? wish : w)) }))
  },
  deleteWish(id: string) {
    mutate((d) => ({ ...d, wishes: d.wishes.filter((w) => w.id !== id) }))
  },
}

function uniqueSlug(existing: string[], base: string) {
  let slug = base || uid('khach')
  let i = 2
  while (existing.includes(slug)) {
    slug = `${base}-${i}`
    i += 1
  }
  return slug
}

const StoreContext = createContext({ db, api: storeApi })

export function StoreProvider({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(subscribe, snapshot, snapshot)
  const value = useMemo(() => ({ db: current, api: storeApi }), [current])
  return createElement(StoreContext.Provider, { value }, children)
}

export function useStore() {
  return useContext(StoreContext)
}
