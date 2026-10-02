import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Header } from '@/components/landing/header'
import { LocaleProvider } from '@/i18n/provider'
import { getLocale } from '@/i18n/server'
import { messages } from '@/i18n/messages'

const satoshiFont = localFont({
  src: './fonts/Satoshi.woff2',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: 'QeepeR - QR Code Keeper',
    description: messages[locale].description,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale} className={satoshiFont.className}>
      <body className="text-black">
        <LocaleProvider initialLocale={locale}>
          <Header />
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
