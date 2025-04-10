"use client"

import { useState } from "react"
import { Search } from "lucide-react"

export default function MusicPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-pink-500 mb-6 text-center">
          Наша Музыка
        </h1>

        <div className="max-w-xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchMusic()}
              placeholder="Найти музыку..."
              className="flex-1 px-4 py-2 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none text-base"
            />
            <button
              onClick={searchMusic}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Найти</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 mb-6 text-center text-sm">{error}</div>
        )}

        {isLoading && (
          <div className="text-center text-gray-500 py-8">Загрузка...</div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((video: any) => (
              <div
                key={video.id.videoId}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-pink-100 hover:border-pink-200 transition-colors bg-white"
              >
                <div className="w-full sm:w-40 h-48 sm:h-24 flex-shrink-0">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
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
                    className="inline-block text-pink-500 hover:text-pink-600 transition-colors text-sm"
                  >
                    Смотреть на YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 