"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Home, Image, Video, BookOpen, Mail, Music, Search, Bookmark, Menu, X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Главная",
    icon: Home,
    href: "/",
    submenu: []
  },
  {
    label: "Галерея",
    icon: Image,
    href: "/gallery",
    submenu: ["Все фото", "Альбомы", "Избранное"]
  },
  {
    label: "Видео",
    icon: Video,
    href: "/video",
    submenu: ["Все видео", "Плейлисты"]
  },
  {
    label: "Дневник",
    icon: BookOpen,
    href: "/diary",
    submenu: ["Все записи", "Избранное"]
  },
  {
    label: "Письма",
    icon: Mail,
    href: "/letters",
    submenu: ["Входящие", "Отправленные"]
  },
  {
    label: "Музыка",
    icon: Music,
    href: "/music",
    submenu: ["Все треки", "Плейлисты"]
  },
  {
    label: "Поиск",
    icon: Search,
    href: "/search",
    submenu: []
  },
  {
    label: "Избранное",
    icon: Bookmark,
    href: "/favorites",
    submenu: []
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleSubmenu = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-full bg-white shadow-md"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-pink-500" />
        ) : (
          <Menu className="h-6 w-6 text-pink-500" />
        )}
      </button>

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-pink-100 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-200 rounded-full blur-md opacity-50"></div>
              <Heart className="h-6 w-6 text-pink-500 relative z-10" />
            </div>
            <h1 className="text-xl font-semibold text-pink-600">Акбота</h1>
          </Link>
        </div>

        <nav className="px-3 mt-4">
          {routes.map((route) => (
            <div key={route.href}>
              <button
                onClick={() => {
                  if (route.submenu.length > 0) {
                    toggleSubmenu(route.href)
                  } else {
                    window.location.href = route.href
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 my-1 rounded-xl text-[15px] transition-colors",
                  pathname === route.href
                    ? "bg-pink-50 text-pink-600 font-medium"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <route.icon className={cn(
                    "h-5 w-5",
                    pathname === route.href
                      ? "text-pink-500"
                      : "text-gray-400"
                  )} />
                  {route.label}
                </div>
                {route.submenu.length > 0 && (
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    expandedItems.includes(route.href) ? "rotate-90" : ""
                  )} />
                )}
              </button>
              
              {/* Submenu */}
              {route.submenu.length > 0 && (
                <div className={cn(
                  "overflow-hidden transition-all duration-200 pl-12",
                  expandedItems.includes(route.href) 
                    ? "max-h-40 opacity-100" 
                    : "max-h-0 opacity-0"
                )}>
                  {route.submenu.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => window.location.href = `${route.href}/${item.toLowerCase().replace(" ", "-")}`}
                      className="w-full text-left py-2 text-[14px] text-gray-600 hover:text-pink-600 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 right-0 px-6">
          <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2.5 rounded-xl font-medium text-[15px] transition-colors">
            Войти через Google
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 