<template>
    <div
        v-if="show"
        class="modal fade show d-block"
        style="background-color: rgba(0, 0, 0, 0.6);"
        tabindex="-1"
    >
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 shadow-lg">
                <!-- Modal Header -->
                <div class="modal-header bg-gradient-primary text-white border-0 py-4">
                    <div class="w-100 text-center">
                        <div class="display-3 mb-3"></div>
                        <h3 class="modal-title fw-bold mb-2 text-white">
                            {{ $t('progress_saved') }}
                        </h3>
                        <p class="mb-0 text-white">
                            {{ $t('we_detected_that_you_have_already_completed_this_exam_before') }} <br>
                            {{ $t('you_can_continue_from_where_you_left_off_or_start_from_the_beginning') }}
                        </p>

                    </div>
                </div>

                <!-- Modal Content -->
                <div class="modal-body p-4">
                    <!-- Progress Info -->
                    <div class="row g-4 mb-4">
                        <div class="col-md-4">
                            <div class="text-center p-3 bg-light rounded">
                                <div class="display-6 fw-bold text-primary">{{ savedProgress.current_question_index || 0 }}</div>
                                <div class="small text-muted">{{ $t('current_question') }}</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center p-3 bg-light rounded">
                                <div class="display-6 fw-bold text-success">{{ savedProgress.correct_count || 0 }}</div>
                                <div class="small text-muted">{{ $t('correct_answers') }}</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center p-3 bg-light rounded">
                                <div class="display-6 fw-bold text-info">{{ savedProgress.answered_count || 0 }}</div>
                                <div class="small text-muted">{{ $t('answered') }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Mode and Time Info -->
                    <div class="row g-4 mb-4">
                        <div class="col-md-6">
                            <div class="card border-0 bg-light">
                                <div class="card-body p-3 text-center">
                                    <div class="mb-2">
                                        <span 
                                            class="badge rounded-pill fs-6"
                                            :class="{
                                                'bg-secondary': savedProgress.quiz_mode === 'practice',
                                                'bg-danger': savedProgress.quiz_mode === 'exam'
                                            }"
                                        >
                                            {{ savedProgress.quiz_mode === 'practice' ? $t('practice') : $t('real_exam') }}
                                        </span>
                                    </div>
                                    <div class="small text-muted">{{ $t('exam_mode') }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card border-0 bg-light">
                                <div class="card-body p-3 text-center">
                                    <div class="fw-bold text-primary mb-1">
                                        {{ savedProgress.quiz_mode === 'practice' ? formatTime(savedProgress.time_elapsed || 0) : formatTime(savedProgress.time_remaining || 0) }}
                                    </div>
                                    <div class="small text-muted">
                                        {{ savedProgress.quiz_mode === 'practice' ? $t('time_elapsed') : $t('time_remaining') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="d-grid">
                        <button
                            @click="$emit('resume-progress')"
                            class="btn btn-success btn-lg"
                        >
                            <svg
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                class="me-2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {{ $t('continue_from_where_you_left_off') }}
                        </button>
                        
                        <button
                            @click="$emit('start-fresh')"
                            class="btn btn-secondary btn-lg"
                        >
                            <svg
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                class="me-2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            {{ $t('start_from_the_beginning') }}
                        </button>

                        <button
                            @click="$emit('exit-to-detail')"
                            class="btn btn-outline-danger btn-lg"
                        >
                            <svg
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                class="me-2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            {{ $t('back_to_exam_detail') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTranslation } from '@/composables/useTranslation'

// Composables
const { t } = useTranslation()

// Props
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    savedProgress: {
        type: Object,
        default: () => ({})
    }
})

// Emits
defineEmits(['resume-progress', 'start-fresh', 'exit-to-detail'])

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
