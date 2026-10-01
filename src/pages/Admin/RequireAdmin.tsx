import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { authService } from '../../services/auth/authService'

export function RequireAdmin() {
  const session = authService.getSession()
  const location = useLocation()
  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
