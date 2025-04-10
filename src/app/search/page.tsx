"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Mail, Image, Book, Heart, ChevronRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: string
  type: 'letter' | 'photo' | 'diary'
  title: string
  content?: string
  url?: string
  date: string
  isFavorite: boolean
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['letter', 'photo', 'diary']))
  const router = useRouter()

  useEffect(() => {
    const searchContent = () => {
      const allContent: SearchResult[] = []
      
      // Search in letters
      if (selectedTypes.has('letter')) {
        const letters = JSON.parse(localStorage.getItem('letters') || '[]')
        const matchedLetters = letters.filter((letter: any) => 
          letter.title.toLowerCase().includes(query.toLowerCase()) ||
          letter.content.toLowerCase().includes(query.toLowerCase())
        ).map((letter: any) => ({
          id: letter.id.toString(),
          type: 'letter' as const,
          title: letter.title,
          content: letter.content,
          date: letter.date,
          isFavorite: letter.isFavorite || false
        }))
        allContent.push(...matchedLetters)
      }

      // Search in photos
      if (selectedTypes.has('photo')) {
        const photos = JSON.parse(localStorage.getItem('gallery-photos') || '[]')
        const matchedPhotos = photos.filter((photo: any) =>
          photo.title.toLowerCase().includes(query.toLowerCase())
        ).map((photo: any) => ({
          id: photo.id.toString(),
          type: 'photo' as const,
          title: photo.title,
          url: photo.url,
          date: photo.date,
          isFavorite: photo.isFavorite || false
        }))
        allContent.push(...matchedPhotos)
      }

      // Search in diary entries
      if (selectedTypes.has('diary')) {
        const entries = JSON.parse(localStorage.getItem('diary-entries') || '[]')
        const matchedEntries = entries.filter((entry: any) =>
          entry.content.toLowerCase().includes(query.toLowerCase())
        ).map((entry: any) => ({
          id: entry.id.toString(),
          type: 'diary' as const,
          title: new Date(entry.date).toLocaleDateString('ru-RU'),
          content: entry.content,
          date: entry.date,
          isFavorite: entry.isFavorite || false
        }))
        allContent.push(...matchedEntries)
      }

      setResults(allContent)
    }

    if (query) {
      searchContent()
    } else {
      setResults([])
    }
  }, [query, selectedTypes])

  const toggleType = (type: string) => {
    const newTypes = new Set(selectedTypes)
    if (newTypes.has(type)) {
      newTypes.delete(type)
    } else {
      newTypes.add(type)
    }
    setSelectedTypes(newTypes)
  }

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'letter':
        router.push('/letters')
        break
      case 'photo':
        router.push('/gallery')
        break
      case 'diary':
        router.push('/diary')
        break
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'letter':
        return <Mail className="w-5 h-5" />
      case 'photo':
        return <Image className="w-5 h-5" />
      case 'diary':
        return <Book className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50/20 dark:to-pink-950/20">
      <Navbar />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-pink-500">Поиск</h1>

        <div className="max-w-4xl mx-auto">
          <div className="relative mb-8">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Искать воспоминания и информацию..."
              className="w-full p-4 pl-12 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                focus:border-pink-500 dark:focus:border-pink-500 outline-none bg-white dark:bg-gray-800
                text-gray-800 dark:text-gray-200"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <div className="flex gap-2 mb-6">
            {['letter', 'photo', 'diary'].map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                  ${selectedTypes.has(type)
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {getIcon(type)}
                <span className="capitalize">
                  {type === 'letter' ? 'Письма' : type === 'photo' ? 'Фото' : 'Дневник'}
                </span>
              </button>
            ))}
          </div>

          {query && results.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Ничего не найдено
            </div>
          ) : !query ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-medium mb-4">Советы по поиску:</h2>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Используйте конкретные слова для более точных результатов</li>
                <li>• Можно искать по дате или периоду</li>
                <li>• Используйте фильтры для уточнения поиска</li>
                <li>• Поиск работает по всем типам контента</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {results.map((result) => (
                  <motion.div
                    key={`${result.type}-${result.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg cursor-pointer
                      hover:shadow-xl transition-shadow"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        result.type === 'letter' ? 'bg-blue-50 dark:bg-blue-900/20' :
                        result.type === 'photo' ? 'bg-green-50 dark:bg-green-900/20' :
                        'bg-purple-50 dark:bg-purple-900/20'
                      }`}>
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-medium truncate">{result.title}</h3>
                          <p className="text-sm text-gray-500 ml-4">{result.date}</p>
                        </div>
                        {result.content && (
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                            {result.content}
                          </p>
                        )}
                        {result.url && (
                          <div className="mt-2 aspect-[4/3] w-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img src={result.url} alt={result.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 