"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Upload, X, ZoomIn, ArrowLeft, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"

interface Photo {
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

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gallery-photos')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]') as FavoriteItem[]
    const updatedPhotos = photos.map(photo => ({
      ...photo,
      isFavorite: favorites.some(item => 
        item.type === 'photo' && item.id === photo.id.toString()
      )
    }))
    setPhotos(updatedPhotos)
  }, [])

  useEffect(() => {
    localStorage.setItem('gallery-photos', JSON.stringify(photos))
  }, [photos])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    await handleFiles(files)
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    await handleFiles(files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFiles = async (files: File[]) => {
    setIsUploading(true)
    try {
      const newPhotos = await Promise.all(
        files.map(async (file) => {
          const reader = new FileReader()
          return new Promise<Photo>((resolve) => {
            reader.onload = (e) => {
              resolve({
                id: Date.now() + Math.random(),
                url: e.target?.result as string,
                title: file.name.split('.')[0],
                date: new Date().toLocaleDateString('ru-RU'),
                isFavorite: false
              })
            }
            reader.readAsDataURL(file)
          })
        })
      )
      setPhotos(prev => [...newPhotos, ...prev])
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const toggleFavorite = (photo: Photo) => {
    const updatedPhotos = photos.map(p => 
      p.id === photo.id ? { ...p, isFavorite: !p.isFavorite } : p
    )
    setPhotos(updatedPhotos)

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]') as FavoriteItem[]
    const photoExists = favorites.some(item => 
      item.type === 'photo' && item.id === photo.id.toString()
    )

    let updatedFavorites: FavoriteItem[]
    if (photoExists) {
      updatedFavorites = favorites.filter(item => 
        !(item.type === 'photo' && item.id === photo.id.toString())
      )
    } else {
      updatedFavorites = [...favorites, {
        id: photo.id.toString(),
        type: 'photo',
        title: photo.title,
        url: photo.url,
        date: photo.date
      }]
    }
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }

  const deletePhoto = (photoId: number) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId))
  }

  const openPhotoModal = (photo: Photo) => {
    setSelectedPhoto(photo)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
  }

  const showNextPhoto = () => {
    if (!selectedPhoto) return
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id)
    if (currentIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentIndex + 1])
    }
  }

  const showPreviousPhoto = () => {
    if (!selectedPhoto) return
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id)
    if (currentIndex > 0) {
      setSelectedPhoto(photos[currentIndex - 1])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50/20 dark:to-pink-950/20">
      <Navbar />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-pink-500">Галерея</h1>

        <div
          className={`mb-8 p-8 border-2 border-dashed rounded-xl transition-colors text-center max-w-2xl mx-auto
            ${isDragging 
              ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/20' 
              : 'border-gray-300 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-pink-500" />
            <p className="text-lg font-medium">
              {isUploading 
                ? 'Загрузка...' 
                : isDragging
                ? 'Отпустите файлы здесь'
                : 'Нажмите или перетащите фотографии сюда'}
            </p>
            <p className="text-sm text-gray-500">Поддерживаются JPG, PNG, GIF</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <AnimatePresence>
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group w-full max-w-sm"
                >
                  <div 
                    className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                    onClick={() => openPhotoModal(photo)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(photo)
                      }}
                      className="p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart 
                        className={`h-5 w-5 text-pink-500 transition-colors ${photo.isFavorite ? 'fill-pink-500' : ''}`}
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePhoto(photo.id)
                      }}
                      className="p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-5 w-5 text-pink-500" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openPhotoModal(photo)}
                    className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ZoomIn className="h-5 w-5 text-pink-500" />
                  </motion.button>
                  <div className="mt-2">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{photo.title}</h3>
                    <p className="text-sm text-gray-500">{photo.date}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            onClick={closePhotoModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={closePhotoModal}
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white"
              >
                <X className="h-6 w-6 text-gray-800" />
              </button>
              <div className="absolute left-4 right-4 bottom-4 flex justify-between">
                <button
                  onClick={showPreviousPhoto}
                  className="p-2 bg-white/80 rounded-full hover:bg-white disabled:opacity-50"
                  disabled={photos.findIndex(p => p.id === selectedPhoto.id) === 0}
                >
                  <ArrowLeft className="h-6 w-6 text-gray-800" />
                </button>
                <button
                  onClick={showNextPhoto}
                  className="p-2 bg-white/80 rounded-full hover:bg-white disabled:opacity-50"
                  disabled={photos.findIndex(p => p.id === selectedPhoto.id) === photos.length - 1}
                >
                  <ArrowRight className="h-6 w-6 text-gray-800" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 