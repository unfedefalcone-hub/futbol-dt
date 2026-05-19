'use client'

import dynamic from 'next/dynamic'

const BotFloat = dynamic(() => import('@/components/bot/BotFloat'), { ssr: false })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div style={{ position: 'fixed', bottom: 70, right: 16, zIndex: 9999, background: 'red', color: 'white', padding: '10px', borderRadius: '8px' }}>
        TEST
      </div>
      <BotFloat />
    </>
  )
}