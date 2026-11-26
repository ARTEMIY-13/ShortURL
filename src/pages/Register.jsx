import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import Segmented from '../components/Segmented.jsx'
import { useI18n } from '../i18n/context.js'
import { LANGS } from '../i18n/translations.js'
import { useSettings } from '../settings/context.js'
import { createRegisterSchema } from '../schemas/registerSchema.js'

const INITIAL = { name: '', username: '', email: '', password: '', confirmPassword: '', terms: false }

export default function Register() {
  const { t, lang, setLang } = useI18n()
  const { user, updateUser } = useSettings()
  const navigate = useNavigate()

  const [values, setValues] = useState(INITIAL)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const schema = useMemo(() => createRegisterSchema(t), [t])

  // Помилки рахуються з поточних значень: перша помилка кожного поля
  const errors = useMemo(() => {
    const result = schema.safeParse(values)
    if (result.success) return {}
    const out = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0]
      if (!(key in out)) out[key] = issue.message
    }
    return out
  }, [schema, values])

  const errorFor = (key) => (submitted || touched[key] ? errors[key] : '')

  const bind = (key) => ({
    id: `reg-${key}`,
    value: values[key],
    error: errorFor(key),
    onChange: (e) => setValues({ ...values, [key]: e.target.value }),
    onBlur: () => setTouched({ ...touched, [key]: true }),
  })

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const result = schema.safeParse(values)
    if (!result.success) return
    // Бекенду з акаунтами ще немає: зберігаємо профіль локально. Пароль не зберігаємо
    const { name, username, email } = result.data
    updateUser({ name, username, email, registered: true, joinedAt: new Date().toISOString() })
    navigate('/Home')
  }

  // Уже увійшли — реєстрація не потрібна
  if (user.registered) return <Navigate to="/Home" replace />

  return (
    <div className="auth">
      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="auth-top">
          <Link to="/Home" className="hint">← {t('register.home')}</Link>
          <Segmented label={t('settings.language')} value={lang} onChange={setLang} options={LANGS.map((c) => [c, c === 'uk' ? 'UA' : 'EN'])} />
        </div>
        <h1>{t('register.title')}</h1>
        <p className="hint" style={{ marginBottom: 18 }}>{t('register.subtitle')}</p>

        <FormField label={t('profile.name')} autoComplete="name" placeholder={t('profile.namePlaceholder')} {...bind('name')} />
        <FormField label={t('profile.username')} autoComplete="username" placeholder="username" {...bind('username')} />
        <FormField label={t('profile.email')} type="email" autoComplete="email" placeholder="name@example.com" {...bind('email')} />
        <FormField
          label={t('register.password')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          action={
            <button type="button" className="reveal" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? t('register.hide') : t('register.show')}
            </button>
          }
          {...bind('password')}
        />
        <FormField
          label={t('register.confirm')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          {...bind('confirmPassword')}
        />

        <div className="pfield">
          <label className="check">
            <input
              type="checkbox"
              checked={values.terms}
              onChange={(e) => setValues({ ...values, terms: e.target.checked })}
              onBlur={() => setTouched({ ...touched, terms: true })}
            />
            {t('register.terms')}
          </label>
          {errorFor('terms') && <div className="ferr" role="alert">{errorFor('terms')}</div>}
        </div>

        <button className="btn wide">{t('register.submit')}</button>
      </form>
    </div>
  )
}
