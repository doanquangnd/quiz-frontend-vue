<template>
  <div class="leaderboard-card">
    <!-- Header -->
    <div class="leaderboard-header">
      <h2 class="leaderboard-title">
        <i class="fas fa-trophy"></i>
        Bảng xếp hạng
      </h2>
      
      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab-button', { active: activeTab === tab.key }]"
          @click="changeTab(tab.key)"
        >
          <i :class="tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>
      
      <!-- Period Filter -->
      <div class="period-filter" v-if="activeTab === 'global'">
        <button 
          v-for="period in periods" 
          :key="period.key"
          :class="['period-button', { active: activePeriod === period.key }]"
          @click="changePeriod(period.key)"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải bảng xếp hạng...</p>
    </div>

    <!-- Leaderboard Content -->
    <div v-else class="leaderboard-content">
      <!-- Top 3 Podium -->
      <div class="podium" v-if="topThree.length > 0">
        <div class="podium-item second" v-if="topThree[1]">
          <div class="podium-rank">2</div>
          <div class="podium-avatar">
            <img :src="topThree[1].avatar" :alt="topThree[1].name" />
            <div class="podium-badge silver">
              <i class="fas fa-medal"></i>
            </div>
          </div>
          <div class="podium-name">{{ topThree[1].name }}</div>
          <div class="podium-value">{{ formatValue(topThree[1]) }}</div>
        </div>

        <div class="podium-item first" v-if="topThree[0]">
          <div class="podium-rank">1</div>
          <div class="podium-avatar">
            <img :src="topThree[0].avatar" :alt="topThree[0].name" />
            <div class="podium-badge gold">
              <i class="fas fa-crown"></i>
            </div>
          </div>
          <div class="podium-name">{{ topThree[0].name }}</div>
          <div class="podium-value">{{ formatValue(topThree[0]) }}</div>
        </div>

        <div class="podium-item third" v-if="topThree[2]">
          <div class="podium-rank">3</div>
          <div class="podium-avatar">
            <img :src="topThree[2].avatar" :alt="topThree[2].name" />
            <div class="podium-badge bronze">
              <i class="fas fa-medal"></i>
            </div>
          </div>
          <div class="podium-name">{{ topThree[2].name }}</div>
          <div class="podium-value">{{ formatValue(topThree[2]) }}</div>
        </div>
      </div>

      <!-- Rankings List -->
      <div class="rankings-list">
        <div 
          v-for="user in remainingUsers" 
          :key="user.user_id"
          :class="['ranking-item', { 'current-user': isCurrentUser(user.user_id) }]"
        >
          <div class="rank-number" :class="getRankClass(user.rank)">
            {{ user.rank }}
          </div>
          
          <div class="user-avatar-small">
            <img :src="user.avatar" :alt="user.name" />
          </div>
          
          <div class="user-details">
            <div class="user-name">
              {{ user.name }}
              <span v-if="isCurrentUser(user.user_id)" class="you-badge">Bạn</span>
            </div>
            <div class="user-meta">
              <span v-if="user.level">Level {{ user.level }}</span>
              <span v-if="user.quizzes_completed">{{ user.quizzes_completed }} bài thi</span>
            </div>
          </div>
          
          <div class="user-score">
            <div class="score-value">{{ formatValue(user) }}</div>
            <div class="score-label">{{ getScoreLabel() }}</div>
          </div>
          
          <!-- Badges -->
          <div class="user-badges" v-if="user.badges && user.badges.length > 0">
            <span 
              v-for="badge in user.badges" 
              :key="badge.type"
              class="badge"
              :style="{ backgroundColor: badge.color }"
              :title="badge.label"
            >
              {{ badge.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- Current User Rank (if not in top) -->
      <div v-if="userRank && !isInTop()" class="current-user-rank">
        <div class="rank-divider">
          <span>...</span>
        </div>
        <div class="ranking-item current-user highlighted">
          <div class="rank-number">{{ userRank.rank }}</div>
          <div class="user-avatar-small">
            <img :src="currentUserAvatar" alt="You" />
          </div>
          <div class="user-details">
            <div class="user-name">
              Bạn
              <span class="rank-tier" :style="{ color: getRankColor(userRank.rank_tier) }">
                {{ getRankLabel(userRank.rank_tier) }}
              </span>
            </div>
            <div class="user-meta">
              <span v-if="userRank.level">Level {{ userRank.level }}</span>
            </div>
          </div>
          <div class="user-score">
            <div class="score-value">{{ formatUserRankValue(userRank) }}</div>
            <div class="score-label">{{ getScoreLabel() }}</div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="load-more">
        <button @click="loadMore" class="load-more-button">
          <i class="fas fa-chevron-down"></i>
          Xem thêm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { http } from '@/api/http-client.js'

const props = defineProps({
  currentUserId: {
    type: Number,
    default: null
  }
})

// State
const activeTab = ref('global')
const activePeriod = ref('all')
const loading = ref(false)
const leaderboard = ref([])
const userRank = ref(null)
const currentUserAvatar = ref('')
const limit = ref(50)
const hasMore = ref(false)

// Tabs configuration
const tabs = [
  { key: 'global', label: 'Tổng điểm', icon: 'fas fa-star' },
  { key: 'level', label: 'Cấp độ', icon: 'fas fa-level-up-alt' },
  { key: 'streak', label: 'Chuỗi ngày', icon: 'fas fa-fire' },
  { key: 'accuracy', label: 'Độ chính xác', icon: 'fas fa-bullseye' },
]

const periods = [
  { key: 'all', label: 'Tất cả' },
  { key: 'month', label: 'Tháng này' },
  { key: 'week', label: 'Tuần này' },
]

// Computed
const topThree = computed(() => {
  return leaderboard.value.slice(0, 3)
})

const remainingUsers = computed(() => {
  return leaderboard.value.slice(3)
})

// Methods
const fetchLeaderboard = async () => {
  loading.value = true
  
  try {
    let endpoint = ''
    let params = { limit: limit.value }
    
    switch (activeTab.value) {
      case 'global':
        endpoint = '/api/leaderboard/global'
        params.period = activePeriod.value
        break
      case 'level':
        endpoint = '/api/leaderboard/level'
        break
      case 'streak':
        endpoint = '/api/leaderboard/streak'
        break
      case 'accuracy':
        endpoint = '/api/leaderboard/accuracy'
        break
    }
    
    const response = await http.get(endpoint, { params })
    
    if (response.data.success) {
      leaderboard.value = response.data.leaderboard
      userRank.value = response.data.user_rank || null
      hasMore.value = leaderboard.value.length >= limit.value
    }
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
  } finally {
    loading.value = false
  }
}

const changeTab = (tab) => {
  activeTab.value = tab
  activePeriod.value = 'all'
  fetchLeaderboard()
}

const changePeriod = (period) => {
  activePeriod.value = period
  fetchLeaderboard()
}

const loadMore = () => {
  limit.value += 50
  fetchLeaderboard()
}

const formatValue = (user) => {
  switch (activeTab.value) {
    case 'global':
      return new Intl.NumberFormat('vi-VN').format(user.total_points)
    case 'level':
      return `Level ${user.level}`
    case 'streak':
      return `${user.current_streak} ngày`
    case 'accuracy':
      return `${user.accuracy}%`
    default:
      return ''
  }
}

const formatUserRankValue = (rank) => {
  switch (activeTab.value) {
    case 'global':
      return new Intl.NumberFormat('vi-VN').format(rank.total_points)
    case 'level':
      return `Level ${rank.level}`
    case 'streak':
      return `${rank.current_streak} ngày`
    case 'accuracy':
      return `${rank.accuracy}%`
    default:
      return ''
  }
}

const getScoreLabel = () => {
  switch (activeTab.value) {
    case 'global':
      return 'điểm'
    case 'level':
      return 'cấp độ'
    case 'streak':
      return 'chuỗi'
    case 'accuracy':
      return 'độ chính xác'
    default:
      return ''
  }
}

const isCurrentUser = (userId) => {
  return userId === props.currentUserId
}

const isInTop = () => {
  if (!userRank.value) return false
  return userRank.value.rank <= limit.value
}

const getRankClass = (rank) => {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  if (rank <= 10) return 'rank-top10'
  return ''
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

// Lifecycle
onMounted(() => {
  fetchLeaderboard()
})
</script>

<style scoped>
.leaderboard-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header */
.leaderboard-header {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.leaderboard-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tab-button {
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tab-button.active {
  background: white;
  color: #667eea;
  border-color: white;
}

.period-filter {
  display: flex;
  gap: 0.5rem;
}

.period-button {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.period-button.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Podium */
.podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background: linear-gradient(180deg, #f8fafc 0%, white 100%);
}

.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.podium-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.podium-item.first {
  order: 2;
  min-width: 140px;
  transform: translateY(-20px);
}

.podium-item.second {
  order: 1;
  min-width: 120px;
}

.podium-item.third {
  order: 3;
  min-width: 120px;
}

.podium-rank {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 8px rgba(79, 70, 229, 0.3);
}

.podium-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
}

.podium-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e5e7eb;
}

.podium-badge {
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.podium-badge.gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
}

.podium-badge.silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%);
}

.podium-badge.bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #a0522d 100%);
}

.podium-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;
}

