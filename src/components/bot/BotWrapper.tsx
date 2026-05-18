'use client'

import dynamic from 'next/dynamic'

const BotFloat = dynamic(() => import('./BotFloat'), { ssr: false })

export default function BotWrapper() {
  return <BotFloat />
}