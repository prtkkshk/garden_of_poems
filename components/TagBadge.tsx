'use client'

import { TAG_STYLES, TagName } from '@/lib/supabase'

interface TagBadgeProps {
  tag: string
  size?: 'sm' | 'md'
}

export default function TagBadge({ tag, size = 'sm' }: TagBadgeProps) {
  const style = TAG_STYLES[tag as TagName] ?? { bg: '#F1E8D9', text: '#A48A63' }
  return (
    <span
      className={`inline-flex items-center rounded-full font-sans font-600 tracking-wide uppercase ${
        size === 'sm' ? 'px-3 py-1 text-[10px]' : 'px-4 py-1.5 text-xs'
      }`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {tag}
    </span>
  )
}
