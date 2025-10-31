<template>
  <teleport to="body">
    <transition name="celebration">
      <div v-if="show" class="level-up-celebration">
        <div class="celebration-content">
          <div class="celebration-burst">
            <div class="burst-ring" v-for="n in 3" :key="n"></div>
          </div>
          
          <div class="level-badge">
            <div class="level-number">{{ newLevel }}</div>
            <div class="level-label">LEVEL</div>
          </div>
          
          <h2 class="celebration-title">Level Up!</h2>
          <p class="celebration-message">
            Chúc mừng! Bạn đã đạt level {{ newLevel }}
          </p>
          
          <div class="rewards-list">
            <div class="reward-item" v-if="rewards.points">
              <i class="pi pi-star-fill"></i>
              <span>+{{ rewards.points }} điểm thưởng</span>
            </div>
            <div class="reward-item" v-if="rewards.achievement">
              <i class="pi pi-trophy"></i>
              <span>Thành tích mới mở khóa!</span>
            </div>
          </div>
          
          <button @click="close" class="btn-continue">
            Tiếp tục
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
        
        <ConfettiEffect :active="showConfetti" @complete="showConfetti = false" />
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ConfettiEffect from './ConfettiEffect.vue';

const props = defineProps({
  newLevel: {
    type: Number,
    required: true,
  },
  rewards: {
    type: Object,
    default: () => ({}),
  },
  autoClose: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 5000,
  },
});

const emit = defineEmits(['close']);

const show = ref(false);
const showConfetti = ref(false);

const close = () => {
  show.value = false;
  showConfetti.value = false;
  emit('close');
};

onMounted(() => {
  setTimeout(() => {
    show.value = true;
    showConfetti.value = true;
  }, 100);
  
  if (props.autoClose) {
    setTimeout(() => {
      close();
    }, props.duration);
  }
});
</script>

<style scoped>
.level-up-celebration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99998;
  padding: 2rem;
}

.celebration-content {
  position: relative;
  text-align: center;
  max-width: 500px;
  animation: celebration-appear 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes celebration-appear {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.celebration-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  pointer-events: none;
}

.burst-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid #5e72e4;
  border-radius: 50%;
  opacity: 0;
  animation: burst-expand 1.5s ease-out;
}

.burst-ring:nth-child(2) {
  animation-delay: 0.2s;
  border-color: #82d616;
}

.burst-ring:nth-child(3) {
  animation-delay: 0.4s;
  border-color: #ffd700;
}

@keyframes burst-expand {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.level-badge {
  width: 150px;
  height: 150px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #5e72e4 0%, #a855f7 100%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(94, 114, 228, 0.5);
  animation: badge-rotate 3s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

@keyframes badge-rotate {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
}

.level-number {
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  line-height: 1;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.level-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 2px;
}

.celebration-title {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #5e72e4, #a855f7, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
  animation: title-glow 2s ease-in-out infinite;
}

@keyframes title-glow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(94, 114, 228, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.8));
  }
}

.celebration-message {
  font-size: 1.25rem;
  color: white;
  margin: 0 0 2rem 0;
}

.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.reward-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.reward-item i {
  color: #ffd700;
  font-size: 1.25rem;
}

.btn-continue {
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #5e72e4, #a855f7);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 24px rgba(94, 114, 228, 0.4);
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(94, 114, 228, 0.6);
}

.celebration-enter-active,
.celebration-leave-active {
  transition: opacity 0.5s ease;
}

.celebration-enter-from,
.celebration-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .celebration-title {
    font-size: 2rem;
  }
  
  .level-badge {
    width: 120px;
    height: 120px;
  }
  
  .level-number {
    font-size: 2.5rem;
  }
}
</style>

