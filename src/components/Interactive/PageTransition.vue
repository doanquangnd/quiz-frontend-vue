<template>
  <div class="page-transition-wrapper">
    <!-- Loading overlay -->
    <Transition name="fade">
      <div v-if="isLoading" class="page-loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
          </div>
          <div class="loading-text">{{ loadingText }}</div>
          <div class="loading-progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Page content with transition -->
    <Transition 
      :name="transitionName" 
      mode="out-in"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div 
        :key="pageKey" 
        class="page-content"
        :class="pageClasses"
      >
        <slot></slot>
      </div>
    </Transition>

    <!-- Navigation breadcrumb -->
    <div v-if="showBreadcrumb" class="page-breadcrumb">
      <div class="breadcrumb-items">
        <span 
          v-for="(item, index) in breadcrumbItems" 
          :key="item.path"
          class="breadcrumb-item"
        >
          <router-link 
            v-if="index < breadcrumbItems.length - 1"
            :to="item.path"
            class="breadcrumb-link"
          >
            {{ item.name }}
          </router-link>
          <span v-else class="breadcrumb-current">
            {{ item.name }}
          </span>
          <i 
            v-if="index < breadcrumbItems.length - 1" 
            class="fas fa-chevron-right breadcrumb-separator"
          ></i>
        </span>
      </div>
    </div>

    <!-- Page progress indicator -->
    <div v-if="showProgress" class="page-progress">
      <div class="progress-line" :style="{ width: pageProgress + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  // Transition configuration
  transitionType: {
    type: String,
    default: 'fade',
    validator: (value) => ['fade', 'slide', 'scale', 'flip', 'custom'].includes(value)
  },
  transitionDirection: {
    type: String,
    default: 'forward',
    validator: (value) => ['forward', 'backward', 'up', 'down', 'left', 'right'].includes(value)
  },
  
  // Loading configuration
  loadingText: {
    type: String,
    default: 'Đang tải...'
  },
  showLoading: {
    type: Boolean,
    default: true
  },
  
  // Progress configuration
  showProgress: {
    type: Boolean,
    default: true
  },
  progress: {
    type: Number,
    default: 0
  },
  
  // Breadcrumb configuration
  showBreadcrumb: {
    type: Boolean,
    default: false
  },
  breadcrumbItems: {
    type: Array,
    default: () => []
  },
  
  // Page configuration
  pageTitle: {
    type: String,
    default: ''
  },
  pageSubtitle: {
    type: String,
    default: ''
  },
  
  // Custom classes
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['before-enter', 'enter', 'after-enter', 'before-leave', 'leave', 'after-leave', 'loading-start', 'loading-end'])

// Reactive state
const isLoading = ref(false)
const pageKey = ref(0)
const pageProgress = ref(0)
const transitionName = ref('fade')

const route = useRoute()
const router = useRouter()

// Computed properties
const pageClasses = computed(() => [
  'page-transition-content',
  `page-${props.transitionType}`,
  `page-${props.transitionDirection}`,
  {
    'page-loading': isLoading.value,
    'page-loaded': !isLoading.value
  },
  props.customClass
])

// Methods
const startLoading = () => {
  isLoading.value = true
  emit('loading-start')
}

const endLoading = () => {
  isLoading.value = false
  emit('loading-end')
}

const updateProgress = (value) => {
  pageProgress.value = Math.max(0, Math.min(100, value))
}

const updateTransition = (type, direction) => {
  transitionName.value = `${type}-${direction}`
}

const refreshPage = () => {
  pageKey.value++
  startLoading()
  
  // Simulate loading time
  setTimeout(() => {
    endLoading()
  }, 500)
}

// Transition event handlers
const onBeforeEnter = (el) => {
  el.style.opacity = '0'
  el.style.transform = getInitialTransform()
  emit('before-enter', el)
}

const onEnter = (el, done) => {
  nextTick(() => {
    el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    el.style.opacity = '1'
    el.style.transform = 'translateX(0) translateY(0) scale(1)'
    
    setTimeout(done, 400)
  })
  emit('enter', el)
}

const onAfterEnter = (el) => {
  el.style.transition = ''
  emit('after-enter', el)
}

const onBeforeLeave = (el) => {
  emit('before-leave', el)
}

const onLeave = (el, done) => {
  el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  el.style.opacity = '0'
  el.style.transform = getExitTransform()
  
  setTimeout(done, 300)
  emit('leave', el)
}

const onAfterLeave = (el) => {
  el.style.transition = ''
  emit('after-leave', el)
}

// Helper functions
const getInitialTransform = () => {
  const direction = props.transitionDirection
  
  switch (direction) {
    case 'forward':
    case 'right':
      return 'translateX(30px)'
    case 'backward':
    case 'left':
      return 'translateX(-30px)'
    case 'up':
      return 'translateY(30px)'
    case 'down':
      return 'translateY(-30px)'
    default:
      return 'translateY(20px)'
  }
}

const getExitTransform = () => {
  const direction = props.transitionDirection
  
  switch (direction) {
    case 'forward':
    case 'right':
      return 'translateX(-30px)'
    case 'backward':
    case 'left':
      return 'translateX(30px)'
    case 'up':
      return 'translateY(-30px)'
    case 'down':
      return 'translateY(30px)'
    default:
      return 'translateY(-20px)'
  }
}

