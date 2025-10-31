<template>
    <div 
        v-if="show"
        class="answer-result mt-4 rounded border shadow-sm"
        :class="{
            'bg-success bg-opacity-10 border-success': isCorrect,
            'bg-danger bg-opacity-10 border-danger': !isCorrect,
        }"
    >
        <!-- Result Header -->
        <div class="p-3 border-bottom bg-white bg-opacity-50">
            <div class="d-flex align-items-center gap-3">
                <!-- Icon -->
                <div
                    class="rounded d-flex align-items-center justify-content-center flex-shrink-0"
                    style="width: 50px; height: 50px;"
                    :class="isCorrect ? 'bg-success' : 'bg-danger'"
                >
                    <svg
                        v-if="isCorrect"
                        width="24"
                        height="24"
                        class="text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </div>
                
                <!-- Text -->
                <div class="flex-grow-1">
                    <h5 
                        class="mb-1 fw-bold"
                        :class="isCorrect ? 'text-success' : 'text-danger'"
                    >
                        {{ isCorrect ? '🎉 ' + $t('correct') + '!' : ' ' + $t('incorrect') + '!' }}
                    </h5>
                    <p 
                        class="mb-0 small"
                        :class="isCorrect ? 'text-success' : 'text-danger'"
                    >
                        {{ $t('correct_answer') }}: 
                        <span class="badge bg-success fs-6 fw-bold ms-1">
                            {{ correctLetters }}
                        </span>
                    </p>
                </div>
            </div>
        </div>

        <!-- Explanation -->
        <div v-if="explanation" class="p-3">
            <ExplanationCard :content="explanation" />
            
            <!-- Translation Toggle -->
            <TranslationToggle 
                v-if="vietnameseTranslation"
                :translation="vietnameseTranslation"
            />
        </div>
    </div>
</template>

<script setup>
import ExplanationCard from './ExplanationCard.vue';
import TranslationToggle from './TranslationToggle.vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    correctLetters: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        default: null
    },
    vietnameseTranslation: {
        type: Object,
        default: null
    }
});
</script>

<style scoped>
.answer-result {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

