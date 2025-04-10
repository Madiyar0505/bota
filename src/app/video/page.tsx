"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sidebar } from "@/components/sidebar"

interface Video {
  id: number
  url: string
  title: string
  date: string
  isFavorite?: boolean
}

interface FavoriteItem {
  id: string
  type: string
  title: string
  url: string
  date: string
}

export default function VideoPage() {
  const [videos, setVideos] = useState<Video[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('videos')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]') as FavoriteItem[]
    const updatedVideos = videos.map(video => ({
      ...video,
      isFavorite: favorites.some(item => 
        item.type === 'video' && item.id === video.id.toString()
      )
    }))
    setVideos(updatedVideos)
  }, [])

  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(videos))
  }, [videos])

  const toggleFavorite = (video: Video) => {
    const updatedVideos = videos.map(v => 
      v.id === video.id ? { ...v, isFavorite: !v.isFavorite } : v
    )
    setVideos(updatedVideos)

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]') as FavoriteItem[]
    const videoExists = favorites.some(item => 
      item.type === 'video' && item.id === video.id.toString()
    )

    let updatedFavorites: FavoriteItem[]
    if (videoExists) {
      updatedFavorites = favorites.filter(item => 
        !(item.type === 'video' && item.id === video.id.toString())
      )
    } else {
      updatedFavorites = [...favorites, {
        id: video.id.toString(),
        type: 'video',
        title: video.title,
        url: video.url,
        date: video.date
      }]
    }
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }

  const deleteVideo = (videoId: number) => {
    setVideos(prev => prev.filter(v => v.id !== videoId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50/20 dark:to-pink-950/20">
      <Sidebar />
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-pink-500">Видео</h1>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group"
                >
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <video
                      src={video.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(video)}
                      className="p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart 
                        className={`h-5 w-5 text-pink-500 transition-colors ${video.isFavorite ? 'fill-pink-500' : ''}`}
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteVideo(video.id)}
                      className="p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-5 w-5 text-pink-500" />
                    </motion.button>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.date}</p>
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