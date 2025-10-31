<template>
    <div
      v-if="show"
      class="modal fade show d-block"
      style="background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden animate-fade-in">
          <!-- Header -->
          <div
            class="modal-header bg-gradient-success text-white border-0 d-flex flex-column align-items-center justify-content-center py-3"
          >
            <div class="fs-1 mb-1">🎉</div>
            <h4 class="fw-bold mb-1">{{ $t('exam_completed') }}</h4>
            <p class="text-white-75 small mb-0">
              {{ $t('congratulations_you_have_completed_the_exam') }}
            </p>
          </div>
  
          <!-- Body -->
          <div class="modal-body p-4">
            <div class="row align-items-center justify-content-center mb-4 g-4">
              <!-- Left: Score Circle -->
                <div class="col-md-4 text-center d-flex flex-column align-items-center justify-content-center">
                    <div class="position-relative d-inline-block">
                        <svg width="180" height="180" class="transform -rotate-90">
                        <!-- Vòng nền -->
                        <circle
                            cx="90"
                            cy="90"
                            r="80"
                            stroke="#e9ecef"
                            stroke-width="12"
                            fill="none"
                        />
                        <!-- Vòng màu động -->
                        <circle
                            cx="90"
                            cy="90"
                            r="80"
                            :stroke="circleColor"
                            stroke-width="12"
                            fill="none"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="strokeDashoffset"
                            stroke-linecap="round"
                            class="transition-all duration-1000 ease-in-out"
                        />
                        </svg>

                        <!-- Percentage nằm trong vòng tròn -->
                        <div class="position-absolute top-50 start-50 translate-middle text-center">
                        <div
                            class="fw-bold display-5"
                            :class="percentageClass"
                        >
                            {{ percentage }}%
                        </div>
                        </div>
                    </div>

                    <!-- Score / Total nằm bên dưới -->
                    <div class="mt-0 fw-semibold fs-3 text-dark">
                        {{ score }} / {{ totalQuestions }}
                    </div>
                </div>

  
              <!-- Right: Result Message -->
              <div class="col-md-8 text-center">
                <div
                  class="d-flex flex-column align-items-center justify-content-center"
                >
                <h1 class="mb-0" :class="{
                    'text-success': isPassed,
                    'text-danger': !isPassed
                  }">
                  {{ isPassed ? $t('passed') : $t('un_passed') }}
                </h1>

                  <p class="mt-2 mb-0 fw-normal">
                    {{ isPassed ? $t('you_have_passed_the_exam') : $t('you_have_not_passed_the_exam') }}
                  </p>
                </div>
              </div>
            </div>
  
            <!-- Stats -->
            <div class="row g-3 mb-4 text-center">
              <div class="col-md-4">
                <div class="p-3 rounded-3 shadow-sm bg-success bg-opacity-10 border border-success text-white">
                  <div class="fw-bold fs-3 mb-1">{{ correctCount }}</div>
                  <div class="small fw-semibold">{{ $t('correct_answers') }}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 rounded-3 shadow-sm bg-danger bg-opacity-10 border border-danger text-white">
                  <div class="fw-bold fs-3 mb-1">{{ incorrectCount }}</div>
                  <div class="small fw-semibold">{{ $t('incorrect_answers') }}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 rounded-3 shadow-sm bg-secondary bg-opacity-10 border border-secondary text-white">
                  <div class="fw-bold fs-3 mb-1">{{ unansweredCount }}</div>
                  <div class="small fw-semibold">{{ $t('unanswered') }}</div>
                </div>
              </div>
            </div>
  
            <!-- Actions -->
            <div class="row g-3">
              <!-- Xem lịch sử (cho exam mode) hoặc Làm lại (cho practice mode) -->
              <div class="col-md-6">
                <router-link
                  :to="quizMode === 'exam' ? `/exams/${examSlug}/history` : `/exams/${examSlug}/quiz`"
                  @click="emit('close')"
                  class="btn btn-primary btn-lg w-100 shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  <i :class="quizMode === 'exam' ? 'bi bi-clock-history' : 'bi bi-arrow-repeat'"></i>
                  {{ quizMode === 'exam' ? $t('view_history') : $t('redo_exam') }}
                </router-link>
              </div>
              
              <!-- Về trang exam -->
              <div class="col-md-6">
                <router-link
                  :to="`/exams/${examSlug}`"
                  @click="emit('close')"
                  class="btn btn-outline-secondary btn-lg w-100 shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  <i class="bi bi-arrow-left"></i>
                  {{ $t('back_to_exam') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script setup>

import { computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

// Composables
const { t } = useTranslation()

// Props
const props = defineProps({
  show: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 },
  examSlug: { type: String, required: true },
  passPercent: { type: Number, default: 70 },
  quizMode: { type: String, default: null } // 'practice' hoặc 'exam'
})

// Emits
const emit = defineEmits(['close'])

// 🧮 Computed: Tỷ lệ phần trăm
const percentage = computed(() => {
  if (props.totalQuestions === 0) return 0
  return Math.round((props.correctCount / props.totalQuestions) * 100)
})

// 🧮 Computed: Câu chưa trả lời
const unansweredCount = computed(() => {
  return props.totalQuestions - props.correctCount - props.incorrectCount
})

// 🧮 Computed: Đỗ hay trượt
const isPassed = computed(() => {
  return percentage.value >= props.passPercent
})

// 🟡 Vòng tròn progress
const radius = 80
const circumference = 2 * Math.PI * radius

const strokeDashoffset = computed(() => {
  const progress = (100 - percentage.value) / 100
  return circumference * progress
})

const circleColor = computed(() => {
  if (percentage.value >= 80) return 'url(#greenGradient)'
  if (percentage.value >= 50) return 'url(#yellowGradient)'
  return 'url(#redGradient)'
})

const percentageClass = computed(() => {
  if (percentage.value >= 80) return 'text-success'
  if (percentage.value >= 50) return 'text-warning'
  return 'text-danger'
})

</script>

<style scoped>

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content {
  background-color: #fff;
  border-radius: 1rem;
}

.bg-gradient-success {
  background: linear-gradient(135deg, #198754, #20c997);
}

.text-white-75 {
  color: rgba(255, 255, 255, 0.8);
}

.alert svg {
  transform: scale(1.1);
}

.alert {
  min-height: 150px;
}
svg {
  display: block;
}

.transition-all {
  transition: stroke-dashoffset 1s ease-in-out, stroke 0.5s ease-in-out;
}

.text-success {
  color: #28a745 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}


@media (max-width: 768px) {
  .alert {
    min-height: auto;
    padding: 1rem;
    font-size: 1.2rem;
  }

  svg {
    width: 120px;
    height: 120px;
  }
}
</style>
