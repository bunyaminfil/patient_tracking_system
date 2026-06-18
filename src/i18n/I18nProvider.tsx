import { useCallback, useEffect, useMemo, useState } from 'react'
import { I18nContext } from './context'
import type { I18nValue } from './context'
import { translations } from './translations'
import type { Lang, TranslationKey } from './translations'

const STORAGE_KEY = 'pts.lang'

function initialLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'en' || saved === 'tr' ? saved : 'tr'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => initialLang())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => setLangState(next), [])

  const t = useCallback<I18nValue['t']>(
    (key: TranslationKey, params) => {
      let text: string = translations[lang][key]
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(`{${k}}`, String(v))
        }
      }
      return text
    },
    [lang],
  )

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
