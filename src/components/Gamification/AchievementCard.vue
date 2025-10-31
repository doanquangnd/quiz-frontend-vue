<template>
  <div 
    class="achievement-card" 
    :class="[
      `achievement-card--${tier}`,
      { 
        'achievement-card--locked': !unlocked,
        'achievement-card--unlocking': isUnlocking
      }
    ]"
    @click="handleClick"
  >
    <div class="achievement-icon-wrapper">
      <div class="achievement-icon" :class="{ 'pulsing': isUnlocking }">
        <i :class="icon"></i>
      </div>
      
      <div v-if="unlocked" class="unlock-badge">
        <i class="pi pi-check"></i>
      </div>
      
      <div v-if="!unlocked" class="lock-overlay">
        <i class="pi pi-lock"></i>
      </div>
    </div>
    
    <div class="achievement-content">
      <div class="achievement-tier-badge" :class="`tier-${tier}`">
        {{ tierLabel }}
      </div>
      
      <h4 class="achievement-name">{{ name }}</h4>
      <p class="achievement-description">{{ description }}</p>
      
      <div class="achievement-meta">
        <div class="achievement-points">
          <i class="pi pi-star-fill"></i>
          <span>{{ points }} điểm</span>
        </div>
        
        <div v-if="category" class="achievement-category">
          <i class="pi pi-tag"></i>
          <span>{{ categoryLabel }}</span>
        </div>
      </div>
      
      <div v-if="!unlocked && progress" class="achievement-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${progress.progress_percent}%` }"
          ></div>
        </div>
        <div class="progress-text">
          {{ progress.current }} / {{ progress.target }}
          <span class="progress-percent">({{ Math.round(progress.progress_percent) }}%)</span>
        </div>
      </div>
      
      <div v-if="unlocked && unlockedAt" class="unlock-date">
        <i class="pi pi-calendar"></i>
        Đạt được {{ formatDate(unlockedAt) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'pi pi-trophy',
  },
  tier: {
    type: String,
    default: 'bronze',
    validator: (value) => ['bronze', 'silver', 'gold', 'platinum'].includes(value),
  },
  category: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    required: true,
  },
  unlocked: {
    type: Boolean,
    default: false,
  },
  unlockedAt: {
    type: String,
    default: null,
  },
  progress: {
    type: Object,
    default: null,
    // { current: 5, target: 10, progress_percent: 50 }
  },
});

const emit = defineEmits(['click']);

const isUnlocking = ref(false);

const tierLabel = computed(() => {
  const labels = {
    bronze: 'Đồng',
    silver: 'Bạc',
    gold: 'Vàng',
    platinum: 'Bạch kim',
  };
  return labels[props.tier] || props.tier;
});

const categoryLabel = computed(() => {
  const labels = {
    quiz: 'Bài thi',
    streak: 'Chuỗi ngày',
    score: 'Điểm số',
    speed: 'Tốc độ',
    special: 'Đặc biệt',
    points: 'Điểm thưởng',
    milestone: 'Cột mốc',
    social: 'Xã hội',
    challenge: 'Thử thách',
  };
  return labels[props.category] || props.category;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const handleClick = () => {
  emit('click', props.id);
};
</script>

<style scoped>
.achievement-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.achievement-card--bronze {
  border-color: #cd7f32;
}

.achievement-card--bronze:hover {
  box-shadow: 0 8px 24px rgba(205, 127, 50, 0.2);
}

.achievement-card--silver {
  border-color: #c0c0c0;
}

.achievement-card--silver:hover {
  box-shadow: 0 8px 24px rgba(192, 192, 192, 0.2);
}

.achievement-card--gold {
  border-color: #ffd700;
}

.achievement-card--gold:hover {
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.2);
}

.achievement-card--platinum {
  border-color: #e5e4e2;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.achievement-card--platinum:hover {
  box-shadow: 0 8px 24px rgba(229, 228, 226, 0.3);
}

.achievement-card--locked {
  opacity: 0.6;
  filter: grayscale(50%);
}

.achievement-card--locked:hover {
  opacity: 0.8;
}

.achievement-card--unlocking {
  animation: unlock-pulse 1s ease-in-out;
}

@keyframes unlock-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.achievement-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.achievement-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 2.5rem;
  background: linear-gradient(135deg, rgba(94, 114, 228, 0.1), rgba(94, 114, 228, 0.2));
  color: #5e72e4;
  transition: all 0.3s ease;
}

.achievement-card--bronze .achievement-icon {
  background: linear-gradient(135deg, rgba(205, 127, 50, 0.1), rgba(205, 127, 50, 0.2));
  color: #cd7f32;
}

.achievement-card--silver .achievement-icon {
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.2), rgba(192, 192, 192, 0.3));
  color: #808080;
}

.achievement-card--gold .achievement-icon {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.3));
  color: #ffa500;
}

.achievement-card--platinum .achievement-icon {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.2));
  color: #a855f7;
}

.achievement-icon.pulsing {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.unlock-badge {
  position: absolute;
  top: 0;
  right: 20%;
  width: 28px;
  height: 28px;
  background: #82d616;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(130, 214, 22, 0.3);
}

.lock-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.125rem;
}

.achievement-content {
  text-align: center;
}

.achievement-tier-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

.achievement-tier-badge.tier-bronze {
  background: rgba(205, 127, 50, 0.1);
  color: #cd7f32;
}

.achievement-tier-badge.tier-silver {
  background: rgba(192, 192, 192, 0.2);
  color: #808080;
}

.achievement-tier-badge.tier-gold {
  background: rgba(255, 215, 0, 0.2);
  color: #ffa500;
}

.achievement-tier-badge.tier-platinum {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.achievement-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.achievement-description {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.achievement-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.achievement-points,
.achievement-category {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #64748b;
}

.achievement-points i {
  color: #ffd700;
}

.achievement-category i {
  color: #5e72e4;
}

.achievement-progress {
  margin-top: 1rem;
}

.progress-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5e72e4, #82d616);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #64748b;
}

.progress-percent {
  color: #5e72e4;
  font-weight: 600;
}

.unlock-date {
  font-size: 0.75rem;
  color: #82d616;
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}
</style>

