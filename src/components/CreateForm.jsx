import { useState } from 'react'
import { useI18n } from '../i18n/context.js'

export default function CreateForm({ onCreate }) {
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
