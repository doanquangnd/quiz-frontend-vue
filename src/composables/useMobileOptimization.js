// Mobile Performance Optimization Composable
import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useMobileOptimization() {
  // Device capabilities
  const deviceInfo = ref({
    isMobile: false,
    isTouchDevice: false,
    connectionType: 'unknown',
    isSlowConnection: false,
    isLowEndDevice: false,
    hasLimitedStorage: false,
    batteryLevel: null,
    isLowBattery: false
  })

  // Performance metrics
  const performanceMetrics = ref({
    memoryUsage: null,
    cpuUsage: null,
    networkLatency: null,
    renderTime: null,
    loadTime: null
  })

  // Optimization settings
  const optimizationSettings = ref({
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableReducedAnimations: false,
    enableOfflineMode: false,
    enablePrefetching: true,
    enableCompression: true
  })

  // Computed properties
  const shouldOptimizeForPerformance = computed(() => {
    return deviceInfo.value.isSlowConnection || 
           deviceInfo.value.isLowEndDevice || 
           deviceInfo.value.isLowBattery
  })

  const shouldReduceAnimations = computed(() => {
    return optimizationSettings.value.enableReducedAnimations || 
           deviceInfo.value.isLowEndDevice ||
           deviceInfo.value.isLowBattery
  })

  const shouldEnableOfflineMode = computed(() => {
    return optimizationSettings.value.enableOfflineMode || 
           deviceInfo.value.isSlowConnection
  })

  // Device detection
  const detectDevice = () => {
    const userAgent = navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    deviceInfo.value.isMobile = isMobile
    deviceInfo.value.isTouchDevice = isTouchDevice

    // Detect low-end device based on hardware concurrency and memory
    const cores = navigator.hardwareConcurrency || 1
    const memory = navigator.deviceMemory || 4 // Default to 4GB if unknown
    
    deviceInfo.value.isLowEndDevice = cores < 4 || memory < 4

    // Detect connection type
    if ('connection' in navigator) {
      const connection = navigator.connection
      deviceInfo.value.connectionType = connection.effectiveType || 'unknown'
      deviceInfo.value.isSlowConnection = connection.effectiveType === 'slow-2g' || 
                                        connection.effectiveType === '2g' ||
                                        connection.saveData === true
    }

    // Detect storage availability
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        const availableSpace = estimate.quota - estimate.usage
        const availableGB = availableSpace / (1024 * 1024 * 1024)
        deviceInfo.value.hasLimitedStorage = availableGB < 1 // Less than 1GB
      })
    }
  }

  // Battery monitoring
  const monitorBattery = async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery()
        deviceInfo.value.batteryLevel = Math.round(battery.level * 100)
        deviceInfo.value.isLowBattery = battery.level < 0.2 && !battery.charging

        // Monitor battery changes
        battery.addEventListener('levelchange', () => {
          deviceInfo.value.batteryLevel = Math.round(battery.level * 100)
          deviceInfo.value.isLowBattery = battery.level < 0.2 && !battery.charging
        })

        battery.addEventListener('chargingchange', () => {
          deviceInfo.value.isLowBattery = battery.level < 0.2 && !battery.charging
        })
      } catch (error) {
        console.warn('Battery API not supported:', error)
      }
    }
  }

  // Performance monitoring
  const measurePerformance = () => {
    // Memory usage
    if ('memory' in performance) {
      performanceMetrics.value.memoryUsage = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) // MB
      }
    }

    // Navigation timing
    if (performance.navigation && performance.timing) {
      const timing = performance.timing
      const loadTime = timing.loadEventEnd - timing.navigationStart
      performanceMetrics.value.loadTime = loadTime
    }

    // Measure render time
    const renderStart = performance.now()
    requestAnimationFrame(() => {
      performanceMetrics.value.renderTime = performance.now() - renderStart
    })
  }

  // Network latency measurement
  const measureNetworkLatency = () => {
    const start = performance.now()
    fetch('/api/ping', { 
      method: 'HEAD',
      cache: 'no-cache'
    })
    .then(() => {
      performanceMetrics.value.networkLatency = performance.now() - start
    })
    .catch(() => {
      performanceMetrics.value.networkLatency = null
    })
  }

  // Image optimization
  const optimizeImage = (src, options = {}) => {
    const { width, height, quality = 80 } = options
    
    if (!deviceInfo.value.isMobile) {
      return src
    }

    // Reduce quality for slow connections
    let optimizedQuality = quality
    if (deviceInfo.value.isSlowConnection) {
      optimizedQuality = Math.max(quality - 20, 40)
    }

    // Reduce dimensions for mobile
    if (deviceInfo.value.isMobile) {
      const scale = deviceInfo.value.isLowEndDevice ? 0.6 : 0.8
      if (width) width *= scale
      if (height) height *= scale
    }

    // Add query parameters for optimization
    const params = new URLSearchParams()
    if (width) params.set('w', Math.round(width))
    if (height) params.set('h', Math.round(height))
    params.set('q', optimizedQuality)
    params.set('f', 'webp') // Prefer WebP format

    return `${src}?${params.toString()}`
  }

  // Lazy loading implementation
  const setupLazyLoading = () => {
    if (!optimizationSettings.value.enableLazyLoading) return

    const lazyImages = document.querySelectorAll('img[data-src]')
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            const src = img.dataset.src
            
            if (src) {
              img.src = optimizeImage(src, {
                width: img.dataset.width,
                height: img.dataset.height,
                quality: img.dataset.quality
              })
              img.classList.remove('lazy')
              observer.unobserve(img)
            }
          }
        })
      }, {
        rootMargin: '50px 0px', // Start loading 50px before image comes into view
        threshold: 0.01
      })

      lazyImages.forEach(img => imageObserver.observe(img))
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => {
        const src = img.dataset.src
        if (src) {
          img.src = optimizeImage(src, {
            width: img.dataset.width,
            height: img.dataset.height,
            quality: img.dataset.quality
          })
          img.classList.remove('lazy')
        }
      })
    }
  }

  // Prefetching strategy
  const prefetchResources = (resources) => {
    if (!optimizationSettings.value.enablePrefetching || deviceInfo.value.isSlowConnection) {
      return
    }

    resources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = resource.url
      if (resource.type) link.as = resource.type
      document.head.appendChild(link)
    })
  }

  // Compression detection
  const enableCompression = () => {
    if (!optimizationSettings.value.enableCompression) return

    // Enable gzip compression for API requests
    const originalFetch = window.fetch
    window.fetch = (url, options = {}) => {
      options.headers = {
        ...options.headers,
        'Accept-Encoding': 'gzip, deflate, br'
      }
      return originalFetch(url, options)
    }
  }

  // Reduced animations
  const setupReducedAnimations = () => {
    if (!shouldReduceAnimations.value) return

    const style = document.createElement('style')
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `
    document.head.appendChild(style)
  }

  // Memory management
  const optimizeMemory = () => {
    if (deviceInfo.value.isLowEndDevice) {
      // Clear unused images from memory
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        if (!img.complete || img.naturalHeight === 0) {
          img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        }
      })

      // Limit concurrent requests
      const maxConcurrentRequests = 2
      let activeRequests = 0
      const requestQueue = []

      const originalFetch = window.fetch
      window.fetch = (...args) => {
        return new Promise((resolve, reject) => {
          const request = () => {
            if (activeRequests < maxConcurrentRequests) {
              activeRequests++
              originalFetch(...args)
                .then(resolve)
                .catch(reject)
                .finally(() => {
                  activeRequests--
                  if (requestQueue.length > 0) {
                    const nextRequest = requestQueue.shift()
                    nextRequest()
                  }
                })
            } else {
              requestQueue.push(request)
            }
          }
          request()
        })
      }
    }
  }

  // Network optimization
  const optimizeNetwork = () => {
    if (deviceInfo.value.isSlowConnection) {
      // Disable prefetching
      optimizationSettings.value.enablePrefetching = false
      
      // Reduce image quality
      optimizationSettings.value.enableImageOptimization = true
      
      // Enable offline mode
      optimizationSettings.value.enableOfflineMode = true
    }
  }

  // Initialize optimizations
  const initializeOptimizations = () => {
    detectDevice()
    monitorBattery()
    measurePerformance()
    
    // Apply optimizations based on device capabilities
    if (shouldOptimizeForPerformance.value) {
      setupReducedAnimations()
      optimizeMemory()
      optimizeNetwork()
    }
    
    setupLazyLoading()
    enableCompression()
    
    // Prefetch critical resources
    const criticalResources = [
      { url: '/api/questions', type: 'fetch' },
      { url: '/api/exams', type: 'fetch' }
    ]
    prefetchResources(criticalResources)
  }

  // Performance monitoring interval
  let performanceInterval = null
  
  const startPerformanceMonitoring = () => {
    if (performanceInterval) return
    
    performanceInterval = setInterval(() => {
      measurePerformance()
      measureNetworkLatency()
    }, 30000) // Monitor every 30 seconds
  }

  const stopPerformanceMonitoring = () => {
    if (performanceInterval) {
      clearInterval(performanceInterval)
      performanceInterval = null
    }
  }

  // Cleanup
  onMounted(() => {
    initializeOptimizations()
    startPerformanceMonitoring()
  })

  onUnmounted(() => {
    stopPerformanceMonitoring()
  })

  return {
    deviceInfo: computed(() => deviceInfo.value),
    performanceMetrics: computed(() => performanceMetrics.value),
    optimizationSettings: computed(() => optimizationSettings.value),
    shouldOptimizeForPerformance,
    shouldReduceAnimations,
    shouldEnableOfflineMode,
    optimizeImage,
    setupLazyLoading,
    prefetchResources,
    measurePerformance,
    measureNetworkLatency
  }
}
