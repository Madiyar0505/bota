"use client"

import { useState } from "react"

export default function LettersPage() {
  const [letters, setLetters] = useState([])

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-pink-500 mb-6 text-center">
          Письма
        </h1>

        <div className="max-w-xl mx-auto">
          <div className="text-center text-gray-500">
            Нет писем
          </div>
        </div>
      </div>
    </div>
  )
}