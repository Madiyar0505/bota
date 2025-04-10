"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Trash2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useVideo } from "@/context/VideoContext"

export default function VideoPage() {
  const { videos, addVideo, removeVideo, updateVideoTime } = useVideo()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  const handleDelete = (videoId: number) => {
    removeVideo(videoId)
    setShowDeleteConfirm(null)
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
              try {
                await addVideo({
                  id: Date.now() + Math.random(),
                  url: result as string,
                  title: file.name.split('.')[0],
                  date: new Date().toLocaleDateString('ru-RU'),
                  currentTime: 0
                })
                resolve()
              } catch (error) {
                reject(error)
              }
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('video/'))
    if (files.length > 0) {
      await handleFiles(files)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length > 0) {
      await handleFiles(files)
    }
    if (e.target) {
      e.target.value = ''
    }
  }

  const setVideoRef = (id: number) => (element: HTMLVideoElement | null) => {
    videoRefs.current[id] = element
  }

  const handleTimeUpdate = (videoId: number) => {
    const video = videoRefs.current[videoId]
    if (video) {
      updateVideoTime(videoId, video.currentTime)
    }
  }

  const handleVideoLoad = (videoId: number) => {
    const video = videoRefs.current[videoId]
    const savedVideo = videos.find(v => v.id === videoId)
    if (video && savedVideo?.currentTime) {
      video.currentTime = savedVideo.currentTime
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50/20 dark:to-pink-950/20">
      <Navbar />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-500">Видео Воспоминания</h1>

        <div className="max-w-md mx-auto">
          <div
            className={`mb-6 p-6 border-2 border-dashed rounded-xl transition-colors text-center
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
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
          >
            <input
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-pink-500" />
              <p className="text-base font-medium">
                {isUploading 
                  ? 'Загрузка...' 
                  : isDragging
                  ? 'Отпустите файлы здесь'
                  : 'Нажмите или перетащите видео сюда'}
              </p>
              <p className="text-xs text-gray-500">Поддерживаются MP4, WebM</p>
            </div>
          </div>

          <div className="grid gap-4">
            <AnimatePresence>
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md"
                >
                  <div className="aspect-[9/16] relative">
                    <video
                      ref={setVideoRef(video.id)}
                      src={video.url}
                      className="w-full h-full object-contain bg-black"
                      controls
                      controlsList="nodownload"
                      playsInline
                      onTimeUpdate={() => handleTimeUpdate(video.id)}
                      onLoadedData={() => handleVideoLoad(video.id)}
                    />
                    {showDeleteConfirm === video.id && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center">
                          <p className="text-sm mb-3">Удалить это видео?</p>
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleDelete(video.id)}
                              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Удалить
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-500">{video.date}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowDeleteConfirm(video.id)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
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