<template>
  <div>
    <PageTitle :title="$t('my_profile')" />
    <AppLayout>
    <div class="container-fluid py-4">
      <!-- Loading State -->
      <div v-if="loading" class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow-soft">
            <div class="card-body p-4">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- Profile Content -->
      <div v-else-if="stats">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow-soft">
            <div class="card-body p-4">
              <div class="d-flex align-items-center">
                <div class="icon icon-shape icon-lg bg-gradient-primary text-center rounded-3 me-3">
                  <i class="ni ni-single-02 text-white opacity-10"></i>
                </div>
                <div>
                  <h5 class="mb-0 text-dark">{{ $t('my_profile') }}</h5>
                  <p class="text-sm text-muted mb-0">{{ $t('view_your_profile_information') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Info Card -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow-soft">
            <div class="card-header bg-gradient-primary p-4">
              <div class="row align-items-center">
                <div class="col-auto">
                  <div class="avatar avatar-xl bg-white rounded-circle d-flex align-items-center justify-content-center">
                    <span class="text-primary font-weight-bold text-lg">
                      {{ getInitials(stats.name) }}
                    </span>
                  </div>
                </div>
                <div class="col">
                  <h4 class="text-white mb-1">{{ stats.name }}</h4>
                  <p class="text-white text-sm mb-2 opacity-8">
                    <i class="ni ni-email-83 me-1"></i>
                    {{ stats.email }}
                  </p>
                  <div class="d-flex gap-2">
                    <span class="badge bg-white text-primary">
                      {{ getRoleLabel(stats.role) }}
                    </span>
                    <span :class="['badge', stats.status === 'active' ? 'bg-success' : 'bg-warning']">
                      {{ getStatusLabel(stats.status) }}
                    </span>
                  </div>
                </div>
                <div class="col-auto text-end d-none d-md-block">
                  <div class="text-white">
                    <div class="mb-2">
                      <small class="text-xs opacity-8">{{ $t('member_since') }}</small>
                      <div class="font-weight-bold">{{ formatDate(stats.joined_date) }}</div>
                    </div>
                    <div v-if="stats.global_rank">
                      <small class="text-xs opacity-8">{{ $t('global_rank') }}</small>
                      <div class="font-weight-bold">#{{ stats.global_rank }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="row">
                <!-- Level & XP -->
                <div class="col-md-6 mb-3">
                  <label class="form-label text-sm font-weight-bold mb-2">
                    {{ $t('level') }}
                  </label>
                  <div class="d-flex align-items-center gap-3">
                    <div class="level-badge">
                      <div class="level-circle bg-gradient-primary">
                        <span class="text-white font-weight-bold">{{ stats.level }}</span>
                      </div>
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between mb-1">
                        <span class="text-xs text-muted">{{ $t('experience') }}</span>
                        <span class="text-xs font-weight-bold">
                          {{ formatNumber(stats.experience) }} / {{ formatNumber(stats.experience_to_next_level) }} XP
                        </span>
                      </div>
                      <div class="progress" style="height: 8px;">
                        <div 
                          class="progress-bar bg-gradient-primary" 
                          role="progressbar" 
                          :style="{ width: stats.level_progress + '%' }"
                          :aria-valuenow="stats.level_progress"
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Rank Tier -->
                <div class="col-md-6 mb-3">
                  <label class="form-label text-sm font-weight-bold mb-2">
                    {{ $t('rank_tier') }}
                  </label>
                  <div class="d-flex align-items-center gap-2">
                    <div :class="['tier-badge', 'tier-' + stats.rank_tier]">
                      <i class="ni ni-trophy"></i>
                    </div>
                    <span class="font-weight-bold text-capitalize">
                      {{ $t(stats.rank_tier) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="row mb-4">
        <!-- Points Card -->
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-0 shadow-soft h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="icon icon-shape icon-sm bg-gradient-success text-center rounded-3 me-2">
                  <i class="ni ni-money-coins text-white"></i>
                </div>
                <h6 class="mb-0">{{ $t('total_points') }}</h6>
              </div>
              <h3 class="font-weight-bold text-success mb-2">
                {{ formatNumber(stats.total_points) }}
              </h3>
              <div class="text-sm text-muted">
                <i class="ni ni-chart-bar-32 me-1"></i>
                {{ $t('lifetime') }}: {{ formatNumber(stats.lifetime_points) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Quizzes Card -->
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-0 shadow-soft h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="icon icon-shape icon-sm bg-gradient-primary text-center rounded-3 me-2">
                  <i class="ni ni-book-bookmark text-white"></i>
                </div>
                <h6 class="mb-0">{{ $t('quizzes_completed') }}</h6>
              </div>
              <h3 class="font-weight-bold text-primary mb-2">
                {{ formatNumber(stats.quizzes_completed) }}
              </h3>
              <div class="text-sm text-muted">
                <i class="ni ni-satisfied me-1"></i>
                {{ $t('perfect_scores') }}: {{ formatNumber(stats.perfect_scores) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Accuracy Card -->
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-0 shadow-soft h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="icon icon-shape icon-sm bg-gradient-info text-center rounded-3 me-2">
                  <i class="ni ni-chart-pie-35 text-white"></i>
                </div>
                <h6 class="mb-0">{{ $t('accuracy') }}</h6>
              </div>
              <h3 class="font-weight-bold text-info mb-2">
                {{ stats.accuracy.toFixed(1) }}%
              </h3>
              <div class="text-sm text-muted">
                <i class="ni ni-check-bold me-1"></i>
                {{ formatNumber(stats.total_correct_answers) }} / {{ formatNumber(stats.total_questions_answered) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Streak Card -->
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-0 shadow-soft h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="icon icon-shape icon-sm bg-gradient-warning text-center rounded-3 me-2">
                  <i class="ni ni-like-2 text-white"></i>
                </div>
                <h6 class="mb-0">{{ $t('current_streak') }}</h6>
              </div>
              <h3 class="font-weight-bold text-warning mb-2">
                {{ formatNumber(stats.current_streak) }} {{ $t('days') }}
              </h3>
              <div class="text-sm text-muted">
                <i class="ni ni-trophy me-1"></i>
                {{ $t('longest') }}: {{ formatNumber(stats.longest_streak) }} {{ $t('days') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance & Achievements -->
      <div class="row">
        <!-- Performance Details -->
        <div class="col-lg-8 mb-4">
          <div class="card border-0 shadow-soft h-100">
            <div class="card-header bg-transparent border-bottom">
              <div class="d-flex align-items-center">
                <div class="icon icon-shape icon-sm bg-gradient-primary text-center rounded-3 me-2">
                  <i class="ni ni-chart-bar-32 text-white"></i>
                </div>
                <h6 class="mb-0">{{ $t('performance_overview') }}</h6>
              </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span class="text-sm text-muted">
                      <i class="ni ni-book-bookmark me-2"></i>
                      {{ $t('quizzes_completed') }}
                    </span>
                    <span class="font-weight-bold">{{ formatNumber(stats.quizzes_completed) }}</span>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span class="text-sm text-muted">
                      <i class="ni ni-satisfied me-2"></i>
                      {{ $t('perfect_scores') }}
                    </span>
                    <span class="font-weight-bold">{{ formatNumber(stats.perfect_scores) }}</span>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span class="text-sm text-muted">
                      <i class="ni ni-check-bold me-2"></i>
                      {{ $t('correct_answers') }}
                    </span>
                    <span class="font-weight-bold">{{ formatNumber(stats.total_correct_answers) }}</span>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span class="text-sm text-muted">
                      <i class="ni ni-bold-down me-2"></i>
                      {{ $t('total_questions') }}
                    </span>
                    <span class="font-weight-bold">{{ formatNumber(stats.total_questions_answered) }}</span>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span class="text-sm text-muted">
                      <i class="ni ni-chart-pie-35 me-2"></i>
                      {{ $t('accuracy_rate') }}
                    </span>
                    <span class="font-weight-bold text-info">{{ stats.accuracy.toFixed(1) }}%</span>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span class="text-sm text-muted">
                      <i class="ni ni-world-2 me-2"></i>
                      {{ $t('global_rank') }}
                    </span>
                    <span class="font-weight-bold text-warning">
                      {{ stats.global_rank ? '#' + stats.global_rank : 'N/A' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Achievements -->
        <div class="col-lg-4 mb-4">
          <div class="card border-0 shadow-soft h-100">
            <div class="card-header bg-transparent border-bottom">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="icon icon-shape icon-sm bg-gradient-success text-center rounded-3 me-2">
                    <i class="ni ni-trophy text-white"></i>
                  </div>
                  <h6 class="mb-0">{{ $t('recent_achievements') }}</h6>
                </div>
                <span class="badge bg-gradient-success">{{ stats.achievements_count }}</span>
              </div>
            </div>
            <div class="card-body">
              <div v-if="stats.recent_achievements.length > 0" class="achievement-list">
                <div 
                  v-for="(achievement, index) in stats.recent_achievements" 
                  :key="index"
                  class="achievement-item d-flex align-items-start mb-3 pb-3"
                  :class="{ 'border-bottom': index < stats.recent_achievements.length - 1 }"
                >
                  <div class="achievement-icon me-3">
                    <div class="icon icon-shape icon-sm bg-gradient-success text-center rounded-3">
                      <i :class="[achievement.icon, 'text-white']"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="text-sm font-weight-bold mb-1">{{ achievement.name }}</h6>
                    <p class="text-xs text-muted mb-1">{{ achievement.description }}</p>
                    <span class="text-xs text-success">
                      <i class="ni ni-check-bold me-1"></i>
                      {{ achievement.completed_at }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4">
                <i class="ni ni-trophy text-muted fs-3 mb-3"></i>
                <p class="text-sm text-muted mb-0">{{ $t('no_achievements_yet') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    </AppLayout>
  </div>
</template>

<script setup>
import PageTitle from '@/components/PageTitle.vue';
import { ref, onMounted } from 'vue'
import { ProfileService } from '@/services/profile-service.js'
import { useAuthStore } from '@/stores/auth.js'
import { useToastStore } from '@/stores/toast.js'
import AppLayout from '@/layouts/AppLayout.vue'
import { useSeo, SEO_CONFIGS } from '@/composables/useSeo.js'
import { SEO_CONFIGS_EN } from '@/composables/useSeo.en.js'
import { SEO_CONFIGS_JA } from '@/composables/useSeo.ja.js'
import { useTranslation } from '@/composables/useTranslation'

// Stores
const auth_store = useAuthStore()
const toast = useToastStore()
const { locale } = useTranslation()

// SEO Setup
const init_seo = () => {
  let configs
  if (locale.value === 'en') {
    configs = SEO_CONFIGS_EN
  } else if (locale.value === 'ja') {
    configs = SEO_CONFIGS_JA
  } else {
    configs = SEO_CONFIGS
  }
  useSeo({
    ...configs.profile,
    robots: 'noindex, nofollow',
  })
}
init_seo()

// State
const stats = ref(null)
const loading = ref(true)
const error = ref(null)

// Fetch profile data from API
const fetchProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await ProfileService.get()
    
    if (response.success) {
      stats.value = response.stats
    } else {
      throw new Error(response.message || 'Failed to load profile')
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = err.response?.data?.message || err.message || 'Không thể tải thông tin profile'
    toast.error('Không thể tải thông tin profile')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})

// Helper functions
const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getRoleLabel = (role) => {
  const roles = {
    admin: 'Admin',
    teacher: 'Teacher',
    student: 'Student'
  }
  return roles[role] || role
}

const getStatusLabel = (status) => {
  const statuses = {
    active: 'Active',
    inactive: 'Inactive'
  }
  return statuses[status] || status
}

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.level-badge {
  position: relative;
}

.level-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.tier-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tier-legendary { background: linear-gradient(135deg, #FFD700, #FFA500); color: white; }
.tier-master { background: linear-gradient(135deg, #C0C0C0, #A9A9A9); color: white; }
.tier-expert { background: linear-gradient(135deg, #CD7F32, #A0522D); color: white; }
.tier-veteran { background: linear-gradient(135deg, #4169E1, #1E90FF); color: white; }
.tier-proficient { background: linear-gradient(135deg, #32CD32, #228B22); color: white; }
.tier-novice { background: linear-gradient(135deg, #808080, #696969); color: white; }

.achievement-list {
  max-height: 400px;
  overflow-y: auto;
}

.achievement-list::-webkit-scrollbar {
  width: 6px;
}

.achievement-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.achievement-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.achievement-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.shadow-soft {
  box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075) !important;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}

.skeleton-title {
  height: 20px;
  width: 60%;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-text {
  height: 16px;
  width: 100%;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

