// Animation System Composable
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

export function useAnimations() {
  // Animation state
  const isAnimating = ref(false)
  const animationQueue = ref([])
  const animationHistory = ref([])
  
  // Animation preferences
  const preferences = ref({
    reducedMotion: false,
    animationDuration: 300,
    easingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enableParticles: true,
    enableHoverEffects: true,
    enableClickFeedback: true
  })

  // Performance monitoring
  const performanceMetrics = ref({
    frameRate: 60,
    animationCount: 0,
    memoryUsage: 0
  })

  // Computed properties
  const shouldAnimate = computed(() => {
    return !preferences.value.reducedMotion && 
           performanceMetrics.value.frameRate > 30
  })

  const animationConfig = computed(() => ({
    duration: preferences.value.animationDuration,
    easing: preferences.value.easingFunction,
    fillMode: 'both'
  }))

  // Detect reduced motion preference
  const detectReducedMotion = () => {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      preferences.value.reducedMotion = mediaQuery.matches
      
      mediaQuery.addEventListener('change', (e) => {
        preferences.value.reducedMotion = e.matches
      })
    }
  }

  // Performance monitoring
  const startPerformanceMonitoring = () => {
    let lastTime = performance.now()
    let frameCount = 0
    
    const measureFrameRate = (currentTime) => {
      frameCount++
      
      if (currentTime - lastTime >= 1000) {
        performanceMetrics.value.frameRate = Math.round((frameCount * 1000) / (currentTime - lastTime))
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFrameRate)
    }
    
    requestAnimationFrame(measureFrameRate)
  }

  // Animation queue management
  const addToQueue = (animation) => {
    animationQueue.value.push({
      ...animation,
      id: Date.now() + Math.random(),
      timestamp: Date.now()
    })
    processQueue()
  }

  const processQueue = () => {
    if (isAnimating.value || animationQueue.value.length === 0) return
    
    const animation = animationQueue.value.shift()
    executeAnimation(animation)
  }

  // Core animation execution
  const executeAnimation = async (animation) => {
    if (!shouldAnimate.value) {
      animation.onComplete?.()
      return
    }

    isAnimating.value = true
    performanceMetrics.value.animationCount++

    try {
      const element = typeof animation.element === 'string' 
        ? document.querySelector(animation.element)
        : animation.element

      if (!element) {
        console.warn('Animation element not found:', animation.element)
        return
      }

      // Create animation keyframes
      const keyframes = animation.keyframes || []
      const options = {
        ...animationConfig.value,
        ...animation.options,
        id: animation.id
      }

      // Execute animation
      const animationInstance = element.animate(keyframes, options)
      
      // Handle animation events
      animationInstance.addEventListener('finish', () => {
        isAnimating.value = false
        animation.onComplete?.()
        processQueue()
      })

      animationInstance.addEventListener('cancel', () => {
        isAnimating.value = false
        animation.onCancel?.()
        processQueue()
      })

      // Store in history for debugging
      animationHistory.value.push({
        ...animation,
        startTime: Date.now(),
        element: element.tagName + (element.id ? `#${element.id}` : ''),
        className: element.className
      })

      // Limit history size
      if (animationHistory.value.length > 50) {
        animationHistory.value.shift()
      }

    } catch (error) {
      console.error('Animation execution error:', error)
      isAnimating.value = false
      animation.onError?.(error)
      processQueue()
    }
  }

  // Predefined animation functions
  const fadeIn = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      options: {
        duration: 300,
        easing: 'ease-out',
        ...options
      },
      ...options
    })
  }

  const fadeOut = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-20px)' }
      ],
      options: {
        duration: 200,
        easing: 'ease-in',
        ...options
      },
      ...options
    })
  }

  const slideInLeft = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { transform: 'translateX(-100%)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
      ],
      options: {
        duration: 400,
        easing: 'ease-out',
        ...options
      },
      ...options
    })
  }

  const slideInRight = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { transform: 'translateX(100%)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
      ],
      options: {
        duration: 400,
        easing: 'ease-out',
        ...options
      },
      ...options
    })
  }

  const slideInUp = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { transform: 'translateY(100%)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ],
      options: {
        duration: 400,
        easing: 'ease-out',
        ...options
      },
      ...options
    })
  }

  const slideInDown = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { transform: 'translateY(-100%)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ],
      options: {
        duration: 400,
        easing: 'ease-out',
        ...options
      },
      ...options
    })
  }

  const scaleIn = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { transform: 'scale(0.8)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      options: {
        duration: 300,
        easing: 'ease-out',
        ...options
      },
      ...options
    })
  }

  const scaleOut = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0.8)', opacity: 0 }
      ],
      options: {
        duration: 200,
        easing: 'ease-in',
        ...options
      },
      ...options
    })
  }

  const bounceIn = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { transform: 'scale(0.3)', opacity: 0 },
        { transform: 'scale(1.05)', opacity: 1 },
        { transform: 'scale(0.9)', opacity: 1 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      options: {
        duration: 600,
        easing: 'ease-out',
        ...options
      },
      ...options
    })
  }

  const shake = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' }
      ],
      options: {
        duration: 500,
        easing: 'ease-in-out',
        ...options
      },
      ...options
    })
  }

  const pulse = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { transform: 'scale(1)' },
        { transform: 'scale(1.05)' },
        { transform: 'scale(1)' }
      ],
      options: {
        duration: 1000,
        easing: 'ease-in-out',
        iterations: Infinity,
        ...options
      },
      ...options
    })
  }

  const wiggle = (element, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(3deg)' },
        { transform: 'rotate(-3deg)' },
        { transform: 'rotate(3deg)' },
        { transform: 'rotate(-3deg)' },
        { transform: 'rotate(0deg)' }
      ],
      options: {
        duration: 500,
        easing: 'ease-in-out',
        ...options
      },
      ...options
    })
  }

  // Progress animations
  const progressFill = (element, fromPercent = 0, toPercent = 100, options = {}) => {
    return addToQueue({
      element,
      keyframes: [
        { width: `${fromPercent}%` },
        { width: `${toPercent}%` }
      ],
      options: {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards',
        ...options
      },
      ...options
    })
  }

  // Counter animation
  const countUp = (element, fromValue = 0, toValue = 100, options = {}) => {
    const duration = options.duration || 1000
    const startTime = performance.now()
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const currentValue = Math.round(fromValue + (toValue - fromValue) * progress)
      element.textContent = currentValue
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      } else {
        options.onComplete?.()
      }
    }
    
    requestAnimationFrame(updateCounter)
  }

  // Stagger animations
  const staggerIn = (elements, animation = 'fadeIn', delay = 100) => {
    if (!Array.isArray(elements)) {
      elements = Array.from(document.querySelectorAll(elements))
    }

    elements.forEach((element, index) => {
      setTimeout(() => {
        const animFunc = animation === 'fadeIn' ? fadeIn :
                        animation === 'slideInUp' ? slideInUp :
                        animation === 'slideInLeft' ? slideInLeft :
                        animation === 'slideInRight' ? slideInRight :
                        animation === 'scaleIn' ? scaleIn :
                        bounceIn
        
        animFunc(element, { delay: index * delay })
      }, index * delay)
    })
  }

  // Page transition animations
  const pageTransition = (direction = 'forward') => {
    const page = document.querySelector('.page-content') || document.body
    
    if (direction === 'forward') {
      return fadeIn(page, { duration: 300 })
    } else {
      return fadeOut(page, { duration: 200 })
    }
  }

  // Loading animations
  const showLoading = (element, type = 'spinner') => {
    const loadingElement = document.createElement('div')
    loadingElement.className = `loading-${type}`
    loadingElement.innerHTML = getLoadingHTML(type)
    
    element.appendChild(loadingElement)
    
    return {
      hide: () => {
        fadeOut(loadingElement, { duration: 200 }).onComplete = () => {
          loadingElement.remove()
        }
      }
    }
  }

  const getLoadingHTML = (type) => {
    const loadingTypes = {
      spinner: `
        <div class="spinner">
          <div class="spinner-ring"></div>
        </div>
      `,
      dots: `
        <div class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      `,
      bars: `
        <div class="loading-bars">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      `
    }
    
    return loadingTypes[type] || loadingTypes.spinner
  }

  // Utility functions
  const waitForAnimation = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const clearQueue = () => {
    animationQueue.value = []
    isAnimating.value = false
  }

  const getAnimationHistory = () => {
    return animationHistory.value
  }

  const updatePreferences = (newPreferences) => {
    preferences.value = { ...preferences.value, ...newPreferences }
  }

  // Initialize
  onMounted(() => {
    detectReducedMotion()
    startPerformanceMonitoring()
  })

  return {
    // State
    isAnimating: computed(() => isAnimating.value),
    preferences: computed(() => preferences.value),
    performanceMetrics: computed(() => performanceMetrics.value),
    shouldAnimate,
    
    // Core functions
    addToQueue,
    executeAnimation,
    clearQueue,
    
    // Animation functions
    fadeIn,
    fadeOut,
    slideInLeft,
    slideInRight,
    slideInUp,
    slideInDown,
    scaleIn,
    scaleOut,
    bounceIn,
    shake,
    pulse,
    wiggle,
    progressFill,
    countUp,
    staggerIn,
    pageTransition,
    showLoading,
    
    // Utilities
    waitForAnimation,
    getAnimationHistory,
    updatePreferences
  }
}
