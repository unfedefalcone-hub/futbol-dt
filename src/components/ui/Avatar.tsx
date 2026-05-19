'use client'

import { createAvatar } from '@dicebear/core'
import { avataaars, pixelArt, funEmoji, bottts } from '@dicebear/collection'

const STYLES = { avataaars, pixelArt, funEmoji, bottts }

type StyleKey = keyof typeof STYLES

interface AvatarProps {
  seed: string
  size?: number
  style?: StyleKey
}

export default function Avatar({ seed, size = 40, style = 'avataaars' }: AvatarProps) {
  const avatar = createAvatar(STYLES[style], {
    seed,
    size,
  })

  return (
    <div
      style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: avatar.toString() }}
    />
  )
}