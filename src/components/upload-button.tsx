"use client"

import { UploadCloud } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface UploadButtonProps {
  onUploadComplete: (newPhotos: Array<{
    id: number;
    url: string;
    title: string;
    date: string;
  }>) => void;
}

export function UploadButton({ onUploadComplete }: UploadButtonProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    handleFiles(files)
  }

  const handleFiles = async (files: File[]) => {
    try {
      setIsUploading(true)
      const uploadedPhotos = []

      for (const file of files) {
        // Создаем уникальное имя файла
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`

        // Загружаем файл в Supabase Storage
        const { data, error } = await supabase.storage
          .from('photos')
          .upload(fileName, file)

        if (error) {
          console.error('Error uploading file:', error)
          continue
        }

        // Получаем публичный URL файла
        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(fileName)

        // Добавляем информацию о фото в базу данных
        const { data: photo, error: dbError } = await supabase
          .from('photos')
          .insert([
            {
              url: publicUrl,
              title: file.name.split('.')[0], // Используем имя файла как заголовок
              date: new Date().toISOString(),
            }
          ])
          .select()
          .single()

        if (dbError) {
          console.error('Error saving to database:', dbError)
          continue
        }

        uploadedPhotos.push(photo)
      }

      // Обновляем список фотографий в родительском компоненте
      if (uploadedPhotos.length > 0) {
        onUploadComplete(uploadedPhotos)
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div
      className={`relative aspect-square rounded-lg border-2 border-dashed transition-colors ${
        isDragging 
          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/50' 
          : 'border-pink-200 dark:border-pink-800 hover:border-pink-500'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileInput}
        disabled={isUploading}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <UploadCloud className={`w-10 h-10 mb-2 ${
          isUploading ? 'text-pink-300 animate-bounce' : 'text-pink-500'
        }`} />
        <p className="text-sm text-pink-700 dark:text-pink-300 text-center">
          {isUploading 
            ? 'Загрузка...' 
            : 'Перетащите фото сюда или нажмите для выбора'
          }
        </p>
      </div>
    </div>
  )
} 