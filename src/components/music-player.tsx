"use client"

import { useState, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"

interface Song {
  id: number
  title: string
  artist: string
  url: string
}

interface MusicPlayerProps {
  songs: Song[]
}

export function MusicPlayer({ songs }: MusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentSong = songs[currentSongIndex]

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const playPrevious = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1))
  }

  const playNext = () => {
    setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-pink-200 dark:border-pink-800 p-4 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-pink-600 dark:text-pink-400">{currentSong.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{currentSong.artist}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={playPrevious}
            className="p-2 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors"
          >
            <SkipBack className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </button>
          
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
          
          <button
            onClick={playNext}
            className="p-2 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors"
          >
            <SkipForward className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </button>

          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <input
              type="range"
              min="0"
              max="100"
              className="w-24 accent-pink-500"
              onChange={(e) => {
                if (audioRef.current) {
                  audioRef.current.volume = Number(e.target.value) / 100
                }
              }}
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentSong.url}
        onEnded={playNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  )
} 