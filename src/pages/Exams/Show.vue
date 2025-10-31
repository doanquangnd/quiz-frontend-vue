<template>
  <AppLayout :breadcrumb="`Exams / ${exam?.title || 'Loading...'}`">
    <!-- Loading State -->
    <div v-if="loading" class="card border-0 shadow-soft">
      <div class="card-body p-4">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Exam Content -->
    <div v-else-if="exam">
    <!-- Exam Header Card -->
    <div class="card border-0 shadow-soft mb-4">
      <div class="card-body p-4">
        <div class="row align-items-center">
          <!-- Icon & Title -->
          <div class="col-lg-8">
            <div class="d-flex align-items-start">
              <div class="bg-gradient-success rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0" style="width: 56px; height: 56px;">
                <i class="ni ni-paper-diploma text-white fs-4"></i>
              </div>
              <div class="flex-grow-1">
                <h1 class="h3 fw-bold text-dark mb-2">{{ exam.title }}</h1>
                <p v-if="exam.description" class="text-muted mb-0" v-html="exam.description"></p>
                
                <!-- Inline Stats - Thu gọn -->
                <div class="d-flex flex-wrap gap-3 mt-3">
                  <div class="d-flex align-items-center">
                    <i class="ni ni-ui-04 text-primary me-2"></i>
                    <span class="text-muted small">{{ exam.questions_count || 0 }} {{ $t('questions') }}</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <i class="ni ni-watch-time text-warning me-2"></i>
                    <span class="text-muted small">{{ exam.duration_minutes || '∞' }} {{ exam.duration_minutes ? $t('minutes') : $t('no_limit') }}</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <i class="ni ni-check-bold text-success me-2"></i>
                    <span class="text-muted small">{{ $t('passing_score') }}: {{ exam.passing_score || 60 }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <div class="d-grid gap-2">
              <router-link
                :to="`/exams/${exam.slug}/quiz`"
                class="btn btn-primary btn-lg shadow-sm"
              >
                <i class="ni ni-button-play me-2"></i>
                {{ $t('start_exam') }}
              </router-link>
              <router-link
                :to="`/exams/${exam.slug}/history`"
                class="btn btn-outline-secondary"
              >
                <i class="bi bi-clock-history me-2"></i>
                {{ $t('view_history') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Info -->
    <div class="card border-0 shadow-soft">
      <div class="card-body p-4">
        <div class="row g-3 text-center text-md-start">
          <div class="col-md-4">
            <div class="d-flex align-items-center">
              <i class="ni ni-bulb-61 text-info fs-4 me-3"></i>
              <div>
                <div class="fw-bold text-dark mb-0">{{ $t('detailed_explanations') }}</div>
                <small class="text-muted">{{ $t('learn_from_mistakes') }}</small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="d-flex align-items-center">
              <i class="ni ni-trophy text-warning fs-4 me-3"></i>
              <div>
                <div class="fw-bold text-dark mb-0">{{ $t('instant_results') }}</div>
                <small class="text-muted">{{ $t('immediate_feedback') }}</small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="d-flex align-items-center">
              <i class="ni ni-refresh-69 text-success fs-4 me-3"></i>
              <div>
                <div class="fw-bold text-dark mb-0">{{ $t('unlimited_attempts') }}</div>
                <small class="text-muted">{{ $t('practice_until_perfect') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { ExamService } from '@/services/exam-service.js'
import { useToastStore } from '@/stores/toast.js'

const route = useRoute()
const toast = useToastStore()

// State
const exam = ref(null)
const loading = ref(true)
const error = ref(null)

// Fetch exam
const fetch_exam = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await ExamService.get_by_slug(route.params.examSlug)
    
    if (response.success) {
      exam.value = response.data
    } else {
      throw new Error(response.message || 'Exam not found')
    }
  } catch (err) {
    console.error('Error loading exam:', err)
    error.value = err.response?.data?.message || err.message
    toast.error('Không thể tải bài thi')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetch_exam()
})

const correctAnswersCount = computed(() => {
  return exam.value?.questions?.filter(q => q.is_multiple_choice).length || 0
})
</script>
