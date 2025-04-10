"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Heart } from "lucide-react"
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
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('video/'))
    if (files.length > 0) {
      await handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    setIsUploading(true)
    try {
      for (const file of files) {
        const reader = new FileReader()
        await new Promise<void>((resolve, reject) => {
          reader.onload = async (e) => {
            const result = e.target?.result
            if (result) {
              const newVideo = {
                id: Date.now() + Math.random(),
                url: result as string,
                title: file.name.split('.')[0],
                date: new Date().toLocaleDateString('ru-RU'),
                isFavorite: false
              }
              setVideos(prev => [...prev, newVideo])
              localStorage.setItem('videos', JSON.stringify([...videos, newVideo]))
              resolve()
            }
          }
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        })
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const toggleFavorite = (videoId: number) => {
    setVideos(prev => {
      const updated = prev.map(video => 
        video.id === videoId ? { ...video, isFavorite: !video.isFavorite } : video
      )
      localStorage.setItem('videos', JSON.stringify(updated))
      return updated
    })
  }

  const deleteVideo = (videoId: number) => {
    setVideos(prev => {
      const updated = prev.filter(video => video.id !== videoId)
      localStorage.setItem('videos', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50/20 dark:to-pink-950/20">
      <Sidebar />
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-pink-500">Видео</h1>

        <div className="max-w-4xl mx-auto">
          <div
            className={`mb-8 p-8 border-2 border-dashed rounded-xl transition-colors text-center
              ${isDragging 
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/20' 
                : 'border-gray-300 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
              }`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setIsDragging(false)
            }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : []
                if (files.length > 0) {
                  handleFiles(files)
                }
              }}
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-pink-500" />
              <p className="text-lg font-medium">
                {isUploading 
                  ? 'Загрузка...' 
                  : isDragging
                  ? 'Отпустите файлы здесь'
                  : 'Нажмите или перетащите видео сюда'}
              </p>
              <p className="text-sm text-gray-500">Поддерживаются MP4, WebM</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      onClick={() => toggleFavorite(video.id)}
                      className="p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart 
                        className={`h-5 w-5 transition-colors ${
                          video.isFavorite 
                            ? 'text-pink-500 fill-pink-500' 
                            : 'text-pink-500'
                        }`}
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