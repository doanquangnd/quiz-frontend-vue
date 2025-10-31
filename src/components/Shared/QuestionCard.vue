<template>
    <div class="card border-0 shadow-soft question-card">
        <div class="card-body p-4">
            <!-- Question Number Badge -->
            <div class="mb-3">
                <span class="badge bg-primary fs-6">
                    {{ $t('question_number', { number: number }) }} / {{ total }}
                </span>
                <span v-if="category" class="badge bg-secondary ms-2">
                    {{ category }}
                </span>
            </div>
            
            <!-- Question Content -->
            <div class="question-content-wrapper">
                <div class="bg-light border rounded p-4 mb-4">
                    <div 
                        class="question-text" 
                        v-html="processedContent"
                        ref="contentRef"
                    ></div>
                </div>
            </div>
            
            <!-- Slot for Choices -->
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { highlightCodeBlocksWithNextTick, processContentForHighlight } from '@/utils/highlight.js';

const props = defineProps({
    question: {
        type: Object,
        required: true,
        validator: (value) => {
            return value.id && value.content;
        }
    },
    number: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: null
    }
});

const contentRef = ref(null);

// Process content to ensure proper formatting
const processedContent = computed(() => {
    return processContentForHighlight(props.question.content);
});

/**
 * Highlight code blocks using highlight.js utility
 */
const highlightCodeBlocks = () => {
    if (contentRef.value) {
        highlightCodeBlocksWithNextTick(contentRef.value, nextTick);
    }
};

onMounted(() => {
    highlightCodeBlocks();
});

watch(() => props.question, () => {
    highlightCodeBlocks();
}, { deep: true });
</script>

<style scoped>
.question-card {
    transition: box-shadow 0.3s ease;
}

.question-text {
    color: #1e293b;
    font-size: 1rem;
    line-height: 1.7;
}

/* Code block styling */
.question-text :deep(pre) {
    background-color: #1e1e1e;
    color: #f8f8f2;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
}

.question-text :deep(pre code) {
    background: transparent;
    color: inherit;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
}

.question-text :deep(p) {
    margin: 0.5rem 0;
}
</style>

