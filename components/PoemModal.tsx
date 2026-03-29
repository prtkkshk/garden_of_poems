'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Poem, supabase } from '@/lib/supabase'
import TagBadge from './TagBadge'

interface Particle {
  id: number
  x: number
  y: number
  emoji: string
  rotate: number
}

interface PoemModalProps {
  poem: Poem | null
  isOpen: boolean
  onClose: () => void
  isAdmin: boolean
  onEdit: (poem: Poem) => void
  onDelete: (id: string) => void
  onWater: (id: string, newCount: number) => void
}

export default function PoemModal({ poem, isOpen, onClose, isAdmin, onEdit, onDelete, onWater }: PoemModalProps) {
  const [waterCount, setWaterCount] = useState(poem?.water_count ?? 0)
  const [particles, setParticles] = useState<Particle[]>([])
  const [canTilted, setCanTilted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const dragY = useMotionValue(0)
  const opacity = useTransform(dragY, [0, 200], [1, 0])

  useEffect(() => {
    setWaterCount(poem?.water_count ?? 0)
  }, [poem])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleWater = useCallback(async () => {
    if (!poem) return

    const nextCount = (waterCount || 0) + 1
    setWaterCount(nextCount)
    onWater(poem.id, nextCount)

    setCanTilted(true)
    setTimeout(() => setCanTilted(false), 400)

    // Spawn particles
    const newParticles: Particle[] = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 140,
      y: -(Math.random() * 100 + 50),
      emoji: Math.random() > 0.45 ? '💧' : '🌿',
      rotate: (Math.random() - 0.5) * 360,
    }))
    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)))
    }, 900)

    try {
      await supabase.rpc('increment_water', { poem_id: poem.id })
    } catch {
      // Optimistic UI — fire and forget
    }
  }, [poem, waterCount, onWater])

  const handleDragEnd = (_: unknown, info: { offset: { y: number } }) => {
    if (info.offset.y > 120) {
      onClose()
    }
  }

  if (!poem) return null

  const sheetContent = (
    <div className="flex flex-col h-full bg-[var(--cream)]">
      {/* Drag handle (mobile only) */}
      {isMobile && (
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between px-8 pt-8 pb-6 flex-shrink-0 bg-[rgba(255,252,244,0.95)] border-b border-[var(--border)]">
        <div className="flex items-center gap-4">
          <span className="text-4xl select-none sway">{poem.icon_id}</span>
          <div>
            <h2 className="font-serif font-medium text-xl leading-tight text-[var(--text)]">
              {poem.title}
            </h2>
            <p className="text-xs text-[var(--text-soft)] italic tracking-wider mt-1">
              — adyasha
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--cream-dark)] transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <span className="text-[var(--text-soft)] text-xl">✕</span>
        </button>
      </div>

      {/* Poem content — scrollable */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-8">
        <p className="poetry-body text-base md:text-lg">
          {poem.content}
        </p>
      </div>

      {/* Admin actions */}
      {isAdmin && (
        <div className="flex gap-2 px-8 pb-4 flex-shrink-0">
          <button
            onClick={() => { onEdit(poem); onClose() }}
            className="flex-1 py-2.5 rounded-full font-sans text-xs font-semibold transition-colors border border-[var(--border)] text-[var(--text-soft)] hover:bg-[var(--cream-dark)]"
          >
            ✏️ Edit poem
          </button>
          <button
            onClick={() => { onDelete(poem.id); onClose() }}
            className="flex-1 py-2.5 rounded-full font-sans text-xs font-semibold transition-colors bg-[#F4E3E3] text-[#C28B8B] hover:bg-[#F0D8D8]"
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {/* Water button — sticky bottom */}
      <div className="px-8 pb-8 flex-shrink-0 flex items-center justify-between border-t border-[var(--border)] pt-6 bg-[rgba(255,252,244,0.95)]">
        <motion.button
          onClick={handleWater}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-sans font-medium text-sm text-[var(--text-soft)] bg-[var(--cream-dark)] border border-[var(--border)] transition-all hover:bg-[rgba(42,157,143,0.1)] hover:border-[rgba(42,157,143,0.3)] hover:text-[#2a9d8f]"
        >
          <motion.span
            animate={{ rotate: canTilted ? -20 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="text-lg select-none"
          >
            🪣
          </motion.span>
          <span>Water this</span>
        </motion.button>
        
        <span className="text-xs text-[var(--text-soft)] font-sans">
          {waterCount.toLocaleString()} waterings
        </span>

        {/* Particles container */}
        <div className="absolute bottom-20 left-12 pointer-events-none">
          <AnimatePresence>
            {particles.map(p => (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.5, rotate: p.rotate }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="absolute bottom-0 text-base select-none pointer-events-none"
              >
                {p.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200]"
            style={{ backgroundColor: 'rgba(58, 46, 30, 0.35)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {isMobile ? (
            /* MOBILE: Bottom Sheet */
            <motion.div
              key="sheet"
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={handleDragEnd}
              style={{
                y: dragY,
                opacity,
                height: '85svh',
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[201] rounded-t-[24px] overflow-hidden shadow-[-20px_0_60px_rgba(0,0,0,0.1)]"
            >
              {sheetContent}
            </motion.div>
          ) : (
            /* DESKTOP: Side Drawer */
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-[201] w-full max-w-[520px] shadow-[-20px_0_60px_rgba(0,0,0,0.1)] rounded-l-[24px] overflow-hidden"
            >
              {sheetContent}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
