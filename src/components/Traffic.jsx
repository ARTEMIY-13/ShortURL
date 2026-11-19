import { useI18n } from '../i18n/context.js'

export default function Traffic() {
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
