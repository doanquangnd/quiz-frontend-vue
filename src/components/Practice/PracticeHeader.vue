<template>
    <div class="practice-header-fixed rounded-3">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <!-- Left: Breadcrumb & Title -->
            <div class="mb-3 mb-md-0">
                <!-- Breadcrumb -->
                <div class="text-muted small mb-2">
                    <router-link 
                        :to="resolve_route_name('documents.show', { documentSlug: category.document.slug })" 
                        class="text-decoration-none text-muted hover-primary"
                    >
                        {{ category.document.title }}
                    </router-link>
                    <span class="mx-2">›</span>
                    <span class="text-dark">{{ category.title }}</span>
                </div>
                
                <!-- Title -->
                <h4 class="h4 fw-bold text-dark mb-2">{{ $t('learn_by_chapter') }}</h4>
                
                <!-- Question Counter -->
                <p class="mb-0">
                    {{ $t('question') }} {{ currentQuestion }} / {{ totalQuestions }}
                </p>
            </div>

            <!-- Right: Stats -->
            <div class="d-flex align-items-center gap-4 flex-wrap">
                <!-- Progress Bar -->
                <div class="d-flex align-items-center gap-3">
                    <div class="text-muted small">
                        {{ $t('progress') }}:
                        <span class="fw-semibold text-dark">
                            {{ progressPercentage }}%
                        </span>
                    </div>
                    <div class="progress" style="width: 200px; height: 12px;">
                        <div
                            class="progress-bar bg-gradient-primary"
                            role="progressbar"
                            :style="{ width: progressPercentage + '%' }"
                            :aria-valuenow="progressPercentage"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                </div>
                
                <!-- Score Display -->
                <div v-if="answeredCount > 0" class="d-flex gap-3">
                    <div class="text-center">
                        <div class="h5 fw-bold text-success mb-0">{{ correctCount }}</div>
                        <div class="text-muted small">{{ $t('correct') }}</div>
                    </div>
                    <div class="text-center">
                        <div class="h5 fw-bold text-danger mb-0">
                            {{ answeredCount - correctCount }}
                        </div>
                        <div class="text-muted small">{{ $t('incorrect') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { resolve_route_name } from '@/utils/route-helper.js';
import { computed } from 'vue';

const props = defineProps({
    category: {
        type: Object,
        required: true,
        validator: (value) => {
            return value.document && value.title;
        }
    },
    currentQuestion: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    answeredCount: {
        type: Number,
        default: 0
    },
    correctCount: {
        type: Number,
        default: 0
    }
});

const progressPercentage = computed(() => {
    if (props.totalQuestions === 0) return 0;
    return Math.round((props.answeredCount / props.totalQuestions) * 100);
});
</script>

<style scoped>
.practice-header-fixed {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: white;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    margin-bottom: 1rem;
}

.hover-primary:hover {
    color: var(--bs-primary) !important;
}

@media (max-width: 768px) {
    .practice-header-fixed {
        padding: 0.75rem;
    }
}
</style>

