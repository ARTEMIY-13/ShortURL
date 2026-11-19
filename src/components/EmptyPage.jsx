import { useI18n } from '../i18n/context.js'

export default function EmptyPage() {
  const { t } = useI18n()
  return <div className="card empty-page">{t('page.empty')}</div>
}
