"use client"

import { useState, useEffect } from 'react'

const phrases = [
  "console.log('Сәлем, Әлем! 👋');",
  "function botaApp() { return '💝'; }",
  "const күнделік = ['Естеліктер', 'Сағыныш'];",
  "let бақыт = өмір.map(күн => күн + '✨');",
  "async function махаббат() { ... }",
  "import { Жүрек } from '@/бақыт';",
  "export default Естеліктер; 🌸",
]

export function TypingEffect() {
  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const typingDelay = 100 // жазу жылдамдығы
    const deletingDelay = 50 // өшіру жылдамдығы
    const pauseDelay = 2000 // келесі фразаға өту алдындағы пауза

    const type = () => {
      const currentPhrase = phrases[phraseIndex]

      if (isDeleting) {
        // Өшіру
        setText(currentPhrase.substring(0, charIndex - 1))
        setCharIndex(prev => prev - 1)

        if (charIndex === 0) {
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
        }
      } else {
        // Жазу
        setText(currentPhrase.substring(0, charIndex + 1))
        setCharIndex(prev => prev + 1)

        if (charIndex === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), pauseDelay)
          return
        }
      }
    }

    const timer = setTimeout(
      type,
      isDeleting ? deletingDelay : typingDelay
    )

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, phraseIndex])

  return (
    <div className="font-mono text-sm sm:text-base md:text-lg bg-gray-900 text-pink-500 p-4 rounded-lg shadow-lg">
      <pre className="whitespace-pre-wrap">
        <code>{text}</code>
        <span className="animate-blink">|</span>
      </pre>
    </div>
  )
} 