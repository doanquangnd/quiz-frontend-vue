<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="achievement" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content achievement-modal">
          <button class="modal-close" @click="$emit('close')">
            <i class="pi pi-times"></i>
          </button>
          
          <div class="modal-header" :class="`tier-${achievement.tier}`">
            <div class="achievement-icon-large" :class="{ 'unlocked': achievement.unlocked }">
              <i :class="achievement.icon"></i>
              
              <div v-if="achievement.unlocked" class="unlock-glow"></div>
            </div>
            
            <div class="tier-badge" :class="`tier-${achievement.tier}`">
              {{ tierLabel }}
            </div>
          </div>
          
          <div class="modal-body">
            <h2 class="achievement-title">{{ achievement.name }}</h2>
            <p class="achievement-description">{{ achievement.description }}</p>
            
            <div class="achievement-stats">
              <div class="stat">
                <i class="pi pi-star-fill"></i>
                <span>{{ achievement.points }} điểm</span>
              </div>
              
              <div v-if="achievement.category" class="stat">
                <i class="pi pi-tag"></i>
                <span>{{ categoryLabel }}</span>
              </div>
            </div>
            
            <div v-if="achievement.unlocked" class="unlock-info">
              <div class="unlock-success">
                <i class="pi pi-check-circle"></i>
                <span>Đã mở khóa</span>
              </div>
              
              <div v-if="achievement.unlockedAt" class="unlock-date">
                <i class="pi pi-calendar"></i>
                <span>{{ formatDate(achievement.unlockedAt) }}</span>
              </div>
            </div>
            
            <div v-else-if="achievement.progress" class="progress-section">
              <h3>Tiến độ</h3>
              
              <div class="progress-bar-large">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${achievement.progress.progress_percent}%` }"
                >
                  <span class="progress-label">
                    {{ Math.round(achievement.progress.progress_percent) }}%
                  </span>
                </div>
              </div>
              
              <div class="progress-details">
                <span>{{ achievement.progress.current }} / {{ achievement.progress.target }}</span>
                <span>Còn {{ achievement.progress.target - achievement.progress.current }} để hoàn thành</span>
              </div>
            </div>
            
            <div class="tips-section">
              <h3>
                <i class="pi pi-lightbulb"></i>
                Cách đạt được
              </h3>
              <p>{{ getAchievementTips(achievement) }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  achievement: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close']);

const tierLabel = computed(() => {
  if (!props.achievement) return '';
  const labels = {
    bronze: 'Đồng',
    silver: 'Bạc',
    gold: 'Vàng',
    platinum: 'Bạch kim',
  };
  return labels[props.achievement.tier] || props.achievement.tier;
});

const categoryLabel = computed(() => {
  if (!props.achievement) return '';
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
  return labels[props.achievement.category] || props.achievement.category;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getAchievementTips = (achievement) => {
  if (!achievement) return '';
  const tips = {
    quiz: 'Tiếp tục làm bài thi để đạt được thành tích này. Hãy thử thách bản thân với các bài kiểm tra khó hơn!',
    streak: 'Đăng nhập và học tập mỗi ngày để duy trì chuỗi ngày. Đừng bỏ lỡ một ngày nào!',
    score: 'Học tập chăm chỉ và chuẩn bị kỹ càng để đạt điểm cao. Xem lại các câu trả lời sai để cải thiện.',
    speed: 'Luyện tập thường xuyên để nâng cao tốc độ. Hiểu rõ kiến thức sẽ giúp bạn trả lời nhanh hơn.',
    special: 'Thành tích đặc biệt này yêu cầu bạn hoàn thành các điều kiện độc đáo. Hãy khám phá!',
    points: 'Tích lũy điểm bằng cách hoàn thành bài thi, streak, và các hoạt động khác.',
    milestone: 'Tiếp tục học tập và tích lũy kinh nghiệm để đạt các cột mốc quan trọng.',
  };
  
  return tips[achievement.category] || 'Hoàn thành các điều kiện để mở khóa thành tích này!';
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 2;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.modal-header {
  padding: 3rem 2rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.modal-header.tier-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #b87333 100%);
}

.modal-header.tier-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%);
}

.modal-header.tier-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
}

.modal-header.tier-platinum {
  background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%);
}

.achievement-icon-large {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  font-size: 4rem;
  color: white;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.achievement-icon-large.unlocked {
  animation: unlock-bounce 0.8s ease-in-out;
}

@keyframes unlock-bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2) rotate(15deg);
  }
}

.unlock-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.tier-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  color: white;
}

.modal-body {
  padding: 2rem;
}

.achievement-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
  text-align: center;
}

.achievement-description {
  font-size: 1rem;
  color: #64748b;
  text-align: center;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.achievement-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #1e293b;
}

.stat i {
  color: #5e72e4;
}

.unlock-info {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(130, 214, 22, 0.1), rgba(130, 214, 22, 0.05));
  border-radius: 12px;
  border-left: 4px solid #82d616;
  margin-bottom: 2rem;
}

.unlock-success {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #16a34a;
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.unlock-success i {
  font-size: 1.5rem;
}

.unlock-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.progress-section {
  margin-bottom: 2rem;
}

.progress-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.progress-bar-large {
  height: 32px;
  background: #f1f5f9;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 0.75rem;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5e72e4 0%, #82d616 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1rem;
  transition: width 0.8s ease;
}

.progress-label {
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #64748b;
}

.tips-section {
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
}

.tips-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
}

.tips-section h3 i {
  color: #fbbf24;
}

.tips-section p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .modal-content {
    margin: 0;
    border-radius: 24px 24px 0 0;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 2rem 1.5rem 1.5rem;
  }
  
  .achievement-icon-large {
    width: 100px;
    height: 100px;
    font-size: 3rem;
  }
  
  .achievement-title {
    font-size: 1.5rem;
  }
  
  .achievement-stats {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>

