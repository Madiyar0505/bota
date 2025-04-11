"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
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
  const [isMobile, setIsMobile] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)

  useEffect(() => {
    try {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768)
      }
      
      checkMobile()
      window.addEventListener('resize', checkMobile)
      
      return () => window.removeEventListener('resize', checkMobile)
    } catch (err) {
      console.error('Mobile check error:', err)
    }
  }, [])

  // Reset video error when changing tracks
  useEffect(() => {
    setIsVideoError(false)
  }, [currentTrack])

  const searchMusic = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError("")
    setIsVideoError(false)
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
      
      if (!apiKey) {
        throw new Error('YouTube API key is not configured')
      }

      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`
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

  const handleVideoError = () => {
    setIsVideoError(true)
    if (currentTrack) {
      const nextTrack = results.find(result => result.id !== currentTrack.id)
      if (nextTrack) {
        setCurrentTrack(nextTrack)
      }
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Произошла ошибка</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => setError("")}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50/20 dark:to-pink-950/20">
      <Sidebar />
      
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-500">Музыка</h1>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
              className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 sm:w-auto w-full"
            >
              {isLoading ? 'Поиск...' : 'Найти'}
            </button>
          </div>

          {currentTrack && !isVideoError && (
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${currentTrack.id}?autoplay=1&playsinline=1`}
                  title={currentTrack.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                  onError={handleVideoError}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {currentTrack.title}
                </h3>
                <p className="text-sm text-gray-500">{currentTrack.channelTitle}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => setCurrentTrack(result)}
                className="cursor-pointer group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <div className="h-12 w-12 flex items-center justify-center bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-pink-500 border-b-8 border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-pink-500 transition-colors">
                    {result.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {result.channelTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 