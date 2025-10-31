/**
 * Dashboard Service
 * Handles dashboard data API calls
 */
import { http } from '@/api/http-client.js'

export const DashboardService = {
  /**
   * Lấy tất cả data cho dashboard
   */
  async get_dashboard_data() {
    const { data } = await http.get('/api/dashboard')
    return data
  },

  /**
   * Lấy quick stats (lightweight)
   */
  async get_quick_stats() {
    const { data } = await http.get('/api/dashboard/quick-stats')
    return data
  },
}