.podium-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4f46e5;
}

/* Rankings List */
.rankings-list {
  padding: 1rem 2rem 2rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.ranking-item:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.ranking-item.current-user {
  background: linear-gradient(90deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
  border-color: #4f46e5;
}

.ranking-item.highlighted {
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}

.rank-number {
  min-width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.rank-number.rank-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: white;
}

.rank-number.rank-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%);
  color: white;
}

.rank-number.rank-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #a0522d 100%);
  color: white;
}

.rank-number.rank-top10 {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
}

.user-avatar-small {
  width: 48px;
  height: 48px;
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.you-badge {
  padding: 0.125rem 0.5rem;
  background: #4f46e5;
  color: white;
  font-size: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
}

.rank-tier {
  font-size: 0.875rem;
  font-weight: 600;
}

.user-meta {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  gap: 1rem;
}

.user-score {
  text-align: right;
}

.score-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4f46e5;
}

.score-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
}

.user-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

/* Current User Rank */
.current-user-rank {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px dashed #e5e7eb;
}

.rank-divider {
  text-align: center;
  color: #9ca3af;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 1.25rem;
}

/* Load More */
.load-more {
  text-align: center;
  padding: 1rem;
}

.load-more-button {
  padding: 0.75rem 2rem;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.load-more-button:hover {
  background: #e5e7eb;
  color: #1f2937;
}

/* Responsive */
@media (max-width: 768px) {
  .leaderboard-header {
    padding: 1.5rem;
  }
  
  .podium {
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .podium-item {
    min-width: auto !important;
    padding: 1rem 0.5rem;
  }
  
  .podium-avatar {
    width: 60px;
    height: 60px;
  }
  
  .rankings-list {
    padding: 1rem;
  }
  
  .ranking-item {
    flex-wrap: wrap;
  }
  
  .user-badges {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>

