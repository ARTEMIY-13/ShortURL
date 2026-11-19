import { useMemo, useState } from 'react'
import { useI18n } from '../i18n/context.js'

export default function Chart() {
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
