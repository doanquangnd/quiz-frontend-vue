<template>
  <!-- Micro-interactions wrapper -->
  <div class="micro-interactions-wrapper">
    <!-- Button with ripple effect -->
    <button 
      v-if="type === 'button'"
      :class="buttonClasses"
      @click="handleClick"
      @mouseenter="handleHover"
      @mouseleave="handleLeave"
      :disabled="disabled"
      ref="elementRef"
    >
      <span class="button-content">
        <slot></slot>
      </span>
      
      <!-- Ripple effect -->
      <span 
        v-for="ripple in ripples" 
        :key="ripple.id"
        class="ripple-effect"
        :style="ripple.style"
      ></span>
      
      <!-- Loading spinner -->
      <span v-if="loading" class="button-loading">
        <div class="spinner spinner-small"></div>
      </span>
    </button>

    <!-- Card with hover effects -->
    <div 
      v-else-if="type === 'card'"
      :class="cardClasses"
      @click="handleClick"
      @mouseenter="handleHover"
      @mouseleave="handleLeave"
      ref="elementRef"
    >
      <slot></slot>
      
      <!-- Hover overlay -->
      <div class="card-overlay" v-if="showOverlay"></div>
    </div>

    <!-- Input with focus effects -->
    <div 
      v-else-if="type === 'input'"
      :class="inputClasses"
      ref="elementRef"
    >
      <slot></slot>
    </div>

    <!-- Link with underline effect -->
    <a 
      v-else-if="type === 'link'"
      :class="linkClasses"
      @click="handleClick"
      @mouseenter="handleHover"
      @mouseleave="handleLeave"
      :href="href"
      ref="elementRef"
    >
      <slot></slot>
      <span class="link-underline"></span>
    </a>

    <!-- Generic interactive element -->
    <div 
      v-else
      :class="genericClasses"
      @click="handleClick"
      @mouseenter="handleHover"
      @mouseleave="handleLeave"
      ref="elementRef"
    >
      <slot></slot>
    </div>

    <!-- Success feedback -->
    <div v-if="showSuccess" class="success-feedback animate-bounce-in">
      <i class="fas fa-check"></i>
    </div>

    <!-- Error feedback -->
    <div v-if="showError" class="error-feedback animate-shake">
      <i class="fas fa-times"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'card', 'input', 'link', 'generic'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  href: {
    type: String,
    default: '#'
  },
  ripple: {
    type: Boolean,
    default: true
  },
  hover: {
    type: Boolean,
    default: true
  },
  bounce: {
    type: Boolean,
    default: false
  },
  pulse: {
    type: Boolean,
    default: false
  },
  shake: {
    type: Boolean,
    default: false
  },
  success: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click', 'hover', 'leave', 'focus', 'blur'])

// Reactive state
const elementRef = ref(null)
const ripples = ref([])
const showOverlay = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const isHovered = ref(false)
const isFocused = ref(false)

// Computed classes
const buttonClasses = computed(() => [
  'btn',
  'btn-animated',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  {
    'btn-loading': props.loading,
    'btn-disabled': props.disabled,
    'btn-bounce': props.bounce,
    'btn-pulse': props.pulse,
    'btn-shake': props.shake,
    'btn-hover': isHovered.value,
    'btn-focused': isFocused.value
  },
  props.customClass
])

const cardClasses = computed(() => [
  'card',
  'card-animated',
  `card-${props.variant}`,
  {
    'card-hover': isHovered.value,
    'card-bounce': props.bounce,
    'card-pulse': props.pulse
  },
  props.customClass
])

const inputClasses = computed(() => [
  'input-wrapper',
  'input-animated',
  {
    'input-focused': isFocused.value,
    'input-error': props.error,
    'input-success': props.success
  },
  props.customClass
])

const linkClasses = computed(() => [
  'link',
  'link-animated',
  `link-${props.variant}`,
  {
    'link-hover': isHovered.value,
    'link-active': isFocused.value
  },
  props.customClass
])

const genericClasses = computed(() => [
  'interactive-element',
  'element-animated',
  {
    'element-hover': isHovered.value,
    'element-bounce': props.bounce,
    'element-pulse': props.pulse
  },
  props.customClass
])

