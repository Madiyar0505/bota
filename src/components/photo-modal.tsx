"use client"

import { X, ChevronLeft, ChevronRight, Download, Heart } from "lucide-react"

interface Photo {
  id: number
  url: string
  title: string
  date: string
}

interface PhotoModalProps {
  photo: Photo | null
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export function PhotoModal({ photo, onClose, onPrevious, onNext }: PhotoModalProps) {
  if (!photo) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative max-w-5xl w-full bg-white dark:bg-pink-950 rounded-lg shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="relative aspect-[4/3] rounded-t-lg overflow-hidden">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-contain"
            />
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-pink-900 dark:text-pink-100">
                  {photo.title}
                </h2>
                <p className="text-pink-600 dark:text-pink-400">{photo.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors">
                  <Heart className="w-5 h-5 text-pink-500" />
                </button>
                <button className="p-2 rounded-full bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors">
                  <Download className="w-5 h-5 text-pink-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 