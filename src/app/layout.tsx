import type { Metadata } from 'next'
import './globals.css'

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
      </body>
    </html>
  )
}