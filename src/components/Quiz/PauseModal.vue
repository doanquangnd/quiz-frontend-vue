<template>
    <div
        v-if="show"
        class="modal fade show d-block"
        style="background-color: rgba(0, 0, 0, 0.8);"
        tabindex="-1"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-warning text-white border-0 py-4">
                    <div class="w-100 text-center">
                        <div class="display-3 mb-3">⏸️</div>
                        <h3 class="modal-title fw-bold mb-2">{{ $t('exam_paused') }}</h3>
                        <p class="mb-0 text-white-75">
                            {{ $t('your_exam_has_been_paused') }}
                        </p>
                    </div>
                </div>

                <div class="modal-body p-4">
                    <div class="alert alert-warning mb-4">
                        <p class="mb-0 text-center text-white">
                            {{ $t('time') }}: <strong>{{ formatTime(timeElapsed) }}</strong>
                        </p>
                    </div>

                    <div class="d-grid gap-3">
                        <button
                            @click="$emit('resume-quiz')"
                            class="btn btn-success w-100 btn-lg"
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
                            {{ $t('continue_exam') }}
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
    timeElapsed: {
        type: Number,
        default: 0
    }
})

// Emits
defineEmits(['resume-quiz', 'exit-to-detail'])

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