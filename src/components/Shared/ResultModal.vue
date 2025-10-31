<template>
    <Teleport to="body">
        <div
            v-if="show"
            class="modal fade show d-block result-modal"
            style="background-color: rgba(0, 0, 0, 0.6);"
            tabindex="-1"
            @click.self="handleBackdropClick"
        >
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow-lg">
                    <!-- Modal Header -->
                    <div class="modal-header bg-gradient-primary text-white border-0 py-5">
                        <div class="w-100 text-center">
                            <div class="display-1 mb-4">{{ emoji }}</div>
                            <h3 class="modal-title fw-bold mb-2">{{ title }}</h3>
                            <p class="mb-0 text-white-50">{{ subtitle }}</p>
                        </div>
                    </div>

                    <!-- Modal Content -->
                    <div class="modal-body p-5">
                        <!-- Score Display -->
                        <div class="card bg-primary bg-opacity-10 border-primary mb-4">
                            <div class="card-body text-center py-5">
                                <div class="text-muted small mb-2 fw-medium">
                                    {{ $t('your_score') }}
                                </div>
                                <div class="display-3 fw-bold text-primary mb-3">
                                    {{ score }} / {{ total }}
                                </div>
                                <div class="d-inline-flex align-items-center gap-2 bg-white rounded-pill px-4 py-2 shadow-sm">
                                    <svg width="20" height="20" class="text-warning" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                    <span class="fw-bold text-dark">
                                        {{ $t('correct_rate') }}: {{ percentage }}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="d-grid gap-3">
                            <slot name="actions">
                                <!-- Default actions -->
                                <button @click="$emit('restart')" class="btn btn-primary btn-lg">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                    </svg>
                                    {{ $t('try_again') }}
                                </button>
                                <button @click="$emit('close')" class="btn btn-secondary btn-lg">
                                    {{ $t('close') }}
                                </button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    score: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        default: $t('completed')
    },
    subtitle: {
        type: String,
        default: $t('exam_completed_message')
    },
    closeOnBackdrop: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close', 'restart']);

const percentage = computed(() => {
    if (props.total === 0) return 0;
    return Math.round((props.score / props.total) * 100);
});

const emoji = computed(() => {
    const percent = percentage.value;
    if (percent >= 90) return '🏆';
    if (percent >= 70) return '🎉';
    if (percent >= 50) return '👍';
    return '💪';
});

const handleBackdropClick = () => {
    if (props.closeOnBackdrop) {
        emit('close');
    }
};
</script>

<style scoped>
.result-modal .modal-dialog {
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

