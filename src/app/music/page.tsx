"use client"

import { Navbar } from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { Search, Play, Pause, Volume2 } from "lucide-react"

interface Song {
  id: number
  title: string
  youtubeId: string
}

export default function MusicPage() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query
        )}&type=video&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&maxResults=1`
      )

      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const video = data.items[0]
        setCurrentSong({
          id: Date.now(),
          title: video.snippet.title,
          youtubeId: video.id.videoId
        })
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Ошибка при поиске:", error)
    }
  }

  const searchMusic = async () => {
    if (!query) return
    
    setIsLoading(true)
    setError('')
    setResults([])

    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
      if (!apiKey) {
        throw new Error('YouTube API key is not configured')
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch results from YouTube')
      }

      const data = await response.json()
      console.log('Search results:', data)
      
      if (!data.items || data.items.length === 0) {
        throw new Error('No results found')
      }
      
      setResults(data.items)
    } catch (err) {
      console.error('Error searching videos:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while searching')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="min-h-screen w-full">
      {/* Main content */}
      <div className="pb-24 px-4 sm:px-6 md:pl-[280px]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-500 mb-4 sm:mb-6 pt-4">
          Наша Музыка
        </h1>

        {/* Search section */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-3 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchMusic()}
            placeholder="Найти музыку..."
            className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none text-base"
          />
          <button
            onClick={searchMusic}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span>Найти</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 mb-4 text-center text-sm sm:text-base">{error}</div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="text-center text-gray-500 py-8">Загрузка...</div>
        )}

        {/* Results grid */}
        {!isLoading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((video: any) => (
              <div
                key={video.id.videoId}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-pink-100 hover:border-pink-200 transition-colors bg-white"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-40 h-48 sm:h-24 flex-shrink-0">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                {/* Video info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-base sm:text-lg mb-2 line-clamp-2">
                    {video.snippet.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2">
                    {video.snippet.channelTitle}
                  </p>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-pink-500 hover:text-pink-600 transition-colors text-sm sm:text-base"
                  >
                    Смотреть на YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed bottom player */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-200 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Song info */}
            <div className="flex-1 min-w-0">
              {currentSong ? (
                <h3 className="text-base font-medium text-pink-600 truncate">
                  {currentSong.title}
                </h3>
              ) : (
                <p className="text-sm text-gray-500">
                  Найдите песню для воспроизведения
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors"
                disabled={!currentSong}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 