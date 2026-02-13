import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { AuthProvider } from '@/contexts/auth-context'
import './globals.css'
import StoreProvider from '@/contexts/StoreProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // This enables safe-area-inset
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Cassanova',
  description: 'Created by James Hrivnak',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <StoreProvider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <AuthProvider>{children}</AuthProvider>
        </body>
      </StoreProvider>
    </html>
  )
}
