'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, Poem } from '@/lib/supabase'
import { isAdminSession, clearAdminSession } from '@/lib/auth'
import PoemCard from '@/components/PoemCard'
import PoemModal from '@/components/PoemModal'
import PlantModal from '@/components/PlantModal'
import SkeletonCard from '@/components/SkeletonCard'
import EmptyState from '@/components/EmptyState'

export default function GardenPage() {
  const [poems, setPoems] = useState<Poem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null)
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false)
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false)
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null)

  useEffect(() => {
    setIsAdmin(isAdminSession())
  }, [])

  const fetchPoems = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('poems')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setPoems(data as Poem[])
      } else if (error) {
        console.error('Fetch error:', error)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPoems()
  }, [fetchPoems])

  useEffect(() => {
    // Realtime subscription for "poems" table
    const channel = supabase
      .channel('garden_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'poems' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newPoem = payload.new as Poem
            setPoems((prev) => [newPoem, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            const updatedPoem = payload.new as Poem
            setPoems((prev) =>
              prev.map((p) => (p.id === updatedPoem.id ? updatedPoem : p))
            )
            // If the currently selected poem is the one that was updated, sync it
            setSelectedPoem((current) => 
              current?.id === updatedPoem.id ? updatedPoem : current
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id
            setPoems((prev) => prev.filter((p) => p.id !== deletedId))
            setSelectedPoem((current) => 
              current?.id === deletedId ? null : current
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleReadPoem = (poem: Poem) => {
    setSelectedPoem(poem)
    setIsPoemModalOpen(true)
  }

  const handleWaterPoem = (id: string, newCount: number) => {
    setPoems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, water_count: newCount } : p))
    )
  }

  const handleEditPoem = (poem: Poem) => {
    setEditingPoem(poem)
    setIsPlantModalOpen(true)
  }

  const handleDeletePoem = async (id: string) => {
    await supabase.from('poems').delete().eq('id', id)
    setPoems(prev => prev.filter(p => p.id !== id))
  }

  const handleLogout = () => {
    clearAdminSession()
    setIsAdmin(false)
  }

  const handlePlantSuccess = () => {
    fetchPoems()
    setEditingPoem(null)
  }

  return (
    <div className="min-h-screen grain-overlay">
      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-[rgba(255,252,244,0.9)] backdrop-blur-md border-b border-[var(--border)] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl cursor-default sway">
            🌼
          </span>
          <div>
            <h1 className="font-serif font-medium text-xl leading-tight text-[var(--text)]">
              The Chamomile Garden
            </h1>
            <p className="text-[11px] tracking-[2px] text-[var(--text-soft)] uppercase font-light">
              Where words take root and bloom
            </p>
          </div>
        </div>

        {isAdmin ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, backgroundColor: '#F4E3E3', color: '#C28B8B' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-semibold transition-all bg-[var(--cream-dark)] text-[var(--text-soft)] shadow-sm"
          >
            <span>🌙</span>
            <span>Gardener</span>
          </motion.button>
        ) : (
          <Link href="/secret-garden">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, backgroundColor: 'var(--sage-light)', color: 'white' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-semibold transition-all bg-[var(--cream-dark)] text-[var(--text-soft)] shadow-sm"
            >
              <span>🍃</span>
              <span>Visitor</span>
            </motion.button>
          </Link>
        )}
      </header>

      {/* MAIN */}
      <main className="max-w-[1100px] mx-auto px-6 py-10 pb-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-[28px] text-[var(--text)] mb-2">
            {isAdmin ? 'Your Garden' : 'Explore the Garden'}
          </h2>
          <p className="text-sm text-[var(--text-soft)] tracking-wider">
            Each poem is a seed. Each reading, a watering.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : poems.length === 0 ? (
          <div className="grid grid-cols-1">
            <EmptyState />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {poems.map((poem, i) => (
              <PoemCard
                key={poem.id}
                poem={poem}
                isAdmin={isAdmin}
                onRead={handleReadPoem}
                onEdit={handleEditPoem}
                onDelete={handleDeletePoem}
                index={i}
              />
            ))}
            
            {/* Add Tile Logic for Admin or just a placeholder for looks */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  setEditingPoem(null)
                  setIsPlantModalOpen(true)
                }}
                className="group flex flex-col items-center justify-center min-h-[160px] border-2 border-dashed border-[rgba(122,158,126,0.3)] rounded-[20px] cursor-pointer transition-all hover:border-[var(--sage)] hover:bg-[rgba(122,158,126,0.05)] hover:scale-[1.02]"
              >
                <div className="text-[28px] text-[var(--sage)] mb-3 group-hover:scale-110 transition-transform">+</div>
                <p className="text-sm text-[var(--text-soft)]">Plant a new thought</p>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* Admin FAB (Optional if we have the tile, but keeping for convenience) */}
      <AnimatePresence>
        {isAdmin && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingPoem(null)
              setIsPlantModalOpen(true)
            }}
            className="fixed bottom-8 right-6 z-40 flex items-center gap-2 px-6 py-4 rounded-full font-sans font-bold text-white text-sm sage-glow transition-all"
            style={{ backgroundColor: 'var(--sage)' }}
          >
            <span className="text-lg sway">🌱</span>
            <span>Plant a thought</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Poem Reading Modal */}
      <PoemModal
        poem={selectedPoem}
        isOpen={isPoemModalOpen}
        onClose={() => { setIsPoemModalOpen(false) }}
        isAdmin={isAdmin}
        onEdit={handleEditPoem}
        onDelete={handleDeletePoem}
        onWater={handleWaterPoem}
      />

      {/* Plant / Edit Modal */}
      <PlantModal
        isOpen={isPlantModalOpen}
        onClose={() => { setIsPlantModalOpen(false); setEditingPoem(null) }}
        editingPoem={editingPoem}
        onSuccess={handlePlantSuccess}
      />
    </div>
  )
}
