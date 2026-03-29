'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Poem } from '@/lib/supabase'
import TagBadge from './TagBadge'

interface PoemCardProps {
  poem: Poem
  isAdmin: boolean
  onRead: (poem: Poem) => void
  onEdit: (poem: Poem) => void
  onDelete: (id: string) => void
  index: number
}

export default function PoemCard({ poem, isAdmin, onRead, onEdit, onDelete, index }: PoemCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ 
        y: -8, 
        scale: 1.03,
        transition: { type: 'spring', stiffness: 600, damping: 30 }
      }}
      className="group relative rounded-[20px] p-6 cursor-pointer border border-[var(--border)] bg-[rgba(255,252,244,0.8)] hover:border-[var(--sage-light)] hover:shadow-xl overflow-hidden"
      onClick={() => onRead(poem)}
    >
      <div className="absolute inset-0 bg-[var(--sage)] opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none" />

      {/* Top Row */}
      <div className="flex justify-between items-start mb-4">
        <span 
          className="text-[40px] select-none sway" 
          style={{ animationDelay: `${index * 0.2}s` }}
          aria-hidden
        >
          {poem.icon_id}
        </span>

        {isAdmin && (
          <div ref={menuRef} className="relative z-10" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--cream-dark)] transition-colors"
              aria-label="Options"
            >
              <span className="text-[var(--text-soft)] text-xl leading-none">⋮</span>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 z-50 rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)] bg-[var(--cream)] min-w-[140px]"
                >
                  <button
                    onClick={() => { onEdit(poem); setMenuOpen(false) }}
                    className="w-full text-left px-4 py-3 text-sm font-sans hover:bg-[var(--cream-dark)] transition-colors flex items-center gap-2"
                    style={{ color: 'var(--text)' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => { onDelete(poem.id); setMenuOpen(false) }}
                    className="w-full text-left px-4 py-3 text-sm font-sans hover:bg-[#F4E3E3] transition-colors flex items-center gap-2"
                    style={{ color: '#C28B8B' }}
                  >
                    🗑️ Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className="font-serif font-medium text-lg mb-2 leading-snug text-[var(--text)]">
        {poem.title}
      </h2>

      {/* Preview */}
      <p className="font-serif text-[13px] text-clamp-2 mb-4 italic text-[var(--text-soft)] leading-relaxed">
        {poem.content}
      </p>

      {/* Footer */}
      <div
        className="flex justify-between items-center pt-4 border-t border-[var(--border)]"
      >
        <div className="flex items-center gap-1.5 text-[var(--sage)]">
          <span className="text-xs sway">💧</span>
          <span className="font-sans text-[11px] font-semibold">
            {poem.water_count.toLocaleString()}
          </span>
        </div>
        <div className="text-[10px] tracking-[2px] uppercase bg-[var(--cream-dark)] text-[var(--text-soft)] px-2.5 py-1 rounded-full">
          {poem.tag_name}
        </div>
      </div>
    </motion.div>
  )
}
