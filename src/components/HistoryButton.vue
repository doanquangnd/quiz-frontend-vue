<template>
    <router-link :to="href" :class="buttonClass">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{{ label }}</span>
    </router-link>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    href: {
        type: String,
        required: true
    },
    variant: {
        type: String,
        default: 'outline-secondary'
    },
    size: {
        type: String,
        default: 'md'
    },
    label: {
        type: String,
        default: `${$t('view_history')}`
    }
});

const buttonClass = computed(() => {
    const classes = ['btn'];
    classes.push(`btn-${props.variant}`);
    if (props.size !== 'md') {
        classes.push(`btn-${props.size}`);
    }
    return classes.join(' ');
});
</script>

