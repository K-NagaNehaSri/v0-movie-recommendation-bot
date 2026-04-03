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

const STORAGE_KEY = "moviebot-watchlist"

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setWatchlist(JSON.parse(stored))
      }
    } catch {
      // Ignore errors
    }
  }, [])

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist))
      } catch {
        // Ignore errors
      }
    }
  }, [watchlist, mounted])

  const addToWatchlist = useCallback((movie: Movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev
      return [...prev, movie]
    })
  }, [])

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const isInWatchlist = useCallback(
    (id: string) => watchlist.some((m) => m.id === id),
    [watchlist]
  )

  const markAsWatched = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const clearWatchlist = useCallback(() => {
    setWatchlist([])
  }, [])

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    markAsWatched,
    clearWatchlist,
  }
}
