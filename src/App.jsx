import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { getLinks, createLink, deleteLink } from './api.js'
import { useI18n } from './i18n/context.js'
import { LANGS } from './i18n/translations.js'

const NAV = [
  ['nav.home', 'M3 11l9-8 9 8v10H3z'],
  ['nav.links', 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'],
  ['nav.qr', 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM20 14v7h-3'],
  ['nav.campaigns', 'M3 7h6l2 2h10v10H3z'],
  ['nav.domains', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18'],
]

function Icon({ d }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={d} />
    </svg>
  )
}

function LanguageSwitch() {
  const { lang, setLang, t } = useI18n()
  return (
    <div className="lang" role="group" aria-label={t('lang.label')}>
      {LANGS.map((code) => (
        <button key={code} aria-pressed={lang === code} onClick={() => setLang(code)}>
          {code === 'uk' ? 'UA' : 'EN'}
        </button>
      ))}
    </div>
  )
}

function Sidebar({ used }) {
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
      <nav>
        {NAV.map(([key, d], i) => (
          <a key={key} href="#" className={i === 1 ? 'on' : ''} onClick={(e) => e.preventDefault()}>
            <Icon d={d} />
            {t(key)}
          </a>
        ))}
      </nav>
      <div className="spacer" />
      <div className="plan">
        <b>{t('plan.title')}</b>
        <br />
        {t('plan.used', { n: used })}
        <div className="bar"><span /></div>
      </div>
    </aside>
  )
}

function CreateForm({ onCreate }) {
  const { t } = useI18n()
  const [form, setForm] = useState({ url: '', slug: '', campaign: '' })
  const [errorCode, setErrorCode] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setErrorCode('')
    setBusy(true)
    try {
      await onCreate({ url: form.url.trim(), slug: form.slug.trim(), campaign: form.campaign.trim() })
      setForm({ url: '', slug: '', campaign: '' })
    } catch (err) {
      setErrorCode(err.message)
    } finally {
      setBusy(false)
    }
  }

  // Помилку зберігаємо як код, тому вона одразу перекладається при зміні мови
  const errorText = errorCode ? t(`err.${errorCode}`) : ''

  return (
    <form className="hero" onSubmit={submit}>
      <h2>{t('hero.title')}</h2>
      <p>{t('hero.text')}</p>
      <div className="field">
        <input value={form.url} onChange={set('url')} placeholder={t('hero.urlPlaceholder')} aria-label={t('hero.urlLabel')} />
        <button className="btn" disabled={busy}>{busy ? t('hero.busy') : t('hero.submit')}</button>
      </div>
      <div className="opts">
        <label>{t('hero.slug')} <input value={form.slug} onChange={set('slug')} placeholder="my-link" maxLength={24} /></label>
        <label>{t('hero.campaign')} <input value={form.campaign} onChange={set('campaign')} placeholder={t('hero.campaignPlaceholder')} /></label>
      </div>
      <div className="err" role="alert">{errorText}</div>
    </form>
  )
}

function Stats({ links }) {
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
function Chart() {
  const { t, tn } = useI18n()
  const [days, setDays] = useState(14)
  const data = useMemo(
    () => Array.from({ length: days }, (_, i) => Math.round(120 + Math.abs(Math.sin(i * 1.7 + days)) * 260 + (i % 3) * 20)),
    [days],
  )
  const W = 700, H = 190, pb = 22
  const max = Math.max(...data)
  const bw = W / days
  return (
    <div className="card">
      <div className="head">
        <h3>{t('chart.title')}</h3>
        <select value={days} onChange={(e) => setDays(+e.target.value)} aria-label={t('chart.period')}>
          {[7, 14, 30].map((n) => <option key={n} value={n}>{tn('day', n)}</option>)}
        </select>
      </div>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={t('chart.label')}>
        {data.map((v, i) => {
          const h = ((H - pb - 8) * v) / max
          return (
            <g key={i}>
              <rect x={i * bw + bw * 0.18} y={H - pb - h} width={bw * 0.64} height={h} rx="3"><title>{tn('click', v)}</title></rect>
              {(days <= 14 || i % 3 === 0) && <text x={i * bw + bw / 2} y={H - 6} textAnchor="middle">{i + 1}</text>}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function Traffic() {
  const { t } = useI18n()
  const rows = [
    ['var(--acc)', 'traffic.social', '46%'],
    ['#7a8cff', 'traffic.search', '25%'],
    ['#b9c2ff', 'traffic.direct', '18%'],
    ['var(--line)', 'traffic.other', '11%'],
  ]
  return (
    <div className="card">
      <h3 style={{ marginBottom: 8 }}>{t('traffic.title')}</h3>
      <div className="donut"><span>93%</span></div>
      <ul className="leg">
        {rows.map(([color, key, pct]) => (
          <li key={key}><span><i style={{ background: color }} />{t(key)}</span><b>{pct}</b></li>
        ))}
      </ul>
    </div>
  )
}

function LinkList({ links, onCopy, onDelete }) {
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

export default function App() {
  const { t } = useI18n()
  const [links, setLinks] = useState([])
  const [toast, setToast] = useState('')
  const timer = useRef()

  // Зберігаємо ключ повідомлення, а не готовий текст — так воно коректно перекладається
  const notify = (key) => {
    setToast(key)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 1800)
  }

  useEffect(() => {
    getLinks()
      .then(setLinks)
      .catch(() => {
        setToast('toast.loadFailed')
        timer.current = setTimeout(() => setToast(''), 3500)
      })
  }, [])

  async function handleCreate(body) {
    const link = await createLink(body)
    setLinks((prev) => [link, ...prev])
    notify('toast.created')
  }

  async function handleDelete(link) {
    await deleteLink(link.id)
    setLinks((prev) => prev.filter((x) => x.id !== link.id))
    notify('toast.deleted')
  }

  async function handleCopy(link) {
    try {
      await navigator.clipboard.writeText(link.shortUrl)
      notify('toast.copied')
    } catch {
      window.prompt('', link.shortUrl)
    }
  }

  return (
    <div className="app">
      <Sidebar used={links.length} />
      <main>
        <div className="top">
          <h1>{t('page.title')}</h1>
          <div className="who"><LanguageSwitch /><div className="av">M</div></div>
        </div>
        <CreateForm onCreate={handleCreate} />
        <Stats links={links} />
        <div className="row"><Chart /><Traffic /></div>
        <LinkList links={links} onCopy={handleCopy} onDelete={handleDelete} />
      </main>
      <div className={`toast ${toast ? 'show' : ''}`}>{toast && t(toast)}</div>
    </div>
  )
}
