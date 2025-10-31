import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: []
  }),

  actions: {
    // Add a new toast
    add(toast) {
      const id = Date.now() + Math.random()
      const newToast = {
        id,
        type: 'info', // success, error, warning, info
        title: '',
        message: '',
        duration: 5000, // 5 seconds default
        persistent: false, // if true, won't auto-remove
        actions: [], // array of action buttons
        createdAt: new Date().toISOString(),
        ...toast
      }
      
      this.toasts.push(newToast)
      
      // Auto remove after duration (unless persistent)
      if (!newToast.persistent && newToast.duration > 0) {
        setTimeout(() => {
          this.remove(id)
        }, newToast.duration)
      }
      
      return id
    },

    // Remove a toast
    remove(id) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    // Clear all toasts
    clear() {
      this.toasts = []
    },

    // Convenience methods for different types
    success(message, options = {}) {
      return this.add({
        type: 'success',
        message,
        ...options
      })
    },

    error(message, options = {}) {
      return this.add({
        type: 'error',
        message,
        duration: 7000, // Longer for errors
        ...options
      })
    },

    warning(message, options = {}) {
      return this.add({
        type: 'warning',
        message,
        ...options
      })
    },

    info(message, options = {}) {
      return this.add({
        type: 'info',
        message,
        ...options
      })
    },

    // Custom toast with actions
    confirm(message, options = {}) {
      return this.add({
        type: 'confirm',
        message,
        persistent: true,
        actions: [
          {
            label: 'Hủy',
            class: 'btn-outline-secondary btn-sm',
            action: (toastId) => this.remove(toastId)
          },
          {
            label: 'Xác nhận',
            class: 'btn-primary btn-sm',
            action: (toastId) => {
              this.remove(toastId)
              if (options.onConfirm) {
                options.onConfirm()
              }
            }
          }
        ],
        ...options
      })
    }
  }
})
