import { NavLink } from 'react-router-dom'
import { useI18n } from '../i18n/context.js'

export default function NavItem({ route }) {
  const { t } = useI18n()
  return (
    <NavLink to={route.path}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d={route.icon} />
      </svg>
      {t(route.key)}
    </NavLink>
  )
}
