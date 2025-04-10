"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Home, Image, Video, BookOpen, Mail, Music, Search, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Главная",
    icon: Home,
    href: "/",
  },
  {
    label: "Галерея",
    icon: Image,
    href: "/gallery",
  },
  {
    label: "Видео",
    icon: Video,
    href: "/video",
  },
  {
    label: "Дневник",
    icon: BookOpen,
    href: "/diary",
  },
  {
    label: "Письма",
    icon: Mail,
    href: "/letters",
  },
  {
    label: "Музыка",
    icon: Music,
    href: "/music",
  },
  {
    label: "Поиск",
    icon: Search,
    href: "/search",
  },
  {
    label: "Избранное",
    icon: Bookmark,
    href: "/favorites",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-[240px] bg-white border-r border-pink-100">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-200 rounded-full blur-md opacity-50"></div>
            <Heart className="h-6 w-6 text-pink-500 relative z-10" />
          </div>
          <h1 className="text-xl font-semibold text-pink-600">Акбота</h1>
        </div>
      </div>

      <nav className="px-3 mt-4">
        {routes.map((route) => (
          <div
            key={route.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 my-1 rounded-xl text-[15px]",
              pathname === route.href
                ? "bg-pink-50 text-pink-600 font-medium"
                : "text-gray-600"
            )}
          >
            <route.icon className={cn(
              "h-5 w-5",
              pathname === route.href
                ? "text-pink-500"
                : "text-gray-400"
            )} />
            {route.label}
          </div>
        ))}
      </nav>

      <div className="absolute bottom-8 left-0 right-0 px-6">
        <div className="w-full bg-pink-500 text-white py-2.5 rounded-xl font-medium text-[15px] text-center">
          Войти через Google
        </div>
      </div>
    </div>
  )
} 