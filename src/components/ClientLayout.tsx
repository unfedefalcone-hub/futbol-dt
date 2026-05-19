'use client'

import dynamic from 'next/dynamic'

const BotFloat = dynamic(() => import('@/components/bot/BotFloat'), { ssr: false })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BotFloat />
    </>
  )
}