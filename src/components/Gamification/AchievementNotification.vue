<template>
  <teleport to="body">
    <transition name="notification">
      <div v-if="show" class="achievement-notification" :class="`tier-${achievement.tier}`">
        <div class="notification-content">
          <div class="notification-icon">
            <i :class="achievement.icon"></i>
            <div class="icon-glow"></div>
          </div>
          
          <div class="notification-body">
            <div class="notification-header">
              <span class="badge" :class="`badge-${achievement.tier}`">{{ tierLabel }}</span>
              <span class="unlock-text">Thành tích mới!</span>
            </div>
            
            <h3 class="achievement-name">{{ achievement.name }}</h3>
            <p class="achievement-description">{{ achievement.description }}</p>
            
            <div class="achievement-reward">
              <i class="pi pi-star-fill"></i>
              <span>+{{ achievement.points }} điểm</span>
            </div>
          </div>
          
          <button class="notification-close" @click="close">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="notification-progress">
          <div class="progress-bar" :style="{ width: progressWidth }"></div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  achievement: {
    type: Object,
    required: true,
  },
  duration: {
    type: Number,
    default: 5000, // 5 seconds
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['close']);

const show = ref(false);
const progressWidth = ref('100%');
let timer = null;

const tierLabel = computed(() => {
  const labels = {
    bronze: 'Đồng',
    silver: 'Bạc',
    gold: 'Vàng',
    platinum: 'Bạch kim',
  };
  return labels[props.achievement.tier] || props.achievement.tier;
});

const startProgress = () => {
  if (!props.autoClose) return;
  
  const startTime = Date.now();
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, props.duration - elapsed);
    const percent = (remaining / props.duration) * 100;
    
    progressWidth.value = `${percent}%`;
    
    if (remaining > 0) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

const close = () => {
  show.value = false;
  if (timer) {
    clearTimeout(timer);
  }
  emit('close');
};

onMounted(() => {
  // Show with delay for animation
  setTimeout(() => {
    show.value = true;
    startProgress();
  }, 100);
  
  // Auto close
  if (props.autoClose) {
    timer = setTimeout(() => {
      close();
    }, props.duration);
  }
});

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<style scoped>
.achievement-notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 400px;
  max-width: calc(100vw - 4rem);
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 9999;
}

.notification-content {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  position: relative;
}

.notification-icon {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
  animation: icon-bounce 0.8s ease-in-out;
}

@keyframes icon-bounce {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.2) rotate(-10deg);
  }
  50% {
    transform: scale(1.1) rotate(10deg);
  }
  75% {
    transform: scale(1.15) rotate(-5deg);
  }
}

.tier-bronze .notification-icon {
  background: linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(205, 127, 50, 0.1));
  color: #cd7f32;
}

.tier-silver .notification-icon {
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.3), rgba(192, 192, 192, 0.1));
  color: #808080;
}

.tier-gold .notification-icon {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.1));
  color: #ffa500;
}

.tier-platinum .notification-icon {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1));
  color: #a855f7;
}

.icon-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  animation: glow-pulse 2s ease-in-out infinite;
}

.tier-bronze .icon-glow {
  box-shadow: 0 0 20px rgba(205, 127, 50, 0.5);
}

.tier-silver .icon-glow {
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
}

.tier-gold .icon-glow {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

.tier-platinum .icon-glow {
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.notification-body {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-bronze {
  background: rgba(205, 127, 50, 0.1);
  color: #cd7f32;
}

.badge-silver {
  background: rgba(192, 192, 192, 0.2);
  color: #808080;
}

.badge-gold {
  background: rgba(255, 215, 0, 0.2);
  color: #ffa500;
}

.badge-platinum {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.unlock-text {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.achievement-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.achievement-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.achievement-reward {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffa500;
}

.achievement-reward i {
  color: #ffd700;
}

.notification-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 28px;
  height: 28px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.notification-close:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.notification-progress {
  height: 3px;
  background: #f1f5f9;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #5e72e4, #82d616);
  transition: width 0.1s linear;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.notification-enter-from {
  transform: translateX(120%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(120%);
  opacity: 0;
}

@media (max-width: 768px) {
  .achievement-notification {
    top: auto;
    bottom: 2rem;
    right: 1rem;
    left: 1rem;
    width: auto;
    max-width: none;
  }
}
</style>

