"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Calendar, Trash2, PenLine, Heart } from "lucide-react"

interface DiaryEntry {
  id: string
  content: string
  date: string
  isFavorite?: boolean
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('diary-entries')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [newEntry, setNewEntry] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [newEntry])

  const handleSave = () => {
    if (!newEntry.trim()) return

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      content: newEntry,
      date: new Date().toLocaleString('ru-RU'),
      isFavorite: false
    }

    const updatedEntries = [entry, ...entries]
    setEntries(updatedEntries)
    localStorage.setItem('diary-entries', JSON.stringify(updatedEntries))
    setNewEntry("")
  }

  const handleDelete = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem('diary-entries', JSON.stringify(updatedEntries))
    
    // Remove from favorites if it exists there
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    const updatedFavorites = favorites.filter((item: any) => 
      !(item.type === 'diary' && item.id === id)
    )
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }

  const toggleFavorite = (entry: DiaryEntry) => {
    // Update diary entries
    const updatedEntries = entries.map(e => 
      e.id === entry.id ? { ...e, isFavorite: !e.isFavorite } : e
    )
    setEntries(updatedEntries)
    localStorage.setItem('diary-entries', JSON.stringify(updatedEntries))

    // Update favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    const entryExists = favorites.some((item: any) => 
      item.type === 'diary' && item.id === entry.id
    )

    let updatedFavorites
    if (entryExists) {
      updatedFavorites = favorites.filter((item: any) => 
        !(item.type === 'diary' && item.id === entry.id)
      )
    } else {
      updatedFavorites = [...favorites, {
        id: entry.id,
        type: 'diary',
        content: entry.content,
        date: entry.date
      }]
    }
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="ml-[240px] p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-pink-500 flex items-center gap-3">
              Мой дневник
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-6 w-6 text-pink-400" />
              </motion.div>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6 mb-8"
          >
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Напишите что-нибудь..."
                className="w-full min-h-[120px] bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-400"
              />
              <div className="absolute right-2 bottom-2">
                <PenLine className="h-5 w-5 text-pink-300" />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="button-gradient px-6 py-2 rounded-xl text-sm font-medium"
              >
                Сохранить
              </motion.button>
            </div>
          </motion.div>

          <div className="space-y-6">
            <AnimatePresence>
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-effect rounded-xl p-6 hover-scale"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{entry.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleFavorite(entry)}
                        className="p-2 hover:bg-pink-50 rounded-full transition-colors"
                      >
                        <Heart 
                          className={`h-4 w-4 text-pink-500 ${entry.isFavorite ? 'fill-pink-500' : ''}`}
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 hover:bg-pink-50 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-pink-500" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="prose prose-pink">
                    <p className="whitespace-pre-wrap text-gray-800">{entry.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 