// Methods
const createRipple = (event) => {
  if (!props.ripple || props.disabled) return

  const element = elementRef.value
  if (!element) return

  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  const ripple = {
    id: Date.now() + Math.random(),
    style: {
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`
    }
  }

  ripples.value.push(ripple)

  // Remove ripple after animation
  setTimeout(() => {
    const index = ripples.value.findIndex(r => r.id === ripple.id)
    if (index > -1) {
      ripples.value.splice(index, 1)
    }
  }, 600)
}

const handleClick = (event) => {
  if (props.disabled || props.loading) return

  // Create ripple effect
  createRipple(event)

  // Trigger bounce animation if enabled
  if (props.bounce) {
    triggerBounce()
  }

  // Trigger shake animation if enabled
  if (props.shake) {
    triggerShake()
  }

  emit('click', event)
}

const handleHover = () => {
  isHovered.value = true
  
  if (props.type === 'card') {
    showOverlay.value = true
  }

  emit('hover')
}

const handleLeave = () => {
  isHovered.value = false
  
  if (props.type === 'card') {
    showOverlay.value = false
  }

  emit('leave')
}

const triggerBounce = () => {
  if (elementRef.value) {
    elementRef.value.classList.add('animate-bounce-in')
    setTimeout(() => {
      elementRef.value.classList.remove('animate-bounce-in')
    }, 600)
  }
}

const triggerShake = () => {
  if (elementRef.value) {
    elementRef.value.classList.add('animate-shake')
    setTimeout(() => {
      elementRef.value.classList.remove('animate-shake')
    }, 500)
  }
}

const triggerSuccess = () => {
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 2000)
}

const triggerError = () => {
  showError.value = true
  setTimeout(() => {
    showError.value = false
  }, 2000)
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}

// Watch for success/error changes
watch(() => props.success, (newVal) => {
  if (newVal) {
    triggerSuccess()
  }
})

watch(() => props.error, (newVal) => {
  if (newVal) {
    triggerError()
  }
})

// Auto pulse if enabled
let pulseInterval = null
watch(() => props.pulse, (newVal) => {
  if (newVal && elementRef.value) {
    pulseInterval = setInterval(() => {
      elementRef.value.classList.add('animate-pulse')
      setTimeout(() => {
        elementRef.value.classList.remove('animate-pulse')
      }, 1000)
    }, 3000)
  } else if (pulseInterval) {
    clearInterval(pulseInterval)
    pulseInterval = null
  }
})

// Setup focus/blur listeners for inputs
onMounted(() => {
  if (props.type === 'input' && elementRef.value) {
    const input = elementRef.value.querySelector('input, textarea, select')
    if (input) {
      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)
    }
  }
})

onUnmounted(() => {
  if (pulseInterval) {
    clearInterval(pulseInterval)
  }
})

// Expose methods
defineExpose({
  triggerBounce,
  triggerShake,
  triggerSuccess,
  triggerError
})
</script>

<style scoped>
/* ===== MICRO-INTERACTIONS STYLES ===== */

.micro-interactions-wrapper {
  position: relative;
  display: inline-block;
}

/* ===== BUTTON STYLES ===== */
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  user-select: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-info {
  background: #3b82f6;
  color: white;
}

.btn-hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-focused {
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* Ripple effect */
.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Button loading state */
.btn-loading .button-content {
  opacity: 0;
}

.button-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* ===== CARD STYLES ===== */
.card {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
}

.card-hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(79, 70, 229, 0.05);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-hover .card-overlay {
  opacity: 1;
}

/* ===== INPUT STYLES ===== */
.input-wrapper {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-focused {
  transform: scale(1.02);
}

.input-focused input,
.input-focused textarea,
.input-focused select {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.input-error input,
.input-error textarea,
.input-error select {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-success input,
.input-success textarea,
.input-success select {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* ===== LINK STYLES ===== */
.link {
  position: relative;
  text-decoration: none;
  color: var(--color-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.link-hover {
  color: var(--color-secondary);
}

.link-underline {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.link-hover .link-underline {
  width: 100%;
}

/* ===== GENERIC ELEMENT STYLES ===== */
.interactive-element {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.element-hover {
  transform: translateY(-2px);
}

/* ===== FEEDBACK STYLES ===== */
.success-feedback,
.error-feedback {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 10;
}

.success-feedback {
  background: #10b981;
  color: white;
}

.error-feedback {
  background: #ef4444;
  color: white;
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 768px) {
  .btn {
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }
  
  .btn-small {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }
  
  .btn-large {
    padding: 1.125rem 1.75rem;
    font-size: 1.05rem;
  }
  
  /* Reduce animations on mobile */
  .btn-hover,
  .card-hover,
  .element-hover {
    transform: none;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  .btn,
  .card,
  .link,
  .interactive-element {
    transition: none;
  }
  
  .ripple-effect {
    display: none;
  }
  
  .btn-hover,
  .card-hover,
  .element-hover {
    transform: none;
  }
}
</style>
