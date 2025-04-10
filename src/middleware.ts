import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Тексеру керек емес беттер
  const publicPaths = ['/login']
  
  // Қазіргі бет
  const currentPath = request.nextUrl.pathname

  // Аутентификация куки тексеру
  const authCookie = request.cookies.get('auth')?.value
  const isAuthenticated = authCookie === 'true'

  // Егер login бетінде емес болса және аутентификация жоқ болса
  if (!publicPaths.includes(currentPath) && !isAuthenticated) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  // Егер login бетінде болса және аутентификация бар болса
  if (currentPath === '/login' && isAuthenticated) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Барлық беттерге middleware қолдану
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 