import 'server-only'
import { cookies, headers } from 'next/headers'
import { cache } from 'react'
import { LOCALE_COOKIE, resolveLocale } from './messages'

export const getLocale = cache(async () => {
  const [cookieStore, requestHeaders] = await Promise.all([
    cookies(),
    headers(),
  ])
  const language = requestHeaders
    .get('accept-language')
    ?.split(',')[0]
    ?.split(';')[0]
    ?.trim()
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value, language)
})
