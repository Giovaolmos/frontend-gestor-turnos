import apiClient from './client'
import type { Professional, ApiResponse } from '@/types'

export const professionalsApi = {
  /**
   * GET /professionals
   * Devuelve todos los profesionales activos del negocio
   */
  getAll: async (): Promise<Professional[]> => {
    const response = await apiClient.get<ApiResponse<Professional[]>>('/professionals')
    return response.data.data
  },
}
