<template>
    <div
        v-if="show"
        class="modal fade show d-block"
        style="background-color: rgba(0, 0, 0, 0.7);"
        tabindex="-1"
    >
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 shadow-lg">
                <!-- Modal Header -->
                <div class="modal-header bg-gradient-primary text-white border-0 py-4">
                    <div class="w-100 text-center">
                        <div class="display-3 mb-3">🎯</div>
                        <h3 class="modal-title fw-bold mb-2 text-white">{{ $t('choose_exam_mode') }}</h3>
                        <p class="mb-0 text-white">
                            {{ $t('please_choose_the_mode_that_suits_your_purpose') }}
                        </p>
                    </div>
                </div>

                <!-- Modal Content -->
                <div class="modal-body p-4">
                    <!-- Shuffle Options -->
                    <div class="row mb-4">
                        <div class="col-12">
                            <div class="card border-2 border-info">
                                <div class="card-header bg-info bg-opacity-10 border-0 py-3">
                                    <h6 class="mb-0 fw-bold text-info">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                        </svg>
                                        {{ $t('shuffle_options') }}
                                    </h6>
                                </div>
                                <div class="card-body p-3">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-check">
                                                <input 
                                                    class="form-check-input" 
                                                    type="checkbox" 
                                                    id="shuffleQuestions" 
                                                    v-model="shuffleQuestions"
                                                >
                                                <label class="form-check-label fw-semibold" for="shuffleQuestions">
                                                    {{ $t('shuffle_questions') }}
                                                </label>
                                                <small class="d-block text-muted">{{ $t('shuffle_questions_desc') }}</small>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-check">
                                                <input 
                                                    class="form-check-input" 
                                                    type="checkbox" 
                                                    id="shuffleChoices" 
                                                    v-model="shuffleChoices"
                                                >
                                                <label class="form-check-label fw-semibold" for="shuffleChoices">
                                                    {{ $t('shuffle_choices') }}
                                                </label>
                                                <small class="d-block text-muted">{{ $t('shuffle_choices_desc') }}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row g-4">
                        <!-- Practice Mode -->
                        <div class="col-md-6">
                            <button
                                @click="selectMode('practice')"
                                class="card h-100 border-2 border-secondary text-start w-100 hover-shadow"
                                style="cursor: pointer; transition: all 0.3s ease;"
                            >
                                <div class="card-body position-relative p-4">
                                    <div class="position-absolute top-0 end-0 m-3">
                                        <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                                            <svg
                                                width="24"
                                                height="24"
                                                class="text-success"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <h4 class="fw-bold mb-3 pe-5">{{ $t('practice_mode') }}</h4>
                                    <p class="text-muted mb-4">
                                        {{ $t('practice_mode_description') }}
                                    </p>
                                    <ul class="list-unstyled">
                                        <li class="d-flex align-items-center gap-2 mb-2">
                                            <svg width="16" height="16" class="text-success" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                            </svg>
                                            <span class="small">{{ $t('no_time_limit') }}</span>
                                        </li>
                                        <li class="d-flex align-items-center gap-2 mb-2">
                                            <svg width="16" height="16" class="text-success" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                            </svg>
                                            <span class="small">{{ $t('instant_feedback') }}</span>
                                        </li>
                                        <li class="d-flex align-items-center gap-2 mb-2">
                                            <svg width="16" height="16" class="text-success" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                            </svg>
                                            <span class="small">{{ $t('pause_and_resume') }}</span>
                                        </li>
                                        <li class="d-flex align-items-center gap-2">
                                            <svg width="16" height="16" class="text-success" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                            </svg>
                                            <span class="small">{{ $t('learn_at_your_own_pace') }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </button>
                        </div>

                        <!-- Exam Mode -->
                        <div class="col-md-6">
                            <button
                                @click="selectMode('exam')"
                                class="card h-100 border-2 border-secondary text-start w-100 hover-shadow"
                                style="cursor: pointer; transition: all 0.3s ease;"
                            >
                                <div class="card-body position-relative p-4">
                                    <div class="position-absolute top-0 end-0 m-3">
                                        <div class="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                                            <svg
                                                width="24"
                                                height="24"
                                                class="text-danger"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <h4 class="fw-bold mb-3 pe-5">{{ $t('real_exam') }}</h4>
                                    <p class="text-muted mb-4">
                                        {{ $t('real_exam_description') }}
                                    </p>
                                    <ul class="list-unstyled">
                                        <li class="d-flex align-items-center gap-2 mb-2">
                                            <svg width="16" height="16" class="text-danger" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                            </svg>
                                            <span class="small">{{ $t('time_limited') }}: {{ examDuration }} {{ $t('minutes') }}</span>
                                        </li>
                                        <li class="d-flex align-items-center gap-2 mb-2">
                                            <svg width="16" height="16" class="text-danger" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                            </svg>
                                            <span class="small">{{ $t('no_pause_allowed') }}</span>
                                        </li>
                                        <li class="d-flex align-items-center gap-2 mb-2">
                                            <svg width="16" height="16" class="text-danger" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                            </svg>
                                            <span class="small">{{ $t('final_score_recorded') }}</span>
                                        </li>
                                        <li class="d-flex align-items-center gap-2">
                                            <svg width="16" height="16" class="text-danger" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                            </svg>
                                            <span class="small">{{ $t('simulate_real_exam') }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Exit Button -->
                    <div class="mt-4 pt-3 border-top">
                        <button
                            @click="$emit('exit-to-detail')"
                            class="btn btn-outline-danger btn-lg w-100"
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
import { ref } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

// Composables
const { t } = useTranslation()

// Props
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    examDuration: {
        type: Number,
        default: 60
    }
})

// Reactive data
const shuffleQuestions = ref(true) // Mặc định bật xáo trộn câu hỏi
const shuffleChoices = ref(true) // Mặc định bật xáo trộn đáp án

// Emits
const emit = defineEmits(['select-mode', 'exit-to-detail'])

// Methods
const selectMode = (mode) => {
    emit('select-mode', mode, {
        shuffleQuestions: shuffleQuestions.value,
        shuffleChoices: shuffleChoices.value
    })
}
</script>