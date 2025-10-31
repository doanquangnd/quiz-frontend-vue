<template>
    <!-- Quiz Content -->
    <div class="quiz-content-wrapper row mt-4">
        <!-- Sidebar - Exam Mode Only -->
        <div
            v-if="quizMode === 'exam'"
            class="col-lg-3 mb-4"
        >
            <div class="card border-0 shadow-soft h-100">
                <div class="card-body">
                    <div class="sticky-top" style="top: 80px;">
                        <h5 class="fw-bold text-dark mb-2">
                            {{ $t('question_list') }}
                        </h5>
                        <p class="text-muted small mb-4">
                            {{ $t('completed') }}: {{ answeredQuestions.length }} /
                            {{ shuffledQuestions.length }}
                        </p>

                        <div class="d-flex flex-wrap gap-2 mb-4" style="max-height: calc(100vh - 400px); overflow-y: auto;">
                            <button
                                v-for="(question, index) in shuffledQuestions"
                                :key="index"
                                @click="goToQuestion(index)"
                                class="btn btn-sm position-relative"
                                style="width: 45px; height: 45px;"
                                :class="{
                                    'btn-primary': index === currentQuestionIndex,
                                    'btn-success': answeredQuestions.includes(index) && index !== currentQuestionIndex,
                                    'btn-outline-secondary': !answeredQuestions.includes(index) && index !== currentQuestionIndex,
                                }"
                            >
                                {{ index + 1 }}
                                <!-- Checkmark for answered questions -->
                                <span
                                    v-if="answeredQuestions.includes(index)"
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                                    style="font-size: 0.6rem;"
                                >
                                    ✓
                                </span>
                            </button>
                        </div>

                        <!-- Submit Button in Sidebar -->
                        <button
                            @click="submitExam"
                            class="btn btn-danger w-100 fw-bold shadow"
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {{ $t('submit_exam') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Quiz Area -->
        <div :class="quizMode === 'exam' ? 'col-lg-9' : 'col-12'">
            <!-- Empty State -->
            <div
                v-if="!shuffledQuestions || shuffledQuestions.length === 0"
                class="d-flex align-items-center justify-center min-vh-50"
            >
                <div class="card border-0 shadow-lg text-center p-5" style="max-width: 500px;">
                    <div class="mb-4">
                        <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 100px; height: 100px;">
                            <svg
                                width="50"
                                height="50"
                                class="text-primary"
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
                    <h3 class="h4 fw-bold text-dark mb-3">
                        {{ $t('no_questions_yet') }}
                    </h3>
                    <p class="text-muted mb-4">
                        {{ $t('no_questions_yet') }} {{ $t('please_try_again_later') }}
                    </p>
                    <router-link
                        :to="resolve_route_name('exams.index')"
                        class="btn btn-primary btn-lg"
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
                        {{ $t('return_to_exam_list') }}
                    </router-link>
                </div>
            </div>

            <!-- Question Card -->
            <div v-if="currentQuestion" class="container card border-0 shadow-soft quiz-content question-card-transition">
                <div class="card-body p-4">
                    <!-- Question Text -->
                    <div class="mb-4">
                        <div class="bg-light border rounded p-4">
                            <div
                                class="question-text"
                                v-html="processContentForHighlight(currentQuestion?.content)"
                            ></div>
                        </div>
                    </div>

                    <!-- Choices Grid -->
                    <div class="row g-2 mb-4">
                        <div
                            v-for="(choice, index) in shuffledChoices"
                            :key="choice.id"
                            class="col-12 col-lg-6"
                        >
                            <div
                                @click="toggleChoice(choice.id)"
                                class="card h-100 cursor-pointer transition-all choice-option"
                                :class="{
                                    'border-info bg-white shadow-sm selected':
                                        selected.includes(choice.id) &&
                                        !showAnswer,
                                    'border-success bg-white shadow-sm':
                                        showAnswer &&
                                        isChoiceCorrect(choice.id),
                                    'border-danger bg-white shadow-sm':
                                        showAnswer &&
                                        selected.includes(choice.id) &&
                                        !isChoiceCorrect(choice.id),
                                    'opacity-60':
                                        showAnswer &&
                                        !isChoiceCorrect(choice.id) &&
                                        !selected.includes(choice.id),
                                    'border-light bg-white': !selected.includes(choice.id) && !showAnswer,
                                }"
                                style="cursor: pointer; min-height: 65px;"
                            >
                                <div class="card-body d-flex align-items-center gap-3 p-3">
                                    <!-- Choice Letter -->
                                    <div class="flex-shrink-0">
                                        <div
                                            class="rounded-circle d-flex align-items-center justify-content-center choice-letter"
                                            :class="{
                                                'bg-info text-white':
                                                    selected.includes(
                                                        choice.id
                                                    ) && !showAnswer,
                                                'bg-success text-white':
                                                    showAnswer &&
                                                    isChoiceCorrect(
                                                        choice.id
                                                    ),
                                                'bg-warning text-dark':
                                                    showAnswer &&
                                                    selected.includes(
                                                        choice.id
                                                    ) &&
                                                    !isChoiceCorrect(
                                                        choice.id
                                                    ),
                                                'bg-light text-secondary':
                                                    !selected.includes(
                                                        choice.id
                                                    ) && !showAnswer,
                                            }"
                                        >
                                            {{ letters[index] }}
                                        </div>
                                    </div>

                                    <!-- Choice Content -->
                                    <div class="flex-grow-1">
                                        <FormattedText
                                            :content="choice?.content"
                                            :preserve-formatting="true"
                                            text-class="text-dark small"
                                            font-family="monospace"
                                        />
                                    </div>

                                    <!-- Status Icon -->
                                    <div
                                        v-if="showAnswer"
                                        class="flex-shrink-0"
                                    >
                                        <div
                                            v-if="isChoiceCorrect(choice.id)"
                                            class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                                            style="width: 28px; height: 28px;"
                                        >
                                            <svg
                                                width="14"
                                                height="14"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="3"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <div
                                            v-else-if="selected.includes(choice.id)"
                                            class="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center"
                                            style="width: 28px; height: 28px;"
                                        >
                                            <svg
                                                width="14"
                                                height="14"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="3"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Button - Practice Mode -->
                    <div
                        v-if="quizMode === 'practice'"
                        class="text-center"
                    >
                        <button
                            v-if="!showAnswer"
                            @click="submitAnswer"
                            :disabled="selected.length === 0"
                            class="btn btn-primary btn-lg px-5"
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{{ $t('check_answer') }}</span>
                        </button>

                        <button
                            v-if="showAnswer"
                            @click="nextQuestion"
                            class="btn btn-success btn-lg px-5"
                        >
                            <span>{{
                                currentQuestionIndex <
                                shuffledQuestions.length - 1
                                    ? $t('next_question')
                                    : $t('finish_exam')
                            }}</span>
                            <svg
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                class="ms-2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </button>
                    </div>

                    <!-- Action Buttons - Exam Mode -->
                    <div
                        v-if="quizMode === 'exam'"
                        class="d-flex justify-content-center gap-3"
                    >
                        <button
                            @click="submitAnswer"
                            :disabled="selected.length === 0"
                            class="btn btn-primary btn-lg px-4"
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
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span>{{ $t('confirm') }}</span>
                        </button>

                        <button
                            v-if="
                                currentQuestionIndex <
                                shuffledQuestions.length - 1
                            "
                            @click="nextQuestion"
                            class="btn btn-secondary btn-lg px-4"
                        >
                            <span>{{ $t('next_question') }}</span>
                            <svg
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                class="ms-2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </button>

                        <button
                            v-if="
                                currentQuestionIndex >=
                                shuffledQuestions.length - 1
                            "
                            @click="submitExam"
                            class="btn btn-danger btn-lg px-4"
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{{ $t('submit_exam') }}</span>
                        </button>
                    </div>

                    <!-- Answer Result -->
                    <div
                        v-if="showAnswer"
                        id="quiz-result-section"
                        class="mt-4 rounded border shadow-sm"
                        :class="{
                            'bg-info bg-opacity-10 border-info':
                                isCurrentAnswerCorrect,
                            'bg-warning bg-opacity-10 border-danger':
                                !isCurrentAnswerCorrect,
                        }"
                    >
                        <!-- Result Header -->
                        <div class="p-3 border-bottom bg-white bg-opacity-50">
                            <div class="d-flex align-items-center gap-3">
                                <div
                                    class="rounded d-flex align-items-center justify-content-center flex-shrink-0"
                                    style="width: 50px; height: 50px;"
                                    :class="{
                                        'bg-success':
                                            isCurrentAnswerCorrect,
                                        'bg-danger':
                                            !isCurrentAnswerCorrect,
                                    }"
                                >
                                    <svg
                                        v-if="isCurrentAnswerCorrect"
                                        width="24"
                                        height="24"
                                        class="text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <svg
                                        v-else
                                        width="24"
                                        height="24"
                                        class="text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <div class="flex-grow-1">
                                    <h5
                                        class="mb-1 fw-bold"
                                        :class="{
                                            'text-success':
                                                isCurrentAnswerCorrect,
                                            'text-danger':
                                                !isCurrentAnswerCorrect,
                                        }"
                                    >
                                        {{
                                            isCurrentAnswerCorrect
                                                ? "🎉 " + $t('correct') + "!"
                                                : " " + $t('incorrect') + "!"
                                        }}
                                    </h5>
                                    <p
                                        class="mb-0 small"
                                        :class="{
                                            'text-success':
                                                isCurrentAnswerCorrect,
                                            'text-danger':
                                                !isCurrentAnswerCorrect,
                                        }"
                                    >
                                        {{ $t('correct_answer') }}: <span class="badge bg-success fs-6 fw-bold ms-auto">
                                            {{ correctLettersDisplay }}
                                    </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Correct Answer & Explanation -->
                        <div class="p-3">
                            <!-- Explanation -->
                            <div id="quiz-explanation-section" class="card mb-3 border">
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-3">
                                        <div class="d-flex align-items-center gap-2">
                                            <div class="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    class="text-primary"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <span class="fw-bold">{{ $t('detailed_explanation') }}</span>
                                        </div>
                                        
                                        <!-- Inline Line Length Control -->
                                        <BasicLineControl />
                                    </div>
                                    <div
                                        class="text-dark small prose"
                                        v-html="currentQuestion?.explanation"
                                    ></div>
                                    
                                    <!-- Translation Toggle -->
                                    <TranslationToggle 
                                        v-if="currentQuestion?.vietnamese_translation"
                                        :translation="currentQuestion.vietnamese_translation"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { computed } from 'vue'
