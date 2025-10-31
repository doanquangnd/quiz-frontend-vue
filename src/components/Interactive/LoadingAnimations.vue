<template>
  <div class="loading-animations-wrapper">
    <!-- Skeleton loading -->
    <div v-if="type === 'skeleton'" class="skeleton-container" :class="containerClass">
      <div v-for="i in lines" :key="i" class="skeleton-line" :class="lineClass"></div>
    </div>

    <!-- Spinner loading -->
    <div v-else-if="type === 'spinner'" class="spinner-container" :class="containerClass">
      <div class="spinner" :class="spinnerClass">
        <div class="spinner-ring"></div>
      </div>
      <div v-if="text" class="loading-text">{{ text }}</div>
    </div>

    <!-- Dots loading -->
    <div v-else-if="type === 'dots'" class="dots-container" :class="containerClass">
      <div class="loading-dots">
        <div v-for="i in 3" :key="i" class="dot"></div>
      </div>
      <div v-if="text" class="loading-text">{{ text }}</div>
    </div>

    <!-- Bars loading -->
    <div v-else-if="type === 'bars'" class="bars-container" :class="containerClass">
      <div class="loading-bars">
        <div v-for="i in 4" :key="i" class="bar"></div>
      </div>
      <div v-if="text" class="loading-text">{{ text }}</div>
    </div>

    <!-- Pulse loading -->
    <div v-else-if="type === 'pulse'" class="pulse-container" :class="containerClass">
      <div class="pulse-circle" :class="pulseClass"></div>
      <div v-if="text" class="loading-text">{{ text }}</div>
    </div>

    <!-- Card skeleton -->
    <div v-else-if="type === 'card'" class="card-skeleton" :class="containerClass">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-subtitle"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    </div>

    <!-- Quiz skeleton -->
    <div v-else-if="type === 'quiz'" class="quiz-skeleton" :class="containerClass">
      <div class="quiz-header-skeleton">
        <div class="skeleton-counter"></div>
        <div class="skeleton-progress"></div>
      </div>
      <div class="quiz-content-skeleton">
        <div class="skeleton-question"></div>
        <div class="skeleton-choices">
          <div v-for="i in 4" :key="i" class="skeleton-choice"></div>
        </div>
      </div>
    </div>

    <!-- Progress loading -->
    <div v-else-if="type === 'progress'" class="progress-container" :class="containerClass">
      <div class="progress-header">
        <div class="progress-text">{{ text || 'Đang tải...' }}</div>
        <div class="progress-percentage">{{ Math.round(progress) }}%</div>
      </div>
      <div class="progress-bar-wrapper">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- Custom loading with slots -->
    <div v-else class="custom-container" :class="containerClass">
      <slot>
        <div class="default-spinner">
          <div class="spinner-ring"></div>
        </div>
        <div v-if="text" class="loading-text">{{ text }}</div>
      </slot>
    </div>

    <!-- Overlay mode -->
    <div v-if="overlay" class="loading-overlay">
      <div class="overlay-content">
        <slot name="overlay">
          <div class="spinner">
            <div class="spinner-ring"></div>
          </div>
          <div v-if="text" class="loading-text">{{ text }}</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // Loading type
  type: {
    type: String,
    default: 'spinner',
    validator: (value) => [
      'skeleton', 'spinner', 'dots', 'bars', 'pulse', 
      'card', 'quiz', 'progress', 'custom'
    ].includes(value)
  },
  
  // Text to display
  text: {
    type: String,
    default: ''
  },
  
  // Size variants
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  
  // Color variants
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
  },
  
  // Skeleton configuration
  lines: {
    type: Number,
    default: 3
  },
  
  // Progress configuration
  progress: {
    type: Number,
    default: 0
  },
  
  // Overlay mode
  overlay: {
    type: Boolean,
    default: false
  },
  
  // Auto progress simulation
  autoProgress: {
    type: Boolean,
    default: false
  },
  
  // Custom classes
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['progress-complete'])

// Reactive state
let progressInterval = null

