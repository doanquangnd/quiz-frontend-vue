<template>
  <div class="streak-stats">
    <div class="card border-0 shadow-soft h-100">
      <!-- Header -->
      <div class="card-header bg-gradient-primary text-white pb-2">
        <div class="d-flex align-items-center">
          <div class="icon icon-shape icon-sm bg-white text-center rounded-3 me-3">
            <i class="ni ni-fire text-primary text-sm opacity-10"></i>
          </div>
          <div>
            <h6 class="mb-0 text-white">Chuỗi ngày học tập</h6>
            <small class="text-white opacity-75">Duy trì thói quen học tập hàng ngày</small>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="card-body p-3">
        <div class="row g-3 mb-4">
          <div class="col-6">
            <div class="text-center">
              <div class="icon icon-shape icon-sm bg-gradient-info text-center rounded-3 mx-auto mb-2">
                <i class="ni ni-fire text-white opacity-10"></i>
              </div>
              <h6 class="font-weight-bold mb-0">{{ currentStreak }}</h6>
              <p class="text-xs text-muted mb-0">Ngày hiện tại</p>
            </div>
          </div>
          <div class="col-6">
            <div class="text-center">
              <div class="icon icon-shape icon-sm bg-gradient-warning text-center rounded-3 mx-auto mb-2">
                <i class="ni ni-trophy text-white opacity-10"></i>
              </div>
              <h6 class="font-weight-bold mb-0">{{ longestStreak }}</h6>
              <p class="text-xs text-muted mb-0">Kỷ lục cá nhân</p>
            </div>
          </div>
          <div class="col-6">
            <div class="text-center">
              <div class="icon icon-shape icon-sm bg-gradient-success text-center rounded-3 mx-auto mb-2">
                <i class="ni ni-calendar-grid-58 text-white opacity-10"></i>
              </div>
              <h6 class="font-weight-bold mb-0">{{ totalDays }}</h6>
              <p class="text-xs text-muted mb-0">Tổng số ngày</p>
            </div>
          </div>
          <div class="col-6">
            <div class="text-center">
              <div class="icon icon-shape icon-sm bg-gradient-info text-center rounded-3 mx-auto mb-2">
                <i class="ni ni-flag text-white opacity-10"></i>
              </div>
              <h6 class="font-weight-bold mb-0">{{ daysToNextMilestone }}</h6>
              <p class="text-xs text-muted mb-0">Đến mốc tiếp theo</p>
            </div>
          </div>
        </div>

        <!-- Streak Status -->
        <div class="text-center mb-3" v-if="currentStreak === 0">
          <div class="alert alert-secondary mb-2 py-2">
            <i class="ni ni-notification-70 me-1"></i>
            <strong>Chưa có chuỗi</strong>
          </div>
          <p class="text-sm text-muted mb-0">Bắt đầu học tập ngay hôm nay để bắt đầu chuỗi ngày của bạn!</p>
        </div>

        <div v-else class="text-center mb-3">
          <div class="alert alert-success mb-2 py-2">
            <i class="ni ni-check-bold me-1"></i>
            <strong>Chuỗi {{ currentStreak }} ngày</strong>
          </div>
          <p class="text-sm text-success mb-0">Tiếp tục duy trì chuỗi học tập của bạn!</p>
        </div>
      </div>

      <!-- Milestones -->
      <div class="card-footer bg-transparent pt-0">
        <h6 class="mb-3 font-weight-bold">Các mốc quan trọng</h6>
        <div class="milestones-list">
          <div 
            v-for="milestone in milestones" 
            :key="milestone.days"
            class="d-flex align-items-center justify-content-between py-1 mb-1 rounded"
            :class="{ 
              'bg-gradient-light-info': isNextMilestone(milestone.days),
              'bg-gradient-light-success': currentStreak >= milestone.days,
              'bg-gray-100': !isNextMilestone(milestone.days) && currentStreak < milestone.days
            }"
          >
            <div class="d-flex align-items-center">
              <div class="icon icon-shape icon-xs bg-gradient-info text-center rounded-circle me-2">
                <i :class="milestone.icon" class="text-white opacity-10"></i>
              </div>
              <span class="font-weight-bold text-sm">{{ milestone.title }}</span>
            </div>
            <div class="d-flex align-items-center">
              <span class="text-sm text-muted me-2">{{ milestone.days }} ngày</span>
              <i v-if="currentStreak >= milestone.days" class="ni ni-check-bold text-success"></i>
              <i v-else-if="isNextMilestone(milestone.days)" class="ni ni-bold-right text-info"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  streakHistory: {
    type: Array,
    default: () => [],
  },
});

// Computed properties
const totalDays = computed(() => {
  return props.streakHistory.length;
});

const milestones = computed(() => [
  { days: 3, title: 'Khởi đầu tốt', icon: 'ni ni-like-2' },
  { days: 7, title: '1 tuần', icon: 'ni ni-calendar-grid-58' },
  { days: 14, title: '2 tuần', icon: 'ni ni-calendar-grid-58' },
  { days: 30, title: '1 tháng', icon: 'ni ni-calendar-grid-58' },
  { days: 60, title: '2 tháng', icon: 'ni ni-calendar-grid-58' },
  { days: 100, title: '100 ngày', icon: 'ni ni-calendar-grid-58' },
  { days: 180, title: '6 tháng', icon: 'ni ni-calendar-grid-58' },
  { days: 365, title: '1 năm', icon: 'ni ni-calendar-grid-58' },
]);

const daysToNextMilestone = computed(() => {
  const nextMilestone = milestones.value.find(milestone => milestone.days > props.currentStreak);
  return nextMilestone ? nextMilestone.days - props.currentStreak : 0;
});

const isNextMilestone = (days) => {
  return days === milestones.value.find(milestone => milestone.days > props.currentStreak)?.days;
};
</script>

<style scoped>
.streak-stats {
  height: 100%;
}

.icon-shape {
  width: 32px;
  height: 32px;
}

.icon-shape.icon-xs {
  width: 20px;
  height: 20px;
}

.bg-gradient-light-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
}

.bg-gradient-light-success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
}

.bg-gray-100 {
  background-color: #f8f9fa;
}

.milestones-list .d-flex:hover {
  transform: translateX(2px);
  transition: all 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .icon-shape {
    width: 28px;
    height: 28px;
  }
  
  .icon-shape.icon-xs {
    width: 18px;
    height: 18px;
  }
}
</style>