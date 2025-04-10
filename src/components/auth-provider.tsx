"use client"

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const authCookie = Cookies.get('auth')
    const isAuthenticated = authCookie === 'true'
    const isLoginPage = pathname === '/login'

    if (!isAuthenticated && !isLoginPage) {
      router.push('/login')
    }
  }, [pathname])

  return <>{children}</>
}