"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search as SearchIcon, Mail, Image, BookOpen } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sidebar } from "@/components/sidebar"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const filters = [
    { id: "letters", label: "Письма", icon: Mail },
    { id: "photos", label: "Фото", icon: Image },
    { id: "diary", label: "Дневник", icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50/20 dark:to-pink-950/20">
      <Sidebar />
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-pink-500">Поиск</h1>

        <div className="max-w-2xl mx-auto">
          <div className="relative mb-8">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Искать воспоминания и информацию..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-pink-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white dark:bg-gray-800 dark:border-pink-900 dark:focus:border-pink-700"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex gap-3 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  activeFilter === filter.id
                    ? "bg-pink-500 text-white"
                    : "bg-white hover:bg-pink-50 text-gray-600 hover:text-pink-500 dark:bg-gray-800 dark:hover:bg-gray-700"
                }`}
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </button>
            ))}
          </div>

          {query && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Советы по поиску:
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Используйте конкретные слова для более точных результатов</li>
                  <li>Можно искать по дате или периоду</li>
                  <li>Используйте фильтры для уточнения поиска</li>
                  <li>Поиск работает по всем типам контента</li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
} 