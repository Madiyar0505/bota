"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, PenLine, Mail, X, ChevronRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"

interface Letter {
  id: number
  title: string
  content: string
  date: string
  isFavorite?: boolean
}

interface FavoriteItem {
  id: string
  type: string
  title: string
  content: string
  date: string
}

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('letters')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [isWriting, setIsWriting] = useState(false)
  const [newLetter, setNewLetter] = useState({ title: '', content: '' })
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]') as FavoriteItem[]
    const updatedLetters = letters.map(letter => ({
      ...letter,
      isFavorite: favorites.some(item => 
        item.type === 'letter' && item.id === letter.id.toString()
      )
    }))
    setLetters(updatedLetters)
  }, [])

  useEffect(() => {
    localStorage.setItem('letters', JSON.stringify(letters))
  }, [letters])

  const handleSaveLetter = () => {
    if (!newLetter.title.trim() || !newLetter.content.trim()) return

    const letter: Letter = {
      id: Date.now(),
      title: newLetter.title,
      content: newLetter.content,
      date: new Date().toLocaleDateString('ru-RU'),
      isFavorite: false
    }

    setLetters(prev => [letter, ...prev])
    setNewLetter({ title: '', content: '' })
    setIsWriting(false)
  }

  const toggleFavorite = (letter: Letter) => {
    const updatedLetters = letters.map(l => 
      l.id === letter.id ? { ...l, isFavorite: !l.isFavorite } : l
    )
    setLetters(updatedLetters)

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]') as FavoriteItem[]
    const letterExists = favorites.some(item => 
      item.type === 'letter' && item.id === letter.id.toString()
    )

    let updatedFavorites: FavoriteItem[]
    if (letterExists) {
      updatedFavorites = favorites.filter(item => 
        !(item.type === 'letter' && item.id === letter.id.toString())
      )
    } else {
      updatedFavorites = [...favorites, {
        id: letter.id.toString(),
        type: 'letter',
        title: letter.title,
        content: letter.content,
        date: letter.date
      }]
    }
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }

  const deleteLetter = (letterId: number) => {
    setLetters(prev => prev.filter(l => l.id !== letterId))
    if (selectedLetter?.id === letterId) {
      setSelectedLetter(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50/20 dark:to-pink-950/20">
      <Navbar />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-pink-500">Письма для Тебя</h1>

        <div className="max-w-4xl mx-auto">
          {!isWriting ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsWriting(true)}
              className="w-full p-8 mb-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 
                hover:border-pink-300 dark:hover:border-pink-700 transition-colors flex flex-col items-center gap-2"
            >
              <PenLine className="w-8 h-8 text-pink-500" />
              <p className="text-lg font-medium">Написать новое письмо</p>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg"
            >
              <input
                type="text"
                placeholder="Название письма..."
                value={newLetter.title}
                onChange={(e) => setNewLetter(prev => ({ ...prev, title: e.target.value }))}
                className="w-full mb-4 p-2 text-xl font-medium bg-transparent border-b-2 border-gray-200 
                  dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-500 outline-none"
              />
              <textarea
                placeholder="Напиши что-нибудь..."
                value={newLetter.content}
                onChange={(e) => setNewLetter(prev => ({ ...prev, content: e.target.value }))}
                className="w-full min-h-[200px] p-2 bg-transparent resize-none outline-none"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setIsWriting(false)}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSaveLetter}
                  className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors"
                >
                  Сохранить
                </button>
              </div>
            </motion.div>
          )}

          <div className="grid gap-4">
            <AnimatePresence>
              {letters.map((letter) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg cursor-pointer
                    ${selectedLetter?.id === letter.id ? 'ring-2 ring-pink-500' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1" onClick={() => setSelectedLetter(letter)}>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-5 h-5 text-pink-500" />
                        <h3 className="text-lg font-medium">{letter.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{letter.date}</p>
                      <p className={`text-gray-600 dark:text-gray-300 whitespace-pre-wrap
                        ${selectedLetter?.id !== letter.id ? 'line-clamp-2' : ''}`}>
                        {letter.content}
                      </p>
                      {selectedLetter?.id !== letter.id && letter.content.length > 100 && (
                        <button 
                          className="mt-2 text-sm text-pink-500 hover:text-pink-600 flex items-center gap-1"
                          onClick={() => setSelectedLetter(letter)}
                        >
                          Читать полностью
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleFavorite(letter)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <Heart 
                          className={`h-5 w-5 text-pink-500 transition-colors ${letter.isFavorite ? 'fill-pink-500' : ''}`}
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteLetter(letter.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <X className="h-5 w-5 text-pink-500" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
} 