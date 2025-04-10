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
    <div className="min-h-screen w-full px-4 md:pl-[280px] py-6">
      <Navbar />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <main className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-pink-500 mb-6">
          Наша Музыка
        </h1>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchMusic()}
              placeholder="Найти музыку..."
              className="w-full px-4 py-2 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none text-base"
            />
          </div>
          <button
            onClick={searchMusic}
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Найти
          </button>
        </div>

        {error && (
          <div className="text-red-500 mb-4 text-center text-sm md:text-base">{error}</div>
        )}

        {/* Текущая песня */}
        {currentSong && (
          <div className="max-w-3xl mx-auto">
            <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h3 className="text-lg font-medium text-pink-600 dark:text-pink-400 mt-4">
              {currentSong.title}
            </h3>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-gray-500">Загрузка...</div>
        ) : (
          <div className="grid gap-4">
            {results.map((video: any) => (
              <div
                key={video.id.videoId}
                className="flex flex-col md:flex-row gap-3 p-3 md:p-4 rounded-xl border border-pink-100 hover:border-pink-200 transition-colors"
              >
                <div className="w-full md:w-40">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full md:w-40 h-48 md:h-24 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-base md:text-lg mb-2">{video.snippet.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm">{video.snippet.channelTitle}</p>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-pink-500 hover:text-pink-600 transition-colors text-sm md:text-base"
                  >
                    Смотреть на YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Фиксированный плеер внизу */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-pink-200 dark:border-pink-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Информация о песне */}
            <div className="flex-1 min-w-0">
              {currentSong ? (
                <div>
                  <h3 className="text-lg font-medium text-pink-600 dark:text-pink-400 truncate">
                    {currentSong.title}
                  </h3>
                </div>
              ) : (
                <p className="text-gray-500">Найдите песню для воспроизведения</p>
              )}
            </div>

            {/* Контролы */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className="p-3 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors"
                disabled={!currentSong}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="100"
                  className="w-24 accent-pink-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 