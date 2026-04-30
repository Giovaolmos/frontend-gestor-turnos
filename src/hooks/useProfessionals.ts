import { useState, useCallback } from 'react'
import type { Professional, ApiError } from '@/types'
import { professionalsApi } from '@/api'

interface UseProfessionalsReturn {
  professionals: Professional[]
  isLoading: boolean
  error: ApiError | null
  fetchProfessionals: () => Promise<void>
}

export function useProfessionals(): UseProfessionalsReturn {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchProfessionals = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await professionalsApi.getAll()
      setProfessionals(data)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { professionals, isLoading, error, fetchProfessionals }
}
