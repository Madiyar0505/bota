"use client"

import { motion } from "framer-motion"
import { Heart, Sparkles } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sidebar } from "@/components/sidebar"
import { TypingEffect } from "@/components/typing-effect"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <Sidebar />
      <main className="flex-1 ml-[240px] p-8">
        <div className="max-w-4xl mx-auto mt-12">
          <div className="glass-effect rounded-2xl p-12 text-center space-y-8">
            <div className="relative">
              <h1 className="text-5xl font-bold text-gradient mb-2 flex items-center justify-center gap-3">
                Добро пожаловать, Акбота!
                <Sparkles className="h-8 w-8 text-pink-400 animate-pulse" />
              </h1>
              <div className="absolute -top-6 -right-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-pink-200 rounded-full blur-xl opacity-50"></div>
                  <Heart className="h-12 w-12 text-pink-500 relative z-10" />
                </div>
              </div>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Это особенное место, созданное с любовью, где хранятся наши самые 
              драгоценные моменты и теплые воспоминания 💖
            </p>

            <div className="flex justify-center gap-8 mt-8">
              <div className="hover-scale">
                <div className="glass-effect rounded-xl p-6 text-center">
                  <Heart className="h-8 w-8 text-pink-500 mx-auto mb-3" />
                  <p className="text-pink-600 font-medium">Моменты</p>
                </div>
              </div>
              <div className="hover-scale">
                <div className="glass-effect rounded-xl p-6 text-center">
                  <Sparkles className="h-8 w-8 text-pink-500 mx-auto mb-3" />
                  <p className="text-pink-600 font-medium">Воспоминания</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-12">
              <button className="button-gradient px-8 py-3 rounded-full font-medium hover-scale">
                Начать путешествие
              </button>
            </div>
          </div>
        </div>
      </main>
      <ThemeToggle />
    </div>
  )
}
