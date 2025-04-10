"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Heart, Home, Image, Video, BookOpen, Mail, Music, Search, Bookmark } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

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

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-card border-r border-border">
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-card-foreground">Акбота</h1>
        </div>
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-2">
            {routes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    pathname === route.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex-1 flex items-center justify-center">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90"
              >
                Выйти
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              Войти через Google
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 