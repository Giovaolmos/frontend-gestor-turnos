import apiClient from './client'
import type { 
  Appointment, 
  CreateAppointmentData,
  AvailableSlot,
  ApiResponse,
  PaginatedResponse,
  AppointmentStatus 
} from '@/types'

interface GetAppointmentsParams {
  page?: number
  limit?: number
  status?: AppointmentStatus
  startDate?: string
  endDate?: string
}

/**
 * Appointments API - Handles all appointment related API calls
 */
export const appointmentsApi = {
  /**
   * Get available time slots for a specific date and service
   */
  getAvailableSlots: async (
    ownerId: string,
    serviceId: string,
    date: string
  ): Promise<AvailableSlot[]> => {
    const response = await apiClient.get<ApiResponse<AvailableSlot[]>>(
      '/appointments/available-slots',
      { params: { ownerId, serviceId, date } }
    )
    return response.data.data
  },

  /**
   * Get available dates for a month
   */
  getAvailableDates: async (
    ownerId: string,
    month: number,
    year: number
  ): Promise<string[]> => {
    const response = await apiClient.get<ApiResponse<string[]>>(
      '/appointments/available-dates',
      { params: { ownerId, month, year } }
    )
    return response.data.data
  },

  /**
   * Get client appointments (for logged in client)
   */
  getClientAppointments: async (
    params?: GetAppointmentsParams
  ): Promise<PaginatedResponse<Appointment>> => {
    const response = await apiClient.get<PaginatedResponse<Appointment>>(
      '/appointments/client',
      { params }
    )
    return response.data
  },

  /**
   * Get owner appointments (for logged in owner)
   */
  getOwnerAppointments: async (
    params?: GetAppointmentsParams
  ): Promise<PaginatedResponse<Appointment>> => {
    const response = await apiClient.get<PaginatedResponse<Appointment>>(
      '/appointments/owner',
      { params }
    )
    return response.data
  },

  /**
   * Get appointments for a specific week (owner view)
   */
  getWeeklyAppointments: async (
    startDate: string
  ): Promise<Appointment[]> => {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(
      '/appointments/weekly',
      { params: { startDate } }
    )
    return response.data.data
  },

  /**
   * Get single appointment by ID
   */
  getById: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get<ApiResponse<Appointment>>(
      `/appointments/${id}`
    )
    return response.data.data
  },

  /**
   * Create new appointment (client)
   */
  create: async (
    ownerId: string,
    data: CreateAppointmentData
  ): Promise<Appointment> => {
    const response = await apiClient.post<ApiResponse<Appointment>>(
      '/appointments',
      { ...data, ownerId }
    )
    return response.data.data
  },

  /**
   * Update appointment status
   */
  updateStatus: async (
    id: string,
    status: AppointmentStatus
  ): Promise<Appointment> => {
    const response = await apiClient.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/status`,
      { status }
    )
    return response.data.data
  },

  /**
   * Cancel appointment (available to both client and owner)
   */
  cancel: async (id: string, reason?: string): Promise<Appointment> => {
    const response = await apiClient.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/cancel`,
      { reason }
    )
    return response.data.data
  },

  /**
   * Confirm appointment (owner only)
   */
  confirm: async (id: string): Promise<Appointment> => {
    const response = await apiClient.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/confirm`
    )
    return response.data.data
  },

  /**
   * Mark appointment as completed (owner only)
   */
  complete: async (id: string): Promise<Appointment> => {
    const response = await apiClient.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/complete`
    )
    return response.data.data
  },
}
