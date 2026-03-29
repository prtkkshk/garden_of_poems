'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, Poem, ICONS, TAGS, TagName } from '@/lib/supabase'

interface PlantModalProps {
  isOpen: boolean
  onClose: () => void
  editingPoem: Poem | null
  onSuccess: () => void
}

const DEFAULT_ICON = '🌸'
const DEFAULT_TAG: TagName = 'SOUL'

export default function PlantModal({ isOpen, onClose, editingPoem, onSuccess }: PlantModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICON)
  const [selectedTag, setSelectedTag] = useState<TagName>(DEFAULT_TAG)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isEditing = !!editingPoem

  useEffect(() => {
    if (editingPoem) {
      setTitle(editingPoem.title)
      setContent(editingPoem.content)
      setSelectedIcon(editingPoem.icon_id)
      setSelectedTag(editingPoem.tag_name as TagName)
    } else {
      setTitle('')
      setContent('')
      setSelectedIcon(DEFAULT_ICON)
      setSelectedTag(DEFAULT_TAG)
    }
    setError('')
  }, [editingPoem, isOpen])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${ta.scrollHeight}px`
    }
  }, [content])

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both the title and poem.')
      return
    }
    setLoading(true)
    setError('')

    try {
      if (isEditing && editingPoem) {
        const { error: err } = await supabase
          .from('poems')
          .update({ title: title.trim(), content: content.trim(), icon_id: selectedIcon, tag_name: selectedTag })
          .eq('id', editingPoem.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase
          .from('poems')
          .insert({ title: title.trim(), content: content.trim(), icon_id: selectedIcon, tag_name: selectedTag })
        if (err) throw err
      }
      onSuccess()
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300]"
            style={{ backgroundColor: 'rgba(74, 68, 58, 0.4)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-6 pointer-events-none"
          >
            <div
              className="w-full md:max-w-lg rounded-t-[32px] md:rounded-[32px] overflow-y-auto hide-scrollbar pointer-events-auto border-t md:border border-[var(--border)]"
              style={{
                backgroundColor: 'var(--cream)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
                maxHeight: '92svh',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 pt-8 pb-6 sticky top-0 z-10 bg-[rgba(255,252,244,0.95)] border-b border-[var(--border)]">
                <h2 className="font-serif font-medium text-xl text-[var(--text)]">
                  {isEditing ? '✏️ Edit poem' : '🌱 Plant a New Thought'}
                </h2>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--cream-dark)] transition-colors"
                >
                  <span className="text-[var(--text-soft)] text-xl">✕</span>
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Title input */}
                <div className="form-group">
                  <label className="block text-[10px] tracking-[2px] uppercase text-[var(--text-soft)] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Name your poem..."
                    className="w-full px-5 py-4 rounded-xl font-serif text-[15px] border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--sage)] bg-[rgba(255,252,244,0.8)] text-[var(--text)] transition-all"
                  />
                </div>

                {/* Icon selector */}
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase text-[var(--text-soft)] mb-2">
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {Object.entries(ICONS).map(([key, emoji]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedIcon(emoji)}
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl transition-all border border-transparent"
                        style={{
                          backgroundColor: selectedIcon === emoji ? 'var(--sage)' : 'rgba(255,252,244,0.8)',
                          borderColor: selectedIcon === emoji ? 'var(--sage-dark)' : 'var(--border)',
                          transform: selectedIcon === emoji ? 'scale(1.1)' : 'scale(1)',
                          boxShadow: selectedIcon === emoji ? '0 4px 12px rgba(122,158,126,0.3)' : 'none',
                        }}
                        title={key}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tag selector */}
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase text-[var(--text-soft)] mb-2">
                    Theme
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="px-4 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider transition-all border"
                        style={
                          selectedTag === tag
                            ? { backgroundColor: 'var(--sage)', color: '#fff', borderColor: 'var(--sage-dark)', transform: 'scale(1.05)' }
                            : { backgroundColor: 'var(--cream-dark)', color: 'var(--text-soft)', borderColor: 'var(--border)' }
                        }
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Poem body */}
                <div className="form-group">
                  <label className="block text-[10px] tracking-[2px] uppercase text-[var(--text-soft)] mb-2">
                    The poem
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={e => {
                      setContent(e.target.value)
                    }}
                    placeholder={'Let the words bloom here…'}
                    rows={6}
                    className="w-full px-5 py-4 rounded-xl font-serif text-[15px] italic border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--sage)] bg-[rgba(255,252,244,0.8)] text-[var(--text)] transition-all min-h-[180px] leading-relaxed"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="font-sans text-xs text-center text-[#C28B8B]">{error}</p>
                )}

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 py-4 rounded-full font-sans text-sm font-semibold border border-[var(--border)] text-[var(--text-soft)] hover:bg-[var(--cream-dark)] transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={loading}
                    whileTap={{ scale: 0.97 }}
                    className="flex-[2] py-4 rounded-full font-sans font-bold text-white text-sm transition-all sage-glow disabled:opacity-60 disabled:cursor-not-allowed bg-[var(--sage)] hover:bg-[var(--sage-dark)] shadow-lg"
                  >
                    {loading
                      ? '…planting'
                      : isEditing
                      ? '🌿 Save changes'
                      : 'Plant it 🌱'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
