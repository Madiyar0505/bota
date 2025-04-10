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
  const [searchQuery, setSearchQuery] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          searchQuery
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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50/20 dark:to-pink-950/20">
      <Navbar />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-500">Наша Музыка</h1>

        {/* Поиск */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Введите название песни..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-pink-200 dark:border-pink-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg flex items-center gap-2 text-lg"
            >
              <Search className="w-5 h-5" />
              Найти
            </button>
          </form>
        </div>

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