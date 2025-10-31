<template>
    <div class="quiz-timer d-flex align-items-center gap-2">
        <svg
            class="timer-icon"
            :class="iconColorClass"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="timer-display fw-semibold" :class="textColorClass">
            {{ formattedTime }}
        </span>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    seconds: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        default: 'elapsed', // 'elapsed' or 'remaining'
        validator: (value) => ['elapsed', 'remaining'].includes(value)
    },
    warningThreshold: {
        type: Number,
        default: 300 // 5 minutes
    },
    dangerThreshold: {
        type: Number,
        default: 60 // 1 minute
    }
});

const formattedTime = computed(() => {
    const hours = Math.floor(props.seconds / 3600);
    const minutes = Math.floor((props.seconds % 3600) / 60);
    const secs = props.seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
});

const iconColorClass = computed(() => {
    if (props.mode === 'remaining') {
        if (props.seconds <= props.dangerThreshold) return 'text-danger';
        if (props.seconds <= props.warningThreshold) return 'text-warning';
    }
    return 'text-primary';
});

const textColorClass = computed(() => {
    if (props.mode === 'remaining') {
        if (props.seconds <= props.dangerThreshold) return 'text-danger';
        if (props.seconds <= props.warningThreshold) return 'text-warning';
    }
    return 'text-dark';
});
</script>

<style scoped>
.timer-icon {
    transition: color 0.3s ease;
}

.timer-display {
    font-variant-numeric: tabular-nums;
    min-width: 70px;
    text-align: right;
}

@media (max-width: 576px) {
    .timer-display {
        font-size: 0.9rem;
    }
}
</style>