import { resolve_route_name } from '@/utils/route-helper.js'
import { useTranslation } from '@/composables/useTranslation'
import { processContentForHighlight } from '@/utils/highlight.js'
import BasicLineControl from '@/components/Shared/BasicLineControl.vue'
import FormattedText from '@/components/Shared/FormattedText.vue'
import TranslationToggle from '@/components/Shared/TranslationToggle.vue'
// Composables
const { t } = useTranslation()

// Props
const props = defineProps({
    quizMode: {
        type: String,
        required: true
    },
    currentQuestion: {
        type: Object,
        required: true
    },
    currentQuestionIndex: {
        type: Number,
        required: true
    },
    shuffledQuestions: {
        type: Array,
        required: true
    },
    shuffledChoices: {
        type: Array,
        default: () => []
    },
    selected: {
        type: Array,
        default: () => []
    },
    showAnswer: {
        type: Boolean,
        default: false
    },
    answeredQuestions: {
        type: Array,
        default: () => []
    }
})

// Emits
const emit = defineEmits([
    'previous-question',
    'next-question', 
    'check-answer',
    'finish-exam',
    'choice-change',
    'go-to-question',
    'submit-answer',
    'submit-exam'
])

// Constants
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

// Computed
const questionNumber = computed(() => props.currentQuestionIndex + 1)

