export type WeddingStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type GuestInviteStatus = 'pending' | 'sent' | 'opened'
export type RsvpAttendance = 'yes' | 'no'
export type WishVisibility = 'visible' | 'hidden'
export type AlbumLayout = 'editorial' | 'masonry' | 'grid' | 'polaroid' | 'fullwidth'
export type TemplateId =
  | 'template-01'
  | 'template-02'
  | 'template-03'
  | 'template-04'
  | 'template-05'
export type ThemeId = 'burgundy' | 'red' | 'green' | 'gold' | 'pink' | 'beige'
export type FontPreset = 'serif' | 'sans' | 'script'
export type LayoutPreset = 'modern' | 'traditional' | 'editorial'

export interface ThemeTokens {
  id: ThemeId
  name: string
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  muted: string
  accent: string
  gold: string
}

export interface CouplePerson {
  name: string
  shortName: string
  birthDate?: string
  family?: string
  father?: string
  mother?: string
  avatar?: string
  showBirthDate: boolean
  showFamily: boolean
}

export interface Wedding {
  id: string
  ownerId: string
  slug: string
  groom: CouplePerson
  bride: CouplePerson
  weddingDate: string
  weddingTime: string
  lunarDate?: string
  heroImage: string
  coverImage: string
  description: string
  venueName: string
  venueAddress: string
  googleMapsUrl: string
  facebook?: string
  instagram?: string
  templateId: TemplateId
  themeId: ThemeId
  fontPreset: FontPreset
  layoutPreset: LayoutPreset
  albumLayout: AlbumLayout
  status: WeddingStatus
  showOrnaments: boolean
  musicUrl?: string
  musicEnabled: boolean
  musicAutoplay: boolean
  musicVolume: number
  createdAt: string
  updatedAt: string
}

export interface WeddingEvent {
  id: string
  weddingId: string
  title: string
  date: string
  time: string
  address: string
  description: string
  image?: string
  googleMapsUrl?: string
  icon: string
  order: number
}

export interface Photo {
  id: string
  weddingId: string
  url: string
  alt: string
  width: number
  height: number
  sizeLabel: string
  bytes: number
  order: number
  isCover: boolean
  category: 'hero' | 'album' | 'bride' | 'groom' | 'story' | 'event'
}

export interface LoveStoryItem {
  id: string
  weddingId: string
  year: string
  title: string
  content: string
  image?: string
  order: number
}

export interface Guest {
  id: string
  weddingId: string
  name: string
  displayName: string
  slug: string
  numberOfGuests: number
  relationship: string
  guestGroup?: string
  status: GuestInviteStatus
  createdAt: string
}

export interface Rsvp {
  id: string
  weddingId: string
  guestId?: string
  name: string
  numberOfGuests: number
  attendance: RsvpAttendance
  message?: string
  createdAt: string
}

export interface Wish {
  id: string
  weddingId: string
  name: string
  message: string
  visibility: WishVisibility
  createdAt: string
}

export interface BankAccount {
  id: string
  weddingId: string
  bankName: string
  accountName: string
  accountNumber: string
  qrImage?: string
  forPerson: 'groom' | 'bride' | 'both'
}

export interface WeddingSettings {
  weddingId: string
  coverTitle: string
  invitationPrefix: string
  defaultGuestLabel: string
  shareMessageTemplate: string
  seoTitle?: string
  seoDescription?: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  password: string
}

export interface AppDatabase {
  users: AdminUser[]
  weddings: Wedding[]
  events: WeddingEvent[]
  photos: Photo[]
  loveStories: LoveStoryItem[]
  guests: Guest[]
  rsvps: Rsvp[]
  wishes: Wish[]
  bankAccounts: BankAccount[]
  settings: WeddingSettings[]
}

export interface WeddingTemplateProps {
  wedding: Wedding
  guest?: Guest | null
  events: WeddingEvent[]
  photos: Photo[]
  loveStory: LoveStoryItem[]
  theme: ThemeTokens
  settings: WeddingSettings
  wishes: Wish[]
  bankAccounts: BankAccount[]
  preview?: boolean
}