// Computed properties
const containerClass = computed(() => [
  `loading-${props.size}`,
  `loading-${props.variant}`,
  {
    'loading-overlay-mode': props.overlay
  },
  props.customClass
])

const spinnerClass = computed(() => [
  `spinner-${props.size}`,
  `spinner-${props.variant}`
])

const lineClass = computed(() => [
  `skeleton-line-${props.size}`,
  `skeleton-${props.variant}`
])

const pulseClass = computed(() => [
  `pulse-${props.size}`,
  `pulse-${props.variant}`
])

// Auto progress simulation
const simulateProgress = () => {
  if (!props.autoProgress) return
  
  let currentProgress = 0
  const targetProgress = 100
  const increment = Math.random() * 10 + 5 // 5-15% increments
  
  progressInterval = setInterval(() => {
    currentProgress += increment
    
    if (currentProgress >= targetProgress) {
      currentProgress = targetProgress
      clearInterval(progressInterval)
      emit('progress-complete')
    }
    
    // Emit progress update
    emit('progress-update', currentProgress)
  }, 200 + Math.random() * 300) // Random delay between 200-500ms
}

// Lifecycle
onMounted(() => {
  if (props.autoProgress) {
    simulateProgress()
  }
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>

<style scoped>
/* ===== LOADING ANIMATIONS STYLES ===== */

.loading-animations-wrapper {
  position: relative;
  display: inline-block;
}

/* ===== CONTAINER VARIANTS ===== */
.loading-small {
  font-size: 0.875rem;
}

.loading-medium {
  font-size: 1rem;
}

.loading-large {
  font-size: 1.125rem;
}

/* ===== SKELETON LOADING ===== */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-line-small {
  height: 0.75rem;
}

.skeleton-line-large {
  height: 1.25rem;
}

.skeleton-line:last-child {
  width: 60%;
}

/* ===== SPINNER LOADING ===== */
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  display: inline-block;
  border-radius: 50%;
  border: 3px solid rgba(79, 70, 229, 0.1);
  border-top: 3px solid var(--color-primary);
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.spinner-medium {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

.spinner-ring {
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* ===== DOTS LOADING ===== */
.dots-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-dots {
  display: inline-flex;
  gap: 4px;
}

.loading-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-primary);
  animation: dots 1.4s infinite ease-in-out both;
}

.loading-dots .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots .dot:nth-child(2) {
  animation-delay: -0.16s;
}

.loading-dots .dot:nth-child(3) {
  animation-delay: 0s;
}

.loading-small .loading-dots .dot {
  width: 6px;
  height: 6px;
}

.loading-large .loading-dots .dot {
  width: 12px;
  height: 12px;
}

/* ===== BARS LOADING ===== */
.bars-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-bars {
  display: inline-flex;
  gap: 2px;
  align-items: end;
  height: 20px;
}

.loading-bars .bar {
  width: 4px;
  background-color: var(--color-primary);
  animation: bars 1.2s infinite ease-in-out;
}

.loading-bars .bar:nth-child(1) {
  animation-delay: -1.1s;
}

.loading-bars .bar:nth-child(2) {
  animation-delay: -1.0s;
}

.loading-bars .bar:nth-child(3) {
  animation-delay: -0.9s;
}

.loading-bars .bar:nth-child(4) {
  animation-delay: -0.8s;
}

.loading-small .loading-bars {
  height: 16px;
}

.loading-small .loading-bars .bar {
  width: 3px;
}

.loading-large .loading-bars {
  height: 28px;
}

.loading-large .loading-bars .bar {
  width: 6px;
}

/* ===== PULSE LOADING ===== */
.pulse-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.pulse-circle {
  border-radius: 50%;
  background-color: var(--color-primary);
  animation: pulse 1.5s infinite;
}

.pulse-small {
  width: 20px;
  height: 20px;
}

.pulse-medium {
  width: 32px;
  height: 32px;
}

.pulse-large {
  width: 48px;
  height: 48px;
}

/* ===== CARD SKELETON ===== */
.card-skeleton {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-title {
  height: 1.25rem;
  width: 60%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-subtitle {
  height: 1rem;
  width: 40%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-text {
  height: 1rem;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-text.short {
  width: 80%;
}

/* ===== QUIZ SKELETON ===== */
.quiz-skeleton {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.quiz-header-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.skeleton-counter {
  width: 80px;
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 20px;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-progress {
  width: 200px;
  height: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite;
}

.quiz-content-skeleton {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.skeleton-question {
  height: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 12px;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-choices {
  display: grid;
  gap: 1rem;
}

.skeleton-choice {
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 12px;
  animation: skeleton-loading 1.5s infinite;
}

/* ===== PROGRESS LOADING ===== */
.progress-container {
  width: 100%;
  max-width: 400px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-text {
  font-weight: 500;
  color: var(--color-text-dark);
}

.progress-percentage {
  font-weight: 600;
  color: var(--color-primary);
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 4px;
  transition: width 0.3s ease;
  animation: progress-shimmer 2s infinite;
}

/* ===== LOADING TEXT ===== */
.loading-text {
  font-weight: 500;
  color: var(--color-text-dark);
  text-align: center;
}

/* ===== OVERLAY MODE ===== */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  text-align: center;
}

/* ===== COLOR VARIANTS ===== */
.loading-primary .spinner,
.loading-primary .spinner-ring,
.loading-primary .dot,
.loading-primary .bar,
.loading-primary .pulse-circle,
.loading-primary .progress-bar {
  border-top-color: var(--color-primary);
  background-color: var(--color-primary);
}

.loading-secondary .spinner,
.loading-secondary .spinner-ring,
.loading-secondary .dot,
.loading-secondary .bar,
.loading-secondary .pulse-circle,
.loading-secondary .progress-bar {
  border-top-color: #6b7280;
  background-color: #6b7280;
}

.loading-success .spinner,
.loading-success .spinner-ring,
.loading-success .dot,
.loading-success .bar,
.loading-success .pulse-circle,
.loading-success .progress-bar {
  border-top-color: #10b981;
  background-color: #10b981;
}

.loading-danger .spinner,
.loading-danger .spinner-ring,
.loading-danger .dot,
.loading-danger .bar,
.loading-danger .pulse-circle,
.loading-danger .progress-bar {
  border-top-color: #ef4444;
  background-color: #ef4444;
}

.loading-warning .spinner,
.loading-warning .spinner-ring,
.loading-warning .dot,
.loading-warning .bar,
.loading-warning .pulse-circle,
.loading-warning .progress-bar {
  border-top-color: #f59e0b;
  background-color: #f59e0b;
}

.loading-info .spinner,
.loading-info .spinner-ring,
.loading-info .dot,
.loading-info .bar,
.loading-info .pulse-circle,
.loading-info .progress-bar {
  border-top-color: #3b82f6;
  background-color: #3b82f6;
}

/* ===== ANIMATIONS ===== */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dots {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bars {
  0%, 80%, 100% {
    transform: scaleY(0.4);
  }
  40% {
    transform: scaleY(1.0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  70% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
}

@keyframes progress-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 768px) {
  .card-skeleton {
    padding: 1rem;
  }
  
  .quiz-skeleton {
    padding: 1.5rem;
  }
  
  .overlay-content {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  /* Reduce animation complexity on mobile */
  .skeleton-line,
  .skeleton-avatar,
  .skeleton-title,
  .skeleton-subtitle,
  .skeleton-text,
  .skeleton-counter,
  .skeleton-progress,
  .skeleton-question,
  .skeleton-choice {
    animation-duration: 2s;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  .skeleton-line,
  .skeleton-avatar,
  .skeleton-title,
  .skeleton-subtitle,
  .skeleton-text,
  .skeleton-counter,
  .skeleton-progress,
  .skeleton-question,
  .skeleton-choice,
  .spinner,
  .spinner-ring,
  .dot,
  .bar,
  .pulse-circle,
  .progress-bar {
    animation: none !important;
  }
  
  .loading-overlay {
    backdrop-filter: none;
  }
}
</style>
