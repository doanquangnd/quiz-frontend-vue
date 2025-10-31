// Accessibility Composable for WCAG 2.1 AA Compliance
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export function useAccessibility() {
  // State
  const focusTrapActive = ref(false)
  const announcements = ref([])
  const keyboardMode = ref(false)
  const screenReaderMode = ref(false)
  const highContrastMode = ref(false)
  const fontSize = ref('normal') // 'normal', 'large', 'x-large'
  const reducedMotion = ref(false)
  
  // Focus trap state
  const focusTrapElement = ref(null)
  const focusableElements = ref([])
  const firstFocusableElement = ref(null)
  const lastFocusableElement = ref(null)
  
  // Keyboard navigation
  const currentFocusIndex = ref(0)
  const navigationHistory = ref([])
  
  // Computed properties
  const accessibilityPreferences = computed(() => ({
    keyboardMode: keyboardMode.value,
    screenReaderMode: screenReaderMode.value,
    highContrastMode: highContrastMode.value,
    fontSize: fontSize.value,
    reducedMotion: reducedMotion.value
  }))
  
  const isAccessibilityEnabled = computed(() => {
    return keyboardMode.value || screenReaderMode.value || highContrastMode.value
  })

  // ===== ARIA ANNOUNCEMENTS =====
  
  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  const announce = (message, priority = 'polite') => {
    const announcement = {
      id: Date.now(),
      message,
      priority,
      timestamp: new Date().toISOString()
    }
    
    announcements.value.push(announcement)
    
    // Create ARIA live region if not exists
    let liveRegion = document.getElementById('aria-live-region')
    if (!liveRegion) {
      liveRegion = createLiveRegion()
    }
    
    // Announce to screen reader
    const announcer = liveRegion.querySelector(`[aria-live="${priority}"]`)
    if (announcer) {
      announcer.textContent = ''
      setTimeout(() => {
        announcer.textContent = message
      }, 100)
      
      // Clear after 5 seconds
      setTimeout(() => {
        announcer.textContent = ''
      }, 5000)
    }
    
    // Store in history (max 10 announcements)
    if (announcements.value.length > 10) {
      announcements.value.shift()
    }
  }
  
  /**
   * Create ARIA live region for announcements
   */
  const createLiveRegion = () => {
    const region = document.createElement('div')
    region.id = 'aria-live-region'
    region.className = 'sr-only'
    
    // Polite announcer
    const polite = document.createElement('div')
    polite.setAttribute('aria-live', 'polite')
    polite.setAttribute('aria-atomic', 'true')
    
    // Assertive announcer
    const assertive = document.createElement('div')
    assertive.setAttribute('aria-live', 'assertive')
    assertive.setAttribute('aria-atomic', 'true')
    
    region.appendChild(polite)
    region.appendChild(assertive)
    document.body.appendChild(region)
    
    return region
  }

  // ===== FOCUS MANAGEMENT =====
  
  /**
   * Activate focus trap within an element
   * @param {HTMLElement} element - Element to trap focus within
   */
  const activateFocusTrap = (element) => {
    if (!element) return
    
    focusTrapElement.value = element
    focusTrapActive.value = true
    
    // Get all focusable elements
    focusableElements.value = getFocusableElements(element)
    
    if (focusableElements.value.length === 0) return
    
    firstFocusableElement.value = focusableElements.value[0]
    lastFocusableElement.value = focusableElements.value[focusableElements.value.length - 1]
    
    // Focus first element
    firstFocusableElement.value.focus()
    
    // Add event listeners
    document.addEventListener('keydown', handleFocusTrap)
  }
  
  /**
   * Deactivate focus trap
   */
  const deactivateFocusTrap = () => {
    focusTrapActive.value = false
    document.removeEventListener('keydown', handleFocusTrap)
  }
  
  /**
   * Handle focus trap keyboard events
   */
  const handleFocusTrap = (event) => {
    if (!focusTrapActive.value) return
    
    const isTabPressed = event.key === 'Tab'
    if (!isTabPressed) return
    
    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusableElement.value) {
        event.preventDefault()
        lastFocusableElement.value.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusableElement.value) {
        event.preventDefault()
        firstFocusableElement.value.focus()
      }
    }
  }
  
  /**
   * Get all focusable elements within a container
   */
  const getFocusableElements = (container) => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ].join(', ')
    
    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null)
  }

  // ===== KEYBOARD NAVIGATION =====
  
  /**
   * Enable keyboard navigation mode
   */
  const enableKeyboardMode = () => {
    keyboardMode.value = true
    document.body.classList.add('keyboard-navigation')
    
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyboardNavigation)
    document.addEventListener('mousedown', disableKeyboardMode)
  }
  
  /**
   * Disable keyboard navigation mode
   */
  const disableKeyboardMode = () => {
    keyboardMode.value = false
    document.body.classList.remove('keyboard-navigation')
    
    document.removeEventListener('keydown', handleKeyboardNavigation)
    document.removeEventListener('mousedown', disableKeyboardMode)
  }
  
  /**
   * Handle keyboard navigation
   */
  const handleKeyboardNavigation = (event) => {
    // Skip modifiers
    if (event.metaKey || event.altKey || event.ctrlKey) return
    
    // Store navigation in history
    navigationHistory.value.push({
      key: event.key,
      target: event.target.tagName,
      timestamp: Date.now()
    })
    
    // Limit history
    if (navigationHistory.value.length > 50) {
      navigationHistory.value.shift()
    }
    
    // Handle special keys
    switch (event.key) {
      case 'Escape':
        handleEscapeKey(event)
        break
      case 'Enter':
      case ' ':
        handleActivationKey(event)
        break
    }
  }
  
  /**
   * Handle Escape key press
   */
  const handleEscapeKey = (event) => {
    // Close modals, dropdowns, etc.
    const openModals = document.querySelectorAll('[role="dialog"][aria-modal="true"]')
    if (openModals.length > 0) {
      const lastModal = openModals[openModals.length - 1]
      const closeButton = lastModal.querySelector('[aria-label*="Close"], [aria-label*="Đóng"]')
      if (closeButton) {
        closeButton.click()
      }
    }
  }
  
  /**
   * Handle activation keys (Enter/Space)
   */
  const handleActivationKey = (event) => {
    const target = event.target
    
    // Activate buttons, links with keyboard
    if (target.matches('[role="button"]') && !target.matches('button, a')) {
      event.preventDefault()
      target.click()
    }
  }
  
  /**
   * Navigate to next focusable element
   */
  const focusNext = () => {
    const focusable = getFocusableElements(document.body)
    const currentIndex = focusable.indexOf(document.activeElement)
    const nextIndex = (currentIndex + 1) % focusable.length
    focusable[nextIndex].focus()
  }
  
  /**
   * Navigate to previous focusable element
   */
  const focusPrevious = () => {
    const focusable = getFocusableElements(document.body)
    const currentIndex = focusable.indexOf(document.activeElement)
    const prevIndex = currentIndex - 1 < 0 ? focusable.length - 1 : currentIndex - 1
    focusable[prevIndex].focus()
  }

  // ===== SKIP LINKS =====
  
  /**
   * Create skip navigation links
   */
  const createSkipLinks = () => {
    const skipLinks = document.createElement('div')
    skipLinks.className = 'skip-links'
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Chuyển đến nội dung chính</a>
      <a href="#navigation" class="skip-link">Chuyển đến điều hướng</a>
      <a href="#footer" class="skip-link">Chuyển đến footer</a>
    `
    
    document.body.insertBefore(skipLinks, document.body.firstChild)
  }

  // ===== COLOR CONTRAST =====
  
  /**
   * Check color contrast ratio
   */
  const checkContrast = (foreground, background) => {
    const getLuminance = (color) => {
      const rgb = color.match(/\d+/g).map(Number)
      const [r, g, b] = rgb.map(val => {
        const sRGB = val / 255
        return sRGB <= 0.03928
          ? sRGB / 12.92
          : Math.pow((sRGB + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    
    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    
    return {
      ratio: ratio.toFixed(2),
      AA: ratio >= 4.5,
      AAA: ratio >= 7,
      largeAA: ratio >= 3,
      largeAAA: ratio >= 4.5
    }
  }
  
  /**
   * Enable high contrast mode
   */
  const enableHighContrast = () => {
    highContrastMode.value = true
    document.body.classList.add('high-contrast')
    localStorage.setItem('highContrast', 'true')
    announce('Chế độ tương phản cao đã được bật')
  }
  
  /**
   * Disable high contrast mode
   */
  const disableHighContrast = () => {
    highContrastMode.value = false
    document.body.classList.remove('high-contrast')
    localStorage.removeItem('highContrast')
    announce('Chế độ tương phản cao đã được tắt')
  }

  // ===== FONT SIZE =====
  
  /**
   * Increase font size
   */
  const increaseFontSize = () => {
    const sizes = ['normal', 'large', 'x-large']
    const currentIndex = sizes.indexOf(fontSize.value)
    if (currentIndex < sizes.length - 1) {
      fontSize.value = sizes[currentIndex + 1]
      applyFontSize()
      announce(`Kích thước chữ đã được tăng lên ${fontSize.value}`)
    }
  }
  
  /**
   * Decrease font size
   */
  const decreaseFontSize = () => {
    const sizes = ['normal', 'large', 'x-large']
    const currentIndex = sizes.indexOf(fontSize.value)
    if (currentIndex > 0) {
      fontSize.value = sizes[currentIndex - 1]
      applyFontSize()
      announce(`Kích thước chữ đã được giảm xuống ${fontSize.value}`)
    }
  }
  
  /**
   * Reset font size to normal
   */
  const resetFontSize = () => {
    fontSize.value = 'normal'
    applyFontSize()
    announce('Kích thước chữ đã được đặt lại về mặc định')
  }
  
  /**
   * Apply font size to document
   */
  const applyFontSize = () => {
    document.body.classList.remove('font-large', 'font-x-large')
    if (fontSize.value !== 'normal') {
      document.body.classList.add(`font-${fontSize.value}`)
    }
    localStorage.setItem('fontSize', fontSize.value)
  }

  // ===== SCREEN READER SUPPORT =====
  
  /**
   * Detect screen reader
   */
  const detectScreenReader = () => {
    // Check if user is using screen reader
    const isScreenReader = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
                          navigator.userAgent.includes('NVDA') ||
                          navigator.userAgent.includes('JAWS')
    
    if (isScreenReader) {
      screenReaderMode.value = true
      document.body.classList.add('screen-reader-mode')
    }
  }

  // ===== REDUCED MOTION =====
  
  /**
   * Detect reduced motion preference
   */
  const detectReducedMotion = () => {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      reducedMotion.value = mediaQuery.matches
      
      mediaQuery.addEventListener('change', (e) => {
        reducedMotion.value = e.matches
        if (reducedMotion.value) {
          document.body.classList.add('reduced-motion')
          announce('Chuyển động đã được giảm thiểu')
        } else {
          document.body.classList.remove('reduced-motion')
        }
      })
    }
  }

  // ===== FORM VALIDATION =====
  
  /**
   * Add accessible error message to form field
   */
  const addFieldError = (fieldId, message) => {
    const field = document.getElementById(fieldId)
    if (!field) return
    
    // Set ARIA attributes
    field.setAttribute('aria-invalid', 'true')
    
    // Create or update error message
    let errorEl = document.getElementById(`${fieldId}-error`)
    if (!errorEl) {
      errorEl = document.createElement('div')
      errorEl.id = `${fieldId}-error`
      errorEl.className = 'field-error'
      errorEl.setAttribute('role', 'alert')
      field.parentNode.appendChild(errorEl)
    }
    
    errorEl.textContent = message
    field.setAttribute('aria-describedby', `${fieldId}-error`)
    
    // Announce error
    announce(`Lỗi: ${message}`, 'assertive')
  }
  
  /**
   * Remove error from form field
   */
  const removeFieldError = (fieldId) => {
    const field = document.getElementById(fieldId)
    if (!field) return
    
    field.removeAttribute('aria-invalid')
    field.removeAttribute('aria-describedby')
    
    const errorEl = document.getElementById(`${fieldId}-error`)
    if (errorEl) {
      errorEl.remove()
    }
  }

  // ===== SAVE/LOAD PREFERENCES =====
  
  /**
   * Save accessibility preferences
   */
  const savePreferences = () => {
    const prefs = {
      fontSize: fontSize.value,
      highContrast: highContrastMode.value,
      reducedMotion: reducedMotion.value,
      keyboardMode: keyboardMode.value
    }
    
    localStorage.setItem('accessibilityPreferences', JSON.stringify(prefs))
  }
  
  /**
   * Load accessibility preferences
   */
  const loadPreferences = () => {
    const saved = localStorage.getItem('accessibilityPreferences')
    if (!saved) return
    
    try {
      const prefs = JSON.parse(saved)
      
      if (prefs.fontSize) {
        fontSize.value = prefs.fontSize
        applyFontSize()
      }
      
      if (prefs.highContrast) {
        enableHighContrast()
      }
      
      if (prefs.keyboardMode) {
        enableKeyboardMode()
      }
    } catch (error) {
      console.error('Failed to load accessibility preferences:', error)
    }
  }

  // ===== INITIALIZATION =====
  
  onMounted(() => {
    // Create ARIA live region
    createLiveRegion()
    
    // Create skip links
    createSkipLinks()
    
    // Detect preferences
    detectScreenReader()
    detectReducedMotion()
    
    // Load saved preferences
    loadPreferences()
    
    // Enable keyboard mode on first Tab
    const handleFirstTab = (event) => {
      if (event.key === 'Tab') {
        enableKeyboardMode()
        document.removeEventListener('keydown', handleFirstTab)
      }
    }
    document.addEventListener('keydown', handleFirstTab)
  })
  
  onUnmounted(() => {
    deactivateFocusTrap()
    disableKeyboardMode()
    
    // Remove ARIA live region
    const liveRegion = document.getElementById('aria-live-region')
    if (liveRegion) {
      liveRegion.remove()
    }
  })
  
  // Watch preferences and save
  watch(accessibilityPreferences, () => {
    savePreferences()
  }, { deep: true })

  return {
    // State
    focusTrapActive: computed(() => focusTrapActive.value),
    announcements: computed(() => announcements.value),
    keyboardMode: computed(() => keyboardMode.value),
    screenReaderMode: computed(() => screenReaderMode.value),
    highContrastMode: computed(() => highContrastMode.value),
    fontSize: computed(() => fontSize.value),
    reducedMotion: computed(() => reducedMotion.value),
    isAccessibilityEnabled,
    accessibilityPreferences,
    
    // ARIA announcements
    announce,
    
    // Focus management
    activateFocusTrap,
    deactivateFocusTrap,
    getFocusableElements,
    
    // Keyboard navigation
    enableKeyboardMode,
    disableKeyboardMode,
    focusNext,
    focusPrevious,
    
    // Color contrast
    checkContrast,
    enableHighContrast,
    disableHighContrast,
    
    // Font size
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    
    // Form validation
    addFieldError,
    removeFieldError,
    
    // Preferences
    savePreferences,
    loadPreferences
  }
}
