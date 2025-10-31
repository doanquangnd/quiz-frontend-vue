import { defineStore } from 'pinia'
import { http } from '@/api/http-client'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    is_authenticated: (state) => !!state.user,
    is_admin: (state) => state.user?.role === 'admin',
    is_teacher: (state) => state.user?.role === 'teacher',
    is_student: (state) => state.user?.role === 'student',
    user_initials: (state) => {
      if (!state.user?.name) return ''
      return state.user.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },
  },

  actions: {
    /**
     * Lấy thông tin user hiện tại
     */
    async fetch_user() {
      this.loading = true
      this.error = null
      try {
        const { data } = await http.get('/api/auth/me')
        if (data.success) {
          this.user = data.data
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.error = error.response?.data?.message || 'Không thể tải thông tin user'
        this.user = null
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Đăng nhập
     */
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const { data } = await http.post('/api/auth/login', credentials)
        
        if (data.success && data.data?.access_token) {
          // Lưu token
          localStorage.setItem('access_token', data.data.access_token)
          
          // Lưu thông tin user
          this.user = data.data.user
          
          return { success: true, user: this.user }
        }
        
        throw new Error(data.message || 'Đăng nhập thất bại')
      } catch (error) {
        console.error('Login failed:', error)
        this.error = error.response?.data?.message || error.message || 'Đăng nhập thất bại'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Đăng ký
     */
    async register(user_data) {
      this.loading = true
      this.error = null
      try {
        const { data } = await http.post('/api/auth/register', user_data)
        
        if (data.success && data.data?.access_token) {
          // Internal email - auto activated
          // Lưu token
          localStorage.setItem('access_token', data.data.access_token)
          
          // Lưu thông tin user
          this.user = data.data.user
          
          return { success: true, user: this.user, is_internal: true }
        }
        
        // External email - needs approval
        return { success: true, message: data.message, is_internal: false }
      } catch (error) {
        console.error('Registration failed:', error)
        this.error = error.response?.data?.message || error.message || 'Đăng ký thất bại'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Đăng xuất
     */
    async logout() {
      this.loading = true
      try {
        // Gọi API logout để xóa token trên server
        await http.post('/api/auth/logout')
      } catch (error) {
        console.error('Logout API failed:', error)
        // Vẫn logout ở client ngay cả khi API fail
      } finally {
        // Xóa token và user info
        localStorage.removeItem('access_token')
        this.user = null
        this.loading = false
      }
    },

    /**
     * Refresh token
     */
    async refresh_token() {
      try {
        const { data } = await http.post('/api/auth/refresh')
        
        if (data.success && data.data?.access_token) {
          localStorage.setItem('access_token', data.data.access_token)
          return true
        }
        
        return false
      } catch (error) {
        console.error('Token refresh failed:', error)
        return false
      }
    },

    /**
     * Kiểm tra authentication status khi app khởi động
     */
    async check_auth() {
      const token = localStorage.getItem('access_token')
      if (!token) {
        this.user = null
        return false
      }

      return await this.fetch_user()
    },

    /**
     * Clear error
     */
    clear_error() {
      this.error = null
    },
  },
})


