<template>
    <div class="quiz-header-fixed mb-4">
        <div class="d-flex align-items-center justify-content-between flex-wrap">
            <div class="mb-3 mb-md-0">
                <h1 class="h4 fw-bold text-dark mb-2">
                    {{ exam.title }}
                </h1>
                <div class="d-flex align-items-center gap-3">
                    <p class="mb-0">
                        {{ $t('question') }} {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
                    </p>
                    <!-- Mode Badge -->
                    <span
                        v-if="quizMode"
                        class="badge rounded-pill"
                        :class="{
                            'bg-secondary': quizMode === 'practice',
                            'bg-danger': quizMode === 'exam',
                        }"
                    >
                        {{ quizMode === "practice" ? $t('practice') : $t('real_exam') }}
                    </span>
                </div>
            </div>

            <!-- Stats -->
            <div class="d-flex align-items-center gap-4 flex-wrap">
                <!-- Timer -->
                <div
                    v-if="quizMode"
                    class="d-flex align-items-center gap-2"
                >
                    <svg
                        class="text-primary"
                        :class="{
                            'text-danger': quizMode === 'exam' && timeRemaining <= 60,
                            'text-warning': quizMode === 'exam' && timeRemaining <= 300 && timeRemaining > 60,
                        }"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span
                        class="fw-semibold"
                        :class="{
                            'text-primary': quizMode === 'practice',
                            'text-danger': quizMode === 'exam' && timeRemaining <= 60,
                            'text-warning': quizMode === 'exam' && timeRemaining <= 300 && timeRemaining > 60,
                        }"
                    >
                        {{
                            quizMode === "practice"
                                ? formatTime(timeElapsed)
                                : formatTime(timeRemaining)
                        }}
                    </span>
                </div>

                <!-- Pause Button (Practice Mode Only) -->
                <button
                    v-if="quizMode === 'practice'"
                    @click="$emit('pause-quiz')"
                    class="btn btn-warning btn-sm d-flex align-items-center gap-2"
                >
                    <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{{ $t('pause') }}</span>
                </button>
                
                <!-- Progress Bar -->
                <div class="d-flex align-items-center gap-3">
                    <div class="text-muted small">
                        {{ $t('progress') }}:
                        <span class="fw-semibold text-dark">{{
                            Math.round((answeredCount / totalQuestions) * 100)
                        }}%</span>
                    </div>
                    <div class="progress" style="width: 100px; height: 8px;">
                        <div
                            class="progress-bar"
                            :class="{
                                'bg-success': percentage >= 70,
                                'bg-warning': percentage >= 50 && percentage < 70,
                                'bg-danger': percentage < 50,
                            }"
                            :style="{ width: percentage + '%' }"
                            role="progressbar"
                        ></div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="d-flex align-items-center gap-3">
                    <div class="text-center">
                        <div class="fw-bold text-success">{{ correctCount }}</div>
                        <div class="small text-muted">{{ $t('correct') }}</div>
                    </div>
                    <div class="text-center">
                        <div class="fw-bold text-danger">{{ incorrectCount }}</div>
                        <div class="small text-muted">{{ $t('incorrect') }}</div>
                    </div>
                    <div class="text-center">
                        <div class="fw-bold text-info">{{ unansweredCount }}</div>
                        <div class="small text-muted">{{ $t('unanswered') }}</div>
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
    exam: {
        type: Object,
        required: true
    },
    currentQuestionIndex: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    quizMode: {
        type: String,
        default: null
    },
    timeElapsed: {
        type: Number,
        default: 0
    },
    timeRemaining: {
        type: Number,
        default: 0
    },
    answeredCount: {
        type: Number,
        default: 0
    },
    correctCount: {
        type: Number,
        default: 0
    },
    incorrectCount: {
        type: Number,
        default: 0
    }
})

// Emits
defineEmits(['pause-quiz'])

// Computed
const percentage = computed(() => {
    if (props.totalQuestions === 0) return 0
    return Math.round((props.answeredCount / props.totalQuestions) * 100)
})

const unansweredCount = computed(() => {
    return props.totalQuestions - props.answeredCount
})

// Methods
const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
        return `${hours} ${t('hours')} ${minutes} ${t('minutes')} ${secs} ${t('seconds')}`
    } else if (minutes > 0) {
        return `${minutes} ${t('minutes')} ${secs} ${t('seconds')}`
    } else {
        return `${secs} ${t('seconds')}`
    }
}
</script>