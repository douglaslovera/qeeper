'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  LOCALE_COOKIE,
  messages,
  resolveLocale,
  type Locale,
  type MessageKey,
} from './messages'

const LocaleContext = createContext<Locale>('en')

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  const [locale, setLocale] = useState(initialLocale)

  useEffect(() => {
    const updateLocale = () => {
      const override = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(`${LOCALE_COOKIE}=`))
        ?.split('=')[1]
      const detected = resolveLocale(
        override,
        navigator.languages?.[0] || navigator.language,
      )
      setLocale(detected)
      document.documentElement.lang = detected
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', messages[detected].description)
    }
    updateLocale()
    window.addEventListener('languagechange', updateLocale)
    return () => window.removeEventListener('languagechange', updateLocale)
  }, [])

  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  )
}

export function useTranslations() {
  const locale = useContext(LocaleContext)
  return (key: MessageKey) => messages[locale][key]
}

// Server components can render this client component without becoming client components.
export function Text({ id }: { id: MessageKey }) {
  const t = useTranslations()
  return t(id)
}
