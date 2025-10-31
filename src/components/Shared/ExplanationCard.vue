<template>
    <div class="card bg-primary bg-opacity-10 border-primary explanation-card">
        <div class="card-body container">
            <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center gap-2">
                    <div class="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center icon-wrapper">
                        <svg width="18" height="18" class="text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <span class="fw-bold text-dark">{{ title }}</span>
                </div>
                
                <!-- Inline Line Length Control -->
                <BasicLineControl />
            </div>
            
            <div class="explanation-content text-dark" v-html="content"></div>
        </div>
    </div>
</template>

<script setup>
import BasicLineControl from './BasicLineControl.vue';

const props = defineProps({
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: `${$t('detailed_explanation')}`
    }
});
</script>

<style scoped>
.explanation-card {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.icon-wrapper {
    width: 32px;
    height: 32px;
}

.explanation-content {
    font-size: var(--explanation-font-size, 0.95rem);
    line-height: var(--explanation-line-height, 1.6);
    max-width: var(--explanation-line-length, 80ch);
    word-wrap: break-word;
    overflow-wrap: break-word;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
    .explanation-content {
        max-width: var(--mobile-line-length, 45ch);
    }
}

.explanation-content :deep(code) {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.9em;
}

.explanation-content :deep(pre) {
    background-color: #1e1e1e;
    color: #f8f8f2;
    border-radius: 6px;
    padding: 1rem;
    margin: 0.5rem 0;
}

.explanation-content :deep(pre code) {
    background: transparent;
    color: inherit;
}
</style>

