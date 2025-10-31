<template>
  <div class="user-stats-card">
    <!-- User Profile Header -->
    <div class="stats-header">
      <div class="user-avatar">
        <img :src="profile.user.avatar" :alt="profile.user.name" />
        <div class="level-badge" :class="`tier-${getTierClass(profile.user.rank_tier)}`">
          <span class="level-number">{{ profile.user.level }}</span>
        </div>
      </div>
      
      <div class="user-info">
        <h3 class="user-name">{{ profile.user.name }}</h3>
        <div class="user-rank">
          <i class="fas fa-trophy"></i>
          <span v-if="profile.user.global_rank">Hạng #{{ profile.user.global_rank }}</span>
          <span v-else>Chưa xếp hạng</span>
          <span class="rank-tier" :style="{ color: getRankColor(profile.user.rank_tier) }">
            {{ getRankLabel(profile.user.rank_tier) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Level Progress -->
    <div class="level-progress-section">
      <div class="progress-header">
        <span class="progress-label">Level {{ profile.user.level }}</span>
        <span class="progress-text">
          {{ profile.user.experience }}/{{ profile.user.experience_to_next_level }} XP
        </span>
      </div>
      <div class="progress-bar-wrapper">
        <div 
          class="progress-bar" 
          :style="{ width: profile.user.level_progress + '%' }"
          :class="{ 'progress-animated': isAnimating }"
        >
          <div class="progress-glow"></div>
        </div>
      </div>
      <div class="progress-footer">
        <span class="next-level">Level {{ profile.user.level + 1 }}</span>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon points">
          <i class="fas fa-coins"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatNumber(profile.user.total_points) }}</div>
          <div class="stat-label">Điểm</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon quizzes">
          <i class="fas fa-clipboard-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ profile.stats.quizzes_completed }}</div>
          <div class="stat-label">Bài thi</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon accuracy">
          <i class="fas fa-bullseye"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ profile.stats.accuracy }}%</div>
          <div class="stat-label">Độ chính xác</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon streak">
          <i class="fas fa-fire"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ profile.streak?.current_streak || 0 }}</div>
          <div class="stat-label">Chuỗi ngày</div>
        </div>
      </div>
    </div>

    <!-- Achievements Preview -->
    <div class="achievements-preview" v-if="profile.achievements.recent.length > 0">
      <div class="preview-header">
        <h4>Thành tích gần đây</h4>
        <router-link :to="resolve_route_name('achievements.index')" class="view-all">
          Xem tất cả <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
      <div class="achievement-badges">
        <div 
          v-for="achievement in profile.achievements.recent" 
          :key="achievement.id"
          class="achievement-badge"
          :class="`tier-${achievement.tier}`"
          :title="achievement.name"
        >
          <i :class="achievement.icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { resolve_route_name } from '@/utils/route-helper.js'

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})

const isAnimating = ref(false)

const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num)
}

const getTierClass = (tier) => {
  return tier?.toLowerCase() || 'novice'
}

const getRankColor = (tier) => {
  const colors = {
    legendary: '#ff00ff',
    master: '#ffd700',
    expert: '#ff6b6b',
    veteran: '#4ecdc4',
    proficient: '#45b7d1',
    novice: '#95a5a6'
  }
  return colors[tier] || colors.novice
}

const getRankLabel = (tier) => {
  const labels = {
    legendary: 'Huyền Thoại',
    master: 'Bậc Thầy',
    expert: 'Chuyên Gia',
    veteran: 'Kỳ Cựu',
    proficient: 'Thành Thạo',
    novice: 'Mới Bắt Đầu'
  }
  return labels[tier] || labels.novice
}

onMounted(() => {
  // Trigger animation after mount
  setTimeout(() => {
    isAnimating.value = true
  }, 300)
})
</script>

<style scoped>
.user-stats-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

/* Header */
.stats-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f3f4f6;
}

.user-avatar {
  position: relative;
  width: 80px;
  height: 80px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4f46e5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.level-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.level-badge.tier-legendary {
  background: linear-gradient(135deg, #ff00ff 0%, #00ffff 100%);
}

.level-badge.tier-master {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
}

.level-badge.tier-expert {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.user-rank {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.rank-tier {
  font-weight: 600;
  margin-left: 0.25rem;
}

/* Level Progress */
.level-progress-section {
  margin-bottom: 2rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-label {
  font-weight: 600;
  color: #4f46e5;
  font-size: 1rem;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.progress-bar-wrapper {
  height: 24px;
  background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 12px;
  position: relative;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.progress-bar.progress-animated {
  animation: progressPulse 2s infinite;
}

@keyframes progressPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
  }
  50% {
    box-shadow: 0 0 20px 5px rgba(79, 70, 229, 0.3);
  }
}

.progress-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: progressGlow 2s infinite;
}

@keyframes progressGlow {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

.progress-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.next-level {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.stat-icon.points {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.stat-icon.quizzes {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.accuracy {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon.streak {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Achievements Preview */
.achievements-preview {
  padding-top: 1.5rem;
  border-top: 2px solid #f3f4f6;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.preview-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.view-all {
  color: #4f46e5;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
}

.view-all:hover {
  color: #6366f1;
  gap: 0.5rem;
}

.achievement-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.achievement-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.achievement-badge::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 14px;
  padding: 2px;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.achievement-badge:hover::before {
  opacity: 1;
}

.achievement-badge:hover {
  transform: translateY(-4px) scale(1.1);
}

.achievement-badge.tier-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #a0522d 100%);
}

.achievement-badge.tier-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%);
}

.achievement-badge.tier-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
}

.achievement-badge.tier-platinum {
  background: linear-gradient(135deg, #e5e4e2 0%, #d3d3d3 100%);
}

.achievement-badge.tier-diamond {
  background: linear-gradient(135deg, #b9f2ff 0%, #00d4ff 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .user-stats-card {
    padding: 1.5rem;
  }
  
  .stats-header {
    flex-direction: column;
    text-align: center;
  }
  
  .user-info {
    width: 100%;
  }
  
  .user-rank {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>

