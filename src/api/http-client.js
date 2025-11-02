import axios from 'axios'
import router from '@/router/index.js'

const api_base_url = import.meta.env.VITE_API_BASE_URL || 'http://java-quiz.test'

export const http = axios.create({
  baseURL: api_base_url.replace(/\/$/, ''),
  withCredentials: false, // JWT không cần credentials
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Biến để theo dõi quá trình refresh token
let is_refreshing = false
let failed_queue = []

const process_queue = (error, token = null) => {
  failed_queue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failed_queue = []
}

// Request Interceptor: Đính kèm Bearer token
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Xử lý 401 và refresh token tự động
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original_request = error.config

    // Xử lý 401 Unauthorized - Token hết hạn
    if (error?.response?.status === 401 && !original_request._retry) {
      // KHÔNG refresh token cho auth endpoints (login, register, refresh, logout)
      const auth_endpoints = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh', '/api/auth/logout']
      const is_auth_endpoint = auth_endpoints.some(endpoint => original_request.url?.includes(endpoint))
      
      if (is_auth_endpoint) {
        // Đây là lỗi credentials hoặc auth, không phải token expired
        // Trả về lỗi gốc để component xử lý
        return Promise.reject(error)
      }

      if (is_refreshing) {
        // Nếu đang refresh, queue request này
        return new Promise((resolve, reject) => {
          failed_queue.push({ resolve, reject })
        })
          .then((token) => {
            original_request.headers.Authorization = `Bearer ${token}`
            return http(original_request)
          })
          .catch((err) => Promise.reject(err))
      }

      original_request._retry = true
      is_refreshing = true

      try {
        // Thử refresh token (JWT sử dụng access_token hiện tại để refresh)
        const current_token = localStorage.getItem('access_token')
        if (!current_token) {
          throw new Error('No access token available')
        }

        // Gọi API refresh với current token trong header
        const { data } = await http.post('/api/auth/refresh')

        // API trả về { success: true, data: { access_token, ... } }
        const new_access_token = data.data?.access_token || data.access_token

        if (!new_access_token) {
          throw new Error('No new token received from refresh')
        }

        // Lưu token mới
        localStorage.setItem('access_token', new_access_token)

        // Cập nhật header và xử lý queue
        http.defaults.headers.common.Authorization = `Bearer ${new_access_token}`
        original_request.headers.Authorization = `Bearer ${new_access_token}`
        process_queue(null, new_access_token)

        // Retry request ban đầu
        return http(original_request)
      } catch (refresh_error) {
        // Refresh thất bại - Logout và chuyển về login
        process_queue(refresh_error, null)
        localStorage.removeItem('access_token')
        router.push({ name: 'signin', query: { expired: '1' } })
        return Promise.reject(refresh_error)
      } finally {
        is_refreshing = false
      }
    }

    // Xử lý 403 Forbidden
    if (error?.response?.status === 403) {
      // Import toast store để show error
      import('@/stores/toast.js').then(({ useToastStore }) => {
        const toast_store = useToastStore()
        toast_store.error('Bạn không có quyền truy cập tài nguyên này')
      })
    }

    // Xử lý lỗi mạng
    if (!error.response) {
      // Import toast store để show error
      import('@/stores/toast.js').then(({ useToastStore }) => {
        const toast_store = useToastStore()
        toast_store.error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.')
      })
    }

    return Promise.reject(error)
  }
)


