"use client"

import { useState } from "react"
import { Send, Plus, Trash2 } from "lucide-react"

interface Letter {
  id: string
  title: string
  content: string
  date: string
}

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) return

    const newLetter: Letter = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toLocaleDateString()
    }

    setLetters([newLetter, ...letters])
    setTitle("")
    setContent("")
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это письмо?')) {
      setLetters(letters.filter(letter => letter.id !== id))
    }
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-pink-500">
            Письма
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Написать письмо</span>
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl border border-pink-100">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Заголовок
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none"
                placeholder="Введите заголовок письма"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Содержание
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none min-h-[150px]"
                placeholder="Напишите ваше письмо здесь..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Отправить
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {letters.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Нет писем. Нажмите "Написать письмо", чтобы создать новое.
            </div>
          ) : (
            letters.map((letter) => (
              <div
                key={letter.id}
                className="p-6 rounded-xl border border-pink-100 hover:border-pink-200 transition-colors bg-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{letter.title}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{letter.date}</span>
                    <button
                      onClick={() => handleDelete(letter.id)}
                      className="text-red-500 hover:text-red-600 transition-colors p-1"
                      title="Удалить письмо"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">{letter.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}