const isMultipleChoice = computed(() => {
    return props.currentQuestion?.choices?.filter(c => c.is_correct).length > 1
})

const isCurrentAnswerCorrect = computed(() => {
    if (!props.showAnswer || props.selected.length === 0) return false
    
    const correctChoices = props.currentQuestion?.choices?.filter(c => c.is_correct).map(c => c.id) || []
    return props.selected.every(id => correctChoices.includes(id)) && 
           props.selected.length === correctChoices.length
})

const correctLettersDisplay = computed(() => {
    if (!props.currentQuestion?.choices) return ''
    
    const correctChoices = props.currentQuestion.choices.filter(c => c.is_correct)
    const correctIndices = correctChoices.map(choice => {
        const index = props.shuffledChoices.findIndex(c => c.id === choice.id)
        return letters[index]
    })
    
    return correctIndices.join(', ')
})

// Methods
const isSelected = (choiceId) => {
    return props.selected.includes(choiceId)
}

const isCorrect = (choiceId) => {
    return props.currentQuestion?.choices?.find(c => c.id === choiceId)?.is_correct || false
}

const isChoiceCorrect = (choiceId) => {
    return isCorrect(choiceId)
}

const handleChoiceChange = (choiceId) => {
    emit('choice-change', choiceId)
}

const toggleChoice = (choiceId) => {
    emit('choice-change', choiceId)
}

const goToQuestion = (index) => {
    emit('go-to-question', index)
}

const nextQuestion = () => {
    emit('next-question')
}

const previousQuestion = () => {
    emit('previous-question')
}

const submitAnswer = () => {
    emit('submit-answer')
}

const submitExam = () => {
    emit('submit-exam')
}
</script>

<style scoped>
/* Typography cho phần explanation trong quiz */
.prose {
    max-width: var(--explanation-line-length, 80ch);
    line-height: var(--explanation-line-height, 1.7);
    word-wrap: break-word;
    overflow-wrap: break-word;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
    .prose {
        max-width: var(--mobile-line-length, 45ch);
    }
}

/* Question Card Transition Effects */
.question-card-transition {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
    opacity: 1;
}

.question-card-transition.question-enter {
    transform: translateY(20px);
    opacity: 0;
}

.question-card-transition.question-enter-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-card-transition.question-leave {
    transform: translateY(0);
    opacity: 1;
}

.question-card-transition.question-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(-20px);
    opacity: 0;
}

/* Choice options transition */
.choice-option {
    transition: all 0.2s ease-in-out;
}

.choice-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

/* Smooth scroll behavior */
html {
    scroll-behavior: smooth;
}
</style>
