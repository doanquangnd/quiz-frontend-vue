<template>
  <div>
    <PageTitle :title="$t('my_dashboard')" />
    <AppLayout>
    <div class="row">
      <!-- Page Header -->
      <div class="col-12">
        <div class="card border-0 shadow-soft mb-4">
          <div class="card-body p-4">
            <div class="d-flex align-items-center mb-3">
              <div class="icon icon-shape icon-sm bg-gradient-primary text-center rounded-3 me-3">
                <i class="ni ni-tv-2 text-white opacity-10"></i>
              </div>
              <h5 class="mb-0 text-dark">{{ $t('my_dashboard') }}</h5>
            </div>
            <p class="text-sm text-muted mb-0">{{ $t('welcome_to') }} {{ $t('quiz_system') }}</p>
          </div>
        </div>
      </div>
      
      <!-- Stats Cards -->
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <div class="card border-0 shadow-soft">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-9">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ $t('documents_in_progress') }}</p>
                  <h5 class="font-weight-bolder mb-0">{{ loading ? '...' : stats.documents_in_progress }}</h5>
                </div>
              </div>
              <div class="col-3 text-end">
                <div class="icon icon-shape icon-sm bg-gradient-primary text-center rounded-3">
                  <i class="ni ni-books text-white opacity-10"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <div class="card border-0 shadow-soft">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-9">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ $t('documents_completed') }}</p>
                  <h5 class="font-weight-bolder mb-0">{{ loading ? '...' : stats.documents_completed }}</h5>
                </div>
              </div>
              <div class="col-3 text-end">
                <div class="icon icon-shape icon-sm bg-gradient-success text-center rounded-3">
                  <i class="ni ni-check-bold text-white opacity-10"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <div class="card border-0 shadow-soft">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-9">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ $t('exams_in_progress') }}</p>
                  <h5 class="font-weight-bolder mb-0">{{ loading ? '...' : stats.exams_in_progress }}</h5>
                </div>
              </div>
              <div class="col-3 text-end">
                <div class="icon icon-shape icon-sm bg-gradient-info text-center rounded-3">
                  <i class="ni ni-paper-diploma text-white opacity-10"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <div class="card border-0 shadow-soft">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-9">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ $t('exams_passed') }}</p>
                  <h5 class="font-weight-bolder mb-0">{{ loading ? '...' : stats.exams_passed }}</h5>
                </div>
              </div>
              <div class="col-3 text-end">
                <div class="icon icon-shape icon-sm bg-gradient-warning text-center rounded-3">
                  <i class="ni ni-trophy text-white opacity-10"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gamification Stats -->
      <!-- <div class="col-12 mb-4">
        <UserStats 
          :user-stats="gamification?.user_stats || {}"
          :level-progress="gamification?.level_progress || {}"
        />
      </div> -->

      <!-- Streak Stats -->
      <!-- <div v-if="isEnableStreak" class="col-xl-6 col-lg-12 mb-4">
        <StreakStats 
          :current-streak="gamification?.current_streak || 0"
          :longest-streak="gamification?.longest_streak || 0"
          :streak-history="gamification?.streak_history || []"
        />
      </div> -->

      <!-- Quick Actions -->
      <!-- <div v-if="isEnableAchievements" class="col-xl-6 col-lg-12 mb-4">
        <div class="card border-0 shadow-soft h-100 quick-actions">
          <div class="card-header bg-gradient-info text-white pb-2">
            <div class="d-flex align-items-center">
              <div class="icon icon-shape icon-sm bg-white text-center rounded-3 me-3">
                <i class="ni ni-bullet-list-67 text-info text-sm opacity-10"></i>
              </div>
              <div>
                <h6 class="mb-0 text-white">{{ $t('quick_actions') }}</h6>
                <small class="text-white opacity-75">Truy cập nhanh các tính năng</small>
              </div>
            </div>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-12">
                <router-link :to="resolve_route_name('achievements.index')" class="btn btn-sm bg-gradient-primary w-100 d-flex align-items-center justify-content-center">
                  <div class="icon icon-shape icon-xs bg-white text-center rounded-circle me-2">
                    <i class="ni ni-trophy text-primary opacity-10"></i>
                  </div>
                  <span>{{ $t('achievements') }}</span>
                  <i class="ni ni-bold-down ms-auto"></i>
                </router-link>
              </div>
              <div class="col-12">
                <router-link :to="resolve_route_name('leaderboard.index')" class="btn btn-sm bg-gradient-success w-100 d-flex align-items-center justify-content-center">
                  <div class="icon icon-shape icon-xs bg-white text-center rounded-circle me-2">
                    <i class="ni ni-chart-bar-32 text-success opacity-10"></i>
                  </div>
                  <span>{{ $t('leaderboard') }}</span>
                  <i class="ni ni-bold-up ms-auto"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Document Progress Section -->
      <div class="col-12 mt-4">
        <div class="card border-0 shadow-soft">
          <div class="card-header pb-0 p-3">
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="mb-0">{{ $t('my_document_progress') }}</h6>
              <router-link :to="resolve_route_name('documents.index')" class="btn btn-sm bg-gradient-primary">{{ $t('view_all_documents') }}</router-link>
            </div>
          </div>
          <div class="card-body p-3">
            <div v-if="document_progresses.length === 0" class="text-center py-4">
              <div class="icon icon-shape icon-lg bg-gradient-secondary text-center rounded-3 mb-3 mx-auto" style="width: 80px;">
                <i class="ni ni-books text-white opacity-10"></i>
              </div>
              <h6 class="text-muted">{{ $t('no_document_progress') }}</h6>
              <p class="text-sm text-muted mb-3">{{ $t('start_learning_documents') }}</p>
              <router-link :to="resolve_route_name('documents.index')" class="btn bg-gradient-primary btn-sm">{{ $t('browse_documents') }}</router-link>
            </div>
            <div v-else class="row">
              <div v-for="progress in document_progresses" :key="progress.id" class="col-md-6 mb-4">
                <div class="card card-body border-0 shadow-soft">
                  <div class="d-flex align-items-center mb-3">
                    <div class="icon icon-shape icon-sm bg-gradient-primary text-center rounded-3 me-3">
                      <i class="ni ni-books text-white opacity-10"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="font-weight-bold mb-0">{{ progress.document_title }}</h6>
                      <p class="text-sm text-muted mb-0">{{ $t('last_accessed') }}: {{ progress.last_accessed_at }}</p>
                    </div>
                    <span :class="progress.status === 'completed' ? 'badge bg-gradient-success' : 'badge bg-gradient-info'">
                      {{ progress.status === 'completed' ? $t('completed') : $t('in_progress') }}
                    </span>
                  </div>
                  
                  <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="text-sm font-weight-bold">{{ $t('progress') }}</span>
                      <span class="text-sm font-weight-bold">{{ Math.round(progress.completion_percentage) }}%</span>
                    </div>
                    <div class="progress">
                      <div class="progress-bar bg-gradient-primary" :style="{ width: progress.completion_percentage + '%' }"></div>
                    </div>
                  </div>

                  <div class="row text-center">
                    <div class="col-4">
                      <div class="text-sm font-weight-bold">{{ progress.completed_categories }}/{{ progress.total_categories }}</div>
                      <div class="text-xs text-muted">{{ $t('chapters') }}</div>
                    </div>
                    <div class="col-4">
                      <div class="text-sm font-weight-bold">{{ Math.round(progress.average_score) }}%</div>
                      <div class="text-xs text-muted">{{ $t('average_score') }}</div>
                    </div>
                    <div class="col-4">
                      <div v-if="progress.current_category" class="text-sm font-weight-bold">{{ progress.current_category.title }}</div>
                      <div v-else class="text-sm font-weight-bold">-</div>
                      <div class="text-xs text-muted">{{ $t('current_chapter') }}</div>
                    </div>
                  </div>

                  <div class="mt-3">
                    <router-link :to="resolve_route_name('documents.show', { documentSlug: progress.document_slug })" class="btn btn-sm bg-gradient-primary w-100">
                      {{ progress.status === 'completed' ? $t('review_document') : $t('continue_learning') }}
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exam Progress Section -->
      <div class="col-12 mt-4">
        <div class="card border-0 shadow-soft">
          <div class="card-header pb-0 p-3">
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="mb-0">{{ $t('my_exam_progress') }}</h6>
              <router-link :to="resolve_route_name('exams.index')" class="btn btn-sm bg-gradient-success">{{ $t('view_all_exams') }}</router-link>
            </div>
          </div>
          <div class="card-body p-3">
            <div v-if="exam_attempts.length === 0" class="text-center py-4">
              <div class="icon icon-shape icon-lg bg-gradient-secondary text-center rounded-3 mb-3 mx-auto" style="width: 80px;">
                <i class="ni ni-paper-diploma text-white opacity-10"></i>
              </div>
              <h6 class="text-muted">{{ $t('no_exam_attempts') }}</h6>
              <p class="text-sm text-muted mb-3">{{ $t('start_taking_exams') }}</p>
              <router-link :to="resolve_route_name('exams.index')" class="btn bg-gradient-success btn-sm">{{ $t('take_exam') }}</router-link>
            </div>
            <div v-else class="row">
              <div v-for="attempt in exam_attempts" :key="attempt.id" class="col-md-6 mb-4">
                <div class="card card-body border-0 shadow-soft">
                  <div class="d-flex align-items-center mb-3">
                    <div class="icon icon-shape icon-sm bg-gradient-success text-center rounded-3 me-3">
                      <i class="ni ni-paper-diploma text-white opacity-10"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="font-weight-bold mb-0">{{ attempt.exam_title }}</h6>
                      <p class="text-sm text-muted mb-0">
                        {{ $t('last_accessed') }}: {{ attempt.last_accessed_at }}
                      </p>
                    </div>
                    <span :class="getExamStatusBadgeClass(attempt)">
                      {{ getExamStatusText(attempt) }}
                    </span>
                  </div>
                  
                  <div v-if="attempt.status === 'completed'" class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="text-sm font-weight-bold">{{ $t('score') }}</span>
                      <span class="text-sm font-weight-bold">{{ Math.round(attempt.score_percentage) }}%</span>
                    </div>
                    <div class="progress">
                      <div :class="getScoreProgressBarClass(attempt)" :style="{ width: attempt.score_percentage + '%' }"></div>
                    </div>
                  </div>

                  <div class="row text-center">
                    <div class="col-4">
                      <div class="text-sm font-weight-bold">{{ attempt.answered_questions }}/{{ attempt.total_questions }}</div>
                      <div class="text-xs text-muted">{{ $t('questions') }}</div>
                    </div>
                    <div class="col-4">
                      <div class="text-sm font-weight-bold">{{ attempt.correct_answers }}</div>
                      <div class="text-xs text-muted">{{ $t('correct') }}</div>
                    </div>
                    <div class="col-4">
                      <div class="text-sm font-weight-bold">{{ attempt.total_questions - attempt.answered_questions }}</div>
                      <div class="text-xs text-muted">{{ $t('remaining') }}</div>
                    </div>
                  </div>

                  <div class="mt-3">
                    <router-link :to="resolve_route_name('exams.show', { examSlug: attempt.exam_slug })" class="btn btn-sm bg-gradient-success w-100">
                      {{ attempt.status === 'completed' ? $t('retake_exam') : $t('continue_exam') }}
                    </router-link>
                  </div>
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
import { ref, onMounted, computed } from 'vue'
import { resolve_route_name } from '@/utils/route-helper.js'
import AppLayout from "@/layouts/AppLayout.vue";
import PageTitle from '@/components/PageTitle.vue';
import { DashboardService } from '@/services/dashboard-service.js'
import { useToastStore } from '@/stores/toast.js'
import { useAuthStore } from '@/stores/auth.js'
import { useSeo, SEO_CONFIGS } from '@/composables/useSeo.js'
import { SEO_CONFIGS_EN } from '@/composables/useSeo.en.js'
import { SEO_CONFIGS_JA } from '@/composables/useSeo.ja.js'
import { useTranslation } from '@/composables/useTranslation'

