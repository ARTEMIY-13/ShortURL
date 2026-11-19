import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Navigation from './Navigation.jsx'
import { useI18n } from '../i18n/context.js'
import { useSettings } from '../settings/context.js'
import { ROUTES } from '../routes.js'

export default function Layout() {
  const { t } = useI18n()
  const { user } = useSettings()
  const { pathname } = useLocation()
  const current = ROUTES.find((r) => pathname.toLowerCase().startsWith(r.path.toLowerCase()))
  const initial = (user.name || user.username || 'U').trim().charAt(0).toUpperCase()

  return (
    <div className="app">
      <Navigation />
      <main>
        <header className="top">
          <h1>{current ? t(current.key) : ''}</h1>
          <NavLink to="/Settings" className="av" aria-label={t('nav.profile')}>{initial}</NavLink>
        </header>
        <Outlet />
      </main>
    </div>
  )
}
