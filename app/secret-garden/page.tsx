'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { checkPassword, setAdminSession, isAdminSession } from '@/lib/auth'

export default function SecretGardenPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Standard approach to handle hydration in Next.js Client Components
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
    // If they're already admin, take them home
    if (isAdminSession()) {
      router.replace('/')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || loading || success) return

    setLoading(true)
    setError('')

    // Feedback delay
    await new Promise(r => setTimeout(r, 600))

    if (checkPassword(password)) {
      setSuccess(true)
      setAdminSession()
      setTimeout(() => router.push('/'), 1200)
    } else {
      setError("That's not quite right, love. Try again.")
      setPassword('')
      setLoading(false)
    }
  }

  // Prevent flash of unstyled content during hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#f0e8d8]" />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-gradient-to-br from-[#e8f0e4] via-[#f0e8d8] to-[#e4edd8]">
      {/* Glistening background grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grain-overlay" />

      {/* Decorative Floating Elements from Design */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {[
          { e: '🌼', t: '10%', l: '15%', d: 0 },
          { e: '🌸', t: '20%', l: '80%', d: 1 },
          { e: '🍃', t: '75%', l: '50%', d: 2 },
          { e: '✨', t: '60%', l: '25%', d: 3 },
          { e: '🌿', t: '85%', l: '70%', d: 4 },
        ].map((item, i) => (
          <motion.span
            key={i}
            className="absolute text-4xl select-none opacity-[0.15] sway"
            style={{ left: item.l, top: item.t }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15, y: [0, -15, 0] }}
            transition={{
              y: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: item.d },
              opacity: { duration: 1 }
            }}
          >
            {item.e}
          </motion.span>
        ))}
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-[32px] p-10 shadow-2xl relative z-10 border border-[var(--border)] bg-[rgba(255,252,244,0.9)] backdrop-blur-md"
      >
        {/* Floating Icon Wrapper */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={success ? { 
              scale: [1, 1.2, 1], 
              rotate: [0, -10, 10, 0],
              y: [0, -10, 0]
            } : { 
              y: [0, -6, 0] 
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl select-none drop-shadow-sm"
          >
            {success ? '🌸' : '🗝️'}
          </motion.div>
        </div>

        {/* Text Header */}
        <div className="text-center mb-10">
          <h1 className="font-serif font-medium text-2xl text-[var(--text)] mb-2">
            The Secret Garden
          </h1>
          <p className="font-serif italic text-sm text-[var(--text-soft)]">
            {success ? 'Welcome back, gardener…' : 'Only for the gardener.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your secret key…"
              disabled={loading || success}
              className="w-full px-6 py-4 rounded-full font-sans text-sm text-center tracking-[0.3em] border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--sage)] bg-[rgba(255,252,244,0.7)] text-[var(--text)] transition-all placeholder:tracking-normal placeholder:font-normal placeholder:opacity-40"
              autoFocus
            />
            <div className="absolute inset-0 rounded-full border border-[var(--sage)] opacity-0 group-focus-within:opacity-20 pointer-events-none transition-opacity" />
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-sans text-xs text-center text-[#C28B8B] font-medium"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading || success || !password}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-full font-sans font-bold text-white text-sm sage-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--sage)] relative overflow-hidden group"
          >
            <span className="relative z-10">
              {loading ? 'Opening gates...' : success ? 'Entering...' : 'Enter the garden'}
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-10">
          <Link href="/">
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-xs font-semibold transition-all text-[var(--text-soft)] hover:text-[var(--sage)]"
            >
              <span>←</span>
              <span>Back to Garden</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
