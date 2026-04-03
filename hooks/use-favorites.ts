"use client"

import { useState, useEffect, useCallback } from "react"

type Movie = {
  id: string
  title: string
  year: number
  rating: number
  genres: string[]
  providers: string[]
  language: string
  synopsis: string
}

const STORAGE_KEY = "moviebot-favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch {
      // Ignore errors
    }
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      } catch {
        // Ignore errors
      }
    }
  }, [favorites, mounted])

  const addFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev
      return [...prev, movie]
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.some((m) => m.id === id),
    [favorites]
  )

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
  }
}
