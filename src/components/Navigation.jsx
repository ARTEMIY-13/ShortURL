import NavItem from './NavItem.jsx'
import { useI18n } from '../i18n/context.js'
import { ROUTES } from '../routes.js'

export default function Navigation() {
  const { t } = useI18n()
  return (
    <aside>
      <div className="logo">
        <i>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round">
            <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
            <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
          </svg>
        </i>
        ShortURL
      </div>
      <nav>{ROUTES.filter((r) => !r.bottom).map((r) => <NavItem key={r.path} route={r} />)}</nav>
      <div className="spacer" />
      <nav>{ROUTES.filter((r) => r.bottom).map((r) => <NavItem key={r.path} route={r} />)}</nav>
      <div className="plan"><b>{t('plan.title')}</b></div>
    </aside>
  )
}
