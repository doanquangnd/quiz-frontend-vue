<template>
    <div class="progress-bar-wrapper">
        <div v-if="showLabel" class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-muted small">{{ label }}</span>
            <span class="fw-semibold small text-dark">{{ displayPercentage }}%</span>
        </div>
        <div class="progress" :style="{ height: height + 'px' }">
            <div
                class="progress-bar"
                :class="barColorClass"
                role="progressbar"
                :style="{ width: displayPercentage + '%' }"
                :aria-valuenow="displayPercentage"
                aria-valuemin="0"
                aria-valuemax="100"
            >
                <span v-if="showInlineLabel && height >= 20" class="small px-2">
                    {{ current }} / {{ total }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    current: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    label: {
        type: String,
        default: `${$t('progress')}`
    },
    height: {
        type: Number,
        default: 12
    },
    showLabel: {
        type: Boolean,
        default: true
    },
    showInlineLabel: {
        type: Boolean,
        default: false
    },
    variant: {
        type: String,
        default: 'auto', // 'auto', 'primary', 'success', 'warning', 'danger', 'info'
        validator: (value) => ['auto', 'primary', 'success', 'warning', 'danger', 'info'].includes(value)
    }
});

const displayPercentage = computed(() => {
    if (props.total === 0) return 0;
    return Math.round((props.current / props.total) * 100);
});

const barColorClass = computed(() => {
    if (props.variant !== 'auto') {
        return `bg-${props.variant}`;
    }
    
    // Auto color based on percentage
    const percentage = displayPercentage.value;
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-info';
    if (percentage >= 40) return 'bg-warning';
    return 'bg-danger';
});
</script>

<style scoped>
.progress {
    border-radius: 6px;
    overflow: hidden;
    background-color: #e9ecef;
}

.progress-bar {
    transition: width 0.6s ease;
}
</style>

