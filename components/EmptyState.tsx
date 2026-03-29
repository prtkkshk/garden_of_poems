'use client'

import { motion } from 'framer-motion'

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="col-span-full flex flex-col items-center justify-center py-32 px-6 text-center"
    >
      {/* Seed illustration */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="text-[80px] mb-8 select-none drop-shadow-lg"
        aria-hidden
      >
        🌱
      </motion.div>

      {/* Dirt line */}
      <div className="w-32 h-1 rounded-full mb-10 bg-[var(--chamomile)] opacity-40" />

      <p
        className="font-serif italic text-xl max-w-sm text-[var(--text-soft)] leading-relaxed"
      >
        The garden is quiet…<br />
        <span className="text-base opacity-70">Waiting for its first thought to bloom.</span>
      </p>
    </motion.div>
  )
}
