<template>
    <div class="card border-0 shadow-soft h-100 quiz-sidebar">
        <div class="card-body">
            <div class="sticky-sidebar">
                <h5 class="fw-bold text-dark mb-2">{{ $t('question_list') }}</h5>
                <p class="text-muted small mb-4">
                    {{ $t('answered') }}: {{ answeredQuestions.length }} / {{ questions.length }} {{ $t('total_questions') }}
                </p>

                <!-- Question Grid -->
                <div class="question-grid mb-4">
                    <button
                        v-for="(question, index) in questions"
                        :key="question.id || index"
                        @click="$emit('navigate', index)"
                        class="question-btn btn btn-sm position-relative"
                        :class="getQuestionButtonClass(index)"
                        :aria-label="`${$t('question')} ${index + 1}`"
                        :aria-current="index === currentIndex ? 'true' : 'false'"
                    >
                        {{ index + 1 }}
                        <!-- Checkmark -->
                        <span
                            v-if="answeredQuestions.includes(index)"
                            class="checkmark position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                        >
                            ✓
                        </span>
                    </button>
                </div>

                <!-- Submit Button -->
                <button
                    @click="$emit('submit')"
                    class="btn btn-danger w-100 fw-bold shadow"
                    :disabled="!canSubmit"
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ $t('submit_answer') }}
                    <span v-if="answeredQuestions.length < questions.length" class="ms-2 badge bg-white text-danger">
                        {{ questions.length - answeredQuestions.length }} {{ $t('questions_not_answered') }}
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    currentIndex: {
        type: Number,
        required: true
    },
    answeredQuestions: {
        type: Array,
        default: () => []
    },
    requireAllAnswered: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['navigate', 'submit']);

const getQuestionButtonClass = (index) => {
    const classes = [];
    
    if (index === props.currentIndex) {
        classes.push('btn-primary');
    } else if (props.answeredQuestions.includes(index)) {
        classes.push('btn-success');
    } else {
        classes.push('btn-outline-secondary');
    }
    
    return classes.join(' ');
};

const canSubmit = computed(() => {
    if (props.requireAllAnswered) {
        return props.answeredQuestions.length === props.questions.length;
    }
    return props.answeredQuestions.length > 0;
});
</script>

<style scoped>
.quiz-sidebar {
    position: relative;
}

.sticky-sidebar {
    position: sticky;
    top: 80px;
}

.question-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-height: calc(100vh - 400px);
    overflow-y: auto;
    padding: 0.25rem;
}

.question-btn {
    width: 45px;
    height: 45px;
    flex-shrink: 0;
    transition: all 0.2s ease;
}

.question-btn:hover {
    transform: scale(1.05);
}

.checkmark {
    font-size: 0.6rem;
}

/* Scrollbar styling */
.question-grid::-webkit-scrollbar {
    width: 6px;
}

.question-grid::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.question-grid::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.question-grid::-webkit-scrollbar-thumb:hover {
    background: #555;
}

@media (max-width: 992px) {
    .sticky-sidebar {
        position: static;
    }
    
    .question-grid {
        max-height: 300px;
    }
}
</style>

