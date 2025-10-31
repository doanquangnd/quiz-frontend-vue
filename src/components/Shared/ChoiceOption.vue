<template>
    <div class="col-12 col-lg-6">
        <div
            @click="handleClick"
            class="card h-100 cursor-pointer choice-card"
            :class="cardClasses"
            role="button"
            :aria-pressed="selected"
            :tabindex="disabled ? -1 : 0"
            @keydown.enter="handleClick"
            @keydown.space.prevent="handleClick"
        >
            <div class="card-body d-flex align-items-center gap-3 p-3">
                <!-- Letter Circle -->
                <div 
                    class="choice-letter rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    :class="letterClasses"
                >
                    {{ letter }}
                </div>
                
                <!-- Content -->
                <div class="flex-grow-1 choice-content">
                    <FormattedText
                        :content="choice.content"
                        :preserve-formatting="true"
                        text-class="small"
                        font-family="monospace"
                    />
                </div>
                
                <!-- Status Icon -->
                <div v-if="showAnswer" class="flex-shrink-0">
                    <!-- Correct Icon -->
                    <div
                        v-if="isCorrect"
                        class="status-icon bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <!-- Incorrect Icon -->
                    <div
                        v-else-if="selected"
                        class="status-icon bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import FormattedText from './FormattedText.vue';

const props = defineProps({
    choice: {
        type: Object,
        required: true,
        validator: (value) => value.id && value.content
    },
    letter: {
        type: String,
        required: true,
        validator: (value) => /^[A-Z]$/.test(value)
    },
    selected: {
        type: Boolean,
        default: false
    },
    showAnswer: {
        type: Boolean,
        default: false
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['click']);

const handleClick = () => {
    if (!props.disabled && !props.showAnswer) {
        emit('click', props.choice.id);
    }
};

const cardClasses = computed(() => ({
    'selected border-info bg-white shadow-sm': props.selected && !props.showAnswer,
    'correct border-success bg-white shadow-sm': props.showAnswer && props.isCorrect,
    'incorrect border-danger bg-white shadow-sm': props.showAnswer && props.selected && !props.isCorrect,
    'faded opacity-60': props.showAnswer && !props.isCorrect && !props.selected,
    'default border-light bg-white': !props.selected && !props.showAnswer,
    'disabled': props.disabled
}));

const letterClasses = computed(() => ({
    'bg-info text-white': props.selected && !props.showAnswer,
    'bg-success text-white': props.showAnswer && props.isCorrect,
    'bg-danger text-white': props.showAnswer && props.selected && !props.isCorrect,
    'bg-light text-secondary': !props.selected && !props.showAnswer
}));
</script>

<style scoped>
.choice-card {
    transition: all 0.3s ease;
    min-height: 65px;
    border-width: 2px;
}

.choice-card:not(.disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.choice-card.disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

.cursor-pointer {
    cursor: pointer;
}

.choice-letter {
    width: 36px;
    height: 36px;
    font-size: 0.95rem;
    border: 2px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.choice-letter.bg-info {
    border-color: #0dcaf0;
    box-shadow: 0 3px 8px rgba(13, 202, 240, 0.3);
}

.choice-letter.bg-success {
    border-color: #198754;
    box-shadow: 0 3px 8px rgba(25, 135, 84, 0.3);
}

.choice-letter.bg-danger {
    border-color: #dc3545;
    box-shadow: 0 3px 8px rgba(220, 53, 69, 0.3);
}

.choice-content {
    color: #1e293b;
}

.status-icon {
    width: 28px;
    height: 28px;
}
</style>

