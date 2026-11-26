import { useI18n } from '../i18n/context.js'

export default function Stats({ links }) {
  const { t } = useI18n()
  const clicks = links.reduce((sum, l) => sum + l.clicks, 0)
  const unique = links.reduce((sum, l) => sum + l.unique, 0)
  const campaigns = new Set(links.map((l) => l.campaign).filter(Boolean)).size
  const items = [
    ['stats.links', links.length],
    ['stats.clicks', clicks],
    ['stats.unique', unique],
    ['stats.campaigns', campaigns],
  ]
  return (
    <div className="stats">
      {items.map(([key, value]) => (
        <div className="stat" key={key}><small>{t(key)}</small><div>{value}</div></div>
      ))}
    </div>
  )
}

// Поки графік показує демо-дані: історію кліків по днях ще потрібно зберігати на сервері
