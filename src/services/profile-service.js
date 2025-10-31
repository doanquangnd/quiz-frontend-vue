/**
 * Profile Service
 * Handles all profile-related API calls
 */
import { http } from '@/api/http-client.js'

export const ProfileService = {
  /**
   * Lấy thông tin profile
   */
  async get() {
    const { data } = await http.get('/api/profile')
    return data
  },

  /**
   * Update profile
   */
  async update(profile_data) {
    const { data } = await http.put('/api/profile', profile_data)
    return data
  },

  /**
   * Update password
   */
  async update_password(password_data) {
    const { data } = await http.post('/api/profile/password', password_data)
    return data
  },

  /**
   * Lấy statistics
   */
  async get_statistics() {
    const { data } = await http.get('/api/profile/statistics')
    return data
  },
}

