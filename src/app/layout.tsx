import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

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
      {/* The body stays white: iOS Safari tints its toolbar from the body background. */}
      <body className="flex min-h-dvh flex-col bg-white text-black">
        <LocaleProvider initialLocale={locale}>
          <Header />
          <div className="flex flex-1 flex-col bg-background">{children}</div>
        </LocaleProvider>
      </body>
    </html>
  )
}