// Watch for route changes
watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    // Determine transition direction based on route depth
    const newDepth = newPath.split('/').length
    const oldDepth = oldPath.split('/').length
    
    if (newDepth > oldDepth) {
      updateTransition(props.transitionType, 'forward')
    } else if (newDepth < oldDepth) {
      updateTransition(props.transitionType, 'backward')
    } else {
      updateTransition(props.transitionType, props.transitionDirection)
    }
    
    refreshPage()
  }
})

// Watch for progress changes
watch(() => props.progress, (newValue) => {
  updateProgress(newValue)
})

// Initialize
onMounted(() => {
  updateTransition(props.transitionType, props.transitionDirection)
  
  // Simulate initial loading
  if (props.showLoading) {
    startLoading()
    setTimeout(() => {
      endLoading()
    }, 800)
  }
})

// Expose methods
defineExpose({
  startLoading,
  endLoading,
  updateProgress,
  refreshPage,
  updateTransition
})
</script>

<style scoped>
/* ===== PAGE TRANSITION STYLES ===== */

.page-transition-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

/* ===== LOADING OVERLAY ===== */
.page-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
  max-width: 300px;
  padding: 2rem;
}

.loading-spinner {
  margin-bottom: 1.5rem;
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text-dark);
  margin-bottom: 1rem;
}

.loading-progress {
  width: 100%;
  height: 4px;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* ===== PAGE CONTENT ===== */
.page-content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--color-background-light);
}

/* ===== BREADCRUMB ===== */
.page-breadcrumb {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
  padding: 1rem 0;
}

.breadcrumb-items {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--color-secondary);
}

.breadcrumb-current {
  color: var(--color-text-dark);
  font-weight: 600;
}

.breadcrumb-separator {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* ===== PAGE PROGRESS ===== */
.page-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(79, 70, 229, 0.1);
  z-index: 1000;
}

.progress-line {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(79, 70, 229, 0.3);
}

/* ===== TRANSITION ANIMATIONS ===== */

/* Fade transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transitions */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-backward-enter-active,
.slide-backward-leave-active,
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-forward-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-forward-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-backward-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-backward-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.slide-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.slide-down-enter-from {
  transform: translateY(-30px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

.slide-left-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

/* Scale transitions */
.scale-forward-enter-active,
.scale-forward-leave-active,
.scale-backward-enter-active,
.scale-backward-leave-active,
.scale-up-enter-active,
.scale-up-leave-active,
.scale-down-enter-active,
.scale-down-leave-active,
.scale-left-enter-active,
.scale-left-leave-active,
.scale-right-enter-active,
.scale-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-forward-enter-from,
.scale-backward-enter-from,
.scale-up-enter-from,
.scale-down-enter-from,
.scale-left-enter-from,
.scale-right-enter-from {
  transform: scale(0.95);
  opacity: 0;
}

.scale-forward-leave-to,
.scale-backward-leave-to,
.scale-up-leave-to,
.scale-down-leave-to,
.scale-left-leave-to,
.scale-right-leave-to {
  transform: scale(1.05);
  opacity: 0;
}

/* Flip transitions */
.flip-forward-enter-active,
.flip-forward-leave-active,
.flip-backward-enter-active,
.flip-backward-leave-active,
.flip-up-enter-active,
.flip-up-leave-active,
.flip-down-enter-active,
.flip-down-leave-active,
.flip-left-enter-active,
.flip-left-leave-active,
.flip-right-enter-active,
.flip-right-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-forward-enter-from {
  transform: rotateY(-90deg);
  opacity: 0;
}

.flip-forward-leave-to {
  transform: rotateY(90deg);
  opacity: 0;
}

.flip-backward-enter-from {
  transform: rotateY(90deg);
  opacity: 0;
}

.flip-backward-leave-to {
  transform: rotateY(-90deg);
  opacity: 0;
}

.flip-up-enter-from {
  transform: rotateX(90deg);
  opacity: 0;
}

.flip-up-leave-to {
  transform: rotateX(-90deg);
  opacity: 0;
}

.flip-down-enter-from {
  transform: rotateX(-90deg);
  opacity: 0;
}

.flip-down-leave-to {
  transform: rotateX(90deg);
  opacity: 0;
}

.flip-left-enter-from {
  transform: rotateY(90deg);
  opacity: 0;
}

.flip-left-leave-to {
  transform: rotateY(-90deg);
  opacity: 0;
}

.flip-right-enter-from {
  transform: rotateY(-90deg);
  opacity: 0;
}

.flip-right-leave-to {
  transform: rotateY(90deg);
  opacity: 0;
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 768px) {
  .loading-content {
    padding: 1.5rem;
    max-width: 280px;
  }
  
  .loading-text {
    font-size: 1rem;
  }
  
  .breadcrumb-items {
    padding: 0 0.75rem;
    font-size: 0.875rem;
  }
  
  /* Reduce animation complexity on mobile */
  .flip-forward-enter-active,
  .flip-forward-leave-active,
  .flip-backward-enter-active,
  .flip-backward-leave-active {
    transition-duration: 0.4s;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  .page-content,
  .fade-enter-active,
  .fade-leave-active,
  .slide-forward-enter-active,
  .slide-forward-leave-active,
  .scale-forward-enter-active,
  .scale-forward-leave-active,
  .flip-forward-enter-active,
  .flip-forward-leave-active {
    transition: none !important;
  }
  
  .page-loading-overlay {
    backdrop-filter: none;
  }
}
</style>
