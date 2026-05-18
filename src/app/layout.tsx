import type { Metadata } from 'next'
import './globals.css'
import BotWrapper from '@/components/bot/BotWrapper'

export const metadata: Metadata = {
  title: 'Futbol DT — Mundial 2026',
  description: 'Fantasy football del Mundial 2026',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <BotWrapper />
      </body>
    </html>
  )
}