import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://stwmdjbajgppbsipnalo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0d21kamJhamdwcGJzaXBuYWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODY5NDUsImV4cCI6MjA5MDI2Mjk0NX0.Etv7Y2l86R53Vcf6QPTtYxcTAqmIN0_Vn0FfQ888-wQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Poem {
  id: string
  created_at: string
  title: string
  content: string
  icon_id: string
  tag_name: string
  water_count: number
}

export const ICONS: Record<string, string> = {
  moon: '🌙',
  wave: '🌊',
  flower: '🌸',
  stars: '✨',
  leaf: '🍃',
  sun: '☀️',
  cloud: '☁️',
  butterfly: '🦋',
  feather: '🪶',
  seedling: '🌱',
  chamomile: '🌼',
  sunflower: '🌻',
  tulip: '🌷',
  rose: '🌹',
  lotus: '🪷',
  hibiscus: '🌺',
  heart: '🤍',
  sparkling_heart: '💖',
  green_heart: '💚',
  ribbon: '🎀',
  sparkles: '💫',
  dove: '🕊️',
  mushroom: '🍄',
}

export const TAGS = ['SOUL', 'OCEAN', 'LOSS', 'GROWTH', 'BLUE', 'LOVE'] as const
export type TagName = (typeof TAGS)[number]

export const TAG_STYLES: Record<TagName, { bg: string; text: string }> = {
  SOUL:   { bg: '#F1E8D9', text: '#A48A63' },
  OCEAN:  { bg: '#E2EDF8', text: '#7BA4C7' },
  LOSS:   { bg: '#F4E3E3', text: '#C28B8B' },
  GROWTH: { bg: '#E5F0E5', text: '#7EA87E' },
  BLUE:   { bg: '#E2EBFA', text: '#6A8AC2' },
  LOVE:   { bg: '#F8E2E8', text: '#C4728A' },
}
