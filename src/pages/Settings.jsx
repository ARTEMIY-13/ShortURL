import { useI18n } from '../i18n/context.js'
import { useSettings } from '../settings/context.js'
import { LANGS } from '../i18n/translations.js'
import Segmented from '../components/Segmented.jsx'
import { THEMES } from '../settings/SettingsProvider.jsx'

const LANG_NAMES = { uk: 'Українська', en: 'English' }

export default function Settings() {
  const { t, lang, setLang, locale } = useI18n()
  const { theme, setTheme, user, updateUser } = useSettings()
  const initial = (user.name || user.username || 'U').trim().charAt(0).toUpperCase()
  const field = (key) => ({ value: user[key], onChange: (e) => updateUser({ [key]: e.target.value }) })

  return (
    <div className="set">
      <section className="card">
        <h3>{t('settings.appearance')}</h3>
        <div className="srow">
          <div><div className="lbl">{t('settings.language')}</div><div className="hint">{t('settings.languageHint')}</div></div>
          <Segmented label={t('settings.language')} value={lang} onChange={setLang} options={LANGS.map((c) => [c, LANG_NAMES[c]])} />
        </div>
        <div className="srow">
          <div><div className="lbl">{t('settings.theme')}</div><div className="hint">{t('settings.themeHint')}</div></div>
          <Segmented label={t('settings.theme')} value={theme} onChange={setTheme} options={THEMES.map((id) => [id, t(`theme.${id}`)])} />
        </div>
      </section>

      <section className="card">
        <h3>{t('settings.profile')}</h3>
        <div className="pbig">
          <div className="av">{initial}</div>
          <div>
            <div className="lbl">{user.name || user.username || '—'}</div>
            <span className="tag">{t('profile.plan')}: {user.plan}</span>
          </div>
        </div>
        <div className="pfield"><label htmlFor="p-name">{t('profile.name')}</label><input id="p-name" type="text" placeholder={t('profile.namePlaceholder')} {...field('name')} /></div>
        <div className="pfield"><label htmlFor="p-user">{t('profile.username')}</label><input id="p-user" type="text" placeholder="username" {...field('username')} /></div>
        <div className="pfield"><label htmlFor="p-mail">{t('profile.email')}</label><input id="p-mail" type="email" placeholder="name@example.com" {...field('email')} /></div>
        <div className="pfield"><label>{t('profile.since')}</label><div>{new Date(user.joinedAt).toLocaleDateString(locale)}</div></div>
        <div className="hint">{t('profile.local')}</div>
      </section>
    </div>
  )
}
