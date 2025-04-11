"use client"

import { useState, useRef } from "react"
import { Search, Play, Pause, Volume2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sidebar } from "@/components/sidebar"

interface SearchResult {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
}

export default function MusicPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentTrack, setCurrentTrack] = useState<SearchResult | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const searchMusic = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError("")
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
      
      if (!apiKey) {
        throw new Error('YouTube API key is not configured')
      }

      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch results')
      }

      const data = await response.json()
      
      if (!data.items || data.items.length === 0) {
        setError("По вашему запросу ничего не найдено")
        setResults([])
        return
      }
      
      const formattedResults = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle
      }))

      setResults(formattedResults)
      // Автоматически начинаем воспроизведение первого трека
      if (formattedResults.length > 0) {
        setCurrentTrack(formattedResults[0])
      }
    } catch (err) {
      console.error('Search error:', err)
      if (err instanceof Error && err.message === 'YouTube API key is not configured') {
        setError("API ключ не настроен. Пожалуйста, обратитесь к администратору.")
      } else {
        setError("Ошибка при поиске музыки. Пожалуйста, попробуйте позже.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const playTrack = (track: SearchResult) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.src = `https://www.youtube.com/embed/${track.id}`
      audioRef.current.play()
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50/20 dark:to-pink-950/20">
      <Sidebar />
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-pink-500">Музыка</h1>

        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchMusic()}
                placeholder="Поиск музыки..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-pink-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={searchMusic}
              disabled={isLoading}
              className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Поиск...' : 'Найти'}
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-center mb-8">
              {error}
            </div>
          )}

          {/* Текущий трек */}
          {currentTrack && (
            <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="flex items-center gap-4">
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {currentTrack.title}
                  </h3>
                  <p className="text-sm text-gray-500">{currentTrack.channelTitle}</p>
                </div>
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="h-6 w-6 text-white" />
                  )}
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full accent-pink-500"
                  onChange={(e) => {
                    if (audioRef.current) {
                      audioRef.current.volume = Number(e.target.value) / 100
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Список рекомендаций */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => playTrack(result)}
                className="cursor-pointer group"
              >
                <div className="aspect-video rounded-xl overflow-hidden mb-3 relative">
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-pink-500 transition-colors">
                  {result.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {result.channelTitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <audio ref={audioRef} className="hidden" controls />
    </div>
  )
} 