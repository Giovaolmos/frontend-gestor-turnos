import apiClient from './client'
import type { 
  Service, 
  CreateServiceData, 
  UpdateServiceData,
  ApiResponse,
  PaginatedResponse 
} from '@/types'

/**
 * Services API - Handles all service related API calls
 */
export const servicesApi = {
  /**
   * Get all services (for clients - only active services)
   */
  getAll: async (ownerId?: string): Promise<Service[]> => {
    const params = ownerId ? { ownerId } : {}
    const response = await apiClient.get<ApiResponse<Service[]>>(
      '/services',
      { params }
    )
    return response.data.data
  },

  /**
   * Get all services for owner (including inactive)
   */
  getOwnerServices: async (): Promise<Service[]> => {
    const response = await apiClient.get<ApiResponse<Service[]>>(
      '/services/owner'
    )
    return response.data.data
  },

  /**
   * Get paginated services
   */
  getPaginated: async (
    page: number = 1, 
    limit: number = 10
  ): Promise<PaginatedResponse<Service>> => {
    const response = await apiClient.get<PaginatedResponse<Service>>(
      '/services',
      { params: { page, limit } }
    )
    return response.data
  },

  /**
   * Get single service by ID
   */
  getById: async (id: string): Promise<Service> => {
    const response = await apiClient.get<ApiResponse<Service>>(
      `/services/${id}`
    )
    return response.data.data
  },

  /**
   * Create new service (owner only)
   */
  create: async (data: CreateServiceData): Promise<Service> => {
    const response = await apiClient.post<ApiResponse<Service>>(
      '/services',
      data
    )
    return response.data.data
  },

  /**
   * Update service (owner only)
   */
  update: async (id: string, data: UpdateServiceData): Promise<Service> => {
    const response = await apiClient.put<ApiResponse<Service>>(
      `/services/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete service (owner only)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/services/${id}`)
  },

  /**
   * Toggle service active status (owner only)
   */
  toggleActive: async (id: string): Promise<Service> => {
    const response = await apiClient.patch<ApiResponse<Service>>(
      `/services/${id}/toggle-active`
    )
    return response.data.data
  },
}
