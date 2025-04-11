"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { ThemeToggle } from "@/components/theme-toggle"
import { Sidebar } from "@/components/sidebar"

export default function VideoPage() {
  const [videos, setVideos] = useState<File[]>([])
  const [error, setError] = useState<string>("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validVideos = acceptedFiles.filter(file => 
      file.type === 'video/mp4' || file.type === 'video/webm'
    )

    if (validVideos.length !== acceptedFiles.length) {
      setError("Поддерживаются только MP4 и WebM форматы")
      return
    }

    setError("")
    setVideos(prev => [...prev, ...validVideos])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm']
    }
  })

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50/20 dark:to-pink-950/20">
      <Sidebar />
      
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-500">Видео</h1>

        <div className="max-w-4xl mx-auto">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/10' 
                : 'border-gray-300 hover:border-pink-500'}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-pink-500" />
            <p className="text-lg mb-2">
              {isDragActive
                ? "Перетащите видео сюда"
                : "Нажмите или перетащите видео сюда"}
            </p>
            <p className="text-sm text-gray-500">Поддерживаются MP4, WebM</p>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/10 text-red-500 rounded-lg">
              {error}
            </div>
          )}

          {videos.length > 0 && (
            <div className="mt-8 space-y-4">
              {videos.map((video, index) => (
                <div 
                  key={`${video.name}-${index}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                  <video 
                    className="w-full aspect-video"
                    controls
                    src={URL.createObjectURL(video)}
                  />
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {video.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {(video.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => removeVideo(index)}
                      className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-lg transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 