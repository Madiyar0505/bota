"use client"

import { createContext, useState, useContext, useEffect } from "react"

interface Video {
  id: number
  url: string
  title: string
  date: string
  currentTime?: number
}

interface VideoContextType {
  videos: Video[]
  addVideo: (video: Video) => void
  removeVideo: (id: number) => void
  updateVideoTime: (id: number, time: number) => void
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('VideoDatabase', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos', { keyPath: 'id' })
      }
    }
  })
}

const getAllVideos = async () => {
  const db = await openDB()
  return new Promise<Video[]>((resolve, reject) => {
    const transaction = db.transaction(['videos'], 'readonly')
    const store = transaction.objectStore('videos')
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

const saveVideo = async (video: Video) => {
  const db = await openDB()
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(['videos'], 'readwrite')
    const store = transaction.objectStore('videos')
    const request = store.put(video)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

const deleteVideo = async (id: number) => {
  const db = await openDB()
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(['videos'], 'readwrite')
    const store = transaction.objectStore('videos')
    const request = store.delete(id)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([])

  // Load videos from IndexedDB on mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const savedVideos = await getAllVideos()
        setVideos(savedVideos)
      } catch (error) {
        console.error('Error loading videos:', error)
      }
    }
    loadVideos()
  }, [])

  const addVideo = async (video: Video) => {
    try {
      await saveVideo(video)
      setVideos(prev => [...prev, video])
    } catch (error) {
      console.error('Error saving video:', error)
    }
  }

  const removeVideo = async (id: number) => {
    try {
      await deleteVideo(id)
      setVideos(prev => prev.filter(video => video.id !== id))
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  }

  const updateVideoTime = async (id: number, time: number) => {
    try {
      const videoToUpdate = videos.find(v => v.id === id)
      if (videoToUpdate) {
        const updatedVideo = { ...videoToUpdate, currentTime: time }
        await saveVideo(updatedVideo)
        setVideos(prev => 
          prev.map(video => 
            video.id === id 
              ? updatedVideo
              : video
          )
        )
      }
    } catch (error) {
      console.error('Error updating video time:', error)
    }
  }

  return (
    <VideoContext.Provider value={{ videos, addVideo, removeVideo, updateVideoTime }}>
      {children}
    </VideoContext.Provider>
  )
}

export function useVideo() {
  const context = useContext(VideoContext)
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider')
  }
  return context
} 