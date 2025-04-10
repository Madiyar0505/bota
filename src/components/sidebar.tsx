"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { href: "/", label: "Главная", icon: "🏠" },
    { href: "/gallery", label: "Галерея", icon: "🖼️" },
    { href: "/video", label: "Видео", icon: "🎥" },
    { href: "/diary", label: "Дневник", icon: "📖" },
    { href: "/letters", label: "Письма", icon: "✉️" },
    { href: "/music", label: "Музыка", icon: "🎵" },
    { href: "/search", label: "Поиск", icon: "🔍" },
    { href: "/favorites", label: "Избранное", icon: "⭐" },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
      >
        <Menu className="h-6 w-6 text-pink-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40"
            >
              <div className="p-6">
                <h1 className="text-2xl font-bold text-pink-500 mb-6">Акбота</h1>
                <nav className="space-y-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        pathname === item.href
                          ? "bg-pink-50 text-pink-500"
                          : "text-gray-600 hover:text-pink-500 hover:bg-pink-50"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 