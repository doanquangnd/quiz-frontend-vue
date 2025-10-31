<template>
  <div class="mobile-dashboard">
    <!-- Mobile Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="user-greeting">
          <h1 class="greeting-text">
            {{ greeting }}
          </h1>
          <p class="user-name">{{ user.name }}</p>
        </div>
        
        <div class="user-avatar">
          <img 
            :src="user.avatar_url || '/images/default-avatar.png'" 
            :alt="user.name"
            class="avatar-img"
          />
        </div>
      </div>
    </header>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="stat-card">
        <div class="stat-icon correct">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalCorrect }}</div>
          <div class="stat-label">Đúng</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon incorrect">
          <i class="fas fa-times-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalIncorrect }}</div>
          <div class="stat-label">Sai</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon attempted">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalAttempts }}</div>
          <div class="stat-label">Làm bài</div>
        </div>
      </div>
    </div>

    <!-- Progress Overview -->
    <div class="progress-overview">
      <h2 class="section-title">Tiến độ học tập</h2>
      
      <div class="progress-card">
        <div class="progress-header">
          <span class="progress-label">Tổng tiến độ</span>
          <span class="progress-percentage">{{ Math.round(overallProgress) }}%</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: overallProgress + '%' }"
          ></div>
        </div>
      </div>
      
      <div class="category-progress">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
        >
          <div class="category-info">
            <h3 class="category-name">{{ category.name }}</h3>
            <span class="category-progress-text">{{ category.progress }}%</span>
          </div>
          <div class="category-progress-bar">
            <div 
              class="category-progress-fill" 
              :style="{ width: category.progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity">
      <div class="section-header">
        <h2 class="section-title">Hoạt động gần đây</h2>
        <router-link to="#" class="view-all-link" style="pointer-events: none; opacity: 0.5;">
          Xem tất cả
        </router-link>
      </div>
      
      <div class="activity-list">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon" :class="activity.type">
            <i :class="getActivityIcon(activity.type)"></i>
          </div>
          
          <div class="activity-content">
            <p class="activity-text">{{ activity.description }}</p>
            <span class="activity-time">{{ formatTime(activity.created_at) }}</span>
          </div>
          
          <div class="activity-score" v-if="activity.score !== null">
            <span class="score-text">{{ activity.score }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2 class="section-title">Hành động nhanh</h2>
      
      <div class="action-grid">
        <router-link 
          :to="resolve_route_name('exams.index')" 
          class="action-card primary"
        >
          <div class="action-icon">
            <i class="fas fa-play-circle"></i>
          </div>
          <div class="action-content">
            <h3 class="action-title">Làm bài kiểm tra</h3>
            <p class="action-description">Bắt đầu làm bài kiểm tra mới</p>
          </div>
        </router-link>
        
        <router-link 
          :to="resolve_route_name('documents.index')" 
          class="action-card secondary"
        >
          <div class="action-icon">
            <i class="fas fa-book"></i>
          </div>
          <div class="action-content">
            <h3 class="action-title">Tài liệu học</h3>
            <p class="action-description">Xem tài liệu học tập</p>
          </div>
        </router-link>
        
        <router-link 
          :to="resolve_route_name('profile.show')" 
          class="action-card tertiary"
        >
          <div class="action-icon">
            <i class="fas fa-user-cog"></i>
          </div>
          <div class="action-content">
            <h3 class="action-title">Cài đặt</h3>
            <p class="action-description">Quản lý tài khoản</p>
          </div>
        </router-link>
        
        <router-link 
          :to="resolve_route_name('achievements.index')" 
          class="action-card success"
        >
          <div class="action-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="action-content">
            <h3 class="action-title">Thành tích</h3>
            <p class="action-description">Xem thành tích của bạn</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Study Streak -->
    <div class="study-streak" v-if="studyStreak > 0">
      <div class="streak-card">
        <div class="streak-icon">
          <i class="fas fa-fire"></i>
        </div>
        <div class="streak-content">
          <h3 class="streak-title">Chuỗi học tập</h3>
          <div class="streak-count">{{ studyStreak }} ngày</div>
          <p class="streak-description">Hãy duy trì chuỗi học tập của bạn!</p>
        </div>
      </div>
    </div>

    <!-- Achievements Preview -->
    <div class="achievements-preview" v-if="recentAchievements.length > 0">
      <div class="section-header">
        <h2 class="section-title">Thành tích mới</h2>
        <router-link :to="resolve_route_name('achievements.index')" class="view-all-link">
          Xem tất cả
        </router-link>
      </div>
      
      <div class="achievements-list">
        <div 
          v-for="achievement in recentAchievements" 
          :key="achievement.id"
          class="achievement-item"
        >
          <div class="achievement-icon">
            <i :class="achievement.icon"></i>
          </div>
          <div class="achievement-content">
            <h4 class="achievement-title">{{ achievement.title }}</h4>
            <p class="achievement-description">{{ achievement.description }}</p>
          </div>
          <div class="achievement-date">
            {{ formatDate(achievement.earned_at) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { resolve_route_name } from '@/utils/route-helper.js'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Mock data - replace with actual data from props
const stats = ref({
  totalCorrect: 45,
  totalIncorrect: 12,
  totalAttempts: 23
})

const categories = ref([
  { id: 1, name: 'Java Basics', progress: 75 },
  { id: 2, name: 'Object-Oriented Programming', progress: 60 },
  { id: 3, name: 'Collections Framework', progress: 40 },
  { id: 4, name: 'Exception Handling', progress: 85 }
])

const recentActivities = ref([
  {
    id: 1,
    type: 'quiz_completed',
    description: 'Hoàn thành bài kiểm tra Java Basics',
    score: 85,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    type: 'document_viewed',
    description: 'Xem tài liệu về Collections Framework',
    score: null,
    created_at: '2024-01-15T09:15:00Z'
  },
  {
    id: 3,
    type: 'quiz_completed',
    description: 'Hoàn thành bài kiểm tra OOP Concepts',
    score: 92,
    created_at: '2024-01-14T16:45:00Z'
  }
])

const studyStreak = ref(7)

const recentAchievements = ref([
  {
    id: 1,
    title: 'Quiz Master',
    description: 'Hoàn thành 10 bài kiểm tra',
    icon: 'fas fa-trophy',
    earned_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Perfect Score',
    description: 'Đạt điểm tuyệt đối trong bài kiểm tra',
    icon: 'fas fa-star',
    earned_at: '2024-01-14T16:45:00Z'
  }
])

// Computed properties
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Chào buổi sáng'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
})

const overallProgress = computed(() => {
  if (categories.value.length === 0) return 0
  const totalProgress = categories.value.reduce((sum, category) => sum + category.progress, 0)
  return totalProgress / categories.value.length
})

// Methods
const getActivityIcon = (type) => {
  const icons = {
    quiz_completed: 'fas fa-clipboard-check',
    document_viewed: 'fas fa-book-open',
    achievement_earned: 'fas fa-trophy',
    profile_updated: 'fas fa-user-edit'
  }
  return icons[type] || 'fas fa-circle'
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Vừa xong'
  if (diffInHours < 24) return `${diffInHours} giờ trước`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} ngày trước`
  
  return date.toLocaleDateString('vi-VN')
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'short'
  })
}
</script>

<style scoped>
/* Mobile Dashboard Styles */
.mobile-dashboard {
  padding: var(--space-md);
  max-width: 100%;
  margin: 0 auto;
}

/* Dashboard Header */
.dashboard-header {
  margin-bottom: var(--space-xl);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-greeting h1 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin: 0 0 var(--space-xs) 0;
  color: var(--text-primary);
}

.user-name {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin: 0;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  padding: var(--space-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: var(--space-md);
  font-size: var(--font-size-lg);
}

.stat-icon.correct {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.stat-icon.incorrect {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
}

.stat-icon.attempted {
  background: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--space-xs);
}

/* Progress Overview */
.progress-overview {
  margin-bottom: var(--space-xl);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-lg) 0;
}

.progress-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-sm);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.progress-label {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
}

.progress-percentage {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--primary-color);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.category-progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.category-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}

.category-progress-text {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--primary-color);
}

.category-progress-bar {
  width: 100%;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.category-progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Recent Activity */
.recent-activity {
  margin-bottom: var(--space-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.view-all-link {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.view-all-link:hover {
  text-decoration: underline;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.activity-item {
  display: flex;
  align-items: center;
  padding: var(--space-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: var(--space-md);
  font-size: var(--font-size-base);
}

.activity-icon.quiz_completed {
  background: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
}

.activity-icon.document_viewed {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.activity-icon.achievement_earned {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
  line-height: var(--line-height-normal);
}

.activity-time {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.activity-score {
  margin-left: var(--space-md);
}

.score-text {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--success-color);
}

/* Quick Actions */
.quick-actions {
  margin-bottom: var(--space-xl);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-lg);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  min-height: 120px;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-card.primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  border-color: var(--primary-color);
}

.action-card.secondary {
  background: linear-gradient(135deg, var(--success-color), #34d399);
  color: white;
  border-color: var(--success-color);
}

.action-card.tertiary {
  background: linear-gradient(135deg, var(--secondary-color), #94a3b8);
  color: white;
  border-color: var(--secondary-color);
}

.action-card.success {
  background: linear-gradient(135deg, var(--warning-color), #fbbf24);
  color: white;
  border-color: var(--warning-color);
}

.action-icon {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--space-md);
}

.action-content {
  text-align: center;
}

.action-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin: 0 0 var(--space-xs) 0;
}

.action-description {
  font-size: var(--font-size-sm);
  margin: 0;
  opacity: 0.9;
}

/* Study Streak */
.study-streak {
  margin-bottom: var(--space-xl);
}

.streak-card {
  display: flex;
  align-items: center;
  padding: var(--space-lg);
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  color: white;
}

.streak-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-right: var(--space-lg);
  font-size: var(--font-size-xl);
}

.streak-content {
  flex: 1;
}

.streak-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin: 0 0 var(--space-xs) 0;
}

.streak-count {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin: 0 0 var(--space-xs) 0;
}

.streak-description {
  font-size: var(--font-size-sm);
  margin: 0;
  opacity: 0.9;
}

/* Achievements Preview */
.achievements-preview {
  margin-bottom: var(--space-xl);
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: var(--space-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.achievement-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
  border-radius: 50%;
  margin-right: var(--space-md);
  font-size: var(--font-size-base);
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
}

.achievement-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.achievement-date {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .mobile-dashboard {
    padding: var(--space-sm);
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
  
  .action-grid {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  .user-avatar {
    align-self: flex-end;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .stat-card,
  .progress-card,
  .activity-item,
  .action-card,
  .achievement-item {
    background: var(--bg-primary);
    border-color: var(--border-color);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .progress-fill,
  .category-progress-fill,
  .action-card {
    transition: none;
  }
}
</style>
