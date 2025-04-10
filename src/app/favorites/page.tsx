"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Image as ImageIcon, Music, BookOpen } from "lucide-react"

interface FavoriteItem {
  id: string
  type: 'photo' | 'music' | 'diary'
  content: string
  title?: string
  url?: string
  date: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const removeFromFavorites = (id: string) => {
    const updatedFavorites = favorites.filter(item => item.id !== id)
    setFavorites(updatedFavorites)
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <ImageIcon className="h-5 w-5 text-pink-500" />
      case 'music':
        return <Music className="h-5 w-5 text-pink-500" />
      case 'diary':
        return <BookOpen className="h-5 w-5 text-pink-500" />
      default:
        return null
    }
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
          <h1 className="text-3xl font-bold text-pink-500 flex items-center gap-3 mb-8">
            Избранное
            <Heart className="h-6 w-6 text-pink-500" />
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-pink-500" />
                <h2 className="text-xl font-semibold text-gray-800">Любимые Фото</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {favorites
                  .filter(item => item.type === 'photo')
                  .map(photo => (
                    <motion.div
                      key={photo.id}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => removeFromFavorites(photo.id)}
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full"
                      >
                        <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                      </motion.button>
                    </motion.div>
                  ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Music className="h-5 w-5 text-pink-500" />
                <h2 className="text-xl font-semibold text-gray-800">Любимые Песни</h2>
              </div>
              <div className="space-y-3">
                {favorites
                  .filter(item => item.type === 'music')
                  .map(song => (
                    <motion.div
                      key={song.id}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="text-gray-800">{song.title}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => removeFromFavorites(song.id)}
                      >
                        <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                      </motion.button>
                    </motion.div>
                  ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-xl p-6 md:col-span-2"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-pink-500" />
                <h2 className="text-xl font-semibold text-gray-800">Любимые Записи</h2>
              </div>
              <div className="space-y-4">
                {favorites
                  .filter(item => item.type === 'diary')
                  .map(entry => (
                    <motion.div
                      key={entry.id}
                      className="bg-white/50 rounded-lg p-4"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-500">{entry.date}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => removeFromFavorites(entry.id)}
                        >
                          <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                        </motion.button>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 