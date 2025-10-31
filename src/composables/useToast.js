import { useToastStore } from '@/stores/toast.js'

export function useToast() {
  const toastStore = useToastStore()
  
  return {
    // Direct store access
    toasts: toastStore.toasts,
    
    // Convenience methods
    success: toastStore.success,
    error: toastStore.error,
    warning: toastStore.warning,
    info: toastStore.info,
    confirm: toastStore.confirm,
    add: toastStore.add,
    remove: toastStore.remove,
    clear: toastStore.clear,
    
    // Additional helper methods
    showLoading: (message = `${$t('loading')}`) => {
      return toastStore.add({
        type: 'info',
        message,
        persistent: true,
        title: `${$t('loading')}`
      })
    },
    
    hideLoading: (toastId) => {
      if (toastId) {
        toastStore.remove(toastId)
      }
    },
    
    // Form validation errors
    showValidationErrors: (errors) => {
      Object.keys(errors).forEach(field => {
        const messages = Array.isArray(errors[field]) ? errors[field] : [errors[field]]
        messages.forEach(message => {
          toastStore.error(message)
        })
      })
    },
    
    // Network error handling
    showNetworkError: (error) => {
      let message = `${$t('error_occurred')}, ${$t('please_try_again')}`
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const data = error.response.data
        
        switch (status) {
          case 401:
            message = `${$t('you_need_to_login_to_perform_this_action')}`
            break
          case 403:
            message = `${$t('you_do_not_have_permission_to_perform_this_action')}`
            break
          case 404:
            message = `${$t('data_not_found')}`
            break
          case 422:
            if (data.errors) {
              // Validation errors - show first error
              const firstError = Object.values(data.errors)[0]
              message = Array.isArray(firstError) ? firstError[0] : firstError
            } else {
              message = data.message || `${$t('invalid_data')}`
            }
            break
          case 500:
            message = `${$t('server_error')}, ${$t('please_try_again_later')}`
            break
          default:
            message = data.message || `${$t('error')}: ${status}: ${error.response.statusText}`
        }
      } else if (error.request) {
        // Request was made but no response received
        message = `${$t('cannot_connect_to_server')}`
      } else {
        // Something else happened
        message = error.message || `${$t('unknown_error')}`
      }
      
      toastStore.error(message)
    },
    
    // Success with auto-close
    showSuccess: (message, duration = 3000) => {
      return toastStore.success(message, { duration })
    },
    
    // Custom toast builder
    custom: (options) => {
      return toastStore.add(options)
    }
  }
}
