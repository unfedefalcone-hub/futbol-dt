'use client'

import { createAvatar } from '@dicebear/core'
import { avataaars, pixelArt, bottts, funEmoji } from '@dicebear/collection'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AVATARS: { seed: string; style: any }[] = [
  { seed: 'messi2026', style: avataaars },
  { seed: 'maradona10', style: avataaars },
  { seed: 'ronaldo7', style: avataaars },
  { seed: 'neymar11', style: avataaars },
  { seed: 'mbappe9', style: avataaars },
  { seed: 'robot_dt', style: bottts },
  { seed: 'robo_gol', style: bottts },
  { seed: 'robo_tactic', style: bottts },
  { seed: 'robo_coach', style: bottts },
  { seed: 'pixel_dt1', style: pixelArt },
  { seed: 'pixel_dt2', style: pixelArt },
  { seed: 'pixel_dt3', style: pixelArt },
  { seed: 'pixel_gk', style: pixelArt },
  { seed: 'emoji_fire', style: funEmoji },
  { seed: 'emoji_goal', style: funEmoji },
  { seed: 'emoji_cup', style: funEmoji },
  { seed: 'emoji_star', style: funEmoji },
  { seed: 'emoji_ball', style: funEmoji },
]

interface AvatarPickerProps {
  selected: number
  onSelect: (idx: number) => void
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
      {AVATARS.map((av, idx) => {
        const avatar = createAvatar(av.style, { seed: av.seed, size: 56 })
        return (
          <div
            key={idx}
            onClick={() => onSelect(idx)}
            style={{
              width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden',
              cursor: 'pointer',
              border: `2.5px solid ${selected === idx ? '#f0c040' : 'rgba(116,172,223,0.2)'}`,
              boxShadow: selected === idx ? '0 0 10px rgba(240,192,64,0.4)' : 'none',
              transition: 'all .18s'
            }}
            dangerouslySetInnerHTML={{ __html: avatar.toString() }}
          />
        )
      })}
    </div>
  )
}

export { AVATARS }

export default function Avatar({ seed = '0', size = 40 }: { seed?: string; size?: number }) {
  const idx = parseInt(seed) || 0
  const av = AVATARS[idx] || AVATARS[0]
  const avatar = createAvatar(av.style, { seed: av.seed, size })
  return (
    <div
      style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: avatar.toString() }}
    />
  )
}