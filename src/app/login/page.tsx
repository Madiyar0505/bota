"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import Cookies from "js-cookie"

const CORRECT_PASSWORD = "akbota2024" // Құпия сөзді өзгертіңіз

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(false)

    if (password === CORRECT_PASSWORD) {
      Cookies.set('auth', 'true', { expires: 30 }) // 30 күнге сақтау
      router.push('/')
    } else {
      setError(true)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-pink-950 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-pink-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Добро пожаловать
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
              Введите пароль, чтобы получить доступ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-transparent
                    ${error 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700'
                    }
                    focus:border-pink-500 dark:focus:border-pink-500 outline-none
                    text-gray-900 dark:text-white`}
                  placeholder="Введите пароль"
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-2"
                >
                  Неверный пароль
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Проверка..." : "Войти"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          Это личный сайт. Доступ только для Акботы ❤️
        </p>
      </motion.div>
    </div>
  )
} 