/**
 * useAuth Composable
 * Quản lý authentication state và persist user data
 */
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'

export function useAuth() {
  const auth_store = useAuthStore()
  const router = useRouter()

  // Computed properties
  const user = computed(() => auth_store.user)
  const is_authenticated = computed(() => auth_store.is_authenticated)
  const is_loading = computed(() => auth_store.loading)
  const error = computed(() => auth_store.error)
  const is_admin = computed(() => auth_store.is_admin)
  const is_teacher = computed(() => auth_store.is_teacher)
  const is_student = computed(() => auth_store.is_student)
  const user_initials = computed(() => auth_store.user_initials)

  /**
   * Đăng nhập
   */
  const login = async (credentials) => {
    const result = await auth_store.login(credentials)
    return result
  }

  /**
   * Đăng ký
   */
  const register = async (user_data) => {
    const result = await auth_store.register(user_data)
    return result
  }

  /**
   * Đăng xuất và chuyển về trang login
   */
  const logout = async () => {
    await auth_store.logout()
    router.push({ name: 'signin' })
  }

  /**
   * Refresh user data
   */
  const refresh_user = async () => {
    return await auth_store.fetch_user()
  }

  /**
   * Check auth status khi component mount
   */
  const check_auth = async () => {
    return await auth_store.check_auth()
  }

  /**
   * Clear error
   */
  const clear_error = () => {
    auth_store.clear_error()
  }

  /**
   * Check if user has specific role
   */
  const has_role = (role) => {
    return user.value?.role === role
  }

  /**
   * Check if user has any of the specified roles
   */
  const has_any_role = (roles) => {
    return roles.includes(user.value?.role)
  }

  /**
   * Get user display name
   */
  const display_name = computed(() => {
    return user.value?.name || 'Guest'
  })

  /**
   * Get user email
   */
  const email = computed(() => {
    return user.value?.email || ''
  })

  /**
   * Initialize auth on component mount (optional)
   */
  const initialize = async () => {
    if (!is_authenticated.value && localStorage.getItem('access_token')) {
      await check_auth()
    }
  }

  // Auto-initialize on mount (optional - comment out if you want manual initialization)
  onMounted(() => {
    initialize()
  })

  return {
    // State
    user,
    is_authenticated,
    is_loading,
    error,
    is_admin,
    is_teacher,
    is_student,
    user_initials,
    display_name,
    email,

    // Actions
    login,
    register,
    logout,
    refresh_user,
    check_auth,
    clear_error,
    has_role,
    has_any_role,
    initialize,
  }
}

