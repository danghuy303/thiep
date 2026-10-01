import type { AppDatabase } from '../types'

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const DEMO_OWNER_ID = 'user-demo'
export const DEMO_WEDDING_ID = 'wedding-minhan-ngocha'
export const DEMO_EMAIL = 'admin@demo.com'
export const DEMO_PASSWORD = 'demo1234'

const now = '2026-03-20T09:00:00.000Z'

export const seedDatabase = (): AppDatabase => ({
  users: [
    {
      id: DEMO_OWNER_ID,
      email: DEMO_EMAIL,
      name: 'Admin Demo',
      password: DEMO_PASSWORD,
    },
  ],
  weddings: [
    {
      id: DEMO_WEDDING_ID,
      ownerId: DEMO_OWNER_ID,
      slug: 'minhan-ngocha',
      groom: {
        name: 'Đặng Hoàng Long',
        shortName: 'Hoàng Long',
        birthDate: '12/08/1996',
        father: 'Đặng Văn Thắng',
        mother: 'Bùi Thị Mai',
        family: 'Đặng Văn Thắng & Bùi Thị Mai',
        avatar: img('photo-1500648767791-00dcc994a43e', 800),
        showBirthDate: true,
        showFamily: true,
      },
      bride: {
        name: 'Vũ Bảo Ngọc',
        shortName: 'Bảo Ngọc',
        birthDate: '21/03/1998',
        father: 'Vũ Đức Trung',
        mother: 'Ngô Thị Hạnh',
        family: 'Vũ Đức Trung & Ngô Thị Hạnh',
        avatar: img('photo-1544005313-94ddf0286df2', 800),
        showBirthDate: true,
        showFamily: true,
      },
      weddingDate: '2026-01-03',
      weddingTime: '18:00',
      lunarDate: 'Tức ngày 15 tháng 11 năm Ất Tỵ',
      heroImage: '/hero-wedding.jpg',
      coverImage: '/hero-wedding.jpg',
      description:
        'Trân trọng kính mời bạn đến chung vui cùng Hoàng Long & Bảo Ngọc trong ngày trọng đại.',
      venueName: 'Trung Tâm Hội Nghị - Tiệc Cưới Riverside Palace',
      venueAddress: '360D Bến Vân Đồn, Phường 1, Quận 4, TP. Hồ Chí Minh',
      googleMapsUrl: 'https://maps.google.com/?q=360D+Ben+Van+Don+Phuong+1+Quan+4+Ho+Chi+Minh',
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      templateId: 'template-01',
      themeId: 'burgundy',
      fontPreset: 'serif',
      layoutPreset: 'editorial',
      albumLayout: 'editorial',
      status: 'PUBLISHED',
      showOrnaments: true,
      musicEnabled: true,
      musicAutoplay: true,
      musicVolume: 0.35,
      musicUrl: '/music/vay-cuoi.mp3',
      createdAt: now,
      updatedAt: now,
    },
  ],
  events: [
    {
      id: 'ev-1',
      weddingId: DEMO_WEDDING_ID,
      title: 'Lễ thành hôn',
      date: '2026-01-03',
      time: '09:00',
      address: 'Tư gia nhà trai',
      description: 'Lễ thành hôn được cử hành tại tư gia.',
      icon: 'home',
      order: 1,
      googleMapsUrl: 'https://maps.google.com/?q=Ho+Chi+Minh',
    },
    {
      id: 'ev-2',
      weddingId: DEMO_WEDDING_ID,
      title: 'Tiệc cưới',
      date: '2026-01-03',
      time: '18:00',
      address: 'Trung Tâm Hội Nghị White Palace, 194 Hoàng Văn Thụ, Phú Nhuận',
      description: 'Đón khách 17:30 · Khai tiệc 18:00',
      icon: 'cheers',
      order: 2,
      googleMapsUrl: 'https://maps.google.com/?q=White+Palace+Hoang+Van+Thu',
    },
  ],
  photos: [
    unsplash('p1', 'photo-1519741497674-611481863552', true),
    unsplash('p2', 'photo-1522673607200-164a1a0acde7'),
    unsplash('p3', 'photo-1583939003579-730e3918a45a'),
    unsplash('p4', 'photo-1511285560929-80b456fea0bc'),
    unsplash('p5', 'photo-1465495976277-4387d4b0b4c6'),
    unsplash('p6', 'photo-1520854221256-17451cc331bf'),
    unsplash('p7', 'photo-1529636798458-92182e662485'),
    unsplash('p8', 'photo-1591604466107-ec97de577aff'),
    unsplash('p9', 'photo-1606800052052-a08af7148866'),
    unsplash('p10', 'photo-1460978812857-470ed1c77af0'),
    unsplash('p11', 'photo-1515934751635-c81c6bc9a2d8'),
    unsplash('p12', 'photo-1529634597499-5c54d210b3ea'),
    unsplash('p13', 'photo-1529634169505-5298a4b0f6d2'),
    unsplash('p14', 'photo-1519225421980-715cb0215aed'),
    unsplash('p15', 'photo-1460364156987-41c2b8f0b1c1'),
    unsplash('p16', 'photo-1519225421980-715cb0215aed'),
  ],
  loveStories: [
    {
      id: 'st-1',
      weddingId: DEMO_WEDDING_ID,
      year: '2019',
      title: 'Lần đầu gặp nhau',
      content: 'Một buổi chiều Sài Gòn, hai người lạ tình cờ trở thành hai người quen.',
      image: img('photo-1522673607200-164a1a0acde7', 900),
      order: 1,
    },
    {
      id: 'st-2',
      weddingId: DEMO_WEDDING_ID,
      year: '2021',
      title: 'Chính thức bên nhau',
      content: 'Những hành trình nhỏ bắt đầu được viết chung, từ cà phê đến những chuyến đi.',
      image: img('photo-1511285560929-80b456fea0bc', 900),
      order: 2,
    },
    {
      id: 'st-3',
      weddingId: DEMO_WEDDING_ID,
      year: '2024',
      title: 'Cùng nhau đi qua nhiều hành trình',
      content: 'Dù vui hay khó, chúng mình luôn chọn đứng cạnh nhau.',
      image: img('photo-1465495976277-4387d4b0b4c6', 900),
      order: 3,
    },
    {
      id: 'st-4',
      weddingId: DEMO_WEDDING_ID,
      year: '2026',
      title: 'Về chung một nhà',
      content: 'Ngày chúng mình chính thức viết chương mới — gia đình của hai đứa.',
      image: img('photo-1519741497674-611481863552', 900),
      order: 4,
    },
  ],
  guests: [
    guest('g1', 'Nguyễn Văn An', 'Gia đình anh Nguyễn Văn An', 4, 'Bạn chú rể', 'sent'),
    guest('g2', 'Trần Thị Bình', 'Chị Trần Thị Bình', 1, 'Bạn cô dâu', 'sent'),
    guest('g3', 'Minh', 'Bạn Minh', 1, 'Bạn học', 'pending'),
    guest('g4', 'Nguyễn Văn C', 'Gia đình anh Nguyễn Văn C', 3, 'Họ nội', 'pending'),
    guest('g5', 'Nguyễn Văn D', 'Gia đình ông bà Nguyễn Văn D', 5, 'Họ ngoại', 'sent'),
  ],
  rsvps: [
    {
      id: 'r1',
      weddingId: DEMO_WEDDING_ID,
      guestId: 'g1',
      name: 'Gia đình anh Nguyễn Văn An',
      numberOfGuests: 4,
      attendance: 'yes',
      message: 'Chúc hai con trăm năm hạnh phúc!',
      createdAt: now,
    },
  ],
  wishes: [
    {
      id: 'w1',
      weddingId: DEMO_WEDDING_ID,
      name: 'Gia đình anh Nguyễn Văn An',
      message: 'Chúc hai bạn trăm năm hạnh phúc ❤️',
      visibility: 'visible',
      createdAt: now,
    },
    {
      id: 'w2',
      weddingId: DEMO_WEDDING_ID,
      name: 'Chị Trần Thị Bình',
      message: 'Hạnh phúc viên mãn, sớm sum vầy.',
      visibility: 'visible',
      createdAt: now,
    },
    {
      id: 'w3',
      weddingId: DEMO_WEDDING_ID,
      name: 'Bạn Minh',
      message: 'Chúc cặp đôi luôn thương nhau như ngày đầu.',
      visibility: 'visible',
      createdAt: now,
    },
  ],
  bankAccounts: [
    {
      id: 'b1',
      weddingId: DEMO_WEDDING_ID,
      bankName: 'Vietcombank',
      accountName: 'TRAN MINH AN',
      accountNumber: '0123456789',
      forPerson: 'groom',
    },
    {
      id: 'b2',
      weddingId: DEMO_WEDDING_ID,
      bankName: 'Techcombank',
      accountName: 'LE NGOC HA',
      accountNumber: '9876543210',
      forPerson: 'bride',
    },
  ],
  settings: [
    {
      weddingId: DEMO_WEDDING_ID,
      coverTitle: 'Trân trọng kính mời',
      invitationPrefix: 'Kính mời',
      defaultGuestLabel: 'Quý khách',
      shareMessageTemplate:
        '💌 {groom} & {bride} trân trọng kính mời {guest} đến chung vui trong ngày trọng đại {date}. Thiệp mời: {url}',
      seoTitle: 'Minh An & Ngọc Hà – Wedding Invitation',
      seoDescription:
        'Trân trọng kính mời bạn đến chung vui cùng Minh An & Ngọc Hà.',
    },
  ],
})

function unsplash(id: string, photo: string, isCover = false): AppDatabase['photos'][number] {
  return {
    id,
    weddingId: DEMO_WEDDING_ID,
    url: img(photo, 1400),
    alt: 'Ảnh cưới Minh An & Ngọc Hà',
    width: 1400,
    height: 1800,
    sizeLabel: '1400×1800',
    bytes: 420_000,
    order: Number(id.replace('p', '')),
    isCover,
    category: 'album',
  }
}

function guest(
  id: string,
  name: string,
  displayName: string,
  numberOfGuests: number,
  relationship: string,
  status: 'pending' | 'sent',
): AppDatabase['guests'][number] {
  const slug = displayName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return {
    id,
    weddingId: DEMO_WEDDING_ID,
    name,
    displayName,
    slug,
    numberOfGuests,
    relationship,
    status,
    createdAt: now,
  }
}
