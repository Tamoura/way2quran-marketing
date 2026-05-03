import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Way2Quran Marketing',
  description: 'Way2Quran Marketing Agency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
