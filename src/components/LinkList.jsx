import { useMemo, useState } from 'react'
import { useI18n } from '../i18n/context.js'

export default function LinkList({ links, onCopy, onDelete }) {
  const { t, tn, locale } = useI18n()
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('new')

  const shown = useMemo(() => {
    const s = query.trim().toLowerCase()
    const list = links.filter((l) => !s || `${l.title}${l.slug}${l.url}${l.campaign}`.toLowerCase().includes(s))
    return mode === 'top' ? [...list].sort((a, b) => b.clicks - a.clicks) : list
  }, [links, query, mode])

  return (
    <div className="card links">
      <div className="head">
        <h3>{t('list.title')}</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input className="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('list.search')} aria-label={t('list.search')} />
          <div className="tabs">
            <button className={mode === 'new' ? 'on' : ''} onClick={() => setMode('new')}>{t('list.new')}</button>
            <button className={mode === 'top' ? 'on' : ''} onClick={() => setMode('top')}>{t('list.top')}</button>
          </div>
        </div>
      </div>
      {shown.length === 0 && <div className="empty">{t('list.empty')}</div>}
      {shown.map((l) => (
        <div className="item" key={l.id}>
          <div style={{ minWidth: 0 }}>
            <div className="t">{l.title}</div>
            <a className="s" href={l.shortUrl} target="_blank" rel="noreferrer">{l.shortUrl.replace(/^https?:\/\//, '')}</a>
            <div className="d">{l.url}</div>
            <div className="meta">
              {l.campaign && <span className="tag">{l.campaign}</span>}
              <span>{tn('click', l.clicks)}</span>
              <span>{tn('unique', l.unique)}</span>
              <span>{new Date(l.createdAt).toLocaleDateString(locale)}</span>
            </div>
          </div>
          <div className="acts">
            <button onClick={() => onCopy(l)}>{t('list.copy')}</button>
            <button className="del" onClick={() => onDelete(l)}>{t('list.delete')}</button>
          </div>
        </div>
      ))}
    </div>
  )
}
