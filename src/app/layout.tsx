import type { Metadata } from 'next'
import './globals.css'
import BotFloat from '@/components/bot/BotFloat'

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
        <BotFloat />
      </body>
    </html>
  )
}