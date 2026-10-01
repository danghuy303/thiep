import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './services/wedding/store'
import { HomePage, WeddingPage } from './pages/Wedding/WeddingPage'
import { AdminLogin } from './pages/Admin/AdminLogin'
import { AdminShell } from './pages/Admin/AdminShell'
import { AdminDashboard } from './pages/Admin/AdminDashboard'
import { RequireAdmin } from './pages/Admin/RequireAdmin'
import { PreviewPage } from './pages/Admin/PreviewPage'
import {
  AlbumEditor,
  CoupleEditor,
  EventsEditor,
  GiftAdmin,
  GuestsEditor,
  RsvpAdmin,
  SettingsAdmin,
  StoryEditor,
  TemplateAdmin,
  ThemeAdmin,
  WeddingHome,
  WishesAdmin,
} from './pages/Admin/editors'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/w/:slug" element={<WeddingPage />} />
          <Route path="/w/:slug/:guestSlug" element={<WeddingPage />} />
          <Route path="/wedding/:slug" element={<WeddingPage />} />
          <Route path="/wedding/:slug/:guestSlug" element={<WeddingPage />} />
          <Route path="/preview/:weddingId" element={<PreviewPage />} />
          <Route path="/preview/:weddingId/:guestSlug" element={<PreviewPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminShell />}>
              <Route index element={<AdminDashboard />} />
              <Route path="weddings/:weddingId" element={<WeddingHome />} />
              <Route path="weddings/:weddingId/couple" element={<CoupleEditor />} />
              <Route path="weddings/:weddingId/album" element={<AlbumEditor />} />
              <Route path="weddings/:weddingId/story" element={<StoryEditor />} />
              <Route path="weddings/:weddingId/events" element={<EventsEditor />} />
              <Route path="weddings/:weddingId/guests" element={<GuestsEditor />} />
              <Route path="weddings/:weddingId/rsvp" element={<RsvpAdmin />} />
              <Route path="weddings/:weddingId/wishes" element={<WishesAdmin />} />
              <Route path="weddings/:weddingId/gift" element={<GiftAdmin />} />
              <Route path="weddings/:weddingId/template" element={<TemplateAdmin />} />
              <Route path="weddings/:weddingId/theme" element={<ThemeAdmin />} />
              <Route path="weddings/:weddingId/settings" element={<SettingsAdmin />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
