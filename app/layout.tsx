import type { Metadata, Viewport } from 'next'
import { Lora, Nunito } from 'next/font/google'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'The Chamomile Garden',
  description: 'A quiet corner of the internet for poetry.',
}

export const viewport: Viewport = {
  themeColor: '#F4F1E1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${lora.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  )
}
