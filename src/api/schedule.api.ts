import apiClient from './client'
import type { 
  Schedule, 
  DaySchedule,
  ApiResponse 
} from '@/types'

/**
 * Schedule API - Handles all schedule/working hours related API calls
 */
export const scheduleApi = {
  /**
   * Get owner's schedule (public - for clients to see availability)
   */
  getByOwner: async (ownerId: string): Promise<Schedule> => {
    const response = await apiClient.get<ApiResponse<Schedule>>(
      `/schedule/${ownerId}`
    )
    return response.data.data
  },

  /**
   * Get current owner's schedule
   */
  getOwnerSchedule: async (): Promise<Schedule> => {
    const response = await apiClient.get<ApiResponse<Schedule>>(
      '/schedule/owner'
    )
    return response.data.data
  },

  /**
   * Create or update schedule (owner only)
   */
  upsert: async (schedule: DaySchedule[]): Promise<Schedule> => {
    const response = await apiClient.put<ApiResponse<Schedule>>(
      '/schedule',
      { schedule }
    )
    return response.data.data
  },

  /**
   * Update specific day's schedule
   */
  updateDay: async (
    dayOfWeek: number,
    daySchedule: Omit<DaySchedule, 'dayOfWeek'>
  ): Promise<Schedule> => {
    const response = await apiClient.patch<ApiResponse<Schedule>>(
      `/schedule/day/${dayOfWeek}`,
      daySchedule
    )
    return response.data.data
  },

  /**
   * Toggle day open/closed
   */
  toggleDay: async (dayOfWeek: number): Promise<Schedule> => {
    const response = await apiClient.patch<ApiResponse<Schedule>>(
      `/schedule/day/${dayOfWeek}/toggle`
    )
    return response.data.data
  },

  /**
   * Add time slot to a day
   */
  addSlot: async (
    dayOfWeek: number,
    slot: { start: string; end: string }
  ): Promise<Schedule> => {
    const response = await apiClient.post<ApiResponse<Schedule>>(
      `/schedule/day/${dayOfWeek}/slots`,
      slot
    )
    return response.data.data
  },

  /**
   * Remove time slot from a day
   */
  removeSlot: async (
    dayOfWeek: number,
    slotIndex: number
  ): Promise<Schedule> => {
    const response = await apiClient.delete<ApiResponse<Schedule>>(
      `/schedule/day/${dayOfWeek}/slots/${slotIndex}`
    )
    return response.data.data
  },
}
