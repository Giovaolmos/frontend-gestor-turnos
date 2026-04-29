import apiClient from './client'
import type { 
  EarningsSummary, 
  EarningsDetail,
  ApiResponse 
} from '@/types'

/**
 * Earnings API - Handles all earnings/statistics related API calls
 */
export const earningsApi = {
  /**
   * Get earnings summary (daily, weekly, monthly)
   */
  getSummary: async (): Promise<EarningsSummary> => {
    const response = await apiClient.get<ApiResponse<EarningsSummary>>(
      '/earnings/summary'
    )
    return response.data.data
  },

  /**
   * Get earnings for a specific date range
   */
  getByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<EarningsDetail[]> => {
    const response = await apiClient.get<ApiResponse<EarningsDetail[]>>(
      '/earnings',
      { params: { startDate, endDate } }
    )
    return response.data.data
  },

  /**
   * Get daily earnings
   */
  getDaily: async (date?: string): Promise<EarningsDetail> => {
    const params = date ? { date } : {}
    const response = await apiClient.get<ApiResponse<EarningsDetail>>(
      '/earnings/daily',
      { params }
    )
    return response.data.data
  },

  /**
   * Get weekly earnings
   */
  getWeekly: async (startDate?: string): Promise<EarningsDetail[]> => {
    const params = startDate ? { startDate } : {}
    const response = await apiClient.get<ApiResponse<EarningsDetail[]>>(
      '/earnings/weekly',
      { params }
    )
    return response.data.data
  },

  /**
   * Get monthly earnings
   */
  getMonthly: async (
    month?: number,
    year?: number
  ): Promise<EarningsDetail[]> => {
    const params: Record<string, number> = {}
    if (month !== undefined) params.month = month
    if (year !== undefined) params.year = year
    
    const response = await apiClient.get<ApiResponse<EarningsDetail[]>>(
      '/earnings/monthly',
      { params }
    )
    return response.data.data
  },

  /**
   * Get earnings statistics
   */
  getStatistics: async (period: 'week' | 'month' | 'year'): Promise<{
    totalEarnings: number
    totalAppointments: number
    averagePerAppointment: number
    topServices: { serviceId: string; name: string; total: number }[]
  }> => {
    const response = await apiClient.get<ApiResponse<{
      totalEarnings: number
      totalAppointments: number
      averagePerAppointment: number
      topServices: { serviceId: string; name: string; total: number }[]
    }>>('/earnings/statistics', { params: { period } })
    return response.data.data
  },
}
