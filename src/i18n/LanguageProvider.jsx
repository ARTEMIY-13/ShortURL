import { useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './context.js'
import { LANGS, LOCALES, translations, plurals } from './translations.js'

function initialLang() {
  try {
    const saved = localStorage.getItem('lang')
    if (LANGS.includes(saved)) return saved
  } catch {
    // localStorage недоступний — беремо мову за замовчуванням
  }
  return 'uk'
}

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('lang', lang)
    } catch {
      // нічого страшного: мова просто не збережеться
    }
  }, [lang])

  const value = useMemo(() => {
    const rules = new Intl.PluralRules(LOCALES[lang])
    return {
      lang,
      setLang,
      locale: LOCALES[lang],
      t: (key, vars = {}) =>
        (translations[lang][key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? ''),
      // tn('click', 5) → «5 кліків» / "5 clicks"
      tn: (word, n) => `${n} ${plurals[lang][word][rules.select(n)]}`,
    }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