// Stores
const toast = useToastStore()
const auth_store = useAuthStore()
const { locale } = useTranslation()

// SEO Setup - Dashboard requires login, use noindex
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
    ...configs.dashboard,
    robots: 'noindex, nofollow',
  })
}
init_seo()

// State
const loading = ref(true)
const error = ref(null)
const stats = ref({
  documents_in_progress: 0,
  documents_completed: 0,
  exams_in_progress: 0,
  exams_passed: 0,
})
const document_progresses = ref([])
const exam_attempts = ref([])
const gamification = ref({})

// Computed
const isEnableAchievements = import.meta.env.VITE_ENABLE_ACHIEVEMENTS === 'true'

// Fetch dashboard data
const fetch_dashboard = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await DashboardService.get_dashboard_data()
    
    if (response.success && response.data) {
      stats.value = response.data.stats || stats.value
      document_progresses.value = response.data.document_progresses || []
      exam_attempts.value = response.data.exam_attempts || []
      gamification.value = response.data.gamification || {}
    } else {
      throw new Error(response.message || 'Failed to load dashboard')
    }
  } catch (err) {
    console.error('Error loading dashboard:', err)
    error.value = err.response?.data?.message || err.message
    toast.error('Không thể tải dashboard')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetch_dashboard()
})

// Helper methods for exam status
const getExamStatusBadgeClass = (attempt) => {
  if (attempt.status === 'completed') {
    return attempt.is_passed ? 'badge bg-gradient-success' : 'badge bg-gradient-danger';
  }
  return 'badge bg-gradient-info';
};

const getExamStatusText = (attempt) => {
  if (attempt.status === 'completed') {
    return attempt.is_passed ? 'Passed' : 'Failed';
  }
  return 'In Progress';
};

const getScoreProgressBarClass = (attempt) => {
  if (attempt.score_percentage >= 80) {
    return 'progress-bar bg-gradient-success';
  } else if (attempt.score_percentage >= 60) {
    return 'progress-bar bg-gradient-warning';
  }
  return 'progress-bar bg-gradient-danger';
};
</script>

<style scoped>
/* StreakStats và Quick Actions đồng bộ */
.streak-stats .card,
.quick-actions .card {
  height: 100%;
}

/* Icon shapes consistency */
.icon-shape {
  width: 32px;
  height: 32px;
}

.icon-shape.icon-xs {
  width: 20px;
  height: 20px;
}

/* Button hover effects */
.btn:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Milestone hover effects */
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