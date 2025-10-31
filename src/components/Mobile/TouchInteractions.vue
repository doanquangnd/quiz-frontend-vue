<template>
  <div class="touch-interactions">
    <!-- Touch Feedback Component -->
    <div 
      v-if="showTouchFeedback"
      class="touch-feedback"
      :style="touchFeedbackStyle"
    ></div>

    <!-- Swipe Gesture Handler -->
    <div 
      class="swipe-container"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchCancel"
    >
      <slot></slot>
    </div>

    <!-- Pull to Refresh -->
    <div 
      v-if="enablePullToRefresh"
      class="pull-to-refresh"
      :class="{ active: isPulling, refreshing: isRefreshing }"
    >
      <div class="pull-indicator">
        <i class="fas fa-arrow-down pull-icon" :class="{ rotate: isPulling }"></i>
        <span class="pull-text">
          {{ pullText }}
        </span>
      </div>
    </div>

    <!-- Long Press Handler -->
    <div 
      v-if="enableLongPress"
      class="long-press-container"
      @touchstart="handleLongPressStart"
      @touchend="handleLongPressEnd"
      @touchcancel="handleLongPressCancel"
    >
      <slot name="long-press"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  enableSwipe: {
    type: Boolean,
    default: true
  },
  enablePullToRefresh: {
    type: Boolean,
    default: true
  },
  enableLongPress: {
    type: Boolean,
    default: false
  },
  longPressDelay: {
    type: Number,
    default: 500
  },
  swipeThreshold: {
    type: Number,
    default: 50
  },
  pullThreshold: {
    type: Number,
    default: 80
  }
})

// Emits
const emit = defineEmits([
  'swipe-left',
  'swipe-right',
  'swipe-up',
  'swipe-down',
  'pull-to-refresh',
  'long-press',
  'tap'
])

// Touch state
const touchStart = ref(null)
const touchCurrent = ref(null)
const isSwipe = ref(false)
const isPulling = ref(false)
const isRefreshing = ref(false)
const showTouchFeedback = ref(false)
const touchFeedbackStyle = ref({})
const longPressTimer = ref(null)

// Computed
const pullText = computed(() => {
  if (isRefreshing.value) return 'Đang tải...'
  if (isPulling.value) return 'Kéo để làm mới'
  return 'Kéo xuống để làm mới'
})

// Touch handlers
const handleTouchStart = (event) => {
  if (!props.enableSwipe) return
  
  const touch = event.touches[0]
  touchStart.value = {
    x: touch.clientX,
    y: touch.clientY,
    time: Date.now()
  }
  
  touchCurrent.value = { ...touchStart.value }
  isSwipe.value = false
  
  // Show touch feedback
  showTouchFeedback.value = true
  touchFeedbackStyle.value = {
    left: touch.clientX + 'px',
    top: touch.clientY + 'px',
    transform: 'scale(0)'
  }
  
  // Trigger tap feedback animation
  setTimeout(() => {
    touchFeedbackStyle.value.transform = 'scale(1)'
  }, 10)
}

const handleTouchMove = (event) => {
  if (!props.enableSwipe || !touchStart.value) return
  
  const touch = event.touches[0]
  touchCurrent.value = {
    x: touch.clientX,
    y: touch.clientY,
    time: Date.now()
  }
  
  const deltaX = touchCurrent.value.x - touchStart.value.x
  const deltaY = touchCurrent.value.y - touchStart.value.y
  
  // Determine if this is a swipe
  if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
    isSwipe.value = true
  }
  
  // Handle pull to refresh
  if (props.enablePullToRefresh && window.scrollY === 0 && deltaY > 0) {
    event.preventDefault()
    isPulling.value = true
  }
  
  // Update touch feedback position
  touchFeedbackStyle.value = {
    left: touch.clientX + 'px',
    top: touch.clientY + 'px',
    transform: 'scale(1)'
  }
}

