<template>
  <div class="turnstile-widget-wrapper">
    <div
      ref="turnstileContainer"
      class="cf-turnstile"
      :data-sitekey="siteKey"
      :data-theme="theme"
      data-auto="false"
    ></div>

    <!-- Hidden input -->
    <input
      type="hidden"
      name="cf-turnstile-response"
      :value="turnstileToken"
    />

    <!-- Error message -->
    <div
      v-if="errorMessage"
      class="turnstile-error text-danger mt-2"
      role="alert"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
let scriptLoaded = false  // ✅ kiểm soát load script toàn cục

export default {
  name: 'TurnstileWidget',

  props: {
    siteKey: { type: String, required: true },
    theme: {
      type: String,
      default: 'auto',
      validator: (v) => ['light', 'dark', 'auto'].includes(v),
    },
  },

  data() {
    return {
      widgetId: null,
      turnstileToken: '',
      errorMessage: '',
      isRendering: false, // Flag để tránh render duplicate
    }
  },

  async mounted() {
    // Đợi DOM update hoàn tất
    await this.$nextTick()
    
    await this.ensureScriptLoaded()
    
    // Đợi thêm một chút để đảm bảo container đã sẵn sàng
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // Cleanup container trước khi render để tránh duplicate
    this.cleanupContainer()
    
    this.renderWidget()

    // Lắng nghe sự kiện reset từ bên ngoài
    window.addEventListener('reset-turnstile', this.reset)
  },

  beforeUnmount() {
    this.cleanup()
    window.removeEventListener('reset-turnstile', this.reset)
  },

  methods: {
    /**
     * Load Turnstile script nếu chưa có
     */
    ensureScriptLoaded() {
      return new Promise((resolve, reject) => {
        if (window.turnstile) {
          scriptLoaded = true
          return resolve()
        }

        if (scriptLoaded) {
          // Script đang được load bởi 1 component khác
          const wait = () => {
            if (window.turnstile) resolve()
            else setTimeout(wait, 50)
          }
          return wait()
        }

        // ✅ Lần đầu tiên load
        const script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
        script.async = true
        script.defer = true

        script.onload = () => {
          scriptLoaded = true
          resolve()
        }
        script.onerror = () => reject(new Error('Failed to load Turnstile script'))

        document.head.appendChild(script)
      })
    },

    /**
     * Cleanup container - xóa widget cũ nếu có
     */
    cleanupContainer() {
      if (!this.$refs.turnstileContainer) return
      
      const container = this.$refs.turnstileContainer
      
      // Luôn cleanup container để đảm bảo sạch hoàn toàn
      // Xóa tất cả children và attributes mà Turnstile có thể thêm vào
      container.innerHTML = ''
      
      // Remove các attributes mà Turnstile có thể thêm
      container.removeAttribute('data-callback')
      container.removeAttribute('data-error-callback')
      container.removeAttribute('data-expired-callback')
      
      // Reset widgetId
      this.widgetId = null
      this.isRendering = false
    },

    /**
     * Render widget — nếu đã có thì reset, không render thêm
     */
    renderWidget() {
      if (!window.turnstile || !this.$refs.turnstileContainer) return

      // Tránh render duplicate nếu đang render
      if (this.isRendering) {
        return
      }

      // Nếu đã có widget trước đó, reset thay vì render mới
      if (this.widgetId) {
        try {
          window.turnstile.reset(this.widgetId)
          return
        } catch (e) {
          // Nếu reset fail, có thể widget đã bị xóa, render lại
          this.widgetId = null
        }
      }
      
      // Kiểm tra container đã có widget chưa (tránh duplicate)
      const container = this.$refs.turnstileContainer
      const hasExistingWidget = container.querySelector('iframe') || 
                                container.querySelector('[data-callback]') ||
                                container.children.length > 0
      
      if (hasExistingWidget) {
        // Container đã có widget, không render lại
        return
      }
      
      // Cleanup container để đảm bảo sạch
      this.cleanupContainer()

      // Set flag để tránh duplicate
      this.isRendering = true

      // Render widget mới
      try {
        this.widgetId = window.turnstile.render(this.$refs.turnstileContainer, {
          sitekey: this.siteKey,
          theme: this.theme,
          callback: this.onSuccess,
          'error-callback': this.onError,
          'expired-callback': this.onExpired,
        })
      } catch (e) {
        console.error('Turnstile render error:', e)
        this.errorMessage = 'Không thể tải CAPTCHA. Vui lòng tải lại trang.'
      } finally {
        this.isRendering = false
      }
    },

    onSuccess(token) {
      this.turnstileToken = token
      this.errorMessage = ''
      this.$emit('verified', token)
    },

    onError(err) {
      console.warn('Turnstile error:', err)
      this.turnstileToken = ''
      this.errorMessage = 'Xác thực CAPTCHA thất bại. Vui lòng thử lại.'
      this.$emit('error', err)
      this.reset()
    },

    onExpired() {
      this.turnstileToken = ''
      this.errorMessage = 'CAPTCHA đã hết hạn. Vui lòng xác thực lại.'
      this.$emit('expired')
      this.reset()
    },

    reset() {
      if (this.widgetId && window.turnstile) {
        try {
          window.turnstile.reset(this.widgetId)
        } catch (e) {
          console.warn('Turnstile reset error:', e)
        }
      }
      this.turnstileToken = ''
      this.errorMessage = ''
    },

    cleanup() {
      // Cleanup container trước
      if (this.$refs.turnstileContainer) {
        this.$refs.turnstileContainer.innerHTML = ''
      }
      
      // Remove widget nếu có
      if (this.widgetId && window.turnstile) {
        try {
          window.turnstile.remove(this.widgetId)
        } catch (e) {
          // Widget có thể đã bị xóa
        }
      }
      
      // Reset state
      this.turnstileToken = ''
      this.errorMessage = ''
      this.widgetId = null
      this.isRendering = false
    },

    getToken() {
      return this.turnstileToken
    },
  },
}
</script>

  
  <style scoped>
  .turnstile-widget-wrapper {
    margin: 1rem 0;
  }
  
  .cf-turnstile {
    display: inline-block;
    min-height: 65px;
  }
  
  .turnstile-error {
    font-size: 0.875rem;
    font-weight: 500;
  }
  </style>
  