const handleTouchEnd = (event) => {
  if (!props.enableSwipe || !touchStart.value) return
  
  const touch = event.changedTouches[0]
  const endTime = Date.now()
  const duration = endTime - touchStart.value.time
  
  const deltaX = touch.clientX - touchStart.value.x
  const deltaY = touch.clientY - touchStart.value.y
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  
  // Hide touch feedback
  showTouchFeedback.value = false
  
  // Handle pull to refresh
  if (isPulling.value) {
    isPulling.value = false
    if (deltaY > props.pullThreshold) {
      handlePullToRefresh()
    }
    return
  }
  
  // Handle swipe gestures
  if (isSwipe.value && distance > props.swipeThreshold && duration < 300) {
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI
    
    if (angle > -45 && angle < 45) {
      emit('swipe-right', { deltaX, deltaY, duration })
    } else if (angle > 135 || angle < -135) {
      emit('swipe-left', { deltaX, deltaY, duration })
    } else if (angle > 45 && angle < 135) {
      emit('swipe-down', { deltaX, deltaY, duration })
    } else if (angle > -135 && angle < -45) {
      emit('swipe-up', { deltaX, deltaY, duration })
    }
  } else if (!isSwipe.value && duration < 200) {
    // Handle tap
    emit('tap', { x: touch.clientX, y: touch.clientY })
  }
  
  // Reset state
  touchStart.value = null
  touchCurrent.value = null
  isSwipe.value = false
}

const handleTouchCancel = () => {
  showTouchFeedback.value = false
  touchStart.value = null
  touchCurrent.value = null
  isSwipe.value = false
  isPulling.value = false
}

// Pull to refresh
const handlePullToRefresh = async () => {
  isRefreshing.value = true
  emit('pull-to-refresh')
  
  // Simulate refresh delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  isRefreshing.value = false
}

// Long press handlers
const handleLongPressStart = (event) => {
  if (!props.enableLongPress) return
  
  longPressTimer.value = setTimeout(() => {
    const touch = event.touches[0]
    emit('long-press', { x: touch.clientX, y: touch.clientY })
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }, props.longPressDelay)
}

const handleLongPressEnd = () => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

const handleLongPressCancel = () => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

// Cleanup
onUnmounted(() => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
  }
})
</script>

<style scoped>
/* Touch Interactions Styles */
.touch-interactions {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Touch Feedback */
.touch-feedback {
  position: fixed;
  width: 60px;
  height: 60px;
  background: rgba(79, 70, 229, 0.3);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease-out;
  animation: touch-feedback-pulse 0.3s ease-out;
}

@keyframes touch-feedback-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

/* Swipe Container */
.swipe-container {
  width: 100%;
  height: 100%;
  touch-action: pan-y;
}

/* Pull to Refresh */
.pull-to-refresh {
  position: fixed;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  transition: top 0.3s ease;
  background: var(--bg-primary);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-md) var(--space-lg);
}

.pull-to-refresh.active {
  top: 0;
}

.pull-to-refresh.refreshing {
  top: 0;
}

.pull-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

.pull-icon {
  font-size: var(--font-size-lg);
  color: var(--primary-color);
  transition: transform 0.3s ease;
}

.pull-icon.rotate {
  transform: rotate(180deg);
}

.pull-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

/* Long Press Container */
.long-press-container {
  width: 100%;
  height: 100%;
}

/* Touch-friendly button styles */
.touch-button {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.touch-button:active {
  transform: scale(0.95);
  background-color: rgba(79, 70, 229, 0.1);
}

/* Swipe indicators */
.swipe-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 40px;
  background: var(--primary-color);
  border-radius: 2px;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.swipe-indicator.left {
  left: var(--space-md);
}

.swipe-indicator.right {
  right: var(--space-md);
}

.swipe-indicator.active {
  opacity: 1;
}

/* Mobile-specific touch improvements */
@media (max-width: 767px) {
  .touch-button {
    min-height: 48px;
    padding: var(--space-md) var(--space-lg);
  }
  
  .swipe-container {
    touch-action: pan-y pinch-zoom;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .touch-feedback {
    background: rgba(79, 70, 229, 0.5);
    border: 2px solid var(--primary-color);
  }
  
  .pull-to-refresh {
    border: 2px solid var(--border-color);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .touch-feedback,
  .pull-to-refresh,
  .pull-icon {
    transition: none;
    animation: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .pull-to-refresh {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
  }
}
</style>
